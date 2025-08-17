import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  Star, 
  Quote, 
  ChevronLeft, 
  ChevronRight,
  Users,
  Calendar,
  MapPin,
  ChefHat,
  Heart,
  Award,
  ThumbsUp
} from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

interface TestimonialsSectionProps {
  language: 'en' | 'ta';
}

const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ language }) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const testimonials = [
    {
      id: 1,
      name: language === 'en' ? 'Priya & Rajesh Kumar' : 'பிரியா & ராஜேஷ் குமார்',
      event: language === 'en' ? 'Wedding Reception' : 'திருமண வரவேற்பு',
      date: 'December 2023',
      location: 'Coimbatore',
      rating: 5,
      comment: language === 'en' 
        ? 'BKR made our wedding day absolutely perfect! The food was incredible - authentic South Indian flavors that our guests couldn\'t stop raving about. The service was impeccable, and they handled everything with such professionalism. Our families were so impressed, and we couldn\'t have asked for a better catering experience.'
        : 'BKR எங்கள் திருமண நாளை முற்றிலும் சரியானதாக்கியது! உணவு நம்பமுடியாதது - எங்கள் விருந்தினர்கள் பாராட்டுவதை நிறுத்த முடியாத அசல் தென்னிந்திய சுவைகள். சேவை குறைவற்றது, மேலும் அவர்கள் எல்லாவற்றையும் மிகவும் தொழில்முறையுடன் கையாள்ந்தனர். எங்கள் குடும்பங்கள் மிகவும் ஈர்க்கப்பட்டன, மேலும் நாங்கள் சிறந்த கேட்டரிங் அனுபவத்தை கேட்க முடியாது.',
      avatar: '👰‍♀️',
      highlights: [
        language === 'en' ? 'Authentic South Indian Cuisine' : 'அசல் தென்னிந்திய உணவு',
        language === 'en' ? 'Professional Service' : 'தொழில்முறை சேவை',
        language === 'en' ? 'Perfect Timing' : 'சரியான நேரம்'
      ]
    },
    {
      id: 2,
      name: language === 'en' ? 'Arun Kumar & Team' : 'அருண் குமார் & குழு',
      event: language === 'en' ? 'Corporate Annual Dinner' : 'நிறுவன ஆண்டு விழா',
      date: 'November 2023',
      location: 'Chennai',
      rating: 5,
      comment: language === 'en'
        ? 'We hired BKR for our company\'s annual dinner, and they exceeded all expectations. The menu was perfectly tailored to our diverse team, offering both traditional and modern options. The presentation was elegant, and the staff was incredibly professional. Our international clients were particularly impressed with the authentic Indian flavors. Highly recommended!'
        : 'நாங்கள் எங்கள் நிறுவனத்தின் ஆண்டு விழாவுக்கு BKR-ஐ நியமித்தோம், அவர்கள் எல்லா எதிர்பார்ப்புகளையும் மீறினர். மெனு எங்கள் பல்வேறு குழுவிற்கு சரியாக தயாரிக்கப்பட்டது, பாரம்பரிய மற்றும் நவீன விருப்பங்களை வழங்கியது. விளக்கக்காட்சி நேர்த்தியானது, மேலும் ஊழியர்கள் நம்பமுடியாத தொழில்முறையுடன் இருந்தனர். எங்கள் சர்வதேச வாடிக்கையாளர்கள் அசல் இந்திய சுவைகளால் குறிப்பாக ஈர்க்கப்பட்டனர். மிகவும் பரிந்துரைக்கப்படுகிறது!',
      avatar: '👨‍💼',
      highlights: [
        language === 'en' ? 'Diverse Menu Options' : 'பல்வேறு மெனு விருப்பங்கள்',
        language === 'en' ? 'International Appeal' : 'சர்வதேச ஈர்ப்பு',
        language === 'en' ? 'Elegant Presentation' : 'நேர்த்தியான விளக்கக்காட்சி'
      ]
    },
    {
      id: 3,
      name: language === 'en' ? 'Lakshmi Devi' : 'லட்சுமி தேவி',
      event: language === 'en' ? '60th Birthday Celebration' : '60வது பிறந்தநாள் கொண்டாட்டம்',
      date: 'October 2023',
      location: 'Pollachi',
      rating: 5,
      comment: language === 'en'
        ? 'For my 60th birthday, I wanted something truly special, and BKR delivered beyond my dreams! They created a beautiful fusion of traditional Tamil cuisine with modern presentation. Every dish was a work of art, and the flavors were absolutely divine. The staff went above and beyond to make sure every guest felt special. It was a celebration I\'ll never forget!'
        : 'என் 60வது பிறந்தநாளுக்கு, நான் உண்மையில் சிறப்பான ஒன்றை விரும்பினேன், மேலும் BKR என் கனவுகளை மீறி வழங்கியது! அவர்கள் பாரம்பரிய தமிழ் உணவை நவீன விளக்கக்காட்சியுடன் அழகான கலவையாக உருவாக்கினர். ஒவ்வொரு உணவும் ஒரு கலைப் படைப்பாக இருந்தது, மேலும் சுவைகள் முற்றிலும் தெய்வீகமாக இருந்தன. ஒவ்வொரு விருந்தினரும் சிறப்பாக உணர்ந்தார்கள் என்பதை உறுதிப்படுத்த ஊழியர்கள் மேலும் மேலும் முயன்றனர். அது நான் ஒருபோதும் மறக்க முடியாத ஒரு கொண்டாட்டம்!',
      avatar: '👩‍🦳',
      highlights: [
        language === 'en' ? 'Traditional Tamil Cuisine' : 'பாரம்பரிய தமிழ் உணவு',
        language === 'en' ? 'Artistic Presentation' : 'கலை விளக்கக்காட்சி',
        language === 'en' ? 'Personalized Service' : 'தனிப்பட்ட சேவை'
      ]
    },
    {
      id: 4,
      name: language === 'en' ? 'Dr. Meenakshi & Family' : 'டாக்டர் மீனாட்சி & குடும்பம்',
      event: language === 'en' ? 'Family Reunion' : 'குடும்ப மீண்டும் ஒன்றுபடுதல்',
      date: 'September 2023',
      location: 'Anaimalai',
      rating: 5,
      comment: language === 'en'
        ? 'Our family reunion was made perfect by BKR\'s exceptional catering service. They understood our need for both vegetarian and non-vegetarian options, and every dish was prepared with love and attention to detail. The kids loved the special children\'s menu, and the elders appreciated the authentic traditional recipes. The service was warm and family-like, making us feel at home.'
        : 'எங்கள் குடும்ப மீண்டும் ஒன்றுபடுதல் BKR-இன் சிறந்த கேட்டரிங் சேவையால் சரியானதாக்கப்பட்டது. அவர்கள் எங்கள் தேவையை புரிந்துகொண்டனர் - காய்கறி மற்றும் காய்கறி அல்லாத விருப்பங்கள், மேலும் ஒவ்வொரு உணவும் அன்புடனும் விவரங்களில் கவனத்துடனும் தயாரிக்கப்பட்டது. குழந்தைகள் சிறப்பு குழந்தைகள் மெனுவை விரும்பினர், மேலும் பெரியவர்கள் அசல் பாரம்பரிய செய்முறைகளைப் பாராட்டினர். சேவை சூடாகவும் குடும்பத்தைப் போலவும் இருந்தது, நாங்கள் வீட்டில் இருப்பதை உணர்ந்தோம்.',
      avatar: '👨‍👩‍👧‍👦',
      highlights: [
        language === 'en' ? 'Family-Friendly Service' : 'குடும்ப நட்பு சேவை',
        language === 'en' ? 'Diverse Dietary Options' : 'பல்வேறு உணவு விருப்பங்கள்',
        language === 'en' ? 'Warm Hospitality' : 'சூடான விருந்தோம்பல்'
      ]
    },
    {
      id: 5,
      name: language === 'en' ? 'Sundar & Company' : 'சுந்தர் & நிறுவனம்',
      event: language === 'en' ? 'Product Launch Event' : 'தயாரிப்பு வெளியீட்டு நிகழ்வு',
      date: 'August 2023',
      location: 'Coimbatore',
      rating: 5,
      comment: language === 'en'
        ? 'BKR handled our product launch event with absolute professionalism. They created a sophisticated menu that perfectly complemented our premium brand image. The canapés were innovative, the main course was exceptional, and the dessert presentation was Instagram-worthy! Our clients and partners were thoroughly impressed. The team\'s attention to detail and ability to adapt to last-minute changes was remarkable.'
        : 'BKR எங்கள் தயாரிப்பு வெளியீட்டு நிகழ்வை முற்றிலும் தொழில்முறையுடன் கையாண்டது. அவர்கள் எங்கள் பிரீமியம் பிராண்ட் படத்தை சரியாக நிரப்பும் நேர்த்தியான மெனுவை உருவாக்கினர். கனாப்கள் புதுமையானவை, முதன்மை உணவு சிறந்தது, மேலும் இனிப்பு விளக்கக்காட்சி Instagram-க்கு தகுந்தது! எங்கள் வாடிக்கையாளர்கள் மற்றும் கூட்டாளர்கள் முற்றிலும் ஈர்க்கப்பட்டனர். குழுவின் விவரங்களில் கவனம் மற்றும் கடைசி நிமிட மாற்றங்களுக்கு ஏற்ப மாற்றும் திறன் குறிப்பிடத்தக்கது.',
      avatar: '🏢',
      highlights: [
        language === 'en' ? 'Premium Brand Experience' : 'பிரீமியம் பிராண்ட் அனுபவம்',
        language === 'en' ? 'Innovative Menu' : 'புதுமையான மெனு',
        language === 'en' ? 'Professional Excellence' : 'தொழில்முறை சிறப்பு'
      ]
    }
  ];

  const stats = [
    {
      icon: Users,
      value: '5000+',
      label: language === 'en' ? 'Happy Clients' : 'மகிழ்ச்சியான வாடிக்கையாளர்கள்',
      color: 'bg-chapa-gold'
    },
    {
      icon: Star,
      value: '4.9',
      label: language === 'en' ? 'Average Rating' : 'சராசரி மதிப்பீடு',
      color: 'bg-chapa-charcoal'
    },
    {
      icon: Calendar,
      value: '14+',
      label: language === 'en' ? 'Years Experience' : 'ஆண்டுகள் அனுபவம்',
      color: 'bg-chapa-gold'
    },
    {
      icon: Award,
      value: '50+',
      label: language === 'en' ? 'Awards Won' : 'பெற்ற விருதுகள்',
      color: 'bg-chapa-charcoal'
    }
  ];

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentIndex((prevIndex) => {
      if (newDirection === 1) {
        return prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1;
      } else {
        return prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1;
      }
    });
  };

  useEffect(() => {
    const timer = setInterval(() => {
      paginate(1);
    }, 8000);
    return () => clearInterval(timer);
  }, [currentIndex]);

  return (
    <section className={`section-chapa relative overflow-hidden ${
      isDark ? 'bg-black' : 'bg-chapa-cream'
    }`}>
      <div className="container-chapa relative z-10">
        {/* Header */}
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
            <Quote className="w-5 h-5" />
            <span className="font-body font-medium text-sm tracking-wide">
              {language === 'en' ? 'Client Stories' : 'வாடிக்கையாளர் கதைகள்'}
            </span>
          </motion.div>
          
          <h2 className={`text-4xl md:text-6xl font-display font-bold mb-8 leading-tight ${
            isDark ? 'text-white' : 'text-chapa-charcoal'
          }`}>
            {language === 'en' ? 'What Our Clients Say' : 'எங்கள் வாடிக்கையாளர்கள் என்ன சொல்கிறார்கள்'}
          </h2>
          <p className={`text-lg max-w-3xl mx-auto leading-relaxed font-body font-normal ${
            isDark ? 'text-white/80' : 'text-chapa-medium-gray'
          }`}>
            {language === 'en' 
              ? 'Don\'t just take our word for it. Hear from the families and businesses who have experienced our exceptional catering services and made their events truly memorable.'
              : 'எங்கள் வார்த்தையை மட்டும் எடுத்துக்கொள்ள வேண்டாம். எங்கள் சிறந்த கேட்டரிங் சேவைகளை அனுபவித்து, அவர்களின் நிகழ்வுகளை உண்மையில் மறக்கமுடியாததாக்கிய குடும்பங்கள் மற்றும் வணிகங்களிடமிருந்து கேள்வி.'
            }
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="text-center"
            >
              <motion.div 
                className={`w-16 h-16 rounded-none flex items-center justify-center mx-auto mb-4 shadow-subtle ${stat.color}`}
                whileHover={{ rotate: 5, scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <stat.icon className="w-8 h-8 text-white" />
              </motion.div>
              <div className={`text-3xl font-display font-bold mb-2 ${
                isDark ? 'text-white' : 'text-chapa-charcoal'
              }`}>
                {stat.value}
              </div>
              <div className={`text-sm font-body font-medium ${
                isDark ? 'text-white/70' : 'text-chapa-medium-gray'
              }`}>
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Testimonials Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="relative mb-20"
        >
          <div className="relative overflow-hidden">
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 }
                }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={1}
                onDragEnd={(e, { offset, velocity }) => {
                  const swipe = swipePower(offset.x, velocity.x);
                  if (swipe < -swipeConfidenceThreshold) {
                    paginate(1);
                  } else if (swipe > swipeConfidenceThreshold) {
                    paginate(-1);
                  }
                }}
                className="absolute w-full"
              >
                <Card className="card-chapa rounded-none shadow-elegant max-w-4xl mx-auto">
                  <CardContent className="p-12">
                    <div className="text-center mb-8">
                      <div className="text-6xl mb-6">{testimonials[currentIndex].avatar}</div>
                      <div className="flex justify-center gap-1 mb-4">
                        {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                          <Star key={i} className="w-6 h-6 fill-chapa-gold text-chapa-gold" />
                        ))}
                      </div>
                      <h3 className={`text-2xl font-display font-semibold mb-2 ${
                        isDark ? 'text-white' : 'text-chapa-charcoal'
                      }`}>
                        {testimonials[currentIndex].name}
                      </h3>
                      <div className="flex items-center justify-center gap-4 mb-4 text-sm font-body">
                        <div className={`flex items-center gap-2 ${
                          isDark ? 'text-white/60' : 'text-chapa-medium-gray'
                        }`}>
                          <ChefHat className="w-4 h-4" />
                          {testimonials[currentIndex].event}
                        </div>
                        <div className={`flex items-center gap-2 ${
                          isDark ? 'text-white/60' : 'text-chapa-medium-gray'
                        }`}>
                          <Calendar className="w-4 h-4" />
                          {testimonials[currentIndex].date}
                        </div>
                        <div className={`flex items-center gap-2 ${
                          isDark ? 'text-white/60' : 'text-chapa-medium-gray'
                        }`}>
                          <MapPin className="w-4 h-4" />
                          {testimonials[currentIndex].location}
                        </div>
                      </div>
                    </div>
                    
                    <blockquote className={`text-center mb-8 text-lg italic leading-relaxed font-body ${
                      isDark ? 'text-white/80' : 'text-chapa-medium-gray'
                    }`}>
                      "{testimonials[currentIndex].comment}"
                    </blockquote>
                    
                    <div className="flex flex-wrap justify-center gap-2">
                      {testimonials[currentIndex].highlights.map((highlight, index) => (
                        <Badge 
                          key={index}
                          variant="secondary" 
                          className="rounded-none bg-chapa-light-gray text-chapa-charcoal font-body"
                        >
                          {highlight}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-center items-center gap-4 mt-8">
            <Button
              variant="outline"
              size="lg"
              onClick={() => paginate(-1)}
              className="btn-chapa-secondary rounded-none w-12 h-12 p-0"
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>
            
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setDirection(index > currentIndex ? 1 : -1);
                    setCurrentIndex(index);
                  }}
                  className={`w-3 h-3 rounded-none transition-all duration-300 ${
                    index === currentIndex
                      ? 'bg-chapa-charcoal'
                      : isDark ? 'bg-white/30' : 'bg-chapa-medium-gray/30'
                  }`}
                />
              ))}
            </div>
            
            <Button
              variant="outline"
              size="lg"
              onClick={() => paginate(1)}
              className="btn-chapa-secondary rounded-none w-12 h-12 p-0"
            >
              <ChevronRight className="w-6 h-6" />
            </Button>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="text-center"
        >
          <Card className={`card-chapa rounded-none p-12 border-0 shadow-elegant ${
            isDark ? 'bg-chapa-charcoal/10 border-white/20' : 'bg-chapa-light-gray border-chapa-light-gray'
          }`}>
            <h3 className={`text-3xl font-display font-bold mb-6 ${
              isDark ? 'text-white' : 'text-chapa-charcoal'
            }`}>
              {language === 'en' ? 'Ready to Create Your Story?' : 'உங்கள் கதையை உருவாக்க தயாரா?'}
            </h3>
            <p className={`text-lg mb-8 max-w-2xl mx-auto font-body ${
              isDark ? 'text-white/80' : 'text-chapa-medium-gray'
            }`}>
              {language === 'en' 
                ? 'Join thousands of satisfied clients who have made their events extraordinary with BKR Catering. Let\'s start planning your perfect celebration today.'
                : 'BKR கேட்டரிங்குடன் தங்கள் நிகழ்வுகளை அசாதாரணமாக்கிய ஆயிரக்கணக்கான திருப்தியடைந்த வாடிக்கையாளர்களுடன் சேருங்கள். இன்று உங்கள் சரியான கொண்டாட்டத்தைத் திட்டமிடத் தொடங்குவோம்.'
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button className="btn-chapa-primary text-lg px-8 py-4">
                <Heart className="w-5 h-5 mr-2" />
                {language === 'en' ? 'Start Planning' : 'திட்டமிடத் தொடங்குங்கள்'}
              </Button>
              <Button variant="outline" className="btn-chapa-secondary text-lg px-8 py-4">
                <ThumbsUp className="w-5 h-5 mr-2" />
                {language === 'en' ? 'View More Reviews' : 'மேலும் மதிப்புரைகளைக் காண்க'}
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
