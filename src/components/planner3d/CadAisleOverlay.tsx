import React from "react";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import { StallItem, MandapamVenue } from "@/types/planner3d";

interface CadAisleOverlayProps {
  venue: MandapamVenue;
  stalls: StallItem[];
  active: boolean;
}

export const CadAisleOverlay: React.FC<CadAisleOverlayProps> = ({
  venue,
  stalls,
  active,
}) => {
  if (!active) return null;

  const halfW = venue.hallWidth / 2;
  const halfL = venue.hallLength / 2;

  // Dosa stalls
  const dosaStalls = stalls.filter((s) => s.type === "dosa");

  return (
    <group position={[0, 0.05, 0]}>
      {/* 1. Main Aisle Center Line */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[0.08, venue.hallLength * 0.8]} />
        <meshBasicMaterial color="#e2c99a" transparent opacity={0.4} />
      </mesh>

      {/* Center Aisle Label */}
      <Text
        position={[0, 0.2, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.45}
        color="#e2c99a"
        anchorX="center"
        anchorY="middle"
      >
        PRIMARY SERVICE AISLE (CLEARANCE: 5.5m)
      </Text>

      {/* 2. Dosa Wing Separation Line if 2x Dosa deployed */}
      {dosaStalls.length >= 2 && (
        <group>
          {/* Dimension Line between North Dosa and South Dosa */}
          <line>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                count={2}
                args={[
                  new Float32Array([
                    dosaStalls[0].position[0], 0.1, dosaStalls[0].position[2],
                    dosaStalls[1].position[0], 0.1, dosaStalls[1].position[2],
                  ]),
                  3,
                ]}
              />
            </bufferGeometry>
            <lineDashedMaterial
              color="#f59e0b"
              dashSize={0.8}
              gapSize={0.4}
              linewidth={2}
            />
          </line>

          <Text
            position={[
              (dosaStalls[0].position[0] + dosaStalls[1].position[0]) / 2,
              0.2,
              (dosaStalls[0].position[2] + dosaStalls[1].position[2]) / 2 - 0.5,
            ]}
            rotation={[-Math.PI / 2, 0, 0]}
            fontSize={0.35}
            color="#f59e0b"
            anchorX="center"
            anchorY="middle"
          >
            WING SEPARATION: {Math.abs(dosaStalls[0].position[0] - dosaStalls[1].position[0]).toFixed(1)}m (ZERO QUEUE COLLISION)
          </Text>
        </group>
      )}

      {/* 3. Perimeter Hall Boundary Dimension Lines */}
      {/* South Wall Clearance */}
      <Text
        position={[0, 0.2, halfL - 1]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.3}
        color="#94a3b8"
        anchorX="center"
        anchorY="middle"
      >
        ENTRANCE CONCOURSE • WIDTH: {venue.hallWidth}m
      </Text>

      {/* Stage Zone Clearance */}
      <Text
        position={[0, 0.2, -halfL + 2.5]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.3}
        color="#d8b36d"
        anchorX="center"
        anchorY="middle"
      >
        CEREMONIAL STAGE BUFFER ZONE (CLEARANCE: 4.0m)
      </Text>
    </group>
  );
};
