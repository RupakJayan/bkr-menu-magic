import { useState } from "react";
import { motion } from "framer-motion";
import { CalendarDays } from "lucide-react";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import ServicesSection from "@/components/ServicesSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import SimplifiedEventPlanner from "@/components/SimplifiedEventPlanner";

const Index = () => {
  const [language, setLanguage] = useState<'en' | 'ta'>('en');

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
