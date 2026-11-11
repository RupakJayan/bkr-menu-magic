import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Layers } from "lucide-react";
import { PhysicsHoverCard } from "@/components/ui/PhysicsHoverCard";
import {
  CrosshairVector,
  DimensionCaliperVector,
  SpatialGridVector,
  QueuingCurveVector,
} from "@/components/ui/VectorIcons";

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
    badge: "SYS // 01 • VIEWPORT KINEMATICS",
    badgeIcon: <CrosshairVector size={14} className="text-[#e2c99a]" />,
    title: "Spatial Hardware",
    highlight: "Viewport Engine",
    description:
      "Hardware-accelerated Three.js WebGL pipeline. Real-time ACES Filmic PBR, pointer-coupled specular irradiance, and camera scroll paths calibrated for large-scale banquet architecture.",
    specs: [
      { label: "Core Pipeline", value: "Three.js r162" },
      { label: "Color Grading", value: "ACES Filmic" },
      { label: "Engine Limit", value: "100k Pax" },
    ],
    ctaText: "Open 3D Venue Planner",
    ctaLink: "/3d-planner",
  },
  {
    index: 1,
    badge: "SYS // 02 • THERMAL INDUCTION",
    badgeIcon: <DimensionCaliperVector size={14} className="text-[#e2c99a]" />,
    title: "Dual Continuous",
    highlight: "Induction Core",
    description:
      "Twin 40-inch seasoned cast-iron griddles with multi-zone closed-loop PID control. 185°C isothermal surface eliminates thermal drops for 1,200 paper-roast dosas per hour per station.",
    specs: [
      { label: "Target Temp", value: "185.0", unit: "°C" },
      { label: "Thermal Stability", value: "±1.2", unit: "°C" },
      { label: "Recovery Delta", value: "< 6.2", unit: "sec" },
    ],
    ctaText: "Inspect Cooking Stalls",
    ctaLink: "/3d-planner",
  },
  {
    index: 2,
    badge: "SYS // 03 • STRUCTURAL MATERIALITY",
    badgeIcon: <SpatialGridVector size={14} className="text-[#e2c99a]" />,
    title: "Precision Metal",
    highlight: "Architectural Chassis",
    description:
      "Grade 5 aerospace titanium uprights electroplated in satin champagne brass. Monolithic obsidian countertop bases with seamless magnetic snap-fit modularity for rapid mandapam assembly.",
    specs: [
      { label: "Chassis Alloy", value: "Ti-6Al-4V" },
      { label: "Countertop", value: "Obsidian PBR" },
      { label: "Assembly Time", value: "45", unit: "min" },
    ],
    ctaText: "Configure Materials",
    ctaLink: "/3d-planner",
  },
  {
    index: 3,
    badge: "SYS // 04 • QUEUING FLUIDICS",
    badgeIcon: <QueuingCurveVector size={14} className="text-[#e2c99a]" />,
    title: "Dual-Wing Concourse",
    highlight: "Zero-Bottleneck Routing",
    description:
      "Poisson arrival-rate distribution algorithm. Automatic counter duplication splits heavy morning breakfast queues across North and South wings with 5.5m unobstructed service aisles.",
    specs: [
      { label: "Aisle Clearance", value: "5.5", unit: "m" },
      { label: "Wing Separation", value: "18.4", unit: "m" },
      { label: "Queue Velocity", value: "4.8", unit: "pax/min" },
    ],
    ctaText: "Run Crowd Simulation",
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
          <div className="max-w-xl pointer-events-auto">
            {/* Wrap in PhysicsHoverCard for spring dynamics, pointer tilt, and specular lighting */}
            <PhysicsHoverCard
              className="bg-[#0b0d13]/85 backdrop-blur-2xl p-7 md:p-8 rounded-2xl border border-white/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.7)]"
              maxTilt={6}
              magnetic={true}
              specular={true}
            >
              {/* Telemetry Stage Header */}
              <div className="flex items-center justify-between mb-4 border-b border-white/[0.06] pb-3">
                <div className="inline-flex items-center gap-2">
                  {stage.badgeIcon}
                  <span className="text-[10px] font-mono font-bold tracking-widest text-[#e2c99a] uppercase">
                    {stage.badge}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-neutral-400">
                  COORD // SEC_{stage.index + 1}
                </span>
              </div>

              {/* High-Precision Headline */}
              <h2 className="text-2xl md:text-3xl font-bold font-sans text-white tracking-tight leading-tight mb-3">
                {stage.title}{" "}
                <span className="text-[#e2c99a] font-mono font-normal">
                  {stage.highlight}
                </span>
              </h2>

              {/* Direct Engineering Description */}
              <p className="text-xs md:text-sm text-neutral-300 font-sans leading-relaxed mb-6">
                {stage.description}
              </p>

              {/* Engineering Specifications Grid */}
              <div className="grid grid-cols-3 gap-2.5 bg-black/40 p-3 rounded-xl border border-white/[0.06] mb-6">
                {stage.specs.map((spec) => (
                  <div key={spec.label} className="flex flex-col">
                    <span className="text-[9px] font-mono text-neutral-400 uppercase tracking-wider">
                      {spec.label}
                    </span>
                    <span className="text-xs font-mono font-bold text-white mt-0.5">
                      {spec.value}
                      {spec.unit && (
                        <span className="text-[10px] font-normal text-neutral-400 ml-0.5">
                          {spec.unit}
                        </span>
                      )}
                    </span>
                  </div>
                ))}
              </div>

              {/* Actions Footer */}
              <div className="flex items-center justify-between pt-2 border-t border-white/[0.06]">
                <button
                  type="button"
                  onClick={() => onSelectHotspot(null)}
                  className="text-[11px] font-mono text-neutral-400 hover:text-[#e2c99a] transition-colors"
                >
                  Inspect In 3D
                </button>

                {stage.ctaLink && (
                  <Link
                    to={stage.ctaLink}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#141722] hover:bg-[#1a1e2c] border border-white/10 hover:border-[#e2c99a]/50 text-xs font-mono text-white transition-all active:scale-95"
                  >
                    <span>{stage.ctaText}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#e2c99a]" />
                  </Link>
                )}
              </div>
            </PhysicsHoverCard>
          </div>
        </section>
      ))}
    </div>
  );
};
