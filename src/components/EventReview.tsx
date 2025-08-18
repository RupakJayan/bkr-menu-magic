import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  ArrowLeft,
  Download,
  FileText,
  FileDown,
  CheckCircle,
  Clock,
  Users,
  MapPin,
  Calendar,
  User,
  DollarSign,
  Calculator,
  Edit,
  Save,
  X,
  Receipt,
  CreditCard,
  Banknote
} from 'lucide-react';
import { EventPlanningData, SessionMenuSelection, BillingItem, EventBilling } from '../types/eventTypes';
import { PDFService } from '../services/pdfService';
import { DOCXService } from '../services/docxService';
import { useTheme } from '@/contexts/ThemeContext';

interface EventReviewProps {
  eventData: EventPlanningData;
  sessions: SessionMenuSelection[];
  onBack: () => void;
  language: 'en' | 'ta';
}

const EventReview: React.FC<EventReviewProps> = ({ 
  eventData, 
  sessions, 
  onBack, 
  language 
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedFiles, setGeneratedFiles] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('summary');
  const [editingBilling, setEditingBilling] = useState<string | null>(null);
  const [billingData, setBillingData] = useState<EventBilling | null>(null);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  // Safely calculate totals with null checks
  const totalHeadCount = sessions?.reduce((sum, session) => sum + (session?.headCount || 0), 0) || 0;
  const totalSessions = sessions?.length || 0;

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleDateString(language === 'en' ? 'en-US' : 'ta-IN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  };

  const groupSessionsByDay = () => {
    if (!sessions) return {};
    
    const grouped: { [key: number]: SessionMenuSelection[] } = {};
    sessions.forEach(session => {
      if (session?.sessionId) {
        const dayNumber = parseInt(session.sessionId.split('_')[0].replace('day', ''));
        if (!isNaN(dayNumber)) {
          if (!grouped[dayNumber]) {
            grouped[dayNumber] = [];
          }
          grouped[dayNumber].push(session);
        }
      }
    });
    return grouped;
  };

  // Initialize billing data
  const initializeBilling = () => {
    if (!sessions || !eventData) return;

    const billingItems: BillingItem[] = sessions.map(session => {
      const itemCosts = session.selectedItems.map(item => ({
        itemId: item.id,
        itemName: language === 'en' ? item.name_en : item.name_ta,
        quantity: session.headCount,
        unitCost: item.estimatedCost || 50,
        totalCost: (item.estimatedCost || 50) * session.headCount
      }));

      const subtotal = itemCosts.reduce((sum, item) => sum + item.totalCost, 0);
      const serviceStaffCost = (session.serviceStaff || 0) * 150 * 4; // 4 hours per session
      const total = subtotal + serviceStaffCost;

      return {
        sessionId: session.sessionId,
        sessionName: language === 'en' ? session.sessionName : session.sessionNameTa,
        headCount: session.headCount,
        items: itemCosts,
        serviceStaffCost,
        subtotal,
        tax: subtotal * 0.18, // 18% GST
        total
      };
    });

    const subtotal = billingItems.reduce((sum, item) => sum + item.subtotal, 0);
    const totalTax = billingItems.reduce((sum, item) => sum + item.tax, 0);
    const grandTotal = subtotal + totalTax;

    const billing: EventBilling = {
      eventId: `EVT-${Date.now()}`,
      clientName: eventData.clientName,
      eventDate: eventData.startDate,
      totalSessions,
      totalHeadCount,
      billingItems,
      subtotal,
      tax: totalTax,
      discount: 0,
      grandTotal,
      paymentTerms: eventData.paymentTerms || '50% advance, 50% on completion',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 7 days from now
    };

    setBillingData(billing);
  };

  const handleBillingEdit = (sessionId: string) => {
    setEditingBilling(sessionId);
  };

  const handleBillingSave = (sessionId: string, updatedData: Partial<BillingItem>) => {
    if (!billingData) return;

    setBillingData(prev => {
      if (!prev) return prev;
      
      const updatedBillingItems = prev.billingItems.map(item => 
        item.sessionId === sessionId ? { ...item, ...updatedData } : item
      );

      const subtotal = updatedBillingItems.reduce((sum, item) => sum + item.subtotal, 0);
      const totalTax = updatedBillingItems.reduce((sum, item) => sum + item.tax, 0);
      const grandTotal = subtotal + totalTax;

      return {
        ...prev,
        billingItems: updatedBillingItems,
        subtotal,
        tax: totalTax,
        grandTotal
      };
    });

    setEditingBilling(null);
  };

  const generateDocuments = async () => {
    if (!eventData || !sessions) {
      console.error('Missing event data or sessions');
      return;
    }

    setIsGenerating(true);
    try {
      // Convert data to EventPlan format for PDF service
      const eventPlan = {
        clientDetails: {
          name: eventData.clientName || '',
          phone: eventData.phoneNumber || ''
        },
        venueDetails: {
          name: eventData.venue || '',
          address: eventData.venue || '',
          coordinates: eventData.venueCoordinates
        },
        eventDates: {
          startDate: eventData.startDate || '',
          endDate: eventData.endDate || '',
          numberOfDays: eventData.numberOfDays || 1
        },
        days: Object.entries(groupSessionsByDay()).map(([dayNum, daySessions]) => ({
          date: formatDate(eventData.startDate),
          dayNumber: parseInt(dayNum),
          sessions: daySessions.map(session => ({
            id: session.sessionId,
            sessionName: session.sessionName,
            sessionNameTa: session.sessionNameTa,
            sessionType: 'custom' as const,
            timeRange: session.timeWindow,
            headCount: session.headCount,
            selectedItems: session.selectedItems.map(item => item.id),
            notes: session.notes || ''
          }))
        })),
        totalHeadCount,
        totalSessions,
        status: 'draft' as const
      };

      const generatedFiles: string[] = [];

      // Generate English PDF
      try {
        await PDFService.generateEventPDF(eventPlan, 'en');
        generatedFiles.push('English PDF');
      } catch (error) {
        console.error('Error generating English PDF:', error);
      }

      // Generate Tamil PDF
      try {
        await PDFService.generateEventPDF(eventPlan, 'ta');
        generatedFiles.push('Tamil PDF');
      } catch (error) {
        console.error('Error generating Tamil PDF:', error);
      }

      // Generate English DOCX
      try {
        await DOCXService.generateEventDOCX(eventPlan, 'en');
        generatedFiles.push('English DOCX');
      } catch (error) {
        console.error('Error generating English DOCX:', error);
      }

      // Generate Tamil DOCX
      try {
        await DOCXService.generateEventDOCX(eventPlan, 'ta');
        generatedFiles.push('Tamil DOCX');
      } catch (error) {
        console.error('Error generating Tamil DOCX:', error);
      }

      setGeneratedFiles(generatedFiles);
    } catch (error) {
      console.error('Error generating documents:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Initialize billing on component mount
  React.useEffect(() => {
    if (sessions && eventData && !billingData) {
      initializeBilling();
    }
  }, [sessions, eventData]);

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'} py-8`}>
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>
            {language === 'en' ? 'Event Review & Billing' : 'நிகழ்வு மதிப்பாய்வு & பில்லிங்'}
          </h1>
          <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            {language === 'en' 
              ? 'Review your event details, generate documents, and manage billing' 
              : 'உங்கள் நிகழ்வு விவரங்களை மதிப்பாய்வு செய்து, ஆவணங்களை உருவாக்கி, பில்லிங்கை நிர்வகிக்கவும்'
            }
          </p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="summary">
              <User className="w-4 h-4 mr-2" />
              {language === 'en' ? 'Summary' : 'சுருக்கம்'}
            </TabsTrigger>
            <TabsTrigger value="sessions">
              <Clock className="w-4 h-4 mr-2" />
              {language === 'en' ? 'Sessions' : 'அமர்வுகள்'}
            </TabsTrigger>
            <TabsTrigger value="billing">
              <Receipt className="w-4 h-4 mr-2" />
              {language === 'en' ? 'Billing' : 'பில்லிங்'}
            </TabsTrigger>
            <TabsTrigger value="documents">
              <FileText className="w-4 h-4 mr-2" />
              {language === 'en' ? 'Documents' : 'ஆவணங்கள்'}
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Summary Tab */}
        <TabsContent value="summary" className="space-y-6">
          {/* Event Summary */}
          <Card className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <CardHeader>
              <CardTitle className={`${isDark ? 'text-white' : 'text-gray-900'}`}>
                {language === 'en' ? 'Event Summary' : 'நிகழ்வு சுருக்கம்'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className={`text-center p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-blue-50'}`}>
                  <User className={`h-8 w-8 mx-auto mb-2 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                  <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {eventData.clientName}
                  </div>
                  <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {language === 'en' ? 'Client' : 'வாடிக்கையாளர்'}
                  </div>
                </div>

                <div className={`text-center p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-green-50'}`}>
                  <MapPin className={`h-8 w-8 mx-auto mb-2 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
                  <div className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {eventData.venue}
                  </div>
                  <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {language === 'en' ? 'Venue' : 'இடம்'}
                  </div>
                </div>

                <div className={`text-center p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-purple-50'}`}>
                  <Calendar className={`h-8 w-8 mx-auto mb-2 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
                  <div className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {eventData.numberOfDays}
                  </div>
                  <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {language === 'en' ? 'Days' : 'நாட்கள்'}
                  </div>
                </div>

                <div className={`text-center p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-orange-50'}`}>
                  <Users className={`h-8 w-8 mx-auto mb-2 ${isDark ? 'text-orange-400' : 'text-orange-600'}`} />
                  <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {totalHeadCount}
                  </div>
                  <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {language === 'en' ? 'Total Guests' : 'மொத்த விருந்தினர்கள்'}
                  </div>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className={`font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                    {language === 'en' ? 'Start Date' : 'தொடக்க தேதி'}
                  </div>
                  <div className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    {formatDate(eventData.startDate)}
                  </div>
                </div>
                <div>
                  <div className={`font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                    {language === 'en' ? 'End Date' : 'முடிவு தேதி'}
                  </div>
                  <div className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    {formatDate(eventData.endDate)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sessions Tab */}
        <TabsContent value="sessions" className="space-y-6">
          {/* Sessions Summary */}
          <Card className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <CardHeader>
              <CardTitle className={`${isDark ? 'text-white' : 'text-gray-900'}`}>
                {language === 'en' ? 'Sessions Summary' : 'அமர்வுகள் சுருக்கம்'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {Object.entries(groupSessionsByDay()).map(([dayNum, daySessions]) => (
                <div key={dayNum} className="mb-6 last:mb-0">
                  <h3 className={`text-lg font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {language === 'en' ? `Day ${dayNum}` : `நாள் ${dayNum}`}
                  </h3>
                  <div className="space-y-3">
                    {daySessions.map((session) => (
                      <div
                        key={session.sessionId}
                        className={`p-4 rounded-lg border ${isDark ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-gray-50'}`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {language === 'en' ? session.sessionName : session.sessionNameTa}
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className={`flex items-center space-x-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                              <Clock className="h-4 w-4" />
                              <span className="text-sm">
                                {session.timeWindow.startTime} - {session.timeWindow.endTime}
                              </span>
                            </div>
                            <div className={`flex items-center space-x-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                              <Users className="h-4 w-4" />
                              <span className="text-sm">{session.headCount}</span>
                            </div>
                          </div>
                        </div>
                        
                        {session.selectedItems.length > 0 && (
                          <div className="mt-3">
                            <div className={`text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                              {language === 'en' ? 'Selected Items' : 'தேர்ந்தெடுக்கப்பட்ட பொருட்கள்'}
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {session.selectedItems.map((item) => (
                                <Badge key={item.id} variant="secondary" className={isDark ? 'bg-gray-600 text-gray-200' : 'bg-gray-200 text-gray-700'}>
                                  {language === 'en' ? item.name_en : item.name_ta}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Billing Tab */}
        <TabsContent value="billing" className="space-y-6">
          {billingData ? (
            <>
              {/* Billing Summary */}
              <Card className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                <CardHeader>
                  <CardTitle className={`${isDark ? 'text-white' : 'text-gray-900'} flex items-center gap-2`}>
                    <Receipt className="h-5 w-5" />
                    {language === 'en' ? 'Billing Summary' : 'பில்லிங் சுருக்கம்'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className={`text-center p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-blue-50'}`}>
                      <div className={`text-2xl font-bold ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                        ₹{billingData.subtotal.toLocaleString()}
                      </div>
                      <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {language === 'en' ? 'Subtotal' : 'கூட்டுத்தொகை'}
                      </div>
                    </div>
                    <div className={`text-center p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-green-50'}`}>
                      <div className={`text-2xl font-bold ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                        ₹{billingData.tax.toLocaleString()}
                      </div>
                      <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {language === 'en' ? 'Tax (18%)' : 'வரி (18%)'}
                      </div>
                    </div>
                    <div className={`text-center p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-purple-50'}`}>
                      <div className={`text-2xl font-bold ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>
                        ₹{billingData.discount.toLocaleString()}
                      </div>
                      <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {language === 'en' ? 'Discount' : 'தள்ளுபடி'}
                      </div>
                    </div>
                    <div className={`text-center p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-orange-50'}`}>
                      <div className={`text-2xl font-bold ${isDark ? 'text-orange-400' : 'text-orange-600'}`}>
                        ₹{billingData.grandTotal.toLocaleString()}
                      </div>
                      <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {language === 'en' ? 'Grand Total' : 'மொத்த தொகை'}
                      </div>
                    </div>
                  </div>

                  {/* Payment Terms */}
                  <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <div className={`font-medium mb-2 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                      {language === 'en' ? 'Payment Terms' : 'பணம் செலுத்தும் விதிமுறைகள்'}
                    </div>
                    <div className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      {billingData.paymentTerms}
                    </div>
                    <div className={`text-sm mt-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      {language === 'en' ? 'Due Date' : 'காலக்கெடு'}: {billingData.dueDate}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Detailed Billing Table */}
              <Card className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                <CardHeader>
                  <CardTitle className={`${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {language === 'en' ? 'Detailed Billing' : 'விரிவான பில்லிங்'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{language === 'en' ? 'Session' : 'அமர்வு'}</TableHead>
                        <TableHead>{language === 'en' ? 'Headcount' : 'தலை எண்ணிக்கை'}</TableHead>
                        <TableHead>{language === 'en' ? 'Items Cost' : 'பொருட்கள் செலவு'}</TableHead>
                        <TableHead>{language === 'en' ? 'Staff Cost' : 'ஊழியர் செலவு'}</TableHead>
                        <TableHead>{language === 'en' ? 'Tax' : 'வரி'}</TableHead>
                        <TableHead>{language === 'en' ? 'Total' : 'மொத்தம்'}</TableHead>
                        <TableHead>{language === 'en' ? 'Actions' : 'செயல்கள்'}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {billingData.billingItems.map((item) => (
                        <TableRow key={item.sessionId}>
                          <TableCell className="font-medium">
                            {item.sessionName}
                          </TableCell>
                          <TableCell>{item.headCount}</TableCell>
                          <TableCell>₹{item.subtotal.toLocaleString()}</TableCell>
                          <TableCell>₹{item.serviceStaffCost.toLocaleString()}</TableCell>
                          <TableCell>₹{item.tax.toLocaleString()}</TableCell>
                          <TableCell className="font-bold">₹{item.total.toLocaleString()}</TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleBillingEdit(item.sessionId)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <CardContent className="p-8 text-center">
                <Calculator className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  {language === 'en' ? 'Loading billing information...' : 'பில்லிங் தகவல்கள் ஏற்றப்படுகின்றன...'}
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents" className="space-y-6">
          {/* Document Generation */}
          <Card className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <CardHeader>
              <CardTitle className={`${isDark ? 'text-white' : 'text-gray-900'}`}>
                {language === 'en' ? 'Generate Documents' : 'ஆவணங்களை உருவாக்கவும்'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-blue-50'}`}>
                  <div className={`font-medium ${isDark ? 'text-blue-300' : 'text-blue-700'}`}>
                    {language === 'en' ? 'Available Formats' : 'கிடைக்கும் வடிவங்கள்'}
                  </div>
                  <div className={`text-sm mt-1 ${isDark ? 'text-blue-200' : 'text-blue-600'}`}>
                    {language === 'en' 
                      ? 'PDF and DOCX files will be generated in both English and Tamil languages'
                      : 'PDF மற்றும் DOCX கோப்புகள் ஆங்கிலம் மற்றும் தமிழ் மொழிகளில் உருவாக்கப்படும்'
                    }
                  </div>
                </div>

                <Button
                  onClick={generateDocuments}
                  disabled={isGenerating}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg"
                  size="lg"
                >
                  {isGenerating ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>
                        {language === 'en' ? 'Generating Documents...' : 'ஆவணங்கள் உருவாக்கப்படுகின்றன...'}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <FileText className="h-5 w-5" />
                      <span>
                        {language === 'en' ? 'Generate All Documents' : 'அனைத்து ஆவணங்களையும் உருவாக்கவும்'}
                      </span>
                    </div>
                  )}
                </Button>

                {generatedFiles.length > 0 && (
                  <div className={`p-4 rounded-lg ${isDark ? 'bg-green-900/20 border border-green-700' : 'bg-green-50 border border-green-200'}`}>
                    <div className={`flex items-center space-x-2 mb-2 ${isDark ? 'text-green-300' : 'text-green-700'}`}>
                      <CheckCircle className="h-5 w-5" />
                      <span className="font-medium">
                        {language === 'en' ? 'Documents Generated Successfully!' : 'ஆவணங்கள் வெற்றிகரமாக உருவாக்கப்பட்டன!'}
                      </span>
                    </div>
                    <div className={`text-sm ${isDark ? 'text-green-200' : 'text-green-600'}`}>
                      {language === 'en' 
                        ? `Generated: ${generatedFiles.join(', ')}`
                        : `உருவாக்கப்பட்டது: ${generatedFiles.join(', ')}`
                      }
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <Button
            onClick={onBack}
            variant="outline"
            className={isDark ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {language === 'en' ? 'Back to Session Planning' : 'அமர்வு திட்டமிடலுக்கு திரும்பவும்'}
          </Button>

          <Button
            onClick={generateDocuments}
            disabled={isGenerating}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <Download className="mr-2 h-4 w-4" />
            {language === 'en' ? 'Generate Documents' : 'ஆவணங்களை உருவாக்கவும்'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EventReview;
