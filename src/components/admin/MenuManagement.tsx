import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Utensils, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye, 
  Star,
  Clock,
  DollarSign,
  ChefHat,
  Tag
} from 'lucide-react';

interface MenuManagementProps {
  language: 'en' | 'ta';
  isDark: boolean;
}

interface MenuItem {
  id: number;
  name: string;
  nameTamil: string;
  description: string;
  descriptionTamil: string;
  category: string;
  price: number;
  currency: string;
  preparationTime: number;
  isVegetarian: boolean;
  isSpicy: boolean;
  allergens: string[];
  image?: string;
  status: string;
  rating: number;
  orderCount: number;
}

const MenuManagement: React.FC<MenuManagementProps> = ({ language, isDark }) => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [showAddItem, setShowAddItem] = useState(false);
  const [showEditItem, setShowEditItem] = useState(false);
  const [showItemDetails, setShowItemDetails] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Mock menu data
  useEffect(() => {
    const loadMenuItems = async () => {
      setIsLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const mockMenuItems: MenuItem[] = [
          {
            id: 1,
            name: 'Butter Chicken',
            nameTamil: 'வெண்ணெய் கோழி',
            description: 'Tender chicken in rich tomato and butter gravy',
            descriptionTamil: 'சுவையான தக்காளி மற்றும் வெண்ணெய் குழம்பில் மென்மையான கோழி',
            category: 'main-course',
            price: 450,
            currency: '₹',
            preparationTime: 25,
            isVegetarian: false,
            isSpicy: true,
            allergens: ['dairy', 'nuts'],
            image: '/api/menu/butter-chicken.jpg',
            status: 'active',
            rating: 4.8,
            orderCount: 156
          },
          {
            id: 2,
            name: 'Paneer Tikka',
            nameTamil: 'பன்னீர் திக்கா',
            description: 'Grilled cottage cheese with aromatic spices',
            descriptionTamil: 'நறுமண மசாலாக்களுடன் வறுத்த பன்னீர்',
            category: 'appetizer',
            price: 280,
            currency: '₹',
            preparationTime: 20,
            isVegetarian: true,
            isSpicy: true,
            allergens: ['dairy'],
            image: '/api/menu/paneer-tikka.jpg',
            status: 'active',
            rating: 4.6,
            orderCount: 89
          },
          {
            id: 3,
            name: 'Biryani',
            nameTamil: 'பிரியாணி',
            description: 'Fragrant rice with tender meat and aromatic spices',
            descriptionTamil: 'மென்மையான இறைச்சி மற்றும் நறுமண மசாலாக்களுடன் கூடிய மணமுள்ள அரிசி',
            category: 'main-course',
            price: 380,
            currency: '₹',
            preparationTime: 35,
            isVegetarian: false,
            isSpicy: true,
            allergens: ['nuts'],
            image: '/api/menu/biryani.jpg',
            status: 'active',
            rating: 4.9,
            orderCount: 234
          },
          {
            id: 4,
            name: 'Gulab Jamun',
            nameTamil: 'குலாப் ஜாமூன்',
            description: 'Sweet milk solids in sugar syrup',
            descriptionTamil: 'சர்க்கரை சிரப்பில் இனிப்பு பால் பொருட்கள்',
            category: 'dessert',
            price: 120,
            currency: '₹',
            preparationTime: 15,
            isVegetarian: true,
            isSpicy: false,
            allergens: ['dairy', 'nuts'],
            image: '/api/menu/gulab-jamun.jpg',
            status: 'inactive',
            rating: 4.3,
            orderCount: 67
          }
        ];
        setMenuItems(mockMenuItems);
        setFilteredItems(mockMenuItems);
      } catch (error) {
        console.error('Error loading menu items:', error);
        setMenuItems([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadMenuItems();
  }, []);

  // Filter and search menu items
  useEffect(() => {
    let filtered = menuItems;

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(item => item.category === categoryFilter);
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(item => item.status === statusFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.nameTamil.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredItems(filtered);
  }, [menuItems, searchTerm, categoryFilter, statusFilter]);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'appetizer': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'main-course': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'dessert': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'beverage': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'appetizer': return language === 'en' ? 'Appetizer' : 'துவக்க உணவு';
      case 'main-course': return language === 'en' ? 'Main Course' : 'முதன்மை உணவு';
      case 'dessert': return language === 'en' ? 'Dessert' : 'இனிப்பு';
      case 'beverage': return language === 'en' ? 'Beverage' : 'பானம்';
      default: return category;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'inactive': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'draft': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return language === 'en' ? 'Active' : 'செயலில்';
      case 'inactive': return language === 'en' ? 'Inactive' : 'செயலற்ற';
      case 'draft': return language === 'en' ? 'Draft' : 'வரைவு';
      default: return status;
    }
  };

  const handleViewItem = (item: MenuItem) => {
    setSelectedItem(item);
    setShowItemDetails(true);
  };

  const handleEditItem = (item: MenuItem) => {
    setEditingItem({ ...item });
    setShowEditItem(true);
  };

  const handleSaveItem = () => {
    if (editingItem) {
      setMenuItems(menuItems.map(i => i.id === editingItem.id ? editingItem : i));
      setShowEditItem(false);
      setEditingItem(null);
    }
  };

  const handleCancelEdit = () => {
    setShowEditItem(false);
    setEditingItem(null);
  };

  const handleDeleteItem = (item: MenuItem) => {
    if (confirm(language === 'en' ? 'Are you sure you want to delete this menu item?' : 'இந்த மெனு பொருளை நீக்க விரும்புகிறீர்களா?')) {
      setMenuItems(menuItems.filter(i => i.id !== item.id));
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setCategoryFilter('all');
    setStatusFilter('all');
  };

  if (isLoading) {
    return (
      <Card className="card-chapa rounded-none shadow-subtle">
        <CardContent className="p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-chapa-gold mx-auto mb-4"></div>
            <p className={isDark ? 'text-white/60' : 'text-chapa-medium-gray'}>
              {language === 'en' ? 'Loading menu items...' : 'மெனு பொருட்களை ஏற்றுகிறது...'}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="card-chapa rounded-none shadow-subtle">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className={`text-xl font-display font-semibold ${
              isDark ? 'text-white' : 'text-chapa-charcoal'
            }`}>
              {language === 'en' ? 'Menu Management' : 'மெனு நிர்வாகம்'}
            </CardTitle>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="btn-chapa-secondary"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="w-4 h-4 mr-2" />
                {language === 'en' ? 'Filters' : 'வடிப்பான்கள்'}
              </Button>
              <Button 
                className="btn-chapa-primary"
                size="sm"
                onClick={() => setShowAddItem(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                {language === 'en' ? 'Add Item' : 'பொருளைச் சேர்'}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search and Filters */}
          <div className="space-y-4 mb-6">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder={language === 'en' ? 'Search menu items...' : 'மெனு பொருட்களைத் தேடுங்கள்...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filters */}
            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-chapa-light-gray rounded-none">
                <div>
                  <label className={`text-sm font-medium mb-2 block ${
                    isDark ? 'text-white' : 'text-chapa-charcoal'
                  }`}>
                    {language === 'en' ? 'Category' : 'வகை'}
                  </label>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{language === 'en' ? 'All Categories' : 'அனைத்து வகைகளும்'}</SelectItem>
                      <SelectItem value="appetizer">{language === 'en' ? 'Appetizer' : 'துவக்க உணவு'}</SelectItem>
                      <SelectItem value="main-course">{language === 'en' ? 'Main Course' : 'முதன்மை உணவு'}</SelectItem>
                      <SelectItem value="dessert">{language === 'en' ? 'Dessert' : 'இனிப்பு'}</SelectItem>
                      <SelectItem value="beverage">{language === 'en' ? 'Beverage' : 'பானம்'}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className={`text-sm font-medium mb-2 block ${
                    isDark ? 'text-white' : 'text-chapa-charcoal'
                  }`}>
                    {language === 'en' ? 'Status' : 'நிலை'}
                  </label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{language === 'en' ? 'All Statuses' : 'அனைத்து நிலைகளும்'}</SelectItem>
                      <SelectItem value="active">{language === 'en' ? 'Active' : 'செயலில்'}</SelectItem>
                      <SelectItem value="inactive">{language === 'en' ? 'Inactive' : 'செயலற்ற'}</SelectItem>
                      <SelectItem value="draft">{language === 'en' ? 'Draft' : 'வரைவு'}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button variant="outline" onClick={clearFilters} className="w-full">
                    {language === 'en' ? 'Clear Filters' : 'வடிப்பான்களை அழி'}
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Menu Items Table */}
          {filteredItems.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className={isDark ? 'text-white' : 'text-chapa-charcoal'}>
                      {language === 'en' ? 'Item' : 'பொருள்'}
                    </TableHead>
                    <TableHead className={isDark ? 'text-white' : 'text-chapa-charcoal'}>
                      {language === 'en' ? 'Category' : 'வகை'}
                    </TableHead>
                    <TableHead className={isDark ? 'text-white' : 'text-chapa-charcoal'}>
                      {language === 'en' ? 'Price' : 'விலை'}
                    </TableHead>
                    <TableHead className={isDark ? 'text-white' : 'text-chapa-charcoal'}>
                      {language === 'en' ? 'Details' : 'விவரங்கள்'}
                    </TableHead>
                    <TableHead className={isDark ? 'text-white' : 'text-chapa-charcoal'}>
                      {language === 'en' ? 'Performance' : 'செயல்திறன்'}
                    </TableHead>
                    <TableHead className={isDark ? 'text-white' : 'text-chapa-charcoal'}>
                      {language === 'en' ? 'Actions' : 'செயல்கள்'}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-chapa-light-gray rounded-none flex items-center justify-center">
                            <Utensils className="w-6 h-6 text-chapa-medium-gray" />
                          </div>
                          <div>
                            <div className={`font-medium ${
                              isDark ? 'text-white' : 'text-chapa-charcoal'
                            }`}>
                              {language === 'en' ? item.name : item.nameTamil}
                            </div>
                            <div className={`text-sm ${
                              isDark ? 'text-white/60' : 'text-chapa-medium-gray'
                            }`}>
                              {language === 'en' ? item.description : item.descriptionTamil}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={`text-xs ${getCategoryColor(item.category)}`}>
                          {getCategoryLabel(item.category)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className={`font-medium ${
                          isDark ? 'text-white' : 'text-chapa-charcoal'
                        }`}>
                          {item.currency}{item.price}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <Clock className="w-3 h-3 text-gray-500" />
                            <span className={`text-xs ${
                              isDark ? 'text-white/60' : 'text-chapa-medium-gray'
                            }`}>
                              {item.preparationTime} {language === 'en' ? 'min' : 'நிமிடங்கள்'}
                            </span>
                          </div>
                          <div className="flex space-x-1">
                            {item.isVegetarian && (
                              <Badge variant="outline" className="text-xs bg-green-50 text-green-700">
                                {language === 'en' ? 'Veg' : 'சைவ'}
                              </Badge>
                            )}
                            {item.isSpicy && (
                              <Badge variant="outline" className="text-xs bg-red-50 text-red-700">
                                {language === 'en' ? 'Spicy' : 'காரம்'}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center space-x-1">
                            <Star className="w-3 h-3 text-yellow-500" />
                            <span className={`text-sm ${
                              isDark ? 'text-white/80' : 'text-chapa-charcoal'
                            }`}>
                              {item.rating}/5.0
                            </span>
                          </div>
                          <div className={`text-xs ${
                            isDark ? 'text-white/60' : 'text-chapa-medium-gray'
                          }`}>
                            {item.orderCount} {language === 'en' ? 'orders' : 'ஆர்டர்கள்'}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewItem(item)}
                            className="h-8 w-8 p-0"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditItem(item)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteItem(item)}
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12">
              <Utensils className="w-16 h-16 mx-auto mb-4 text-chapa-medium-gray" />
              <h3 className={`text-lg font-display font-medium mb-2 ${
                isDark ? 'text-white' : 'text-chapa-charcoal'
              }`}>
                {language === 'en' ? 'No menu items found' : 'மெனு பொருட்கள் எதுவும் கிடைக்கவில்லை'}
              </h3>
              <p className={`font-body ${
                isDark ? 'text-white/60' : 'text-chapa-medium-gray'
              }`}>
                {language === 'en' 
                  ? 'Try adjusting your search or filters'
                  : 'உங்கள் தேடல் அல்லது வடிப்பான்களை சரிசெய்ய முயற்சிக்கவும்'
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Item Details Modal */}
      <Dialog open={showItemDetails} onOpenChange={setShowItemDetails}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className={isDark ? 'text-white' : 'text-chapa-charcoal'}>
              {language === 'en' ? 'Menu Item Details' : 'மெனு பொருள் விவரங்கள்'}
            </DialogTitle>
          </DialogHeader>
          {selectedItem && (
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="details">
                  {language === 'en' ? 'Details' : 'விவரங்கள்'}
                </TabsTrigger>
                <TabsTrigger value="pricing">
                  {language === 'en' ? 'Pricing' : 'விலை நிர்ணயம்'}
                </TabsTrigger>
                <TabsTrigger value="allergens">
                  {language === 'en' ? 'Allergens' : 'ஒவ்வாமை'}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className={isDark ? 'text-white' : 'text-chapa-charcoal'}>
                      {language === 'en' ? 'Name (English)' : 'பெயர் (ஆங்கிலம்)'}
                    </Label>
                    <div className={`p-2 bg-chapa-light-gray rounded-none ${
                      isDark ? 'text-white' : 'text-chapa-charcoal'
                    }`}>
                      {selectedItem.name}
                    </div>
                  </div>
                  <div>
                    <Label className={isDark ? 'text-white' : 'text-chapa-charcoal'}>
                      {language === 'en' ? 'Name (Tamil)' : 'பெயர் (தமிழ்)'}
                    </Label>
                    <div className={`p-2 bg-chapa-light-gray rounded-none ${
                      isDark ? 'text-white' : 'text-chapa-charcoal'
                    }`}>
                      {selectedItem.nameTamil}
                    </div>
                  </div>
                </div>
                <div>
                  <Label className={isDark ? 'text-white' : 'text-chapa-charcoal'}>
                    {language === 'en' ? 'Description (English)' : 'விளக்கம் (ஆங்கிலம்)'}
                  </Label>
                  <div className={`p-2 bg-chapa-light-gray rounded-none ${
                    isDark ? 'text-white' : 'text-chapa-charcoal'
                  }`}>
                    {selectedItem.description}
                  </div>
                </div>
                <div>
                  <Label className={isDark ? 'text-white' : 'text-chapa-charcoal'}>
                    {language === 'en' ? 'Description (Tamil)' : 'விளக்கம் (தமிழ்)'}
                  </Label>
                  <div className={`p-2 bg-chapa-light-gray rounded-none ${
                    isDark ? 'text-white' : 'text-chapa-charcoal'
                  }`}>
                    {selectedItem.descriptionTamil}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="pricing" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label className={isDark ? 'text-white' : 'text-chapa-charcoal'}>
                      {language === 'en' ? 'Price' : 'விலை'}
                    </Label>
                    <div className={`p-2 bg-chapa-light-gray rounded-none ${
                      isDark ? 'text-white' : 'text-chapa-charcoal'
                    }`}>
                      {selectedItem.currency}{selectedItem.price}
                    </div>
                  </div>
                  <div>
                    <Label className={isDark ? 'text-white' : 'text-chapa-charcoal'}>
                      {language === 'en' ? 'Preparation Time' : 'தயாரிப்பு நேரம்'}
                    </Label>
                    <div className={`p-2 bg-chapa-light-gray rounded-none ${
                      isDark ? 'text-white' : 'text-chapa-charcoal'
                    }`}>
                      {selectedItem.preparationTime} {language === 'en' ? 'minutes' : 'நிமிடங்கள்'}
                    </div>
                  </div>
                  <div>
                    <Label className={isDark ? 'text-white' : 'text-chapa-charcoal'}>
                      {language === 'en' ? 'Category' : 'வகை'}
                    </Label>
                    <div className={`p-2 bg-chapa-light-gray rounded-none ${
                      isDark ? 'text-white' : 'text-chapa-charcoal'
                    }`}>
                      {getCategoryLabel(selectedItem.category)}
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Badge variant={selectedItem.isVegetarian ? "default" : "secondary"}>
                    {selectedItem.isVegetarian ? (language === 'en' ? 'Vegetarian' : 'சைவ') : (language === 'en' ? 'Non-Vegetarian' : 'மாமிச')}
                  </Badge>
                  <Badge variant={selectedItem.isSpicy ? "default" : "secondary"}>
                    {selectedItem.isSpicy ? (language === 'en' ? 'Spicy' : 'காரம்') : (language === 'en' ? 'Mild' : 'மென்மையான')}
                  </Badge>
                </div>
              </TabsContent>

              <TabsContent value="allergens" className="space-y-4">
                <div>
                  <Label className={isDark ? 'text-white' : 'text-chapa-charcoal'}>
                    {language === 'en' ? 'Allergens' : 'ஒவ்வாமை'}
                  </Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedItem.allergens.map((allergen, index) => (
                      <Badge key={index} variant="outline" className="text-xs bg-red-50 text-red-700">
                        {allergen}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <Label className={isDark ? 'text-white' : 'text-chapa-charcoal'}>
                    {language === 'en' ? 'Performance' : 'செயல்திறன்'}
                  </Label>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div className="p-2 bg-chapa-light-gray rounded-none">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span className={`font-medium ${
                          isDark ? 'text-white' : 'text-chapa-charcoal'
                        }`}>
                          {selectedItem.rating}/5.0
                        </span>
                      </div>
                    </div>
                    <div className="p-2 bg-chapa-light-gray rounded-none">
                      <div className="flex items-center space-x-1">
                        <ChefHat className="w-4 h-4 text-blue-500" />
                        <span className={`font-medium ${
                          isDark ? 'text-white' : 'text-chapa-charcoal'
                        }`}>
                          {selectedItem.orderCount} {language === 'en' ? 'orders' : 'ஆர்டர்கள்'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Item Modal */}
      <Dialog open={showAddItem} onOpenChange={setShowAddItem}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className={isDark ? 'text-white' : 'text-chapa-charcoal'}>
              {language === 'en' ? 'Add New Menu Item' : 'புதிய மெனு பொருளைச் சேர்'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name" className={isDark ? 'text-white' : 'text-chapa-charcoal'}>
                  {language === 'en' ? 'Name (English)' : 'பெயர் (ஆங்கிலம்)'}
                </Label>
                <Input id="name" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="nameTamil" className={isDark ? 'text-white' : 'text-chapa-charcoal'}>
                  {language === 'en' ? 'Name (Tamil)' : 'பெயர் (தமிழ்)'}
                </Label>
                <Input id="nameTamil" className="mt-1" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category" className={isDark ? 'text-white' : 'text-chapa-charcoal'}>
                  {language === 'en' ? 'Category' : 'வகை'}
                </Label>
                <Select>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder={language === 'en' ? 'Select category' : 'வகையைத் தேர்ந்தெடுக்கவும்'} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="appetizer">{language === 'en' ? 'Appetizer' : 'துவக்க உணவு'}</SelectItem>
                    <SelectItem value="main-course">{language === 'en' ? 'Main Course' : 'முதன்மை உணவு'}</SelectItem>
                    <SelectItem value="dessert">{language === 'en' ? 'Dessert' : 'இனிப்பு'}</SelectItem>
                    <SelectItem value="beverage">{language === 'en' ? 'Beverage' : 'பானம்'}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="price" className={isDark ? 'text-white' : 'text-chapa-charcoal'}>
                  {language === 'en' ? 'Price' : 'விலை'}
                </Label>
                <Input id="price" type="number" className="mt-1" />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowAddItem(false)}>
                {language === 'en' ? 'Cancel' : 'ரத்து'}
              </Button>
              <Button className="btn-chapa-primary">
                {language === 'en' ? 'Add Item' : 'பொருளைச் சேர்'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Item Modal */}
      <Dialog open={showEditItem} onOpenChange={setShowEditItem}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className={isDark ? 'text-white' : 'text-chapa-charcoal'}>
              {language === 'en' ? 'Edit Menu Item' : 'மெனு பொருளைத் திருத்து'}
            </DialogTitle>
          </DialogHeader>
          {editingItem && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="editName" className={isDark ? 'text-white' : 'text-chapa-charcoal'}>
                    {language === 'en' ? 'Name (English)' : 'பெயர் (ஆங்கிலம்)'}
                  </Label>
                  <Input 
                    id="editName" 
                    value={editingItem.nameEn} 
                    onChange={(e) => setEditingItem({ ...editingItem, nameEn: e.target.value })}
                    className="mt-1" 
                  />
                </div>
                <div>
                  <Label htmlFor="editNameTamil" className={isDark ? 'text-white' : 'text-chapa-charcoal'}>
                    {language === 'en' ? 'Name (Tamil)' : 'பெயர் (தமிழ்)'}
                  </Label>
                  <Input 
                    id="editNameTamil" 
                    value={editingItem.nameTa} 
                    onChange={(e) => setEditingItem({ ...editingItem, nameTa: e.target.value })}
                    className="mt-1" 
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="editCategory" className={isDark ? 'text-white' : 'text-chapa-charcoal'}>
                    {language === 'en' ? 'Category' : 'வகை'}
                  </Label>
                  <Select value={editingItem.category} onValueChange={(value) => setEditingItem({ ...editingItem, category: value })}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="appetizer">{language === 'en' ? 'Appetizer' : 'துவக்க உணவு'}</SelectItem>
                      <SelectItem value="main-course">{language === 'en' ? 'Main Course' : 'முதன்மை உணவு'}</SelectItem>
                      <SelectItem value="dessert">{language === 'en' ? 'Dessert' : 'இனிப்பு'}</SelectItem>
                      <SelectItem value="beverage">{language === 'en' ? 'Beverage' : 'பானம்'}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="editPrice" className={isDark ? 'text-white' : 'text-chapa-charcoal'}>
                    {language === 'en' ? 'Price' : 'விலை'}
                  </Label>
                  <Input 
                    id="editPrice" 
                    type="number" 
                    value={editingItem.price} 
                    onChange={(e) => setEditingItem({ ...editingItem, price: parseFloat(e.target.value) || 0 })}
                    className="mt-1" 
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="editPrepTime" className={isDark ? 'text-white' : 'text-chapa-charcoal'}>
                    {language === 'en' ? 'Preparation Time (mins)' : 'தயாரிப்பு நேரம் (நிமிடங்கள்)'}
                  </Label>
                  <Input 
                    id="editPrepTime" 
                    type="number" 
                    value={editingItem.prepTime} 
                    onChange={(e) => setEditingItem({ ...editingItem, prepTime: parseInt(e.target.value) || 0 })}
                    className="mt-1" 
                  />
                </div>
                <div>
                  <Label htmlFor="editStatus" className={isDark ? 'text-white' : 'text-chapa-charcoal'}>
                    {language === 'en' ? 'Status' : 'நிலை'}
                  </Label>
                  <Select value={editingItem.status} onValueChange={(value) => setEditingItem({ ...editingItem, status: value })}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">{language === 'en' ? 'Active' : 'செயலில்'}</SelectItem>
                      <SelectItem value="inactive">{language === 'en' ? 'Inactive' : 'செயலற்ற'}</SelectItem>
                      <SelectItem value="draft">{language === 'en' ? 'Draft' : 'வரைவு'}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="editDietary" className={isDark ? 'text-white' : 'text-chapa-charcoal'}>
                    {language === 'en' ? 'Dietary Preference' : 'உணவு விருப்பம்'}
                  </Label>
                  <Select value={editingItem.dietary} onValueChange={(value) => setEditingItem({ ...editingItem, dietary: value })}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vegetarian">{language === 'en' ? 'Vegetarian' : 'சைவம்'}</SelectItem>
                      <SelectItem value="non-vegetarian">{language === 'en' ? 'Non-Vegetarian' : 'சைவம் அல்லாதது'}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="editSpiceLevel" className={isDark ? 'text-white' : 'text-chapa-charcoal'}>
                    {language === 'en' ? 'Spice Level' : 'மசாலா நிலை'}
                  </Label>
                  <Select value={editingItem.spiceLevel} onValueChange={(value) => setEditingItem({ ...editingItem, spiceLevel: value })}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mild">{language === 'en' ? 'Mild' : 'மென்மையான'}</SelectItem>
                      <SelectItem value="medium">{language === 'en' ? 'Medium' : 'நடுத்தர'}</SelectItem>
                      <SelectItem value="spicy">{language === 'en' ? 'Spicy' : 'காரமான'}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="editDescription" className={isDark ? 'text-white' : 'text-chapa-charcoal'}>
                  {language === 'en' ? 'Description (English)' : 'விளக்கம் (ஆங்கிலம்)'}
                </Label>
                <Textarea 
                  id="editDescription" 
                  value={editingItem.descriptionEn || ''} 
                  onChange={(e) => setEditingItem({ ...editingItem, descriptionEn: e.target.value })}
                  className="mt-1" 
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="editDescriptionTamil" className={isDark ? 'text-white' : 'text-chapa-charcoal'}>
                  {language === 'en' ? 'Description (Tamil)' : 'விளக்கம் (தமிழ்)'}
                </Label>
                <Textarea 
                  id="editDescriptionTamil" 
                  value={editingItem.descriptionTa || ''} 
                  onChange={(e) => setEditingItem({ ...editingItem, descriptionTa: e.target.value })}
                  className="mt-1" 
                  rows={3}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={handleCancelEdit} className="btn-chapa-secondary">
                  {language === 'en' ? 'Cancel' : 'ரத்து'}
                </Button>
                <Button onClick={handleSaveItem} className="btn-chapa-primary">
                  {language === 'en' ? 'Save Changes' : 'மாற்றங்களை சேமி'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MenuManagement;
