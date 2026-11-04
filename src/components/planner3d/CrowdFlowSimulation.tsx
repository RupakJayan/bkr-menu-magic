import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { StallItem, MandapamVenue, GuestLifecyclePhase } from "@/types/planner3d";

interface CrowdFlowSimulationProps {
  venue: MandapamVenue;
  stalls: StallItem[];
  active: boolean;
}

interface GuestParticle {
  id: number;
  x: number;
  z: number;
  targetX: number;
  targetZ: number;
  speed: number;
  phase: GuestLifecyclePhase;
  timer: number;
  targetStallId?: string;
}

export const CrowdFlowSimulation: React.FC<CrowdFlowSimulationProps> = ({
  venue,
  stalls,
  active,
}) => {
  const pointsRef = useRef<THREE.Points | null>(null);
  const particleCount = 140;

  // Categorize stalls by phase
  const handwashStalls = useMemo(
    () => stalls.filter((s) => s.type === "handwash_station"),
    [stalls]
  );
  const welcomeStalls = useMemo(
    () => stalls.filter((s) => s.type === "sweet_halwa" || s.type === "beverage_bar"),
    [stalls]
  );
  const liveStalls = useMemo(
    () =>
      stalls.filter(
        (s) =>
          s.type === "dosa" ||
          s.type === "idli" ||
          s.type === "continental_pasta" ||
          s.type === "chaat" ||
          s.type === "buffet_spread" ||
          s.type === "custom_stall"
      ),
    [stalls]
  );
  const diningTables = useMemo(
    () => stalls.filter((s) => s.type === "dining_table"),
    [stalls]
  );
  const dessertStalls = useMemo(
    () => stalls.filter((s) => s.type === "dessert_icecream"),
    [stalls]
  );
  const exitStalls = useMemo(
    () => stalls.filter((s) => s.type === "tamboolam_beeda"),
    [stalls]
  );

  // Helper to pick a target stall with intelligent load balancing
  const pickTargetForPhase = (
    phase: GuestLifecyclePhase,
    guestId: number
  ): [number, number, string | undefined] => {
    if (phase === "handwash") {
      if (handwashStalls.length > 0) {
        const stall = handwashStalls[guestId % handwashStalls.length];
        return [
          stall.position[0] + (Math.random() - 0.5) * 1.5,
          stall.position[2] + 1.2,
          stall.id,
        ];
      }
      return [venue.entrancePosition[0] - 6, venue.entrancePosition[2] - 2, undefined];
    }

    if (phase === "welcome_sweet") {
      if (welcomeStalls.length > 0) {
        const stall = welcomeStalls[guestId % welcomeStalls.length];
        return [
          stall.position[0] + (Math.random() - 0.5) * 1.5,
          stall.position[2] + 1.3,
          stall.id,
        ];
      }
    }

    if (phase === "live_stalls") {
      // Intelligently balance across duplicated stalls (e.g. 2 Dosa counters: North Wing vs South Wing)
      const dosaCounters = stalls.filter((s) => s.type === "dosa");
      if (dosaCounters.length > 1 && guestId % 2 === 0) {
        // Split guests evenly between multiple dosa counters to eliminate bottlenecks
        const targetDosa = dosaCounters[guestId % dosaCounters.length];
        return [
          targetDosa.position[0] + (Math.random() - 0.5) * 1.8,
          targetDosa.position[2] + 1.4,
          targetDosa.id,
        ];
      }

      if (liveStalls.length > 0) {
        const stall = liveStalls[guestId % liveStalls.length];
        return [
          stall.position[0] + (Math.random() - 0.5) * 1.8,
          stall.position[2] + 1.4,
          stall.id,
        ];
      }
    }

    if (phase === "dining") {
      if (diningTables.length > 0) {
        const table = diningTables[guestId % diningTables.length];
        const angle = (guestId * 1.2) % (Math.PI * 2);
        return [
          table.position[0] + Math.cos(angle) * 1.2,
          table.position[2] + Math.sin(angle) * 1.2,
          table.id,
        ];
      }
      return [0, 0, undefined];
    }

    if (phase === "dessert") {
      if (dessertStalls.length > 0) {
        const stall = dessertStalls[guestId % dessertStalls.length];
        return [
          stall.position[0] + (Math.random() - 0.5) * 1.5,
          stall.position[2] + 1.2,
          stall.id,
        ];
      }
    }

    if (phase === "exit_wash") {
      if (exitStalls.length > 0) {
        const stall = exitStalls[guestId % exitStalls.length];
        return [
          stall.position[0] + (Math.random() - 0.5) * 1.2,
          stall.position[2] + 1.2,
          stall.id,
        ];
      }
      return [venue.entrancePosition[0], venue.entrancePosition[2] + 2, undefined];
    }

    // Default entrance
    return [
      venue.entrancePosition[0] + (Math.random() - 0.5) * 5,
      venue.entrancePosition[2],
      undefined,
    ];
  };

  // Initialize guest particles with staggered phases for a lively continuous simulation
  const guests = useMemo<GuestParticle[]>(() => {
    const list: GuestParticle[] = [];
    const phases: GuestLifecyclePhase[] = [
      "arrival",
      "handwash",
      "welcome_sweet",
      "live_stalls",
      "live_stalls",
      "dining",
      "dessert",
      "exit_wash",
    ];

    for (let i = 0; i < particleCount; i++) {
      const initialPhase = phases[i % phases.length];
      const [tx, tz, targetId] = pickTargetForPhase(initialPhase, i);
      const startX =
        initialPhase === "arrival"
          ? venue.entrancePosition[0] + (Math.random() - 0.5) * 6
          : tx + (Math.random() - 0.5) * 4;
      const startZ =
        initialPhase === "arrival"
          ? venue.entrancePosition[2]
          : tz + (Math.random() - 0.5) * 4;

      list.push({
        id: i,
        x: startX,
        z: startZ,
        targetX: tx,
        targetZ: tz,
        speed: 0.035 + Math.random() * 0.025,
        phase: initialPhase,
        timer: Math.random() * 90,
        targetStallId: targetId,
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
      pos[i * 3 + 1] = 0.35;
      pos[i * 3 + 2] = guests[i].z;

      col[i * 3] = 0.0;
      col[i * 3 + 1] = 0.96;
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

    for (let i = 0; i < particleCount; i++) {
      const g = guests[i];

      // Move toward phase target
      const dx = g.targetX - g.x;
      const dz = g.targetZ - g.z;
      const dist = Math.hypot(dx, dz);

      if (dist > 0.35) {
        g.x += (dx / dist) * g.speed;
        g.z += (dz / dist) * g.speed;
      } else {
        // At target location - dwell and advance lifecycle
        g.timer += 1;
        const dwellTime = g.phase === "dining" ? 140 : 80;

        if (g.timer > dwellTime) {
          g.timer = 0;

          // South Indian Wedding Banquet Ritual Sequence
          let nextPhase: GuestLifecyclePhase = "arrival";
          if (g.phase === "arrival") nextPhase = "handwash";
          else if (g.phase === "handwash") nextPhase = "welcome_sweet";
          else if (g.phase === "welcome_sweet") nextPhase = "live_stalls";
          else if (g.phase === "live_stalls") nextPhase = "dining";
          else if (g.phase === "dining") nextPhase = "dessert";
          else if (g.phase === "dessert") nextPhase = "exit_wash";
          else if (g.phase === "exit_wash") {
            // Re-enter as a new guest
            nextPhase = "arrival";
            g.x = venue.entrancePosition[0] + (Math.random() - 0.5) * 5;
            g.z = venue.entrancePosition[2];
          }

          g.phase = nextPhase;
          const [nxtX, nxtZ, nextTargetId] = pickTargetForPhase(nextPhase, g.id);
          g.targetX = nxtX;
          g.targetZ = nxtZ;
          g.targetStallId = nextTargetId;
        }
      }

      // Buffer coordinates with gentle organic breathing
      posArray[i * 3] = g.x;
      posArray[i * 3 + 1] = 0.35 + Math.sin(Date.now() * 0.004 + i) * 0.04;
      posArray[i * 3 + 2] = g.z;

      // Color coding per lifecycle ritual:
      // Handwash: Aquamarine (#14b8a6)
      // Live Counters: Hot Amber (#f59e0b)
      // Dining: Emerald Green (#10b981)
      // Tamboolam / Exit: Auspicious Rose (#f43f5e)
      // Transitioning: Lusion Cyan (#e2c99a)
      if (g.phase === "handwash") {
        colArray[i * 3] = 0.08;
        colArray[i * 3 + 1] = 0.72;
        colArray[i * 3 + 2] = 0.65;
      } else if (g.phase === "live_stalls") {
        colArray[i * 3] = 0.96;
        colArray[i * 3 + 1] = 0.62;
        colArray[i * 3 + 2] = 0.04;
      } else if (g.phase === "dining") {
        colArray[i * 3] = 0.06;
        colArray[i * 3 + 1] = 0.72;
        colArray[i * 3 + 2] = 0.51;
      } else if (g.phase === "exit_wash") {
        colArray[i * 3] = 0.95;
        colArray[i * 3 + 1] = 0.25;
        colArray[i * 3 + 2] = 0.37;
      } else {
        colArray[i * 3] = 0.0;
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
          size={0.42}
          vertexColors
          transparent
          opacity={0.88}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Balanced Load Heatmap Rings at key counters */}
      {stalls
        .filter(
          (s) =>
            s.type === "dosa" ||
            s.type === "handwash_station" ||
            s.type === "buffet_spread" ||
            s.type === "tamboolam_beeda"
        )
        .map((stall) => (
          <mesh
            key={`heat-${stall.id}`}
            position={[stall.position[0], 0.03, stall.position[2]]}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <ringGeometry args={[1.5, 2.4, 32]} />
            <meshBasicMaterial
              color={
                stall.type === "handwash_station"
                  ? "#14b8a6"
                  : stall.type === "dosa"
                  ? "#f59e0b"
                  : stall.type === "tamboolam_beeda"
                  ? "#f43f5e"
                  : "#e2c99a"
              }
              transparent
              opacity={0.28}
              side={THREE.DoubleSide}
            />
          </mesh>
        ))}
    </group>
  );
};
