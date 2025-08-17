import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
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
  User
} from 'lucide-react';
import { EventPlanningData, SessionMenuSelection } from '../types/eventTypes';
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
            notes: ''
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

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'} py-8`}>
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>
            {language === 'en' ? 'Event Review' : 'நிகழ்வு மதிப்பாய்வு'}
          </h1>
          <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            {language === 'en' 
              ? 'Review your event details and generate documents' 
              : 'உங்கள் நிகழ்வு விவரங்களை மதிப்பாய்வு செய்து ஆவணங்களை உருவாக்கவும்'
            }
          </p>
        </div>

        {/* Event Summary */}
        <Card className={`mb-8 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
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

        {/* Sessions Summary */}
        <Card className={`mb-8 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
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

        {/* Document Generation */}
        <Card className={`mb-8 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
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

        {/* Navigation */}
        <div className="flex justify-between">
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
