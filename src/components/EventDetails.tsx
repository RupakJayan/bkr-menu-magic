import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Badge } from './ui/badge';
import { CalendarIcon, MapPin, Phone, User, Plus, Minus, Clock, Users, CalendarDays } from 'lucide-react';
import { format, addDays, isAfter, isBefore, startOfDay } from 'date-fns';
import { EventPlanningData, SessionType } from '../types/eventTypes';
import { useTheme } from '@/contexts/ThemeContext';
import { useToast } from '@/hooks/use-toast';

interface EventDetailsProps {
  onNext: (data: EventPlanningData) => void;
  language: 'en' | 'ta';
  initialData?: EventPlanningData | null;
}

const defaultSessions: SessionType[] = [
  {
    id: 'breakfast',
    name: 'Breakfast',
    name_ta: 'காலை உணவு',
    icon: '🌅',
    defaultStartTime: '07:00',
    defaultEndTime: '10:00',
    defaultHeadCount: 25,
    isSelected: true
  },
  {
    id: 'lunch',
    name: 'Lunch',
    name_ta: 'மதிய உணவு',
    icon: '🍽️',
    defaultStartTime: '12:30',
    defaultEndTime: '15:00',
    defaultHeadCount: 25,
    isSelected: true
  },
  {
    id: 'dinner',
    name: 'Dinner',
    name_ta: 'மாலை உணவு',
    icon: '🌙',
    defaultStartTime: '19:00',
    defaultEndTime: '22:00',
    defaultHeadCount: 25,
    isSelected: true
  },
  {
    id: 'snacks',
    name: 'Snacks',
    name_ta: 'சிற்றுண்டி',
    icon: '☕',
    defaultStartTime: '16:00',
    defaultEndTime: '17:00',
    defaultHeadCount: 25,
    isSelected: false
  },
  {
    id: 'packing',
    name: 'Packing',
    name_ta: 'பேக்கிங்',
    icon: '📦',
    defaultStartTime: '22:00',
    defaultEndTime: '23:00',
    defaultHeadCount: 25,
    isSelected: false
  }
];

const EventDetails: React.FC<EventDetailsProps> = ({ onNext, language, initialData }) => {
  const [formData, setFormData] = useState<EventPlanningData>({
    clientName: '',
    phoneNumber: '',
    venue: '',
    venueCoordinates: undefined,
    startDate: '',
    endDate: '',
    numberOfDays: 1,
    sessionsPerDay: [...defaultSessions]
  });

  const [errors, setErrors] = useState<{
    clientName?: string;
    phoneNumber?: string;
    venue?: string;
    startDate?: string;
    endDate?: string;
    sessionsPerDay?: string;
  }>({});

  const [selectedStartDate, setSelectedStartDate] = useState<Date | undefined>(undefined);
  const [selectedEndDate, setSelectedEndDate] = useState<Date | undefined>(undefined);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);

  const { resolvedTheme } = useTheme();
  const { toast } = useToast();
  const isDark = resolvedTheme === 'dark';

  // Initialize form with initial data if provided
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      if (initialData.startDate) {
        setSelectedStartDate(new Date(initialData.startDate));
      }
      if (initialData.endDate) {
        setSelectedEndDate(new Date(initialData.endDate));
      }
    }
  }, [initialData]);

  const handleInputChange = (field: keyof EventPlanningData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const handleDateChange = (date: Date | undefined, isStartDate: boolean) => {
    if (isStartDate) {
      setSelectedStartDate(date);
      if (date) {
        const formattedDate = format(date, 'yyyy-MM-dd');
        setFormData(prev => ({ ...prev, startDate: formattedDate }));
        
        // Auto-calculate end date if it's before start date
        if (selectedEndDate && isBefore(selectedEndDate, date)) {
          const newEndDate = addDays(date, formData.numberOfDays - 1);
          setSelectedEndDate(newEndDate);
          setFormData(prev => ({ 
            ...prev, 
            endDate: format(newEndDate, 'yyyy-MM-dd'),
            numberOfDays: formData.numberOfDays
          }));
        }
      }
    } else {
      setSelectedEndDate(date);
      if (date) {
        const formattedDate = format(date, 'yyyy-MM-dd');
        setFormData(prev => ({ ...prev, endDate: formattedDate }));
        
        // Calculate number of days
        if (selectedStartDate) {
          const daysDiff = Math.ceil((date.getTime() - selectedStartDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
          setFormData(prev => ({ ...prev, numberOfDays: Math.max(1, daysDiff) }));
        }
      }
    }
    setErrors(prev => ({ ...prev, startDate: undefined, endDate: undefined }));
  };

  const handleNumberOfDaysChange = (days: number) => {
    const newDays = Math.max(1, days);
    setFormData(prev => ({ ...prev, numberOfDays: newDays }));
    
    // Auto-adjust end date
    if (selectedStartDate) {
      const newEndDate = addDays(selectedStartDate, newDays - 1);
      setSelectedEndDate(newEndDate);
      setFormData(prev => ({ ...prev, endDate: format(newEndDate, 'yyyy-MM-dd') }));
    }
  };

  const toggleSession = (sessionId: string) => {
    setFormData(prev => ({
      ...prev,
      sessionsPerDay: prev.sessionsPerDay.map(session =>
        session.id === sessionId
          ? { ...session, isSelected: !session.isSelected }
          : session
      )
    }));
  };

  const updateSessionTime = (sessionId: string, field: 'defaultStartTime' | 'defaultEndTime', value: string) => {
    setFormData(prev => ({
      ...prev,
      sessionsPerDay: prev.sessionsPerDay.map(session =>
        session.id === sessionId
          ? { ...session, [field]: value }
          : session
      )
    }));
  };

  const updateSessionHeadCount = (sessionId: string, headCount: number) => {
    setFormData(prev => ({
      ...prev,
      sessionsPerDay: prev.sessionsPerDay.map(session =>
        session.id === sessionId
          ? { ...session, defaultHeadCount: Math.max(1, headCount) }
          : session
      )
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    if (!formData.clientName.trim()) {
      newErrors.clientName = language === 'en' ? 'Client name is required' : 'வாடிக்கையாளர் பெயர் தேவை';
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = language === 'en' ? 'Phone number is required' : 'தொலைபேசி எண் தேவை';
    } else if (!/^[\+]?[1-9][\d]{0,15}$/.test(formData.phoneNumber.replace(/\s/g, ''))) {
      newErrors.phoneNumber = language === 'en' ? 'Invalid phone number format' : 'தவறான தொலைபேசி எண் வடிவம்';
    }

    if (!formData.venue.trim()) {
      newErrors.venue = language === 'en' ? 'Venue is required' : 'இடம் தேவை';
    }

    if (!formData.startDate) {
      newErrors.startDate = language === 'en' ? 'Start date is required' : 'தொடக்க தேதி தேவை';
    }

    if (!formData.endDate) {
      newErrors.endDate = language === 'en' ? 'End date is required' : 'முடிவு தேதி தேவை';
    }

    if (formData.startDate && formData.endDate && formData.startDate > formData.endDate) {
      newErrors.endDate = language === 'en' ? 'End date must be after start date' : 'முடிவு தேதி தொடக்க தேதிக்குப் பிறகு இருக்க வேண்டும்';
    }

    const selectedSessions = formData.sessionsPerDay.filter(s => s.isSelected);
    if (selectedSessions.length === 0) {
      newErrors.sessionsPerDay = language === 'en' ? 'At least one session must be selected' : 'குறைந்தது ஒரு அமர்வு தேர்ந்தெடுக்கப்பட வேண்டும்';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onNext(formData);
    } else {
      toast({
        title: language === 'en' ? 'Validation Error' : 'சரிபார்ப்பு பிழை',
        description: language === 'en' ? 'Please fix the errors before continuing' : 'தொடர்வதற்கு முன் பிழைகளை சரிசெய்யவும்',
        variant: 'destructive',
      });
    }
  };

  const selectedSessions = formData.sessionsPerDay.filter(s => s.isSelected);

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'} py-8`}>
      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className={`text-4xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>
            {language === 'en' ? 'Event Details' : 'நிகழ்வு விவரங்கள்'}
          </h1>
          <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'} max-w-2xl mx-auto`}>
            {language === 'en' 
              ? 'Tell us about your event and we\'ll help you plan the perfect catering experience'
              : 'உங்கள் நிகழ்வைப் பற்றி எங்களிடம் கூறுங்கள், நாங்கள் சரியான உணவு வழங்கல் அனுபவத்தை திட்டமிட உதவுவோம்'
            }
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Client Information */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-lg`}>
              <CardHeader>
                <CardTitle className={`${isDark ? 'text-white' : 'text-gray-900'} flex items-center gap-2`}>
                  <User className="h-5 w-5" />
                  {language === 'en' ? 'Client Information' : 'வாடிக்கையாளர் தகவல்'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="clientName" className={isDark ? 'text-gray-200' : 'text-gray-700'}>
                    {language === 'en' ? 'Client Name *' : 'வாடிக்கையாளர் பெயர் *'}
                  </Label>
                  <Input
                    id="clientName"
                    value={formData.clientName}
                    onChange={(e) => handleInputChange('clientName', e.target.value)}
                    className={`${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} ${
                      errors.clientName ? 'border-red-500' : ''
                    }`}
                    placeholder={language === 'en' ? 'Enter client name' : 'வாடிக்கையாளர் பெயரை உள்ளிடவும்'}
                  />
                  {errors.clientName && (
                    <p className="text-red-500 text-sm">{errors.clientName}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phoneNumber" className={isDark ? 'text-gray-200' : 'text-gray-700'}>
                    {language === 'en' ? 'Phone Number *' : 'தொலைபேசி எண் *'}
                  </Label>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                    className={`${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} ${
                      errors.phoneNumber ? 'border-red-500' : ''
                    }`}
                    placeholder={language === 'en' ? 'Enter phone number' : 'தொலைபேசி எண்ணை உள்ளிடவும்'}
                  />
                  {errors.phoneNumber && (
                    <p className="text-red-500 text-sm">{errors.phoneNumber}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="venue" className={isDark ? 'text-gray-200' : 'text-gray-700'}>
                    {language === 'en' ? 'Venue *' : 'இடம் *'}
                  </Label>
                  <Input
                    id="venue"
                    value={formData.venue}
                    onChange={(e) => handleInputChange('venue', e.target.value)}
                    className={`${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} ${
                      errors.venue ? 'border-red-500' : ''
                    }`}
                    placeholder={language === 'en' ? 'Enter venue address' : 'இட முகவரியை உள்ளிடவும்'}
                  />
                  {errors.venue && (
                    <p className="text-red-500 text-sm">{errors.venue}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Event Dates and Sessions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-6"
          >
            {/* Event Dates */}
            <Card className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-lg`}>
              <CardHeader>
                <CardTitle className={`${isDark ? 'text-white' : 'text-gray-900'} flex items-center gap-2`}>
                  <CalendarDays className="h-5 w-5" />
                  {language === 'en' ? 'Event Dates' : 'நிகழ்வு தேதிகள்'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className={isDark ? 'text-gray-200' : 'text-gray-700'}>
                      {language === 'en' ? 'Start Date *' : 'தொடக்க தேதி *'}
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={`w-full justify-start text-left font-normal ${
                            isDark ? 'bg-gray-700 border-gray-600 text-white hover:bg-gray-600' : 'bg-white border-gray-300 text-gray-900 hover:bg-gray-50'
                          } ${errors.startDate ? 'border-red-500' : ''}`}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4 opacity-50" />
                          {selectedStartDate ? format(selectedStartDate, 'PPP') : (
                            <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>
                              {language === 'en' ? 'Pick a date' : 'தேதியைத் தேர்ந்தெடுக்கவும்'}
                            </span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={selectedStartDate}
                          onSelect={(date) => handleDateChange(date, true)}
                          disabled={(date) => date < startOfDay(new Date())}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    {errors.startDate && (
                      <p className="text-red-500 text-sm">{errors.startDate}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className={isDark ? 'text-gray-200' : 'text-gray-700'}>
                      {language === 'en' ? 'End Date *' : 'முடிவு தேதி *'}
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={`w-full justify-start text-left font-normal ${
                            isDark ? 'bg-gray-700 border-gray-600 text-white hover:bg-gray-600' : 'bg-white border-gray-300 text-gray-900 hover:bg-gray-50'
                          } ${errors.endDate ? 'border-red-500' : ''}`}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4 opacity-50" />
                          {selectedEndDate ? format(selectedEndDate, 'PPP') : (
                            <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>
                              {language === 'en' ? 'Pick a date' : 'தேதியைத் தேர்ந்தெடுக்கவும்'}
                            </span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={selectedEndDate}
                          onSelect={(date) => handleDateChange(date, false)}
                          disabled={(date) => !selectedStartDate || date < selectedStartDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    {errors.endDate && (
                      <p className="text-red-500 text-sm">{errors.endDate}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className={isDark ? 'text-gray-200' : 'text-gray-700'}>
                    {language === 'en' ? 'Number of Days' : 'நாட்களின் எண்ணிக்கை'}
                  </Label>
                  <div className="flex items-center space-x-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleNumberOfDaysChange(formData.numberOfDays - 1)}
                      className="w-10 h-10 p-0"
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <div className={`w-20 text-center text-lg font-semibold ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>
                      {formData.numberOfDays}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleNumberOfDaysChange(formData.numberOfDays + 1)}
                      className="w-10 h-10 p-0"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Session Selection */}
            <Card className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-lg`}>
              <CardHeader>
                <CardTitle className={`${isDark ? 'text-white' : 'text-gray-900'} flex items-center gap-2`}>
                  <Clock className="h-5 w-5" />
                  {language === 'en' ? 'Daily Sessions' : 'தினசரி அமர்வுகள்'}
                </CardTitle>
                <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  {language === 'en' 
                    ? 'Select which meals to serve each day'
                    : 'ஒவ்வொரு நாளும் எந்த உணவுகளை வழங்க வேண்டும் எனத் தேர்ந்தெடுக்கவும்'
                  }
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                {formData.sessionsPerDay.map((session) => (
                  <div
                    key={session.id}
                    className={`p-4 rounded-lg border transition-all ${
                      session.isSelected
                        ? isDark 
                          ? 'border-blue-500 bg-blue-900/20' 
                          : 'border-blue-500 bg-blue-50'
                        : isDark 
                          ? 'border-gray-600 hover:border-gray-500' 
                          : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          checked={session.isSelected}
                          onCheckedChange={() => toggleSession(session.id)}
                        />
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl">{session.icon}</span>
                          <div>
                            <div className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                              {language === 'en' ? session.name : session.name_ta}
                            </div>
                            <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                              {language === 'en' ? session.name_ta : session.name}
                            </div>
                          </div>
                        </div>
                      </div>
                      <Badge variant={session.isSelected ? 'default' : 'secondary'}>
                        {session.isSelected ? (language === 'en' ? 'Selected' : 'தேர்ந்தெடுக்கப்பட்டது') : (language === 'en' ? 'Not Selected' : 'தேர்ந்தெடுக்கப்படவில்லை')}
                      </Badge>
                    </div>

                    {session.isSelected && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-3 pt-3 border-t border-gray-200 dark:border-gray-600"
                      >
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Label className={`text-xs ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                              {language === 'en' ? 'Start Time' : 'தொடக்க நேரம்'}
                            </Label>
                            <Input
                              type="time"
                              value={session.defaultStartTime}
                              onChange={(e) => updateSessionTime(session.id, 'defaultStartTime', e.target.value)}
                              className={`text-sm ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                            />
                          </div>
                          <div>
                            <Label className={`text-xs ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                              {language === 'en' ? 'End Time' : 'முடிவு நேரம்'}
                            </Label>
                            <Input
                              type="time"
                              value={session.defaultEndTime}
                              onChange={(e) => updateSessionTime(session.id, 'defaultEndTime', e.target.value)}
                              className={`text-sm ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                            />
                          </div>
                        </div>
                        <div>
                          <Label className={`text-xs ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                            {language === 'en' ? 'Default Headcount' : 'இயல்புநிலை தலை எண்ணிக்கை'}
                          </Label>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateSessionHeadCount(session.id, session.defaultHeadCount - 1)}
                              className="w-8 h-8 p-0"
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                            <Input
                              type="number"
                              value={session.defaultHeadCount}
                              onChange={(e) => updateSessionHeadCount(session.id, parseInt(e.target.value) || 1)}
                              className={`w-16 text-center text-sm ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                              min="1"
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateSessionHeadCount(session.id, session.defaultHeadCount + 1)}
                              className="w-8 h-8 p-0"
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                ))}

                {errors.sessionsPerDay && (
                  <p className="text-red-500 text-sm">{errors.sessionsPerDay}</p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Summary and Continue Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-8"
        >
          <Card className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-lg`}>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="text-center md:text-left">
                  <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>
                    {language === 'en' ? 'Event Summary' : 'நிகழ்வு சுருக்கம்'}
                  </h3>
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4" />
                      <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                        {language === 'en' ? 'Client' : 'வாடிக்கையாளர்'}: {formData.clientName || (language === 'en' ? 'Not specified' : 'குறிப்பிடப்படவில்லை')}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4" />
                      <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                        {language === 'en' ? 'Venue' : 'இடம்'}: {formData.venue || (language === 'en' ? 'Not specified' : 'குறிப்பிடப்படவில்லை')}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CalendarDays className="w-4 h-4" />
                      <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                        {language === 'en' ? 'Duration' : 'காலம்'}: {formData.numberOfDays} {language === 'en' ? 'day(s)' : 'நாள்(கள்)'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4" />
                      <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                        {language === 'en' ? 'Sessions' : 'அமர்வுகள்'}: {selectedSessions.length}
                      </span>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleSubmit}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-8 text-lg shadow-lg"
                  size="lg"
                  disabled={!formData.clientName || !formData.phoneNumber || !formData.venue || !formData.startDate || !formData.endDate || selectedSessions.length === 0}
                >
                  {language === 'en' ? 'Continue to Session Planning' : 'அமர்வு திட்டமிடலுக்கு தொடரவும்'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default EventDetails;
