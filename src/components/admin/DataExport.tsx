import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Label } from '../ui/label';
import { Download, FileText, BarChart3, Calendar } from 'lucide-react';

interface DataExportProps {
  language: 'en' | 'ta';
  isDark: boolean;
}

const DataExport: React.FC<DataExportProps> = ({ language, isDark }) => {
  const [exportType, setExportType] = useState('events');
  const [dateRange, setDateRange] = useState('all');
  const [format, setFormat] = useState('csv');

  const handleExport = () => {
    // TODO: Implement actual export functionality
    console.log('Exporting:', { exportType, dateRange, format });
    
    // Simulate export process
    setTimeout(() => {
      alert(language === 'en' ? 'Export completed!' : 'ஏற்றுமதி முடிந்தது!');
    }, 1000);
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
            >
              <Download className="w-5 h-5 mr-2" />
              {language === 'en' ? 'Export Data' : 'தரவை ஏற்றுமதி செய்'}
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
