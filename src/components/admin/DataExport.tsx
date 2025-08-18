import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Label } from '../ui/label';
import { Download, FileText, BarChart3, Calendar, Loader2 } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';

interface DataExportProps {
  language: 'en' | 'ta';
  isDark: boolean;
}

const DataExport: React.FC<DataExportProps> = ({ language, isDark }) => {
  const [exportType, setExportType] = useState('events');
  const [dateRange, setDateRange] = useState('all');
  const [format, setFormat] = useState('csv');
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  // Mock data for export (in real app, this would come from API)
  const getExportData = () => {
    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const thisYear = new Date(now.getFullYear(), 0, 1);

    let startDate: Date;
    switch (dateRange) {
      case 'this-month':
        startDate = thisMonth;
        break;
      case 'last-month':
        startDate = lastMonth;
        break;
      case 'this-year':
        startDate = thisYear;
        break;
      default:
        startDate = new Date(2020, 0, 1); // All time
    }

    // Generate sample data based on export type
    switch (exportType) {
      case 'events':
        return generateEventsData(startDate, now);
      case 'revenue':
        return generateRevenueData(startDate, now);
      case 'clients':
        return generateClientsData(startDate, now);
      default:
        return [];
    }
  };

  const generateEventsData = (startDate: Date, endDate: Date) => {
    const events = [];
    const eventTypes = ['Wedding', 'Corporate', 'Birthday', 'Anniversary', 'Conference'];
    const statuses = ['Completed', 'Upcoming', 'Cancelled', 'In Progress'];
    
    for (let i = 0; i <20; i++) {
      const eventDate = new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()));
      events.push({
        id: `EVT${String(i + 1).padStart(3, '0')}`,
        name: `${eventTypes[Math.floor(Math.random() * eventTypes.length)]} Event ${i + 1}`,
        date: eventDate.toISOString().split('T')[0],
        type: eventTypes[Math.floor(Math.random() * eventTypes.length)],
        status: statuses[Math.floor(Math.random() * statuses.length)],
        guests: Math.floor(Math.random() * 200) + 50,
        revenue: Math.floor(Math.random() * 50000) + 10000,
        client: `Client ${i + 1}`,
        venue: `Venue ${i + 1}`
      });
    }
    return events;
  };

  const generateRevenueData = (startDate: Date, endDate: Date) => {
    const revenue = [];
    const months = [];
    let currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
      months.push(new Date(currentDate));
      currentDate.setMonth(currentDate.getMonth() + 1);
    }
    
    months.forEach((month, index) => {
      revenue.push({
        month: month.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
        events: Math.floor(Math.random() * 15) + 5,
        revenue: Math.floor(Math.random() * 200000) + 50000,
        expenses: Math.floor(Math.random() * 100000) + 20000,
        profit: Math.floor(Math.random() * 100000) + 30000,
        avgTicketValue: Math.floor(Math.random() * 5000) + 2000
      });
    });
    return revenue;
  };

  const generateClientsData = (startDate: Date, endDate: Date) => {
    const clients = [];
    const clientTypes = ['Individual', 'Corporate', 'Government', 'Non-Profit'];
    
    for (let i = 0; i < 25; i++) {
      clients.push({
        id: `CLT${String(i + 1).padStart(3, '0')}`,
        name: `Client ${i + 1}`,
        type: clientTypes[Math.floor(Math.random() * clientTypes.length)],
        email: `client${i + 1}@example.com`,
        phone: `+1-555-${String(Math.floor(Math.random() * 900) + 100)}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
        totalEvents: Math.floor(Math.random() * 10) + 1,
        totalSpent: Math.floor(Math.random() * 100000) + 10000,
        lastEvent: new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime())).toISOString().split('T')[0],
        status: Math.random() > 0.2 ? 'Active' : 'Inactive'
      });
    }
    return clients;
  };

  const exportToCSV = (data: any[], filename: string) => {
    if (data.length === 0) return;
    
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header];
          // Escape commas and quotes in CSV
          if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}.csv`;
    link.click();
  };

  const exportToExcel = (data: any[], filename: string) => {
    if (data.length === 0) return;
    
    // For Excel, we'll create a CSV with .xlsx extension (simplified approach)
    // In production, you'd use a library like xlsx or exceljs
    exportToCSV(data, filename.replace('.xlsx', ''));
  };

  const exportToPDF = (data: any[], filename: string) => {
    if (data.length === 0) return;
    
    // For PDF, we'll create a simple HTML table and use browser print
    // In production, you'd use a library like jsPDF or puppeteer
    const table = document.createElement('table');
    table.style.borderCollapse = 'collapse';
    table.style.width = '100%';
    
    // Create header row
    const headers = Object.keys(data[0]);
    const headerRow = document.createElement('tr');
    headers.forEach(header => {
      const th = document.createElement('th');
      th.textContent = header;
      th.style.border = '1px solid black';
      th.style.padding = '8px';
      th.style.backgroundColor = '#f0f0f0';
      headerRow.appendChild(th);
    });
    table.appendChild(headerRow);
    
    // Create data rows
    data.forEach(row => {
      const dataRow = document.createElement('tr');
      headers.forEach(header => {
        const td = document.createElement('td');
        td.textContent = row[header];
        td.style.border = '1px solid black';
        td.style.padding = '8px';
        dataRow.appendChild(td);
      });
      table.appendChild(dataRow);
    });
    
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${filename}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              table { border-collapse: collapse; width: 100%; }
              th, td { border: 1px solid black; padding: 8px; text-align: left; }
              th { background-color: #f0f0f0; }
            </style>
          </head>
          <body>
            <h1>${filename}</h1>
            ${table.outerHTML}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      const data = getExportData();
      
      if (data.length === 0) {
        toast({
          title: language === 'en' ? 'No Data Available' : 'தரவு இல்லை',
          description: language === 'en' ? 'No data found for the selected criteria' : 'தேர்ந்தெடுக்கப்பட்ட அளவுகோல்களுக்கு தரவு எதுவும் கிடைக்கவில்லை',
          variant: 'destructive'
        });
        return;
      }

      const filename = `${exportType}_${dateRange}_${new Date().toISOString().split('T')[0]}`;
      
      switch (format) {
        case 'csv':
          exportToCSV(data, filename);
          break;
        case 'excel':
          exportToExcel(data, filename);
          break;
        case 'pdf':
          exportToPDF(data, filename);
          break;
      }

      toast({
        title: language === 'en' ? 'Export Successful' : 'ஏற்றுமதி வெற்றிகரமாக',
        description: language === 'en' 
          ? `${data.length} records exported to ${format.toUpperCase()}`
          : `${data.length} பதிவுகள் ${format.toUpperCase()} க்கு ஏற்றுமதி செய்யப்பட்டன`,
      });

    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: language === 'en' ? 'Export Failed' : 'ஏற்றுமதி தோல்வி',
        description: language === 'en' ? 'An error occurred during export' : 'ஏற்றுமதி செய்யும் போது பிழை ஏற்பட்டது',
        variant: 'destructive'
      });
    } finally {
      setIsExporting(false);
    }
  };

  const exportOptions = [
    { value: 'events', label: language === 'en' ? 'Events Data' : 'நிகழ்வுகள் தரவு', icon: Calendar },
    { value: 'revenue', label: language === 'en' ? 'Revenue Reports' : 'வருவாய் அறிக்கைகள்', icon: BarChart3 },
    { value: 'clients', label: language === 'en' ? 'Client Information' : 'வாடிக்கையாளர் தகவல்', icon: FileText }
  ];

  const dateRanges = [
    { value: 'all', label: language === 'en' ? 'All Time' : 'அனைத்து நேரமும்' },
    { value: 'this-month', label: language === 'en' ? 'This Month' : 'இந்த மாதம்' },
    { value: 'last-month', label: language === 'en' ? 'Last Month' : 'கடந்த மாதம்' },
    { value: 'this-year', label: language === 'en' ? 'This Year' : 'இந்த ஆண்டு' }
  ];

  const formats = [
    { value: 'csv', label: 'CSV' },
    { value: 'excel', label: 'Excel' },
    { value: 'pdf', label: 'PDF' }
  ];

  return (
    <Card className="card-chapa rounded-none shadow-subtle">
      <CardHeader>
        <CardTitle className={`text-xl font-display font-semibold ${
          isDark ? 'text-white' : 'text-chapa-charcoal'
        }`}>
          {language === 'en' ? 'Export Data' : 'தரவை ஏற்றுமதி செய்'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Export Type Selection */}
          <div>
            <Label className={isDark ? 'text-white' : 'text-chapa-charcoal'}>
              {language === 'en' ? 'Select Data Type' : 'தரவு வகையைத் தேர்ந்தெடுக்கவும்'}
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-2">
              {exportOptions.map((option) => {
                const IconComponent = option.icon;
                return (
                  <div
                    key={option.value}
                    className={`p-3 border-2 rounded-none cursor-pointer transition-all ${
                      exportType === option.value
                        ? 'border-chapa-charcoal bg-chapa-light-gray'
                        : 'border-gray-200 hover:border-chapa-medium-gray'
                    }`}
                    onClick={() => setExportType(option.value)}
                  >
                    <div className="flex items-center space-x-2">
                      <IconComponent className="w-5 h-5 text-chapa-charcoal" />
                      <span className={`text-sm font-medium ${
                        isDark ? 'text-white' : 'text-chapa-charcoal'
                      }`}>
                        {option.label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Date Range and Format */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="dateRange" className={isDark ? 'text-white' : 'text-chapa-charcoal'}>
                {language === 'en' ? 'Date Range' : 'தேதி வரம்பு'}
              </Label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {dateRanges.map((range) => (
                    <SelectItem key={range.value} value={range.value}>
                      {range.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="format" className={isDark ? 'text-white' : 'text-chapa-charcoal'}>
                {language === 'en' ? 'Export Format' : 'ஏற்றுமதி வடிவம்'}
              </Label>
              <Select value={format} onValueChange={setFormat}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {formats.map((fmt) => (
                    <SelectItem key={fmt.value} value={fmt.value}>
                      {fmt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Export Button */}
          <div className="flex justify-center">
            <Button 
              onClick={handleExport}
              className="btn-chapa-primary px-8 py-3"
              size="lg"
              disabled={isExporting}
            >
              {isExporting ? (
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              ) : (
                <Download className="w-5 h-5 mr-2" />
              )}
              {isExporting ? 'Exporting...' : language === 'en' ? 'Export Data' : 'தரவை ஏற்றுமதி செய்'}
            </Button>
          </div>

          {/* Export Info */}
          <div className={`text-center text-sm ${
            isDark ? 'text-white/60' : 'text-chapa-medium-gray'
          }`}>
            <p>
              {language === 'en' 
                ? 'Exported data will include all selected information in the chosen format'
                : 'ஏற்றுமதி செய்யப்பட்ட தரவு தேர்ந்தெடுக்கப்பட்ட அனைத்து தகவல்களையும் தேர்ந்தெடுக்கப்பட்ட வடிவத்தில் உள்ளடக்கும்'
              }
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DataExport;
