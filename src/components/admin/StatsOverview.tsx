import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '../ui/card';
import { 
  Users, 
  Calendar, 
  DollarSign, 
  Star,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

interface StatsOverviewProps {
  language: 'en' | 'ta';
  isDark: boolean;
}

const StatsOverview: React.FC<StatsOverviewProps> = ({ language, isDark }) => {
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
  );
};

export default StatsOverview;
