import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  ChefHat, 
  Star, 
  Heart, 
  ShoppingCart, 
  Filter, 
  Search,
  Plus,
  Minus,
  Clock,
  Users,
  Award,
  CheckCircle
} from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { menuData } from '../data/menuData';
import { Input } from './ui/input';

interface EnhancedMenuSelectionProps {
  language: 'en' | 'ta';
}

const EnhancedMenuSelection: React.FC<EnhancedMenuSelectionProps> = ({ language }) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItems, setSelectedItems] = useState<{[key: string]: number}>({});
  const [showCart, setShowCart] = useState(false);

  const categories = [
    { id: 'all', name: language === 'en' ? 'All Items' : 'அனைத்து பொருட்களும்', icon: ChefHat },
    { id: 'starters', name: language === 'en' ? 'Starters' : 'தொடக்க உணவுகள்', icon: Star },
    { id: 'main-course', name: language === 'en' ? 'Main Course' : 'முதன்மை உணவு', icon: Heart },
    { id: 'desserts', name: language === 'en' ? 'Desserts' : 'இனிப்புகள்', icon: Award },
    { id: 'beverages', name: language === 'en' ? 'Beverages' : 'பானங்கள்', icon: Clock }
  ];

  const addToCart = (itemId: string) => {
    setSelectedItems(prev => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1
    }));
  };

  const removeFromCart = (itemId: string) => {
    setSelectedItems(prev => {
      const newItems = { ...prev };
      if (newItems[itemId] > 1) {
        newItems[itemId] -= 1;
      } else {
        delete newItems[itemId];
      }
      return newItems;
    });
  };

  const getTotalPrice = () => {
    let total = 0;
    Object.entries(selectedItems).forEach(([itemId, quantity]) => {
      for (const category in menuData) {
        const item = menuData[category].find(item => item.id === itemId);
        if (item) {
          total += item.price * quantity;
          break;
        }
      }
    });
    return total;
  };

  const getTotalItems = () => {
    return Object.values(selectedItems).reduce((sum, quantity) => sum + quantity, 0);
  };

  const filteredMenu = Object.entries(menuData).filter(([categoryId]) => 
    selectedCategory === 'all' || categoryId === selectedCategory
  ).map(([categoryId, items]) => ({
    categoryId,
    items: items.filter(item => 
      (language === 'en' ? item.name_en : item.name_ta).toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(({ items }) => items.length > 0);

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
            <ChefHat className="w-5 h-5" />
            <span className="font-body font-medium text-sm tracking-wide">
              {language === 'en' ? 'Menu Selection' : 'மெனு தேர்வு'}
            </span>
          </motion.div>
          
          <h1 className={`text-4xl md:text-6xl font-display font-bold mb-8 leading-tight ${
            isDark ? 'text-white' : 'text-chapa-charcoal'
          }`}>
            {language === 'en' ? 'Our Signature Menu' : 'எங்கள் கையெழுத்து மெனு'}
          </h1>
          <p className={`text-lg max-w-3xl mx-auto leading-relaxed font-body font-normal ${
            isDark ? 'text-white/80' : 'text-chapa-medium-gray'
          }`}>
            {language === 'en' 
              ? 'Discover our carefully curated selection of authentic South Indian dishes, prepared with the finest ingredients and traditional recipes passed down through generations.'
              : 'சிறந்த பொருட்கள் மற்றும் தலைமுறைகளாக கடத்தப்பட்ட பாரம்பரிய செய்முறைகளுடன் தயாரிக்கப்பட்ட அசல் தென்னிந்திய உணவுகளின் எங்கள் கவனமாக தேர்ந்தெடுக்கப்பட்ட தேர்வைக் கண்டறியுங்கள்.'
            }
          </p>
        </motion.div>

        {/* Search and Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-8"
        >
          <Card className="card-chapa rounded-none shadow-subtle">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-chapa-medium-gray" />
                  <Input
                    placeholder={language === 'en' ? 'Search menu items...' : 'மெனு பொருட்களைத் தேடுங்கள்...'}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 rounded-none border-chapa-light-gray focus:border-chapa-charcoal"
                  />
                </div>
                
                <div className="flex gap-2">
                  {categories.map((category) => (
                    <Button
                      key={category.id}
                      variant={selectedCategory === category.id ? "default" : "outline"}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`rounded-none font-body ${
                        selectedCategory === category.id
                          ? 'bg-chapa-charcoal text-white border-chapa-charcoal'
                          : 'border-chapa-light-gray text-chapa-medium-gray hover:border-chapa-charcoal hover:text-chapa-charcoal'
                      }`}
                    >
                      <category.icon className="w-4 h-4 mr-2" />
                      {category.name}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Cart Summary */}
        {getTotalItems() > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Card className="card-chapa rounded-none shadow-elegant">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <ShoppingCart className="w-6 h-6 text-chapa-gold" />
                    <div>
                      <h3 className={`text-lg font-display font-semibold ${
                        isDark ? 'text-white' : 'text-chapa-charcoal'
                      }`}>
                        {language === 'en' ? 'Selected Items' : 'தேர்ந்தெடுக்கப்பட்ட பொருட்கள்'}
                      </h3>
                      <p className={`text-sm font-body ${
                        isDark ? 'text-white/70' : 'text-chapa-medium-gray'
                      }`}>
                        {getTotalItems()} {language === 'en' ? 'items' : 'பொருட்கள்'} • ₹{getTotalPrice()}
                      </p>
                    </div>
                  </div>
                  <Button 
                    onClick={() => setShowCart(!showCart)}
                    className="btn-chapa-primary"
                  >
                    {showCart ? (language === 'en' ? 'Hide Cart' : 'கார்ட்டை மறைக்கவும்') : (language === 'en' ? 'View Cart' : 'கார்ட்டைக் காண்க')}
                  </Button>
                </div>
                
                {showCart && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-6 pt-6 border-t border-chapa-light-gray"
                  >
                    <div className="space-y-3">
                      {Object.entries(selectedItems).map(([itemId, quantity]) => {
                        let itemName = '';
                        let itemPrice = 0;
                        
                        for (const category in menuData) {
                          const item = menuData[category].find(item => item.id === itemId);
                          if (item) {
                            itemName = language === 'en' ? item.name_en : item.name_ta;
                            itemPrice = item.price;
                            break;
                          }
                        }
                        
                        return (
                          <div key={itemId} className="flex items-center justify-between p-3 bg-chapa-light-gray rounded-none">
                            <div className="flex-1">
                              <div className={`font-body font-medium ${
                                isDark ? 'text-white' : 'text-chapa-charcoal'
                              }`}>
                                {itemName}
                              </div>
                              <div className={`text-sm font-body ${
                                isDark ? 'text-white/60' : 'text-chapa-medium-gray'
                              }`}>
                                ₹{itemPrice} x {quantity}
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className={`font-body font-semibold ${
                                isDark ? 'text-white' : 'text-chapa-charcoal'
                              }`}>
                                ₹{itemPrice * quantity}
                              </div>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => removeFromCart(itemId)}
                                  className="w-8 h-8 p-0 rounded-none border-chapa-light-gray"
                                >
                                  <Minus className="w-4 h-4" />
                                </Button>
                                <span className={`w-8 text-center font-body ${
                                  isDark ? 'text-white' : 'text-chapa-charcoal'
                                }`}>
                                  {quantity}
                                </span>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => addToCart(itemId)}
                                  className="w-8 h-8 p-0 rounded-none border-chapa-light-gray"
                                >
                                  <Plus className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      
                      <div className="flex items-center justify-between pt-4 border-t border-chapa-light-gray">
                        <div className={`text-lg font-display font-semibold ${
                          isDark ? 'text-white' : 'text-chapa-charcoal'
                        }`}>
                          {language === 'en' ? 'Total' : 'மொத்தம்'}
                        </div>
                        <div className={`text-xl font-display font-bold text-chapa-gold`}>
                          ₹{getTotalPrice()}
                        </div>
                      </div>
                      
                      <Button className="btn-chapa-primary w-full mt-4">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        {language === 'en' ? 'Proceed to Checkout' : 'செலுத்துவதற்கு செல்லுங்கள்'}
                      </Button>
                    </div>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Menu Items */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="space-y-8"
        >
          {filteredMenu.map(({ categoryId, items }, categoryIndex) => (
            <div key={categoryId}>
              <motion.h2
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.8 + categoryIndex * 0.1 }}
                className={`text-2xl font-display font-semibold mb-6 ${
                  isDark ? 'text-white' : 'text-chapa-charcoal'
                }`}
              >
                {categories.find(cat => cat.id === categoryId)?.name}
              </motion.h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((item, itemIndex) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 1 + categoryIndex * 0.1 + itemIndex * 0.05 }}
                    whileHover={{ y: -5, scale: 1.02 }}
                    className="group"
                  >
                    <Card className="card-chapa rounded-none shadow-subtle hover:shadow-elegant transition-all duration-300 h-full">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className={`text-lg font-display font-semibold mb-2 ${
                              isDark ? 'text-white' : 'text-chapa-charcoal'
                            }`}>
                              {language === 'en' ? item.name_en : item.name_ta}
                            </h3>
                            <p className={`text-sm font-body mb-3 ${
                              isDark ? 'text-white/70' : 'text-chapa-medium-gray'
                            }`}>
                              {language === 'en' ? item.description_en : item.description_ta}
                            </p>
                          </div>
                          <div className={`text-lg font-display font-bold text-chapa-gold`}>
                            ₹{item.price}
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <Star className="w-4 h-4 fill-chapa-gold text-chapa-gold" />
                            <span className={`text-sm font-body ${
                              isDark ? 'text-white/70' : 'text-chapa-medium-gray'
                            }`}>
                              {item.rating} ({item.reviews} {language === 'en' ? 'reviews' : 'மதிப்பீடுகள்'})
                            </span>
                          </div>
                          <Badge variant="secondary" className="rounded-none bg-chapa-light-gray text-chapa-charcoal font-body">
                            {item.category}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-sm font-body text-chapa-medium-gray">
                            <Clock className="w-4 h-4" />
                            {item.prepTime} {language === 'en' ? 'min' : 'நிமிடங்கள்'}
                          </div>
                          
                          <Button
                            onClick={() => addToCart(item.id)}
                            className="btn-chapa-primary"
                            size="sm"
                          >
                            <Plus className="w-4 h-4 mr-1" />
                            {language === 'en' ? 'Add' : 'சேர்க்கவும்'}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </motion.div>

        {/* CTA Section */}
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
              {language === 'en' ? 'Ready to Order?' : 'ஆர்டர் செய்ய தயாரா?'}
            </h3>
            <p className={`text-lg mb-8 max-w-2xl mx-auto font-body ${
              isDark ? 'text-white/80' : 'text-chapa-medium-gray'
            }`}>
              {language === 'en' 
                ? 'Customize your menu selection and let us create the perfect dining experience for your event.'
                : 'உங்கள் மெனு தேர்வை தனிப்பயனாக்கி, உங்கள் நிகழ்வுக்கான சரியான உணவு அனுபவத்தை உருவாக்க உதவட்டும்.'
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button className="btn-chapa-primary text-lg px-8 py-4">
                <ChefHat className="w-5 h-5 mr-2" />
                {language === 'en' ? 'Customize Menu' : 'மெனுவை தனிப்பயனாக்குங்கள்'}
              </Button>
              <Button variant="outline" className="btn-chapa-secondary text-lg px-8 py-4">
                <Heart className="w-5 h-5 mr-2" />
                {language === 'en' ? 'Get Quote' : 'விலை கேள்வி'}
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default EnhancedMenuSelection;
