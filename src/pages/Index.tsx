import { useState } from "react";
import { motion } from "framer-motion";
import { CalendarDays, ChefHat, Users, MapPin, ArrowRight, Star, Clock, Target } from "lucide-react";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import ServicesSection from "@/components/ServicesSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import SimplifiedEventPlanner from "@/components/SimplifiedEventPlanner";
import IntegratedMenuAndSession from "@/components/IntegratedMenuAndSession";
import MenuSelectionMicroservice from "@/components/MenuSelectionMicroservice";
import SessionPlanningMicroservice from "@/components/SessionPlanningMicroservice";
import EnhancedEventPlanner from "@/components/EnhancedEventPlanner";
import EnhancedMenuSelection from "@/components/EnhancedMenuSelection";
import VenueSelection from "@/components/VenueSelection";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Index = () => {
  const [language, setLanguage] = useState<'en' | 'ta'>('en');
  const [activeSection, setActiveSection] = useState<string>('overview');

  const features = [
    {
      icon: <ChefHat className="w-6 h-6" />,
      title: language === 'en' ? 'Menu Selection' : 'மெனு தேர்வு',
      description: language === 'en' ? 'Comprehensive menu planning with dietary options' : 'உணவு விருப்பங்களுடன் விரிவான மெனு திட்டமிடல்',
      route: '/menu-selection'
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: language === 'en' ? 'Session Planning' : 'அமர்வு திட்டமிடல்',
      description: language === 'en' ? 'Organize multiple sessions with detailed scheduling' : 'விரிவான கால அட்டவணையுடன் பல அமர்வுகளை ஒழுங்கமைக்கவும்',
      route: '/session-planning'
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: language === 'en' ? 'Venue Management' : 'இட நிர்வாகம்',
      description: language === 'en' ? 'Select and manage event venues efficiently' : 'நிகழ்வு இடங்களை திறம்பட தேர்ந்தெடுத்து நிர்வகிக்கவும்',
      route: '/venue-selection'
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: language === 'en' ? 'Integrated Planning' : 'ஒருங்கிணைந்த திட்டமிடல்',
      description: language === 'en' ? 'Complete event planning in one unified interface' : 'ஒரு ஒருங்கிணைந்த இடைமுகத்தில் முழுமையான நிகழ்வு திட்டமிடல்',
      route: '/integrated-planning'
    }
  ];

  const microservices = [
    {
      name: 'MenuSelectionMicroservice',
      description: language === 'en' ? 'Advanced menu selection with filtering and customization' : 'வடிப்பல் மற்றும் தனிப்பயனாக்கலுடன் மேம்பட்ட மெனு தேர்வு',
      component: <MenuSelectionMicroservice language={language} showPricing={true} allowMultiple={true} />
    },
    {
      name: 'SessionPlanningMicroservice',
      description: language === 'en' ? 'Comprehensive session planning with timeline management' : 'கால அட்டவணை நிர்வாகத்துடன் விரிவான அமர்வு திட்டமிடல்',
      component: <SessionPlanningMicroservice language={language} showAdvancedFeatures={true} />
    },
    {
      name: 'IntegratedMenuAndSession',
      description: language === 'en' ? 'Unified interface for menu and session planning' : 'மெனு மற்றும் அமர்வு திட்டமிடலுக்கான ஒருங்கிணைந்த இடைமுகம்',
      component: <IntegratedMenuAndSession language={language} />
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation language={language} onLanguageChange={setLanguage} />
      
      {/* Hero Section */}
      <section id="home">
        <Hero language={language} />
      </section>
      
      {/* Services Section */}
      <section id="services">
        <ServicesSection language={language} />
      </section>
      
      {/* Event Planning Section */}
      <section id="events" className="section-chapa bg-chapa-cream relative overflow-hidden">
        <div className="container-chapa relative z-10">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-3 bg-chapa-charcoal text-white rounded-none px-6 py-3 mb-6 shadow-subtle"
            >
              <CalendarDays className="w-5 h-5" />
              <span className="font-body font-medium text-sm tracking-wide">
                {language === 'en' ? 'Professional Event Planning' : 'தொழில்முறை நிகழ்வு திட்டமிடல்'}
              </span>
            </motion.div>
            
            <h2 className="text-4xl md:text-6xl font-display font-bold mb-8 leading-tight text-chapa-charcoal">
              {language === 'en' ? 'Event Planning' : 'நிகழ்வு திட்டமிடல்'}
            </h2>
            <p className="text-lg text-chapa-medium-gray max-w-3xl mx-auto leading-relaxed font-body font-normal">
              {language === 'en' 
                ? 'Plan your complete event with our comprehensive planning tool. From menu selection to guest management, we\'ve got you covered.'
                : 'எங்கள் விரிவான திட்டமிடல் கருவியுடன் உங்கள் முழு நிகழ்வைத் திட்டமிடுங்கள். மெனு தேர்வு முதல் விருந்தினர் மேலாண்மை வரை, நாங்கள் உங்களை பாதுகாக்கிறோம்.'
              }
            </p>
          </motion.div>
          
          <SimplifiedEventPlanner language={language} />
        </div>
      </section>

      {/* Features Grid Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-gray-900">
              {language === 'en' ? 'Powerful Features' : 'சக்திவாய்ந்த அம்சங்கள்'}
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              {language === 'en' 
                ? 'Everything you need to plan and execute successful events'
                : 'வெற்றிகரமான நிகழ்வுகளைத் திட்டமிடவும் செயல்படுத்தவும் தேவையான அனைத்தும்'
              }
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="group"
              >
                <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
                  <CardHeader className="text-center pb-4">
                    <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 group-hover:bg-blue-200 transition-colors duration-300">
                      {feature.icon}
                    </div>
                  </CardHeader>
                  <CardContent className="text-center">
                    <h3 className="text-xl font-semibold mb-3 text-gray-900">{feature.title}</h3>
                    <p className="text-gray-600 mb-4">{feature.description}</p>
                    <Button 
                      variant="outline" 
                      className="group-hover:bg-blue-600 group-hover:text-white transition-all duration-300"
                      onClick={() => window.location.href = feature.route}
                    >
                      {language === 'en' ? 'Explore' : 'ஆராயுங்கள்'}
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Microservices Showcase */}
      <section id="microservices" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-gray-900">
              {language === 'en' ? 'Microservices Architecture' : 'மைக்ரோசர்விஸ் கட்டமைப்பு'}
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              {language === 'en' 
                ? 'Modular components that work independently or together seamlessly'
                : 'சுயாதீனமாகவோ அல்லது ஒன்றாகவோ சீராக வேலை செய்யும் மாடுலர் கூறுகள்'
              }
            </p>
          </motion.div>

          <div className="space-y-12">
            {microservices.map((service, index) => (
              <motion.div
                key={service.name}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="bg-gray-50 rounded-2xl p-8"
              >
                <div className="mb-6">
                  <Badge variant="secondary" className="mb-3">
                    {service.name}
                  </Badge>
                  <p className="text-lg text-gray-700">{service.description}</p>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm border">
                  {service.component}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Components Section */}
      <section id="enhanced-components" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-gray-900">
              {language === 'en' ? 'Enhanced Components' : 'மேம்பட்ட கூறுகள்'}
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              {language === 'en' 
                ? 'Advanced event planning tools with enhanced user experience'
                : 'மேம்பட்ட பயனர் அனுபவத்துடன் கூடிய மேம்பட்ட நிகழ்வு திட்டமிடல் கருவிகள்'
              }
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-2xl p-8 shadow-lg border"
            >
              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-3 text-gray-900">
                  {language === 'en' ? 'Enhanced Event Planner' : 'மேம்பட்ட நிகழ்வு திட்டமிடல்'}
                </h3>
                <p className="text-gray-600">
                  {language === 'en' 
                    ? 'Advanced event planning with comprehensive features and analytics'
                    : 'விரிவான அம்சங்கள் மற்றும் பகுப்பாய்வுடன் மேம்பட்ட நிகழ்வு திட்டமிடல்'
                  }
                </p>
              </div>
              <EnhancedEventPlanner language={language} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-2xl p-8 shadow-lg border"
            >
              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-3 text-gray-900">
                  {language === 'en' ? 'Enhanced Menu Selection' : 'மேம்பட்ட மெனு தேர்வு'}
                </h3>
                <p className="text-gray-600">
                  {language === 'en' 
                    ? 'Intelligent menu planning with dietary preferences and cost optimization'
                    : 'உணவு விருப்பங்கள் மற்றும் செலவு உகந்தமயமாக்கலுடன் நுண்ணறிவு மெனு திட்டமிடல்'
                  }
                </p>
              </div>
              <EnhancedMenuSelection language={language} />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Venue Management Section */}
      <section id="venue-management" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-gray-900">
              {language === 'en' ? 'Venue Management' : 'இட நிர்வாகம்'}
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              {language === 'en' 
                ? 'Find and manage the perfect venue for your events'
                : 'உங்கள் நிகழ்வுகளுக்கு சரியான இடத்தைக் கண்டறிந்து நிர்வகிக்கவும்'
              }
            </p>
          </motion.div>

          <div className="bg-gray-50 rounded-2xl p-8">
            <VenueSelection language={language} />
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section id="testimonials">
        <TestimonialsSection language={language} />
      </section>
      
      {/* Contact Section */}
      <section id="contact">
        <ContactSection language={language} />
      </section>
      
      {/* Footer */}
      <Footer language={language} />
    </div>
  );
};

export default Index;
