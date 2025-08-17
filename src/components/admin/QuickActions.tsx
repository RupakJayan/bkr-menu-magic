import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Plus, Edit, Download, Settings } from 'lucide-react';
import EventForm from './EventForm';
import DataExport from './DataExport';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';

interface QuickActionsProps {
  language: 'en' | 'ta';
  isDark: boolean;
}

const QuickActions: React.FC<QuickActionsProps> = ({ language, isDark }) => {
  const [showEventForm, setShowEventForm] = useState(false);
  const [showDataExport, setShowDataExport] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any>(null);

  const handleNewEvent = () => {
    setEditingEvent(null);
    setShowEventForm(true);
  };

  const handleEditEvent = () => {
    // For demo purposes, create a sample event to edit
    const sampleEvent = {
      name: language === 'en' ? 'Sample Event' : 'மாதிரி நிகழ்வு',
      date: '2024-01-25',
      time: '18:00',
      guests: '50',
      type: 'wedding',
      description: language === 'en' ? 'A sample event for editing' : 'திருத்துவதற்கான மாதிரி நிகழ்வு',
      status: 'draft'
    };
    setEditingEvent(sampleEvent);
    setShowEventForm(true);
  };

  const handleExportData = () => {
    setShowDataExport(true);
  };

  const handleSettings = () => {
    // TODO: Implement settings
    console.log('Settings clicked');
  };

  const handleEventSave = (eventData: any) => {
    console.log('Event saved:', eventData);
    setShowEventForm(false);
    // TODO: Integrate with actual event service
  };

  const handleEventCancel = () => {
    setShowEventForm(false);
    setEditingEvent(null);
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
    </>
  );
};

export default QuickActions;
