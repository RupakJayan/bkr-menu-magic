import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Filter, Search, Calendar, Plus, Edit, Trash2, Eye } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';

interface EventManagementProps {
  language: 'en' | 'ta';
  isDark: boolean;
}

interface Event {
  id: number;
  name: string;
  date: string;
  time: string;
  type: string;
  status: string;
  guests: number;
  revenue: string;
  client: string;
}

const EventManagement: React.FC<EventManagementProps> = ({ language, isDark }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  // Mock data for demonstration
  useEffect(() => {
    const mockEvents: Event[] = [
      {
        id: 1,
        name: language === 'en' ? 'Wedding Reception' : 'திருமண வரவேற்பு',
        date: '2024-01-15',
        time: '18:00',
        type: 'wedding',
        status: 'completed',
        guests: 150,
        revenue: '₹45,000',
        client: 'Raj & Priya'
      },
      {
        id: 2,
        name: language === 'en' ? 'Corporate Lunch' : 'நிறுவன மதிய உணவு',
        date: '2024-01-18',
        time: '12:30',
        type: 'corporate',
        status: 'confirmed',
        guests: 25,
        revenue: '₹12,000',
        client: 'TechCorp Inc.'
      },
      {
        id: 3,
        name: language === 'en' ? 'Birthday Party' : 'பிறந்தநாள் விருந்து',
        date: '2024-01-20',
        time: '19:00',
        type: 'birthday',
        status: 'upcoming',
        guests: 40,
        revenue: '₹8,500',
        client: 'Arun Family'
      },
      {
        id: 4,
        name: language === 'en' ? 'Anniversary Dinner' : 'திருமண நாள் இரவு உணவு',
        date: '2024-01-22',
        time: '20:00',
        type: 'anniversary',
        status: 'draft',
        guests: 30,
        revenue: '₹15,000',
        client: 'Kumar & Family'
      }
    ];
    setEvents(mockEvents);
    setFilteredEvents(mockEvents);
  }, [language]);

  // Filter and search events
  useEffect(() => {
    let filtered = events;

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(event => event.status === statusFilter);
    }

    // Apply type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(event => event.type === typeFilter);
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(event =>
        event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.client.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredEvents(filtered);
  }, [events, searchTerm, statusFilter, typeFilter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'confirmed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'upcoming': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'draft': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed': return language === 'en' ? 'Completed' : 'முடிந்தது';
      case 'confirmed': return language === 'en' ? 'Confirmed' : 'உறுதிப்படுத்தப்பட்டது';
      case 'upcoming': return language === 'en' ? 'Upcoming' : 'வரவிருக்கிறது';
      case 'draft': return language === 'en' ? 'Draft' : 'வரைவு';
      default: return status;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'wedding': return language === 'en' ? 'Wedding' : 'திருமணம்';
      case 'corporate': return language === 'en' ? 'Corporate' : 'நிறுவன';
      case 'birthday': return language === 'en' ? 'Birthday' : 'பிறந்தநாள்';
      case 'anniversary': return language === 'en' ? 'Anniversary' : 'திருமண நாள்';
      default: return type;
    }
  };

  const handleViewEvent = (event: Event) => {
    console.log('View event:', event);
    // TODO: Implement event view modal
  };

  const handleEditEvent = (event: Event) => {
    console.log('Edit event:', event);
    // TODO: Implement event edit modal
  };

  const handleDeleteEvent = (event: Event) => {
    if (confirm(language === 'en' ? 'Are you sure you want to delete this event?' : 'இந்த நிகழ்வை நீக்க விரும்புகிறீர்களா?')) {
      setEvents(events.filter(e => e.id !== event.id));
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setTypeFilter('all');
  };

  return (
    <Card className="card-chapa rounded-none shadow-subtle">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className={`text-xl font-display font-semibold ${
            isDark ? 'text-white' : 'text-chapa-charcoal'
          }`}>
            {language === 'en' ? 'All Events' : 'அனைத்து நிகழ்வுகளும்'}
          </CardTitle>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="btn-chapa-secondary"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="w-4 h-4 mr-2" />
              {language === 'en' ? 'Filters' : 'வடிப்பான்கள்'}
            </Button>
            <Button 
              className="btn-chapa-primary"
              size="sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              {language === 'en' ? 'New Event' : 'புதிய நிகழ்வு'}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Search and Filters */}
        <div className="space-y-4 mb-6">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder={language === 'en' ? 'Search events...' : 'நிகழ்வுகளைத் தேடுங்கள்...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-chapa-light-gray rounded-none">
              <div>
                <label className={`text-sm font-medium mb-2 block ${
                  isDark ? 'text-white' : 'text-chapa-charcoal'
                }`}>
                  {language === 'en' ? 'Status' : 'நிலை'}
                </label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{language === 'en' ? 'All Statuses' : 'அனைத்து நிலைகளும்'}</SelectItem>
                    <SelectItem value="completed">{language === 'en' ? 'Completed' : 'முடிந்தது'}</SelectItem>
                    <SelectItem value="confirmed">{language === 'en' ? 'Confirmed' : 'உறுதிப்படுத்தப்பட்டது'}</SelectItem>
                    <SelectItem value="upcoming">{language === 'en' ? 'Upcoming' : 'வரவிருக்கிறது'}</SelectItem>
                    <SelectItem value="draft">{language === 'en' ? 'Draft' : 'வரைவு'}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className={`text-sm font-medium mb-2 block ${
                  isDark ? 'text-white' : 'text-chapa-charcoal'
                }`}>
                  {language === 'en' ? 'Event Type' : 'நிகழ்வு வகை'}
                </label>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{language === 'en' ? 'All Types' : 'அனைத்து வகைகளும்'}</SelectItem>
                    <SelectItem value="wedding">{language === 'en' ? 'Wedding' : 'திருமணம்'}</SelectItem>
                    <SelectItem value="corporate">{language === 'en' ? 'Corporate' : 'நிறுவன'}</SelectItem>
                    <SelectItem value="birthday">{language === 'en' ? 'Birthday' : 'பிறந்தநாள்'}</SelectItem>
                    <SelectItem value="anniversary">{language === 'en' ? 'Anniversary' : 'திருமண நாள்'}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button variant="outline" onClick={clearFilters} className="w-full">
                  {language === 'en' ? 'Clear Filters' : 'வடிப்பான்களை அழி'}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Events Table */}
        {filteredEvents.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className={isDark ? 'text-white' : 'text-chapa-charcoal'}>
                    {language === 'en' ? 'Event' : 'நிகழ்வு'}
                  </TableHead>
                  <TableHead className={isDark ? 'text-white' : 'text-chapa-charcoal'}>
                    {language === 'en' ? 'Date & Time' : 'தேதி & நேரம்'}
                  </TableHead>
                  <TableHead className={isDark ? 'text-white' : 'text-chapa-charcoal'}>
                    {language === 'en' ? 'Type' : 'வகை'}
                  </TableHead>
                  <TableHead className={isDark ? 'text-white' : 'text-chapa-charcoal'}>
                    {language === 'en' ? 'Status' : 'நிலை'}
                  </TableHead>
                  <TableHead className={isDark ? 'text-white' : 'text-chapa-charcoal'}>
                    {language === 'en' ? 'Guests' : 'விருந்தினர்கள்'}
                  </TableHead>
                  <TableHead className={isDark ? 'text-white' : 'text-chapa-charcoal'}>
                    {language === 'en' ? 'Revenue' : 'வருவாய்'}
                  </TableHead>
                  <TableHead className={isDark ? 'text-white' : 'text-chapa-charcoal'}>
                    {language === 'en' ? 'Actions' : 'செயல்கள்'}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEvents.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell>
                      <div>
                        <div className={`font-medium ${
                          isDark ? 'text-white' : 'text-chapa-charcoal'
                        }`}>
                          {event.name}
                        </div>
                        <div className={`text-sm ${
                          isDark ? 'text-white/60' : 'text-chapa-medium-gray'
                        }`}>
                          {event.client}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className={`text-sm ${
                        isDark ? 'text-white/80' : 'text-chapa-charcoal'
                      }`}>
                        <div>{event.date}</div>
                        <div>{event.time}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {getTypeLabel(event.type)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={`text-xs ${getStatusColor(event.status)}`}>
                        {getStatusLabel(event.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className={isDark ? 'text-white/80' : 'text-chapa-charcoal'}>
                      {event.guests}
                    </TableCell>
                    <TableCell className={`font-medium ${
                      isDark ? 'text-white' : 'text-chapa-charcoal'
                    }`}>
                      {event.revenue}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewEvent(event)}
                          className="h-8 w-8 p-0"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditEvent(event)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteEvent(event)}
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 mx-auto mb-4 text-chapa-medium-gray" />
            <h3 className={`text-lg font-display font-medium mb-2 ${
              isDark ? 'text-white' : 'text-chapa-charcoal'
            }`}>
              {language === 'en' ? 'No events found' : 'நிகழ்வுகள் எதுவும் கிடைக்கவில்லை'}
            </h3>
            <p className={`font-body ${
              isDark ? 'text-white/60' : 'text-chapa-medium-gray'
            }`}>
              {language === 'en' 
                ? 'Try adjusting your search or filters'
                : 'உங்கள் தேடல் அல்லது வடிப்பான்களை சரிசெய்ய முயற்சிக்கவும்'
              }
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EventManagement;
