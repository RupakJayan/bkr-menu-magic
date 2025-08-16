import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Filter, Search, Star } from "lucide-react";

// Sample menu data with bilingual support
const menuItems = [
  {
    id: 1,
    name_en: "Traditional Biryani",
    name_ta: "பாரம்பரிய பிரியாணி",
    category: "Main Course",
    subCategory: "Rice Items",
    isVegetarian: false,
    price: 180,
    description: "Fragrant basmati rice cooked with tender meat and aromatic spices",
    tags: ["popular", "spicy", "traditional"],
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1563379091339-03246963d51f?w=400"
  },
  {
    id: 2,
    name_en: "Sambar Rice",
    name_ta: "சாம்பார் சாதம்",
    category: "Main Course", 
    subCategory: "Rice Items",
    isVegetarian: true,
    price: 120,
    description: "Traditional South Indian comfort food with flavorful lentil curry",
    tags: ["healthy", "traditional", "comfort"],
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400"
  },
  {
    id: 3,
    name_en: "Masala Dosa",
    name_ta: "மசாலா தோசை",
    category: "Breakfast",
    subCategory: "South Indian",
    isVegetarian: true,
    price: 80,
    description: "Crispy fermented crepe filled with spiced potato mixture",
    tags: ["breakfast", "crispy", "popular"],
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400"
  },
  {
    id: 4,
    name_en: "Chicken Curry",
    name_ta: "கோழி கறி",
    category: "Main Course",
    subCategory: "Curries",
    isVegetarian: false,
    price: 200,
    description: "Rich and spicy chicken curry cooked in traditional Tamil style",
    tags: ["spicy", "rich", "traditional"],
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400"
  },
  {
    id: 5,
    name_en: "Payasam",
    name_ta: "பாயசம்",
    category: "Dessert",
    subCategory: "Sweets",
    isVegetarian: true,
    price: 60,
    description: "Traditional South Indian sweet pudding made with milk and jaggery",
    tags: ["sweet", "traditional", "festival"],
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400"
  }
];

const categories = ["All", "Breakfast", "Main Course", "Dessert"];
const filters = {
  dietary: ["All", "Vegetarian", "Non-Vegetarian"],
  price: ["All", "Under ₹100", "₹100-200", "Above ₹200"]
};

const MenuSection = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedDietary, setSelectedDietary] = useState("All");
  const [selectedPrice, setSelectedPrice] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [language, setLanguage] = useState<'en' | 'ta'>('en');

  // Filter menu items
  const filteredItems = menuItems.filter(item => {
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    const matchesDietary = selectedDietary === "All" || 
      (selectedDietary === "Vegetarian" && item.isVegetarian) ||
      (selectedDietary === "Non-Vegetarian" && !item.isVegetarian);
    const matchesPrice = selectedPrice === "All" ||
      (selectedPrice === "Under ₹100" && item.price < 100) ||
      (selectedPrice === "₹100-200" && item.price >= 100 && item.price <= 200) ||
      (selectedPrice === "Above ₹200" && item.price > 200);
    const matchesSearch = item.name_en.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.name_ta.includes(searchTerm);

    return matchesCategory && matchesDietary && matchesPrice && matchesSearch;
  });

  return (
    <section id="menu" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 animate-slide-up">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            Our <span className="gradient-text">Authentic</span> Menu
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Discover our carefully crafted menu featuring traditional South Indian cuisine 
            prepared with the finest ingredients and authentic recipes.
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
                <div>
                  <label className="block text-sm font-medium mb-2">Price Range</label>
                  <div className="flex gap-2">
                    {filters.price.map((option) => (
                      <Button
                        key={option}
                        variant={selectedPrice === option ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedPrice(option)}
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
                  <div className="text-xl font-bold text-primary">₹{item.price}</div>
                  <Button size="sm" variant="outline" className="hover:bg-primary hover:text-primary-foreground">
                    Add to Cart
                  </Button>
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
                setSelectedPrice("All");
                setSearchTerm("");
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default MenuSection;