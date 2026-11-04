import React, { useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { Link } from "react-router-dom";
import { Layers, ArrowUpRight } from "lucide-react";
import { CrosshairVector, DatumVector } from "@/components/ui/VectorIcons";

interface MagneticLinkProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
}

const MagneticLink: React.FC<MagneticLinkProps> = ({ children, href, onClick }) => {
  const ref = useRef<HTMLAnchorElement | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { stiffness: 300, damping: 18 });
  const springY = useSpring(y, { stiffness: 300, damping: 18 });

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    x.set((e.clientX - centerX) * 0.35);
    y.set((e.clientY - centerY) * 0.35);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.a
      ref={ref}
      href={href}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      className="relative px-3 py-1.5 text-xs font-mono font-medium tracking-wider text-neutral-300 hover:text-white transition-colors duration-200 group cursor-pointer"
    >
      {children}
      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[1.5px] bg-[#e2c99a] transition-all duration-200 ease-out group-hover:w-3/4" />
    </motion.a>
  );
};

interface GlassHeaderProps {
  onScrollToStage: (index: number) => void;
}

export const GlassHeader: React.FC<GlassHeaderProps> = ({ onScrollToStage }) => {
  return (
    <header className="fixed top-5 left-1/2 -translate-x-1/2 z-50 w-[94%] max-w-6xl pointer-events-auto select-none">
      <nav className="flex items-center justify-between px-5 py-3 rounded-2xl bg-[#090a0f]/85 backdrop-blur-2xl border border-white/[0.08] shadow-[0_16px_40px_rgba(0,0,0,0.7)]">
        {/* Architectural Emblem & Datum */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-lg bg-[#141722] border border-white/10 flex items-center justify-center text-[#e2c99a] group-hover:border-[#e2c99a]/50 transition-colors">
            <DatumVector size={18} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-xs tracking-wider text-white uppercase">
                BKR // SPATIAL
              </span>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-white/[0.06] text-neutral-400 border border-white/[0.08]">
                R162 PBR
              </span>
            </div>
            <p className="text-[10px] text-neutral-400 font-mono hidden sm:block">
              Architectural Venue Viewport
            </p>
          </div>
        </Link>

        {/* CAD Stage Selectors with Spring Physics */}
        <div className="hidden md:flex items-center gap-1 bg-white/[0.02] p-1 rounded-xl border border-white/[0.05]">
          <MagneticLink onClick={() => onScrollToStage(0)}>01 // Viewport</MagneticLink>
          <MagneticLink onClick={() => onScrollToStage(1)}>02 // Thermal</MagneticLink>
          <MagneticLink onClick={() => onScrollToStage(2)}>03 // Materials</MagneticLink>
          <MagneticLink onClick={() => onScrollToStage(3)}>04 // Flow</MagneticLink>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <Link
            to="/3d-planner"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#141722] border border-white/10 text-xs font-mono font-semibold text-neutral-200 hover:text-white hover:border-[#e2c99a]/50 transition-all active:scale-95"
          >
            <Layers className="w-3.5 h-3.5 text-[#e2c99a]" />
            <span>3D Venue Planner</span>
          </Link>

          <Link
            to="/menu-creator"
            className="inline-flex items-center gap-1 px-4 py-1.5 rounded-xl bg-[#e2c99a] text-black font-mono font-bold text-xs tracking-wider uppercase hover:bg-[#c5a059] transition-all shadow-md active:scale-95"
          >
            <span>Plan Event</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </nav>
    </header>
  );
};
