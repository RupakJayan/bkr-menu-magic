import React, { useMemo } from "react";
import { Line, Html } from "@react-three/drei";
import * as THREE from "three";
import { StallItem, MandapamVenue } from "@/types/planner3d";

interface MagneticAlignmentOverlayProps {
  venue: MandapamVenue;
  stalls: StallItem[];
  selectedStallId: string | null;
  active?: boolean;
}

export const MagneticAlignmentOverlay: React.FC<MagneticAlignmentOverlayProps> = ({
  venue,
  stalls,
  selectedStallId,
  active = true,
}) => {
  if (!active || !selectedStallId) return null;

  const selectedStall = stalls.find((s) => s.id === selectedStallId);
  if (!selectedStall) return null;

  const [sx, sy, sz] = selectedStall.position;
  const sw = selectedStall.width || 3.0;
  const sd = selectedStall.depth || 1.8;
  const sh = selectedStall.height || 2.4;

  const halfL = venue.hallLength / 2;
  const halfW = venue.hallWidth / 2;

  // 1. Check proximity to Center Symmetry Axis (X = 0)
  const isNearCenterAxis = Math.abs(sx) <= 1.2;

  // 2. Check alignment with other stalls (within 1.2m)
  const neighboringAlignments = useMemo(() => {
    const list: {
      type: "x" | "z";
      otherStall: StallItem;
      dist: number;
    }[] = [];

    for (const other of stalls) {
      if (other.id === selectedStall.id) continue;
      const [ox, , oz] = other.position;

      // X-axis colinear alignment
      if (Math.abs(sx - ox) <= 1.2) {
        list.push({ type: "x", otherStall: other, dist: Math.abs(sz - oz) });
      }
      // Z-axis collinear alignment
      if (Math.abs(sz - oz) <= 1.2) {
        list.push({ type: "z", otherStall: other, dist: Math.abs(sx - ox) });
      }
    }
    return list;
  }, [stalls, selectedStall, sx, sz]);

  // Distance to Stage
  const stageZ = venue.stagePosition[2];
  const distToStage = Math.abs(sz - stageZ).toFixed(1);

  // Perimeter Egress check (fire lane)
  const distToWallX = Math.min(halfW - Math.abs(sx) - sw / 2, halfW);
  const isEgressTight = distToWallX < 2.5;

  return (
    <group position={[0, 0.05, 0]}>
      {/* 1. Center Symmetry Axis Vector Line */}
      {isNearCenterAxis && (
        <group>
          <Line
            points={[
              [0, 0.1, -halfL + 2],
              [0, 0.1, halfL - 2],
            ]}
            color="#e2c99a"
            lineWidth={2.5}
            dashed
            dashScale={2}
            dashSize={0.8}
            gapSize={0.4}
          />
          <Html position={[0, 0.3, sz]} center>
            <div className="px-2 py-0.5 rounded bg-black/85 border border-[#e2c99a]/60 text-[9px] font-mono text-[#e2c99a] font-bold shadow-lg pointer-events-none whitespace-nowrap animate-pulse">
              ◈ HALL CENTERLINE (X = 0.00m)
            </div>
          </Html>
        </group>
      )}

      {/* 2. Neighbor Stall Alignment Snap Lines */}
      {neighboringAlignments.map((align, idx) => {
        const [ox, , oz] = align.otherStall.position;
        return (
          <group key={`align-${idx}`}>
            <Line
              points={[
                [sx, 0.15, sz],
                [ox, 0.15, oz],
              ]}
              color="#38bdf8"
              lineWidth={2}
              dashed
              dashScale={3}
              dashSize={0.6}
              gapSize={0.3}
            />
            <Html position={[(sx + ox) / 2, 0.4, (sz + oz) / 2]} center>
              <div className="px-2 py-0.5 rounded bg-[#0b1524]/90 border border-sky-400/60 text-[9px] font-mono text-sky-300 font-bold shadow-md pointer-events-none whitespace-nowrap">
                ALIGN ({align.dist.toFixed(1)}m gap)
              </div>
            </Html>
          </group>
        );
      })}

      {/* 3. Distance vector to Ceremonial Stage */}
      <Line
        points={[
          [sx, 0.08, sz],
          [sx, 0.08, stageZ],
        ]}
        color="#c084fc"
        lineWidth={1.5}
        dashed
        dashScale={2}
        dashSize={0.5}
        gapSize={0.5}
      />

      {/* 4. Live Caliper Dimension HUD floating over stall */}
      <Html position={[sx, sh + 0.8, sz]} center>
        <div className="p-2.5 rounded-xl bg-[#090b12]/95 border border-[#e2c99a]/70 text-[#f4efe6] shadow-2xl font-mono text-[10px] pointer-events-none select-none backdrop-blur-xl min-w-[190px]">
          <div className="flex items-center justify-between border-b border-white/10 pb-1 mb-1">
            <span className="font-bold text-white uppercase text-[11px] truncate">
              {selectedStall.name}
            </span>
            <span className="text-[#e2c99a] font-bold">
              {selectedStall.rotationAngle}°
            </span>
          </div>

          <div className="grid grid-cols-3 gap-1 text-[9px] text-neutral-300 mb-1">
            <div>
              <span className="text-neutral-500 block">WIDTH</span>
              <strong className="text-white">{sw}m</strong>
            </div>
            <div>
              <span className="text-neutral-500 block">DEPTH</span>
              <strong className="text-white">{sd}m</strong>
            </div>
            <div>
              <span className="text-neutral-500 block">HEIGHT</span>
              <strong className="text-white">{sh}m</strong>
            </div>
          </div>

          <div className="flex items-center justify-between text-[9px] pt-1 border-t border-white/[0.08] text-neutral-400">
            <span>POS: [{sx.toFixed(1)}, {sz.toFixed(1)}]m</span>
            <span>STAGE: {distToStage}m</span>
          </div>

          {isEgressTight && (
            <div className="mt-1 px-1.5 py-0.5 rounded bg-rose-500/20 border border-rose-500/40 text-rose-300 text-[8px] font-bold text-center">
              ⚠ EGRESS FIRE LANE &lt; 2.5m
            </div>
          )}
        </div>
      </Html>
    </group>
  );
};
