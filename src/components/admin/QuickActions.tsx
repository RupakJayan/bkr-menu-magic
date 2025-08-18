import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Plus, Edit, Download, Settings } from 'lucide-react';
import EventForm from './EventForm';
import DataExport from './DataExport';
import SettingsManagement from './SettingsManagement';
import { useToast } from '../../hooks/use-toast';

interface QuickActionsProps {
  language: 'en' | 'ta';
  isDark: boolean;
}

const QuickActions: React.FC<QuickActionsProps> = ({ language, isDark }) => {
  const [showEventForm, setShowEventForm] = useState(false);
  const [showDataExport, setShowDataExport] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any>(null);
  const { toast } = useToast();

  const handleNewEvent = () => {
    setEditingEvent(null);
    setShowEventForm(true);
  };

  const handleEditEvent = () => {
    // For demo purposes, we'll create a sample event to edit
    const sampleEvent = {
      id: 1,
      name: language === 'en' ? 'Sample Event' : 'மாதிரி நிகழ்வு',
      date: new Date().toISOString().split('T')[0],
      time: '18:00',
      type: 'corporate',
      status: 'draft',
      guests: 50,
      revenue: '₹25,000',
      client: language === 'en' ? 'Sample Client' : 'மாதிரி வாடிக்கையாளர்',
      description: language === 'en' ? 'This is a sample event for editing demonstration' : 'இது திருத்த ஆர்ப்பாட்டத்திற்கான மாதிரி நிகழ்வு',
      venue: language === 'en' ? 'Sample Venue' : 'மாதிரி இருப்பு',
      contactPhone: '+91-98765-43210',
      contactEmail: 'sample@example.com'
    };
    setEditingEvent(sampleEvent);
    setShowEventForm(true);
  };

  const handleExportData = () => {
    setShowDataExport(true);
  };

  const handleSettings = () => {
    setShowSettings(true);
  };

  const handleEventSave = async (eventData: any) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real application, you would call your event service here
      // const savedEvent = await eventService.createEvent(eventData);
      
      toast({
        title: language === 'en' ? 'Event Saved' : 'நிகழ்வு சேமிக்கப்பட்டது',
        description: language === 'en' 
          ? `Event "${eventData.name}" has been saved successfully`
          : `நிகழ்வு "${eventData.name}" வெற்றிகரமாக சேமிக்கப்பட்டது`,
      });
      
      setShowEventForm(false);
      setEditingEvent(null);
      
      // You could also trigger a refresh of the events list here
      // onEventSaved(savedEvent);
      
    } catch (error) {
      console.error('Error saving event:', error);
      toast({
        title: language === 'en' ? 'Save Failed' : 'சேமிப்பு தோல்வி',
        description: language === 'en' 
          ? 'An error occurred while saving the event'
          : 'நிகழ்வை சேமிக்கும் போது பிழை ஏற்பட்டது',
        variant: 'destructive'
      });
    }
  };

  const handleEventCancel = () => {
    setShowEventForm(false);
    setEditingEvent(null);
  };

  const handleSettingsSave = (settings: any) => {
    // In a real application, you would save settings to your backend
    console.log('Settings saved:', settings);
    toast({
      title: language === 'en' ? 'Settings Saved' : 'அமைப்புகள் சேமிக்கப்பட்டன',
      description: language === 'en' 
        ? 'Your settings have been saved successfully'
        : 'உங்கள் அமைப்புகள் வெற்றிகரமாக சேமிக்கப்பட்டன',
    });
    setShowSettings(false);
  };

  const handleSettingsCancel = () => {
    setShowSettings(false);
  };

  return (
    <>
      <Card className="card-chapa rounded-none shadow-subtle">
        <CardHeader>
          <CardTitle className={`text-xl font-display font-semibold ${
            isDark ? 'text-white' : 'text-chapa-charcoal'
          }`}>
            {language === 'en' ? 'Quick Actions' : 'விரைவு செயல்கள்'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <Button 
              className="btn-chapa-primary w-full" 
              onClick={handleNewEvent}
            >
              <Plus className="w-4 h-4 mr-2" />
              {language === 'en' ? 'New Event' : 'புதிய நிகழ்வு'}
            </Button>
            <Button 
              variant="outline" 
              className="btn-chapa-secondary w-full"
              onClick={handleEditEvent}
            >
              <Edit className="w-4 h-4 mr-2" />
              {language === 'en' ? 'Edit Event' : 'நிகழ்வைத் திருத்து'}
            </Button>
            <Button 
              variant="outline" 
              className="btn-chapa-secondary w-full"
              onClick={handleExportData}
            >
              <Download className="w-4 h-4 mr-2" />
              {language === 'en' ? 'Export Data' : 'தரவை ஏற்றுமதி செய்'}
            </Button>
            <Button 
              variant="outline" 
              className="btn-chapa-secondary w-full"
              onClick={handleSettings}
            >
              <Settings className="w-4 h-4 mr-2" />
              {language === 'en' ? 'Settings' : 'அமைப்புகள்'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Event Form Modal */}
      <Dialog open={showEventForm} onOpenChange={setShowEventForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className={isDark ? 'text-white' : 'text-chapa-charcoal'}>
              {editingEvent 
                ? (language === 'en' ? 'Edit Event' : 'நிகழ்வைத் திருத்து')
                : (language === 'en' ? 'Create New Event' : 'புதிய நிகழ்வை உருவாக்கு')
              }
            </DialogTitle>
          </DialogHeader>
          <EventForm
            language={language}
            isDark={isDark}
            onSave={handleEventSave}
            onCancel={handleEventCancel}
            initialData={editingEvent}
          />
        </DialogContent>
      </Dialog>

      {/* Data Export Modal */}
      <Dialog open={showDataExport} onOpenChange={setShowDataExport}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className={isDark ? 'text-white' : 'text-chapa-charcoal'}>
              {language === 'en' ? 'Export Data' : 'தரவை ஏற்றுமதி செய்'}
            </DialogTitle>
          </DialogHeader>
          <DataExport
            language={language}
            isDark={isDark}
          />
        </DialogContent>
      </Dialog>

      {/* Settings Modal */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className={isDark ? 'text-white' : 'text-chapa-charcoal'}>
              {language === 'en' ? 'Settings' : 'அமைப்புகள்'}
            </DialogTitle>
          </DialogHeader>
          <SettingsManagement
            language={language}
            isDark={isDark}
            onSave={handleSettingsSave}
            onCancel={handleSettingsCancel}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default QuickActions;
