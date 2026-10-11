import jsPDF from 'jspdf';
import { EventMenu } from '@/types/menu';
import { findDishByKey } from '@/services/menuCatalogService';
import type { CatalogDish } from '@/types/menu';
import { formatISTDate, getISTDateString } from '@/utils/istDate';
import { getTamilSolarDate } from '@/utils/tamilDate';

export const generateEventMenuPDF = (menu: EventMenu, language: 'en' | 'ta' = 'en'): void => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });
  
  let yPosition = 15;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - 2 * margin;
  
  // Title - BKR Catering - Event Menu
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(220, 38, 38); // Red color
  doc.text('BKR Catering - Event Menu', margin, yPosition);
  yPosition += 12;
  
  // Horizontal line
  doc.setDrawColor(220, 38, 38);
  doc.setLineWidth(0.5);
  doc.line(margin, yPosition, pageWidth - margin, yPosition);
  yPosition += 10;
  
  // Event Information Section
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('Event Information', margin, yPosition);
  yPosition += 8;
  
  // Event details in table format
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  
  const eventInfo = [
    ['Client:', menu.clientDetails.name],
    ['Phone:', menu.clientDetails.phone],
    ['Venue:', menu.venueDetails.name],
    ['Address:', menu.venueDetails.address],
    ['Event Duration:', `${formatISTDate(menu.startDate, language === 'ta' ? 'ta-IN' : 'en-IN', { dateStyle: 'medium' })} - ${formatISTDate(menu.endDate, language === 'ta' ? 'ta-IN' : 'en-IN', { dateStyle: 'medium' })} (${menu.numberOfDays} ${language === 'ta' ? 'நாட்கள்' : 'days'})`],
    ['Tamil Date & Day:', getTamilSolarDate(menu.startDate) || menu.tamilDate || ''],
  ];
  
  if (menu.venueDetails.googleMapsUrl) {
    eventInfo.push(['Maps:', menu.venueDetails.googleMapsUrl]);
  }
  
  eventInfo.forEach(([label, value]) => {
    doc.setFont('helvetica', 'bold');
    doc.text(label, margin, yPosition);
    doc.setFont('helvetica', 'normal');
    
    const labelWidth = doc.getTextWidth(label);
    const maxWidth = contentWidth - labelWidth - 5;
    const lines = doc.splitTextToSize(value, maxWidth);
    
    lines.forEach((line: string, index: number) => {
      doc.text(line, margin + labelWidth + 3, yPosition + (index * 5));
    });
    
    yPosition += Math.max(6, lines.length * 5);
  });
  
  yPosition += 8;
  
  // Day-wise Sessions
  menu.days.forEach((day) => {
    // Check if we need a new page
    if (yPosition > pageHeight - 60) {
      doc.addPage();
      yPosition = 20;
    }
    
    // Day Header with background
    doc.setFillColor(236, 72, 153); // Pink
    doc.rect(margin, yPosition, contentWidth, 8, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    
    const dayText = `Day ${day.dayNumber} - ${formatISTDate(day.date, 'en-IN', { weekday: 'long', month: 'long', day: 'numeric' })}`;
    doc.text(dayText, margin + 2, yPosition + 5.5);
    yPosition += 12;
    
    // Sessions
    day.sessions.forEach((session) => {
      // Check if we need a new page
      if (yPosition > pageHeight - 50) {
        doc.addPage();
        yPosition = 20;
      }
      
      // Session Header
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 0, 0);
      
      const sessionHeader = `${session.name} (${session.startTime} - ${session.endTime})`;
      doc.text(sessionHeader, margin, yPosition);
      yPosition += 6;
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 100, 100);
      doc.text(`Head Count: ${session.headCount}`, margin, yPosition);
      yPosition += 7;
      
      // Selected Dishes
      if (session.selectedDishes.length > 0) {
        const dishesByCategory: Record<string, CatalogDish[]> = {};
        
        [...new Set(session.selectedDishes)].forEach(dishKey => {
          const dish = findDishByKey(dishKey);
          if (dish) {
            if (!dishesByCategory[dish.category]) {
              dishesByCategory[dish.category] = [];
            }
            dishesByCategory[dish.category].push(dish);
          }
        });
        
        Object.entries(dishesByCategory).forEach(([category, dishes]) => {
          // Category name
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(10);
          doc.setTextColor(0, 0, 0);
          doc.text(category, margin + 2, yPosition);
          yPosition += 5;
          
          // Dishes
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(9);
          doc.setTextColor(60, 60, 60);
          
          dishes.forEach(dish => {
            if (yPosition > pageHeight - 15) {
              doc.addPage();
              yPosition = 20;
            }
            
            // Create dish text based on language
            let dishText = '';
            if (language === 'ta') {
              // For Tamil PDF: Tamil name • English name
              dishText = `• ${dish.name_ta}`;
              if (dish.name_en) {
                dishText += ` • ${dish.name_en}`;
              }
            } else {
              // For English PDF: English name • Tamil name
              dishText = `• ${dish.name_en || dish.name}`;
              if (dish.name_ta) {
                dishText += ` • ${dish.name_ta}`;
              }
            }
            
            // Handle text wrapping
            const maxWidth = contentWidth - 8;
            const lines = doc.splitTextToSize(dishText, maxWidth);
            
            lines.forEach((line: string) => {
              if (yPosition > pageHeight - 15) {
                doc.addPage();
                yPosition = 20;
              }
              doc.text(line, margin + 5, yPosition);
              yPosition += 4.5;
            });
          });
          
          yPosition += 2;
        });
      } else {
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(9);
        doc.setTextColor(150, 150, 150);
        doc.text('No dishes selected', margin + 5, yPosition);
        yPosition += 5;
      }
      
      yPosition += 5;
    });
    
    yPosition += 3;
  });
  
  // Footer on all pages
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Generated on ${formatISTDate(getISTDateString(), 'en-IN', { dateStyle: 'medium' })}`,
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    );
  }
  
  // Save PDF
  const langSuffix = language === 'ta' ? '_Tamil' : '_English';
  const fileName = `BKR_Event_Menu_${menu.clientDetails.name.replace(/\s+/g, '_')}${langSuffix}.pdf`;
  doc.save(fileName);
};
