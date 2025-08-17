import React from 'react';
import { motion } from 'framer-motion';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Facebook, 
  Instagram, 
  Twitter, 
  Youtube,
  ArrowUp
} from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

interface FooterProps {
  language: 'en' | 'ta';
}

const Footer: React.FC<FooterProps> = ({ language }) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  const footerLinks = {
    services: [
      { name: language === 'en' ? 'CORPORATE EVENTS' : 'நிறுவன நிகழ்வுகள்', href: '#corporate' },
      { name: language === 'en' ? 'WEDDINGS' : 'திருமணங்கள்', href: '#weddings' },
      { name: language === 'en' ? 'PRIVATE PARTIES' : 'தனிப்பட்ட விருந்துகள்', href: '#private' },
      { name: language === 'en' ? 'CATERING SERVICES' : 'கேட்டரிங் சேவைகள்', href: '#catering' }
    ],
    company: [
      { name: language === 'en' ? 'ABOUT US' : 'எங்களைப் பற்றி', href: '#about' },
      { name: language === 'en' ? 'OUR STORY' : 'எங்கள் கதை', href: '#story' },
      { name: language === 'en' ? 'TEAM' : 'அணி', href: '#team' },
      { name: language === 'en' ? 'CAREERS' : 'வாழ்க்கை வரலாறு', href: '#careers' }
    ],
    support: [
      { name: language === 'en' ? 'CONTACT US' : 'எங்களை தொடர்பு கொள்ளுங்கள்', href: '#contact' },
      { name: language === 'en' ? 'FAQ' : 'அடிக்கடி கேட்கப்படும் கேள்விகள்', href: '#faq' },
      { name: language === 'en' ? 'HELP CENTER' : 'உதவி மையம்', href: '#help' },
      { name: language === 'en' ? 'BOOKING SUPPORT' : 'முன்பதிவு உதவி', href: '#booking' }
    ],
    legal: [
      { name: language === 'en' ? 'TERMS OF SERVICE' : 'சேவை விதிமுறைகள்', href: '#terms' },
      { name: language === 'en' ? 'PRIVACY POLICY' : 'தனியுரிமைக் கொள்கை', href: '#privacy' }
    ]
  };

  const socialLinks = [
    { 
      name: 'Facebook', 
      icon: Facebook, 
      href: '#', 
      color: isDark ? 'hover:text-blue-400' : 'hover:text-blue-600' 
    },
    { 
      name: 'Instagram', 
      icon: Instagram, 
      href: '#', 
      color: isDark ? 'hover:text-pink-400' : 'hover:text-pink-600' 
    },
    { 
      name: 'Twitter', 
      icon: Twitter, 
      href: '#', 
      color: isDark ? 'hover:text-blue-300' : 'hover:text-blue-400' 
    },
    { 
      name: 'YouTube', 
      icon: Youtube, 
      href: '#', 
      color: isDark ? 'hover:text-red-400' : 'hover:text-red-600' 
    }
  ];

  return (
    <footer className={`relative overflow-hidden ${
      isDark 
        ? 'bg-black text-white' 
        : 'bg-chapa-charcoal text-white'
    }`}>
      <div className="container-chapa relative z-10">
        {/* Main Footer Content */}
        <div className="py-20">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            {/* Enhanced Brand Section */}
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
              className="lg:col-span-1"
            >
              <motion.div 
                className="flex items-center gap-3 mb-6"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <div className="text-3xl font-display font-bold text-white">
                  {language === 'en' ? 'BKR' : 'பி.கே.ஆர்'}
                </div>
              </motion.div>
              
              <p className={`leading-relaxed mb-8 font-body text-white/80`}>
                {language === 'en' 
                  ? 'We are a Boutique Caterer delivering restaurant-quality food to corporate events, weddings and private parties in Tamil Nadu.'
                  : 'தமிழ்நாட்டில் நிறுவன நிகழ்வுகள், திருமணங்கள் மற்றும் தனிப்பட்ட விருந்துகளுக்கு உணவக தரமான உணவை வழங்கும் பூட்டிக் கேட்டரர் நாங்கள்.'
                }
              </p>

              {/* Enhanced Contact Info */}
              <div className="space-y-4">
                <motion.div 
                  className="flex items-center gap-3 transition-colors duration-300 hover:text-chapa-gold"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <Phone className="w-4 h-4 text-chapa-gold" />
                  <span className="text-sm font-body">+91 8012686883</span>
                </motion.div>
                <motion.div 
                  className="flex items-center gap-3 transition-colors duration-300 hover:text-chapa-gold"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <Mail className="w-4 h-4 text-chapa-gold" />
                  <span className="text-sm font-body">info@bkr-catering.com</span>
                </motion.div>
                <motion.div 
                  className="flex items-center gap-3 transition-colors duration-300 hover:text-chapa-gold"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <MapPin className="w-4 h-4 text-chapa-gold" />
                  <span className="text-sm font-body">Anaimalai, Pollachi, Tamil Nadu</span>
                </motion.div>
              </div>
            </motion.div>

            {/* Enhanced Services Links */}
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.1, type: "spring", bounce: 0.4 }}
            >
              <h4 className="text-lg font-display font-semibold mb-6 text-white">
                {language === 'en' ? 'SERVICES' : 'சேவைகள்'}
              </h4>
              <ul className="space-y-3">
                {footerLinks.services.map((link, index) => (
                  <motion.li 
                    key={link.name}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 + index * 0.1, type: "spring", stiffness: 400, damping: 17 }}
                    whileHover={{ x: 5, color: "#fbbf24" }}
                  >
                    <a 
                      href={link.href} 
                      className="text-white/70 hover:text-chapa-gold transition-colors duration-200 text-sm font-body"
                    >
                      {link.name}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Enhanced Company Links */}
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2, type: "spring", bounce: 0.4 }}
            >
              <h4 className="text-lg font-display font-semibold mb-6 text-white">
                {language === 'en' ? 'COMPANY' : 'நிறுவனம்'}
              </h4>
              <ul className="space-y-3">
                {footerLinks.company.map((link, index) => (
                  <motion.li 
                    key={link.name}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 + index * 0.1, type: "spring", stiffness: 400, damping: 17 }}
                    whileHover={{ x: 5, color: "#fbbf24" }}
                  >
                    <a 
                      href={link.href} 
                      className="text-white/70 hover:text-chapa-gold transition-colors duration-200 text-sm font-body"
                    >
                      {link.name}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Enhanced Support Links */}
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3, type: "spring", bounce: 0.4 }}
            >
              <h4 className="text-lg font-display font-semibold mb-6 text-white">
                {language === 'en' ? 'SUPPORT' : 'உதவி'}
              </h4>
              <ul className="space-y-3">
                {footerLinks.support.map((link, index) => (
                  <motion.li 
                    key={link.name}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 + index * 0.1, type: "spring", stiffness: 400, damping: 17 }}
                    whileHover={{ x: 5, color: "#fbbf24" }}
                  >
                    <a 
                      href={link.href} 
                      className="text-white/70 hover:text-chapa-gold transition-colors duration-200 text-sm font-body"
                    >
                      {link.name}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Enhanced Legal Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="pt-12 border-t border-white/10"
          >
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex flex-wrap gap-6">
                {footerLinks.legal.map((link, index) => (
                  <motion.a
                    key={link.name}
                    href={link.href}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                    className="text-white/60 hover:text-chapa-gold transition-colors duration-200 text-sm font-body"
                  >
                    {link.name}
                  </motion.a>
                ))}
              </div>
              
              <div className="text-sm text-white/60 font-body">
                © 2024 BKR Catering. {language === 'en' ? 'All rights reserved.' : 'அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.'}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Enhanced Social Media Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="pb-8 border-t border-white/10"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <h5 className="text-lg font-display font-semibold mb-3 text-white">
                {language === 'en' ? 'Follow Us' : 'எங்களைப் பின்தொடரவும்'}
              </h5>
              <p className="text-white/70 text-sm font-body">
                {language === 'en' 
                  ? 'Stay updated with our latest events and culinary creations' 
                  : 'எங்கள் சமீபத்திய நிகழ்வுகள் மற்றும் சமையல் படைப்புகளுடன் புதுப்பிக்கப்பட்டு இருங்கள்'
                }
              </p>
            </div>
            
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-10 h-10 rounded-none flex items-center justify-center transition-all duration-200 ${social.color} hover:scale-105 ${
                    isDark ? 'bg-white/10' : 'bg-white/10'
                  }`}
                >
                  <social.icon className="w-5 h-5 text-white" />
                </motion.a>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Enhanced Scroll to Top Button */}
      <motion.button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.1, y: -2 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.3 }}
        className={`fixed bottom-8 right-8 w-12 h-12 rounded-none flex items-center justify-center transition-all duration-300 shadow-elegant ${
          isDark 
            ? 'bg-white/10 hover:bg-white/20 border border-white/20 text-white hover:text-chapa-gold' 
            : 'bg-chapa-charcoal/90 hover:bg-chapa-charcoal text-white hover:text-chapa-gold border border-chapa-light-gray'
        }`}
      >
        <ArrowUp className="w-5 h-5" />
      </motion.button>
    </footer>
  );
};

export default Footer;
