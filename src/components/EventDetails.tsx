import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { CalendarIcon, MapPin, Phone, User } from 'lucide-react';
import { format } from 'date-fns';
import { EventPlanningData, SessionType } from '../types/eventTypes';
import { useTheme } from '@/contexts/ThemeContext';

interface EventDetailsProps {
  onNext: (data: EventPlanningData) => void;
  language: 'en' | 'ta';
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
  }
];

const EventDetails: React.FC<EventDetailsProps> = ({ onNext, language }) => {
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

  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  const handleInputChange = (field: keyof EventPlanningData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = () => {
    if (formData.clientName && formData.phoneNumber && formData.venue) {
      onNext(formData);
    }
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'} py-8`}>
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-8">
          <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>
            {language === 'en' ? 'Event Details' : 'நிகழ்வு விவரங்கள்'}
          </h1>
        </div>

        <Card className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <CardHeader>
            <CardTitle className={`${isDark ? 'text-white' : 'text-gray-900'}`}>
              {language === 'en' ? 'Client Information' : 'வாடிக்கையாளர் தகவல்'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="clientName" className={isDark ? 'text-gray-200' : 'text-gray-700'}>
                {language === 'en' ? 'Client Name' : 'வாடிக்கையாளர் பெயர்'}
              </Label>
              <Input
                id="clientName"
                value={formData.clientName}
                onChange={(e) => handleInputChange('clientName', e.target.value)}
                className={isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}
                placeholder={language === 'en' ? 'Enter client name' : 'வாடிக்கையாளர் பெயரை உள்ளிடவும்'}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber" className={isDark ? 'text-gray-200' : 'text-gray-700'}>
                {language === 'en' ? 'Phone Number' : 'தொலைபேசி எண்'}
              </Label>
              <Input
                id="phoneNumber"
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                className={isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}
                placeholder={language === 'en' ? 'Enter phone number' : 'தொலைபேசி எண்ணை உள்ளிடவும்'}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="venue" className={isDark ? 'text-gray-200' : 'text-gray-700'}>
                {language === 'en' ? 'Venue' : 'இடம்'}
              </Label>
              <Input
                id="venue"
                value={formData.venue}
                onChange={(e) => handleInputChange('venue', e.target.value)}
                className={isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}
                placeholder={language === 'en' ? 'Enter venue address' : 'இட முகவரியை உள்ளிடவும்'}
              />
            </div>

            <div className="pt-6">
              <Button
                onClick={handleSubmit}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg"
                size="lg"
              >
                {language === 'en' ? 'Continue to Session Planning' : 'அமர்வு திட்டமிடலுக்கு தொடரவும்'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EventDetails;
