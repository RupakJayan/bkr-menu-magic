import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import MenuSection from "@/components/MenuSection";
import EventPlanner from "@/components/EventPlanner";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <Hero />
      <MenuSection />
      <EventPlanner />
    </div>
  );
};

export default Index;
