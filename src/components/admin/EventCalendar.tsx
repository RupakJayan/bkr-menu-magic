import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Calendar, ChevronLeft, ChevronRight, Plus } from 'lucide-react';

interface EventCalendarProps {
  language: 'en' | 'ta';
  isDark: boolean;
}

interface CalendarEvent {
  id: number;
  name: string;
  date: string;
  type: string;
  status: string;
  time: string;
}

const EventCalendar: React.FC<EventCalendarProps> = ({ language, isDark }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Mock events data
  useEffect(() => {
    const loadEvents = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const mockEvents: CalendarEvent[] = [
          {
            id: 1,
            name: language === 'en' ? 'Wedding Reception' : 'திருமண வரவேற்பு',
            date: '2024-01-15',
            type: 'wedding',
            status: 'completed',
            time: '18:00'
          },
          {
            id: 2,
            name: language === 'en' ? 'Corporate Lunch' : 'நிறுவன மதிய உணவு',
            date: '2024-01-18',
            type: 'corporate',
            status: 'confirmed',
            time: '12:30'
          },
          {
            id: 3,
            name: language === 'en' ? 'Birthday Party' : 'பிறந்தநாள் விருந்து',
            date: '2024-01-20',
            type: 'birthday',
            status: 'upcoming',
            time: '19:00'
          },
          {
            id: 4,
            name: language === 'en' ? 'Anniversary Dinner' : 'திருமண நாள் இரவு உணவு',
            date: '2024-01-22',
            type: 'anniversary',
            status: 'draft',
            time: '20:00'
          }
        ];
        setEvents(mockEvents);
      } catch (error) {
        console.error('Error loading events:', error);
        setEvents([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadEvents();
  }, [language]);

  const getMonthName = (date: Date) => {
    try {
      const months = language === 'en' 
        ? ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
        : ['ஜனவரி', 'பிப்ரவரி', 'மார்ச்', 'ஏப்ரல்', 'மே', 'ஜூன்', 'ஜூலை', 'ஆகஸ்ட்', 'செப்டம்பர்', 'அக்டோபர்', 'நவம்பர்', 'டிசம்பர்'];
      return months[date.getMonth()] || 'Unknown';
    } catch (error) {
      console.error('Error getting month name:', error);
      return 'Unknown';
    }
  };

  const getDayNames = () => {
    return language === 'en' 
      ? ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
      : ['ஞாயி', 'திங்', 'செவ்', 'புத', 'விய', 'வெள்', 'சனி'];
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'wedding': return 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200';
      case 'corporate': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'birthday': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'anniversary': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getEventTypeLabel = (type: string) => {
    switch (type) {
      case 'wedding': return language === 'en' ? 'Wedding' : 'திருமணம்';
      case 'corporate': return language === 'en' ? 'Corporate' : 'நிறுவன';
      case 'birthday': return language === 'en' ? 'Birthday' : 'பிறந்தநாள்';
      case 'anniversary': return language === 'en' ? 'Anniversary' : 'திருமண நாள்';
      default: return type;
    }
  };

  const getDaysInMonth = (date: Date) => {
    try {
      const year = date.getFullYear();
      const month = date.getMonth();
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      const daysInMonth = lastDay.getDate();
      const startingDay = firstDay.getDay();
      
      const days = [];
      
      // Add empty cells for days before the first day of the month
      for (let i = 0; i < startingDay; i++) {
        days.push(null);
      }
      
      // Add all days of the month
      for (let i = 1; i <= daysInMonth; i++) {
        days.push(new Date(year, month, i));
      }
      
      return days;
    } catch (error) {
      console.error('Error calculating days in month:', error);
      return [];
    }
  };

  const getEventsForDate = (date: Date) => {
    try {
      if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
        return [];
      }
      const dateString = date.toISOString().split('T')[0];
      return events.filter(event => event.date === dateString);
    } catch (error) {
      console.error('Error getting events for date:', error);
      return [];
    }
  };

  const goToPreviousMonth = () => {
    try {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    } catch (error) {
      console.error('Error going to previous month:', error);
    }
  };

  const goToNextMonth = () => {
    try {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    } catch (error) {
      console.error('Error going to next month:', error);
    }
  };

  const goToToday = () => {
    try {
      setCurrentDate(new Date());
    } catch (error) {
      console.error('Error going to today:', error);
    }
  };

  const isToday = (date: Date | null) => {
    try {
      if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
        return false;
      }
      const today = new Date();
      return date.getDate() === today.getDate() && 
             date.getMonth() === today.getMonth() && 
             date.getFullYear() === today.getFullYear();
    } catch (error) {
      console.error('Error checking if date is today:', error);
      return false;
    }
  };

  const days = getDaysInMonth(currentDate);

  if (isLoading) {
    return (
      <Card className="card-chapa rounded-none shadow-subtle">
        <CardContent className="p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-chapa-gold mx-auto mb-4"></div>
            <p className={isDark ? 'text-white/60' : 'text-chapa-medium-gray'}>
              {language === 'en' ? 'Loading calendar...' : 'காலெண்டர் ஏற்றுகிறது...'}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="card-chapa rounded-none shadow-subtle">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className={`text-xl font-display font-semibold ${
            isDark ? 'text-white' : 'text-chapa-charcoal'
          }`}>
            {language === 'en' ? 'Event Calendar' : 'நிகழ்வு காலெண்டர்'}
          </CardTitle>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={goToToday}>
              {language === 'en' ? 'Today' : 'இன்று'}
            </Button>
            <Button className="btn-chapa-primary" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              {language === 'en' ? 'New Event' : 'புதிய நிகழ்வு'}
            </Button>
          </div>
        </div>
        
        {/* Calendar Navigation */}
        <div className="flex items-center justify-between mt-4">
          <Button variant="outline" size="sm" onClick={goToPreviousMonth}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <h2 className={`text-lg font-display font-semibold ${
            isDark ? 'text-white' : 'text-chapa-charcoal'
          }`}>
            {getMonthName(currentDate)} {currentDate.getFullYear()}
          </h2>
          <Button variant="outline" size="sm" onClick={goToNextMonth}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Day Headers */}
          {getDayNames().map((day, index) => (
            <div key={index} className={`p-2 text-center text-sm font-medium ${
              isDark ? 'text-white/60' : 'text-chapa-medium-gray'
            }`}>
              {day}
            </div>
          ))}
          
          {/* Calendar Days */}
          {days.map((date, index) => (
            <div
              key={index}
              className={`min-h-[80px] p-2 border border-gray-200 dark:border-gray-700 ${
                date && isToday(date) ? 'bg-chapa-gold/20 border-chapa-gold' : ''
              } ${!date ? 'bg-gray-50 dark:bg-gray-800' : ''}`}
            >
              {date && (
                <>
                  <div className={`text-sm font-medium mb-1 ${
                    isToday(date) 
                      ? 'text-chapa-gold' 
                      : isDark ? 'text-white' : 'text-chapa-charcoal'
                  }`}>
                    {date.getDate()}
                  </div>
                  
                  {/* Events for this date */}
                  <div className="space-y-1">
                    {getEventsForDate(date).map((event) => (
                      <div key={event.id} className="text-xs">
                        <Badge 
                          className={`w-full text-xs ${getEventTypeColor(event.type)}`}
                          variant="secondary"
                        >
                          <div className="truncate">
                            <div className="font-medium">{event.time}</div>
                            <div className="truncate">{event.name}</div>
                          </div>
                        </Badge>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        {/* Calendar Legend */}
        <div className="mt-6 p-4 bg-chapa-light-gray rounded-none">
          <h4 className={`font-medium mb-3 ${
            isDark ? 'text-white' : 'text-chapa-charcoal'
          }`}>
            {language === 'en' ? 'Event Types' : 'நிகழ்வு வகைகள்'}
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {['wedding', 'corporate', 'birthday', 'anniversary'].map((type) => (
              <div key={type} className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${getEventTypeColor(type).split(' ')[0]}`} />
                <span className={`text-sm ${
                  isDark ? 'text-white/80' : 'text-chapa-medium-gray'
                }`}>
                  {getEventTypeLabel(type)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Events Summary */}
        <div className="mt-6">
          <h4 className={`font-medium mb-3 ${
            isDark ? 'text-white' : 'text-chapa-charcoal'
          }`}>
            {language === 'en' ? 'Upcoming Events This Month' : 'இந்த மாதத்தில் வரவிருக்கும் நிகழ்வுகள்'}
          </h4>
          <div className="space-y-2">
            {events
              .filter(event => {
                try {
                  const eventDate = new Date(event.date);
                  if (isNaN(eventDate.getTime())) return false;
                  
                  const currentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
                  const nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
                  return eventDate >= currentMonth && eventDate <= nextMonth;
                } catch (error) {
                  console.error('Error filtering events:', error);
                  return false;
                }
              })
              .sort((a, b) => {
                try {
                  return new Date(a.date).getTime() - new Date(b.date).getTime();
                } catch (error) {
                  console.error('Error sorting events:', error);
                  return 0;
                }
              })
              .slice(0, 5)
              .map((event) => (
                <div key={event.id} className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded-none">
                  <div className="flex items-center space-x-3">
                    <Badge className={`text-xs ${getEventTypeColor(event.type)}`}>
                      {getEventTypeLabel(event.type)}
                    </Badge>
                    <span className={`text-sm ${
                      isDark ? 'text-white' : 'text-chapa-charcoal'
                    }`}>
                      {event.name}
                    </span>
                  </div>
                  <div className={`text-sm ${
                    isDark ? 'text-white/60' : 'text-chapa-medium-gray'
                  }`}>
                    {event.date} • {event.time}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EventCalendar;
