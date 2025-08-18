import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Clock, 
  Users, 
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
  AlertTriangle,
  Info,
  ChevronDown,
  ChefHat as ChefHatIcon,
  Target,
  TrendingUp,
  BarChart3
} from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useToast } from '@/hooks/use-toast';

interface SessionPlanningMicroserviceProps {
  language: 'en' | 'ta';
  eventData?: any;
  onSessionUpdate?: (sessions: any[]) => void;
  initialSessions?: any[];
  showAdvancedFeatures?: boolean;
}

interface Session {
  id: string;
  name: string;
  name_ta: string;
  timeWindow: {
    startTime: string;
    endTime: string;
  };
  headCount: number;
  selectedItems: any[];
  dietaryRestrictions: string[];
  serviceStaff: number;
  specialInstructions: string;
  estimatedCost: number;
  status: 'planned' | 'in-progress' | 'completed';
  notes: string;
}

const SessionPlanningMicroservice: React.FC<SessionPlanningMicroserviceProps> = ({
  language,
  eventData,
  onSessionUpdate,
  initialSessions = [],
  showAdvancedFeatures = true
}) => {
  const { resolvedTheme } = useTheme();
  const { toast } = useToast();
  const isDark = resolvedTheme === 'dark';
  
  // State management
  const [sessions, setSessions] = useState<Session[]>([]);
  const [currentSession, setCurrentSession] = useState<string | null>(null);
  const [editingSession, setEditingSession] = useState<string | null>(null);
  const [showSessionSummary, setShowSessionSummary] = useState(false);
  const [viewMode, setViewMode] = useState<'timeline' | 'grid' | 'list'>('timeline');
  const [filterStatus, setFilterStatus] = useState<'all' | 'planned' | 'in-progress' | 'completed'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [tempSessionData, setTempSessionData] = useState<Partial<Session>>({});

  // Initialize sessions
  useEffect(() => {
    if (initialSessions.length > 0) {
      setSessions(initialSessions);
    } else {
      // Create default sessions
      const defaultSessions: Session[] = [
        {
          id: 'breakfast',
          name: 'Breakfast',
          name_ta: 'காலை உணவு',
          timeWindow: { startTime: '07:00', endTime: '09:00' },
          headCount: 50,
          selectedItems: [],
          dietaryRestrictions: [],
          serviceStaff: 2,
          specialInstructions: '',
          estimatedCost: 0,
          status: 'planned',
          notes: ''
        },
        {
          id: 'lunch',
          name: 'Lunch',
          name_ta: 'மதிய உணவு',
          timeWindow: { startTime: '12:00', endTime: '15:00' },
          headCount: 100,
          selectedItems: [],
          dietaryRestrictions: [],
          serviceStaff: 4,
          specialInstructions: '',
          estimatedCost: 0,
          status: 'planned',
          notes: ''
        },
        {
          id: 'dinner',
          name: 'Dinner',
          name_ta: 'மாலை உணவு',
          timeWindow: { startTime: '19:00', endTime: '22:00' },
          headCount: 80,
          selectedItems: [],
          dietaryRestrictions: [],
          serviceStaff: 3,
          specialInstructions: '',
          estimatedCost: 0,
          status: 'planned',
          notes: ''
        }
      ];
      setSessions(defaultSessions);
      setCurrentSession(defaultSessions[0].id);
    }
  }, [initialSessions]);

  // Filtered sessions
  const filteredSessions = useMemo(() => {
    return sessions.filter(session => {
      const matchesStatus = filterStatus === 'all' || session.status === filterStatus;
      const matchesSearch = 
        session.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        session.name_ta.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [sessions, filterStatus, searchTerm]);

  // Current session data
  const currentSessionData = useMemo(() => {
    return sessions.find(s => s.id === currentSession) || sessions[0];
  }, [sessions, currentSession]);

  // Session management functions
  const updateSession = (sessionId: string, updates: Partial<Session>) => {
    setSessions(prev => prev.map(session => 
      session.id === sessionId ? { ...session, ...updates } : session
    ));
    
    if (onSessionUpdate) {
      onSessionUpdate(sessions);
    }
  };

  const startEditingSession = (sessionId: string) => {
    const session = sessions.find(s => s.id === sessionId);
    if (session) {
      setEditingSession(sessionId);
      setTempSessionData({
        timeWindow: { ...session.timeWindow },
        headCount: session.headCount,
        specialInstructions: session.specialInstructions,
        notes: session.notes
      });
    }
  };

  const saveSessionEdit = () => {
    if (editingSession && tempSessionData.timeWindow && tempSessionData.headCount !== undefined) {
      updateSession(editingSession, {
        timeWindow: tempSessionData.timeWindow,
        headCount: tempSessionData.headCount,
        specialInstructions: tempSessionData.specialInstructions || '',
        notes: tempSessionData.notes || ''
      });
      
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

  const updateSessionStatus = (sessionId: string, status: Session['status']) => {
    updateSession(sessionId, { status });
  };

  const addDietaryRestriction = (sessionId: string, restriction: string) => {
    const session = sessions.find(s => s.id === sessionId);
    if (session && !session.dietaryRestrictions.includes(restriction)) {
      updateSession(sessionId, {
        dietaryRestrictions: [...session.dietaryRestrictions, restriction]
      });
    }
  };

  const removeDietaryRestriction = (sessionId: string, restriction: string) => {
    const session = sessions.find(s => s.id === sessionId);
    if (session) {
      updateSession(sessionId, {
        dietaryRestrictions: session.dietaryRestrictions.filter(r => r !== restriction)
      });
    }
  };

  const calculateSessionCost = (session: Session) => {
    const itemCosts = session.selectedItems.reduce((total, item) => {
      return total + (item.estimatedCost || 0) * session.headCount;
    }, 0);
    
    const staffCost = session.serviceStaff * 150 * 4; // 4 hours per session
    return itemCosts + staffCost;
  };

  const getSessionProgress = () => {
    const totalSessions = sessions.length;
    const completedSessions = sessions.filter(s => s.status === 'completed').length;
    const inProgressSessions = sessions.filter(s => s.status === 'in-progress').length;
    
    return {
      total: totalSessions,
      completed: completedSessions,
      inProgress: inProgressSessions,
      planned: totalSessions - completedSessions - inProgressSessions,
      percentage: (completedSessions / totalSessions) * 100
    };
  };

  const exportSessionReport = () => {
    const report = {
      eventName: eventData?.eventName || 'Event',
      totalSessions: sessions.length,
      sessions: sessions.map(session => ({
        name: session.name,
        timeWindow: session.timeWindow,
        headCount: session.headCount,
        status: session.status,
        estimatedCost: calculateSessionCost(session),
        selectedItems: session.selectedItems.length,
        dietaryRestrictions: session.dietaryRestrictions.length,
        serviceStaff: session.serviceStaff
      })),
      summary: {
        totalHeadCount: sessions.reduce((sum, s) => sum + s.headCount, 0),
        totalEstimatedCost: sessions.reduce((sum, s) => sum + calculateSessionCost(s), 0),
        totalServiceStaff: sessions.reduce((sum, s) => sum + s.serviceStaff, 0)
      }
    };

    const jsonString = JSON.stringify(report, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `session-report-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const progress = getSessionProgress();

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
          <h1 className={`text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {language === 'en' ? 'Session Planning' : 'அமர்வு திட்டமிடல்'}
          </h1>
          <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'} mb-6`}>
            {language === 'en' 
              ? 'Plan and manage your event sessions efficiently'
              : 'உங்கள் நிகழ்வு அமர்வுகளை திறமையாக திட்டமிட்டு நிர்வகிக்கவும்'
            }
          </p>
        </motion.div>

        {/* Progress Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <Card className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-lg`}>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className={`text-3xl font-bold text-blue-600 mb-2`}>
                    {progress.total}
                  </div>
                  <div className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    {language === 'en' ? 'Total Sessions' : 'மொத்த அமர்வுகள்'}
                  </div>
                </div>
                
                <div className="text-center">
                  <div className={`text-3xl font-bold text-green-600 mb-2`}>
                    {progress.completed}
                  </div>
                  <div className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    {language === 'en' ? 'Completed' : 'முடிந்தது'}
                  </div>
                </div>
                
                <div className="text-center">
                  <div className={`text-3xl font-bold text-yellow-600 mb-2`}>
                    {progress.inProgress}
                  </div>
                  <div className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    {language === 'en' ? 'In Progress' : 'நடைபெறுகிறது'}
                  </div>
                </div>
                
                <div className="text-center">
                  <div className={`text-3xl font-bold text-purple-600 mb-2`}>
                    {progress.percentage.toFixed(0)}%
                  </div>
                  <div className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    {language === 'en' ? 'Progress' : 'முன்னேற்றம்'}
                  </div>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className={`mt-6 ${isDark ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-3`}>
                <motion.div 
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress.percentage}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Controls and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-6"
        >
          <Card className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-lg`}>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      placeholder={language === 'en' ? 'Search sessions...' : 'அமர்வுகளைத் தேடுங்கள்...'}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className={`pl-10 w-64 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                    />
                  </div>
                  
                  <Select value={filterStatus} onValueChange={(value) => setFilterStatus(value as any)}>
                    <SelectTrigger className={`w-40 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{language === 'en' ? 'All Status' : 'அனைத்து நிலை'}</SelectItem>
                      <SelectItem value="planned">{language === 'en' ? 'Planned' : 'திட்டமிடப்பட்டது'}</SelectItem>
                      <SelectItem value="in-progress">{language === 'en' ? 'In Progress' : 'நடைபெறுகிறது'}</SelectItem>
                      <SelectItem value="completed">{language === 'en' ? 'Completed' : 'முடிந்தது'}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
                    className="flex items-center gap-2"
                  >
                    <Settings className="w-4 h-4" />
                    {language === 'en' ? 'Advanced' : 'மேம்பட்ட'}
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={exportSessionReport}
                    className="flex items-center gap-2"
                  >
                    <BarChart3 className="w-4 h-4" />
                    {language === 'en' ? 'Export' : 'ஏற்றுமதி'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Sessions Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {/* Sessions List */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredSessions.map((session) => (
                <motion.div
                  key={session.id}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card 
                    className={`cursor-pointer transition-all ${
                      currentSession === session.id 
                        ? isDark 
                          ? 'border-blue-500 bg-blue-900/20' 
                          : 'border-blue-500 bg-blue-50'
                        : isDark 
                          ? 'bg-gray-800 border-gray-700 hover:border-gray-600' 
                          : 'bg-white border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setCurrentSession(session.id)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className={`text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {language === 'en' ? session.name : session.name_ta}
                        </CardTitle>
                        <Badge 
                          variant={
                            session.status === 'completed' ? 'default' :
                            session.status === 'in-progress' ? 'secondary' : 'outline'
                          }
                          className={
                            session.status === 'completed' ? 'bg-green-600' :
                            session.status === 'in-progress' ? 'bg-yellow-600' : ''
                          }
                        >
                          {language === 'en' ? session.status : 
                            session.status === 'completed' ? 'முடிந்தது' :
                            session.status === 'in-progress' ? 'நடைபெறுகிறது' : 'திட்டமிடப்பட்டது'
                          }
                        </Badge>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                          {session.timeWindow.startTime} - {session.timeWindow.endTime}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="w-4 h-4 text-gray-500" />
                        <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                          {session.headCount} {language === 'en' ? 'guests' : 'விருந்தினர்கள்'}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm">
                        <ChefHat className="w-4 h-4 text-gray-500" />
                        <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                          {session.selectedItems.length} {language === 'en' ? 'menu items' : 'மெனு பொருட்கள்'}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm">
                        <DollarSign className="w-4 h-4 text-gray-500" />
                        <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                          ₹{calculateSessionCost(session).toLocaleString()}
                        </span>
                      </div>
                      
                      <div className="flex gap-2 pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            startEditingSession(session.id);
                          }}
                          className="flex-1"
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          {language === 'en' ? 'Edit' : 'திருத்து'}
                        </Button>
                        
                        <Select 
                          value={session.status} 
                          onValueChange={(value) => updateSessionStatus(session.id, value as any)}
                        >
                          <SelectTrigger className="flex-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="planned">{language === 'en' ? 'Planned' : 'திட்டமிடப்பட்டது'}</SelectItem>
                            <SelectItem value="in-progress">{language === 'en' ? 'In Progress' : 'நடைபெறுகிறது'}</SelectItem>
                            <SelectItem value="completed">{language === 'en' ? 'Completed' : 'முடிந்தது'}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Session Details */}
          <div className="lg:col-span-1">
            {currentSessionData && (
              <Card className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-lg sticky top-6`}>
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
                    {editingSession === currentSessionData.id ? (
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
                      </div>
                    )}
                  </div>

                  {/* Headcount */}
                  <div className="space-y-2">
                    <Label className={isDark ? 'text-gray-200' : 'text-gray-700'}>
                      {language === 'en' ? 'Headcount' : 'தலை எண்ணிக்கை'}
                    </Label>
                    {editingSession === currentSessionData.id ? (
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
                      </div>
                    )}
                  </div>

                  {/* Special Instructions */}
                  <div className="space-y-2">
                    <Label className={isDark ? 'text-gray-200' : 'text-gray-700'}>
                      {language === 'en' ? 'Special Instructions' : 'சிறப்பு அறிவுறுத்தல்கள்'}
                    </Label>
                    {editingSession === currentSessionData.id ? (
                      <Textarea
                        placeholder={language === 'en' ? 'Any special requirements...' : 'எந்த சிறப்பு தேவைகள்...'}
                        value={tempSessionData.specialInstructions || ''}
                        onChange={(e) => setTempSessionData(prev => ({
                          ...prev,
                          specialInstructions: e.target.value
                        }))}
                        className={`text-sm ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                        rows={2}
                      />
                    ) : (
                      <div className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                        {currentSessionData.specialInstructions || 
                          (language === 'en' ? 'No special instructions' : 'சிறப்பு அறிவுறுத்தல்கள் இல்லை')}
                      </div>
                    )}
                  </div>

                  {/* Edit Actions */}
                  {editingSession === currentSessionData.id && (
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

                  {/* Session Summary */}
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-600">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                          {language === 'en' ? 'Menu Items' : 'மெனு பொருட்கள்'}
                        </span>
                        <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {currentSessionData.selectedItems.length}
                        </span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                          {language === 'en' ? 'Service Staff' : 'சேவை ஊழியர்கள்'}
                        </span>
                        <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {currentSessionData.serviceStaff}
                        </span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                          {language === 'en' ? 'Estimated Cost' : 'மதிப்பிடப்பட்ட செலவு'}
                        </span>
                        <span className={`font-semibold text-green-600`}>
                          ₹{calculateSessionCost(currentSessionData).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SessionPlanningMicroservice;
