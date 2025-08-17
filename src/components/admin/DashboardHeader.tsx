import React from 'react';
import { motion } from 'framer-motion';

interface DashboardHeaderProps {
  language: 'en' | 'ta';
  isDark: boolean;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ language, isDark }) => {
  return (
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
  );
};

export default DashboardHeader;
