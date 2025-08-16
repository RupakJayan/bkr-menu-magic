import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Phone, MapPin } from "lucide-react";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50 shadow-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold gradient-text">BKR Catering</h1>
              <p className="text-xs text-muted-foreground">Anaimalai, Pollachi</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <a href="#home" className="text-foreground hover:text-primary px-3 py-2 text-sm font-medium transition-colors">
                Home
              </a>
              <a href="#menu" className="text-foreground hover:text-primary px-3 py-2 text-sm font-medium transition-colors">
                Menu
              </a>
              <a href="#events" className="text-foreground hover:text-primary px-3 py-2 text-sm font-medium transition-colors">
                Events
              </a>
              <a href="#about" className="text-foreground hover:text-primary px-3 py-2 text-sm font-medium transition-colors">
                About
              </a>
              <a href="#contact" className="text-foreground hover:text-primary px-3 py-2 text-sm font-medium transition-colors">
                Contact
              </a>
            </div>
          </div>

          {/* Contact Info & CTA */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Phone className="w-4 h-4" />
              <span>8012686883</span>
            </div>
            <Button variant="hero" size="sm">
              Plan Event
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={toggleMenu}>
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-background border-t border-border">
                        <a href="#home" className="text-foreground hover:text-primary block px-3 py-2 text-base font-medium">
              Home
            </a>
            <a href="#menu" className="text-foreground hover:text-primary block px-3 py-2 text-base font-medium">
              Menu
            </a>
            <a href="#events" className="text-foreground hover:text-primary block px-3 py-2 text-base font-medium">
              Events
            </a>
            <a href="#about" className="text-foreground hover:text-primary block px-3 py-2 text-base font-medium">
              About
            </a>
            <a href="#contact" className="text-foreground hover:text-primary block px-3 py-2 text-base font-medium">
              Contact
            </a>
            <div className="px-3 py-2 space-y-2">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Phone className="w-4 h-4" />
                <span>8012686883</span>
              </div>
              <Button variant="hero" size="sm" className="w-full">
                Plan Event
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;