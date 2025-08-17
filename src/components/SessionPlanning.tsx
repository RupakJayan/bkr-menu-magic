import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { 
  Clock, 
  Users, 
  Plus, 
  Trash2, 
  ArrowLeft, 
  ArrowRight, 
  Calendar, 
  Edit3,
  ChefHat,
  Utensils,
  Coffee,
  Pizza,
  Cake,
  Package,
  MoreHorizontal
} from 'lucide-react';
import { DayPlan, SessionPlan, SessionType } from '../types/eventTypes';
import { sessionTypes, addCustomSession, removeSession } from '../utils/eventPlanningUtils';

interface SessionPlanningProps {
  language: 'en' | 'ta';
  days: DayPlan[];
  onSessionUpdate: (dayIndex: number, sessionIndex: number, updates: Partial<SessionPlan>) => void;
  updateDays: (days: DayPlan[]) => void;
  canProceed?: boolean;
  onPrevious?: () => void;
  onNext?: () => void;
}

const SessionPlanning: React.FC<SessionPlanningProps> = ({
  language,
  days,
  onSessionUpdate,
  updateDays,
  canProceed = true,
  onPrevious,
  onNext
}) => {
  const [currentDayIndex, setCurrentDayIndex] = useState(0);
  const [editingSession, setEditingSession] = useState<string | null>(null);
  const [showCustomSessionForm, setShowCustomSessionForm] = useState(false);
  const [showSessionTypeSelector, setShowSessionTypeSelector] = useState(false);
  const [customSessionData, setCustomSessionData] = useState({
    name: '',
    nameTa: '',
    startTime: '08:00',
    endTime: '10:00',
    headCount: 50
  });

  const currentDay = days[currentDayIndex];
  const totalDays = days.length;

  const handleAddCustomSession = () => {
    if (!currentDay) {
      console.error('Current day is undefined');
      return;
    }
    if (customSessionData.name && customSessionData.nameTa) {
      const newDay = addCustomSession(
        currentDay,
        customSessionData.name,
        customSessionData.nameTa,
        customSessionData.startTime,
        customSessionData.endTime,
        customSessionData.headCount
      );
      
      const newDays = [...days];
      newDays[currentDayIndex] = newDay;
      updateDays(newDays);
      
      // Reset form
      setCustomSessionData({
        name: '',
        nameTa: '',
        startTime: '08:00',
        endTime: '10:00',
        headCount: 50
      });
      setShowCustomSessionForm(false);
    }
  };

  const handleRemoveSession = (sessionId: string) => {
    if (!currentDay) {
      console.error('Current day is undefined');
      return;
    }
    const newDay = removeSession(currentDay, sessionId);
    const newDays = [...days];
    newDays[currentDayIndex] = newDay;
    updateDays(newDays);
  };

  const handleAddPredefinedSession = (sessionType: SessionType) => {
    if (!currentDay) {
      console.error('Current day is undefined');
      return;
    }
    const newSession: SessionPlan = {
      id: `${currentDay.dayNumber}-${sessionType.id}-${Date.now()}`,
      sessionName: sessionType.name,
      sessionNameTa: sessionType.name_ta,
      sessionType: sessionType.id as any,
      timeRange: {
        startTime: sessionType.defaultStartTime,
        endTime: sessionType.defaultEndTime
      },
      headCount: sessionType.defaultHeadCount,
      items: [],
      notes: ''
    };

    const newDay = {
      ...currentDay,
      sessions: [...currentDay.sessions, newSession]
    };

    const newDays = [...days];
    newDays[currentDayIndex] = newDay;
    updateDays(newDays);
    setShowSessionTypeSelector(false);
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getTotalHeadCount = () => {
    return currentDay.sessions.reduce((total, session) => total + session.headCount, 0);
  };

  const getTotalSessions = () => {
    return currentDay.sessions.length;
  };

  const getSessionIcon = (sessionType: string) => {
    switch (sessionType) {
      case 'breakfast': return <Coffee className="w-4 h-4" />;
      case 'lunch': return <Utensils className="w-4 h-4" />;
      case 'dinner': return <ChefHat className="w-4 h-4" />;
      case 'snacks': return <Pizza className="w-4 h-4" />;
      case 'packing': return <Package className="w-4 h-4" />;
      default: return <MoreHorizontal className="w-4 h-4" />;
    }
  };

  return (
    <Card className="bg-gradient-to-br from-white/95 to-blue-50/95 dark:from-slate-800/95 dark:to-blue-900/95 backdrop-blur-sm border-0 shadow-2xl">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-t-xl">
        <CardTitle className="flex items-center gap-3 text-2xl">
          <Calendar className="w-8 h-8 text-primary" />
          {language === 'en' ? 'Session Planning' : 'அமர்வு திட்டமிடல்'}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-8 space-y-8">
        {/* Day Navigation with Enhanced UI */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-2xl p-6 border border-blue-200/50 dark:border-blue-700/50"
        >
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={() => setCurrentDayIndex(Math.max(0, currentDayIndex - 1))}
              disabled={currentDayIndex === 0}
              size="lg"
              className="bg-white/80 dark:bg-slate-700/80 hover:bg-white dark:hover:bg-slate-600 border-blue-300 dark:border-blue-600"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              {language === 'en' ? 'Previous Day' : 'முந்தைய நாள்'}
            </Button>
            
            <div className="text-center">
              <motion.div
                key={currentDayIndex}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="space-y-2"
              >
                <h3 className="text-3xl font-bold text-blue-900 dark:text-blue-100">
                  {language === 'en' ? `Day ${currentDay.dayNumber}` : `நாள் ${currentDay.dayNumber}`}
                </h3>
                <p className="text-lg text-blue-700 dark:text-blue-300 font-medium">
                  {new Date(currentDay.date).toLocaleDateString(language === 'en' ? 'en-US' : 'ta-IN', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </motion.div>
              
              {/* Day Indicators */}
              <div className="flex gap-3 mt-4 justify-center">
                {days.map((_, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setCurrentDayIndex(index)}
                    className={`w-4 h-4 rounded-full cursor-pointer transition-all duration-300 ${
                      index === currentDayIndex 
                        ? 'bg-primary scale-125 shadow-lg' 
                        : 'bg-blue-300 dark:bg-blue-600 hover:bg-blue-400 dark:hover:bg-blue-500'
                    }`}
                  />
                ))}
              </div>
            </div>
            
            <Button
              variant="outline"
              onClick={() => setCurrentDayIndex(Math.min(totalDays - 1, currentDayIndex + 1))}
              disabled={currentDayIndex === totalDays - 1}
              size="lg"
              className="bg-white/80 dark:bg-slate-700/80 hover:bg-white dark:hover:bg-slate-600 border-blue-300 dark:border-blue-600"
            >
              {language === 'en' ? 'Next Day' : 'அடுத்த நாள்'} →
            </Button>
          </div>
        </motion.div>

        {/* Day Summary with Enhanced Stats */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 rounded-2xl p-6 border border-green-200/50 dark:border-green-700/50"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            <div className="space-y-2">
              <div className="text-4xl font-bold text-green-600 dark:text-green-400">
                {getTotalSessions()}
              </div>
              <div className="text-sm text-green-700 dark:text-green-300 font-medium">
                {language === 'en' ? 'Total Sessions' : 'மொத்த அமர்வுகள்'}
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                {getTotalHeadCount()}
              </div>
              <div className="text-sm text-blue-700 dark:text-blue-300 font-medium">
                {language === 'en' ? 'Total Headcount' : 'மொத்த தலை எண்ணிக்கை'}
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-purple-600 dark:text-purple-400">
                {currentDay.sessions.filter(s => s.items.length > 0).length}
              </div>
              <div className="text-sm text-purple-700 dark:text-purple-300 font-medium">
                {language === 'en' ? 'With Menu' : 'மெனு உடன்'}
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-orange-600 dark:text-orange-400">
                {Math.round(getTotalHeadCount() / Math.max(getTotalSessions(), 1))}
              </div>
              <div className="text-sm text-orange-700 dark:text-orange-300 font-medium">
                {language === 'en' ? 'Avg. Per Session' : 'ஒரு அமர்வுக்கு சராசரி'}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Session Management */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-foreground">
              {language === 'en' ? 'Sessions' : 'அமர்வுகள்'}
            </h3>
            <div className="flex gap-3">
              <Button
                onClick={() => setShowSessionTypeSelector(!showSessionTypeSelector)}
                variant="outline"
                size="lg"
                className="bg-white/80 dark:bg-slate-700/80 hover:bg-white dark:hover:bg-slate-600 border-green-300 dark:border-green-600"
              >
                <ChefHat className="w-5 h-5 mr-2" />
                {language === 'en' ? 'Add Predefined Session' : 'முன் வரையறுக்கப்பட்ட அமர்வைச் சேர்க்கவும்'}
              </Button>
              <Button
                onClick={() => setShowCustomSessionForm(!showCustomSessionForm)}
                variant="outline"
                size="lg"
                className="bg-white/80 dark:bg-slate-700/80 hover:bg-white dark:hover:bg-slate-600 border-blue-300 dark:border-blue-600"
              >
                <Plus className="w-5 h-5 mr-2" />
                {language === 'en' ? 'Add Custom Session' : 'தனிப்பயன் அமர்வைச் சேர்க்கவும்'}
              </Button>
            </div>
          </div>

          {/* Predefined Session Selector */}
          <AnimatePresence>
            {showSessionTypeSelector && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/30 dark:to-yellow-900/30 rounded-2xl p-6 border border-orange-200/50 dark:border-orange-700/50"
              >
                <h4 className="text-lg font-semibold text-orange-800 dark:text-orange-200 mb-4">
                  {language === 'en' ? 'Select Session Type' : 'அமர்வு வகையைத் தேர்ந்தெடுக்கவும்'}
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {sessionTypes.map((sessionType) => (
                    <motion.div
                      key={sessionType.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        onClick={() => handleAddPredefinedSession(sessionType)}
                        variant="outline"
                        className="w-full h-24 flex flex-col items-center justify-center gap-2 bg-white/80 dark:bg-slate-700/80 hover:bg-white dark:hover:bg-slate-600 border-orange-300 dark:border-orange-600"
                      >
                        <div className="text-2xl">{sessionType.icon}</div>
                        <div className="text-sm font-medium text-center">
                          {language === 'en' ? sessionType.name : sessionType.name_ta}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {formatTime(sessionType.defaultStartTime)} - {formatTime(sessionType.defaultEndTime)}
                        </div>
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Custom Session Form */}
          <AnimatePresence>
            {showCustomSessionForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-2xl p-6 border border-blue-200/50 dark:border-blue-700/50"
              >
                <h4 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-4">
                  {language === 'en' ? 'Create Custom Session' : 'தனிப்பயன் அமர்வை உருவாக்கவும்'}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="customName">
                      {language === 'en' ? 'Session Name (English)' : 'அமர்வு பெயர் (ஆங்கிலம்)'}
                    </Label>
                    <Input
                      id="customName"
                      value={customSessionData.name}
                      onChange={(e) => setCustomSessionData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder={language === 'en' ? 'e.g., High Tea' : 'எ.கா., உயர் தேநீர்'}
                      className="mt-1 bg-white/80 dark:bg-slate-700/80"
                    />
                  </div>
                  <div>
                    <Label htmlFor="customNameTa">
                      {language === 'en' ? 'Session Name (Tamil)' : 'அமர்வு பெயர் (தமிழ்)'}
                    </Label>
                    <Input
                      id="customNameTa"
                      value={customSessionData.nameTa}
                      onChange={(e) => setCustomSessionData(prev => ({ ...prev, nameTa: e.target.value }))}
                      placeholder={language === 'en' ? 'e.g., உயர் தேநீர்' : 'எ.கா., உயர் தேநீர்'}
                      className="mt-1 bg-white/80 dark:bg-slate-700/80"
                    />
                  </div>
                  <div>
                    <Label htmlFor="customStartTime">
                      {language === 'en' ? 'Start Time' : 'தொடக்க நேரம்'}
                    </Label>
                    <Input
                      id="customStartTime"
                      type="time"
                      value={customSessionData.startTime}
                      onChange={(e) => setCustomSessionData(prev => ({ ...prev, startTime: e.target.value }))}
                      className="mt-1 bg-white/80 dark:bg-slate-700/80"
                    />
                  </div>
                  <div>
                    <Label htmlFor="customEndTime">
                      {language === 'en' ? 'End Time' : 'முடிவு நேரம்'}
                    </Label>
                    <Input
                      id="customEndTime"
                      type="time"
                      value={customSessionData.endTime}
                      onChange={(e) => setCustomSessionData(prev => ({ ...prev, endTime: e.target.value }))}
                      className="mt-1 bg-white/80 dark:bg-slate-700/80"
                    />
                  </div>
                  <div>
                    <Label htmlFor="customHeadCount">
                      {language === 'en' ? 'Head Count' : 'தலை எண்ணிக்கை'}
                    </Label>
                    <Input
                      id="customHeadCount"
                      type="number"
                      value={customSessionData.headCount}
                      onChange={(e) => setCustomSessionData(prev => ({ ...prev, headCount: parseInt(e.target.value) || 0 }))}
                      min="1"
                      className="mt-1 bg-white/80 dark:bg-slate-700/80"
                    />
                  </div>
                  <div className="flex items-end gap-2">
                    <Button onClick={handleAddCustomSession} className="flex-1 bg-blue-600 hover:bg-blue-700">
                      {language === 'en' ? 'Add Session' : 'அமர்வைச் சேர்க்கவும்'}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowCustomSessionForm(false)}
                      size="lg"
                      className="bg-white/80 dark:bg-slate-700/80 hover:bg-white dark:hover:bg-slate-600"
                    >
                      {language === 'en' ? 'Cancel' : 'ரத்து'}
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Sessions List with Enhanced UI */}
          <div className="space-y-4">
            {currentDay.sessions.map((session, sessionIndex) => (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: sessionIndex * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="group"
              >
                <Card className="bg-gradient-to-r from-white/90 to-slate-50/90 dark:from-slate-700/90 dark:to-slate-600/90 backdrop-blur-sm border-l-4 border-l-primary shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="flex items-center gap-2">
                            {getSessionIcon(session.sessionType)}
                            <h4 className="text-xl font-bold text-foreground">
                              {language === 'en' ? session.sessionName : session.sessionNameTa}
                            </h4>
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            {session.sessionType}
                          </Badge>
                          {session.sessionType === 'custom' && (
                            <Badge variant="outline" className="text-xs border-orange-300 text-orange-700 dark:text-orange-300">
                              {language === 'en' ? 'Custom' : 'தனிப்பயன்'}
                            </Badge>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-3">
                          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                            <Clock className="w-4 h-4" />
                            <span className="font-medium">
                              {formatTime(session.timeRange.startTime)} - {formatTime(session.timeRange.endTime)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                            <Users className="w-4 h-4" />
                            <span className="font-medium">
                              {session.headCount} {language === 'en' ? 'people' : 'பேர்'}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
                            <span className="font-medium">
                              {session.items.length} {language === 'en' ? 'menu items' : 'மெனு பொருட்கள்'}
                            </span>
                          </div>
                        </div>
                        
                        {session.notes && (
                          <div className="bg-yellow-50 dark:bg-yellow-900/30 p-3 rounded-lg border border-yellow-200 dark:border-yellow-700">
                            <p className="text-sm text-yellow-800 dark:text-yellow-200 italic">
                              "{session.notes}"
                            </p>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingSession(session.id)}
                          className="bg-white/80 dark:bg-slate-700/80 hover:bg-white dark:hover:bg-slate-600"
                        >
                          <Edit3 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemoveSession(session.id)}
                          className="text-destructive hover:text-destructive bg-white/80 dark:bg-slate-700/80 hover:bg-red-50 dark:hover:bg-red-900/30 border-red-300 dark:border-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    {/* Quick Edit Form */}
                    <AnimatePresence>
                      {editingSession === session.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-600"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <Label>
                                {language === 'en' ? 'Start Time' : 'தொடக்க நேரம்'}
                              </Label>
                              <Input
                                type="time"
                                value={session.timeRange.startTime}
                                onChange={(e) => onSessionUpdate(currentDayIndex, sessionIndex, {
                                  timeRange: { ...session.timeRange, startTime: e.target.value }
                                })}
                                className="mt-1 bg-white/80 dark:bg-slate-700/80"
                              />
                            </div>
                            <div>
                              <Label>
                                {language === 'en' ? 'End Time' : 'முடிவு நேரம்'}
                              </Label>
                              <Input
                                type="time"
                                value={session.timeRange.endTime}
                                onChange={(e) => onSessionUpdate(currentDayIndex, sessionIndex, {
                                  timeRange: { ...session.timeRange, endTime: e.target.value }
                                })}
                                className="mt-1 bg-white/80 dark:bg-slate-700/80"
                              />
                            </div>
                            <div>
                              <Label>
                                {language === 'en' ? 'Head Count' : 'தலை எண்ணிக்கை'}
                              </Label>
                              <Input
                                type="number"
                                value={session.headCount}
                                onChange={(e) => onSessionUpdate(currentDayIndex, sessionIndex, {
                                  headCount: parseInt(e.target.value) || 0
                                })}
                                min="1"
                                className="mt-1 bg-white/80 dark:bg-slate-700/80"
                              />
                            </div>
                          </div>
                          <div className="mt-4">
                            <Label>
                              {language === 'en' ? 'Notes' : 'குறிப்புகள்'}
                            </Label>
                            <Textarea
                              value={session.notes || ''}
                              onChange={(e) => onSessionUpdate(currentDayIndex, sessionIndex, {
                                notes: e.target.value
                              })}
                              placeholder={language === 'en' ? 'Add any special notes...' : 'எந்தவொரு சிறப்பு குறிப்புகளையும் சேர்க்கவும்...'}
                              rows={2}
                              className="mt-1 bg-white/80 dark:bg-slate-700/80"
                            />
                          </div>
                          <div className="mt-4 flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => setEditingSession(null)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              {language === 'en' ? 'Save Changes' : 'மாற்றங்களைச் சேமிக்கவும்'}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setEditingSession(null)}
                              className="bg-white/80 dark:bg-slate-700/80 hover:bg-white dark:hover:bg-slate-600"
                            >
                              {language === 'en' ? 'Cancel' : 'ரத்து'}
                            </Button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-6">
          <Button 
            variant="outline"
            onClick={onPrevious}
            size="lg"
            className="bg-white/80 dark:bg-slate-700/80 hover:bg-white dark:hover:bg-slate-600 border-slate-300 dark:border-slate-600"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            {language === 'en' ? 'Previous' : 'முந்தைய'}
          </Button>
          <Button 
            onClick={onNext}
            disabled={!canProceed}
            size="lg"
            className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white shadow-lg"
          >
            {language === 'en' ? 'Next: Menu Selection' : 'அடுத்து: மெனு தேர்வு'}
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SessionPlanning;
