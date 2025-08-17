import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  MessageSquare, 
  Send,
  CheckCircle,
  Star,
  Users,
  Calendar,
  ChefHat
} from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

interface ContactSectionProps {
  language: 'en' | 'ta';
}

const ContactSection: React.FC<ContactSectionProps> = ({ language }) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    eventType: '',
    guestCount: '',
    eventDate: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        eventType: '',
        guestCount: '',
        eventDate: '',
        message: ''
      });
    }, 3000);
  };

  const contactInfo = [
    {
      icon: Phone,
      title: language === 'en' ? 'Phone' : 'தொலைபேசி',
      value: '+91 8012686883',
      description: language === 'en' ? 'Call us anytime' : 'எப்போதும் அழைக்கவும்',
      color: 'bg-chapa-gold'
    },
    {
      icon: Mail,
      title: language === 'en' ? 'Email' : 'மின்னஞ்சல்',
      value: 'info@bkr-catering.com',
      description: language === 'en' ? 'Send us a message' : 'எங்களுக்கு செய்தி அனுப்பவும்',
      color: 'bg-chapa-charcoal'
    },
    {
      icon: MapPin,
      title: language === 'en' ? 'Location' : 'இடம்',
      value: 'Anaimalai, Pollachi, Tamil Nadu',
      description: language === 'en' ? 'Visit our kitchen' : 'எங்கள் சமையலறையைப் பார்வையிடவும்',
      color: 'bg-chapa-gold'
    },
    {
      icon: Clock,
      title: language === 'en' ? 'Hours' : 'மணிநேரங்கள்',
      value: 'Mon-Sun: 6:00 AM - 10:00 PM',
      description: language === 'en' ? 'We\'re always ready' : 'நாங்கள் எப்போதும் தயாராக இருக்கிறோம்',
      color: 'bg-chapa-charcoal'
    }
  ];

  const testimonials = [
    {
      name: language === 'en' ? 'Priya & Rajesh' : 'பிரியா & ராஜேஷ்',
      event: language === 'en' ? 'Wedding Reception' : 'திருமண வரவேற்பு',
      rating: 5,
      comment: language === 'en' 
        ? 'BKR made our wedding day absolutely perfect. The food was incredible and the service was impeccable.'
        : 'BKR எங்கள் திருமண நாளை முற்றிலும் சரியானதாக்கியது. உணவு நம்பமுடியாதது மற்றும் சேவை குறைவற்றது.',
      avatar: '👰‍♀️'
    },
    {
      name: language === 'en' ? 'Arun Kumar' : 'அருண் குமார்',
      event: language === 'en' ? 'Corporate Event' : 'நிறுவன நிகழ்வு',
      rating: 5,
      comment: language === 'en'
        ? 'Professional service and delicious food. Our clients were very impressed.'
        : 'தொழில்முறை சேவை மற்றும் சுவையான உணவு. எங்கள் வாடிக்கையாளர்கள் மிகவும் ஈர்க்கப்பட்டனர்.',
      avatar: '👨‍💼'
    },
    {
      name: language === 'en' ? 'Lakshmi Devi' : 'லட்சுமி தேவி',
      event: language === 'en' ? 'Birthday Party' : 'பிறந்தநாள் விருந்து',
      rating: 5,
      comment: language === 'en'
        ? 'Amazing food and wonderful service. Everyone loved the South Indian dishes.'
        : 'அற்புதமான உணவு மற்றும் அருமையான சேவை. அனைவரும் தென்னிந்திய உணவுகளை விரும்பினர்.',
      avatar: '👩‍🦳'
    }
  ];

  return (
    <section className={`section-chapa relative overflow-hidden ${
      isDark ? 'bg-black' : 'bg-white'
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
            <MessageSquare className="w-5 h-5" />
            <span className="font-body font-medium text-sm tracking-wide">
              {language === 'en' ? 'Get In Touch' : 'தொடர்பு கொள்ளுங்கள்'}
            </span>
          </motion.div>
          
          <h2 className={`text-4xl md:text-6xl font-display font-bold mb-8 leading-tight ${
            isDark ? 'text-white' : 'text-chapa-charcoal'
          }`}>
            {language === 'en' ? 'Contact Us' : 'எங்களை தொடர்பு கொள்ளுங்கள்'}
          </h2>
          <p className={`text-lg max-w-3xl mx-auto leading-relaxed font-body font-normal ${
            isDark ? 'text-white/80' : 'text-chapa-medium-gray'
          }`}>
            {language === 'en' 
              ? 'Ready to create an unforgettable dining experience? Get in touch with us today for a personalized quote and consultation.'
              : 'மறக்கமுடியாத உணவு அனுபவத்தை உருவாக்க தயாரா? தனிப்பட்ட விலை கேள்வி மற்றும் ஆலோசனைக்கு இன்று எங்களை தொடர்பு கொள்ளுங்கள்.'
            }
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <Card className="card-chapa rounded-none shadow-elegant">
              <CardHeader>
                <CardTitle className={`text-2xl font-display font-semibold ${
                  isDark ? 'text-white' : 'text-chapa-charcoal'
                }`}>
                  {language === 'en' ? 'Request a Quote' : 'விலை கேள்வி'}
                </CardTitle>
                <p className={`font-body ${
                  isDark ? 'text-white/70' : 'text-chapa-medium-gray'
                }`}>
                  {language === 'en' 
                    ? 'Fill out the form below and we\'ll get back to you within 24 hours.'
                    : 'கீழே உள்ள படிவத்தை நிரப்புங்கள், நாங்கள் 24 மணி நேரத்திற்குள் உங்களிடம் திரும்புவோம்.'
                  }
                </p>
              </CardHeader>
              <CardContent>
                {isSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12"
                  >
                    <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500" />
                    <h3 className={`text-xl font-display font-semibold mb-2 ${
                      isDark ? 'text-white' : 'text-chapa-charcoal'
                    }`}>
                      {language === 'en' ? 'Thank You!' : 'நன்றி!'}
                    </h3>
                    <p className={`font-body ${
                      isDark ? 'text-white/70' : 'text-chapa-medium-gray'
                    }`}>
                      {language === 'en' 
                        ? 'We\'ve received your message and will get back to you soon.'
                        : 'உங்கள் செய்தியைப் பெற்றுள்ளோம், விரைவில் உங்களிடம் திரும்புவோம்.'
                      }
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name" className={`font-body ${
                          isDark ? 'text-white/80' : 'text-chapa-charcoal'
                        }`}>
                          {language === 'en' ? 'Full Name' : 'முழு பெயர்'} *
                        </Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className="mt-2 rounded-none border-chapa-light-gray focus:border-chapa-charcoal"
                          placeholder={language === 'en' ? 'Enter your full name' : 'உங்கள் முழு பெயரை உள்ளிடவும்'}
                        />
                      </div>
                      <div>
                        <Label htmlFor="email" className={`font-body ${
                          isDark ? 'text-white/80' : 'text-chapa-charcoal'
                        }`}>
                          {language === 'en' ? 'Email' : 'மின்னஞ்சல்'} *
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="mt-2 rounded-none border-chapa-light-gray focus:border-chapa-charcoal"
                          placeholder={language === 'en' ? 'Enter your email' : 'உங்கள் மின்னஞ்சலை உள்ளிடவும்'}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="phone" className={`font-body ${
                          isDark ? 'text-white/80' : 'text-chapa-charcoal'
                        }`}>
                          {language === 'en' ? 'Phone Number' : 'தொலைபேசி எண்'} *
                        </Label>
                        <Input
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          required
                          className="mt-2 rounded-none border-chapa-light-gray focus:border-chapa-charcoal"
                          placeholder={language === 'en' ? 'Enter your phone number' : 'உங்கள் தொலைபேசி எண்ணை உள்ளிடவும்'}
                        />
                      </div>
                      <div>
                        <Label htmlFor="eventType" className={`font-body ${
                          isDark ? 'text-white/80' : 'text-chapa-charcoal'
                        }`}>
                          {language === 'en' ? 'Event Type' : 'நிகழ்வு வகை'} *
                        </Label>
                        <Input
                          id="eventType"
                          name="eventType"
                          value={formData.eventType}
                          onChange={handleInputChange}
                          required
                          className="mt-2 rounded-none border-chapa-light-gray focus:border-chapa-charcoal"
                          placeholder={language === 'en' ? 'Wedding, Corporate, etc.' : 'திருமணம், நிறுவனம், முதலியன'}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="guestCount" className={`font-body ${
                          isDark ? 'text-white/80' : 'text-chapa-charcoal'
                        }`}>
                          {language === 'en' ? 'Number of Guests' : 'விருந்தினர்களின் எண்ணிக்கை'} *
                        </Label>
                        <Input
                          id="guestCount"
                          name="guestCount"
                          type="number"
                          value={formData.guestCount}
                          onChange={handleInputChange}
                          required
                          className="mt-2 rounded-none border-chapa-light-gray focus:border-chapa-charcoal"
                          placeholder={language === 'en' ? 'e.g., 100' : 'எ.கா., 100'}
                        />
                      </div>
                      <div>
                        <Label htmlFor="eventDate" className={`font-body ${
                          isDark ? 'text-white/80' : 'text-chapa-charcoal'
                        }`}>
                          {language === 'en' ? 'Event Date' : 'நிகழ்வு தேதி'} *
                        </Label>
                        <Input
                          id="eventDate"
                          name="eventDate"
                          type="date"
                          value={formData.eventDate}
                          onChange={handleInputChange}
                          required
                          className="mt-2 rounded-none border-chapa-light-gray focus:border-chapa-charcoal"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="message" className={`font-body ${
                        isDark ? 'text-white/80' : 'text-chapa-charcoal'
                      }`}>
                        {language === 'en' ? 'Additional Details' : 'கூடுதல் விவரங்கள்'}
                      </Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        rows={4}
                        className="mt-2 rounded-none border-chapa-light-gray focus:border-chapa-charcoal"
                        placeholder={language === 'en' 
                          ? 'Tell us more about your event, dietary requirements, or any special requests...'
                          : 'உங்கள் நிகழ்வு, உணவு தேவைகள் அல்லது எந்த சிறப்பு கோரிக்கைகள் பற்றி மேலும் சொல்லுங்கள்...'
                        }
                      />
                    </div>

                    <Button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="btn-chapa-primary w-full"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          {language === 'en' ? 'Sending...' : 'அனுப்புகிறது...'}
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Send className="w-4 h-4" />
                          {language === 'en' ? 'Send Message' : 'செய்தியை அனுப்பு'}
                        </div>
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="space-y-6"
          >
            {contactInfo.map((info, index) => (
              <motion.div
                key={info.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 + index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="group"
              >
                <Card className="card-chapa rounded-none shadow-subtle hover:shadow-elegant transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <motion.div 
                        className={`w-12 h-12 rounded-none flex items-center justify-center shadow-subtle ${info.color}`}
                        whileHover={{ rotate: 5, scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                      >
                        <info.icon className="w-6 h-6 text-white" />
                      </motion.div>
                      <div className="flex-1">
                        <h3 className={`text-lg font-display font-semibold mb-2 ${
                          isDark ? 'text-white' : 'text-chapa-charcoal'
                        }`}>
                          {info.title}
                        </h3>
                        <p className={`text-lg font-body font-medium mb-1 ${
                          isDark ? 'text-white' : 'text-chapa-charcoal'
                        }`}>
                          {info.value}
                        </p>
                        <p className={`text-sm font-body ${
                          isDark ? 'text-white/60' : 'text-chapa-medium-gray'
                        }`}>
                          {info.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Testimonials */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h3 className={`text-3xl font-display font-bold mb-4 ${
              isDark ? 'text-white' : 'text-chapa-charcoal'
            }`}>
              {language === 'en' ? 'What Our Clients Say' : 'எங்கள் வாடிக்கையாளர்கள் என்ன சொல்கிறார்கள்'}
            </h3>
            <p className={`text-lg font-body ${
              isDark ? 'text-white/80' : 'text-chapa-medium-gray'
            }`}>
              {language === 'en' 
                ? 'Don\'t just take our word for it - hear from our satisfied clients'
                : 'எங்கள் வார்த்தையை மட்டும் எடுத்துக்கொள்ள வேண்டாம் - எங்கள் திருப்தியடைந்த வாடிக்கையாளர்களிடமிருந்து கேள்வி'
              }
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1 + index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group"
              >
                <Card className="card-chapa rounded-none shadow-subtle hover:shadow-elegant transition-all duration-300 h-full">
                  <CardContent className="p-6">
                    <div className="text-center mb-4">
                      <div className="text-4xl mb-3">{testimonial.avatar}</div>
                      <div className="flex justify-center gap-1 mb-3">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-chapa-gold text-chapa-gold" />
                        ))}
                      </div>
                    </div>
                    
                    <blockquote className={`text-center mb-4 italic font-body ${
                      isDark ? 'text-white/80' : 'text-chapa-medium-gray'
                    }`}>
                      "{testimonial.comment}"
                    </blockquote>
                    
                    <div className="text-center">
                      <div className={`font-display font-semibold mb-1 ${
                        isDark ? 'text-white' : 'text-chapa-charcoal'
                      }`}>
                        {testimonial.name}
                      </div>
                      <div className={`text-sm font-body ${
                        isDark ? 'text-white/60' : 'text-chapa-medium-gray'
                      }`}>
                        {testimonial.event}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
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
              {language === 'en' ? 'Ready to Start Planning?' : 'திட்டமிடத் தொடங்க தயாரா?'}
            </h3>
            <p className={`text-lg mb-8 max-w-2xl mx-auto font-body ${
              isDark ? 'text-white/80' : 'text-chapa-medium-gray'
            }`}>
              {language === 'en' 
                ? 'Let\'s discuss your event and create something truly special together. Contact us today for a free consultation.'
                : 'உங்கள் நிகழ்வைப் பற்றி விவாதிப்போம் மற்றும் உண்மையில் சிறப்பான ஒன்றை ஒன்றாக உருவாக்குவோம். இலவச ஆலோசனைக்கு இன்று எங்களை தொடர்பு கொள்ளுங்கள்.'
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button className="btn-chapa-primary text-lg px-8 py-4">
                <Phone className="w-5 h-5 mr-2" />
                {language === 'en' ? 'Call Now' : 'இப்போது அழைக்கவும்'}
              </Button>
              <Button variant="outline" className="btn-chapa-secondary text-lg px-8 py-4">
                <Mail className="w-5 h-5 mr-2" />
                {language === 'en' ? 'Send Email' : 'மின்னஞ்சல் அனுப்பு'}
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactSection;
