import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  MapPin, 
  Star, 
  Users, 
  Clock, 
  Phone, 
  Mail,
  Heart,
  Award,
  CheckCircle,
  Calendar,
  Car,
  Wifi,
  Music,
  Camera,
  ChefHat
} from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

interface VenueSelectionProps {
  language: 'en' | 'ta';
  selectedVenue?: string;
  onVenueSelect: (venueId: string) => void;
}

interface Venue {
  id: string;
  name: string;
  name_ta: string;
  address: string;
  address_ta: string;
  capacity: number;
  price: number;
  rating: number;
  reviews: number;
  images: string[];
  amenities: string[];
  description: string;
  description_ta: string;
  contact: {
    phone: string;
    email: string;
  };
  availability: {
    date: string;
    timeSlots: string[];
  }[];
}

const VenueSelection: React.FC<VenueSelectionProps> = ({
  language,
  selectedVenue,
  onVenueSelect
}) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const [selectedCapacity, setSelectedCapacity] = useState('all');
  const [selectedPrice, setSelectedPrice] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const venues: Venue[] = [
    {
      id: 'grand-palace',
      name: 'Grand Palace Hotel',
      name_ta: 'கிராண்ட் பாலஸ் ஹோட்டல்',
      address: '123 Main Street, Coimbatore, Tamil Nadu',
      address_ta: '123 முதன்மை தெரு, கோயம்புத்தூர், தமிழ்நாடு',
      capacity: 200,
      price: 25000,
      rating: 4.8,
      reviews: 156,
      images: ['/placeholder.svg'],
      amenities: ['Parking', 'Wifi', 'AC', 'Sound System', 'Catering Kitchen'],
      description: 'Luxurious hotel with state-of-the-art facilities and elegant banquet halls.',
      description_ta: 'நவீன வசதிகளுடன் கூடிய ஆடம்பர ஹோட்டல் மற்றும் நேர்த்தியான விருந்து அரங்கங்கள்.',
      contact: {
        phone: '+91 8012686883',
        email: 'info@grandpalace.com'
      },
      availability: [
        {
          date: '2024-12-15',
          timeSlots: ['Morning', 'Evening']
        }
      ]
    },
    {
      id: 'riverside-garden',
      name: 'Riverside Garden Resort',
      name_ta: 'ரிவர்சைட் கார்டன் ரிசார்ட்',
      address: '456 River Road, Coimbatore, Tamil Nadu',
      address_ta: '456 ஆற்று சாலை, கோயம்புத்தூர், தமிழ்நாடு',
      capacity: 150,
      price: 18000,
      rating: 4.6,
      reviews: 89,
      images: ['/placeholder.svg'],
      amenities: ['Garden', 'Parking', 'Wifi', 'Outdoor Seating', 'Natural Scenery'],
      description: 'Beautiful outdoor venue surrounded by nature with modern amenities.',
      description_ta: 'இயற்கையால் சூழப்பட்ட அழகான வெளிப்புற இடம் நவீன வசதிகளுடன்.',
      contact: {
        phone: '+91 8012686884',
        email: 'info@riversidegarden.com'
      },
      availability: [
        {
          date: '2024-12-15',
          timeSlots: ['Morning', 'Evening']
        }
      ]
    },
    {
      id: 'heritage-hall',
      name: 'Heritage Convention Hall',
      name_ta: 'பாரம்பரிய மாநாட்டு அரங்கம்',
      address: '789 Heritage Street, Coimbatore, Tamil Nadu',
      address_ta: '789 பாரம்பரிய தெரு, கோயம்புத்தூர், தமிழ்நாடு',
      capacity: 300,
      price: 35000,
      rating: 4.9,
      reviews: 234,
      images: ['/placeholder.svg'],
      amenities: ['Large Hall', 'Parking', 'Wifi', 'Professional Sound', 'Lighting System'],
      description: 'Spacious convention hall perfect for large events with professional facilities.',
      description_ta: 'பெரிய நிகழ்வுகளுக்கு ஏற்ற விசாலமான மாநாட்டு அரங்கம் தொழில்முறை வசதிகளுடன்.',
      contact: {
        phone: '+91 8012686885',
        email: 'info@heritagehall.com'
      },
      availability: [
        {
          date: '2024-12-15',
          timeSlots: ['Morning', 'Evening']
        }
      ]
    }
  ];

  const capacityFilters = [
    { value: 'all', label: language === 'en' ? 'All Sizes' : 'அனைத்து அளவுகளும்' },
    { value: 'small', label: language === 'en' ? 'Small (50-100)' : 'சிறிய (50-100)' },
    { value: 'medium', label: language === 'en' ? 'Medium (100-200)' : 'நடுத்தர (100-200)' },
    { value: 'large', label: language === 'en' ? 'Large (200+)' : 'பெரிய (200+)' }
  ];

  const priceFilters = [
    { value: 'all', label: language === 'en' ? 'All Prices' : 'அனைத்து விலைகளும்' },
    { value: 'budget', label: language === 'en' ? 'Budget (<20K)' : 'பட்ஜெட் (<20K)' },
    { value: 'mid', label: language === 'en' ? 'Mid-Range (20K-30K)' : 'நடுத்தர (20K-30K)' },
    { value: 'premium', label: language === 'en' ? 'Premium (30K+)' : 'பிரீமியம் (30K+)' }
  ];

  const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case 'parking': return <Car className="w-4 h-4" />;
      case 'wifi': return <Wifi className="w-4 h-4" />;
      case 'sound system': return <Music className="w-4 h-4" />;
      case 'catering kitchen': return <ChefHat className="w-4 h-4" />;
      case 'garden': return <Award className="w-4 h-4" />;
      case 'outdoor seating': return <MapPin className="w-4 h-4" />;
      case 'natural scenery': return <Award className="w-4 h-4" />;
      case 'large hall': return <Users className="w-4 h-4" />;
      case 'professional sound': return <Music className="w-4 h-4" />;
      case 'lighting system': return <Award className="w-4 h-4" />;
      default: return <Award className="w-4 h-4" />;
    }
  };

  const filterVenues = () => {
    return venues.filter(venue => {
      const matchesSearch = 
        (language === 'en' ? venue.name : venue.name_ta).toLowerCase().includes(searchTerm.toLowerCase()) ||
        (language === 'en' ? venue.address : venue.address_ta).toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCapacity = selectedCapacity === 'all' || 
        (selectedCapacity === 'small' && venue.capacity <= 100) ||
        (selectedCapacity === 'medium' && venue.capacity > 100 && venue.capacity <= 200) ||
        (selectedCapacity === 'large' && venue.capacity > 200);
      
      const matchesPrice = selectedPrice === 'all' ||
        (selectedPrice === 'budget' && venue.price < 20000) ||
        (selectedPrice === 'mid' && venue.price >= 20000 && venue.price <= 30000) ||
        (selectedPrice === 'premium' && venue.price > 30000);
      
      return matchesSearch && matchesCapacity && matchesPrice;
    });
  };

  const filteredVenues = filterVenues();

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
              {language === 'en' ? 'Venue Selection' : 'இடத் தேர்வு'}
            </span>
          </motion.div>
          
          <h1 className={`text-4xl md:text-6xl font-display font-bold mb-8 leading-tight ${
            isDark ? 'text-white' : 'text-chapa-charcoal'
          }`}>
            {language === 'en' ? 'Choose Your Perfect Venue' : 'உங்கள் சரியான இடத்தைத் தேர்ந்தெடுக்கவும்'}
          </h1>
          <p className={`text-lg max-w-3xl mx-auto leading-relaxed font-body font-normal ${
            isDark ? 'text-white/80' : 'text-chapa-medium-gray'
          }`}>
            {language === 'en' 
              ? 'Discover our carefully curated selection of premium venues, each offering unique charm and world-class facilities for your special event.'
              : 'உங்கள் சிறப்பு நிகழ்வுக்கான தனித்துவமான கவர்ச்சி மற்றும் உலகத் தர வசதிகளை வழங்கும் பிரீமியம் இடங்களின் எங்கள் கவனமாக தேர்ந்தெடுக்கப்பட்ட தேர்வைக் கண்டறியுங்கள்.'
            }
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-8"
        >
          <Card className="card-chapa rounded-none shadow-subtle">
            <CardContent className="p-6">
              <div className="space-y-6">
                {/* Search Bar */}
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-chapa-medium-gray" />
                  <input
                    type="text"
                    placeholder={language === 'en' ? 'Search venues by name or location...' : 'பெயர் அல்லது இடம் மூலம் இடங்களைத் தேடுங்கள்...'}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-none border border-chapa-light-gray focus:border-chapa-charcoal focus:outline-none font-body"
                  />
                </div>
                
                {/* Filters */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-body font-medium mb-2 ${
                      isDark ? 'text-white/80' : 'text-chapa-charcoal'
                    }`}>
                      {language === 'en' ? 'Capacity' : 'கொள்ளளவு'}
                    </label>
                    <select
                      value={selectedCapacity}
                      onChange={(e) => setSelectedCapacity(e.target.value)}
                      className="w-full p-3 rounded-none border border-chapa-light-gray focus:border-chapa-charcoal focus:outline-none font-body"
                    >
                      {capacityFilters.map(filter => (
                        <option key={filter.value} value={filter.value}>
                          {filter.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-body font-medium mb-2 ${
                      isDark ? 'text-white/80' : 'text-chapa-charcoal'
                    }`}>
                      {language === 'en' ? 'Price Range' : 'விலை வரம்பு'}
                    </label>
                    <select
                      value={selectedPrice}
                      onChange={(e) => setSelectedPrice(e.target.value)}
                      className="w-full p-3 rounded-none border border-chapa-light-gray focus:border-chapa-charcoal focus:outline-none font-body"
                    >
                      {priceFilters.map(filter => (
                        <option key={filter.value} value={filter.value}>
                          {filter.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Venues Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8"
        >
          {filteredVenues.map((venue, index) => (
            <motion.div
              key={venue.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="group"
            >
              <Card className={`card-chapa rounded-none shadow-subtle hover:shadow-elegant transition-all duration-300 h-full ${
                selectedVenue === venue.id ? 'ring-2 ring-chapa-gold' : ''
              }`}>
                <CardContent className="p-0">
                  {/* Venue Image */}
                  <div className="relative h-48 bg-chapa-light-gray overflow-hidden">
                    <img
                      src={venue.images[0]}
                      alt={language === 'en' ? venue.name : venue.name_ta}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {selectedVenue === venue.id && (
                      <div className="absolute top-4 right-4 bg-chapa-gold text-white p-2 rounded-none">
                        <CheckCircle className="w-5 h-5" />
                      </div>
                    )}
                    <div className="absolute bottom-4 left-4 bg-chapa-charcoal/90 text-white px-3 py-1 rounded-none">
                      <Badge className="bg-transparent text-white border-0 font-body">
                        ₹{venue.price.toLocaleString()}
                      </Badge>
                    </div>
                  </div>
                  
                  {/* Venue Details */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className={`text-xl font-display font-semibold mb-2 ${
                          isDark ? 'text-white' : 'text-chapa-charcoal'
                        }`}>
                          {language === 'en' ? venue.name : venue.name_ta}
                        </h3>
                        <div className="flex items-center gap-2 mb-2">
                          <Star className="w-4 h-4 fill-chapa-gold text-chapa-gold" />
                          <span className={`text-sm font-body ${
                            isDark ? 'text-white/70' : 'text-chapa-medium-gray'
                          }`}>
                            {venue.rating} ({venue.reviews} {language === 'en' ? 'reviews' : 'மதிப்பீடுகள்'})
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <p className={`text-sm font-body mb-4 ${
                      isDark ? 'text-white/70' : 'text-chapa-medium-gray'
                    }`}>
                      {language === 'en' ? venue.description : venue.description_ta}
                    </p>
                    
                    {/* Venue Info */}
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center gap-3">
                        <MapPin className="w-4 h-4 text-chapa-gold" />
                        <span className={`text-sm font-body ${
                          isDark ? 'text-white/80' : 'text-chapa-medium-gray'
                        }`}>
                          {language === 'en' ? venue.address : venue.address_ta}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Users className="w-4 h-4 text-chapa-gold" />
                        <span className={`text-sm font-body ${
                          isDark ? 'text-white/80' : 'text-chapa-medium-gray'
                        }`}>
                          {language === 'en' ? 'Capacity' : 'கொள்ளளவு'}: {venue.capacity} {language === 'en' ? 'guests' : 'விருந்தினர்கள்'}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Phone className="w-4 h-4 text-chapa-gold" />
                        <span className={`text-sm font-body ${
                          isDark ? 'text-white/80' : 'text-chapa-medium-gray'
                        }`}>
                          {venue.contact.phone}
                        </span>
                      </div>
                    </div>
                    
                    {/* Amenities */}
                    <div className="mb-6">
                      <h4 className={`text-sm font-body font-medium mb-3 ${
                        isDark ? 'text-white/80' : 'text-chapa-charcoal'
                      }`}>
                        {language === 'en' ? 'Amenities' : 'வசதிகள்'}
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {venue.amenities.slice(0, 4).map((amenity, amenityIndex) => (
                          <div
                            key={amenityIndex}
                            className="flex items-center gap-1 px-2 py-1 bg-chapa-light-gray rounded-none"
                          >
                            {getAmenityIcon(amenity)}
                            <span className={`text-xs font-body ${
                              isDark ? 'text-white/70' : 'text-chapa-medium-gray'
                            }`}>
                              {amenity}
                            </span>
                          </div>
                        ))}
                        {venue.amenities.length > 4 && (
                          <Badge variant="secondary" className="rounded-none bg-chapa-light-gray text-chapa-charcoal font-body">
                            +{venue.amenities.length - 4} {language === 'en' ? 'more' : 'மேலும்'}
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <Button
                        onClick={() => onVenueSelect(venue.id)}
                        className={`flex-1 rounded-none font-body ${
                          selectedVenue === venue.id
                            ? 'bg-chapa-gold text-white hover:bg-chapa-gold/90'
                            : 'btn-chapa-primary'
                        }`}
                      >
                        {selectedVenue === venue.id 
                          ? (language === 'en' ? 'Selected' : 'தேர்ந்தெடுக்கப்பட்டது')
                          : (language === 'en' ? 'Select Venue' : 'இடத்தைத் தேர்ந்தெடுக்கவும்')
                        }
                      </Button>
                      
                      <Button
                        variant="outline"
                        className="btn-chapa-secondary rounded-none"
                      >
                        <Heart className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* No Results */}
        {filteredVenues.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-center py-12"
          >
            <div className="text-4xl mb-4">🏢</div>
            <h3 className={`text-xl font-display font-semibold mb-2 ${
              isDark ? 'text-white' : 'text-chapa-charcoal'
            }`}>
              {language === 'en' ? 'No Venues Found' : 'இடங்கள் எதுவும் கிடைக்கவில்லை'}
            </h3>
            <p className={`font-body ${
              isDark ? 'text-white/70' : 'text-chapa-medium-gray'
            }`}>
              {language === 'en' 
                ? 'Try adjusting your search criteria or filters to find more venues.'
                : 'மேலும் இடங்களைக் கண்டறிய உங்கள் தேடல் அளவுகோல்கள் அல்லது வடிப்பான்களை மாற்ற முயற்சிக்கவும்.'
              }
            </p>
          </motion.div>
        )}

        {/* CTA Section */}
        {filteredVenues.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="text-center mt-20"
          >
            <Card className={`card-chapa rounded-none p-12 border-0 shadow-elegant ${
              isDark ? 'bg-chapa-charcoal/10 border-white/20' : 'bg-chapa-light-gray border-chapa-light-gray'
            }`}>
              <h3 className={`text-3xl font-display font-bold mb-6 ${
                isDark ? 'text-white' : 'text-chapa-charcoal'
              }`}>
                {language === 'en' ? 'Need Help Choosing?' : 'தேர்வு செய்வதில் உதவி தேவையா?'}
              </h3>
              <p className={`text-lg mb-8 max-w-2xl mx-auto font-body ${
                isDark ? 'text-white/80' : 'text-chapa-medium-gray'
              }`}>
                {language === 'en' 
                  ? 'Our venue experts are here to help you find the perfect location for your event. Get personalized recommendations and exclusive deals.'
                  : 'உங்கள் நிகழ்வுக்கான சரியான இடத்தைக் கண்டறிய எங்கள் இட நிபுணர்கள் உங்களுக்கு உதவ இங்கே உள்ளனர். தனிப்பயனாக்கப்பட்ட பரிந்துரைகள் மற்றும் பிரத்தியேக சலுகைகளைப் பெறுங்கள்.'
                }
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button className="btn-chapa-primary text-lg px-8 py-4">
                  <Phone className="w-5 h-5 mr-2" />
                  {language === 'en' ? 'Get Expert Advice' : 'நிபுணர் ஆலோசனையைப் பெறுங்கள்'}
                </Button>
                <Button variant="outline" className="btn-chapa-secondary text-lg px-8 py-4">
                  <Calendar className="w-5 h-5 mr-2" />
                  {language === 'en' ? 'Schedule Visit' : 'வருகையைத் திட்டமிடுங்கள்'}
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default VenueSelection;
