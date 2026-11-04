import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { StallItem, MandapamVenue } from "@/types/planner3d";

interface CrowdFlowSimulationProps {
  venue: MandapamVenue;
  stalls: StallItem[];
  active: boolean;
}

interface GuestParticle {
  x: number;
  z: number;
  targetX: number;
  targetZ: number;
  speed: number;
  color: THREE.Color;
  stallIndex: number;
  phase: "entering" | "queued" | "eating" | "exiting";
  timer: number;
}

export const CrowdFlowSimulation: React.FC<CrowdFlowSimulationProps> = ({
  venue,
  stalls,
  active,
}) => {
  const pointsRef = useRef<THREE.Points | null>(null);
  const particleCount = 120;

  // Initialize guest crowd particles
  const guests = useMemo<GuestParticle[]>(() => {
    const list: GuestParticle[] = [];
    const servingStalls = stalls.filter((s) => s.type !== "dining_table");

    for (let i = 0; i < particleCount; i++) {
      const targetStall = servingStalls[i % servingStalls.length] || stalls[0];
      const startZ = venue.entrancePosition[2] - Math.random() * 3;
      const startX = (Math.random() - 0.5) * 6;

      list.push({
        x: startX,
        z: startZ,
        targetX: targetStall ? targetStall.position[0] + (Math.random() - 0.5) * 1.5 : 0,
        targetZ: targetStall ? targetStall.position[2] + (Math.random() - 0.5) * 1.5 : 0,
        speed: 0.04 + Math.random() * 0.03,
        color: new THREE.Color("#00f5d4"),
        stallIndex: i % servingStalls.length,
        phase: "entering",
        timer: Math.random() * 100,
      });
    }
    return list;
  }, [stalls, venue]);

  // Positions and Colors buffers
  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const col = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = guests[i].x;
      pos[i * 3 + 1] = 0.35; // slightly above floor
      pos[i * 3 + 2] = guests[i].z;

      col[i * 3] = 0.0;
      col[i * 3 + 1] = 0.96; // cyan
      col[i * 3 + 2] = 0.83;
    }
    return [pos, col];
  }, [guests]);

  useFrame(() => {
    if (!active || !pointsRef.current) return;
    const posAttr = pointsRef.current.geometry.attributes.position;
    const colAttr = pointsRef.current.geometry.attributes.color;
    const posArray = posAttr.array as Float32Array;
    const colArray = colAttr.array as Float32Array;

    const servingStalls = stalls.filter((s) => s.type !== "dining_table");

    for (let i = 0; i < particleCount; i++) {
      const g = guests[i];

      // Move toward target stall
      const dx = g.targetX - g.x;
      const dz = g.targetZ - g.z;
      const dist = Math.hypot(dx, dz);

      if (dist > 0.4) {
        g.x += (dx / dist) * g.speed;
        g.z += (dz / dist) * g.speed;
      } else {
        // Arrived at stall - transition to dining table or new stall
        g.timer += 1;
        if (g.timer > 80) {
          g.timer = 0;
          const nextStall = servingStalls[(g.stallIndex + 1) % servingStalls.length];
          if (nextStall) {
            g.stallIndex = (g.stallIndex + 1) % servingStalls.length;
            g.targetX = nextStall.position[0] + (Math.random() - 0.5) * 2;
            g.targetZ = nextStall.position[2] + (Math.random() - 0.5) * 2;
          } else {
            // Reset to entrance
            g.x = (Math.random() - 0.5) * 6;
            g.z = venue.entrancePosition[2];
          }
        }
      }

      // Update geometry buffers
      posArray[i * 3] = g.x;
      posArray[i * 3 + 1] = 0.35 + Math.sin(Date.now() * 0.005 + i) * 0.05;
      posArray[i * 3 + 2] = g.z;

      // Color coding: cyan when moving smoothly, amber when at live station
      if (dist <= 0.6) {
        colArray[i * 3] = 0.96; // Amber gold
        colArray[i * 3 + 1] = 0.70;
        colArray[i * 3 + 2] = 0.20;
      } else {
        colArray[i * 3] = 0.0; // Cyan flow
        colArray[i * 3 + 1] = 0.96;
        colArray[i * 3 + 2] = 0.83;
      }
    }

    posAttr.needsUpdate = true;
    colAttr.needsUpdate = true;
  });

  if (!active) return null;

  return (
    <group>
      {/* 3D Crowd Guest Particles */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particleCount}
            args={[positions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            count={particleCount}
            args={[colors, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.35}
          vertexColors
          transparent
          opacity={0.85}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Bottleneck Heatmap Rings at stalls */}
      {stalls
        .filter((s) => s.type === "dosa" || s.type === "buffet_spread" || s.type === "chaat")
        .map((stall) => (
          <mesh
            key={`heat-${stall.id}`}
            position={[stall.position[0], 0.03, stall.position[2]]}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <ringGeometry args={[1.8, 2.6, 32]} />
            <meshBasicMaterial
              color={stall.type === "dosa" ? "#10b981" : "#00f5d4"}
              transparent
              opacity={0.25}
              side={THREE.DoubleSide}
            />
          </mesh>
        ))}
    </group>
  );
};
