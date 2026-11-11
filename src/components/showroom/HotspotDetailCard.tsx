import React from "react";
import { X, ChevronRight } from "lucide-react";
import { SHOWROOM_HOTSPOTS } from "./HeroModel";
import { PhysicsHoverCard } from "@/components/ui/PhysicsHoverCard";
import { CrosshairVector, DimensionCaliperVector } from "@/components/ui/VectorIcons";

interface HotspotDetailCardProps {
  activeHotspot: string | null;
  onClose: () => void;
}

export const HotspotDetailCard: React.FC<HotspotDetailCardProps> = ({ activeHotspot, onClose }) => {
  if (!activeHotspot) return null;

  const data = SHOWROOM_HOTSPOTS.find((h) => h.id === activeHotspot);
  if (!data) return null;

  const coordStr = `[${data.position.map((v) => (v >= 0 ? `+${v.toFixed(2)}` : v.toFixed(2))).join(", ")}]`;

  return (
    <aside
      aria-label="Component specifications"
      className="fixed bottom-8 right-6 md:right-10 z-40 w-[90vw] max-w-md pointer-events-auto select-none"
    >
      <PhysicsHoverCard
        className="p-6 rounded-2xl bg-[#0b0d14]/90 border border-[#e2c99a]/40 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.85)]"
        maxTilt={5}
        magnetic={false}
        specular={true}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-3 mb-4">
          <div className="flex items-center gap-2">
            <CrosshairVector size={15} className="text-[#e2c99a]" />
            <span className="text-[10px] font-mono font-bold tracking-widest text-[#e2c99a] uppercase">
              {data.tag} // CAD INSPECTION
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
            title="Exit Detail View"
            aria-label="Exit detail view"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Title & Spatial Coordinates */}
        <div className="flex items-baseline justify-between gap-2 mb-2">
          <h3 className="text-lg font-bold font-sans text-white tracking-tight">
            {data.label}
          </h3>
          <span className="text-[10px] font-mono text-[#e2c99a] shrink-0">
            {coordStr}
          </span>
        </div>

        <p className="text-xs text-neutral-300 leading-relaxed font-sans mb-5">
          {data.description}
        </p>

        {/* Specifications Grid */}
        <div className="grid grid-cols-3 gap-2.5 bg-black/50 p-3 rounded-xl border border-white/[0.06] mb-4">
          {data.specs.map((s) => (
            <div key={s.k} className="flex flex-col">
              <span className="text-[9px] font-mono text-neutral-400 uppercase tracking-wider">{s.k}</span>
              <span className="text-xs font-mono font-bold text-white mt-0.5 truncate">{s.v}</span>
            </div>
          ))}
        </div>

        {/* Reset Camera Action */}
        <div className="flex items-center justify-between pt-1 border-t border-white/[0.06]">
          <span className="text-[10px] font-mono text-neutral-400">CAMERA // TARGET LOCKED</span>
          <button
            onClick={onClose}
            className="inline-flex items-center gap-1 text-xs font-mono font-semibold text-[#e2c99a] hover:text-white transition-colors"
          >
            <span>Resume Scroll Path</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </PhysicsHoverCard>
    </aside>
  );
};
