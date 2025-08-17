import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { 
  Calendar, 
  Users, 
  MapPin, 
  Phone, 
  Mail, 
  ChefHat,
  Clock,
  Plus,
  Trash2,
  Edit,
  Save,
  X,
  ArrowRight,
  CheckCircle,
  Star,
  Heart,
  Award
} from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { eventPlanningData } from '../data/eventPlanningData';

interface EnhancedEventPlannerProps {
  language: 'en' | 'ta';
}

const EnhancedEventPlanner: React.FC<EnhancedEventPlannerProps> = ({ language }) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const [currentStep, setCurrentStep] = useState(1);
  const [eventPlan, setEventPlan] = useState({
    clientDetails: {
      name: '',
      email: '',
      phone: '',
      address: ''
    },
    eventDetails: {
      type: '',
      name: '',
      description: '',
      expectedGuests: 0
    },
    venueDetails: {
      name: '',
      address: '',
      capacity: 0,
      facilities: []
    },
    eventDates: {
      startDate: '',
      endDate: '',
      numberOfDays: 1
    },
    dietaryRequirements: {
      vegetarian: 0,
      nonVegetarian: 0,
      vegan: 0,
      specialNeeds: []
    },
    budget: {
      total: 0,
      perPerson: 0,
      currency: 'INR'
    }
  });

  const steps = [
    { id: 1, title: language === 'en' ? 'Client Details' : 'வாடிக்கையாளர் விவரங்கள்', icon: Users },
    { id: 2, title: language === 'en' ? 'Event Details' : 'நிகழ்வு விவரங்கள்', icon: Calendar },
    { id: 3, title: language === 'en' ? 'Venue Selection' : 'இடத் தேர்வு', icon: MapPin },
    { id: 4, title: language === 'en' ? 'Menu Planning' : 'மெனு திட்டமிடல்', icon: ChefHat },
    { id: 5, title: language === 'en' ? 'Budget & Timeline' : 'பட்ஜெட் & காலவரிசை', icon: Clock },
    { id: 6, title: language === 'en' ? 'Review & Confirm' : 'மதிப்பாய்வு & உறுதிப்படுத்தல்', icon: CheckCircle }
  ];

  const eventTypes = [
    { value: 'wedding', label: language === 'en' ? 'Wedding' : 'திருமணம்' },
    { value: 'corporate', label: language === 'en' ? 'Corporate Event' : 'நிறுவன நிகழ்வு' },
    { value: 'birthday', label: language === 'en' ? 'Birthday Party' : 'பிறந்தநாள் விருந்து' },
    { value: 'anniversary', label: language === 'en' ? 'Anniversary' : 'ஆண்டு விழா' },
    { value: 'family-gathering', label: language === 'en' ? 'Family Gathering' : 'குடும்ப கூட்டம்' },
    { value: 'other', label: language === 'en' ? 'Other' : 'மற்றவை' }
  ];

  const handleInputChange = (section: string, field: string, value: string | number) => {
    setEventPlan(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: value
      }
    }));
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    console.log('Event Plan Submitted:', eventPlan);
    // Handle form submission
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-black' : 'bg-chapa-cream'}`}>
      <div className="container-chapa py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className={`text-4xl md:text-6xl font-display font-bold mb-6 ${
            isDark ? 'text-white' : 'text-chapa-charcoal'
          }`}>
            {language === 'en' ? 'Event Planning Wizard' : 'நிகழ்வு திட்டமிடல் வழிகாட்டி'}
          </h1>
          <p className={`text-lg max-w-3xl mx-auto font-body ${
            isDark ? 'text-white/80' : 'text-chapa-medium-gray'
          }`}>
            {language === 'en' 
              ? 'Plan your perfect event with our comprehensive planning tool. We\'ll guide you through every step to create an unforgettable experience.'
              : 'எங்கள் விரிவான திட்டமிடல் கருவியுடன் உங்கள் சரியான நிகழ்வைத் திட்டமிடுங்கள். மறக்கமுடியாத அனுபவத்தை உருவாக்க நாங்கள் ஒவ்வொரு படியிலும் உங்களை வழிநடத்துவோம்.'
            }
          </p>
        </motion.div>

        {/* Step Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-12 h-12 rounded-none border-2 transition-all duration-300 ${
                  currentStep >= step.id
                    ? 'bg-chapa-charcoal border-chapa-charcoal text-white'
                    : isDark 
                      ? 'border-white/30 text-white/50' 
                      : 'border-chapa-medium-gray text-chapa-medium-gray'
                }`}>
                  {currentStep > step.id ? (
                    <CheckCircle className="w-6 h-6" />
                  ) : (
                    <step.icon className="w-6 h-6" />
                  )}
                </div>
                <div className={`ml-3 ${currentStep >= step.id ? 'opacity-100' : 'opacity-50'}`}>
                  <div className={`text-sm font-body font-medium ${
                    currentStep >= step.id
                      ? isDark ? 'text-white' : 'text-chapa-charcoal'
                      : isDark ? 'text-white/50' : 'text-chapa-medium-gray'
                  }`}>
                    {step.title}
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-4 ${
                    currentStep > step.id ? 'bg-chapa-charcoal' : isDark ? 'bg-white/20' : 'bg-chapa-light-gray'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Form Content */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="max-w-4xl mx-auto"
        >
          <Card className="card-chapa rounded-none shadow-elegant">
            <CardHeader className="text-center">
              <CardTitle className={`text-2xl font-display font-semibold ${
                isDark ? 'text-white' : 'text-chapa-charcoal'
              }`}>
                {steps[currentStep - 1].title}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              {/* Step 1: Client Details */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="name" className={`font-body ${
                        isDark ? 'text-white/80' : 'text-chapa-charcoal'
                      }`}>
                        {language === 'en' ? 'Full Name' : 'முழு பெயர்'} *
                      </Label>
                      <Input
                        id="name"
                        value={eventPlan.clientDetails.name}
                        onChange={(e) => handleInputChange('clientDetails', 'name', e.target.value)}
                        className="mt-2 rounded-none border-chapa-light-gray focus:border-chapa-charcoal"
                        placeholder={language === 'en' ? 'Enter full name' : 'முழு பெயரை உள்ளிடவும்'}
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
                        type="email"
                        value={eventPlan.clientDetails.email}
                        onChange={(e) => handleInputChange('clientDetails', 'email', e.target.value)}
                        className="mt-2 rounded-none border-chapa-light-gray focus:border-chapa-charcoal"
                        placeholder={language === 'en' ? 'Enter email address' : 'மின்னஞ்சல் முகவரியை உள்ளிடவும்'}
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone" className={`font-body ${
                        isDark ? 'text-white/80' : 'text-chapa-charcoal'
                      }`}>
                        {language === 'en' ? 'Phone Number' : 'தொலைபேசி எண்'} *
                      </Label>
                      <Input
                        id="phone"
                        value={eventPlan.clientDetails.phone}
                        onChange={(e) => handleInputChange('clientDetails', 'phone', e.target.value)}
                        className="mt-2 rounded-none border-chapa-light-gray focus:border-chapa-charcoal"
                        placeholder={language === 'en' ? 'Enter phone number' : 'தொலைபேசி எண்ணை உள்ளிடவும்'}
                      />
                    </div>
                    <div>
                      <Label htmlFor="address" className={`font-body ${
                        isDark ? 'text-white/80' : 'text-chapa-charcoal'
                      }`}>
                        {language === 'en' ? 'Address' : 'முகவரி'}
                      </Label>
                      <Textarea
                        id="address"
                        value={eventPlan.clientDetails.address}
                        onChange={(e) => handleInputChange('clientDetails', 'address', e.target.value)}
                        className="mt-2 rounded-none border-chapa-light-gray focus:border-chapa-charcoal"
                        placeholder={language === 'en' ? 'Enter address' : 'முகவரியை உள்ளிடவும்'}
                        rows={3}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Event Details */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="eventType" className={`font-body ${
                        isDark ? 'text-white/80' : 'text-chapa-charcoal'
                      }`}>
                        {language === 'en' ? 'Event Type' : 'நிகழ்வு வகை'} *
                      </Label>
                      <Select 
                        value={eventPlan.eventDetails.type} 
                        onValueChange={(value) => handleInputChange('eventDetails', 'type', value)}
                      >
                        <SelectTrigger className="mt-2 rounded-none border-chapa-light-gray focus:border-chapa-charcoal">
                          <SelectValue placeholder={language === 'en' ? 'Select event type' : 'நிகழ்வு வகையைத் தேர்ந்தெடுக்கவும்'} />
                        </SelectTrigger>
                        <SelectContent>
                          {eventTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="expectedGuests" className={`font-body ${
                        isDark ? 'text-white/80' : 'text-chapa-charcoal'
                      }`}>
                        {language === 'en' ? 'Expected Guests' : 'எதிர்பார்க்கப்படும் விருந்தினர்கள்'} *
                      </Label>
                      <Input
                        id="expectedGuests"
                        type="number"
                        value={eventPlan.eventDetails.expectedGuests}
                        onChange={(e) => handleInputChange('eventDetails', 'expectedGuests', parseInt(e.target.value))}
                        className="mt-2 rounded-none border-chapa-light-gray focus:border-chapa-charcoal"
                        placeholder="0"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="eventName" className={`font-body ${
                      isDark ? 'text-white/80' : 'text-chapa-charcoal'
                    }`}>
                      {language === 'en' ? 'Event Name' : 'நிகழ்வு பெயர்'}
                    </Label>
                    <Input
                      id="eventName"
                      value={eventPlan.eventDetails.name}
                      onChange={(e) => handleInputChange('eventDetails', 'name', e.target.value)}
                      className="mt-2 rounded-none border-chapa-light-gray focus:border-chapa-charcoal"
                      placeholder={language === 'en' ? 'Enter event name' : 'நிகழ்வு பெயரை உள்ளிடவும்'}
                    />
                  </div>
                  <div>
                    <Label htmlFor="description" className={`font-body ${
                      isDark ? 'text-white/80' : 'text-chapa-charcoal'
                    }`}>
                      {language === 'en' ? 'Event Description' : 'நிகழ்வு விளக்கம்'}
                    </Label>
                    <Textarea
                      id="description"
                      value={eventPlan.eventDetails.description}
                      onChange={(e) => handleInputChange('eventDetails', 'description', e.target.value)}
                      className="mt-2 rounded-none border-chapa-light-gray focus:border-chapa-charcoal"
                      placeholder={language === 'en' ? 'Describe your event...' : 'உங்கள் நிகழ்வை விவரிக்கவும்...'}
                      rows={4}
                    />
                  </div>
                </div>
              )}

              {/* Step 3: Venue Selection */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="venueName" className={`font-body ${
                        isDark ? 'text-white/80' : 'text-chapa-charcoal'
                      }`}>
                        {language === 'en' ? 'Venue Name' : 'இடத்தின் பெயர்'}
                      </Label>
                      <Input
                        id="venueName"
                        value={eventPlan.venueDetails.name}
                        onChange={(e) => handleInputChange('venueDetails', 'name', e.target.value)}
                        className="mt-2 rounded-none border-chapa-light-gray focus:border-chapa-charcoal"
                        placeholder={language === 'en' ? 'Enter venue name' : 'இடத்தின் பெயரை உள்ளிடவும்'}
                      />
                    </div>
                    <div>
                      <Label htmlFor="capacity" className={`font-body ${
                        isDark ? 'text-white/80' : 'text-chapa-charcoal'
                      }`}>
                        {language === 'en' ? 'Venue Capacity' : 'இடத்தின் கொள்ளளவு'}
                      </Label>
                      <Input
                        id="capacity"
                        type="number"
                        value={eventPlan.venueDetails.capacity}
                        onChange={(e) => handleInputChange('venueDetails', 'capacity', parseInt(e.target.value))}
                        className="mt-2 rounded-none border-chapa-light-gray focus:border-chapa-charcoal"
                        placeholder="0"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="venueAddress" className={`font-body ${
                      isDark ? 'text-white/80' : 'text-chapa-charcoal'
                    }`}>
                      {language === 'en' ? 'Venue Address' : 'இடத்தின் முகவரி'}
                    </Label>
                    <Textarea
                      id="venueAddress"
                      value={eventPlan.venueDetails.address}
                      onChange={(e) => handleInputChange('venueDetails', 'address', e.target.value)}
                      className="mt-2 rounded-none border-chapa-light-gray focus:border-chapa-charcoal"
                      placeholder={language === 'en' ? 'Enter venue address' : 'இடத்தின் முகவரியை உள்ளிடவும்'}
                      rows={3}
                    />
                  </div>
                </div>
              )}

              {/* Step 4: Menu Planning */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <Label htmlFor="vegetarian" className={`font-body ${
                        isDark ? 'text-white/80' : 'text-chapa-charcoal'
                      }`}>
                        {language === 'en' ? 'Vegetarian' : 'காய்கறி'}
                      </Label>
                      <Input
                        id="vegetarian"
                        type="number"
                        value={eventPlan.dietaryRequirements.vegetarian}
                        onChange={(e) => handleInputChange('dietaryRequirements', 'vegetarian', parseInt(e.target.value))}
                        className="mt-2 rounded-none border-chapa-light-gray focus:border-chapa-charcoal"
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <Label htmlFor="nonVegetarian" className={`font-body ${
                        isDark ? 'text-white/80' : 'text-chapa-charcoal'
                      }`}>
                        {language === 'en' ? 'Non-Vegetarian' : 'காய்கறி அல்லாத'}
                      </Label>
                      <Input
                        id="nonVegetarian"
                        type="number"
                        value={eventPlan.dietaryRequirements.nonVegetarian}
                        onChange={(e) => handleInputChange('dietaryRequirements', 'nonVegetarian', parseInt(e.target.value))}
                        className="mt-2 rounded-none border-chapa-light-gray focus:border-chapa-charcoal"
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <Label htmlFor="vegan" className={`font-body ${
                        isDark ? 'text-white/80' : 'text-chapa-charcoal'
                      }`}>
                        {language === 'en' ? 'Vegan' : 'வேகன்'}
                      </Label>
                      <Input
                        id="vegan"
                        type="number"
                        value={eventPlan.dietaryRequirements.vegan}
                        onChange={(e) => handleInputChange('dietaryRequirements', 'vegan', parseInt(e.target.value))}
                        className="mt-2 rounded-none border-chapa-light-gray focus:border-chapa-charcoal"
                        placeholder="0"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="specialNeeds" className={`font-body ${
                      isDark ? 'text-white/80' : 'text-chapa-charcoal'
                    }`}>
                      {language === 'en' ? 'Special Dietary Requirements' : 'சிறப்பு உணவு தேவைகள்'}
                    </Label>
                    <Textarea
                      id="specialNeeds"
                      className="mt-2 rounded-none border-chapa-light-gray focus:border-chapa-charcoal"
                      placeholder={language === 'en' ? 'Any special dietary needs or allergies...' : 'எந்த சிறப்பு உணவு தேவைகள் அல்லது ஒவ்வாமை...'}
                      rows={3}
                    />
                  </div>
                </div>
              )}

              {/* Step 5: Budget & Timeline */}
              {currentStep === 5 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="startDate" className={`font-body ${
                        isDark ? 'text-white/80' : 'text-chapa-charcoal'
                      }`}>
                        {language === 'en' ? 'Start Date' : 'தொடக்க தேதி'} *
                      </Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={eventPlan.eventDates.startDate}
                        onChange={(e) => handleInputChange('eventDates', 'startDate', e.target.value)}
                        className="mt-2 rounded-none border-chapa-light-gray focus:border-chapa-charcoal"
                      />
                    </div>
                    <div>
                      <Label htmlFor="endDate" className={`font-body ${
                        isDark ? 'text-white/80' : 'text-chapa-charcoal'
                      }`}>
                        {language === 'en' ? 'End Date' : 'முடிவு தேதி'}
                      </Label>
                      <Input
                        id="endDate"
                        type="date"
                        value={eventPlan.eventDates.endDate}
                        onChange={(e) => handleInputChange('eventDates', 'endDate', e.target.value)}
                        className="mt-2 rounded-none border-chapa-light-gray focus:border-chapa-charcoal"
                      />
                    </div>
                    <div>
                      <Label htmlFor="totalBudget" className={`font-body ${
                        isDark ? 'text-white/80' : 'text-chapa-charcoal'
                      }`}>
                        {language === 'en' ? 'Total Budget' : 'மொத்த பட்ஜெட்'}
                      </Label>
                      <Input
                        id="totalBudget"
                        type="number"
                        value={eventPlan.budget.total}
                        onChange={(e) => handleInputChange('budget', 'total', parseInt(e.target.value))}
                        className="mt-2 rounded-none border-chapa-light-gray focus:border-chapa-charcoal"
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <Label htmlFor="perPerson" className={`font-body ${
                        isDark ? 'text-white/80' : 'text-chapa-charcoal'
                      }`}>
                        {language === 'en' ? 'Budget per Person' : 'ஒரு நபருக்கு பட்ஜெட்'}
                      </Label>
                      <Input
                        id="perPerson"
                        type="number"
                        value={eventPlan.budget.perPerson}
                        onChange={(e) => handleInputChange('budget', 'perPerson', parseInt(e.target.value))}
                        className="mt-2 rounded-none border-chapa-light-gray focus:border-chapa-charcoal"
                        placeholder="0"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 6: Review & Confirm */}
              {currentStep === 6 && (
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500" />
                    <h3 className={`text-xl font-display font-semibold mb-2 ${
                      isDark ? 'text-white' : 'text-chapa-charcoal'
                    }`}>
                      {language === 'en' ? 'Review Your Event Plan' : 'உங்கள் நிகழ்வு திட்டத்தை மதிப்பாய்வு செய்யவும்'}
                    </h3>
                    <p className={`font-body ${
                      isDark ? 'text-white/70' : 'text-chapa-medium-gray'
                    }`}>
                      {language === 'en' 
                        ? 'Please review all the details before confirming your event plan.'
                        : 'உங்கள் நிகழ்வு திட்டத்தை உறுதிப்படுத்துவதற்கு முன் அனைத்து விவரங்களையும் மதிப்பாய்வு செய்யவும்.'
                      }
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="card-chapa rounded-none shadow-subtle">
                      <CardHeader>
                        <CardTitle className={`text-lg font-display font-semibold ${
                          isDark ? 'text-white' : 'text-chapa-charcoal'
                        }`}>
                          {language === 'en' ? 'Client Information' : 'வாடிக்கையாளர் தகவல்'}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className={`font-body ${
                          isDark ? 'text-white/80' : 'text-chapa-medium-gray'
                        }`}>
                          <strong>{language === 'en' ? 'Name:' : 'பெயர்:'}</strong> {eventPlan.clientDetails.name}
                        </div>
                        <div className={`font-body ${
                          isDark ? 'text-white/80' : 'text-chapa-medium-gray'
                        }`}>
                          <strong>{language === 'en' ? 'Email:' : 'மின்னஞ்சல்:'}</strong> {eventPlan.clientDetails.email}
                        </div>
                        <div className={`font-body ${
                          isDark ? 'text-white/80' : 'text-chapa-medium-gray'
                        }`}>
                          <strong>{language === 'en' ? 'Phone:' : 'தொலைபேசி:'}</strong> {eventPlan.clientDetails.phone}
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="card-chapa rounded-none shadow-subtle">
                      <CardHeader>
                        <CardTitle className={`text-lg font-display font-semibold ${
                          isDark ? 'text-white' : 'text-chapa-charcoal'
                        }`}>
                          {language === 'en' ? 'Event Summary' : 'நிகழ்வு சுருக்கம்'}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className={`font-body ${
                          isDark ? 'text-white/80' : 'text-chapa-medium-gray'
                        }`}>
                          <strong>{language === 'en' ? 'Type:' : 'வகை:'}</strong> {eventPlan.eventDetails.type}
                        </div>
                        <div className={`font-body ${
                          isDark ? 'text-white/80' : 'text-chapa-medium-gray'
                        }`}>
                          <strong>{language === 'en' ? 'Guests:' : 'விருந்தினர்கள்:'}</strong> {eventPlan.eventDetails.expectedGuests}
                        </div>
                        <div className={`font-body ${
                          isDark ? 'text-white/80' : 'text-chapa-medium-gray'
                        }`}>
                          <strong>{language === 'en' ? 'Date:' : 'தேதி:'}</strong> {eventPlan.eventDates.startDate}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between items-center pt-8 border-t border-chapa-light-gray">
                <Button
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className="btn-chapa-secondary"
                >
                  {language === 'en' ? 'Previous' : 'முந்தைய'}
                </Button>
                
                <div className="flex gap-3">
                  {currentStep < steps.length ? (
                    <Button onClick={nextStep} className="btn-chapa-primary">
                      {language === 'en' ? 'Next' : 'அடுத்தது'}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  ) : (
                    <Button onClick={handleSubmit} className="btn-chapa-primary">
                      {language === 'en' ? 'Confirm & Submit' : 'உறுதிப்படுத்து & சமர்ப்பிக்கவும்'}
                      <CheckCircle className="w-4 h-4 ml-2" />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default EnhancedEventPlanner;
