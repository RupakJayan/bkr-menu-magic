import React, { useEffect, useState } from "react";
import { useProgress } from "@react-three/drei";
import { SphereIcon } from "./CustomIcons";

interface LuxuryPreloaderProps {
  onComplete?: () => void;
}

export const LuxuryPreloader: React.FC<LuxuryPreloaderProps> = ({ onComplete }) => {
  const { progress } = useProgress();
  const [displayProgress, setDisplayProgress] = useState(0);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const startTime = Date.now();
    const duration = 1400; // 1.4s luxury animation reveal

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const linearP = Math.min(100, Math.round((elapsed / duration) * 100));
      const effectiveP = Math.max(linearP, Math.round(progress));

      setDisplayProgress(effectiveP);

      if (effectiveP >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsDismissed(true);
          onComplete?.();
        }, 400);
      }
    }, 25);

    return () => clearInterval(interval);
  }, [progress, onComplete]);

  if (isDismissed) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#07080a] text-white transition-all duration-500 pointer-events-none ${
        displayProgress >= 100 ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* Background Subtle Radial Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(226,201,154,0.08)_0%,transparent_70%)] pointer-events-none" />

      {/* Central Rotating Emblem */}
      <div className="relative w-20 h-20 mb-6 flex items-center justify-center">
        {/* Outer Pulsing Ring */}
        <div className="absolute inset-0 rounded-full border border-[#e2c99a]/20 animate-ping" />
        {/* Middle Rotating Dashed Ring */}
        <div className="absolute inset-0 rounded-full border border-dashed border-[#e2c99a]/50 animate-[spin_6s_linear_infinite]" />
        {/* Core Icon */}
        <div className="w-12 h-12 rounded-full bg-[#111318] border border-[#e2c99a]/60 flex items-center justify-center shadow-[0_0_25px_rgba(226,201,154,0.3)]">
          <SphereIcon size={24} className="text-[#e2c99a]" />
        </div>
      </div>

      {/* Numerical Percentage */}
      <div className="text-4xl font-syne font-extrabold tracking-tight mb-2">
        {Math.round(displayProgress)}
        <span className="text-[#e2c99a] font-mono text-lg ml-1">%</span>
      </div>

      {/* Technical Status Milestones */}
      <p className="text-[11px] font-mono tracking-widest text-neutral-400 uppercase">
        {displayProgress < 40
          ? "Compiling WebGL Shaders..."
          : displayProgress < 80
          ? "Synthesizing PBR Materials..."
          : "Mounting 3D Viewport..."}
      </p>

      {/* Minimalist Champagne Progress Line */}
      <div className="w-56 h-[2px] bg-white/10 rounded-full mt-6 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[#c5a059] to-[#e2c99a] transition-all duration-150 ease-out shadow-[0_0_10px_rgba(226,201,154,0.8)]"
          style={{ width: `${displayProgress}%` }}
        />
      </div>
    </div>
  );
};
