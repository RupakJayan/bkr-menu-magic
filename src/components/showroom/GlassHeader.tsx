import React, { useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { Link } from "react-router-dom";
import { Sparkles, Layers, ArrowUpRight } from "lucide-react";
import { SphereIcon } from "./CustomIcons";

interface MagneticLinkProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
}

const MagneticLink: React.FC<MagneticLinkProps> = ({ children, href, onClick }) => {
  const ref = useRef<HTMLAnchorElement | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { stiffness: 220, damping: 14 });
  const springY = useSpring(y, { stiffness: 220, damping: 14 });

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    x.set((e.clientX - centerX) * 0.3);
    y.set((e.clientY - centerY) * 0.3);
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
      className="relative px-3.5 py-1.5 text-xs font-mono font-medium uppercase tracking-wider text-neutral-300 hover:text-white transition-colors duration-200 group cursor-pointer"
    >
      {children}
      {/* Animated underline expansion */}
      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[1.5px] bg-[#e2c99a] transition-all duration-300 ease-out group-hover:w-4/5 shadow-[0_0_8px_rgba(226,201,154,0.6)]" />
    </motion.a>
  );
};

interface GlassHeaderProps {
  onScrollToStage: (index: number) => void;
}

export const GlassHeader: React.FC<GlassHeaderProps> = ({ onScrollToStage }) => {
  return (
    <header className="fixed top-5 left-1/2 -translate-x-1/2 z-50 w-[94%] max-w-6xl pointer-events-auto">
      <nav className="flex items-center justify-between px-5 py-3 rounded-2xl bg-[#090a0d]/75 backdrop-blur-2xl border border-white/[0.08] shadow-[0_16px_40px_rgba(0,0,0,0.6)]">
        {/* Brand Emblem */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#e2c99a] to-[#c5a059] flex items-center justify-center shadow-lg shadow-[#e2c99a]/20 group-hover:scale-105 transition-transform duration-300">
            <SphereIcon className="text-black" size={18} />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-syne font-extrabold text-sm tracking-widest text-white uppercase">
                BKR • 3D
              </span>
              <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-[#161820] text-[#e2c99a] border border-[#e2c99a]/30">
                PRO
              </span>
            </div>
            <p className="text-[10px] text-neutral-400 font-mono hidden sm:block">
              Architectural Catering Viewport
            </p>
          </div>
        </Link>

        {/* Dynamic Center Navigation Links */}
        <div className="hidden md:flex items-center gap-1 bg-white/[0.02] p-1 rounded-xl border border-white/[0.05]">
          <MagneticLink onClick={() => onScrollToStage(0)}>Overview</MagneticLink>
          <MagneticLink onClick={() => onScrollToStage(1)}>Engineering</MagneticLink>
          <MagneticLink onClick={() => onScrollToStage(2)}>Materiality</MagneticLink>
          <MagneticLink onClick={() => onScrollToStage(3)}>Telemetry</MagneticLink>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Link
            to="/3d-planner"
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#161820] border border-white/10 text-xs font-mono font-bold text-neutral-200 hover:text-white hover:border-[#e2c99a]/50 transition-all active:scale-95"
          >
            <Layers className="w-3.5 h-3.5 text-[#e2c99a]" />
            <span>3D Planner</span>
          </Link>

          <Link
            to="/menu-creator"
            className="inline-flex items-center gap-1 px-4 py-1.5 rounded-xl bg-[#e2c99a] text-black font-syne font-extrabold text-xs tracking-wider uppercase hover:bg-[#c5a059] transition-all shadow-[0_4px_20px_rgba(226,201,154,0.3)] active:scale-95"
          >
            <span>Menu Studio</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </nav>
    </header>
  );
};
