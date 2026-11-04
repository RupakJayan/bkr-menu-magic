import React, { useMemo } from "react";
import { Line, Text } from "@react-three/drei";
import { StallItem, MandapamVenue } from "@/types/planner3d";

interface MagneticAlignmentOverlayProps {
  venue: MandapamVenue;
  stalls: StallItem[];
  selectedStallId: string | null;
  active?: boolean;
  isModalOpen?: boolean;
}

export const MagneticAlignmentOverlay: React.FC<MagneticAlignmentOverlayProps> = ({
  venue,
  stalls,
  selectedStallId,
  active = true,
  isModalOpen = false,
}) => {
  // Suppress all 3D overlays when not active, no stall selected, or any modal is open
  if (!active || !selectedStallId || isModalOpen) return null;

  const selectedStall = stalls.find((s) => s.id === selectedStallId);
  if (!selectedStall) return null;

  const [sx, , sz] = selectedStall.position;
  const halfL = venue.hallLength / 2;

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

  return (
    <group position={[0, 0.05, 0]}>
      {/* 1. Center Symmetry Axis Vector Line on Ground */}
      {isNearCenterAxis && (
        <group>
          <Line
            points={[
              [0, 0.06, -halfL + 2],
              [0, 0.06, halfL - 2],
            ]}
            color="#e2c99a"
            lineWidth={2}
            dashed
            dashScale={2}
            dashSize={0.8}
            gapSize={0.4}
          />
          <Text
            position={[0, 0.08, sz]}
            rotation={[-Math.PI / 2, 0, 0]}
            fontSize={0.28}
            color="#e2c99a"
            anchorX="center"
            anchorY="middle"
          >
            ◈ CENTERLINE (X = 0.00m)
          </Text>
        </group>
      )}

      {/* 2. Neighbor Stall Alignment Snap Lines on Ground */}
      {neighboringAlignments.map((align, idx) => {
        const [ox, , oz] = align.otherStall.position;
        return (
          <group key={`align-${idx}`}>
            <Line
              points={[
                [sx, 0.07, sz],
                [ox, 0.07, oz],
              ]}
              color="#38bdf8"
              lineWidth={1.8}
              dashed
              dashScale={3}
              dashSize={0.6}
              gapSize={0.3}
            />
            <Text
              position={[(sx + ox) / 2, 0.09, (sz + oz) / 2]}
              rotation={[-Math.PI / 2, 0, 0]}
              fontSize={0.24}
              color="#38bdf8"
              anchorX="center"
              anchorY="middle"
            >
              {`ALIGN (${align.dist.toFixed(1)}m gap)`}
            </Text>
          </group>
        );
      })}

      {/* 3. Subtle Distance vector to Ceremonial Stage along Floor */}
      <group>
        <Line
          points={[
            [sx, 0.06, sz],
            [sx, 0.06, stageZ],
          ]}
          color="#c084fc"
          lineWidth={1.2}
          dashed
          dashScale={2}
          dashSize={0.5}
          gapSize={0.5}
        />
        <Text
          position={[sx + 0.35, 0.08, (sz + stageZ) / 2]}
          rotation={[-Math.PI / 2, 0, -Math.PI / 2]}
          fontSize={0.22}
          color="#c084fc"
          anchorX="center"
          anchorY="middle"
        >
          {`STAGE: ${distToStage}m`}
        </Text>
      </group>
    </group>
  );
};
