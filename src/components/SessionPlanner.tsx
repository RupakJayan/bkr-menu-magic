import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { Badge } from './ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
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
  Minus,
  Search,
  Filter,
  Star,
  Leaf,
  Utensils,
  Eye,
  Edit,
  Save,
  X,
  DollarSign,
  Settings,
  ChefHat as ChefHatIcon,
  AlertTriangle,
  Info,
  ChevronDown
} from 'lucide-react';
import { EventPlanningData, SessionMenuSelection, MenuSelectionItem, DietaryRestriction, ServiceStaff } from '../types/eventTypes';
import { menuData } from '../data/menuData';
import { useTheme } from '@/contexts/ThemeContext';
import { useToast } from '@/hooks/use-toast';

interface SessionPlannerProps {
  eventData: EventPlanningData;
  onNext: (sessions: SessionMenuSelection[]) => void;
  onBack: () => void;
  language: 'en' | 'ta';
  initialSessions?: SessionMenuSelection[];
}

const SessionPlanner: React.FC<SessionPlannerProps> = ({ 
  eventData, 
  onNext, 
  onBack, 
  language,
  initialSessions = []
}) => {
  const [currentDay, setCurrentDay] = useState(1);
  const [currentSession, setCurrentSession] = useState(0);
  const [sessions, setSessions] = useState<SessionMenuSelection[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showVegetarianOnly, setShowVegetarianOnly] = useState(false);
  const [showSpiceLevel, setShowSpiceLevel] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showSessionSummary, setShowSessionSummary] = useState(false);
  const [editingSession, setEditingSession] = useState<string | null>(null);
  const [tempSessionData, setTempSessionData] = useState<Partial<SessionMenuSelection>>({});
  
  // Enhanced features
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [selectedDietaryRestrictions, setSelectedDietaryRestrictions] = useState<string[]>([]);
  const [serviceStaffCount, setServiceStaffCount] = useState(0);
  const [customTiming, setCustomTiming] = useState(false);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [estimatedBudget, setEstimatedBudget] = useState(0);
  const [menuSelectionMode, setMenuSelectionMode] = useState<'manual' | 'quick' | 'template'>('manual');
  
  const { resolvedTheme } = useTheme();
  const { toast } = useToast();
  const isDark = resolvedTheme === 'dark';

  // Enhanced data
  const dietaryRestrictions: DietaryRestriction[] = [
    { id: 'gluten-free', name_en: 'Gluten Free', name_ta: 'குளுடன் இல்லாதது', icon: '🌾' },
    { id: 'dairy-free', name_en: 'Dairy Free', name_ta: 'பால் பொருட்கள் இல்லாதது', icon: '🥛' },
    { id: 'nut-free', name_en: 'Nut Free', name_ta: 'கொட்டைகள் இல்லாதது', icon: '🥜' },
    { id: 'halal', name_en: 'Halal', name_ta: 'ஹலால்', icon: '☪️' },
    { id: 'jain', name_en: 'Jain', name_ta: 'ஜைன', icon: '🕉️' },
    { id: 'vegan', name_en: 'Vegan', name_ta: 'வேகன்', icon: '🌱' }
  ];

  const serviceStaffOptions: ServiceStaff[] = [
    { id: 'waiter', role: 'Waiter', role_ta: 'சேவைக்காரர்', hourlyRate: 150, description: 'Food service and guest assistance' },
    { id: 'chef', role: 'Chef', role_ta: 'சமையல்காரர்', hourlyRate: 300, description: 'Food preparation and cooking' },
    { id: 'supervisor', role: 'Supervisor', role_ta: 'மேற்பார்வையாளர்', hourlyRate: 250, description: 'Event coordination and supervision' },
    { id: 'cleanup', role: 'Cleanup Staff', role_ta: 'சுத்தம் செய்பவர்', hourlyRate: 120, description: 'Post-event cleanup and maintenance' }
  ];

  // Initialize sessions data
  useEffect(() => {
    if (initialSessions.length > 0) {
      setSessions(initialSessions);
    } else {
      const initialSessionsData: SessionMenuSelection[] = [];
      const totalDays = eventData.numberOfDays;
      
      for (let day = 1; day <= totalDays; day++) {
        eventData.sessionsPerDay.forEach((sessionType, sessionIndex) => {
          if (sessionType.isSelected) {
            const sessionId = `day${day}_${sessionType.id}`;
            initialSessionsData.push({
              sessionId,
              sessionName: sessionType.name,
              sessionNameTa: sessionType.name_ta,
              timeWindow: {
                startTime: sessionType.defaultStartTime,
                endTime: sessionType.defaultEndTime
              },
              headCount: sessionType.defaultHeadCount,
              selectedItems: [],
              customTiming: false,
              specialInstructions: '',
              dietaryRestrictions: [],
              serviceStaff: 0,
              estimatedCost: 0,
              notes: ''
            });
          }
        });
      }
      
      setSessions(initialSessionsData);
    }
  }, [eventData, initialSessions]);

  const getCurrentSession = () => {
    const sessionIndex = (currentDay - 1) * eventData.sessionsPerDay.filter(s => s.isSelected).length + currentSession;
    return sessions[sessionIndex];
  };

  const updateCurrentSession = (updates: Partial<SessionMenuSelection>) => {
    const sessionIndex = (currentDay - 1) * eventData.sessionsPerDay.filter(s => s.isSelected).length + currentSession;
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

  const startEditingSession = (sessionId: string) => {
    const session = sessions.find(s => s.sessionId === sessionId);
    if (session) {
      setEditingSession(sessionId);
      setTempSessionData({
        timeWindow: { ...session.timeWindow },
        headCount: session.headCount
      });
    }
  };

  const saveSessionEdit = () => {
    if (editingSession && tempSessionData.timeWindow && tempSessionData.headCount !== undefined) {
      setSessions(prev => prev.map(session => 
        session.sessionId === editingSession
          ? {
              ...session,
              timeWindow: tempSessionData.timeWindow!,
              headCount: tempSessionData.headCount!
            }
          : session
      ));
      setEditingSession(null);
      setTempSessionData({});
      toast({
        title: language === 'en' ? 'Session Updated' : 'அமர்வு புதுப்பிக்கப்பட்டது',
        description: language === 'en' ? 'Session details have been saved' : 'அமர்வு விவரங்கள் சேமிக்கப்பட்டன',
      });
    }
  };

  const cancelSessionEdit = () => {
    setEditingSession(null);
    setTempSessionData({});
  };

  const nextSession = () => {
    const totalSessions = eventData.numberOfDays * eventData.sessionsPerDay.filter(s => s.isSelected).length;
    const currentIndex = (currentDay - 1) * eventData.sessionsPerDay.filter(s => s.isSelected).length + currentSession;
    
    if (currentIndex < totalSessions - 1) {
      if (currentSession < eventData.sessionsPerDay.filter(s => s.isSelected).length - 1) {
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
      setCurrentSession(eventData.sessionsPerDay.filter(s => s.isSelected).length - 1);
    }
  };

  const getProgress = () => {
    const totalSessions = eventData.numberOfDays * eventData.sessionsPerDay.filter(s => s.isSelected).length;
    const currentIndex = (currentDay - 1) * eventData.sessionsPerDay.filter(s => s.isSelected).length + currentSession;
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

  const getSessionSummary = () => {
    const totalItems = sessions.reduce((total, session) => total + session.selectedItems.length, 0);
    const totalHeadCount = sessions.reduce((total, session) => total + session.headCount, 0);
    const vegetarianItems = sessions.reduce((total, session) => 
      total + session.selectedItems.filter(item => item.isVegetarian).length, 0
    );
    const totalEstimatedCost = sessions.reduce((total, session) => total + (session.estimatedCost || 0), 0);
    const totalServiceStaff = sessions.reduce((total, session) => total + (session.serviceStaff || 0), 0);
    
    return { totalItems, totalHeadCount, vegetarianItems, totalEstimatedCost, totalServiceStaff };
  };

  const calculateEstimatedCost = (session: SessionMenuSelection) => {
    const itemCosts = session.selectedItems.reduce((total, item) => {
      const baseCost = item.estimatedCost || 50; // Default cost per item
      return total + (baseCost * session.headCount);
    }, 0);
    
    const staffCost = (session.serviceStaff || 0) * 150 * 4; // 4 hours per session
    return itemCosts + staffCost;
  };

  const handleDietaryRestrictionToggle = (restrictionId: string) => {
    setSelectedDietaryRestrictions(prev => 
      prev.includes(restrictionId) 
        ? prev.filter(id => id !== restrictionId)
        : [...prev, restrictionId]
    );
  };

  const handleServiceStaffChange = (count: number) => {
    setServiceStaffCount(Math.max(0, count));
  };

  const handleQuickMenuSelection = (template: string) => {
    const currentSessionData = getCurrentSession();
    if (!currentSessionData) return;

    // Quick menu templates
    const templates = {
      'south-indian': ['id1', 'do1', 'br1', 'gr1', 'rb1', 'ra1', 'h1'],
      'north-indian': ['st1', 'br4', 'gr4', 'rb3', 'ra2', 'sd1'],
      'continental': ['st5', 'so1', 'br2', 'gr6', 'rb2', 'sd3'],
      'desserts-only': ['swl1', 'swc1', 'h1', 'sd1', 'pa1']
    };

    const templateItems = templates[template as keyof typeof templates] || [];
    const selectedItems = templateItems.map(itemId => {
      // Find item in menuData
      for (const [category, items] of Object.entries(menuData)) {
        const found = items.find(item => item.id === itemId);
        if (found) {
          return {
            id: found.id,
            name_en: found.name_en,
            name_ta: found.name_ta,
            category: category,
            isVegetarian: found.isVegetarian,
            estimatedCost: 75
          };
        }
      }
      return null;
    }).filter(Boolean) as MenuSelectionItem[];

    updateCurrentSession({ selectedItems });
    toast({
      title: language === 'en' ? 'Quick Menu Applied' : 'விரைவு மெனு பயன்படுத்தப்பட்டது',
      description: language === 'en' ? `${template} template applied successfully` : `${template} டெம்ப்ளேட் வெற்றிகரமாக பயன்படுத்தப்பட்டது`,
    });
  };

  const currentSessionData = getCurrentSession();
  const totalSessions = eventData.numberOfDays * eventData.sessionsPerDay.filter(s => s.isSelected).length;
  const currentIndex = (currentDay - 1) * eventData.sessionsPerDay.filter(s => s.isSelected).length + currentSession;
  const isLastSession = currentIndex === totalSessions - 1;
  const filteredMenu = getFilteredMenu();
  const sessionSummary = getSessionSummary();

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
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className={`text-4xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>
            {language === 'en' ? 'Session Planning' : 'அமர்வு திட்டமிடல்'}
          </h1>
          <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'} mb-6`}>
            {language === 'en' 
              ? `Day ${currentDay} - ${currentSessionData.sessionName}`
              : `நாள் ${currentDay} - ${currentSessionData.sessionNameTa}`
            }
          </p>
          
          {/* Progress Bar */}
          <div className={`max-w-2xl mx-auto ${isDark ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-3 mb-4`}>
            <motion.div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${getProgress()}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
          
          <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            {language === 'en' 
              ? `Session ${currentIndex + 1} of ${totalSessions}`
              : `அமர்வு ${currentIndex + 1} / ${totalSessions}`
            }
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Event Summary and Session Details */}
          <div className="lg:col-span-1 space-y-6">
            {/* Event Summary */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-lg`}>
                <CardHeader>
                  <CardTitle className={`${isDark ? 'text-white' : 'text-gray-900'} flex items-center gap-2`}>
                    <Calendar className="h-5 w-5" />
                    {language === 'en' ? 'Event Summary' : 'நிகழ்வு சுருக்கம்'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className={`flex items-center space-x-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    <User className="h-4 w-4" />
                    <span className="font-medium">{eventData.clientName}</span>
                  </div>
                  <div className={`flex items-center space-x-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    <MapPin className="h-4 w-4" />
                    <span>{eventData.venue}</span>
                  </div>
                  <div className={`flex items-center space-x-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    <Calendar className="h-4 w-4" />
                    <span>{eventData.startDate} - {eventData.endDate}</span>
                  </div>
                  <div className={`flex items-center space-x-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    <Users className="h-4 w-4" />
                    <span>{eventData.numberOfDays} {language === 'en' ? 'days' : 'நாட்கள்'}</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Session Details */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-lg`}>
                <CardHeader>
                  <CardTitle className={`${isDark ? 'text-white' : 'text-gray-900'} flex items-center gap-2`}>
                    <ChefHat className="h-5 w-5" />
                    {language === 'en' ? 'Session Details' : 'அமர்வு விவரங்கள்'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Time Window */}
                  <div className="space-y-2">
                    <Label className={isDark ? 'text-gray-200' : 'text-gray-700'}>
                      {language === 'en' ? 'Time Window' : 'நேர சாளரம்'}
                    </Label>
                    {editingSession === currentSessionData.sessionId ? (
                      <div className="flex space-x-2">
                        <Input
                          type="time"
                          value={tempSessionData.timeWindow?.startTime || ''}
                          onChange={(e) => setTempSessionData(prev => ({
                            ...prev,
                            timeWindow: { ...prev.timeWindow!, startTime: e.target.value }
                          }))}
                          className={`text-sm ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                        />
                        <span className={`flex items-center ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>-</span>
                        <Input
                          type="time"
                          value={tempSessionData.timeWindow?.endTime || ''}
                          onChange={(e) => setTempSessionData(prev => ({
                            ...prev,
                            timeWindow: { ...prev.timeWindow!, endTime: e.target.value }
                          }))}
                          className={`text-sm ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                        />
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <span className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                          {currentSessionData.timeWindow.startTime} - {currentSessionData.timeWindow.endTime}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => startEditingSession(currentSessionData.sessionId)}
                          className="p-1 h-6 w-6"
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Headcount */}
                  <div className="space-y-2">
                    <Label className={isDark ? 'text-gray-200' : 'text-gray-700'}>
                      {language === 'en' ? 'Headcount' : 'தலை எண்ணிக்கை'}
                    </Label>
                    {editingSession === currentSessionData.sessionId ? (
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setTempSessionData(prev => ({
                            ...prev,
                            headCount: Math.max(1, (prev.headCount || 0) - 1)
                          }))}
                          className="w-8 h-8 p-0"
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <Input
                          type="number"
                          value={tempSessionData.headCount || 0}
                          onChange={(e) => setTempSessionData(prev => ({
                            ...prev,
                            headCount: parseInt(e.target.value) || 1
                          }))}
                          className={`w-16 text-center text-sm ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                          min="1"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setTempSessionData(prev => ({
                            ...prev,
                            headCount: (prev.headCount || 0) + 1
                          }))}
                          className="w-8 h-8 p-0"
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <span className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                          {currentSessionData.headCount}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => startEditingSession(currentSessionData.sessionId)}
                          className="p-1 h-6 w-6"
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Advanced Options Toggle */}
                  <div className="pt-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
                      className="w-full justify-between"
                    >
                      <span className="flex items-center gap-2">
                        <Settings className="w-4 h-4" />
                        {language === 'en' ? 'Advanced Options' : 'மேம்பட்ட விருப்பங்கள்'}
                      </span>
                      <ChevronDown className={`w-4 h-4 transition-transform ${showAdvancedOptions ? 'rotate-180' : ''}`} />
                    </Button>
                  </div>

                  {/* Advanced Options */}
                  {showAdvancedOptions && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-600"
                    >
                      {/* Dietary Restrictions */}
                      <div className="space-y-2">
                        <Label className={isDark ? 'text-gray-200' : 'text-gray-700'}>
                          {language === 'en' ? 'Dietary Restrictions' : 'உணவு வரம்புகள்'}
                        </Label>
                        <div className="flex flex-wrap gap-2">
                          {dietaryRestrictions.map((restriction) => (
                            <Badge
                              key={restriction.id}
                              variant={selectedDietaryRestrictions.includes(restriction.id) ? 'default' : 'outline'}
                              className="cursor-pointer"
                              onClick={() => handleDietaryRestrictionToggle(restriction.id)}
                            >
                              <span className="mr-1">{restriction.icon}</span>
                              {language === 'en' ? restriction.name_en : restriction.name_ta}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Service Staff */}
                      <div className="space-y-2">
                        <Label className={isDark ? 'text-gray-200' : 'text-gray-700'}>
                          {language === 'en' ? 'Service Staff' : 'சேவை ஊழியர்கள்'}
                        </Label>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleServiceStaffChange(serviceStaffCount - 1)}
                            className="w-8 h-8 p-0"
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <Input
                            type="number"
                            value={serviceStaffCount}
                            onChange={(e) => handleServiceStaffChange(parseInt(e.target.value) || 0)}
                            className={`w-16 text-center text-sm ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                            min="0"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleServiceStaffChange(serviceStaffCount + 1)}
                            className="w-8 h-8 p-0"
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                        <div className="text-xs text-gray-500">
                          {language === 'en' ? 'Additional staff for this session' : 'இந்த அமர்வுக்கான கூடுதல் ஊழியர்கள்'}
                        </div>
                      </div>

                      {/* Special Instructions */}
                      <div className="space-y-2">
                        <Label className={isDark ? 'text-gray-200' : 'text-gray-700'}>
                          {language === 'en' ? 'Special Instructions' : 'சிறப்பு அறிவுறுத்தல்கள்'}
                        </Label>
                        <Textarea
                          placeholder={language === 'en' ? 'Any special requirements...' : 'எந்த சிறப்பு தேவைகள்...'}
                          value={specialInstructions}
                          onChange={(e) => setSpecialInstructions(e.target.value)}
                          className={`text-sm ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                          rows={2}
                        />
                      </div>
                    </motion.div>
                  )}

                  {/* Edit Actions */}
                  {editingSession === currentSessionData.sessionId && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex space-x-2 pt-2"
                    >
                      <Button
                        size="sm"
                        onClick={saveSessionEdit}
                        className="flex-1"
                      >
                        <Save className="w-3 h-3 mr-1" />
                        {language === 'en' ? 'Save' : 'சேமிக்கவும்'}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={cancelSessionEdit}
                        className="flex-1"
                      >
                        <X className="w-3 h-3 mr-1" />
                        {language === 'en' ? 'Cancel' : 'ரத்து'}
                      </Button>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Overall Progress Summary */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Card className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-lg`}>
                <CardHeader>
                  <CardTitle className={`${isDark ? 'text-white' : 'text-gray-900'} flex items-center gap-2`}>
                    <CheckCircle className="h-5 w-5" />
                    {language === 'en' ? 'Overall Progress' : 'மொத்த முன்னேற்றம்'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                      {language === 'en' ? 'Total Items' : 'மொத்த பொருட்கள்'}
                    </span>
                    <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {sessionSummary.totalItems}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                      {language === 'en' ? 'Total Headcount' : 'மொத்த தலை எண்ணிக்கை'}
                    </span>
                    <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {sessionSummary.totalHeadCount}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                      {language === 'en' ? 'Vegetarian Items' : 'சைவ பொருட்கள்'}
                    </span>
                    <span className={`font-semibold text-green-600`}>
                      {sessionSummary.vegetarianItems}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                      {language === 'en' ? 'Estimated Cost' : 'மதிப்பிடப்பட்ட செலவு'}
                    </span>
                    <span className={`font-semibold text-blue-600`}>
                      ₹{sessionSummary.totalEstimatedCost.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                      {language === 'en' ? 'Service Staff' : 'சேவை ஊழியர்கள்'}
                    </span>
                    <span className={`font-semibold text-purple-600`}>
                      {sessionSummary.totalServiceStaff}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Right Column - Menu Selection */}
          <div className="lg:col-span-2 space-y-6">
            {/* Search and Filters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-lg`}>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* Search Bar */}
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        type="text"
                        placeholder={language === 'en' ? 'Search menu items...' : 'மெனு பொருட்களைத் தேடுங்கள்...'}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={`pl-10 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                      />
                    </div>

                    {/* Filters */}
                    <div className="flex flex-wrap gap-3">
                      {/* Category Filter */}
                      <div className="flex gap-2">
                        <Button
                          variant={selectedCategory === 'all' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setSelectedCategory('all')}
                        >
                          {language === 'en' ? 'All' : 'அனைத்தும்'}
                        </Button>
                        {Object.keys(menuData).slice(0, 6).map((category) => (
                          <Button
                            key={category}
                            variant={selectedCategory === category ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setSelectedCategory(category)}
                            className="text-xs"
                          >
                            {category.split(' ')[0]}
                          </Button>
                        ))}
                      </div>

                      {/* Other Filters */}
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="vegetarian"
                            checked={showVegetarianOnly}
                            onCheckedChange={(checked) => setShowVegetarianOnly(checked as boolean)}
                          />
                          <Label htmlFor="vegetarian" className={`text-sm ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                            <Leaf className="w-4 h-4 inline mr-1 text-green-500" />
                            {language === 'en' ? 'Veg Only' : 'சைவம் மட்டும்'}
                          </Label>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="spice-level"
                            checked={showSpiceLevel}
                            onCheckedChange={(checked) => setShowSpiceLevel(checked as boolean)}
                          />
                          <Label htmlFor="spice-level" className={`text-sm ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                            <Star className="w-4 h-4 inline mr-1 text-orange-500" />
                            {language === 'en' ? 'Show Spice Level' : 'கார நிலையைக் காட்டு'}
                          </Label>
                        </div>
                      </div>

                                          {/* Menu Selection Mode */}
                    <div className="flex items-center space-x-2">
                      <Select value={menuSelectionMode} onValueChange={(value) => setMenuSelectionMode(value as 'manual' | 'quick' | 'template')}>
                        <SelectTrigger className="w-32 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="manual">{language === 'en' ? 'Manual' : 'கைமுறை'}</SelectItem>
                          <SelectItem value="quick">{language === 'en' ? 'Quick' : 'விரைவு'}</SelectItem>
                          <SelectItem value="template">{language === 'en' ? 'Template' : 'டெம்ப்ளேட்'}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* View Mode Toggle */}
                    <div className="ml-auto">
                      <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as 'grid' | 'list')}>
                        <TabsList className="grid w-full grid-cols-2">
                          <TabsTrigger value="grid" className="text-xs">
                            {language === 'en' ? 'Grid' : 'கட்டம்'}
                          </TabsTrigger>
                          <TabsTrigger value="list" className="text-xs">
                            {language === 'en' ? 'List' : 'பட்டியல்'}
                          </TabsTrigger>
                        </TabsList>
                      </Tabs>
                    </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick Menu Templates */}
            {menuSelectionMode === 'quick' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="mb-6"
              >
                <Card className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-lg`}>
                  <CardHeader>
                    <CardTitle className={`${isDark ? 'text-white' : 'text-gray-900'} flex items-center gap-2`}>
                      <ChefHatIcon className="h-5 w-5" />
                      {language === 'en' ? 'Quick Menu Templates' : 'விரைவு மெனு டெம்ப்ளேட்கள்'}
                    </CardTitle>
                    <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      {language === 'en' 
                        ? 'Choose from pre-designed menu combinations'
                        : 'முன் வடிவமைக்கப்பட்ட மெனு சேர்க்கைகளிலிருந்து தேர்ந்தெடுக்கவும்'
                      }
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {[
                        { id: 'south-indian', name: 'South Indian', name_ta: 'தென்னிந்திய', icon: '🍛' },
                        { id: 'north-indian', name: 'North Indian', name_ta: 'வடஇந்திய', icon: '🥘' },
                        { id: 'continental', name: 'Continental', name_ta: 'கண்டிநென்டல்', icon: '🍝' },
                        { id: 'desserts-only', name: 'Desserts Only', name_ta: 'இனிப்புகள் மட்டும்', icon: '🍰' }
                      ].map((template) => (
                        <Button
                          key={template.id}
                          variant="outline"
                          className="h-20 flex flex-col items-center justify-center space-y-2 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                          onClick={() => handleQuickMenuSelection(template.id)}
                        >
                          <span className="text-2xl">{template.icon}</span>
                          <span className="text-xs font-medium">
                            {language === 'en' ? template.name : template.name_ta}
                          </span>
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Menu Selection */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-lg`}>
                <CardHeader>
                  <CardTitle className={`${isDark ? 'text-white' : 'text-gray-900'} flex items-center gap-2`}>
                    <Utensils className="h-5 w-5" />
                    {language === 'en' ? 'Select Menu Items' : 'மெனு பொருட்களைத் தேர்ந்தெடுக்கவும்'}
                  </CardTitle>
                  <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    {language === 'en' 
                      ? `Showing ${filteredMenu.reduce((total, cat) => total + cat.items.length, 0)} items`
                      : `${filteredMenu.reduce((total, cat) => total + cat.items.length, 0)} பொருட்கள் காட்டப்படுகின்றன`
                    }
                  </p>
                </CardHeader>
                <CardContent className="p-0">
                  <Accordion type="multiple" className="w-full">
                    {filteredMenu.map(({ categoryId, items }) => (
                      <AccordionItem key={categoryId} value={categoryId}>
                        <AccordionTrigger className={`${isDark ? 'text-gray-200 hover:text-gray-100' : 'text-gray-700 hover:text-gray-900'}`}>
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">{categoryId}</span>
                            <Badge variant="secondary" className={isDark ? 'bg-gray-600 text-gray-200' : 'bg-gray-200 text-gray-700'}>
                              {items.length}
                            </Badge>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className={`p-4 ${
                            viewMode === 'grid' 
                              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3'
                              : 'space-y-2'
                          }`}>
                            {items.map((item) => {
                              const isSelected = currentSessionData.selectedItems.some(selected => selected.id === item.id);
                              return (
                                <motion.div
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
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
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
                                    <div className="flex items-center gap-2 mt-1">
                                      {item.isVegetarian && (
                                        <Badge variant="outline" className="text-xs">
                                          <Leaf className="w-3 h-3 mr-1" />
                                          {language === 'en' ? 'Veg' : 'சைவ'}
                                        </Badge>
                                      )}
                                      {showSpiceLevel && (
                                        <Badge variant="outline" className="text-xs">
                                          <Star className="w-3 h-3 mr-1" />
                                          {language === 'en' ? 'Mild' : 'மெதுவான'}
                                        </Badge>
                                      )}
                                      {item.estimatedCost && (
                                        <Badge variant="outline" className="text-xs text-green-600">
                                          <DollarSign className="w-3 h-3 mr-1" />
                                          ₹{item.estimatedCost}
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                </motion.div>
                              );
                            })}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </motion.div>

            {/* Selected Items Summary */}
            {currentSessionData.selectedItems.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <Card className={`${isDark ? 'bg-gray-700' : 'bg-green-50'} border ${isDark ? 'border-gray-600' : 'border-green-200'} shadow-lg`}>
                  <CardContent className="p-4">
                    <div className={`font-medium ${isDark ? 'text-green-300' : 'text-green-700'} flex items-center gap-2 mb-3`}>
                      <CheckCircle className="h-4 w-4" />
                      {language === 'en' 
                        ? `Selected: ${currentSessionData.selectedItems.length} items`
                        : `தேர்ந்தெடுக்கப்பட்டது: ${currentSessionData.selectedItems.length} பொருட்கள்`
                      }
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {currentSessionData.selectedItems.map((item) => (
                        <Badge key={item.id} variant="secondary" className={isDark ? 'bg-gray-600 text-gray-200' : 'bg-green-200 text-green-700'}>
                          {language === 'en' ? item.name_en : item.name_ta}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="flex justify-between mt-8"
        >
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
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
            size="lg"
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
        </motion.div>
      </div>
    </div>
  );
};

export default SessionPlanner;
