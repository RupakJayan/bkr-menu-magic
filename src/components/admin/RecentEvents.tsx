import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { CheckCircle, CalendarDays, AlertCircle, XCircle } from 'lucide-react';

interface RecentEventsProps {
  language: 'en' | 'ta';
  isDark: boolean;
}

const RecentEvents: React.FC<RecentEventsProps> = ({ language, isDark }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'confirmed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'draft': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const recentEvents = [
    {
      id: 1,
      name: language === 'en' ? 'Wedding Reception' : 'திருமண வரவேற்பு',
      date: '2024-01-15',
      status: 'completed',
      revenue: '₹45,000',
      guests: 150
    },
    {
      id: 2,
      name: language === 'en' ? 'Corporate Lunch' : 'நிறுவன மதிய உணவு',
      date: '2024-01-18',
      status: 'upcoming',
      revenue: '₹12,000',
      guests: 25
    },
    {
      id: 3,
      name: language === 'en' ? 'Birthday Party' : 'பிறந்தநாள் விருந்து',
      date: '2024-01-20',
      status: 'upcoming',
      revenue: '₹8,500',
      guests: 40
    }
  ];

  return (
    <Card className="card-chapa rounded-none shadow-subtle">
      <CardHeader>
        <CardTitle className={`text-xl font-display font-semibold ${
          isDark ? 'text-white' : 'text-chapa-charcoal'
        }`}>
          {language === 'en' ? 'Recent Events' : 'சமீபத்திய நிகழ்வுகள்'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentEvents.map((event) => (
            <div key={event.id} className="flex items-center justify-between p-4 bg-chapa-light-gray rounded-none">
              <div className="flex-1">
                <div className={`font-body font-medium ${
                  isDark ? 'text-white' : 'text-chapa-charcoal'
                }`}>
                  {event.name}
                </div>
                <div className={`text-sm font-body ${
                  isDark ? 'text-white/60' : 'text-chapa-medium-gray'
                }`}>
                  {event.date} • {event.guests} {language === 'en' ? 'guests' : 'விருந்தினர்கள்'}
                </div>
              </div>
              <div className="text-right">
                <div className={`font-body font-semibold ${
                  isDark ? 'text-white' : 'text-chapa-charcoal'
                }`}>
                  {event.revenue}
                </div>
                <Badge className={`ml-2 ${getStatusColor(event.status)}`}>
                  {event.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentEvents;
