import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  ChefHat, 
  Users, 
  Calendar, 
  MapPin, 
  Star, 
  Utensils,
  Heart,
  Award,
  Clock,
  Phone,
  Mail
} from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

interface ServicesSectionProps {
  language: 'en' | 'ta';
}

const ServicesSection: React.FC<ServicesSectionProps> = ({ language }) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const services = [
    {
      icon: ChefHat,
      title: language === 'en' ? 'WEDDINGS' : 'திருமணங்கள்',
      title_ta: 'திருமணங்கள்',
      description: language === 'en' 
        ? 'Customised Cuisine for Dream Weddings. From elegant Champagne receptions to refined sit-down dinners, our wedding catering services are designed to dazzle.'
        : 'கனவு திருமணங்களுக்கான தனிப்பட்ட சமையல். நேர்த்தியான சம்பேன் வரவேற்புகளில் இருந்து சுத்தமான உட்கார்ந்து உண்ணும் விருந்துகள் வரை, எங்கள் திருமண கேட்டரிங் சேவைகள் கவர்ச்சியாக வடிவமைக்கப்பட்டுள்ளன.',
      features: [
        language === 'en' ? 'Custom menu planning' : 'தனிப்பட்ட மெனு திட்டமிடல்',
        language === 'en' ? 'Multiple cuisine options' : 'பல சமையல் விருப்பங்கள்',
        language === 'en' ? 'Professional service staff' : 'தொழில்முறை சேவை ஊழியர்கள்',
        language === 'en' ? 'Setup and cleanup' : 'அமைப்பு மற்றும் சுத்தம்'
      ],
      price: language === 'en' ? 'Starting from ₹500/person' : 'ஒரு நபருக்கு ₹500 முதல்',
      badge: language === 'en' ? 'Most Popular' : 'மிகவும் பிரபலமானது',
      color: 'bg-chapa-charcoal'
    },
    {
      icon: Users,
      title: language === 'en' ? 'CORPORATE EVENTS' : 'நிறுவன நிகழ்வுகள்',
      title_ta: 'நிறுவன நிகழ்வுகள்',
      description: language === 'en'
        ? 'Expert Corporate Event Caterer with 20 Years\' Experience. Elevate your corporate gatherings with tailored event catering services designed to meet your every need.'
        : '20 ஆண்டுகளுக்கும் மேற்பட்ட அனுபவத்துடன் கூடிய நிபுணர் நிறுவன நிகழ்வு கேட்டரர். உங்கள் அனைத்து தேவைகளையும் பூர்த்தி செய்ய வடிவமைக்கப்பட்ட தனிப்பட்ட நிகழ்வு கேட்டரிங் சேவைகளுடன் உங்கள் நிறுவன கூட்டங்களை உயர்த்துங்கள்.',
      features: [
        language === 'en' ? 'Business lunch packages' : 'வணிக மதிய உணவு தொகுப்புகள்',
        language === 'en' ? 'Dietary restrictions accommodated' : 'உணவு வரம்புகள் கவனிக்கப்படுகின்றன',
        language === 'en' ? 'On-time delivery' : 'சரியான நேரத்தில் விநியோகம்',
        language === 'en' ? 'Professional presentation' : 'தொழில்முறை வழங்கல்'
      ],
      price: language === 'en' ? 'Starting from ₹300/person' : 'ஒரு நபருக்கு ₹300 முதல்',
      badge: language === 'en' ? 'Business Ready' : 'வணிகத்திற்கு தயார்',
      color: 'bg-chapa-charcoal'
    },
    {
      icon: Calendar,
      title: language === 'en' ? 'PRIVATE EVENTS' : 'தனிப்பட்ட நிகழ்வுகள்',
      title_ta: 'தனிப்பட்ட நிகழ்வுகள்',
      description: language === 'en'
        ? 'Personalised Event Catering with Talented Chefs. Celebrate life\'s special moments with our dedicated team ensuring an exceptional experience.'
        : 'திறமையான சமையல்காரர்களுடன் தனிப்பட்ட நிகழ்வு கேட்டரிங். எங்கள் அர்ப்பணிப்புள்ள அணியுடன் வாழ்க்கையின் சிறப்பு தருணங்களை கொண்டாடுங்கள், சிறந்த அனுபவத்தை உறுதி செய்கிறோம்.',
      features: [
        language === 'en' ? 'Personalised menu design' : 'தனிப்பட்ட மெனு வடிவமைப்பு',
        language === 'en' ? 'Flexible serving options' : 'நெகிழ்வான சேவை விருப்பங்கள்',
        language === 'en' ? 'Special dietary needs' : 'சிறப்பு உணவு தேவைகள்',
        language === 'en' ? 'Beautiful presentation' : 'அழகான வழங்கல்'
      ],
      price: language === 'en' ? 'Starting from ₹400/person' : 'ஒரு நபருக்கு ₹400 முதல்',
      badge: language === 'en' ? 'Family Favorite' : 'குடும்ப பிரியம்',
      color: 'bg-chapa-charcoal'
    }
  ];

  const stats = [
    {
      icon: Users,
      value: '5000+',
      label: language === 'en' ? 'Happy Clients' : 'மகிழ்ச்சியான வாடிக்கையாளர்கள்',
      color: 'bg-chapa-charcoal'
    },
    {
      icon: Calendar,
      value: '1000+',
      label: language === 'en' ? 'Events Catered' : 'கேட்டரிங் செய்யப்பட்ட நிகழ்வுகள்',
      color: 'bg-chapa-charcoal'
    },
    {
      icon: Star,
      value: '4.9',
      label: language === 'en' ? 'Customer Rating' : 'வாடிக்கையாளர் மதிப்பீடு',
      color: 'bg-chapa-charcoal'
    },
    {
      icon: Clock,
      value: '14',
      label: language === 'en' ? 'Years Experience' : 'ஆண்டுகள் அனுபவம்',
      color: 'bg-chapa-charcoal'
    }
  ];

  return (
    <section className={`section-chapa relative overflow-hidden ${
      isDark 
        ? 'bg-black' 
        : 'bg-chapa-cream'
    }`}>
      <div className="container-chapa relative z-10">
        {/* Enhanced Header */}
        <motion.div 
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-3 text-white rounded-none px-6 py-3 mb-6 shadow-subtle bg-chapa-charcoal"
          >
            <span className="font-body font-medium text-sm tracking-wide">
              {language === 'en' ? 'Premium Services' : 'பிரீமியம் சேவைகள்'}
            </span>
          </motion.div>
          
          <h2 className={`text-4xl md:text-6xl font-display font-bold mb-8 leading-tight ${
            isDark 
              ? 'text-white' 
              : 'text-chapa-charcoal'
          }`}>
            {language === 'en' ? 'Our Services' : 'எங்கள் சேவைகள்'}
          </h2>
          <p className={`text-lg max-w-3xl mx-auto leading-relaxed font-body font-normal ${
            isDark ? 'text-white/80' : 'text-chapa-medium-gray'
          }`}>
            {language === 'en' 
              ? 'From intimate gatherings to grand celebrations, we provide exceptional catering services tailored to your unique needs and preferences.'
              : 'நெருக்கமான கூட்டங்களில் இருந்து பெரிய கொண்டாட்டங்கள் வரை, உங்கள் தனிப்பட்ட தேவைகள் மற்றும் விருப்பங்களுக்கு ஏற்ப வடிவமைக்கப்பட்ட சிறந்த கேட்டரிங் சேவைகளை நாங்கள் வழங்குகிறோம்.'
            }
          </p>
        </motion.div>

        {/* Enhanced Services Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 50, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: index * 0.2, type: "spring", bounce: 0.4 }}
              whileHover={{ 
                y: -8,
                scale: 1.01,
                transition: { duration: 0.3, type: "spring", stiffness: 400, damping: 17 }
              }}
              className="group"
            >
              <Card className={`h-full card-chapa rounded-none shadow-subtle hover:shadow-elegant transition-all duration-500 overflow-hidden`}>
                <CardHeader className="p-8 pb-6 relative">
                  <div className="flex items-start justify-between mb-6">
                    <motion.div 
                      className={`w-16 h-16 rounded-none flex items-center justify-center group-hover:scale-105 transition-transform duration-300 shadow-subtle bg-chapa-charcoal`}
                      whileHover={{ rotate: 5 }}
                      transition={{ duration: 0.6, type: "spring" }}
                    >
                      <service.icon className="w-8 h-8 text-white" />
                    </motion.div>
                    {service.badge && (
                      <Badge className={`text-white border-0 rounded-none px-3 py-1 text-xs font-body font-medium shadow-subtle bg-chapa-charcoal`}>
                        {service.badge}
                      </Badge>
                    )}
                  </div>
                  
                  <CardTitle className={`text-xl font-display font-semibold mb-4 ${
                    isDark ? 'text-white' : 'text-chapa-charcoal'
                  }`}>
                    {language === 'en' ? service.title : service.title_ta}
                  </CardTitle>
                  
                  <p className={`leading-relaxed mb-6 text-sm font-body ${
                    isDark ? 'text-white/80' : 'text-chapa-medium-gray'
                  }`}>
                    {language === 'en' ? service.description : service.description}
                  </p>
                  
                  <div className={`text-lg font-display font-semibold mb-4 text-chapa-gold`}>
                    {service.price}
                  </div>
                </CardHeader>
                
                <CardContent className="p-8 pt-0 relative">
                  {/* Enhanced Features */}
                  <div className="space-y-3 mb-6">
                    {service.features.map((feature, featureIndex) => (
                      <motion.div 
                        key={featureIndex} 
                        className="flex items-center gap-3"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.8 + featureIndex * 0.1 }}
                      >
                        <motion.div 
                          className={`w-2 h-2 rounded-none bg-chapa-gold`}
                          whileHover={{ scale: 1.5 }}
                          transition={{ type: "spring", stiffness: 400, damping: 17 }}
                        />
                        <span className={`text-sm font-body ${
                          isDark ? 'text-white/80' : 'text-chapa-medium-gray'
                        }`}>{feature}</span>
                      </motion.div>
                    ))}
                  </div>
                  
                  {/* Enhanced CTA Button */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <Button className={`w-full text-white border-0 rounded-none py-3 font-body font-medium transition-all duration-300 group-hover:shadow-elegant bg-chapa-charcoal hover:bg-chapa-charcoal/90`}>
                      {language === 'en' ? 'Get Quote' : 'விலை கேள்வி'}
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Enhanced Stats Section */}
        <motion.div 
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6, type: "spring", bounce: 0.4 }}
          className={`card-chapa rounded-none p-12 border-0 shadow-elegant relative overflow-hidden`}
        >
          <div className="text-center mb-12 relative">
            <h3 className={`text-3xl font-display font-bold text-transparent bg-clip-text mb-4 bg-chapa-charcoal`}>
              {language === 'en' ? 'Why Choose BKR Catering?' : 'ஏன் BKR கேட்டரிங் தேர்வு செய்ய வேண்டும்?'}
            </h3>
            <p className={`text-lg font-body ${
              isDark ? 'text-white/80' : 'text-chapa-medium-gray'
            }`}>
              {language === 'en' 
                ? 'Our commitment to excellence and attention to detail sets us apart'
                : 'சிறப்பு மற்றும் விவரங்களில் கவனம் செலுத்தும் எங்கள் உறுதியே எங்களை வேறுபடுத்துகிறது'
              }
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.8 + index * 0.1, type: "spring", bounce: 0.4 }}
                whileHover={{ 
                  scale: 1.05,
                  y: -5,
                  transition: { duration: 0.2, type: "spring", stiffness: 400, damping: 17 }
                }}
                className="text-center group"
              >
                <motion.div 
                  className={`w-16 h-16 rounded-none flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-transform duration-300 shadow-subtle bg-chapa-charcoal`}
                  whileHover={{ rotate: 5 }}
                  transition={{ duration: 0.6, type: "spring" }}
                >
                  <stat.icon className="w-8 h-8 text-white" />
                </motion.div>
                <div className={`text-3xl font-display font-bold text-transparent bg-clip-text mb-2 bg-chapa-charcoal`}>
                  {stat.value}
                </div>
                <div className={`text-sm font-body font-medium ${
                  isDark ? 'text-white/80' : 'text-chapa-medium-gray'
                }`}>
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Enhanced CTA Section */}
        <motion.div 
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 1, type: "spring", bounce: 0.4 }}
          className="text-center mt-20"
        >
          <div className={`rounded-none p-12 border backdrop-blur-xl shadow-elegant ${
            isDark 
              ? 'bg-chapa-charcoal/10 border-white/20' 
              : 'bg-chapa-light-gray border-chapa-light-gray'
          }`}>
            <h3 className={`text-3xl font-display font-bold text-chapa-charcoal mb-6`}>
              {language === 'en' ? 'Ready to Plan Your Event?' : 'உங்கள் நிகழ்வைத் திட்டமிட தயாரா?'}
            </h3>
            <p className={`text-lg mb-8 max-w-2xl mx-auto font-body ${
              isDark ? 'text-white/80' : 'text-chapa-medium-gray'
            }`}>
              {language === 'en' 
                ? 'Let us help you create an unforgettable dining experience for your special occasion. Get in touch today for a personalized quote.'
                : 'உங்கள் சிறப்பு நிகழ்வுக்கான மறக்கமுடியாத உணவு அனுபவத்தை உருவாக்க உதவட்டும். தனிப்பட்ட விலை கேள்விக்கு இன்று தொடர்பு கொள்ளுங்கள்.'
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <motion.div
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Button className={`text-white border-0 rounded-none px-8 py-4 text-lg font-body font-medium shadow-elegant transition-all duration-300 bg-chapa-charcoal hover:bg-chapa-charcoal/90`}>
                  {language === 'en' ? 'Get Free Quote' : 'இலவச விலை கேள்வி'}
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Button variant="outline" className={`border-2 rounded-none px-8 py-4 text-lg font-body font-medium transition-all duration-300 ${
                  isDark 
                    ? 'border-white text-white hover:bg-white hover:text-black' 
                    : 'border-chapa-charcoal text-chapa-charcoal hover:bg-chapa-charcoal hover:text-white'
                }`}>
                  <Phone className="w-5 h-5 mr-2" />
                  {language === 'en' ? 'Call Now' : 'இப்போது அழைக்கவும்'}
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesSection;
