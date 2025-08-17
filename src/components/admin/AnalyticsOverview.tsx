import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { BarChart3, PieChart, Activity, TrendingUp, TrendingDown, Users, DollarSign, Calendar } from 'lucide-react';

interface AnalyticsOverviewProps {
  language: 'en' | 'ta';
  isDark: boolean;
}

interface ChartData {
  month: string;
  revenue: number;
  events: number;
  guests: number;
}

const AnalyticsOverview: React.FC<AnalyticsOverviewProps> = ({ language, isDark }) => {
  const [timeRange, setTimeRange] = useState('6months');
  const [selectedMetric, setSelectedMetric] = useState('revenue');

  // Mock data for charts
  const chartData: ChartData[] = [
    { month: 'Jul', revenue: 125000, events: 12, guests: 480 },
    { month: 'Aug', revenue: 145000, events: 15, guests: 520 },
    { month: 'Sep', revenue: 135000, events: 13, guests: 490 },
    { month: 'Oct', revenue: 165000, events: 18, guests: 580 },
    { month: 'Nov', revenue: 185000, events: 20, guests: 650 },
    { month: 'Dec', revenue: 220000, events: 25, guests: 720 }
  ];

  const eventTypeData = [
    { type: 'Wedding', count: 45, percentage: 35, color: 'bg-blue-500' },
    { type: 'Corporate', count: 32, percentage: 25, color: 'bg-green-500' },
    { type: 'Birthday', count: 28, percentage: 22, color: 'bg-yellow-500' },
    { type: 'Other', count: 23, percentage: 18, color: 'bg-purple-500' }
  ];

  const performanceMetrics = [
    {
      title: language === 'en' ? 'Total Revenue' : 'மொத்த வருவாய்',
      value: '₹1.4M',
      change: '+18%',
      trend: 'up',
      icon: DollarSign,
      color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    },
    {
      title: language === 'en' ? 'Events This Month' : 'இந்த மாத நிகழ்வுகள்',
      value: '25',
      change: '+12%',
      trend: 'up',
      icon: Calendar,
      color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    },
    {
      title: language === 'en' ? 'Total Guests' : 'மொத்த விருந்தினர்கள்',
      value: '720',
      change: '+8%',
      trend: 'up',
      icon: Users,
      color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
    },
    {
      title: language === 'en' ? 'Conversion Rate' : 'மாற்ற விகிதம்',
      value: '89%',
      change: '+5%',
      trend: 'up',
      icon: Activity,
      color: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
    }
  ];

  const getMetricValue = (metric: string) => {
    switch (metric) {
      case 'revenue':
        return chartData.map(d => d.revenue);
      case 'events':
        return chartData.map(d => d.events);
      case 'guests':
        return chartData.map(d => d.guests);
      default:
        return chartData.map(d => d.revenue);
    }
  };

  const getMetricLabel = (metric: string) => {
    switch (metric) {
      case 'revenue':
        return language === 'en' ? 'Revenue (₹)' : 'வருவாய் (₹)';
      case 'events':
        return language === 'en' ? 'Events Count' : 'நிகழ்வுகளின் எண்ணிக்கை';
      case 'guests':
        return language === 'en' ? 'Guest Count' : 'விருந்தினர்களின் எண்ணிக்கை';
      default:
        return language === 'en' ? 'Revenue (₹)' : 'வருவாய் (₹)';
    }
  };

  const getMetricColor = (metric: string) => {
    switch (metric) {
      case 'revenue':
        return 'bg-green-500';
      case 'events':
        return 'bg-blue-500';
      case 'guests':
        return 'bg-purple-500';
      default:
        return 'bg-green-500';
    }
  };

  const maxValue = Math.max(...getMetricValue(selectedMetric));
  const minValue = Math.min(...getMetricValue(selectedMetric));

  return (
    <div className="space-y-8">
      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {performanceMetrics.map((metric, index) => (
          <Card key={index} className="card-chapa rounded-none shadow-subtle">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-none flex items-center justify-center ${metric.color}`}>
                  <metric.icon className="w-6 h-6" />
                </div>
                <div className="text-right">
                  <div className={`text-sm font-body ${
                    metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {metric.change}
                  </div>
                  <div className="text-xs font-body text-gray-500">
                    {metric.trend === 'up' ? <TrendingUp className="w-3 h-3 inline" /> : <TrendingDown className="w-3 h-3 inline" />}
                  </div>
                </div>
              </div>
              <div className={`text-2xl font-display font-bold mb-2 ${
                isDark ? 'text-white' : 'text-chapa-charcoal'
              }`}>
                {metric.value}
              </div>
              <div className={`text-sm font-body ${
                isDark ? 'text-white/70' : 'text-chapa-medium-gray'
              }`}>
                {metric.title}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Chart Controls */}
      <Card className="card-chapa rounded-none shadow-subtle">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className={`text-xl font-display font-semibold ${
              isDark ? 'text-white' : 'text-chapa-charcoal'
            }`}>
              {language === 'en' ? 'Analytics Dashboard' : 'பகுப்பாய்வு டாஷ்போர்டு'}
            </CardTitle>
            <div className="flex space-x-4">
              <div>
                <label className={`text-sm font-medium mb-2 block ${
                  isDark ? 'text-white' : 'text-chapa-charcoal'
                }`}>
                  {language === 'en' ? 'Time Range' : 'நேர வரம்பு'}
                </label>
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3months">{language === 'en' ? '3 Months' : '3 மாதங்கள்'}</SelectItem>
                    <SelectItem value="6months">{language === 'en' ? '6 Months' : '6 மாதங்கள்'}</SelectItem>
                    <SelectItem value="1year">{language === 'en' ? '1 Year' : '1 ஆண்டு'}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className={`text-sm font-medium mb-2 block ${
                  isDark ? 'text-white' : 'text-chapa-charcoal'
                }`}>
                  {language === 'en' ? 'Metric' : 'அளவீடு'}
                </label>
                <Select value={selectedMetric} onValueChange={setSelectedMetric}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="revenue">{language === 'en' ? 'Revenue' : 'வருவாய்'}</SelectItem>
                    <SelectItem value="events">{language === 'en' ? 'Events' : 'நிகழ்வுகள்'}</SelectItem>
                    <SelectItem value="guests">{language === 'en' ? 'Guests' : 'விருந்தினர்கள்'}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {/* Bar Chart */}
            <div>
              <h4 className={`text-lg font-display font-semibold mb-4 ${
                isDark ? 'text-white' : 'text-chapa-charcoal'
              }`}>
                {getMetricLabel(selectedMetric)} - {language === 'en' ? 'Monthly Trend' : 'மாதாந்திர போக்கு'}
              </h4>
              <div className="h-64 flex items-end justify-between space-x-2">
                {chartData.map((data, index) => {
                  const value = getMetricValue(selectedMetric)[index];
                  const height = ((value - minValue) / (maxValue - minValue)) * 100;
                  return (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div className="text-xs text-gray-500 mb-2">
                        {data.month}
                      </div>
                      <div 
                        className={`w-full ${getMetricColor(selectedMetric)} rounded-t-sm transition-all duration-300 hover:opacity-80`}
                        style={{ height: `${Math.max(height, 5)}%` }}
                      />
                      <div className="text-xs text-gray-600 mt-2 text-center">
                        {selectedMetric === 'revenue' ? `₹${(value / 1000).toFixed(0)}K` : value}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Event Types Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h4 className={`text-lg font-display font-semibold mb-4 ${
                  isDark ? 'text-white' : 'text-chapa-charcoal'
                }`}>
                  {language === 'en' ? 'Event Types Distribution' : 'நிகழ்வு வகைகளின் பரவல்'}
                </h4>
                <div className="space-y-3">
                  {eventTypeData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-4 h-4 rounded-full ${item.color}`} />
                        <span className={`font-medium ${
                          isDark ? 'text-white' : 'text-chapa-charcoal'
                        }`}>
                          {item.type}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`text-sm ${
                          isDark ? 'text-white/70' : 'text-chapa-medium-gray'
                        }`}>
                          {item.count}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {item.percentage}%
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Stats */}
              <div>
                <h4 className={`text-lg font-display font-semibold mb-4 ${
                  isDark ? 'text-white' : 'text-chapa-charcoal'
                }`}>
                  {language === 'en' ? 'Quick Statistics' : 'விரைவு புள்ளிவிவரங்கள்'}
                </h4>
                <div className="space-y-4">
                  <div className="p-4 bg-chapa-light-gray rounded-none">
                    <div className="flex items-center justify-between">
                      <span className={`font-medium ${
                        isDark ? 'text-white' : 'text-chapa-charcoal'
                      }`}>
                        {language === 'en' ? 'Average Event Value' : 'சராசரி நிகழ்வு மதிப்பு'}
                      </span>
                      <span className={`text-lg font-bold ${
                        isDark ? 'text-white' : 'text-chapa-charcoal'
                      }`}>
                        ₹56,000
                      </span>
                    </div>
                  </div>
                  <div className="p-4 bg-chapa-light-gray rounded-none">
                    <div className="flex items-center justify-between">
                      <span className={`font-medium ${
                        isDark ? 'text-white' : 'text-chapa-charcoal'
                      }`}>
                        {language === 'en' ? 'Customer Satisfaction' : 'வாடிக்கையாளர் திருப்தி'}
                      </span>
                      <span className={`text-lg font-bold ${
                        isDark ? 'text-white' : 'text-chapa-charcoal'
                      }`}>
                        4.9/5.0
                      </span>
                    </div>
                  </div>
                  <div className="p-4 bg-chapa-light-gray rounded-none">
                    <div className="flex items-center justify-between">
                      <span className={`font-medium ${
                        isDark ? 'text-white' : 'text-chapa-charcoal'
                      }`}>
                        {language === 'en' ? 'Repeat Customer Rate' : 'மீண்டும் வரும் வாடிக்கையாளர் விகிதம்'}
                      </span>
                      <span className={`text-lg font-bold ${
                        isDark ? 'text-white' : 'text-chapa-charcoal'
                      }`}>
                        78%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsOverview;
