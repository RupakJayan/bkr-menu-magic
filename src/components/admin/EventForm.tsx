import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface EventFormProps {
  language: 'en' | 'ta';
  isDark: boolean;
  onSave?: (eventData: any) => void;
  onCancel?: () => void;
  initialData?: any;
}

const EventForm: React.FC<EventFormProps> = ({ 
  language, 
  isDark, 
  onSave, 
  onCancel, 
  initialData 
}) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    date: initialData?.date || '',
    time: initialData?.time || '',
    guests: initialData?.guests || '',
    type: initialData?.type || 'wedding',
    description: initialData?.description || '',
    status: initialData?.status || 'draft'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSave) {
      onSave(formData);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="card-chapa rounded-none shadow-subtle">
      <CardHeader>
        <CardTitle className={`text-xl font-display font-semibold ${
          isDark ? 'text-white' : 'text-chapa-charcoal'
        }`}>
          {language === 'en' ? 'Event Details' : 'நிகழ்வு விவரங்கள்'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name" className={isDark ? 'text-white' : 'text-chapa-charcoal'}>
                {language === 'en' ? 'Event Name' : 'நிகழ்வு பெயர்'}
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="mt-1"
                required
              />
            </div>
            <div>
              <Label htmlFor="type" className={isDark ? 'text-white' : 'text-chapa-charcoal'}>
                {language === 'en' ? 'Event Type' : 'நிகழ்வு வகை'}
              </Label>
              <Select value={formData.type} onValueChange={(value) => handleChange('type', value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="wedding">{language === 'en' ? 'Wedding' : 'திருமணம்'}</SelectItem>
                  <SelectItem value="corporate">{language === 'en' ? 'Corporate' : 'நிறுவன'}</SelectItem>
                  <SelectItem value="birthday">{language === 'en' ? 'Birthday' : 'பிறந்தநாள்'}</SelectItem>
                  <SelectItem value="other">{language === 'en' ? 'Other' : 'மற்றவை'}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="date" className={isDark ? 'text-white' : 'text-chapa-charcoal'}>
                {language === 'en' ? 'Date' : 'தேதி'}
              </Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleChange('date', e.target.value)}
                className="mt-1"
                required
              />
            </div>
            <div>
              <Label htmlFor="time" className={isDark ? 'text-white' : 'text-chapa-charcoal'}>
                {language === 'en' ? 'Time' : 'நேரம்'}
              </Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) => handleChange('time', e.target.value)}
                className="mt-1"
                required
              />
            </div>
            <div>
              <Label htmlFor="guests" className={isDark ? 'text-white' : 'text-chapa-charcoal'}>
                {language === 'en' ? 'Number of Guests' : 'விருந்தினர்களின் எண்ணிக்கை'}
              </Label>
              <Input
                id="guests"
                type="number"
                value={formData.guests}
                onChange={(e) => handleChange('guests', e.target.value)}
                className="mt-1"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description" className={isDark ? 'text-white' : 'text-chapa-charcoal'}>
              {language === 'en' ? 'Description' : 'விளக்கம்'}
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              className="mt-1"
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                {language === 'en' ? 'Cancel' : 'ரத்து'}
              </Button>
            )}
            <Button type="submit" className="btn-chapa-primary">
              {language === 'en' ? 'Save Event' : 'நிகழ்வை சேமிக்கவும்'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default EventForm;
