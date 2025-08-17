import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { 
  MapPin, 
  Building,
  Phone,
  Mail,
  ArrowLeft,
  ArrowRight,
  CheckCircle
} from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

interface VenueDetailsProps {
  language: 'en' | 'ta';
  venueDetails: {
    name: string;
    address: string;
    coordinates?: { lat: number; lng: number };
    googleMapsUrl: string;
  };
  onVenueUpdate: (field: string, value: string) => void;
  canProceed: boolean;
  onPrevious: () => void;
  onNext: () => void;
}

const VenueDetails: React.FC<VenueDetailsProps> = ({
  language,
  venueDetails,
  onVenueUpdate,
  canProceed,
  onPrevious,
  onNext
}) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
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
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-3 text-white rounded-none px-6 py-3 mb-6 shadow-subtle bg-chapa-charcoal"
          >
            <MapPin className="w-5 h-5" />
            <span className="font-body font-medium text-sm tracking-wide">
              {language === 'en' ? 'Venue Details' : 'வென்யூ விவரங்கள்'}
            </span>
          </motion.div>
          
          <h1 className={`text-4xl md:text-6xl font-display font-bold mb-8 leading-tight ${
            isDark ? 'text-white' : 'text-chapa-charcoal'
          }`}>
            {language === 'en' ? 'Where is Your Event?' : 'உங்கள் நிகழ்வு எங்கே?'}
          </h1>
          <p className={`text-lg max-w-3xl mx-auto leading-relaxed font-body font-normal ${
            isDark ? 'text-white/80' : 'text-chapa-medium-gray'
          }`}>
            {language === 'en' 
              ? 'Tell us about your venue so we can plan the perfect setup for your event.'
              : 'உங்கள் வென்யூ பற்றி எங்களுக்கு சொல்லுங்கள், அதனால் நாங்கள் உங்கள் நிகழ்வுக்கான சரியான அமைப்பைத் திட்டமிட முடியும்.'
            }
          </p>
        </motion.div>

        {/* Venue Details Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="max-w-4xl mx-auto"
        >
          <Card className="card-chapa rounded-none shadow-elegant">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className={`text-2xl font-display font-semibold ${
                  isDark ? 'text-white' : 'text-chapa-charcoal'
                }`}>
                  {language === 'en' ? 'Venue Information' : 'வென்யூ தகவல்'}
                </CardTitle>
                <p className={`font-body ${
                  isDark ? 'text-white/70' : 'text-chapa-medium-gray'
                }`}>
                  {language === 'en' ? 'Fill in your venue details' : 'உங்கள் வென்யூ விவரங்களை நிரப்பவும்'}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(!isEditing)}
                  className="flex items-center gap-2 border-chapa-light-gray hover:border-chapa-charcoal"
                >
                  {isEditing ? (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      {language === 'en' ? 'View' : 'காட்டு'}
                    </>
                  ) : (
                    <>
                      <Building className="w-4 h-4" />
                      {language === 'en' ? 'Edit' : 'திருத்து'}
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Venue Name */}
              <div>
                <Label htmlFor="venueName" className={`font-body ${
                  isDark ? 'text-white/80' : 'text-chapa-charcoal'
                }`}>
                  {language === 'en' ? 'Venue Name' : 'வென்யூ பெயர்'} *
                </Label>
                <Input
                  id="venueName"
                  value={venueDetails.name}
                  onChange={(e) => onVenueUpdate('name', e.target.value)}
                  placeholder={language === 'en' ? 'Enter venue name' : 'வென்யூ பெயரை உள்ளிடவும்'}
                  className="mt-2 rounded-none border-chapa-light-gray focus:border-chapa-charcoal"
                  disabled={!isEditing}
                />
              </div>

              {/* Venue Address */}
              <div>
                <Label htmlFor="venueAddress" className={`font-body ${
                  isDark ? 'text-white/80' : 'text-chapa-charcoal'
                }`}>
                  {language === 'en' ? 'Venue Address' : 'வென்யூ முகவரி'} *
                </Label>
                <Textarea
                  id="venueAddress"
                  value={venueDetails.address}
                  onChange={(e) => onVenueUpdate('address', e.target.value)}
                  placeholder={language === 'en' ? 'Enter complete venue address' : 'முழு வென்யூ முகவரியை உள்ளிடவும்'}
                  className="mt-2 rounded-none border-chapa-light-gray focus:border-chapa-charcoal min-h-[100px]"
                  disabled={!isEditing}
                />
              </div>

              {/* Google Maps URL */}
              <div>
                <Label htmlFor="googleMapsUrl" className={`font-body ${
                  isDark ? 'text-white/80' : 'text-chapa-charcoal'
                }`}>
                  {language === 'en' ? 'Google Maps URL' : 'Google Maps URL'} (Optional)
                </Label>
                <Input
                  id="googleMapsUrl"
                  value={venueDetails.googleMapsUrl}
                  onChange={(e) => onVenueUpdate('googleMapsUrl', e.target.value)}
                  placeholder={language === 'en' ? 'https://maps.google.com/...' : 'https://maps.google.com/...'}
                  className="mt-2 rounded-none border-chapa-light-gray focus:border-chapa-charcoal"
                  disabled={!isEditing}
                />
                <p className={`text-sm mt-1 font-body ${
                  isDark ? 'text-white/60' : 'text-chapa-medium-gray'
                }`}>
                  {language === 'en' 
                    ? 'Add Google Maps link to help guests find the venue easily'
                    : 'விருந்தினர்கள் வென்யூவை எளிதாகக் கண்டுபிடிக்க Google Maps இணைப்பைச் சேர்க்கவும்'
                  }
                </p>
              </div>

              {/* Action Buttons */}
              {isEditing && (
                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={handleSave}
                    className="bg-chapa-charcoal hover:bg-chapa-charcoal/90 text-white rounded-none px-6 py-2"
                  >
                    {language === 'en' ? 'Save Changes' : 'மாற்றங்களை சேமிக்கவும்'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                    className="border-chapa-light-gray hover:border-chapa-charcoal rounded-none px-6 py-2"
                  >
                    {language === 'en' ? 'Cancel' : 'ரத்து'}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Summary Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-8"
          >
            <Card className="card-chapa rounded-none shadow-elegant">
              <CardHeader>
                <CardTitle className={`text-xl font-display font-semibold ${
                  isDark ? 'text-white' : 'text-chapa-charcoal'
                }`}>
                  {language === 'en' ? 'Venue Summary' : 'வென்யூ சுருக்கம்'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {venueDetails.name && (
                  <div className="flex items-center gap-3">
                    <Building className="w-5 h-5 text-chapa-charcoal" />
                    <span className={`font-body ${
                      isDark ? 'text-white' : 'text-chapa-charcoal'
                    }`}>
                      <strong>{language === 'en' ? 'Name:' : 'பெயர்:'}</strong> {venueDetails.name}
                    </span>
                  </div>
                )}
                {venueDetails.address && (
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-chapa-charcoal mt-1" />
                    <span className={`font-body ${
                      isDark ? 'text-white' : 'text-chapa-charcoal'
                    }`}>
                      <strong>{language === 'en' ? 'Address:' : 'முகவரி:'}</strong> {venueDetails.address}
                    </span>
                  </div>
                )}
                {venueDetails.googleMapsUrl && (
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-chapa-charcoal" />
                    <a 
                      href={venueDetails.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`font-body text-blue-600 hover:text-blue-800 underline ${
                        isDark ? 'text-blue-400 hover:text-blue-300' : ''
                      }`}
                    >
                      {language === 'en' ? 'View on Google Maps' : 'Google Maps இல் காட்டு'}
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Navigation Buttons */}
          <motion.div 
            className="flex justify-between mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2, type: "spring", bounce: 0.4 }}
            >
              <Button 
                variant="outline"
                onClick={onPrevious}
                className="flex items-center gap-3 border-2 border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 rounded-2xl px-6 py-3 transition-all duration-300"
              >
                <ArrowLeft className="w-5 h-5" />
                {language === 'en' ? 'Previous' : 'முந்தைய'}
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2, type: "spring", bounce: 0.4 }}
            >
              <Button 
                onClick={onNext}
                disabled={!canProceed}
                className="flex items-center gap-3 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white border-0 rounded-2xl px-6 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {language === 'en' ? 'Next: Session Planning' : 'அடுத்து: அமர்வு திட்டமிடல்'}
                <ArrowRight className="w-5 h-5" />
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default VenueDetails;
