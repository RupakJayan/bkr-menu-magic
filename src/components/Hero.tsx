import React from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ArrowDown, MapPin, Phone } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

interface HeroProps {
  language: 'en' | 'ta';
}

const Hero: React.FC<HeroProps> = ({ language }) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  return (
    <section className={`relative min-h-screen flex items-center justify-center overflow-hidden ${
      isDark 
        ? 'bg-black' 
        : 'bg-white'
    }`}>
      {/* Subtle Background Pattern */}
      <div className={`absolute inset-0 ${
        isDark 
          ? 'bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.02),transparent_50%)]' 
          : 'bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0.01),transparent_50%)]'
      }`} />

      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Chapa-style Badge */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
          className="mb-8"
        >
          <Badge className="bg-chapa-charcoal text-white border-0 rounded-none px-6 py-2 text-sm font-body font-medium tracking-wide shadow-subtle">
            {language === 'en' ? 'Boutique Sydney Caterer' : 'பூட்டிக் சிட்னி கேட்டரர்'}
          </Badge>
        </motion.div>

        {/* Main Heading - Chapa Style */}
        <motion.h1
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, type: "spring", bounce: 0.3 }}
          className="text-5xl md:text-7xl lg:text-8xl font-display font-bold mb-8 leading-[0.9] tracking-tight"
        >
          <span className="text-chapa-charcoal">
            {language === 'en' ? 'BKR' : 'பி.கே.ஆர்'}
          </span>
          <br />
          <span className="text-chapa-charcoal">
            {language === 'en' ? 'CATERING' : 'கேட்டரிங்'}
          </span>
        </motion.h1>

        {/* Chapa-style Subtitle */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-2xl md:text-3xl font-display font-normal italic mb-8 text-chapa-medium-gray"
        >
          {language === 'en' 
            ? 'Creating Unforgettable Experiences'
            : 'மறக்கமுடியாத அனுபவங்களை உருவாக்குகிறோம்'
          }
        </motion.h2>

        {/* Enhanced Description */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className={`text-lg md:text-xl max-w-4xl mx-auto leading-relaxed font-body font-normal mb-12 ${
            isDark ? 'text-white/80' : 'text-chapa-medium-gray'
          }`}
        >
          {language === 'en' 
            ? 'Welcome to BKR, your premier choice for exquisite events in Tamil Nadu. With over 14 years of catering experience, we specialise in crafting memorable moments for corporate events, weddings, and private parties.'
            : 'தமிழ்நாட்டில் உள்ள சிறந்த நிகழ்வுகளுக்கான உங்கள் முதன்மை தேர்வான BKR-க்கு வரவேற்கிறோம். 14 ஆண்டுகளுக்கும் மேற்பட்ட கேட்டரிங் அனுபவத்துடன், நிறுவன நிகழ்வுகள், திருமணங்கள் மற்றும் தனிப்பட்ட விருந்துகளுக்கான மறக்கமுடியாத தருணங்களை உருவாக்குவதில் நாங்கள் சிறப்பு பெறுகிறோம்.'
          }
        </motion.p>

        {/* Enhanced Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
        >
          {[
            { value: '5000+', label: language === 'en' ? 'Happy Clients' : 'மகிழ்ச்சியான வாடிக்கையாளர்கள்' },
            { value: '1000+', label: language === 'en' ? 'Events Catered' : 'கேட்டரிங் செய்யப்பட்ட நிகழ்வுகள்' },
            { value: '4.9', label: language === 'en' ? 'Rating' : 'மதிப்பீடு' },
            { value: '14', label: language === 'en' ? 'Years' : 'ஆண்டுகள்' }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.7 + index * 0.1, type: "spring", bounce: 0.4 }}
              whileHover={{ 
                scale: 1.05, 
                y: -5,
                transition: { duration: 0.2 }
              }}
              className="group"
            >
              <div className={`${
                isDark 
                  ? 'bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/20 hover:border-white/40' 
                  : 'bg-chapa-light-gray backdrop-blur-xl border border-chapa-light-gray hover:bg-chapa-light-gray/80 hover:border-chapa-light-gray'
              } rounded-none p-6 transition-all duration-300 hover:shadow-elegant`}>
                <div className={`text-2xl md:text-3xl font-display font-bold mb-2 group-hover:text-chapa-gold transition-colors duration-300 ${
                  isDark ? 'text-white' : 'text-chapa-charcoal'
                }`}>
                  {stat.value}
                </div>
                <div className={`text-xs font-body font-medium transition-colors duration-300 ${
                  isDark 
                    ? 'text-white/70 group-hover:text-white/90' 
                    : 'text-chapa-medium-gray group-hover:text-chapa-charcoal'
                }`}>
                  {stat.label}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Enhanced CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12"
        >
          <motion.div
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Button className="btn-chapa-primary font-body font-medium text-lg px-10 py-4 tracking-wide">
              {language === 'en' ? 'REQUEST A QUOTE' : 'விலை கேள்வி'}
            </Button>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Button variant="outline" className={`${
              isDark 
                ? 'border-2 border-white text-white hover:bg-white hover:text-black' 
                : 'border-2 border-chapa-charcoal text-chapa-charcoal hover:bg-chapa-charcoal hover:text-white'
            } rounded-none px-10 py-4 text-lg font-body font-medium tracking-wide transition-all duration-300 hover:shadow-elegant`}>
              {language === 'en' ? 'VIEW MENUS' : 'மெனுக்களைக் காண்க'}
            </Button>
          </motion.div>
        </motion.div>

        {/* Enhanced Location & Contact */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className={`flex flex-col sm:flex-row items-center justify-center gap-8 ${
            isDark ? 'text-white/70' : 'text-chapa-medium-gray'
          }`}
        >
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="flex items-center gap-3 hover:text-chapa-gold transition-colors duration-300"
          >
            <MapPin className="w-5 h-5" />
            <span className="text-lg font-body">Anaimalai, Pollachi, Tamil Nadu</span>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="flex items-center gap-3 hover:text-chapa-gold transition-colors duration-300"
          >
            <Phone className="w-5 h-5" />
            <span className="text-lg font-body">+91 8012686883</span>
          </motion.div>
        </motion.div>

        {/* Enhanced Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className={`w-6 h-10 border-2 rounded-none flex justify-center ${
              isDark ? 'border-white/50' : 'border-chapa-medium-gray'
            }`}
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className={`w-1 h-3 rounded-none mt-2 ${
                isDark ? 'bg-white/50' : 'bg-chapa-medium-gray'
              }`}
            />
          </motion.div>
          <motion.p
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className={`text-sm mt-2 text-center font-body ${
              isDark ? 'text-white/50' : 'text-chapa-medium-gray'
            }`}
          >
            {language === 'en' ? 'Scroll to explore' : 'ஆராய்ந்து பார்க்க உருள்க'}
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;