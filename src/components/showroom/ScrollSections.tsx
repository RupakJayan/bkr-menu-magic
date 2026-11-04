import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Sliders, ShieldCheck, Eye, Layers } from "lucide-react";
import { SphereIcon, Compass3DIcon, RaytraceIcon, ApertureIcon } from "./CustomIcons";

interface StageData {
  index: number;
  badge: string;
  badgeIcon: React.ReactNode;
  title: string;
  highlight: string;
  description: string;
  specs: { label: string; value: string; unit?: string }[];
  ctaText?: string;
  ctaLink?: string;
}

const STAGES: StageData[] = [
  {
    index: 0,
    badge: "01 / HARDWARE VIEWPORT",
    badgeIcon: <SphereIcon size={14} className="text-[#e2c99a]" />,
    title: "Cinematic 3D",
    highlight: "Architectural Staging",
    description:
      "A monolithic WebGL simulation of luxury event setups. Explore tactile physical surfaces, real-time light transmission, and queue-optimized live counters with zero perceptible latency.",
    specs: [
      { label: "Rendering Engine", value: "Three.js r162" },
      { label: "Lighting Pipeline", value: "ACES Filmic PBR" },
      { label: "Throughput Limit", value: "1,00,000 Pax" },
    ],
    ctaText: "Launch 3D Floorplanner",
    ctaLink: "/3d-planner",
  },
  {
    index: 1,
    badge: "02 / DUAL-INDUCTION DYNAMICS",
    badgeIcon: <RaytraceIcon size={14} className="text-[#e2c99a]" />,
    title: "Continuous Heat",
    highlight: "Sizzling Precision",
    description:
      "Dual 40-inch seasoned cast-iron griddles maintain an exact 185°C surface temperature. Eliminating cold spots guarantees golden, crispy paper-roast dosas at 1,200 units per hour per bay.",
    specs: [
      { label: "Thermal Stability", value: "±1.5", unit: "°C" },
      { label: "Duplication Logic", value: "Smart Trigger" },
      { label: "Recovery Time", value: "< 8", unit: "sec" },
    ],
    ctaText: "Explore Dosa Griddles",
    ctaLink: "/3d-planner",
  },
  {
    index: 2,
    badge: "03 / STRUCTURAL MATERIALITY",
    badgeIcon: <Compass3DIcon size={14} className="text-[#e2c99a]" />,
    title: "Aerospace Titanium &",
    highlight: "Champagne Brass",
    description:
      "5-axis CNC-milled chassis with satin bead-blasted obsidian counters. Magnetic snap-fit modular panels allow clean setup across open lawn grounds or grand mandapams without visible fasteners.",
    specs: [
      { label: "Chassis Alloy", value: "Ti-6Al-4V" },
      { label: "Finish Quality", value: "Satin 320-Grit" },
      { label: "Assembly Time", value: "45", unit: "min" },
    ],
    ctaText: "Configure Materials",
    ctaLink: "/3d-planner",
  },
  {
    index: 3,
    badge: "04 / INTELLIGENT WAYFINDING",
    badgeIcon: <ApertureIcon size={14} className="text-[#e2c99a]" />,
    title: "Zero-Bottleneck",
    highlight: "Crowd Wayfinding",
    description:
      "Overhead LED guidance arrays and synchronized handwash signboards direct high-volume guest streams smoothly between main courses, live counters, dessert stations, and dustbin bays.",
    specs: [
      { label: "Queue Velocity", value: "4.2", unit: "pax/min" },
      { label: "Signage Radiance", value: "850", unit: "nits" },
      { label: "BKR Video Wall", value: "30s Reels Sync" },
    ],
    ctaText: "Simulate Crowd Flow",
    ctaLink: "/3d-planner",
  },
];

interface ScrollSectionsProps {
  onSelectHotspot: (id: string | null) => void;
}

export const ScrollSections: React.FC<ScrollSectionsProps> = ({ onSelectHotspot }) => {
  return (
    <div className="relative z-10 w-full pointer-events-none select-none">
      {STAGES.map((stage) => (
        <section
          key={stage.index}
          id={`stage-${stage.index}`}
          className="min-h-screen w-full flex items-center px-6 md:px-16 lg:px-24 max-w-7xl mx-auto py-24"
        >
          <div className="max-w-xl pointer-events-auto backdrop-blur-xl bg-[#090a0d]/65 p-7 md:p-9 rounded-3xl border border-white/[0.08] shadow-[0_20px_60px_rgba(0,0,0,0.7)] group">
            {/* Top Stage Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] mb-4">
              {stage.badgeIcon}
              <span className="text-[10px] font-mono font-bold tracking-widest text-[#e2c99a] uppercase">
                {stage.badge}
              </span>
            </div>

            {/* Masked Headline Reveal */}
            <h2 className="text-3xl md:text-5xl font-syne font-extrabold text-white leading-[1.15] tracking-tight mb-4">
              {stage.title}{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e2c99a] via-[#f5e8d0] to-[#c5a059]">
                {stage.highlight}
              </span>
            </h2>

            {/* Description Paragraph */}
            <p className="text-sm md:text-base text-neutral-300 font-sans leading-relaxed mb-6">
              {stage.description}
            </p>

            {/* Micro Specifications Grid */}
            <div className="grid grid-cols-3 gap-3 border-t border-b border-white/[0.08] py-4 mb-6">
              {stage.specs.map((s) => (
                <div key={s.label} className="flex flex-col">
                  <span className="text-[9px] font-mono text-neutral-400 uppercase tracking-wider">
                    {s.label}
                  </span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-sm md:text-base font-syne font-bold text-white">
                      {s.value}
                    </span>
                    {s.unit && (
                      <span className="text-[10px] font-mono text-[#e2c99a] font-bold">
                        {s.unit}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-wrap items-center gap-3">
              {stage.ctaLink && (
                <Link
                  to={stage.ctaLink}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#e2c99a] hover:bg-[#c5a059] text-black font-syne font-bold text-xs tracking-wider uppercase transition-all shadow-lg active:scale-95"
                >
                  <span>{stage.ctaText}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              )}

              <button
                onClick={() => {
                  const hotspotKeys = ["tawa-core", "canopy-optics", "brass-chassis", "queue-telemetry"];
                  onSelectHotspot(hotspotKeys[stage.index]);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-xs font-mono font-medium text-neutral-300 hover:text-white transition-all active:scale-95"
              >
                <Eye className="w-3.5 h-3.5 text-[#e2c99a]" />
                <span>Focus Hotspot in 3D</span>
              </button>
            </div>
          </div>
        </section>
      ))}
    </div>
  );
};
