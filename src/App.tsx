import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { HashRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Planner3DPage from "./pages/Planner3DPage";

const App = () => {
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
            <Route path="/" element={<Planner3DPage />} />
            <Route path="/3d-planner" element={<Planner3DPage />} />
            <Route path="/mandapam" element={<Planner3DPage />} />
            <Route path="*" element={<Planner3DPage />} />
          </Routes>
        </HashRouter>
      </TooltipProvider>
    </ThemeProvider>
  );
};

export default App;
