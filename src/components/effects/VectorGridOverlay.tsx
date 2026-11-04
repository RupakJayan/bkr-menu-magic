import React, { useState, useEffect } from "react";

interface VectorGridOverlayProps {
  className?: string;
  showCoordinates?: boolean;
  gridSpacing?: number;
  subdivisions?: number;
  opacity?: number;
}

export const VectorGridOverlay: React.FC<VectorGridOverlayProps> = ({
  className = "",
  showCoordinates = true,
  opacity = 0.45,
}) => {
  const [coords, setCoords] = useState<{ x: number; z: number }>({ x: 0, z: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Map screen coordinates to architectural hall space (-25m to +25m)
      const normX = (e.clientX / window.innerWidth - 0.5) * 40;
      const normZ = (e.clientY / window.innerHeight - 0.5) * 30;
      setCoords({
        x: Math.round(normX * 10) / 10,
        z: Math.round(normZ * 10) / 10,
      });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      className={`pointer-events-none absolute inset-0 z-0 overflow-hidden select-none ${className}`}
      style={{ opacity }}
      aria-hidden="true"
    >
      {/* 1. Precision SVG CAD Coordinate Grid */}
      <svg
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
      >
        <defs>
          {/* Minor millimeter grid: 20px */}
          <pattern id="cad-minor-grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path
              d="M 20 0 L 0 0 0 20"
              fill="none"
              stroke="rgba(255, 255, 255, 0.025)"
              strokeWidth="0.5"
            />
          </pattern>
          {/* Major meter grid with crosshairs: 100px */}
          <pattern id="cad-major-grid" width="100" height="100" patternUnits="userSpaceOnUse">
            <rect width="100" height="100" fill="url(#cad-minor-grid)" />
            <path
              d="M 100 0 L 0 0 0 100"
              fill="none"
              stroke="rgba(226, 201, 154, 0.08)"
              strokeWidth="1"
            />
            {/* Center tick crosshair */}
            <path
              d="M 46 50 L 54 50 M 50 46 L 50 54"
              stroke="rgba(226, 201, 154, 0.25)"
              strokeWidth="1"
            />
          </pattern>
        </defs>

        <rect width="100%" height="100%" fill="url(#cad-major-grid)" />
      </svg>

      {/* 2. Precision Corner Brackets (Architectural Viewport Border) */}
      <div className="absolute top-4 left-4 text-[9px] font-mono text-neutral-500 uppercase tracking-widest flex items-center gap-1.5">
        <span className="text-[#e2c99a]">⌜</span>
        <span>DATUM // 0,0,0</span>
      </div>
      <div className="absolute top-4 right-4 text-[9px] font-mono text-neutral-500 uppercase tracking-widest flex items-center gap-1.5">
        <span>GRID 1.0m ISO</span>
        <span className="text-[#e2c99a]">⌝</span>
      </div>
      <div className="absolute bottom-4 left-4 text-[9px] font-mono text-neutral-500 uppercase tracking-widest flex items-center gap-1.5">
        <span className="text-[#e2c99a]">⌞</span>
        <span>PROJ // ACES FILMIC PBR</span>
      </div>
      <div className="absolute bottom-4 right-4 text-[9px] font-mono text-neutral-500 uppercase tracking-widest flex items-center gap-1.5">
        <span>SURFACE: ±0.00m</span>
        <span className="text-[#e2c99a]">⌟</span>
      </div>

      {/* 3. Live Architectural Coordinate HUD (Vector telemetry) */}
      {showCoordinates && (
        <div className="absolute bottom-8 right-8 hidden md:flex items-center gap-4 px-3 py-1.5 rounded-lg bg-[#0c0e14]/80 border border-white/10 backdrop-blur-md text-[10px] font-mono text-neutral-300">
          <div className="flex items-center gap-1.5">
            <span className="text-[#e2c99a] font-bold">X:</span>
            <span>{coords.x >= 0 ? `+${coords.x.toFixed(1)}` : coords.x.toFixed(1)}m</span>
          </div>
          <div className="w-px h-3 bg-white/20" />
          <div className="flex items-center gap-1.5">
            <span className="text-[#e2c99a] font-bold">Z:</span>
            <span>{coords.z >= 0 ? `+${coords.z.toFixed(1)}` : coords.z.toFixed(1)}m</span>
          </div>
          <div className="w-px h-3 bg-white/20" />
          <div className="flex items-center gap-1">
            <span className="text-neutral-500">SCALE</span>
            <span className="text-neutral-200">1:100</span>
          </div>
        </div>
      )}
    </div>
  );
};
