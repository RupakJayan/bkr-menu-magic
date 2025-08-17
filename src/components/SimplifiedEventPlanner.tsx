import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { Badge } from './ui/badge';
import { 
  ArrowLeft, 
  ArrowRight, 
  Calendar, 
  MapPin, 
  Users, 
  ChefHat, 
  CheckCircle, 
  Clock, 
  FileText,
  User,
  Phone,
  Mail
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';
import { menuData } from '../data/menuData';
import { sessionTypes } from '../utils/eventPlanningUtils';
import { databaseService } from '../services/databaseService';
import { PDFService } from '../services/pdfService';

interface SimplifiedEventPlannerProps {
  language: 'en' | 'ta';
}

interface EventData {
  clientName: string;
  phoneNumber: string;
  email: string;
  venue: string;
  startDate: string;
  endDate: string;
  numberOfDays: number;
  sessions: SessionData[];
}

interface SessionData {
  id: string;
  sessionName: string;
  sessionNameTa: string;
  sessionType: string;
  startTime: string;
  endTime: string;
  headCount: number;
  selectedItems: string[];
  notes: string;
}

const SimplifiedEventPlanner: React.FC<SimplifiedEventPlannerProps> = ({ language }) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const [currentStep, setCurrentStep] = useState(1);
  const [eventData, setEventData] = useState<EventData>({
    clientName: '',
    phoneNumber: '',
    email: '',
    venue: '',
    startDate: '',
    endDate: '',
    numberOfDays: 1,
    sessions: []
  });
  const [currentDay, setCurrentDay] = useState(1);
  const [currentSession, setCurrentSession] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showVegetarianOnly, setShowVegetarianOnly] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Initialize sessions when number of days changes
  useEffect(() => {
    if (eventData.numberOfDays > 0) {
      const sessions: SessionData[] = [];
      for (let day = 1; day <= eventData.numberOfDays; day++) {
        sessionTypes.forEach((sessionType, index) => {
          sessions.push({
            id: `day${day}_${sessionType.id}`,
            sessionName: sessionType.name,
            sessionNameTa: sessionType.name_ta,
            sessionType: sessionType.id,
            startTime: sessionType.defaultStartTime,
            endTime: sessionType.defaultEndTime,
            headCount: sessionType.defaultHeadCount,
            selectedItems: [],
            notes: ''
          });
        });
      }
      setEventData(prev => ({ ...prev, sessions }));
    }
  }, [eventData.numberOfDays]);

  // Update number of days when dates change
  useEffect(() => {
    if (eventData.startDate && eventData.endDate) {
      const start = new Date(eventData.startDate);
      const end = new Date(eventData.endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      setEventData(prev => ({ ...prev, numberOfDays: diffDays }));
    }
  }, [eventData.startDate, eventData.endDate]);

  const handleInputChange = (field: keyof EventData, value: any) => {
    setEventData(prev => ({ ...prev, [field]: value }));
  };

  const toggleMenuItem = (sessionId: string, itemId: string) => {
    setEventData(prev => ({
      ...prev,
      sessions: prev.sessions.map(session =>
        session.id === sessionId 
          ? {
              ...session,
              selectedItems: session.selectedItems.includes(itemId)
                ? session.selectedItems.filter(id => id !== itemId)
                : [...session.selectedItems, itemId]
            }
          : session
      )
    }));
  };

  const getCurrentSession = () => {
    const sessionIndex = (currentDay - 1) * sessionTypes.length + currentSession;
    return eventData.sessions[sessionIndex];
  };

  const nextSession = () => {
    const totalSessions = eventData.numberOfDays * sessionTypes.length;
    const currentIndex = (currentDay - 1) * sessionTypes.length + currentSession;
    
    if (currentIndex < totalSessions - 1) {
      if (currentSession < sessionTypes.length - 1) {
        setCurrentSession(currentSession + 1);
      } else {
        setCurrentDay(currentDay + 1);
        setCurrentSession(0);
      }
    } else {
      setCurrentStep(4);
    }
  };

  const getProgress = () => {
    const totalSessions = eventData.numberOfDays * sessionTypes.length;
    const currentIndex = (currentDay - 1) * sessionTypes.length + currentSession;
    return ((currentIndex + 1) / totalSessions) * 100;
  };

  const getFilteredMenu = () => {
    return Object.entries(menuData).filter(([categoryId]) => 
      selectedCategory === 'all' || categoryId === selectedCategory
    ).map(([categoryId, items]) => ({
      categoryId,
      items: items.filter(item => {
        const matchesSearch = 
          (language === 'en' ? item.name_en : item.name_ta).toLowerCase().includes(searchTerm.toLowerCase()) ||
          categoryId.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesVegetarian = !showVegetarianOnly || item.isVegetarian;
        return matchesSearch && matchesVegetarian;
      })
    })).filter(({ items }) => items.length > 0);
  };

  const generateDocuments = async () => {
    setIsGenerating(true);
    try {
      const eventPlan = {
        clientDetails: {
          name: eventData.clientName,
          phone: eventData.phoneNumber,
          email: eventData.email
        },
        venueDetails: {
          name: eventData.venue,
          address: eventData.venue
        },
        eventDates: {
          startDate: eventData.startDate,
          endDate: eventData.endDate,
          numberOfDays: eventData.numberOfDays
        },
        days: eventData.sessions.reduce((acc, session) => {
          const dayNumber = parseInt(session.id.split('_')[0].replace('day', ''));
          if (!acc[dayNumber - 1]) {
            acc[dayNumber - 1] = {
              date: new Date(eventData.startDate).toISOString().split('T')[0],
              dayNumber,
              sessions: []
            };
          }
          acc[dayNumber - 1].sessions.push({
            id: session.id,
            sessionName: session.sessionName,
            sessionNameTa: session.sessionNameTa,
            sessionType: session.sessionType as any,
            timeRange: {
              startTime: session.startTime,
              endTime: session.endTime
            },
            headCount: session.headCount,
            selectedItems: session.selectedItems,
            notes: session.notes
          });
          return acc;
        }, [] as any[]),
        totalHeadCount: eventData.sessions.reduce((sum, session) => sum + session.headCount, 0),
        totalSessions: eventData.sessions.length,
        status: 'draft' as const
      };

      await databaseService.createEvent(eventPlan);
      await PDFService.generateEventPDF(eventPlan, language);

      alert(language === 'en' ? 'Event created and PDF generated successfully!' : 'நிகழ்வு உருவாக்கப்பட்டு PDF வெற்றிகரமாக உருவாக்கப்பட்டது!');
    } catch (error) {
      console.error('Error generating documents:', error);
      alert(language === 'en' ? 'Error generating documents. Please try again.' : 'ஆவணங்களை உருவாக்குவதில் பிழை. மீண்டும் முயற்சிக்கவும்.');
    } finally {
      setIsGenerating(false);
    }
  };

  const currentSessionData = getCurrentSession();
  const totalSessions = eventData.numberOfDays * sessionTypes.length;
  const currentIndex = (currentDay - 1) * sessionTypes.length + currentSession;
  const isLastSession = currentIndex === totalSessions - 1;
  const filteredMenu = getFilteredMenu();

  if (!currentSessionData) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'} flex items-center justify-center`}>
        <div className="text-center">
          <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            {language === 'en' ? 'Loading sessions...' : 'அமர்வுகள் ஏற்றப்படுகின்றன...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'} py-8`}>
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>
            {language === 'en' ? 'Event Planning' : 'நிகழ்வு திட்டமிடல்'}
          </h1>
          <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            {language === 'en' 
              ? `Day ${currentDay} - ${currentSessionData.sessionName}`
              : `நாள் ${currentDay} - ${currentSessionData.sessionNameTa}`
            }
          </p>
        </div>

        {/* Progress Bar */}
        <div className={`mb-8 ${isDark ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-3`}>
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-300"
            style={{ width: `${getProgress()}%` }}
          />
        </div>

        {/* Step 1: Event Details */}
        {currentStep === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <Card className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-lg`}>
              <CardHeader>
                <CardTitle className={`${isDark ? 'text-white' : 'text-gray-900'} flex items-center gap-2`}>
                  <User className="h-5 w-5" />
                  {language === 'en' ? 'Client Information' : 'வாடிக்கையாளர் தகவல்'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className={isDark ? 'text-gray-200' : 'text-gray-700'}>
                      {language === 'en' ? 'Client Name' : 'வாடிக்கையாளர் பெயர்'} *
                    </Label>
                    <Input
                      value={eventData.clientName}
                      onChange={(e) => handleInputChange('clientName', e.target.value)}
                      className={isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}
                      placeholder={language === 'en' ? 'Enter client name' : 'வாடிக்கையாளர் பெயரை உள்ளிடவும்'}
                    />
                  </div>
                  <div>
                    <Label className={isDark ? 'text-gray-200' : 'text-gray-700'}>
                      {language === 'en' ? 'Phone Number' : 'தொலைபேசி எண்'} *
                    </Label>
                    <Input
                      value={eventData.phoneNumber}
                      onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                      className={isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}
                      placeholder={language === 'en' ? 'Enter phone number' : 'தொலைபேசி எண்ணை உள்ளிடவும்'}
                    />
                  </div>
                  <div>
                    <Label className={isDark ? 'text-gray-200' : 'text-gray-700'}>
                      {language === 'en' ? 'Email' : 'மின்னஞ்சல்'}
                    </Label>
                    <Input
                      type="email"
                      value={eventData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}
                      placeholder={language === 'en' ? 'Enter email address' : 'மின்னஞ்சல் முகவரியை உள்ளிடவும்'}
                    />
                  </div>
                  <div>
                    <Label className={isDark ? 'text-gray-200' : 'text-gray-700'}>
                      {language === 'en' ? 'Venue' : 'இடம்'} *
                    </Label>
                    <Input
                      value={eventData.venue}
                      onChange={(e) => handleInputChange('venue', e.target.value)}
                      className={isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}
                      placeholder={language === 'en' ? 'Enter venue address' : 'இட முகவரியை உள்ளிடவும்'}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className={isDark ? 'text-gray-200' : 'text-gray-700'}>
                      {language === 'en' ? 'Start Date' : 'தொடக்க தேதி'} *
                    </Label>
                    <Input
                      type="date"
                      value={eventData.startDate}
                      onChange={(e) => handleInputChange('startDate', e.target.value)}
                      className={isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}
                    />
                  </div>
                  <div>
                    <Label className={isDark ? 'text-gray-200' : 'text-gray-700'}>
                      {language === 'en' ? 'End Date' : 'முடிவு தேதி'} *
                    </Label>
                    <Input
                      type="date"
                      value={eventData.endDate}
                      onChange={(e) => handleInputChange('endDate', e.target.value)}
                      className={isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button
                onClick={() => setCurrentStep(2)}
                disabled={!eventData.clientName || !eventData.phoneNumber || !eventData.venue || !eventData.startDate || !eventData.endDate}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              >
                {language === 'en' ? 'Continue to Session Planning' : 'அமர்வு திட்டமிடலுக்கு தொடரவும்'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        )}

        {/* Step 2: Session Planning */}
        {currentStep === 2 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <Card className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-lg`}>
              <CardHeader>
                <CardTitle className={`${isDark ? 'text-white' : 'text-gray-900'} flex items-center gap-2`}>
                  <Clock className="h-5 w-5" />
                  {language === 'en' ? 'Session Planning' : 'அமர்வு திட்டமிடல்'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {eventData.sessions.slice((currentDay - 1) * sessionTypes.length, currentDay * sessionTypes.length).map((session, index) => (
                    <div
                      key={session.id}
                      className={`p-4 rounded-lg border cursor-pointer transition-all ${
                        index === currentSession
                          ? isDark 
                            ? 'border-blue-500 bg-blue-900/20' 
                            : 'border-blue-500 bg-blue-50'
                          : isDark 
                            ? 'border-gray-600 hover:border-gray-500' 
                            : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setCurrentSession(index)}
                    >
                      <div className="text-center">
                        <div className={`text-lg font-semibold mb-2 ${
                          isDark ? 'text-white' : 'text-gray-900'
                        }`}>
                          {language === 'en' ? session.sessionName : session.sessionNameTa}
                        </div>
                        <div className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                          {session.startTime} - {session.endTime}
                        </div>
                        <div className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                          {session.headCount} {language === 'en' ? 'guests' : 'விருந்தினர்கள்'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between">
                  <Button
                    onClick={() => setCurrentStep(1)}
                    variant="outline"
                    className={isDark ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    {language === 'en' ? 'Back' : 'பின்செல்'}
                  </Button>
                  <Button
                    onClick={() => setCurrentStep(3)}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                  >
                    {language === 'en' ? 'Continue to Menu Selection' : 'மெனு தேர்வுக்கு தொடரவும்'}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Step 3: Menu Selection */}
        {currentStep === 3 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <Card className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-lg`}>
              <CardHeader>
                <CardTitle className={`${isDark ? 'text-white' : 'text-gray-900'} flex items-center gap-2`}>
                  <ChefHat className="h-5 w-5" />
                  {language === 'en' ? 'Menu Selection' : 'மெனு தேர்வு'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Search and Filters */}
                <div className="space-y-4">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                      <Input
                        type="text"
                        placeholder={language === 'en' ? 'Search menu items...' : 'மெனு பொருட்களைத் தேடுங்கள்...'}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant={selectedCategory === 'all' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedCategory('all')}
                      >
                        {language === 'en' ? 'All' : 'அனைத்தும்'}
                      </Button>
                      {Object.keys(menuData).slice(0, 4).map((category) => (
                        <Button
                          key={category}
                          variant={selectedCategory === category ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setSelectedCategory(category)}
                        >
                          {category.split(' ')[0]}
                        </Button>
                      ))}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="vegetarian"
                        checked={showVegetarianOnly}
                        onCheckedChange={(checked) => setShowVegetarianOnly(checked as boolean)}
                      />
                      <Label htmlFor="vegetarian" className={isDark ? 'text-gray-200' : 'text-gray-700'}>
                        {language === 'en' ? 'Veg Only' : 'சைவம் மட்டும்'}
                      </Label>
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="space-y-4">
                  <Label className={isDark ? 'text-gray-200' : 'text-gray-700'}>
                    {language === 'en' ? 'Select Menu Items' : 'மெனு பொருட்களைத் தேர்ந்தெடுக்கவும்'}
                  </Label>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {filteredMenu.map(({ categoryId, items }) => (
                      <div key={categoryId} className="space-y-2">
                        <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {categoryId}
                        </h4>
                        {items.map((item) => {
                          const isSelected = currentSessionData.selectedItems.includes(item.id);
                          return (
                            <div
                              key={item.id}
                              className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-all ${
                                isSelected
                                  ? isDark 
                                    ? 'border-blue-500 bg-blue-900/20' 
                                    : 'border-blue-500 bg-blue-50'
                                  : isDark 
                                    ? 'border-gray-600 hover:border-gray-500' 
                                    : 'border-gray-200 hover:border-gray-300'
                              }`}
                              onClick={() => toggleMenuItem(currentSessionData.id, item.id)}
                            >
                              <Checkbox
                                checked={isSelected}
                                onChange={() => toggleMenuItem(currentSessionData.id, item.id)}
                                className={isDark ? 'text-blue-400' : 'text-blue-600'}
                              />
                              <div className="flex-1 min-w-0">
                                <div className={`font-medium text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                  {language === 'en' ? item.name_en : item.name_ta}
                                </div>
                                <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                  {language === 'en' ? item.name_ta : item.name_en}
                                </div>
                                {item.isVegetarian && (
                                  <Badge variant="outline" className="mt-1 text-xs">
                                    {language === 'en' ? 'Veg' : 'சைவ'}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>

                  {/* Selected Items Summary */}
                  {currentSessionData.selectedItems.length > 0 && (
                    <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-green-50'} border ${isDark ? 'border-gray-600' : 'border-green-200'}`}>
                      <div className={`font-medium ${isDark ? 'text-green-300' : 'text-green-700'} flex items-center gap-2`}>
                        <CheckCircle className="h-4 w-4" />
                        {language === 'en' 
                          ? `Selected: ${currentSessionData.selectedItems.length} items`
                          : `தேர்ந்தெடுக்கப்பட்டது: ${currentSessionData.selectedItems.length} பொருட்கள்`
                        }
                      </div>
                    </div>
                  )}
                </div>

                {/* Navigation */}
                <div className="flex justify-between">
                  <Button
                    onClick={() => setCurrentStep(2)}
                    variant="outline"
                    className={isDark ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    {language === 'en' ? 'Back' : 'பின்செல்'}
                  </Button>

                  <Button
                    onClick={nextSession}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                  >
                    {isLastSession ? (
                      <>
                        {language === 'en' ? 'Review Event' : 'நிகழ்வை மதிப்பாய்வு செய்யவும்'}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    ) : (
                      <>
                        {language === 'en' ? 'Next Session' : 'அடுத்த அமர்வு'}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Step 4: Review & Generate */}
        {currentStep === 4 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <Card className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-lg`}>
              <CardHeader>
                <CardTitle className={`${isDark ? 'text-white' : 'text-gray-900'} flex items-center gap-2`}>
                  <CheckCircle className="h-5 w-5" />
                  {language === 'en' ? 'Event Review' : 'நிகழ்வு மதிப்பாய்வு'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Event Summary */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className={`font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {language === 'en' ? 'Event Details' : 'நிகழ்வு விவரங்கள்'}
                    </h4>
                    <div className={`space-y-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      <div><strong>{language === 'en' ? 'Client:' : 'வாடிக்கையாளர்:'}</strong> {eventData.clientName}</div>
                      <div><strong>{language === 'en' ? 'Phone:' : 'தொலைபேசி:'}</strong> {eventData.phoneNumber}</div>
                      <div><strong>{language === 'en' ? 'Venue:' : 'இடம்:'}</strong> {eventData.venue}</div>
                      <div><strong>{language === 'en' ? 'Dates:' : 'தேதிகள்:'}</strong> {eventData.startDate} - {eventData.endDate}</div>
                      <div><strong>{language === 'en' ? 'Days:' : 'நாட்கள்:'}</strong> {eventData.numberOfDays}</div>
                    </div>
                  </div>
                  <div>
                    <h4 className={`font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {language === 'en' ? 'Sessions Summary' : 'அமர்வுகள் சுருக்கம்'}
                    </h4>
                    <div className={`space-y-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      <div><strong>{language === 'en' ? 'Total Sessions:' : 'மொத்த அமர்வுகள்:'}</strong> {eventData.sessions.length}</div>
                      <div><strong>{language === 'en' ? 'Total Headcount:' : 'மொத்த தலை எண்ணிக்கை:'}</strong> {eventData.sessions.reduce((sum, session) => sum + session.headCount, 0)}</div>
                      <div><strong>{language === 'en' ? 'Sessions with Menu:' : 'மெனு உடன் அமர்வுகள்:'}</strong> {eventData.sessions.filter(s => s.selectedItems.length > 0).length}</div>
                    </div>
                  </div>
                </div>

                {/* Generate Button */}
                <div className="text-center">
                  <Button
                    onClick={generateDocuments}
                    disabled={isGenerating}
                    className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white py-3 px-8 text-lg"
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
                          {language === 'en' ? 'Generate Event Documents' : 'நிகழ்வு ஆவணங்களை உருவாக்கவும்'}
                        </span>
                      </div>
                    )}
                  </Button>
                </div>

                {/* Navigation */}
                <div className="flex justify-between">
                  <Button
                    onClick={() => setCurrentStep(3)}
                    variant="outline"
                    className={isDark ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    {language === 'en' ? 'Back to Menu Selection' : 'மெனு தேர்வுக்கு திரும்பவும்'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SimplifiedEventPlanner;
