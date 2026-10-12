import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { HashRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { OpeningLoader } from "@/components/OpeningLoader";
import Home from "./pages/Home";
import MenuCreator from "./pages/MenuCreator";
import AdminAccess from "./pages/AdminAccess";
import NotFound from "./pages/NotFound";

const hasSeenOpening = () => {
  try {
    return sessionStorage.getItem("bkr-opening-seen") === "true";
  } catch {
    return false;
  }
};

const App = () => {
  const [showOpening, setShowOpening] = useState(() => !hasSeenOpening());

  const dismissOpening = () => {
    try {
      sessionStorage.setItem("bkr-opening-seen", "true");
    } catch {
      // The intro still dismisses normally when storage is unavailable.
    }
    setShowOpening(false);
  };

  return (
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <HashRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/instagram" element={<Home />} />
            <Route path="/our-approach" element={<Home />} />
            <Route path="/experience" element={<Home />} />
            <Route path="/how-it-works" element={<Home />} />
            <Route path="/contact" element={<Home />} />
            <Route path="/menu-creator" element={<MenuCreator />} />
            <Route path="/admin" element={<AdminAccess />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </HashRouter>
        {showOpening && <OpeningLoader onComplete={dismissOpening} />}
      </TooltipProvider>
    </ThemeProvider>
  );
};

export default App;
