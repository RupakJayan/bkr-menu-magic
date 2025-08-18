import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Checkbox } from './ui/checkbox';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  ChefHat, 
  Star, 
  Heart, 
  Users, 
  Clock,
  Plus,
  Minus,
  Search,
  Filter,
  Award,
  Leaf,
  Utensils,
  CheckCircle,
  X,
  Flame,
  Zap,
  Info,
  Bookmark,
  BookmarkCheck
} from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { menuData } from '../data/menuData';
import { useToast } from '@/hooks/use-toast';

interface MenuSelectionProps {
  language: 'en' | 'ta';
  selectedItems: string[];
  onItemsChange: (items: string[]) => void;
  headCount: number;
  onHeadCountChange: (count: number) => void;
  sessionName?: string;
  sessionTime?: string;
}

type SortOption = 'name' | 'category' | 'vegetarian' | 'popularity';
type FilterOption = 'all' | 'vegetarian' | 'non-vegetarian' | 'spicy' | 'mild';

const MenuSelection: React.FC<MenuSelectionProps> = ({
  language,
  selectedItems,
  onItemsChange,
  headCount,
  onHeadCountChange,
  sessionName,
  sessionTime
}) => {
  const { resolvedTheme } = useTheme();
  const { toast } = useToast();
  const isDark = resolvedTheme === 'dark';
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showVegetarianOnly, setShowVegetarianOnly] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>('name');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'compact'>('grid');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [dietaryPreferences, setDietaryPreferences] = useState<string[]>([]);

  const categories = [
    { id: 'all', name: language === 'en' ? 'All Categories' : 'அனைத்து வகைகளும்', icon: ChefHat },
    { id: 'starters', name: language === 'en' ? 'Starters' : 'தொடக்க உணவுகள்', icon: Star },
    { id: 'main-course', name: language === 'en' ? 'Main Course' : 'முதன்மை உணவு', icon: Heart },
    { id: 'desserts', name: language === 'en' ? 'Desserts' : 'இனிப்புகள்', icon: Award },
    { id: 'beverages', name: language === 'en' ? 'Beverages' : 'பானங்கள்', icon: Clock }
  ];

  const dietaryOptions = [
    { id: 'gluten-free', name: language === 'en' ? 'Gluten Free' : 'குளுடன் இல்லாதது', icon: Leaf },
    { id: 'dairy-free', name: language === 'en' ? 'Dairy Free' : 'பால் பொருட்கள் இல்லாதது', icon: Leaf },
    { id: 'nut-free', name: language === 'en' ? 'Nut Free' : 'கொட்டைகள் இல்லாதது', icon: Leaf },
    { id: 'spicy', name: language === 'en' ? 'Spicy' : 'காரமானது', icon: Flame },
    { id: 'mild', name: language === 'en' ? 'Mild' : 'மெதுவானது', icon: Zap }
  ];

  const handleItemToggle = (itemId: string) => {
    if (selectedItems.includes(itemId)) {
      onItemsChange(selectedItems.filter(id => id !== itemId));
      toast({
        title: language === 'en' ? 'Item Removed' : 'பொருள் நீக்கப்பட்டது',
        description: language === 'en' ? 'Item has been removed from selection' : 'பொருள் தேர்வில் இருந்து நீக்கப்பட்டது',
      });
    } else {
      onItemsChange([...selectedItems, itemId]);
      toast({
        title: language === 'en' ? 'Item Added' : 'பொருள் சேர்க்கப்பட்டது',
        description: language === 'en' ? 'Item has been added to selection' : 'பொருள் தேர்வில் சேர்க்கப்பட்டது',
      });
    }
  };

  const handleHeadCountIncrement = (increment: number) => {
    const newHeadCount = Math.max(1, headCount + increment);
    onHeadCountChange(newHeadCount);
  };

  const toggleCategoryExpansion = (categoryId: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const toggleFavorite = (itemId: string) => {
    setFavorites(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const toggleDietaryPreference = (preference: string) => {
    setDietaryPreferences(prev => 
      prev.includes(preference) 
        ? prev.filter(p => p !== preference)
        : [...prev, preference]
    );
  };

  const getCategoryIcon = (category: string) => {
    if (category.includes('Sweets') || category.includes('Desserts')) return <Star className="w-4 h-4" />;
    if (category.includes('Starters') || category.includes('BBQ')) return <ChefHat className="w-4 h-4" />;
    if (category.includes('Rice') || category.includes('Biryani')) return <Utensils className="w-4 h-4" />;
    if (category.includes('Dosa') || category.includes('Idly')) return <Utensils className="w-4 h-4" />;
    return <Utensils className="w-4 h-4" />;
  };

  const getCategoryColor = (category: string) => {
    if (category.includes('Sweets') || category.includes('Desserts')) return 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200';
    if (category.includes('Starters') || category.includes('BBQ')) return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
    if (category.includes('Rice') || category.includes('Biryani')) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    if (category.includes('Dosa') || category.includes('Idly')) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
  };

  const getSpiceLevel = (itemName: string) => {
    const spicyKeywords = ['chilli', 'spicy', 'hot', 'pepper', 'curry', 'masala'];
    const isSpicy = spicyKeywords.some(keyword => 
      itemName.toLowerCase().includes(keyword)
    );
    return isSpicy ? 'spicy' : 'mild';
  };

  const filteredMenu = useMemo(() => {
    let filtered = Object.entries(menuData).filter(([categoryId]) => 
      selectedCategory === 'all' || categoryId === selectedCategory
    ).map(([categoryId, items]) => ({
      categoryId,
      items: items.filter(item => {
        const matchesSearch = 
          (language === 'en' ? item.name_en : item.name_ta).toLowerCase().includes(searchTerm.toLowerCase()) ||
          categoryId.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesVegetarian = !showVegetarianOnly || item.isVegetarian;
        const matchesDietary = dietaryPreferences.length === 0 || dietaryPreferences.some(pref => {
          if (pref === 'vegetarian') return item.isVegetarian;
          if (pref === 'spicy') return getSpiceLevel(item.name_en) === 'spicy';
          if (pref === 'mild') return getSpiceLevel(item.name_en) === 'mild';
          return true;
        });
        return matchesSearch && matchesVegetarian && matchesDietary;
      })
    })).filter(({ items }) => items.length > 0);

    // Sort items based on selected sort option
    filtered = filtered.map(({ categoryId, items }) => ({
      categoryId,
      items: items.sort((a, b) => {
        switch (sortBy) {
          case 'name':
            return (language === 'en' ? a.name_en : a.name_ta).localeCompare(
              language === 'en' ? b.name_en : b.name_ta
            );
          case 'category':
            return a.category.localeCompare(b.category);
          case 'vegetarian':
            return (b.isVegetarian ? 1 : 0) - (a.isVegetarian ? 1 : 0);
          case 'popularity':
            return favorites.includes(b.id) ? 1 : -1;
          default:
            return 0;
        }
      })
    }));

    return filtered;
  }, [searchTerm, selectedCategory, showVegetarianOnly, dietaryPreferences, sortBy, favorites, language]);

  const selectedItemsDetails = useMemo(() => {
    return selectedItems.map(id => {
      for (const category in menuData) {
        const item = menuData[category].find(item => item.id === id);
        if (item) {
          return { ...item, category };
        }
      }
      return null;
    }).filter(Boolean);
  }, [selectedItems]);

  const totalItems = selectedItems.length;
  const totalCalories = selectedItemsDetails.reduce((total, item) => total + (item?.calories || 0), 0);
  const vegetarianCount = selectedItemsDetails.filter(item => item?.isVegetarian).length;

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'} py-8`}>
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full px-6 py-3 mb-6 shadow-lg"
          >
            <ChefHat className="w-5 h-5" />
            <span className="font-medium text-sm">
              {language === 'en' ? 'Menu Selection' : 'மெனு தேர்வு'}
            </span>
          </motion.div>
          
          <h1 className={`text-4xl md:text-6xl font-bold mb-8 leading-tight ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            {language === 'en' ? 'Choose Your Menu' : 'உங்கள் மெனுவைத் தேர்ந்தெடுக்கவும்'}
          </h1>
          
          {sessionName && (
            <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-full ${
              isDark ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-700'
            } shadow-md mb-4`}>
              <Clock className="w-4 h-4" />
              <span className="font-medium">
                {language === 'en' ? sessionName : sessionName}
              </span>
              {sessionTime && (
                <span className="text-sm opacity-75">
                  {sessionTime}
                </span>
              )}
            </div>
          )}
          
          <p className={`text-lg max-w-3xl mx-auto leading-relaxed ${
            isDark ? 'text-gray-300' : 'text-gray-600'
          }`}>
            {language === 'en' 
              ? 'Select from our extensive menu of authentic South Indian dishes. Customize your selection based on your preferences and guest count.'
              : 'அசல் தென்னிந்திய உணவுகளின் எங்கள் விரிவான மெனுவில் இருந்து தேர்ந்தெடுக்கவும். உங்கள் விருப்பங்கள் மற்றும் விருந்தினர்களின் எண்ணிக்கையைப் பொறுத்து உங்கள் தேர்வைத் தனிப்பயனாக்குங்கள்.'
            }
          </p>
        </motion.div>

        {/* Head Count and Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-8"
        >
          <Card className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-lg`}>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className={`text-2xl font-semibold ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  {language === 'en' ? 'Event Details' : 'நிகழ்வு விவரங்கள்'}
                </CardTitle>
                <p className={`${
                  isDark ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {language === 'en' ? 'Set your guest count and review selections' : 'உங்கள் விருந்தினர்களின் எண்ணிக்கையை அமைத்து தேர்வுகளை மதிப்பாய்வு செய்யவும்'}
                </p>
              </div>
              <div className="text-right">
                <div className={`text-3xl font-bold mb-2 text-purple-600`}>
                  {totalItems}
                </div>
                <div className={`text-sm ${
                  isDark ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {language === 'en' ? 'Items Selected' : 'தேர்ந்தெடுக்கப்பட்ட பொருட்கள்'}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <Label className={`block text-sm font-medium mb-2 ${
                    isDark ? 'text-gray-200' : 'text-gray-700'
                  }`}>
                    {language === 'en' ? 'Number of Guests' : 'விருந்தினர்களின் எண்ணிக்கை'}
                  </Label>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleHeadCountIncrement(-1)}
                      className="w-10 h-10 p-0"
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <div className={`w-20 text-center text-lg font-semibold ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>
                      {headCount}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleHeadCountIncrement(1)}
                      className="w-10 h-10 p-0"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="vegetarian"
                    checked={showVegetarianOnly}
                    onCheckedChange={(checked) => setShowVegetarianOnly(checked as boolean)}
                  />
                  <Label htmlFor="vegetarian" className={`text-sm ${
                    isDark ? 'text-gray-200' : 'text-gray-700'
                  }`}>
                    <Leaf className="w-4 h-4 inline mr-2 text-green-500" />
                    {language === 'en' ? 'Vegetarian Only' : 'சைவம் மட்டும்'}
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                    className="flex items-center gap-2"
                  >
                    <Filter className="w-4 h-4" />
                    {language === 'en' ? 'Advanced' : 'மேம்பட்டது'}
                  </Button>
                </div>
              </div>

              {/* Advanced Filters */}
              <AnimatePresence>
                {showAdvancedFilters && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-600"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className={`text-sm font-medium mb-2 ${
                          isDark ? 'text-gray-200' : 'text-gray-700'
                        }`}>
                          {language === 'en' ? 'Sort By' : 'வரிசைப்படுத்து'}
                        </Label>
                        <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="name">{language === 'en' ? 'Name' : 'பெயர்'}</SelectItem>
                            <SelectItem value="category">{language === 'en' ? 'Category' : 'வகை'}</SelectItem>
                            <SelectItem value="vegetarian">{language === 'en' ? 'Vegetarian' : 'சைவம்'}</SelectItem>
                            <SelectItem value="popularity">{language === 'en' ? 'Popularity' : 'பிரபலம்'}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label className={`text-sm font-medium mb-2 ${
                          isDark ? 'text-gray-200' : 'text-gray-700'
                        }`}>
                          {language === 'en' ? 'Dietary Preferences' : 'உணவு விருப்பங்கள்'}
                        </Label>
                        <div className="flex flex-wrap gap-2">
                          {dietaryOptions.map((option) => (
                            <Button
                              key={option.id}
                              variant={dietaryPreferences.includes(option.id) ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => toggleDietaryPreference(option.id)}
                              className="text-xs"
                            >
                              <option.icon className="w-3 h-3 mr-1" />
                              {option.name}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-8"
        >
          <Card className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-lg`}>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder={language === 'en' ? 'Search menu items...' : 'மெனு பொருட்களைத் தேடுங்கள்...'}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`pl-10 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                  />
                </div>
                
                <div className="flex gap-2">
                  {categories.map((category) => (
                    <Button
                      key={category.id}
                      variant={selectedCategory === category.id ? "default" : "outline"}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`${isDark ? 'border-gray-600' : 'border-gray-300'}`}
                    >
                      <category.icon className="w-4 h-4 mr-2" />
                      {category.name}
                    </Button>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as 'grid' | 'list' | 'compact')}>
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="grid" className="text-xs">
                        {language === 'en' ? 'Grid' : 'கட்டம்'}
                      </TabsTrigger>
                      <TabsTrigger value="list" className="text-xs">
                        {language === 'en' ? 'List' : 'பட்டியல்'}
                      </TabsTrigger>
                      <TabsTrigger value="compact" className="text-xs">
                        {language === 'en' ? 'Compact' : 'சுருக்கம்'}
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Menu Items Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {/* Available Items */}
          <Card className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-lg`}>
            <CardHeader>
              <CardTitle className={`text-xl font-semibold ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                {language === 'en' ? 'Available Items' : 'கிடைக்கக்கூடிய பொருட்கள்'}
              </CardTitle>
              <p className={`text-sm ${
                isDark ? 'text-gray-300' : 'text-gray-600'
              }`}>
                {language === 'en' 
                  ? `Showing ${filteredMenu.reduce((total, cat) => total + cat.items.length, 0)} items`
                  : `${filteredMenu.reduce((total, cat) => total + cat.items.length, 0)} பொருட்கள் காட்டப்படுகின்றன`
                }
              </p>
            </CardHeader>
            <CardContent className="p-0">
              <div className="max-h-96 overflow-y-auto">
                <div className="p-4 space-y-4">
                  {filteredMenu.map(({ categoryId, items }) => (
                    <div key={categoryId} className="space-y-3">
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(categoryId)}
                        <span className={`font-semibold ${
                          isDark ? 'text-white' : 'text-gray-900'
                        }`}>
                          {categoryId}
                        </span>
                        <Badge className={getCategoryColor(categoryId)}>
                          {items.length}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleCategoryExpansion(categoryId)}
                          className="ml-auto"
                        >
                          {expandedCategories.includes(categoryId) ? '−' : '+'}
                        </Button>
                      </div>
                      
                      {expandedCategories.includes(categoryId) && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="space-y-2 ml-4"
                        >
                          {items.map(item => (
                            <motion.div
                              key={item.id}
                              className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all ${
                                selectedItems.includes(item.id)
                                  ? isDark 
                                    ? 'bg-purple-900/20 border border-purple-500/50' 
                                    : 'bg-purple-50 border border-purple-300'
                                    : isDark 
                                      ? 'hover:bg-white/5' 
                                      : 'hover:bg-gray-50'
                              }`}
                              onClick={() => handleItemToggle(item.id)}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <div className="flex items-center gap-3">
                                <Checkbox
                                  checked={selectedItems.includes(item.id)}
                                  onChange={() => handleItemToggle(item.id)}
                                />
                                <div>
                                  <div className={`font-medium ${
                                    isDark ? 'text-white' : 'text-gray-900'
                                  }`}>
                                    {language === 'en' ? item.name_en : item.name_ta}
                                  </div>
                                  <div className={`text-xs ${
                                    isDark ? 'text-gray-400' : 'text-gray-500'
                                  }`}>
                                    {language === 'en' ? item.name_ta : item.name_en}
                                  </div>
                                  <div className="flex items-center gap-2 mt-1">
                                    {item.isVegetarian && (
                                      <Badge variant="outline" className="text-xs">
                                        <Leaf className="w-3 h-3 mr-1" />
                                        {language === 'en' ? 'Veg' : 'சைவ'}
                                      </Badge>
                                    )}
                                    <Badge variant="outline" className="text-xs">
                                      {getSpiceLevel(item.name_en) === 'spicy' ? (
                                        <Flame className="w-3 h-3 mr-1" />
                                      ) : (
                                        <Zap className="w-3 h-3 mr-1" />
                                      )}
                                      {language === 'en' 
                                        ? (getSpiceLevel(item.name_en) === 'spicy' ? 'Spicy' : 'Mild')
                                        : (getSpiceLevel(item.name_en) === 'spicy' ? 'காரமானது' : 'மெதுவானது')
                                      }
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleFavorite(item.id);
                                  }}
                                  className="p-1 h-6 w-6"
                                >
                                  {favorites.includes(item.id) ? (
                                    <BookmarkCheck className="w-4 h-4 text-yellow-500" />
                                  ) : (
                                    <Bookmark className="w-4 h-4" />
                                  )}
                                </Button>
                              </div>
                            </motion.div>
                          ))}
                        </motion.div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Selected Items */}
          <Card className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-lg`}>
            <CardHeader>
              <CardTitle className={`text-xl font-semibold ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                {language === 'en' ? 'Selected Items' : 'தேர்ந்தெடுக்கப்பட்ட பொருட்கள்'}
              </CardTitle>
              <p className={`text-sm ${
                isDark ? 'text-gray-300' : 'text-gray-600'
              }`}>
                {language === 'en' 
                  ? `${totalItems} items selected`
                  : `${totalItems} பொருட்கள் தேர்ந்தெடுக்கப்பட்டுள்ளன`
                }
              </p>
            </CardHeader>
            <CardContent className="p-0">
              <div className="max-h-96 overflow-y-auto">
                <div className="p-4 space-y-4">
                  {selectedItemsDetails.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="text-4xl mb-2">🍽️</div>
                      <p className={`${
                        isDark ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        {language === 'en' 
                          ? 'No items selected yet'
                          : 'இன்னும் எந்த பொருட்களும் தேர்ந்தெடுக்கப்படவில்லை'
                        }
                      </p>
                      <p className={`text-sm mt-2 ${
                        isDark ? 'text-gray-500' : 'text-gray-400'
                      }`}>
                        {language === 'en' 
                          ? 'Select items from the left panel'
                          : 'இடது பேனலில் இருந்து பொருட்களைத் தேர்ந்தெடுக்கவும்'
                        }
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {Object.entries(
                        selectedItemsDetails.reduce((acc, item) => {
                          if (!acc[item.category]) acc[item.category] = [];
                          acc[item.category].push(item);
                          return acc;
                        }, {} as { [key: string]: typeof selectedItemsDetails })
                      ).map(([category, items]) => (
                        <div key={category} className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Badge className={getCategoryColor(category)}>
                              {category}
                            </Badge>
                            <span className={`text-sm font-medium ${
                              isDark ? 'text-gray-300' : 'text-gray-600'
                            }`}>
                              ({items.length} {language === 'en' ? 'items' : 'பொருட்கள்'})
                            </span>
                          </div>
                          {items.map(item => (
                            <motion.div
                              key={item.id}
                              className={`flex items-center justify-between p-3 rounded-lg ${
                                isDark ? 'bg-gray-700/50' : 'bg-gray-50'
                              }`}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: 20 }}
                            >
                              <div className="flex items-center gap-3">
                                <div className={`w-2 h-2 rounded-full ${
                                  item.isVegetarian ? 'bg-green-500' : 'bg-red-500'
                                }`} />
                                <div>
                                  <div className={`font-medium ${
                                    isDark ? 'text-white' : 'text-gray-900'
                                  }`}>
                                    {language === 'en' ? item.name_en : item.name_ta}
                                  </div>
                                  <div className={`text-xs ${
                                    isDark ? 'text-gray-400' : 'text-gray-500'
                                  }`}>
                                    {language === 'en' ? item.name_ta : item.name_en}
                                  </div>
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleItemToggle(item.id)}
                                className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </motion.div>
                          ))}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Summary */}
        {totalItems > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
            className="mt-8"
          >
            <Card className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-lg`}>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <div className={`text-2xl font-bold text-purple-600`}>
                      {totalItems}
                    </div>
                    <div className={`text-sm ${
                      isDark ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      {language === 'en' ? 'Total Items' : 'மொத்த பொருட்கள்'}
                    </div>
                  </div>
                  <div>
                    <div className={`text-2xl font-bold text-green-600`}>
                      {vegetarianCount}
                    </div>
                    <div className={`text-sm ${
                      isDark ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      {language === 'en' ? 'Vegetarian Items' : 'சைவ பொருட்கள்'}
                    </div>
                  </div>
                  <div>
                    <div className={`text-2xl font-bold text-blue-600`}>
                      {Object.keys(selectedItemsDetails.reduce((acc, item) => {
                        acc[item.category] = true;
                        return acc;
                      }, {} as { [key: string]: boolean })).length}
                    </div>
                    <div className={`text-sm ${
                      isDark ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      {language === 'en' ? 'Categories' : 'வகைகள்'}
                    </div>
                  </div>
                  <div>
                    <div className={`text-2xl font-bold text-orange-600`}>
                      {favorites.length}
                    </div>
                    <div className={`text-sm ${
                      isDark ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      {language === 'en' ? 'Favorites' : 'பிடித்தவை'}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default MenuSelection;
