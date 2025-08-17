import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { Badge } from './ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { 
  Clock, 
  Users, 
  ArrowLeft,
  ArrowRight,
  Calendar,
  MapPin,
  User,
  ChefHat,
  CheckCircle,
  Plus,
  Minus
} from 'lucide-react';
import { EventPlanningData, SessionMenuSelection, MenuSelectionItem } from '../types/eventTypes';
import { menuData } from '../data/menuData';
import { useTheme } from '@/contexts/ThemeContext';

interface SessionPlannerProps {
  eventData: EventPlanningData;
  onNext: (sessions: SessionMenuSelection[]) => void;
  onBack: () => void;
  language: 'en' | 'ta';
}

const SessionPlanner: React.FC<SessionPlannerProps> = ({ 
  eventData, 
  onNext, 
  onBack, 
  language 
}) => {
  const [currentDay, setCurrentDay] = useState(1);
  const [currentSession, setCurrentSession] = useState(0);
  const [sessions, setSessions] = useState<SessionMenuSelection[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showVegetarianOnly, setShowVegetarianOnly] = useState(false);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  // Initialize sessions data
  useEffect(() => {
    const initialSessions: SessionMenuSelection[] = [];
    const totalDays = eventData.numberOfDays;
    
    for (let day = 1; day <= totalDays; day++) {
      eventData.sessionsPerDay.forEach((sessionType, sessionIndex) => {
        const sessionId = `day${day}_${sessionType.id}`;
        initialSessions.push({
          sessionId,
          sessionName: sessionType.name,
          sessionNameTa: sessionType.name_ta,
          timeWindow: {
            startTime: sessionType.defaultStartTime,
            endTime: sessionType.defaultEndTime
          },
          headCount: sessionType.defaultHeadCount,
          selectedItems: []
        });
      });
    }
    
    setSessions(initialSessions);
  }, [eventData]);

  const getCurrentSession = () => {
    const sessionIndex = (currentDay - 1) * eventData.sessionsPerDay.length + currentSession;
    return sessions[sessionIndex];
  };

  const updateCurrentSession = (updates: Partial<SessionMenuSelection>) => {
    const sessionIndex = (currentDay - 1) * eventData.sessionsPerDay.length + currentSession;
    setSessions(prev => prev.map((session, index) => 
      index === sessionIndex ? { ...session, ...updates } : session
    ));
  };

  const handleTimeChange = (field: 'startTime' | 'endTime', value: string) => {
    updateCurrentSession({
      timeWindow: {
        ...getCurrentSession().timeWindow,
        [field]: value
      }
    });
  };

  const handleHeadCountChange = (value: string) => {
    const headCount = parseInt(value) || 0;
    updateCurrentSession({ headCount });
  };

  const handleHeadCountIncrement = (increment: number) => {
    const currentHeadCount = getCurrentSession().headCount;
    const newHeadCount = Math.max(1, currentHeadCount + increment);
    updateCurrentSession({ headCount: newHeadCount });
  };

  const toggleMenuItem = (itemId: string) => {
    const currentSessionData = getCurrentSession();
    const isSelected = currentSessionData.selectedItems.some(item => item.id === itemId);
    
    if (isSelected) {
      updateCurrentSession({
        selectedItems: currentSessionData.selectedItems.filter(item => item.id !== itemId)
      });
    } else {
      // Find the menu item from menuData
      let menuItem: MenuSelectionItem | null = null;
      
      for (const [category, items] of Object.entries(menuData)) {
        const found = items.find(item => item.id === itemId);
        if (found) {
          menuItem = {
            id: found.id,
            name_en: found.name_en,
            name_ta: found.name_ta,
            category: category,
            isVegetarian: found.isVegetarian
          };
          break;
        }
      }
      
      if (menuItem) {
        updateCurrentSession({
          selectedItems: [...currentSessionData.selectedItems, menuItem]
        });
      }
    }
  };

  const nextSession = () => {
    const totalSessions = eventData.numberOfDays * eventData.sessionsPerDay.length;
    const currentIndex = (currentDay - 1) * eventData.sessionsPerDay.length + currentSession;
    
    if (currentIndex < totalSessions - 1) {
      if (currentSession < eventData.sessionsPerDay.length - 1) {
        setCurrentSession(currentSession + 1);
      } else {
        setCurrentDay(currentDay + 1);
        setCurrentSession(0);
      }
    } else {
      // All sessions completed
      onNext(sessions);
    }
  };

  const previousSession = () => {
    if (currentSession > 0) {
      setCurrentSession(currentSession - 1);
    } else if (currentDay > 1) {
      setCurrentDay(currentDay - 1);
      setCurrentSession(eventData.sessionsPerDay.length - 1);
    }
  };

  const getProgress = () => {
    const totalSessions = eventData.numberOfDays * eventData.sessionsPerDay.length;
    const currentIndex = (currentDay - 1) * eventData.sessionsPerDay.length + currentSession;
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

  const currentSessionData = getCurrentSession();
  const totalSessions = eventData.numberOfDays * eventData.sessionsPerDay.length;
  const currentIndex = (currentDay - 1) * eventData.sessionsPerDay.length + currentSession;
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
            {language === 'en' ? 'Session Planning' : 'அமர்வு திட்டமிடல்'}
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

        {/* Event Summary */}
        <Card className={`mb-8 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-lg`}>
          <CardHeader>
            <CardTitle className={`${isDark ? 'text-white' : 'text-gray-900'} flex items-center gap-2`}>
              <Calendar className="h-5 w-5" />
              {language === 'en' ? 'Event Summary' : 'நிகழ்வு சுருக்கம்'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className={`flex items-center space-x-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                <User className="h-4 w-4" />
                <span>{eventData.clientName}</span>
              </div>
              <div className={`flex items-center space-x-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                <MapPin className="h-4 w-4" />
                <span>{eventData.venue}</span>
              </div>
              <div className={`flex items-center space-x-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                <Calendar className="h-4 w-4" />
                <span>{eventData.startDate} - {eventData.endDate}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Session Details */}
        <Card className={`mb-8 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-lg`}>
          <CardHeader>
            <CardTitle className={`${isDark ? 'text-white' : 'text-gray-900'} flex items-center gap-2`}>
              <ChefHat className="h-5 w-5" />
              {language === 'en' ? 'Session Details' : 'அமர்வு விவரங்கள்'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Time and Headcount */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className={isDark ? 'text-gray-200' : 'text-gray-700'}>
                  {language === 'en' ? 'Time Window' : 'நேர சாளரம்'}
                </Label>
                <div className="flex space-x-2">
                  <Input
                    type="time"
                    value={currentSessionData.timeWindow.startTime}
                    onChange={(e) => handleTimeChange('startTime', e.target.value)}
                    className={isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}
                  />
                  <span className={`flex items-center ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>-</span>
                  <Input
                    type="time"
                    value={currentSessionData.timeWindow.endTime}
                    onChange={(e) => handleTimeChange('endTime', e.target.value)}
                    className={isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className={isDark ? 'text-gray-200' : 'text-gray-700'}>
                  {language === 'en' ? 'Headcount' : 'தலை எண்ணிக்கை'}
                </Label>
                <div className="flex items-center space-x-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleHeadCountIncrement(-1)}
                    className="w-10 h-10 p-0"
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <Input
                    type="number"
                    value={currentSessionData.headCount}
                    onChange={(e) => handleHeadCountChange(e.target.value)}
                    className={`w-20 text-center ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                    min="1"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleHeadCountIncrement(1)}
                    className="w-10 h-10 p-0"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

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

            {/* Menu Selection */}
            <div className="space-y-4">
              <Label className={isDark ? 'text-gray-200' : 'text-gray-700'}>
                {language === 'en' ? 'Select Menu Items' : 'மெனு பொருட்களைத் தேர்ந்தெடுக்கவும்'}
              </Label>
              
              <Accordion type="multiple" className="w-full">
                {filteredMenu.map(({ categoryId, items }) => (
                  <AccordionItem key={categoryId} value={categoryId}>
                    <AccordionTrigger className={`${isDark ? 'text-gray-200 hover:text-gray-100' : 'text-gray-700 hover:text-gray-900'}`}>
                      <div className="flex items-center space-x-2">
                        <span>{categoryId}</span>
                        <Badge variant="secondary" className={isDark ? 'bg-gray-600 text-gray-200' : 'bg-gray-200 text-gray-700'}>
                          {items.length}
                        </Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 p-4">
                        {items.map((item) => {
                          const isSelected = currentSessionData.selectedItems.some(selected => selected.id === item.id);
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
                              onClick={() => toggleMenuItem(item.id)}
                            >
                              <Checkbox
                                checked={isSelected}
                                onChange={() => toggleMenuItem(item.id)}
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
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>

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
                  <div className="mt-2 flex flex-wrap gap-2">
                    {currentSessionData.selectedItems.map((item) => (
                      <Badge key={item.id} variant="secondary" className={isDark ? 'bg-gray-600 text-gray-200' : 'bg-green-200 text-green-700'}>
                        {language === 'en' ? item.name_en : item.name_ta}
                      </Badge>
                    ))}
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
      </div>
    </div>
  );
};

export default SessionPlanner;
