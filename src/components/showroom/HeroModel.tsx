import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";

export interface HotspotData {
  id: string;
  label: string;
  tag: string;
  position: [number, number, number];
  description: string;
  specs: { k: string; v: string }[];
}

export const SHOWROOM_HOTSPOTS: HotspotData[] = [
  {
    id: "tawa-core",
    label: "Induction Cast-Iron Griddle",
    tag: "THERMAL CORE",
    position: [0, 0.45, 0.7],
    description: "Multi-zone PID induction griddle maintaining precisely 185°C across 40 square feet for 1,200 dosas/hr continuous throughput.",
    specs: [
      { k: "Capacity", v: "1,200 / hr" },
      { k: "Thermal Stability", v: "±1.5°C" },
      { k: "Surface", v: "Seasoned Cast Iron" },
    ],
  },
  {
    id: "canopy-optics",
    label: "Architectural Focus Spotlight Array",
    tag: "LIGHTING",
    position: [0.95, 1.25, -0.4],
    description: "Warm 3200K CRI 98 directional spotlight beam precisely calibrated to illuminate culinary plating without blinding approaching guests.",
    specs: [
      { k: "Color Temp", v: "3200K Warm" },
      { k: "CRI", v: "98 Studio" },
      { k: "Beam Angle", v: "36° Spot" },
    ],
  },
  {
    id: "brass-chassis",
    label: "Titanium & Antique Brass Frame",
    tag: "MATERIALITY",
    position: [-0.95, 0.1, 0.5],
    description: "Aerospace titanium structural uprights electroplated in matte champagne brass with zero-screw seamless magnetic snap cladding.",
    specs: [
      { k: "Alloy", v: "Grade 5 Ti + Brass" },
      { k: "Finish", v: "Satin Micro-Bead" },
      { k: "Modularity", v: "Magnetic Snap-fit" },
    ],
  },
  {
    id: "queue-telemetry",
    label: "Crowd Flow & Signage Lintel",
    tag: "WAYFINDING",
    position: [0, 1.45, 0],
    description: "Overhead high-contrast LED wayfinding beam directing guests smoothly from entry to Dosa griddle, Idli steamer, and handwash bays.",
    specs: [
      { k: "Sightline", v: "360° Visual" },
      { k: "Contrast", v: "10,000:1" },
      { k: "Routing", v: "Zero-bottleneck" },
    ],
  },
];

interface HeroModelProps {
  activeHotspot: string | null;
  onSelectHotspot: (id: string | null) => void;
}

export const HeroModel: React.FC<HeroModelProps> = ({ activeHotspot, onSelectHotspot }) => {
  const rootGroup = useRef<THREE.Group | null>(null);
  const ringRef = useRef<THREE.Mesh | null>(null);
  const floatingAccents = useRef<THREE.Group | null>(null);

  useFrame((state, delta) => {
    // 1. Mouse pointer inertia tilt (subtle parallax)
    if (rootGroup.current) {
      const targetRotX = -state.pointer.y * 0.18;
      const targetRotY = state.pointer.x * 0.28;
      rootGroup.current.rotation.x = THREE.MathUtils.lerp(rootGroup.current.rotation.x, targetRotX, delta * 3);
      rootGroup.current.rotation.y = THREE.MathUtils.lerp(rootGroup.current.rotation.y, targetRotY, delta * 3);
    }

    // 2. Slow kinetic orbit of champagne accent ring
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 0.25;
      ringRef.current.rotation.x += delta * 0.12;
    }

    // 3. Subtle floating breathing motion
    if (floatingAccents.current) {
      floatingAccents.current.position.y = Math.sin(state.clock.elapsedTime * 1.5) * 0.05;
    }
  });

  return (
    <group ref={rootGroup}>
      {/* ── GROUND PEDESTAL / CYLINDER ──────────────────────────── */}
      <mesh position={[0, -0.9, 0]} receiveShadow>
        <cylinderGeometry args={[2.8, 3.2, 0.35, 64]} />
        <meshPhysicalMaterial
          color="#0b0d12"
          roughness={0.25}
          metalness={0.85}
          clearcoat={0.6}
          clearcoatRoughness={0.2}
          reflectivity={0.9}
        />
      </mesh>

      {/* Halo Glow Ring on Pedestal */}
      <mesh position={[0, -0.71, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.3, 2.5, 64]} />
        <meshBasicMaterial color="#e2c99a" transparent opacity={0.4} side={THREE.DoubleSide} />
      </mesh>

      {/* ── MAIN CATERING STAGE MONOLITH ──────────────────────── */}
      {/* Heavy obsidian stone counter base */}
      <mesh position={[0, -0.15, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.8, 1.1, 1.5]} />
        <meshPhysicalMaterial
          color="#12141c"
          roughness={0.35}
          metalness={0.7}
          clearcoat={0.4}
        />
      </mesh>

      {/* Top Brushed Titanium Griddle Deck */}
      <mesh position={[0, 0.42, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.95, 0.08, 1.65]} />
        <meshPhysicalMaterial
          color="#1d2029"
          metalness={0.95}
          roughness={0.12}
          clearcoat={0.9}
          clearcoatRoughness={0.1}
          reflectivity={1.0}
        />
      </mesh>

      {/* Cast Iron Hot Tawa Slabs (Twin griddle zones) */}
      {[-0.65, 0.65].map((xOffset, idx) => (
        <group key={idx} position={[xOffset, 0.47, 0]}>
          <mesh castShadow receiveShadow>
            <cylinderGeometry args={[0.55, 0.55, 0.04, 48]} />
            <meshStandardMaterial
              color="#2a2824"
              roughness={0.5}
              metalness={0.8}
            />
          </mesh>
          {/* Golden Sizzling Dosa Disc */}
          <mesh position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.42, 48]} />
            <meshStandardMaterial
              color="#e2c99a"
              emissive="#c5a059"
              emissiveIntensity={0.3}
              roughness={0.4}
            />
          </mesh>
        </group>
      ))}

      {/* ── ARCHITECTURAL PILLARS & CANOPY ──────────────────────── */}
      {/* 4 Corner Slim Titanium Columns */}
      {[
        [-1.3, -0.65],
        [1.3, -0.65],
        [-1.3, 0.65],
        [1.3, 0.65],
      ].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.7, z]} castShadow>
          <cylinderGeometry args={[0.035, 0.035, 1.8, 16]} />
          <meshPhysicalMaterial
            color="#e2c99a"
            metalness={0.95}
            roughness={0.15}
            clearcoat={0.7}
          />
        </mesh>
      ))}

      {/* Suspended Overhead Canopy Frame */}
      <group position={[0, 1.6, 0]} castShadow>
        <mesh>
          <boxGeometry args={[3.1, 0.08, 1.8]} />
          <meshPhysicalMaterial
            color="#0d0f15"
            metalness={0.85}
            roughness={0.2}
            clearcoat={0.8}
          />
        </mesh>

        {/* Ambient Under-Canopy Warm Light Sconce */}
        <mesh position={[0, -0.05, 0]}>
          <boxGeometry args={[2.7, 0.02, 1.4]} />
          <meshStandardMaterial
            color="#fff6e5"
            emissive="#e2c99a"
            emissiveIntensity={1.2}
          />
        </mesh>

        {/* BKR Laser-etched Signage Bar */}
        <mesh position={[0, 0.18, 0.92]}>
          <boxGeometry args={[2.2, 0.25, 0.04]} />
          <meshPhysicalMaterial
            color="#141720"
            metalness={0.9}
            roughness={0.2}
            clearcoat={0.5}
          />
        </mesh>
      </group>

      {/* ── FLOATING KINETIC AURA ACCENTS ──────────────────────── */}
      <group ref={floatingAccents}>
        {/* Orbiting Champagne Metallic Ring */}
        <mesh ref={ringRef} position={[0, 0.4, 0]}>
          <torusGeometry args={[2.2, 0.025, 32, 128]} />
          <meshPhysicalMaterial
            color="#e2c99a"
            metalness={1.0}
            roughness={0.1}
            clearcoat={1.0}
          />
        </mesh>
      </group>

      {/* ── 3D INTERACTIVE CLICK HOTSPOTS ──────────────────────── */}
      {SHOWROOM_HOTSPOTS.map((spot) => {
        const isSelected = activeHotspot === spot.id;

        return (
          <group key={spot.id} position={spot.position}>
            <Html distanceFactor={7} center position={[0, 0, 0]}>
              <div
                className="relative group cursor-pointer select-none"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectHotspot(isSelected ? null : spot.id);
                }}
              >
                {/* Hotspot Outer Kinetic Ring */}
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center backdrop-blur-md transition-all duration-500 ${
                    isSelected
                      ? "border-2 border-[#e2c99a] bg-[#e2c99a]/30 scale-125 shadow-[0_0_20px_rgba(226,201,154,0.8)]"
                      : "border border-white/30 bg-black/60 hover:scale-110 hover:border-[#e2c99a]"
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full transition-transform duration-300 ${
                      isSelected ? "bg-[#e2c99a] scale-125 animate-ping" : "bg-white group-hover:bg-[#e2c99a]"
                    }`}
                  />
                </div>

                {/* Micro Hover Tooltip Flag */}
                <div
                  className={`absolute left-9 top-1/2 -translate-y-1/2 whitespace-nowrap px-3 py-1.5 rounded-lg bg-[#0b0d13]/95 border border-white/10 backdrop-blur-xl shadow-2xl transition-all duration-300 pointer-events-none ${
                    isSelected
                      ? "opacity-100 translate-x-0 border-[#e2c99a]/50"
                      : "opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"
                  }`}
                >
                  <p className="text-[9px] font-mono font-bold tracking-widest text-[#e2c99a] uppercase">
                    {spot.tag}
                  </p>
                  <p className="text-xs font-semibold text-white tracking-wide">{spot.label}</p>
                </div>
              </div>
            </Html>
          </group>
        );
      })}
    </group>
  );
};
