import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Checkbox } from './ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
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
  CheckCircle,
  Leaf,
  Utensils,
  DollarSign,
  Eye,
  Bookmark,
  Share2,
  Download,
  Filter as FilterIcon,
  X,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { menuData, mealCategories } from '../data/menuData';

interface MenuSelectionMicroserviceProps {
  language: 'en' | 'ta';
  onMenuSelection?: (selectedItems: any[]) => void;
  initialSelection?: any[];
  showPricing?: boolean;
  allowMultiple?: boolean;
  maxItems?: number;
}

const MenuSelectionMicroservice: React.FC<MenuSelectionMicroserviceProps> = ({
  language,
  onMenuSelection,
  initialSelection = [],
  showPricing = true,
  allowMultiple = true,
  maxItems = 50
}) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  
  // State management
  const [selectedItems, setSelectedItems] = useState<{[key: string]: number}>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedMealType, setSelectedMealType] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'accordion'>('accordion');
  const [showFilters, setShowFilters] = useState(false);
  const [showVegetarianOnly, setShowVegetarianOnly] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'category' | 'popularity'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [quickAddMode, setQuickAddMode] = useState(false);

  // Initialize with initial selection
  useEffect(() => {
    if (initialSelection.length > 0) {
      const initialItems: {[key: string]: number} = {};
      initialSelection.forEach(item => {
        initialItems[item.id] = item.quantity || 1;
      });
      setSelectedItems(initialItems);
    }
  }, [initialSelection]);

  // Memoized filtered and sorted menu
  const filteredMenu = useMemo(() => {
    let filtered = Object.entries(menuData).filter(([categoryId]) => {
      if (selectedCategory !== 'all' && categoryId !== selectedCategory) return false;
      if (selectedMealType !== 'all') {
        const mealCategoriesList = mealCategories[selectedMealType as keyof typeof mealCategories] || [];
        if (!mealCategoriesList.includes(categoryId)) return false;
      }
      return true;
    }).map(([categoryId, items]) => ({
      categoryId,
      items: items.filter(item => {
        const matchesSearch = 
          (language === 'en' ? item.name_en : item.name_ta).toLowerCase().includes(searchTerm.toLowerCase()) ||
          categoryId.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesVegetarian = !showVegetarianOnly || item.isVegetarian;
        const matchesPrice = item.estimatedCost ? 
          item.estimatedCost >= priceRange[0] && item.estimatedCost <= priceRange[1] : true;
        return matchesSearch && matchesVegetarian && matchesPrice;
      })
    })).filter(({ items }) => items.length > 0);

    // Sort items
    filtered.forEach(category => {
      category.items.sort((a, b) => {
        let comparison = 0;
        switch (sortBy) {
          case 'name':
            comparison = (language === 'en' ? a.name_en : a.name_ta)
              .localeCompare(language === 'en' ? b.name_en : b.name_ta);
            break;
          case 'price':
            comparison = (a.estimatedCost || 0) - (b.estimatedCost || 0);
            break;
          case 'category':
            comparison = a.category.localeCompare(b.category);
            break;
          case 'popularity':
            comparison = (favorites.includes(a.id) ? 1 : 0) - (favorites.includes(b.id) ? 1 : 0);
            break;
        }
        return sortOrder === 'asc' ? comparison : -comparison;
      });
    });

    return filtered;
  }, [selectedCategory, selectedMealType, searchTerm, showVegetarianOnly, priceRange, sortBy, sortOrder, favorites, language]);

  // Cart management
  const addToCart = (itemId: string) => {
    if (!allowMultiple) {
      setSelectedItems({ [itemId]: 1 });
      return;
    }
    
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
          total += (item.estimatedCost || 0) * quantity;
          break;
        }
      }
    });
    return total;
  };

  const getTotalItems = () => {
    return Object.values(selectedItems).reduce((sum, quantity) => sum + quantity, 0);
  };

  const toggleFavorite = (itemId: string) => {
    setFavorites(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleQuickAdd = (itemIds: string[]) => {
    const newItems: {[key: string]: number} = {};
    itemIds.forEach(id => {
      newItems[id] = 1;
    });
    setSelectedItems(prev => ({ ...prev, ...newItems }));
  };

  const exportSelection = () => {
    const data = Object.entries(selectedItems).map(([itemId, quantity]) => {
      for (const category in menuData) {
        const item = menuData[category].find(item => item.id === itemId);
        if (item) {
          return {
            id: item.id,
            name: language === 'en' ? item.name_en : item.name_ta,
            category: category,
            quantity,
            price: item.estimatedCost || 0,
            total: (item.estimatedCost || 0) * quantity
          };
        }
      }
      return null;
    }).filter(Boolean);

    const csv = [
      ['ID', 'Name', 'Category', 'Quantity', 'Price', 'Total'],
      ...data.map(item => [item!.id, item!.name, item!.category, item!.quantity, item!.price, item!.total])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `menu-selection-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const clearSelection = () => {
    setSelectedItems({});
  };

  // Notify parent component of selection changes
  useEffect(() => {
    if (onMenuSelection) {
      const selection = Object.entries(selectedItems).map(([itemId, quantity]) => {
        for (const category in menuData) {
          const item = menuData[category].find(item => item.id === itemId);
          if (item) {
            return {
              id: item.id,
              name_en: item.name_en,
              name_ta: item.name_ta,
              category: category,
              isVegetarian: item.isVegetarian,
              estimatedCost: item.estimatedCost,
              quantity
            };
          }
        }
        return null;
      }).filter(Boolean);
      
      onMenuSelection(selection);
    }
  }, [selectedItems, onMenuSelection]);

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
          <h1 className={`text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {language === 'en' ? 'Menu Selection' : 'மெனு தேர்வு'}
          </h1>
          <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'} mb-6`}>
            {language === 'en' 
              ? 'Select your preferred menu items for the event'
              : 'நிகழ்வுக்கான உங்கள் விருப்பமான மெனு பொருட்களைத் தேர்ந்தெடுக்கவும்'
            }
          </p>
        </motion.div>

        {/* Search and Filters Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-6"
        >
          <Card className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-lg`}>
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Search and Quick Actions */}
                <div className="flex flex-col md:flex-row gap-4 items-center">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      placeholder={language === 'en' ? 'Search menu items...' : 'மெனு பொருட்களைத் தேடுங்கள்...'}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className={`pl-10 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setShowFilters(!showFilters)}
                      className="flex items-center gap-2"
                    >
                      <FilterIcon className="w-4 h-4" />
                      {language === 'en' ? 'Filters' : 'வடிப்பான்கள்'}
                    </Button>
                    
                    <Button
                      variant="outline"
                      onClick={() => setQuickAddMode(!quickAddMode)}
                      className="flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      {language === 'en' ? 'Quick Add' : 'விரைவு சேர்க்கவும்'}
                    </Button>
                    
                    <Button
                      variant="outline"
                      onClick={exportSelection}
                      className="flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      {language === 'en' ? 'Export' : 'ஏற்றுமதி'}
                    </Button>
                  </div>
                </div>

                {/* Filters Panel */}
                {showFilters && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="pt-4 border-t border-gray-200 dark:border-gray-600"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {/* Category Filter */}
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                          {language === 'en' ? 'Category' : 'வகை'}
                        </label>
                        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                          <SelectTrigger className={isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}>
                            <SelectValue placeholder={language === 'en' ? 'All Categories' : 'அனைத்து வகைகளும்'} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">{language === 'en' ? 'All Categories' : 'அனைத்து வகைகளும்'}</SelectItem>
                            {Object.keys(menuData).map(category => (
                              <SelectItem key={category} value={category}>{category}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Meal Type Filter */}
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                          {language === 'en' ? 'Meal Type' : 'உணவு வகை'}
                        </label>
                        <Select value={selectedMealType} onValueChange={setSelectedMealType}>
                          <SelectTrigger className={isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}>
                            <SelectValue placeholder={language === 'en' ? 'All Meals' : 'அனைத்து உணவுகளும்'} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">{language === 'en' ? 'All Meals' : 'அனைத்து உணவுகளும்'}</SelectItem>
                            {Object.keys(mealCategories).map(mealType => (
                              <SelectItem key={mealType} value={mealType}>{mealType}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Price Range */}
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                          {language === 'en' ? 'Price Range' : 'விலை வரம்பு'}
                        </label>
                        <div className="flex gap-2">
                          <Input
                            type="number"
                            placeholder="Min"
                            value={priceRange[0]}
                            onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                            className={`w-20 text-sm ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                          />
                          <span className="text-gray-500">-</span>
                          <Input
                            type="number"
                            placeholder="Max"
                            value={priceRange[1]}
                            onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 500])}
                            className={`w-20 text-sm ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                          />
                        </div>
                      </div>

                      {/* Sort Options */}
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                          {language === 'en' ? 'Sort By' : 'வரிசைப்படுத்து'}
                        </label>
                        <div className="flex gap-2">
                          <Select value={sortBy} onValueChange={(value) => setSortBy(value as any)}>
                            <SelectTrigger className={`w-24 text-xs ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="name">{language === 'en' ? 'Name' : 'பெயர்'}</SelectItem>
                              <SelectItem value="price">{language === 'en' ? 'Price' : 'விலை'}</SelectItem>
                              <SelectItem value="category">{language === 'en' ? 'Category' : 'வகை'}</SelectItem>
                              <SelectItem value="popularity">{language === 'en' ? 'Popular' : 'பிரபலமான'}</SelectItem>
                            </SelectContent>
                          </Select>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                            className="w-8 h-8 p-0"
                          >
                            {sortOrder === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Additional Filters */}
                    <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="vegetarian"
                          checked={showVegetarianOnly}
                          onCheckedChange={(checked) => setShowVegetarianOnly(checked as boolean)}
                        />
                        <label htmlFor="vegetarian" className={`text-sm ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                          <Leaf className="w-4 h-4 inline mr-1 text-green-500" />
                          {language === 'en' ? 'Vegetarian Only' : 'சைவம் மட்டும்'}
                        </label>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Quick Add Templates */}
                {quickAddMode && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="pt-4 border-t border-gray-200 dark:border-gray-600"
                  >
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {[
                        { name: 'South Indian', name_ta: 'தென்னிந்திய', items: ['id1', 'do1', 'br1', 'gr1', 'rb1', 'ra1', 'h1'] },
                        { name: 'North Indian', name_ta: 'வடஇந்திய', items: ['st1', 'br4', 'gr4', 'rb3', 'ra2', 'sd1'] },
                        { name: 'Continental', name_ta: 'கண்டிநென்டல்', items: ['st5', 'so1', 'br2', 'gr6', 'rb2', 'sd3'] },
                        { name: 'Desserts', name_ta: 'இனிப்புகள்', items: ['swl1', 'swc1', 'h1', 'sd1', 'pa1'] }
                      ].map((template) => (
                        <Button
                          key={template.name}
                          variant="outline"
                          className="h-20 flex flex-col items-center justify-center space-y-2 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                          onClick={() => handleQuickAdd(template.items)}
                        >
                          <span className="text-2xl">🍽️</span>
                          <span className="text-xs font-medium">
                            {language === 'en' ? template.name : template.name_ta}
                          </span>
                        </Button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Cart Summary */}
        {getTotalItems() > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <Card className={`${isDark ? 'bg-blue-900/20 border-blue-700' : 'bg-blue-50 border-blue-200'} shadow-lg`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <ShoppingCart className="w-6 h-6 text-blue-600" />
                    <div>
                      <h3 className={`text-lg font-semibold ${isDark ? 'text-blue-300' : 'text-blue-700'}`}>
                        {language === 'en' ? 'Selected Items' : 'தேர்ந்தெடுக்கப்பட்ட பொருட்கள்'}
                      </h3>
                      <p className={`text-sm ${isDark ? 'text-blue-200' : 'text-blue-600'}`}>
                        {getTotalItems()} {language === 'en' ? 'items' : 'பொருட்கள்'} • ₹{getTotalPrice()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => setShowCart(!showCart)}
                      variant="outline"
                      className="border-blue-300 text-blue-700 hover:bg-blue-50"
                    >
                      {showCart ? (language === 'en' ? 'Hide' : 'மறைக்கவும்') : (language === 'en' ? 'View' : 'காண்க')}
                    </Button>
                    
                    <Button 
                      onClick={clearSelection}
                      variant="outline"
                      className="border-red-300 text-red-700 hover:bg-red-50"
                    >
                      <X className="w-4 h-4 mr-2" />
                      {language === 'en' ? 'Clear' : 'அழிக்கவும்'}
                    </Button>
                  </div>
                </div>
                
                {showCart && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 pt-4 border-t border-blue-200 dark:border-blue-700"
                  >
                    <div className="space-y-3">
                      {Object.entries(selectedItems).map(([itemId, quantity]) => {
                        let itemName = '';
                        let itemPrice = 0;
                        let itemCategory = '';
                        
                        for (const category in menuData) {
                          const item = menuData[category].find(item => item.id === itemId);
                          if (item) {
                            itemName = language === 'en' ? item.name_en : item.name_ta;
                            itemPrice = item.estimatedCost || 0;
                            itemCategory = category;
                            break;
                          }
                        }
                        
                        return (
                          <div key={itemId} className="flex items-center justify-between p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                            <div className="flex-1">
                              <div className={`font-medium ${isDark ? 'text-blue-200' : 'text-blue-800'}`}>
                                {itemName}
                              </div>
                              <div className={`text-sm ${isDark ? 'text-blue-300' : 'text-blue-600'}`}>
                                {itemCategory} • ₹{itemPrice} x {quantity}
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className={`font-semibold ${isDark ? 'text-blue-200' : 'text-blue-800'}`}>
                                ₹{itemPrice * quantity}
                              </div>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => removeFromCart(itemId)}
                                  className="w-8 h-8 p-0"
                                >
                                  <Minus className="w-4 h-4" />
                                </Button>
                                <span className={`w-8 text-center font-medium ${isDark ? 'text-blue-200' : 'text-blue-800'}`}>
                                  {quantity}
                                </span>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => addToCart(itemId)}
                                  className="w-8 h-8 p-0"
                                >
                                  <Plus className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      
                      <div className="flex items-center justify-between pt-4 border-t border-blue-200 dark:border-blue-700">
                        <div className={`text-lg font-semibold ${isDark ? 'text-blue-200' : 'text-blue-800'}`}>
                          {language === 'en' ? 'Total' : 'மொத்தம்'}
                        </div>
                        <div className={`text-xl font-bold text-blue-600`}>
                          ₹{getTotalPrice()}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* View Mode Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-6"
        >
          <div className="flex justify-between items-center">
            <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as any)}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="accordion">{language === 'en' ? 'Accordion' : 'அக்கார்டியன்'}</TabsTrigger>
                <TabsTrigger value="grid">{language === 'en' ? 'Grid' : 'கட்டம்'}</TabsTrigger>
                <TabsTrigger value="list">{language === 'en' ? 'List' : 'பட்டியல்'}</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {language === 'en' 
                ? `${filteredMenu.reduce((total, cat) => total + cat.items.length, 0)} items found`
                : `${filteredMenu.reduce((total, cat) => total + cat.items.length, 0)} பொருட்கள் கண்டுபிடிக்கப்பட்டன`
              }
            </div>
          </div>
        </motion.div>

        {/* Menu Items */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="space-y-6"
        >
          {viewMode === 'accordion' && (
            <Accordion type="multiple" className="w-full">
              {filteredMenu.map(({ categoryId, items }) => (
                <AccordionItem key={categoryId} value={categoryId}>
                  <AccordionTrigger className={`${isDark ? 'text-gray-200 hover:text-gray-100' : 'text-gray-700 hover:text-gray-900'}`}>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{categoryId}</span>
                      <Badge variant="secondary" className={isDark ? 'bg-gray-600 text-gray-200' : 'bg-gray-200 text-gray-700'}>
                        {items.length}
                      </Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 p-4">
                      {items.map((item) => {
                        const isSelected = selectedItems[item.id] > 0;
                        const isFavorite = favorites.includes(item.id);
                        
                        return (
                          <motion.div
                            key={item.id}
                            className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-all ${
                              isSelected
                                ? isDark 
                                  ? 'border-blue-500 bg-blue-900/20' 
                                  : 'border-blue-500 bg-blue-50'
                                : isDark 
                                  ? 'border-gray-600 hover:border-gray-500' 
                                  : 'border-gray-200 hover:border-gray-300'
                            }`}
                            onClick={() => addToCart(item.id)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Checkbox
                              checked={isSelected}
                              onChange={() => addToCart(item.id)}
                              className={isDark ? 'text-blue-400' : 'text-blue-600'}
                            />
                            <div className="flex-1 min-w-0">
                              <div className={`font-medium text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                {language === 'en' ? item.name_en : item.name_ta}
                              </div>
                              <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                {language === 'en' ? item.name_ta : item.name_en}
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                {item.isVegetarian && (
                                  <Badge variant="outline" className="text-xs">
                                    <Leaf className="w-3 h-3 mr-1" />
                                    {language === 'en' ? 'Veg' : 'சைவ'}
                                  </Badge>
                                )}
                                {showPricing && item.estimatedCost && (
                                  <Badge variant="outline" className="text-xs text-green-600">
                                    <DollarSign className="w-3 h-3 mr-1" />
                                    ₹{item.estimatedCost}
                                  </Badge>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex flex-col gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleFavorite(item.id);
                                }}
                                className={`w-6 h-6 p-0 ${isFavorite ? 'text-red-500' : 'text-gray-400'}`}
                              >
                                <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                              </Button>
                              
                              {isSelected && (
                                <div className="flex items-center gap-1">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      removeFromCart(item.id);
                                    }}
                                    className="w-6 h-6 p-0"
                                  >
                                    <Minus className="w-3 h-3" />
                                  </Button>
                                  <span className="text-xs font-medium w-6 text-center">
                                    {selectedItems[item.id]}
                                  </span>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      addToCart(item.id);
                                    }}
                                    className="w-6 h-6 p-0"
                                  >
                                    <Plus className="w-3 h-3" />
                                  </Button>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}

          {viewMode === 'grid' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredMenu.flatMap(({ items }) => 
                items.map((item) => {
                  const isSelected = selectedItems[item.id] > 0;
                  const isFavorite = favorites.includes(item.id);
                  
                  return (
                    <motion.div
                      key={item.id}
                      className={`p-4 rounded-lg border cursor-pointer transition-all ${
                        isSelected
                          ? isDark 
                            ? 'border-blue-500 bg-blue-900/20' 
                            : 'border-blue-500 bg-blue-50'
                          : isDark 
                            ? 'border-gray-600 hover:border-gray-500' 
                            : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => addToCart(item.id)}
                      whileHover={{ y: -2, scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {language === 'en' ? item.name_en : item.name_ta}
                          </h3>
                          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                            {language === 'en' ? item.name_ta : item.name_en}
                          </p>
                        </div>
                        
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavorite(item.id);
                            }}
                            className={`w-6 h-6 p-0 ${isFavorite ? 'text-red-500' : 'text-gray-400'}`}
                          >
                            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 mb-3">
                        {item.isVegetarian && (
                          <Badge variant="outline" className="text-xs">
                            <Leaf className="w-3 h-3 mr-1" />
                            {language === 'en' ? 'Veg' : 'சைவ'}
                          </Badge>
                        )}
                        {showPricing && item.estimatedCost && (
                          <Badge variant="outline" className="text-xs text-green-600">
                            <DollarSign className="w-3 h-3 mr-1" />
                            ₹{item.estimatedCost}
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Checkbox
                          checked={isSelected}
                          onChange={() => addToCart(item.id)}
                          className={isDark ? 'text-blue-400' : 'text-blue-600'}
                        />
                        
                        {isSelected && (
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeFromCart(item.id);
                              }}
                              className="w-6 h-6 p-0"
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                            <span className="text-sm font-medium w-6 text-center">
                              {selectedItems[item.id]}
                            </span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                addToCart(item.id);
                              }}
                              className="w-6 h-6 p-0"
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          )}

          {viewMode === 'list' && (
            <div className="space-y-2">
              {filteredMenu.flatMap(({ items }) => 
                items.map((item) => {
                  const isSelected = selectedItems[item.id] > 0;
                  const isFavorite = favorites.includes(item.id);
                  
                  return (
                    <motion.div
                      key={item.id}
                      className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-all ${
                        isSelected
                          ? isDark 
                            ? 'border-blue-500 bg-blue-900/20' 
                            : 'border-blue-500 bg-blue-50'
                          : isDark 
                            ? 'border-gray-600 hover:border-gray-500' 
                            : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => addToCart(item.id)}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <Checkbox
                        checked={isSelected}
                        onChange={() => addToCart(item.id)}
                        className={isDark ? 'text-blue-400' : 'text-blue-600'}
                      />
                      
                      <div className="flex-1 min-w-0">
                        <div className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {language === 'en' ? item.name_en : item.name_ta}
                        </div>
                        <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          {language === 'en' ? item.name_ta : item.name_en}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {item.isVegetarian && (
                          <Badge variant="outline" className="text-xs">
                            <Leaf className="w-3 h-3 mr-1" />
                            {language === 'en' ? 'Veg' : 'சைவ'}
                          </Badge>
                        )}
                        {showPricing && item.estimatedCost && (
                          <Badge variant="outline" className="text-xs text-green-600">
                            <DollarSign className="w-3 h-3 mr-1" />
                            ₹{item.estimatedCost}
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(item.id);
                          }}
                          className={`w-6 h-6 p-0 ${isFavorite ? 'text-red-500' : 'text-gray-400'}`}
                        >
                          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                        </Button>
                        
                        {isSelected && (
                          <div className="flex items-center gap-1">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeFromCart(item.id);
                              }}
                              className="w-6 h-6 p-0"
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                            <span className="text-sm font-medium w-6 text-center">
                              {selectedItems[item.id]}
                            </span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                addToCart(item.id);
                              }}
                              className="w-6 h-6 p-0"
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          )}
        </motion.div>

        {/* No Results */}
        {filteredMenu.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <div className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {language === 'en' 
                ? 'No menu items found matching your criteria'
                : 'உங்கள் அளவுகோல்களுடன் பொருந்தும் மெனு பொருட்கள் எதுவும் கிடைக்கவில்லை'
              }
            </div>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setSelectedMealType('all');
                setShowVegetarianOnly(false);
                setPriceRange([0, 500]);
              }}
              className="mt-4"
            >
              {language === 'en' ? 'Clear Filters' : 'வடிப்பான்களை அழிக்கவும்'}
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default MenuSelectionMicroservice;
