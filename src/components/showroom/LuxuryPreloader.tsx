import React, { useEffect, useState } from "react";
import { useProgress } from "@react-three/drei";
import { CrosshairVector, DatumVector } from "@/components/ui/VectorIcons";

interface LuxuryPreloaderProps {
  onComplete?: () => void;
}

export const LuxuryPreloader: React.FC<LuxuryPreloaderProps> = ({ onComplete }) => {
  const { progress } = useProgress();
  const [displayProgress, setDisplayProgress] = useState(0);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const startTime = Date.now();
    const duration = 1000; // 1.0s fast precision preloader

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
        }, 200);
      }
    }, 20);

    return () => clearInterval(interval);
  }, [progress, onComplete]);

  if (isDismissed) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#07080b] text-white transition-opacity duration-300 pointer-events-none select-none ${
        displayProgress >= 100 ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* Central Precision CAD Caliper Emblem */}
      <div className="relative w-20 h-20 mb-6 flex items-center justify-center">
        {/* Outer Rotating Coordinate Ring */}
        <div className="absolute inset-0 rounded-full border border-white/10 animate-[spin_10s_linear_infinite]" />
        {/* Inner Dashed Caliper Ring */}
        <div className="absolute inset-2 rounded-full border border-dashed border-[#e2c99a]/40 animate-[spin_5s_linear_infinite_reverse]" />
        {/* Core Datum Point */}
        <div className="w-10 h-10 rounded-lg bg-[#12151e] border border-white/15 flex items-center justify-center text-[#e2c99a]">
          <DatumVector size={20} />
        </div>
      </div>

      {/* Numerical Telemetry Percentage */}
      <div className="flex flex-col items-center gap-2">
        <div className="flex items-baseline gap-1.5 font-mono">
          <span className="text-2xl font-bold tracking-tight text-white">
            {displayProgress}
          </span>
          <span className="text-xs text-[#e2c99a] font-normal">%</span>
        </div>

        {/* Precision Progress Bar */}
        <div className="w-48 h-1 rounded-full bg-white/[0.08] overflow-hidden">
          <div
            className="h-full bg-[#e2c99a] transition-all duration-150 ease-out"
            style={{ width: `${displayProgress}%` }}
          />
        </div>

        {/* Technical Sub-Label */}
        <span className="text-[10px] font-mono tracking-widest text-neutral-400 uppercase mt-2">
          COMPUTING SPATIAL GEOMETRY &amp; SHADOWS
        </span>
      </div>
    </div>
  );
};
