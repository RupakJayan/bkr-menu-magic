import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { useTheme } from '@/contexts/ThemeContext';
import DashboardHeader from './admin/DashboardHeader';
import StatsOverview from './admin/StatsOverview';
import RecentEvents from './admin/RecentEvents';
import QuickActions from './admin/QuickActions';
import EventCalendar from './admin/EventCalendar';
import EventManagement from './admin/EventManagement';
import AnalyticsOverview from './admin/AnalyticsOverview';
import UserManagement from './admin/UserManagement';
import MenuManagement from './admin/MenuManagement';
import SettingsManagement from './admin/SettingsManagement';

interface AdminDashboardProps {
  language: 'en' | 'ta';
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ language }) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className={`min-h-screen ${isDark ? 'bg-black' : 'bg-chapa-cream'}`}>
      <div className="container-chapa py-8">
        {/* Header */}
        <DashboardHeader language={language} isDark={isDark} />

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-8">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="overview">
              {language === 'en' ? 'Overview' : 'கண்ணோட்டம்'}
            </TabsTrigger>
            <TabsTrigger value="calendar">
              {language === 'en' ? 'Calendar' : 'காலெண்டர்'}
            </TabsTrigger>
            <TabsTrigger value="events">
              {language === 'en' ? 'Events' : 'நிகழ்வுகள்'}
            </TabsTrigger>
            <TabsTrigger value="users">
              {language === 'en' ? 'Users' : 'பயனர்கள்'}
            </TabsTrigger>
            <TabsTrigger value="menu">
              {language === 'en' ? 'Menu' : 'மெனு'}
            </TabsTrigger>
            <TabsTrigger value="analytics">
              {language === 'en' ? 'Analytics' : 'பகுப்பாய்வு'}
            </TabsTrigger>
            <TabsTrigger value="settings">
              {language === 'en' ? 'Settings' : 'அமைப்புகள்'}
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-8">
            <StatsOverview language={language} isDark={isDark} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <RecentEvents language={language} isDark={isDark} />
              <QuickActions language={language} isDark={isDark} />
            </div>
          </TabsContent>

          {/* Calendar Tab */}
          <TabsContent value="calendar" className="space-y-8">
            <EventCalendar language={language} isDark={isDark} />
          </TabsContent>

          {/* Events Tab */}
          <TabsContent value="events" className="space-y-8">
            <EventManagement language={language} isDark={isDark} />
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-8">
            <UserManagement language={language} isDark={isDark} />
          </TabsContent>

          {/* Menu Tab */}
          <TabsContent value="menu" className="space-y-8">
            <MenuManagement language={language} isDark={isDark} />
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-8">
            <AnalyticsOverview language={language} isDark={isDark} />
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-8">
            <SettingsManagement language={language} isDark={isDark} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
