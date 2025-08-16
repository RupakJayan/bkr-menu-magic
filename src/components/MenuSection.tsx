import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Filter, Search, Star, ShoppingCart } from "lucide-react";
import { menuData } from "@/data/menuData";

// Comprehensive menu data with bilingual support
const getAllMenuItems = () => {
  const allItems: any[] = [];
  Object.entries(menuData).forEach(([category, items]) => {
    items.forEach(item => {
      allItems.push({
        ...item,
        category: category,
        subCategory: category,
        description: `Delicious ${item.name_en.toLowerCase()} - a traditional South Indian delicacy`,
        tags: ["traditional", "south-indian", item.isVegetarian ? "vegetarian" : "non-vegetarian"],
        rating: 4.5 + Math.random() * 0.5 // Random rating between 4.5-5.0
      });
    });
  });
  return allItems;
};

const menuItems = getAllMenuItems();

// Dynamic categories based on menu data
const categories = ["All", ...Object.keys(menuData)];
const filters = {
  dietary: ["All", "Vegetarian", "Non-Vegetarian"],
  price: ["All", "Under ₹100", "₹100-200", "Above ₹200"]
};

const MenuSection = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedDietary, setSelectedDietary] = useState("All");

  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [language, setLanguage] = useState<'en' | 'ta'>('en');
  const [cart, setCart] = useState<{[key: number]: number}>({});
  const [showCart, setShowCart] = useState(false);

  // Cart management functions
  const addToCart = (itemId: number) => {
    setCart(prev => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1
    }));
  };

  const removeFromCart = (itemId: number) => {
    setCart(prev => {
      const newCart = { ...prev };
      if (newCart[itemId] > 1) {
        newCart[itemId] -= 1;
      } else {
        delete newCart[itemId];
      }
      return newCart;
    });
  };



  const getCartItemCount = () => {
    return Object.values(cart).reduce((total, quantity) => total + quantity, 0);
  };

  // Filter menu items
  const filteredItems = menuItems.filter(item => {
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    const matchesDietary = selectedDietary === "All" || 
      (selectedDietary === "Vegetarian" && item.isVegetarian) ||
      (selectedDietary === "Non-Vegetarian" && !item.isVegetarian);
    const matchesSearch = item.name_en.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.name_ta.includes(searchTerm);

    return matchesCategory && matchesDietary && matchesSearch;
  });

  return (
    <section id="menu" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 animate-slide-up">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            Our <span className="gradient-text">Comprehensive</span> South Indian Menu
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Explore our extensive collection of over 200+ authentic South Indian dishes, 
            from traditional breakfast items to elaborate lunch and dinner spreads. 
            Every dish is crafted with authentic recipes and the finest ingredients.
          </p>
        </div>

        {/* Controls */}
        <div className="mb-8 space-y-4">
          {/* Search and Language Toggle */}
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <input
                type="text"
                placeholder="Search menu items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-border focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={language === 'en' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setLanguage('en')}
              >
                English
              </Button>
              <Button
                variant={language === 'ta' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setLanguage('ta')}
              >
                தமிழ்
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowCart(!showCart)}
                className="relative"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Cart
                {getCartItemCount() > 0 && (
                  <Badge variant="default" className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs">
                    {getCartItemCount()}
                  </Badge>
                )}
              </Button>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="min-w-fit"
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="bg-secondary-warm rounded-lg p-4 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Dietary Preference</label>
                  <div className="flex gap-2">
                    {filters.dietary.map((option) => (
                      <Button
                        key={option}
                        variant={selectedDietary === option ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedDietary(option)}
                      >
                        {option}
                      </Button>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          )}
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item, index) => (
            <Card key={item.id} className="group overflow-hidden hover:shadow-elegant transition-all duration-300 animate-slide-up" 
                  style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="aspect-video overflow-hidden">
                <img 
                  src={item.image} 
                  alt={language === 'en' ? item.name_en : item.name_ta}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-foreground text-lg">
                      {language === 'en' ? item.name_en : item.name_ta}
                    </h3>
                    {language === 'ta' && (
                      <p className="text-sm text-muted-foreground">{item.name_en}</p>
                    )}
                  </div>
                  <div className="flex items-center space-x-1 text-sm">
                    <Star className="w-4 h-4 fill-warning text-warning" />
                    <span className="font-medium">{item.rating}</span>
                  </div>
                </div>
                
                <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{item.description}</p>
                
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant={item.isVegetarian ? "default" : "secondary"} className="text-xs">
                    {item.isVegetarian ? "🟢 Veg" : "🔴 Non-Veg"}
                  </Badge>
                  <Badge variant="outline" className="text-xs">{item.subCategory}</Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Head Count: {cart[item.id] || 0}
                  </div>
                  <div className="flex items-center gap-2">
                    {cart[item.id] ? (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => removeFromCart(item.id)}
                          className="h-8 w-8 p-0"
                        >
                          -
                        </Button>
                        <span className="text-sm font-medium min-w-[20px] text-center">
                          {cart[item.id]}
                        </span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => addToCart(item.id)}
                          className="h-8 w-8 p-0"
                        >
                          +
                        </Button>
                      </>
                    ) : (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="hover:bg-primary hover:text-primary-foreground"
                        onClick={() => addToCart(item.id)}
                      >
                        Add Head Count
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No menu items found matching your criteria.</p>
            <Button 
              variant="outline" 
              className="mt-4" 
              onClick={() => {
                setSelectedCategory("All");
                setSelectedDietary("All");
                setSearchTerm("");
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}

        {/* Cart Display */}
        {showCart && getCartItemCount() > 0 && (
          <div className="mt-12 bg-secondary-warm rounded-lg p-6">
            <h3 className="text-2xl font-bold text-foreground mb-4">Your Event Menu Selection</h3>
            <div className="space-y-4">
              {Object.entries(cart).map(([itemId, quantity]) => {
                const item = menuItems.find(i => i.id === parseInt(itemId));
                if (!item) return null;
                return (
                  <div key={itemId} className="flex items-center justify-between p-4 bg-background rounded-lg">
                    <div className="flex items-center gap-4">
                      <img 
                        src={item.image} 
                        alt={language === 'en' ? item.name_en : item.name_ta}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div>
                        <h4 className="font-semibold text-foreground">
                          {language === 'en' ? item.name_en : item.name_ta}
                        </h4>
                        <p className="text-sm text-muted-foreground">Head Count: {quantity}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => removeFromCart(item.id)}
                          className="h-8 w-8 p-0"
                        >
                          -
                        </Button>
                        <span className="text-sm font-medium min-w-[20px] text-center">
                          {quantity}
                        </span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => addToCart(item.id)}
                          className="h-8 w-8 p-0"
                        >
                          +
                        </Button>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-foreground">Head Count: {quantity}</div>
                        <div className="text-sm text-muted-foreground">Selected for event</div>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div className="border-t border-border pt-4">
                <div className="flex items-center justify-between">
                  <div className="text-lg font-semibold text-foreground">Total Items: {getCartItemCount()}</div>
                  <div className="text-2xl font-bold text-primary">Total Head Count: {getCartItemCount()}</div>
                </div>
                <div className="mt-4 flex gap-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setCart({})}
                    className="flex-1"
                  >
                    Clear All
                  </Button>
                  <Button 
                    variant="default" 
                    className="flex-1"
                    onClick={() => {
                      // Here you can integrate with the event planner
                      alert(`Selected ${getCartItemCount()} items for your event! Total Head Count: ${getCartItemCount()}`);
                    }}
                  >
                    Proceed to Event Planning
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default MenuSection;