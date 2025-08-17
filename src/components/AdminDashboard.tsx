import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  Users, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  ChefHat, 
  Star,
  Phone,
  Mail,
  MapPin,
  Clock,
  Settings,
  BarChart3,
  PieChart,
  Activity,
  ArrowUp,
  ArrowDown,
  Plus,
  Edit,
  Trash2,
  Eye,
  Download,
  Filter,
  Search,
  RefreshCw
} from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

interface AdminDashboardProps {
  language: 'en' | 'ta';
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ language }) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data for demonstration
  const stats = [
    {
      title: language === 'en' ? 'Total Events' : 'மொத்த நிகழ்வுகள்',
      value: '156',
      change: '+12%',
      trend: 'up',
      icon: Calendar,
      color: 'bg-chapa-charcoal'
    },
    {
      title: language === 'en' ? 'Revenue' : 'வருவாய்',
      value: '₹2.4M',
      change: '+8%',
      trend: 'up',
      icon: DollarSign,
      color: 'bg-chapa-gold'
    },
    {
      title: language === 'en' ? 'Happy Clients' : 'மகிழ்ச்சியான வாடிக்கையாளர்கள்',
      value: '89%',
      change: '+5%',
      trend: 'up',
      icon: Users,
      color: 'bg-chapa-charcoal'
    },
    {
      title: language === 'en' ? 'Rating' : 'மதிப்பீடு',
      value: '4.9',
      change: '+0.2',
      trend: 'up',
      icon: Star,
      color: 'bg-chapa-gold'
    }
  ];

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'upcoming':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-black' : 'bg-chapa-cream'}`}>
      <div className="container-chapa py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className={`text-4xl font-display font-bold mb-4 ${
            isDark ? 'text-white' : 'text-chapa-charcoal'
          }`}>
            {language === 'en' ? 'Admin Dashboard' : 'நிர்வாக டாஷ்போர்டு'}
          </h1>
          <p className={`text-lg font-body ${
            isDark ? 'text-white/80' : 'text-chapa-medium-gray'
          }`}>
            {language === 'en' 
              ? 'Manage your catering business efficiently'
              : 'உங்கள் கேட்டரிங் வணிகத்தை திறம்பட நிர்வகிக்கவும்'
            }
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="group"
            >
              <Card className={`card-chapa rounded-none shadow-subtle hover:shadow-elegant transition-all duration-300`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <motion.div 
                      className={`w-12 h-12 rounded-none flex items-center justify-center shadow-subtle ${stat.color}`}
                      whileHover={{ rotate: 5, scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                    >
                      <stat.icon className="w-6 h-6 text-white" />
                    </motion.div>
                    <div className="text-right">
                      <div className={`text-sm font-body ${
                        stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {stat.change}
                      </div>
                      <div className={`text-xs font-body ${
                        isDark ? 'text-white/60' : 'text-chapa-medium-gray'
                      }`}>
                        {stat.trend === 'up' ? <ArrowUp className="w-3 h-3 inline" /> : <ArrowDown className="w-3 h-3 inline" />}
                      </div>
                    </div>
                  </div>
                  <div className={`text-2xl font-display font-bold mb-2 ${
                    isDark ? 'text-white' : 'text-chapa-charcoal'
                  }`}>
                    {stat.value}
                  </div>
                  <div className={`text-sm font-body ${
                    isDark ? 'text-white/70' : 'text-chapa-medium-gray'
                  }`}>
                    {stat.title}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-8"
        >
          <div className="flex space-x-1 bg-chapa-light-gray rounded-none p-1">
            {[
              { id: 'overview', label: language === 'en' ? 'Overview' : 'கண்ணோட்டம்' },
              { id: 'events', label: language === 'en' ? 'Events' : 'நிகழ்வுகள்' },
              { id: 'analytics', label: language === 'en' ? 'Analytics' : 'பகுப்பாய்வு' },
              { id: 'settings', label: language === 'en' ? 'Settings' : 'அமைப்புகள்' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-2 px-4 text-sm font-body font-medium rounded-none transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-chapa-charcoal text-white shadow-subtle'
                    : 'text-chapa-medium-gray hover:text-chapa-charcoal hover:bg-white/50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Events */}
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

              {/* Quick Actions */}
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
                    <Button className="btn-chapa-primary w-full">
                      <Plus className="w-4 h-4 mr-2" />
                      {language === 'en' ? 'New Event' : 'புதிய நிகழ்வு'}
                    </Button>
                    <Button variant="outline" className="btn-chapa-secondary w-full">
                      <Edit className="w-4 h-4 mr-2" />
                      {language === 'en' ? 'Edit Event' : 'நிகழ்வைத் திருத்து'}
                    </Button>
                    <Button variant="outline" className="btn-chapa-secondary w-full">
                      <Download className="w-4 h-4 mr-2" />
                      {language === 'en' ? 'Export Data' : 'தரவை ஏற்றுமதி செய்'}
                    </Button>
                    <Button variant="outline" className="btn-chapa-secondary w-full">
                      <Settings className="w-4 h-4 mr-2" />
                      {language === 'en' ? 'Settings' : 'அமைப்புகள்'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'events' && (
            <Card className="card-chapa rounded-none shadow-subtle">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className={`text-xl font-display font-semibold ${
                    isDark ? 'text-white' : 'text-chapa-charcoal'
                  }`}>
                    {language === 'en' ? 'All Events' : 'அனைத்து நிகழ்வுகளும்'}
                  </CardTitle>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="btn-chapa-secondary">
                      <Filter className="w-4 h-4 mr-2" />
                      {language === 'en' ? 'Filter' : 'வடிப்பான்'}
                    </Button>
                    <Button variant="outline" size="sm" className="btn-chapa-secondary">
                      <Search className="w-4 h-4 mr-2" />
                      {language === 'en' ? 'Search' : 'தேடு'}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
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
                      ? 'Create your first event to get started'
                      : 'தொடங்க உங்கள் முதல் நிகழ்வை உருவாக்கவும்'
                    }
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'analytics' && (
            <Card className="card-chapa rounded-none shadow-subtle">
              <CardHeader>
                <CardTitle className={`text-xl font-display font-semibold ${
                  isDark ? 'text-white' : 'text-chapa-charcoal'
                }`}>
                  {language === 'en' ? 'Analytics Dashboard' : 'பகுப்பாய்வு டாஷ்போர்டு'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-6 bg-chapa-light-gray rounded-none">
                    <BarChart3 className="w-12 h-12 mx-auto mb-4 text-chapa-charcoal" />
                    <h4 className={`font-display font-semibold mb-2 ${
                      isDark ? 'text-white' : 'text-chapa-charcoal'
                    }`}>
                      {language === 'en' ? 'Revenue Chart' : 'வருவாய் வரைபடம்'}
                    </h4>
                  </div>
                  <div className="text-center p-6 bg-chapa-light-gray rounded-none">
                    <PieChart className="w-12 h-12 mx-auto mb-4 text-chapa-charcoal" />
                    <h4 className={`font-display font-semibold mb-2 ${
                      isDark ? 'text-white' : 'text-chapa-charcoal'
                    }`}>
                      {language === 'en' ? 'Event Types' : 'நிகழ்வு வகைகள்'}
                    </h4>
                  </div>
                  <div className="text-center p-6 bg-chapa-light-gray rounded-none">
                    <Activity className="w-12 h-12 mx-auto mb-4 text-chapa-charcoal" />
                    <h4 className={`font-display font-semibold mb-2 ${
                      isDark ? 'text-white' : 'text-chapa-charcoal'
                    }`}>
                      {language === 'en' ? 'Performance' : 'செயல்திறன்'}
                    </h4>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'settings' && (
            <Card className="card-chapa rounded-none shadow-subtle">
              <CardHeader>
                <CardTitle className={`text-xl font-display font-semibold ${
                  isDark ? 'text-white' : 'text-chapa-charcoal'
                }`}>
                  {language === 'en' ? 'Settings' : 'அமைப்புகள்'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-chapa-light-gray rounded-none">
                    <div>
                      <h4 className={`font-body font-medium ${
                        isDark ? 'text-white' : 'text-chapa-charcoal'
                      }`}>
                        {language === 'en' ? 'Email Notifications' : 'மின்னஞ்சல் அறிவிப்புகள்'}
                      </h4>
                      <p className={`text-sm font-body ${
                        isDark ? 'text-white/60' : 'text-chapa-medium-gray'
                      }`}>
                        {language === 'en' 
                          ? 'Receive notifications about new events and updates'
                          : 'புதிய நிகழ்வுகள் மற்றும் புதுப்பிப்புகள் பற்றிய அறிவிப்புகளைப் பெறுங்கள்'
                        }
                      </p>
                    </div>
                    <Button variant="outline" size="sm" className="btn-chapa-secondary">
                      {language === 'en' ? 'Configure' : 'கட்டமைக்கவும்'}
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-chapa-light-gray rounded-none">
                    <div>
                      <h4 className={`font-body font-medium ${
                        isDark ? 'text-white' : 'text-chapa-charcoal'
                      }`}>
                        {language === 'en' ? 'Language' : 'மொழி'}
                      </h4>
                      <p className={`text-sm font-body ${
                        isDark ? 'text-white/60' : 'text-chapa-medium-gray'
                      }`}>
                        {language === 'en' 
                          ? 'Change dashboard language'
                          : 'டாஷ்போர்டு மொழியை மாற்றவும்'
                        }
                      </p>
                    </div>
                    <Button variant="outline" size="sm" className="btn-chapa-secondary">
                      {language === 'en' ? 'Change' : 'மாற்று'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;
