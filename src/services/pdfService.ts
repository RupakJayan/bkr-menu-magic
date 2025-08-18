import jsPDF from 'jspdf';
import { EventPlan } from '../types/eventTypes';
import { getMenuItemById } from './menuService';

export class PDFService {
  static async generateEventPDF(eventPlan: EventPlan, language: 'en' | 'ta'): Promise<void> {
    try {
      const doc = new jsPDF();
      
      // Add logo and header
      this.addLogo(doc);
      this.addHeader(doc, language);
      
      // Add event details
      this.addEventDetails(doc, eventPlan, language);
      
      // Add menu content
      this.addMenuContent(doc, eventPlan, language);
      
      // Add footer
      this.addFooter(doc, language);
      
      // Save the PDF
      const fileName = `BKR-Catering-Event-${eventPlan.clientDetails.name}-${language === 'en' ? 'EN' : 'TA'}-${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(fileName);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw new Error(language === 'en' ? 'Error generating PDF' : 'PDF உருவாக்குவதில் பிழை');
    }
  }

  private static addLogo(doc: jsPDF): void {
    // Add BKR logo or text
    doc.setFontSize(24);
    doc.setTextColor(0, 0, 0);
    doc.text('BKR Catering', 105, 20, { align: 'center' });
    
    // Add decorative line
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.5);
    doc.line(20, 25, 190, 25);
  }

  private static addHeader(doc: jsPDF, language: 'en' | 'ta'): void {
    doc.setFontSize(18);
    doc.setTextColor(0, 0, 0);
    const headerText = language === 'en' ? 'Event Menu' : 'நிகழ்வு மெனு';
    doc.text(headerText, 105, 40, { align: 'center' });
  }

  private static addEventDetails(doc: jsPDF, eventPlan: EventPlan, language: 'en' | 'ta'): void {
    let yPosition = 55;
    
    // Client Information
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text(language === 'en' ? 'Client Information' : 'வாடிக்கையாளர் தகவல்', 20, yPosition);
    yPosition += 10;
    
    doc.setFontSize(12);
    doc.text(`${language === 'en' ? 'Name' : 'பெயர்'}: ${eventPlan.clientDetails.name}`, 20, yPosition);
    yPosition += 7;
    doc.text(`${language === 'en' ? 'Phone' : 'தொலைபேசி'}: ${eventPlan.clientDetails.phone}`, 20, yPosition);
    yPosition += 15;
    
    // Venue Information
    doc.setFontSize(14);
    doc.text(language === 'en' ? 'Venue Information' : 'இட தகவல்', 20, yPosition);
    yPosition += 10;
    
    doc.setFontSize(12);
    doc.text(`${language === 'en' ? 'Venue' : 'இடம்'}: ${eventPlan.venueDetails.name}`, 20, yPosition);
    yPosition += 7;
    doc.text(`${language === 'en' ? 'Address' : 'முகவரி'}: ${eventPlan.venueDetails.address}`, 20, yPosition);
    yPosition += 15;
    
    // Event Dates
    doc.setFontSize(14);
    doc.text(language === 'en' ? 'Event Details' : 'நிகழ்வு விவரங்கள்', 20, yPosition);
    yPosition += 10;
    
    doc.setFontSize(12);
    doc.text(`${language === 'en' ? 'Start Date' : 'தொடக்க தேதி'}: ${eventPlan.eventDates.startDate}`, 20, yPosition);
    yPosition += 7;
    doc.text(`${language === 'en' ? 'End Date' : 'முடிவு தேதி'}: ${eventPlan.eventDates.endDate}`, 20, yPosition);
    yPosition += 7;
    doc.text(`${language === 'en' ? 'Duration' : 'காலம்'}: ${eventPlan.eventDates.numberOfDays} ${language === 'en' ? 'days' : 'நாட்கள்'}`, 20, yPosition);
    yPosition += 20;
  }

  private static addMenuContent(doc: jsPDF, eventPlan: EventPlan, language: 'en' | 'ta'): void {
    let yPosition = 140;
    
    eventPlan.days.forEach((day, dayIndex) => {
      // Check if we need a new page
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }
      
      // Day header
      doc.setFontSize(16);
      doc.setTextColor(0, 0, 0);
      doc.text(`${language === 'en' ? 'DAY' : 'நாள்'} ${day.dayNumber} - ${day.date}`, 20, yPosition);
      yPosition += 10;
      
      // Add decorative line under day header
      doc.setDrawColor(0, 0, 0);
      doc.setLineWidth(0.3);
      doc.line(20, yPosition, 190, yPosition);
      yPosition += 15;
      
      day.sessions.forEach((session, sessionIndex) => {
        // Check if we need a new page
        if (yPosition > 250) {
          doc.addPage();
          yPosition = 20;
        }
        
        // Session header
        doc.setFontSize(14);
        doc.setTextColor(0, 0, 0);
        doc.text(`${language === 'en' ? session.sessionName : session.sessionNameTa}`, 20, yPosition);
        yPosition += 8;
        
        // Session details
        doc.setFontSize(12);
        doc.setTextColor(100, 100, 100);
        doc.text(`${language === 'en' ? 'Time' : 'நேரம்'}: ${session.timeRange.startTime} - ${session.timeRange.endTime}`, 25, yPosition);
        yPosition += 6;
        doc.text(`${language === 'en' ? 'Headcount' : 'தலை எண்ணிக்கை'}: ${session.headCount}`, 25, yPosition);
        yPosition += 10;
        
        // Menu items
        if (session.selectedItems.length > 0) {
          doc.setFontSize(12);
          doc.setTextColor(0, 0, 0);
          doc.text(`${language === 'en' ? 'Selected Menu Items' : 'தேர்ந்தெடுக்கப்பட்ட மெனு பொருட்கள்'}:`, 25, yPosition);
          yPosition += 8;
          
          session.selectedItems.forEach((itemId) => {
            const menuItem = getMenuItemById(itemId);
            if (menuItem) {
              const itemName = language === 'en' ? menuItem.name_en : menuItem.name_ta;
              const itemNameEn = language === 'en' ? '' : ` (${menuItem.name_en})`;
              
              // Check if we need a new page
              if (yPosition > 250) {
                doc.addPage();
                yPosition = 20;
              }
              
              doc.setFontSize(10);
              doc.text(`• ${itemName}${itemNameEn}`, 30, yPosition);
              yPosition += 5;
            }
          });
        }
        
        yPosition += 10;
        
        // Add separator line between sessions
        if (sessionIndex < day.sessions.length - 1) {
          doc.setDrawColor(200, 200, 200);
          doc.setLineWidth(0.1);
          doc.line(25, yPosition, 185, yPosition);
          yPosition += 5;
        }
      });
      
      yPosition += 15;
      
      // Add separator line between days
      if (dayIndex < eventPlan.days.length - 1) {
        doc.setDrawColor(0, 0, 0);
        doc.setLineWidth(0.5);
        doc.line(20, yPosition, 190, yPosition);
        yPosition += 10;
      }
    });

    // Add billing summary if available
    if (yPosition > 200) {
      doc.addPage();
      yPosition = 20;
    }
    
    // Billing Summary Section
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text(`${language === 'en' ? 'Billing Summary' : 'பில்லிங் சுருக்கம்'}`, 20, yPosition);
    yPosition += 15;
    
    // Add billing table header
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`${language === 'en' ? 'Session' : 'அமர்வு'}`, 20, yPosition);
    doc.text(`${language === 'en' ? 'Headcount' : 'தலை எண்ணிக்கை'}`, 80, yPosition);
    doc.text(`${language === 'en' ? 'Items Cost' : 'பொருட்கள் செலவு'}`, 130, yPosition);
    doc.text(`${language === 'en' ? 'Total' : 'மொத்தம்'}`, 170, yPosition);
    yPosition += 10;
    
    // Add billing data
    let totalCost = 0;
    eventPlan.days.forEach(day => {
      day.sessions.forEach(session => {
        const itemCost = session.selectedItems.length * 50 * session.headCount; // Estimated cost
        totalCost += itemCost;
        
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text(session.sessionName, 20, yPosition);
        doc.text(session.headCount.toString(), 80, yPosition);
        doc.text(`₹${itemCost.toLocaleString()}`, 130, yPosition);
        doc.text(`₹${itemCost.toLocaleString()}`, 170, yPosition);
        yPosition += 8;
      });
    });
    
    // Add total
    yPosition += 5;
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.3);
    doc.line(20, yPosition, 190, yPosition);
    yPosition += 10;
    
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`${language === 'en' ? 'Total Cost' : 'மொத்த செலவு'}: ₹${totalCost.toLocaleString()}`, 130, yPosition);
  }

  private static addFooter(doc: jsPDF, language: 'en' | 'ta'): void {
    const pageCount = doc.getNumberOfPages();
    
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      
      // Footer line
      doc.setDrawColor(0, 0, 0);
      doc.setLineWidth(0.3);
      doc.line(20, 280, 190, 280);
      
      // Footer text
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(`BKR Catering - ${language === 'en' ? 'Professional Event Catering Services' : 'தொழில்முறை நிகழ்வு கேட்டரிங் சேவைகள்'}`, 105, 290, { align: 'center' });
      doc.text(`Page ${i} of ${pageCount}`, 105, 295, { align: 'center' });
    }
  }
}
