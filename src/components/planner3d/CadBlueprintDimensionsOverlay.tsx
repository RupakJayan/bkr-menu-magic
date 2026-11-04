import React from "react";
import { Line, Html } from "@react-three/drei";
import { MandapamVenue, StallItem } from "@/types/planner3d";

interface CadBlueprintDimensionsOverlayProps {
  venue: MandapamVenue;
  stalls: StallItem[];
  active?: boolean;
}

export const CadBlueprintDimensionsOverlay: React.FC<CadBlueprintDimensionsOverlayProps> = ({
  venue,
  stalls,
  active = true,
}) => {
  if (!active) return null;

  const w = venue.hallWidth;
  const l = venue.hallLength;
  const halfW = w / 2;
  const halfL = l / 2;

  // Exterior leader offsets
  const topOffset = halfL + 3.0;
  const leftOffset = -halfW - 3.0;

  return (
    <group position={[0, 0.08, 0]}>
      {/* 1. TOP WIDTH DIMENSION LEADER LINE */}
      <Line
        points={[
          [-halfW, 0.1, topOffset],
          [halfW, 0.1, topOffset],
        ]}
        color="#e2c99a"
        lineWidth={2}
      />
      {/* Extension ticks */}
      <Line
        points={[
          [-halfW, 0.1, halfL],
          [-halfW, 0.1, topOffset + 0.8],
        ]}
        color="#e2c99a"
        lineWidth={1}
      />
      <Line
        points={[
          [halfW, 0.1, halfL],
          [halfW, 0.1, topOffset + 0.8],
        ]}
        color="#e2c99a"
        lineWidth={1}
      />
      <Html position={[0, 0.2, topOffset]} center>
        <div className="px-2 py-0.5 rounded bg-black/90 border border-[#e2c99a] text-[#e2c99a] font-mono text-[10px] font-bold shadow-md whitespace-nowrap">
          WIDTH: {w.toFixed(1)}m
        </div>
      </Html>

      {/* 2. LEFT LENGTH DIMENSION LEADER LINE */}
      <Line
        points={[
          [leftOffset, 0.1, -halfL],
          [leftOffset, 0.1, halfL],
        ]}
        color="#e2c99a"
        lineWidth={2}
      />
      {/* Extension ticks */}
      <Line
        points={[
          [-halfW, 0.1, -halfL],
          [leftOffset - 0.8, 0.1, -halfL],
        ]}
        color="#e2c99a"
        lineWidth={1}
      />
      <Line
        points={[
          [-halfW, 0.1, halfL],
          [leftOffset - 0.8, 0.1, halfL],
        ]}
        color="#e2c99a"
        lineWidth={1}
      />
      <Html position={[leftOffset, 0.2, 0]} center>
        <div className="px-2 py-0.5 rounded bg-black/90 border border-[#e2c99a] text-[#e2c99a] font-mono text-[10px] font-bold shadow-md whitespace-nowrap -rotate-90">
          LENGTH: {l.toFixed(1)}m
        </div>
      </Html>

      {/* 3. FOUR CORNER CAD DATUM CROSSHAIRS */}
      {[
        [-halfW, -halfL],
        [halfW, -halfL],
        [-halfW, halfL],
        [halfW, halfL],
      ].map(([cx, cz], idx) => (
        <group key={`corner-${idx}`} position={[cx, 0.1, cz]}>
          <Line
            points={[
              [-1, 0, 0],
              [1, 0, 0],
            ]}
            color="#94a3b8"
            lineWidth={1.5}
          />
          <Line
            points={[
              [0, 0, -1],
              [0, 0, 1],
            ]}
            color="#94a3b8"
            lineWidth={1.5}
          />
        </group>
      ))}

      {/* 4. NORTH ORIENTATION COMPASS ARROW */}
      <group position={[halfW + 4, 0.1, -halfL + 4]}>
        <Line
          points={[
            [0, 0, 2],
            [0, 0, -2],
          ]}
          color="#38bdf8"
          lineWidth={2.5}
        />
        <Line
          points={[
            [-0.7, 0, -1],
            [0, 0, -2],
            [0.7, 0, -1],
          ]}
          color="#38bdf8"
          lineWidth={2.5}
        />
        <Html position={[0, 0.2, -3]} center>
          <div className="text-[10px] font-mono font-bold text-sky-400 bg-black/80 px-1 rounded border border-sky-400/50">
            N
          </div>
        </Html>
      </group>
    </group>
  );
};
