import React, { useState, useEffect } from "react";
import { LuxuryCanvas } from "./LuxuryCanvas";
import { GlassHeader } from "./GlassHeader";
import { ScrollSections } from "./ScrollSections";
import { HotspotDetailCard } from "./HotspotDetailCard";
import { LuxuryPreloader } from "./LuxuryPreloader";

export const LuxuryShowroom: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        setScrollProgress(Math.min(1, Math.max(0, window.scrollY / totalScroll)));
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleScrollToStage = (index: number) => {
    setActiveHotspot(null);
    const targetElement = document.getElementById(`stage-${index}`);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="relative bg-[#07080a] text-white min-h-screen selection:bg-[#e2c99a] selection:text-black overflow-x-hidden">
      {/* 1. Luxury Branded Preloader */}
      <LuxuryPreloader />

      {/* 2. Floating Frosted Glass Header */}
      <GlassHeader onScrollToStage={handleScrollToStage} />

      {/* 3. Hardware-Accelerated WebGL 3D Viewport */}
      <LuxuryCanvas
        scrollProgress={scrollProgress}
        activeHotspot={activeHotspot}
        onSelectHotspot={setActiveHotspot}
      />

      {/* 4. Semantic, Accessible Scroll-Driven Text Layers */}
      <ScrollSections onSelectHotspot={setActiveHotspot} />

      {/* 5. Interactive 3D Hotspot Inspection Card */}
      <HotspotDetailCard
        activeHotspot={activeHotspot}
        onClose={() => setActiveHotspot(null)}
      />

      {/* 6. Fixed HUD Telemetry Footer */}
      <footer className="fixed bottom-5 left-6 md:left-10 z-30 pointer-events-none hidden sm:flex items-center gap-3">
        <div className="px-3 py-1.5 rounded-xl bg-[#090a0d]/80 border border-white/10 backdrop-blur-md flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#e2c99a] animate-pulse" />
          <span className="text-[10px] font-mono text-neutral-400 uppercase">CAMERA PATH</span>
          <span className="text-[10px] font-mono font-bold text-[#e2c99a]">
            {Math.round(scrollProgress * 100)}%
          </span>
        </div>
      </footer>
    </div>
  );
};
