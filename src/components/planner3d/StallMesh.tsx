import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import { StallItem } from "@/types/planner3d";

interface StallMeshProps {
  stall: StallItem;
  isSelected: boolean;
  onSelect: (stall: StallItem) => void;
  onMove?: (id: string, newPos: [number, number, number]) => void;
}

export const StallMesh: React.FC<StallMeshProps> = ({
  stall,
  isSelected,
  onSelect,
}) => {
  const steamRef = useRef<THREE.Points | null>(null);

  // Subtle floating steam animation for live cooking stalls (Dosa, Idli, Sweet)
  useFrame(({ clock }) => {
    if (steamRef.current && (stall.type === "dosa" || stall.type === "idli" || stall.type === "sweet_halwa")) {
      const positions = steamRef.current.geometry.attributes.position.array as Float32Array;
      const t = clock.getElapsedTime() * 1.5;
      for (let i = 1; i < positions.length; i += 3) {
        positions[i] = 1.2 + ((positions[i] + 0.015) % 0.8);
      }
      steamRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  const [w, d, h] = [stall.width, stall.depth, stall.height];

  // Steam particle setup for hot counters
  const steamCount = 18;
  const steamPositions = React.useMemo(() => {
    const pos = new Float32Array(steamCount * 3);
    for (let i = 0; i < steamCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * (w * 0.7);
      pos[i * 3 + 1] = 1.1 + Math.random() * 0.7;
      pos[i * 3 + 2] = (Math.random() - 0.5) * (d * 0.6);
    }
    return pos;
  }, [w, d]);

  return (
    <group
      position={stall.position}
      rotation={[0, stall.rotation, 0]}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(stall);
      }}
    >
      {/* Selection Glow / Ring */}
      {isSelected && (
        <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[Math.max(w, d) * 0.65, Math.max(w, d) * 0.75, 32]} />
          <meshBasicMaterial color="#00f5d4" side={THREE.DoubleSide} transparent opacity={0.8} />
        </mesh>
      )}

      {/* Counter Base / Table */}
      <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
        <boxGeometry args={[w, 0.9, d]} />
        <meshStandardMaterial
          color={isSelected ? "#00f5d4" : stall.color}
          roughness={0.35}
          metalness={0.2}
        />
      </mesh>

      {/* Counter Top Surface (Polished Granite / Stainless Steel) */}
      <mesh position={[0, 0.92, 0]} receiveShadow>
        <boxGeometry args={[w + 0.1, 0.06, d + 0.1]} />
        <meshStandardMaterial
          color={stall.type === "dosa" ? "#94a3b8" : "#1e293b"}
          roughness={0.15}
          metalness={stall.type === "dosa" ? 0.8 : 0.4}
        />
      </mesh>

      {/* Canopy Poles */}
      {stall.type !== "dining_table" && (
        <>
          <mesh position={[-w / 2 + 0.08, h / 2, -d / 2 + 0.08]} castShadow>
            <cylinderGeometry args={[0.03, 0.03, h, 8]} />
            <meshStandardMaterial color="#b78a4b" metalness={0.8} roughness={0.2} />
          </mesh>
          <mesh position={[w / 2 - 0.08, h / 2, -d / 2 + 0.08]} castShadow>
            <cylinderGeometry args={[0.03, 0.03, h, 8]} />
            <meshStandardMaterial color="#b78a4b" metalness={0.8} roughness={0.2} />
          </mesh>
          <mesh position={[-w / 2 + 0.08, h / 2, d / 2 - 0.08]} castShadow>
            <cylinderGeometry args={[0.03, 0.03, h, 8]} />
            <meshStandardMaterial color="#b78a4b" metalness={0.8} roughness={0.2} />
          </mesh>
          <mesh position={[w / 2 - 0.08, h / 2, d / 2 - 0.08]} castShadow>
            <cylinderGeometry args={[0.03, 0.03, h, 8]} />
            <meshStandardMaterial color="#b78a4b" metalness={0.8} roughness={0.2} />
          </mesh>

          {/* Roof Canopy / Marquee */}
          <mesh position={[0, h, 0]} castShadow>
            <boxGeometry args={[w + 0.2, 0.18, d + 0.2]} />
            <meshStandardMaterial
              color={stall.accentColor}
              roughness={0.5}
            />
          </mesh>

          {/* Glowing Header Signage Plate */}
          <mesh position={[0, h + 0.2, 0]}>
            <boxGeometry args={[w * 0.8, 0.25, 0.04]} />
            <meshStandardMaterial
              color="#0c0d16"
              emissive={stall.accentColor}
              emissiveIntensity={0.25}
            />
          </mesh>

          {/* Signboard Text */}
          <Text
            position={[0, h + 0.2, 0.03]}
            fontSize={0.16}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
            maxWidth={w * 0.75}
          >
            {stall.name}
          </Text>
        </>
      )}

      {/* Specific 3D Props per Stall Type */}
      {/* 1. Live Dosa Tawa Griddle */}
      {stall.type === "dosa" && (
        <group position={[0, 0.96, 0]}>
          {/* Iron Flat Tawa */}
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <boxGeometry args={[w * 0.65, d * 0.7, 0.03]} />
            <meshStandardMaterial color="#1f2937" metalness={0.9} roughness={0.3} />
          </mesh>
          {/* Golden Dosa on griddle */}
          <mesh position={[0, 0.025, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.26, 24]} />
            <meshStandardMaterial color="#fcd34d" roughness={0.6} />
          </mesh>
          {/* Chutney Bowls */}
          <mesh position={[w * 0.38, 0.06, 0.2]}>
            <cylinderGeometry args={[0.09, 0.07, 0.1, 16]} />
            <meshStandardMaterial color="#e2e8f0" metalness={0.7} />
          </mesh>
          <mesh position={[w * 0.38, 0.06, 0]}>
            <cylinderGeometry args={[0.09, 0.07, 0.1, 16]} />
            <meshStandardMaterial color="#ef4444" metalness={0.7} />
          </mesh>
          <mesh position={[w * 0.38, 0.06, -0.2]}>
            <cylinderGeometry args={[0.09, 0.07, 0.1, 16]} />
            <meshStandardMaterial color="#22c55e" metalness={0.7} />
          </mesh>
        </group>
      )}

      {/* 2. Idli Steamer */}
      {stall.type === "idli" && (
        <group position={[0, 0.96, 0]}>
          {/* Steamer Cauldron */}
          <mesh position={[-0.4, 0.2, 0]}>
            <cylinderGeometry args={[0.24, 0.24, 0.4, 20]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.85} roughness={0.15} />
          </mesh>
          <mesh position={[0.4, 0.2, 0]}>
            <cylinderGeometry args={[0.24, 0.24, 0.4, 20]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.85} roughness={0.15} />
          </mesh>
        </group>
      )}

      {/* 3. Live Sweet & Halwa Brass Uruli */}
      {stall.type === "sweet_halwa" && (
        <group position={[0, 0.96, 0]}>
          {/* Big Brass Uruli */}
          <mesh position={[0, 0.18, 0]}>
            <sphereGeometry args={[0.42, 24, 16, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} />
            <meshStandardMaterial color="#d97706" metalness={0.9} roughness={0.2} side={THREE.DoubleSide} />
          </mesh>
          {/* Hot Glowing Halwa Inside */}
          <mesh position={[0, 0.22, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.38, 24]} />
            <meshStandardMaterial
              color="#b45309"
              roughness={0.4}
              emissive="#d97706"
              emissiveIntensity={0.25}
            />
          </mesh>
        </group>
      )}

      {/* 4. Dining Table with Chairs */}
      {stall.type === "dining_table" && (
        <group>
          {/* Round Table Top */}
          <mesh position={[0, 0.74, 0]}>
            <cylinderGeometry args={[1.0, 1.0, 0.05, 32]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.3} />
          </mesh>
          {/* Center Table Base Pedestal */}
          <mesh position={[0, 0.37, 0]}>
            <cylinderGeometry args={[0.15, 0.25, 0.74, 16]} />
            <meshStandardMaterial color="#334155" metalness={0.7} />
          </mesh>
          {/* Flower Centerpiece */}
          <mesh position={[0, 0.85, 0]}>
            <cylinderGeometry args={[0.08, 0.06, 0.16, 12]} />
            <meshStandardMaterial color="#d8b36d" metalness={0.8} />
          </mesh>
          <mesh position={[0, 0.98, 0]}>
            <sphereGeometry args={[0.14, 12, 12]} />
            <meshStandardMaterial color="#ec4899" />
          </mesh>
          {/* 6 Banquet Chairs around table */}
          {[0, 1, 2, 3, 4, 5].map((idx) => {
            const angle = (idx * Math.PI * 2) / 6;
            const cx = Math.cos(angle) * 1.35;
            const cz = Math.sin(angle) * 1.35;
            return (
              <group key={idx} position={[cx, 0, cz]} rotation={[0, -angle + Math.PI / 2, 0]}>
                {/* Chair Seat */}
                <mesh position={[0, 0.45, 0]}>
                  <boxGeometry args={[0.42, 0.06, 0.42]} />
                  <meshStandardMaterial color="#762934" />
                </mesh>
                {/* Chair Back */}
                <mesh position={[0, 0.75, -0.19]}>
                  <boxGeometry args={[0.4, 0.55, 0.04]} />
                  <meshStandardMaterial color="#762934" />
                </mesh>
                {/* Chair Legs */}
                <mesh position={[0, 0.22, 0]}>
                  <cylinderGeometry args={[0.02, 0.02, 0.44, 8]} />
                  <meshStandardMaterial color="#d8b36d" metalness={0.8} />
                </mesh>
              </group>
            );
          })}
        </group>
      )}

      {/* Rising Steam Particles for Cooking Stalls */}
      {(stall.type === "dosa" || stall.type === "idli" || stall.type === "sweet_halwa") && (
        <points ref={steamRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={steamCount}
              args={[steamPositions, 3]}
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.12}
            color="#ffffff"
            transparent
            opacity={0.4}
            blending={THREE.AdditiveBlending}
          />
        </points>
      )}
    </group>
  );
};
