import { Button } from "@/components/ui/button";
import { Calendar, Users, Star, ChefHat } from "lucide-react";
import heroImage from "@/assets/hero-catering.jpg";

const Hero = () => {
  return (
    <section id="home" className="relative min-h-screen bg-gradient-hero overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="BKR South Indian Restaurant - Authentic South Indian Cuisine"
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-hero opacity-80"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-screen flex items-center">
        <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
          {/* Hero Text */}
          <div className="text-center lg:text-left animate-slide-up">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground mb-6 leading-tight">
              Exquisite <span className="text-primary-glow">Catering</span>
              <br />
              for Every <span className="text-accent-vibrant">Occasion</span>
            </h1>
            
            <p className="text-lg md:text-xl text-primary-foreground/90 mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              From traditional South Indian weddings to corporate events, BKR Catering brings authentic flavors 
              and impeccable service to make your special moments unforgettable.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
              <Button variant="glow" size="xl" className="group">
                <Calendar className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                Plan Your Event
              </Button>
              <Button variant="outline" size="xl" className="text-primary-foreground border-primary-foreground hover:bg-primary-foreground hover:text-primary">
                <ChefHat className="w-5 h-5 mr-2" />
                View Menu
              </Button>
            </div>

            {/* Contact Info */}
            <div className="text-primary-foreground/80 text-sm space-y-1">
              <p className="font-medium">📍 45, Big Bazaar Street, Anaimalai, Pollachi Taluk, Coimbatore</p>
              <p className="font-medium">📞 8012686883</p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-6 animate-float">
            <div className="bg-gradient-card rounded-2xl p-6 text-center shadow-elegant hover:shadow-glow transition-all duration-300">
              <Users className="w-8 h-8 text-primary mx-auto mb-3" />
              <div className="text-2xl font-bold text-foreground mb-1">500+</div>
              <div className="text-sm text-muted-foreground">Events Catered</div>
            </div>
            
            <div className="bg-gradient-card rounded-2xl p-6 text-center shadow-elegant hover:shadow-glow transition-all duration-300">
              <Star className="w-8 h-8 text-warning mx-auto mb-3" />
              <div className="text-2xl font-bold text-foreground mb-1">4.9★</div>
              <div className="text-sm text-muted-foreground">Customer Rating</div>
            </div>
            
            <div className="bg-gradient-card rounded-2xl p-6 text-center shadow-elegant hover:shadow-glow transition-all duration-300">
              <ChefHat className="w-8 h-8 text-primary mx-auto mb-3" />
              <div className="text-2xl font-bold text-foreground mb-1">200+</div>
              <div className="text-sm text-muted-foreground">Menu Items</div>
            </div>
            
            <div className="bg-gradient-card rounded-2xl p-6 text-center shadow-elegant hover:shadow-glow transition-all duration-300">
              <Calendar className="w-8 h-8 text-success mx-auto mb-3" />
              <div className="text-2xl font-bold text-foreground mb-1">10+</div>
              <div className="text-sm text-muted-foreground">Years Experience</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
        <div className="animate-bounce">
          <div className="w-6 h-10 border-2 border-primary-foreground rounded-full flex justify-center">
            <div className="w-1 h-3 bg-primary-foreground rounded-full animate-pulse mt-2"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;