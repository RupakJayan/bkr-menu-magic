import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Admin from "./pages/Admin";
import AdminDashboard from "./components/AdminDashboard";
import EventPlanningFlow from "./components/EventPlanningFlow";
import IntegratedMenuAndSession from "./components/IntegratedMenuAndSession";
import MenuSelectionMicroservice from "./components/MenuSelectionMicroservice";
import SessionPlanningMicroservice from "./components/SessionPlanningMicroservice";
import SessionPlanning from "./components/SessionPlanning";
import SessionPlanner from "./components/SessionPlanner";
import EventDetails from "./components/EventDetails";
import EventReview from "./components/EventReview";
import MenuSelection from "./components/MenuSelection";
import EnhancedEventPlanner from "./components/EnhancedEventPlanner";
import EnhancedMenuSelection from "./components/EnhancedMenuSelection";
import VenueSelection from "./components/VenueSelection";
import VenueDetails from "./components/VenueDetails";
import SimplifiedEventPlanner from "./components/SimplifiedEventPlanner";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true
          }}
        >
          <Routes>
            {/* Main Landing Page */}
            <Route path="/" element={<Index />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminDashboard language="en" />} />
            <Route path="/admin/ta" element={<AdminDashboard language="ta" />} />
            <Route path="/admin-page" element={<Admin />} />
            
            {/* Event Planning Routes */}
            <Route path="/event-planning" element={<EventPlanningFlow language="en" />} />
            <Route path="/event-planning/ta" element={<EventPlanningFlow language="ta" />} />
            
            {/* Integrated Menu and Session Planning */}
            <Route path="/integrated-planning" element={<IntegratedMenuAndSession language="en" />} />
            <Route path="/integrated-planning/ta" element={<IntegratedMenuAndSession language="ta" />} />
            
            {/* Individual Microservices */}
            <Route path="/menu-selection" element={<MenuSelectionMicroservice language="en" />} />
            <Route path="/menu-selection/ta" element={<MenuSelectionMicroservice language="ta" />} />
            
            <Route path="/session-planning" element={<SessionPlanningMicroservice language="en" />} />
            <Route path="/session-planning/ta" element={<SessionPlanningMicroservice language="ta" />} />
            
            {/* Enhanced Components */}
            <Route path="/enhanced-event-planner" element={<EnhancedEventPlanner language="en" />} />
            <Route path="/enhanced-event-planner/ta" element={<EnhancedEventPlanner language="ta" />} />
            
            <Route path="/enhanced-menu-selection" element={<EnhancedMenuSelection language="en" />} />
            <Route path="/enhanced-menu-selection/ta" element={<EnhancedMenuSelection language="ta" />} />
            
            {/* Venue Management */}
            <Route path="/venue-selection" element={<VenueSelection language="en" />} />
            <Route path="/venue-selection/ta" element={<VenueSelection language="ta" />} />
            
            <Route path="/venue-details" element={<VenueDetails language="en" />} />
            <Route path="/venue-details/ta" element={<VenueDetails language="ta" />} />
            
            {/* Session Management */}
            <Route path="/session-planner" element={<SessionPlanner language="en" />} />
            <Route path="/session-planner/ta" element={<SessionPlanner language="ta" />} />
            
            <Route path="/session-planning-standalone" element={<SessionPlanning language="en" />} />
            <Route path="/session-planning-standalone/ta" element={<SessionPlanning language="ta" />} />
            
            {/* Event Components */}
            <Route path="/event-details" element={<EventDetails language="en" onNext={() => {}} />} />
            <Route path="/event-details/ta" element={<EventDetails language="ta" onNext={() => {}} />} />
            
            <Route path="/event-review" element={<EventReview eventData={null} sessions={[]} onBack={() => {}} language="en" />} />
            <Route path="/event-review/ta" element={<EventReview eventData={null} sessions={[]} onBack={() => {}} language="ta" />} />
            
            {/* Menu Selection */}
            <Route path="/menu-selection-standalone" element={<MenuSelection language="en" />} />
            <Route path="/menu-selection-standalone/ta" element={<MenuSelection language="ta" />} />
            
            {/* Simplified Event Planner */}
            <Route path="/simplified-event-planner" element={<SimplifiedEventPlanner language="en" />} />
            <Route path="/simplified-event-planner/ta" element={<SimplifiedEventPlanner language="ta" />} />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
