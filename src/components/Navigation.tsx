import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';
import { Menu, X, Sun, Moon, Globe, Monitor, Settings, ChevronDown, ChefHat, Users, MapPin, Target, Calendar } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { Link } from 'react-router-dom';

interface NavigationProps {
  language: 'en' | 'ta';
  onLanguageChange: (language: 'en' | 'ta') => void;
}

const Navigation: React.FC<NavigationProps> = ({ language, onLanguageChange }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const { theme, setTheme, resolvedTheme } = useTheme();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };

    // Close dropdowns when pressing Escape key
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscapeKey);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, []);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const toggleDropdown = (dropdown: string) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  const getThemeIcon = () => {
    if (theme === 'system') {
      return <Monitor className="w-5 h-5" />;
    }
    return resolvedTheme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />;
  };

  const cycleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else if (theme === 'dark') {
      setTheme('system');
    } else {
      setTheme('light');
    }
  };

  const navItems = [
    { name: language === 'en' ? 'HOME' : 'முகப்பு', href: '#home' },
    { name: language === 'en' ? 'EVENTS' : 'நிகழ்வுகள்', href: '#events' },
    { name: language === 'en' ? 'MENUS' : 'மெனுக்கள்', href: '#menus' },
    { name: language === 'en' ? 'ABOUT US' : 'எங்களைப் பற்றி', href: '#about' },
    { name: language === 'en' ? 'CONTACT' : 'தொடர்பு', href: '#contact' }
  ];

  const microservicesDropdown = [
    {
      name: language === 'en' ? 'Menu Selection' : 'மெனு தேர்வு',
      href: `/menu-selection${language === 'ta' ? '/ta' : ''}`,
      icon: <ChefHat className="w-4 h-4" />,
      description: language === 'en' ? 'Advanced menu planning' : 'மேம்பட்ட மெனு திட்டமிடல்'
    },
    {
      name: language === 'en' ? 'Session Planning' : 'அமர்வு திட்டமிடல்',
      href: `/session-planning${language === 'ta' ? '/ta' : ''}`,
      icon: <Users className="w-4 h-4" />,
      description: language === 'en' ? 'Session management' : 'அமர்வு நிர்வாகம்'
    },
    {
      name: language === 'en' ? 'Integrated Planning' : 'ஒருங்கிணைந்த திட்டமிடல்',
      href: `/integrated-planning${language === 'ta' ? '/ta' : ''}`,
      icon: <Target className="w-4 h-4" />,
      description: language === 'en' ? 'Complete event planning' : 'முழுமையான நிகழ்வு திட்டமிடல்'
    }
  ];

  const componentsDropdown = [
    {
      name: language === 'en' ? 'Enhanced Event Planner' : 'மேம்பட்ட நிகழ்வு திட்டமிடல்',
      href: `/enhanced-event-planner${language === 'ta' ? '/ta' : ''}`,
      icon: <Calendar className="w-4 h-4" />,
      description: language === 'en' ? 'Advanced planning tools' : 'மேம்பட்ட திட்டமிடல் கருவிகள்'
    },
    {
      name: language === 'en' ? 'Venue Selection' : 'இட தேர்வு',
      href: `/venue-selection${language === 'ta' ? '/ta' : ''}`,
      icon: <MapPin className="w-4 h-4" />,
      description: language === 'en' ? 'Venue management' : 'இட நிர்வாகம்'
    },
    {
      name: language === 'en' ? 'Event Planning Flow' : 'நிகழ்வு திட்டமிடல் ஓட்டம்',
      href: `/event-planning${language === 'ta' ? '/ta' : ''}`,
      icon: <Target className="w-4 h-4" />,
      description: language === 'en' ? 'Complete workflow' : 'முழுமையான பணி ஓட்டம்'
    }
  ];

  const enhancedNavItems = [
    ...navItems,
    { 
      name: language === 'en' ? 'PLAN EVENT' : 'நிகழ்வைத் திட்டமிடுங்கள்', 
      href: language === 'en' ? '/event-planning' : '/event-planning/ta',
      isExternal: true
    }
  ];

  const isDark = resolvedTheme === 'dark';

  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, type: "spring", bounce: 0.3 }}
      className={`${
        isDark 
          ? 'bg-black/95 backdrop-blur-xl border-b border-white/10 shadow-elegant' 
          : 'bg-white/95 backdrop-blur-xl border-b border-chapa-light-gray shadow-subtle'
      } sticky top-0 z-50`}
    >
      <div className="container-chapa">
        <div className="flex items-center justify-between h-20">
          {/* Chapa-style Logo/Brand */}
          <motion.div 
            className="flex items-center gap-4"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <div className="text-3xl font-display font-bold text-chapa-charcoal">
              {language === 'en' ? 'BKR' : 'பி.கே.ஆர்'}
            </div>
            <div className="hidden sm:block">
              <p className={`text-sm font-body font-medium ${
                isDark ? 'text-white/80' : 'text-chapa-medium-gray'
              }`}>
                {language === 'en' ? 'Boutique Caterer' : 'பூட்டிக் கேட்டரர்'}
              </p>
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <div ref={dropdownRef} className="hidden lg:flex items-center space-x-8">
            {enhancedNavItems.map((item, index) => (
              item.isExternal ? (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ 
                    y: -2,
                    color: isDark ? "#fbbf24" : "#d97706"
                  }}
                  className={`font-body font-medium text-sm tracking-wide transition-all duration-300 relative group ${
                    isDark 
                      ? 'text-white hover:text-chapa-gold' 
                      : 'text-chapa-charcoal hover:text-chapa-gold'
                  }`}
                >
                  <Link to={item.href}>
                    {item.name}
                    <motion.div
                      className={`absolute -bottom-1 left-0 w-0 h-0.5 transition-all duration-300 ${
                        isDark ? 'bg-chapa-gold' : 'bg-chapa-gold'
                      }`}
                      initial={{ width: 0 }}
                      whileHover={{ width: "100%" }}
                    />
                  </Link>
                </motion.div>
              ) : (
                <motion.a
                  key={item.name}
                  href={item.href}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ 
                    y: -2,
                    color: isDark ? "#fbbf24" : "#d97706"
                  }}
                  className={`font-body font-medium text-sm tracking-wide transition-all duration-300 relative group ${
                    isDark 
                      ? 'text-white hover:text-chapa-gold' 
                      : 'text-chapa-charcoal hover:text-chapa-gold'
                  }`}
                >
                  {item.name}
                  <motion.div
                    className={`absolute -bottom-1 left-0 w-0 h-0.5 transition-all duration-300 ${
                      isDark ? 'bg-chapa-gold' : 'bg-chapa-gold'
                    }`}
                    initial={{ width: 0 }}
                    whileHover={{ width: "100%" }}
                  />
                </motion.a>
              )
            ))}

            {/* Microservices Dropdown */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <button
                onClick={() => toggleDropdown('microservices')}
                className={`flex items-center gap-2 font-body font-medium text-sm tracking-wide transition-all duration-300 relative group ${
                  isDark 
                    ? 'text-white hover:text-chapa-gold' 
                    : 'text-chapa-charcoal hover:text-chapa-gold'
                }`}
              >
                {language === 'en' ? 'MICROSERVICES' : 'மைக்ரோசர்விஸ்கள்'}
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${
                  activeDropdown === 'microservices' ? 'rotate-180' : ''
                }`} />
                <motion.div
                  className={`absolute -bottom-1 left-0 w-0 h-0.5 transition-all duration-300 ${
                    isDark ? 'bg-chapa-gold' : 'bg-chapa-gold'
                  }`}
                  initial={{ width: 0 }}
                  whileHover={{ width: "100%" }}
                />
              </button>

              <AnimatePresence>
                {activeDropdown === 'microservices' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className={`absolute top-full left-0 mt-2 w-80 rounded-lg shadow-xl border ${
                      isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                    }`}
                  >
                    <div className="p-4 space-y-3">
                      {microservicesDropdown.map((item, index) => (
                        <motion.div
                          key={item.name}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.2, delay: index * 0.05 }}
                        >
                          <Link
                            to={item.href}
                            className={`flex items-start gap-3 p-3 rounded-lg transition-all duration-200 hover:bg-opacity-10 ${
                              isDark 
                                ? 'hover:bg-white text-white hover:text-chapa-gold' 
                                : 'hover:bg-gray-100 text-gray-700 hover:text-chapa-gold'
                            }`}
                            onClick={() => setActiveDropdown(null)}
                          >
                            <div className={`p-2 rounded-lg ${
                              isDark ? 'bg-gray-700' : 'bg-gray-100'
                            }`}>
                              {item.icon}
                            </div>
                            <div>
                              <div className="font-medium text-sm">{item.name}</div>
                              <div className={`text-xs ${
                                isDark ? 'text-gray-400' : 'text-gray-500'
                              }`}>
                                {item.description}
                              </div>
                            </div>
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Components Dropdown */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <button
                onClick={() => toggleDropdown('components')}
                className={`flex items-center gap-2 font-body font-medium text-sm tracking-wide transition-all duration-300 relative group ${
                  isDark 
                    ? 'text-white hover:text-chapa-gold' 
                    : 'text-chapa-charcoal hover:text-chapa-gold'
                }`}
              >
                {language === 'en' ? 'COMPONENTS' : 'கூறுகள்'}
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${
                  activeDropdown === 'components' ? 'rotate-180' : ''
                }`} />
                <motion.div
                  className={`absolute -bottom-1 left-0 w-0 h-0.5 transition-all duration-300 ${
                    isDark ? 'bg-chapa-gold' : 'bg-chapa-gold'
                  }`}
                  initial={{ width: 0 }}
                  whileHover={{ width: "100%" }}
                />
              </button>

              <AnimatePresence>
                {activeDropdown === 'components' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className={`absolute top-full left-0 mt-2 w-80 rounded-lg shadow-xl border ${
                      isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                    }`}
                  >
                    <div className="p-4 space-y-3">
                      {componentsDropdown.map((item, index) => (
                        <motion.div
                          key={item.name}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.2, delay: index * 0.05 }}
                        >
                          <Link
                            to={item.href}
                            className={`flex items-start gap-3 p-3 rounded-lg transition-all duration-200 hover:bg-opacity-10 ${
                              isDark 
                                ? 'hover:bg-white text-white hover:text-chapa-gold' 
                                : 'hover:bg-gray-100 text-gray-700 hover:text-chapa-gold'
                            }`}
                            onClick={() => setActiveDropdown(null)}
                          >
                            <div className={`p-2 rounded-lg ${
                              isDark ? 'bg-gray-700' : 'bg-gray-100'
                            }`}>
                              {item.icon}
                            </div>
                            <div>
                              <div className="font-medium text-sm">{item.name}</div>
                              <div className={`text-xs ${
                                isDark ? 'text-gray-400' : 'text-gray-500'
                              }`}>
                                {item.description}
                              </div>
                            </div>
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Enhanced Contact Info & CTA */}
          <div className="hidden lg:flex items-center space-x-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="text-right"
            >
              <div className={`text-xs font-body font-medium tracking-wide ${
                isDark ? 'text-white/60' : 'text-chapa-medium-gray'
              }`}>
                {language === 'en' ? 'Call Now' : 'இப்போது அழைக்கவும்'}
              </div>
              <div className={`font-body font-semibold text-sm hover:text-chapa-gold transition-colors duration-300 ${
                isDark ? 'text-white' : 'text-chapa-charcoal'
              }`}>
                +91 8012686883
              </div>
            </motion.div>

            {/* Admin Dashboard Link */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Button
                variant="ghost"
                size="sm"
                asChild
                className={`w-10 h-10 rounded-none border transition-all duration-300 ${
                  isDark 
                    ? 'bg-white/10 hover:bg-white/20 border-white/20 text-white hover:text-chapa-gold' 
                    : 'bg-chapa-light-gray hover:bg-chapa-light-gray/80 border-chapa-light-gray text-chapa-charcoal hover:text-chapa-gold'
                }`}
              >
                <a href={`/admin${language === 'ta' ? '/ta' : ''}`}>
                  <Settings className="w-5 h-5" />
                </a>
              </Button>
            </motion.div>

            {/* Enhanced Theme Toggle */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className="relative group"
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={cycleTheme}
                className={`w-10 h-10 rounded-none border transition-all duration-300 ${
                  isDark 
                    ? 'bg-white/10 hover:bg-white/20 border-white/20 text-white hover:text-chapa-gold' 
                    : 'bg-chapa-light-gray hover:bg-chapa-light-gray/80 border-chapa-light-gray text-chapa-charcoal hover:text-chapa-gold'
                }`}
              >
                {getThemeIcon()}
              </Button>
              {/* Theme Tooltip */}
              <div className={`absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs rounded-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none ${
                isDark 
                  ? 'bg-white/90 text-chapa-charcoal' 
                  : 'bg-chapa-charcoal/90 text-white'
              }`}>
                {theme === 'system' ? 'System' : theme === 'light' ? 'Light' : 'Dark'}
              </div>
            </motion.div>

            {/* Enhanced Language Toggle */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onLanguageChange(language === 'en' ? 'ta' : 'en')}
                className={`w-10 h-10 rounded-none border transition-all duration-300 ${
                  isDark 
                    ? 'bg-white/10 hover:bg-white/20 border-white/20 text-white hover:text-chapa-gold' 
                    : 'bg-chapa-light-gray hover:bg-chapa-light-gray/80 border-chapa-light-gray text-chapa-charcoal hover:text-chapa-gold'
                }`}
              >
                <Globe className="w-5 h-5" />
              </Button>
            </motion.div>

            {/* Chapa-style Plan Event Button */}
            <motion.div
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Button className="btn-chapa-primary font-body font-medium text-sm tracking-wide px-8 py-3">
                {language === 'en' ? 'REQUEST A QUOTE' : 'விலை கேள்வி'}
              </Button>
            </motion.div>
          </div>

          {/* Mobile Menu Button */}
          <motion.div
            className="lg:hidden"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMobileMenu}
              className={`w-10 h-10 rounded-none border transition-all duration-300 ${
                isDark 
                  ? 'bg-white/10 hover:bg-white/20 border-white/20 text-white hover:text-chapa-gold' 
                  : 'bg-chapa-light-gray hover:bg-chapa-light-gray/80 border-chapa-light-gray text-chapa-charcoal hover:text-chapa-gold'
              }`}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </motion.div>
        </div>

        {/* Enhanced Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="lg:hidden overflow-hidden"
            >
              <div className={`py-6 space-y-4 border-t ${
                isDark ? 'border-white/20' : 'border-chapa-light-gray'
              }`}>
                {enhancedNavItems.map((item, index) => (
                  item.isExternal ? (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      whileHover={{ x: 10, color: "#fbbf24" }}
                      className={`block font-body font-medium py-3 text-sm tracking-wide transition-all duration-300 ${
                        isDark 
                          ? 'text-white hover:text-chapa-gold' 
                          : 'text-chapa-charcoal hover:text-chapa-gold'
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Link to={item.href}>
                        {item.name}
                      </Link>
                    </motion.div>
                  ) : (
                    <motion.a
                      key={item.name}
                      href={item.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      whileHover={{ x: 10, color: "#fbbf24" }}
                      className={`block font-body font-medium py-3 text-sm tracking-wide transition-all duration-300 ${
                        isDark 
                          ? 'text-white hover:text-chapa-gold' 
                          : 'text-chapa-charcoal hover:text-chapa-gold'
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.name}
                    </motion.a>
                  )
                ))}
                
                {/* Admin Dashboard Link in Mobile Menu */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 }}
                  className="pt-2"
                >
                  <a
                    href={`/admin${language === 'ta' ? '/ta' : ''}`}
                    className={`flex items-center gap-2 font-body font-medium py-3 text-sm tracking-wide transition-all duration-300 ${
                      isDark 
                        ? 'text-white hover:text-chapa-gold' 
                        : 'text-chapa-charcoal hover:text-chapa-gold'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Settings className="w-4 h-4" />
                    {language === 'en' ? 'Admin Dashboard' : 'நிர்வாக டாஷ்போர்டு'}
                  </a>
                </motion.div>

                {/* Microservices in Mobile Menu */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 }}
                  className="pt-2"
                >
                  <div className={`text-xs font-body font-medium tracking-wide mb-3 ${
                    isDark ? 'text-white/60' : 'text-chapa-medium-gray'
                  }`}>
                    {language === 'en' ? 'MICROSERVICES' : 'மைக்ரோசர்விஸ்கள்'}
                  </div>
                  <div className="space-y-2">
                    {microservicesDropdown.map((item, index) => (
                      <motion.div
                        key={item.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
                      >
                        <Link
                          to={item.href}
                          className={`flex items-center gap-3 py-2 pl-4 text-sm transition-all duration-300 ${
                            isDark 
                              ? 'text-white/80 hover:text-chapa-gold' 
                              : 'text-chapa-charcoal/80 hover:text-chapa-gold'
                          }`}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {item.icon}
                          {item.name}
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Components in Mobile Menu */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.7 }}
                  className="pt-2"
                >
                  <div className={`text-xs font-body font-medium tracking-wide mb-3 ${
                    isDark ? 'text-white/60' : 'text-chapa-medium-gray'
                  }`}>
                    {language === 'en' ? 'COMPONENTS' : 'கூறுகள்'}
                  </div>
                  <div className="space-y-2">
                    {componentsDropdown.map((item, index) => (
                      <motion.div
                        key={item.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.8 + index * 0.1 }}
                      >
                        <Link
                          to={item.href}
                          className={`flex items-center gap-3 py-2 pl-4 text-sm transition-all duration-300 ${
                            isDark 
                              ? 'text-white/80 hover:text-chapa-gold' 
                              : 'text-chapa-charcoal/80 hover:text-chapa-gold'
                          }`}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {item.icon}
                          {item.name}
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
                
                {/* Mobile Contact & Actions */}
                <div className={`pt-6 space-y-4 border-t ${
                  isDark ? 'border-white/20' : 'border-chapa-light-gray'
                }`}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.5 }}
                    className="text-center"
                  >
                    <div className={`text-xs font-body font-medium tracking-wide mb-2 ${
                      isDark ? 'text-white/60' : 'text-chapa-medium-gray'
                    }`}>
                      {language === 'en' ? 'Call Now' : 'இப்போது அழைக்கவும்'}
                    </div>
                    <div className={`font-body font-semibold text-lg ${
                      isDark ? 'text-white' : 'text-chapa-charcoal'
                    }`}>
                      +91 8012686883
                    </div>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.6 }}
                    className="flex justify-center space-x-4"
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={cycleTheme}
                      className={`w-10 h-10 rounded-none border transition-all duration-300 relative group ${
                        isDark 
                          ? 'bg-white/10 hover:bg-white/20 border-white/20 text-white hover:text-chapa-gold' 
                          : 'bg-chapa-light-gray hover:bg-chapa-light-gray/80 border-chapa-light-gray text-chapa-charcoal hover:text-chapa-gold'
                      }`}
                    >
                      {getThemeIcon()}
                      {/* Mobile Theme Tooltip */}
                      <div className={`absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs rounded-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none ${
                        isDark 
                          ? 'bg-white/90 text-chapa-charcoal' 
                          : 'bg-chapa-charcoal/90 text-white'
                      }`}>
                        {theme === 'system' ? 'System' : theme === 'light' ? 'Light' : 'Dark'}
                      </div>
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onLanguageChange(language === 'en' ? 'ta' : 'en')}
                      className={`w-10 h-10 rounded-none border transition-all duration-300 ${
                        isDark 
                          ? 'bg-white/10 hover:bg-white/20 border-white/20 text-white hover:text-chapa-gold' 
                          : 'bg-chapa-light-gray hover:bg-chapa-light-gray/80 border-chapa-light-gray text-chapa-charcoal hover:text-chapa-gold'
                      }`}
                    >
                      <Globe className="w-5 h-5" />
                    </Button>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.7 }}
                    className="text-center"
                  >
                    <Button className="w-full btn-chapa-primary font-body font-medium text-sm tracking-wide py-3">
                      {language === 'en' ? 'REQUEST A QUOTE' : 'விலை கேள்வி'}
                    </Button>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navigation;