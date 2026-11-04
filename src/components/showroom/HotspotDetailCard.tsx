import React from "react";
import { X, Sparkles, ChevronRight } from "lucide-react";
import { SHOWROOM_HOTSPOTS } from "./HeroModel";

interface HotspotDetailCardProps {
  activeHotspot: string | null;
  onClose: () => void;
}

export const HotspotDetailCard: React.FC<HotspotDetailCardProps> = ({ activeHotspot, onClose }) => {
  if (!activeHotspot) return null;

  const data = SHOWROOM_HOTSPOTS.find((h) => h.id === activeHotspot);
  if (!data) return null;

  return (
    <aside
      aria-label="Component specifications"
      className="fixed bottom-8 right-6 md:right-10 z-40 w-[90vw] max-w-md p-6 rounded-2xl bg-[#0e1017]/85 border border-[#e2c99a]/30 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] animate-in fade-in slide-in-from-bottom-6 duration-300"
    >
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-white/[0.08] pb-3 mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#e2c99a]" />
          <span className="text-[10px] font-mono font-bold tracking-widest text-[#e2c99a] uppercase">
            {data.tag} • 3D INSPECTION
          </span>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
          title="Exit Detail View"
          aria-label="Exit detail view"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Title & Description */}
      <h3 className="text-xl font-bold font-syne text-white tracking-tight mb-2">
        {data.label}
      </h3>
      <p className="text-xs text-neutral-300 leading-relaxed font-sans mb-5">
        {data.description}
      </p>

      {/* Specifications Grid */}
      <div className="grid grid-cols-3 gap-2.5 bg-black/40 p-3 rounded-xl border border-white/[0.05] mb-4">
        {data.specs.map((s) => (
          <div key={s.k} className="flex flex-col">
            <span className="text-[9px] font-mono text-neutral-400 uppercase tracking-wider">{s.k}</span>
            <span className="text-xs font-bold text-white mt-0.5 truncate">{s.v}</span>
          </div>
        ))}
      </div>

      {/* Reset Camera Action */}
      <div className="flex items-center justify-between pt-1">
        <span className="text-[10px] font-mono text-neutral-400">Camera locked on coordinate</span>
        <button
          onClick={onClose}
          className="inline-flex items-center gap-1 text-xs font-mono font-bold text-[#e2c99a] hover:text-[#c5a059] transition-colors"
        >
          <span>Resume Scroll</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
};
