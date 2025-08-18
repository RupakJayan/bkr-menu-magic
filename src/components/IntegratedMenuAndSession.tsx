import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  ChefHat, 
  Calendar,
  Users,
  DollarSign,
  CheckCircle,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import MenuSelectionMicroservice from './MenuSelectionMicroservice';
import SessionPlanningMicroservice from './SessionPlanningMicroservice';

interface IntegratedMenuAndSessionProps {
  language: 'en' | 'ta';
  eventData?: any;
  onComplete?: (data: any) => void;
}

const IntegratedMenuAndSession: React.FC<IntegratedMenuAndSessionProps> = ({
  language,
  eventData,
  onComplete
}) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  
  const [activeTab, setActiveTab] = useState('menu');
  const [selectedMenuItems, setSelectedMenuItems] = useState<any[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);
  const [currentStep, setCurrentStep] = useState(1);

  const handleMenuSelection = (items: any[]) => {
    setSelectedMenuItems(items);
    // Auto-advance to next step if items are selected
    if (items.length > 0 && currentStep === 1) {
      setCurrentStep(2);
      setActiveTab('sessions');
    }
  };

  const handleSessionUpdate = (updatedSessions: any[]) => {
    setSessions(updatedSessions);
  };

  const handleComplete = () => {
    if (onComplete) {
      onComplete({
        menuItems: selectedMenuItems,
        sessions: sessions,
        totalCost: selectedMenuItems.reduce((sum, item) => sum + (item.estimatedCost || 0) * (item.quantity || 1), 0),
        totalHeadCount: sessions.reduce((sum, session) => sum + session.headCount, 0)
      });
    }
  };

  const getTotalCost = () => {
    return selectedMenuItems.reduce((sum, item) => sum + (item.estimatedCost || 0) * (item.quantity || 1), 0);
  };

  const getTotalItems = () => {
    return selectedMenuItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
  };

  const getTotalHeadCount = () => {
    return sessions.reduce((sum, session) => sum + session.headCount, 0);
  };

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
            {language === 'en' ? 'Event Planning Hub' : 'நிகழ்வு திட்டமிடல் மையம்'}
          </h1>
          <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'} mb-6`}>
            {language === 'en' 
              ? 'Plan your menu and sessions in one place'
              : 'ஒரு இடத்தில் உங்கள் மெனு மற்றும் அமர்வுகளைத் திட்டமிடுங்கள்'
            }
          </p>
        </motion.div>

        {/* Progress Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <Card className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-lg`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className={`flex items-center gap-2 ${currentStep >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
                  }`}>
                    1
                  </div>
                  <span className="font-medium">
                    {language === 'en' ? 'Menu Selection' : 'மெனு தேர்வு'}
                  </span>
                </div>
                
                <ArrowRight className={`w-6 h-6 ${currentStep >= 2 ? 'text-blue-600' : 'text-gray-400'}`} />
                
                <div className={`flex items-center gap-2 ${currentStep >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
                  }`}>
                    2
                  </div>
                  <span className="font-medium">
                    {language === 'en' ? 'Session Planning' : 'அமர்வு திட்டமிடல்'}
                  </span>
                </div>
                
                <ArrowRight className={`w-6 h-6 ${currentStep >= 3 ? 'text-blue-600' : 'text-gray-400'}`} />
                
                <div className={`flex items-center gap-2 ${currentStep >= 3 ? 'text-blue-600' : 'text-gray-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    currentStep >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
                  }`}>
                    3
                  </div>
                  <span className="font-medium">
                    {language === 'en' ? 'Review & Complete' : 'மதிப்பாய்வு & முடித்தல்'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Summary Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-lg`}>
              <CardContent className="p-4 text-center">
                <ChefHat className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-600">{getTotalItems()}</div>
                <div className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  {language === 'en' ? 'Menu Items' : 'மெனு பொருட்கள்'}
                </div>
              </CardContent>
            </Card>
            
            <Card className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-lg`}>
              <CardContent className="p-4 text-center">
                <Calendar className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-600">{sessions.length}</div>
                <div className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  {language === 'en' ? 'Sessions' : 'அமர்வுகள்'}
                </div>
              </CardContent>
            </Card>
            
            <Card className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-lg`}>
              <CardContent className="p-4 text-center">
                <Users className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-purple-600">{getTotalHeadCount()}</div>
                <div className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  {language === 'en' ? 'Total Guests' : 'மொத்த விருந்தினர்கள்'}
                </div>
              </CardContent>
            </Card>
            
            <Card className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-lg`}>
              <CardContent className="p-4 text-center">
                <DollarSign className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-orange-600">₹{getTotalCost().toLocaleString()}</div>
                <div className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  {language === 'en' ? 'Total Cost' : 'மொத்த செலவு'}
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Main Content Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-8"
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger 
                value="menu" 
                onClick={() => setCurrentStep(1)}
                className="flex items-center gap-2"
              >
                <ChefHat className="w-4 h-4" />
                {language === 'en' ? 'Menu Selection' : 'மெனு தேர்வு'}
                {selectedMenuItems.length > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {selectedMenuItems.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger 
                value="sessions" 
                onClick={() => setCurrentStep(2)}
                className="flex items-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                {language === 'en' ? 'Session Planning' : 'அமர்வு திட்டமிடல்'}
                {sessions.length > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {sessions.length}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="menu" className="mt-0">
              <MenuSelectionMicroservice
                language={language}
                onMenuSelection={handleMenuSelection}
                initialSelection={selectedMenuItems}
                showPricing={true}
                allowMultiple={true}
              />
            </TabsContent>

            <TabsContent value="sessions" className="mt-0">
              <SessionPlanningMicroservice
                language={language}
                eventData={eventData}
                onSessionUpdate={handleSessionUpdate}
                initialSessions={sessions}
                showAdvancedFeatures={true}
              />
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Navigation and Complete */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex justify-between items-center"
        >
          <Button
            variant="outline"
            onClick={() => {
              if (currentStep > 1) {
                setCurrentStep(currentStep - 1);
                setActiveTab(currentStep === 2 ? 'menu' : 'sessions');
              }
            }}
            disabled={currentStep === 1}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            {language === 'en' ? 'Previous' : 'முந்தைய'}
          </Button>

          <div className="flex gap-4">
            {currentStep < 3 && (
              <Button
                onClick={() => {
                  if (currentStep === 1 && selectedMenuItems.length > 0) {
                    setCurrentStep(2);
                    setActiveTab('sessions');
                  } else if (currentStep === 2 && sessions.length > 0) {
                    setCurrentStep(3);
                  }
                }}
                disabled={
                  (currentStep === 1 && selectedMenuItems.length === 0) ||
                  (currentStep === 2 && sessions.length === 0)
                }
                className="flex items-center gap-2"
              >
                {language === 'en' ? 'Next' : 'அடுத்து'}
                <ArrowRight className="w-4 h-4" />
              </Button>
            )}

            {currentStep === 3 && (
              <Button
                onClick={handleComplete}
                disabled={selectedMenuItems.length === 0 || sessions.length === 0}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="w-4 h-4" />
                {language === 'en' ? 'Complete Planning' : 'திட்டமிடலை முடிக்கவும்'}
              </Button>
            )}
          </div>
        </motion.div>

        {/* Review Section */}
        {currentStep === 3 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-8"
          >
            <Card className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-lg`}>
              <CardHeader>
                <CardTitle className={`${isDark ? 'text-white' : 'text-gray-900'} flex items-center gap-2`}>
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  {language === 'en' ? 'Planning Summary' : 'திட்டமிடல் சுருக்கம்'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Menu Summary */}
                  <div>
                    <h3 className={`font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {language === 'en' ? 'Selected Menu Items' : 'தேர்ந்தெடுக்கப்பட்ட மெனு பொருட்கள்'}
                    </h3>
                    <div className="space-y-2">
                      {selectedMenuItems.map((item, index) => (
                        <div key={index} className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700 rounded">
                          <span className={`text-sm ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                            {language === 'en' ? item.name_en : item.name_ta}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">x{item.quantity}</span>
                            <span className="text-sm font-medium">₹{item.estimatedCost || 0}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Sessions Summary */}
                  <div>
                    <h3 className={`font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {language === 'en' ? 'Planned Sessions' : 'திட்டமிடப்பட்ட அமர்வுகள்'}
                    </h3>
                    <div className="space-y-2">
                      {sessions.map((session, index) => (
                        <div key={index} className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700 rounded">
                          <div>
                            <span className={`text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                              {language === 'en' ? session.name : session.name_ta}
                            </span>
                            <div className="text-xs text-gray-500">
                              {session.timeWindow.startTime} - {session.timeWindow.endTime}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium">{session.headCount} {language === 'en' ? 'guests' : 'விருந்தினர்கள்'}</div>
                            <div className="text-xs text-gray-500">{session.status}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Final Summary */}
                <div className="pt-4 border-t border-gray-200 dark:border-gray-600">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-blue-600">{getTotalItems()}</div>
                      <div className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                        {language === 'en' ? 'Total Menu Items' : 'மொத்த மெனு பொருட்கள்'}
                      </div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">{getTotalHeadCount()}</div>
                      <div className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                        {language === 'en' ? 'Total Guests' : 'மொத்த விருந்தினர்கள்'}
                      </div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-orange-600">₹{getTotalCost().toLocaleString()}</div>
                      <div className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                        {language === 'en' ? 'Total Estimated Cost' : 'மொத்த மதிப்பிடப்பட்ட செலவு'}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default IntegratedMenuAndSession;
