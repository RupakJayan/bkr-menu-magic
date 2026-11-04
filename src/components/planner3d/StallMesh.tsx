import React, { useRef, useState, useEffect, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import { StallItem } from "@/types/planner3d";
import { assetUrl } from "@/utils/assetUrl";

interface StallMeshProps {
  stall: StallItem;
  isSelected: boolean;
  isDragging?: boolean;
  onSelect: (stall: StallItem) => void;
  onStartDrag?: (id: string) => void;
  onMove?: (id: string, newPos: [number, number, number]) => void;
  showFocusLights?: boolean;
}

const StallDimensionCalipers3D: React.FC<{
  w: number;
  d: number;
  h: number;
  isSelected: boolean;
  isRound?: boolean;
}> = ({ w, d, isSelected, isRound = false }) => {
  const caliperColor = isSelected ? "#c5a059" : "#38bdf8";

  if (isRound) {
    const r = w / 2;
    return (
      <group position={[0, 0, 0]}>
        {/* Circular Caliper Ring */}
        <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[r * 1.06, r * 1.06 + 0.035, 48]} />
          <meshBasicMaterial color={caliperColor} side={THREE.DoubleSide} />
        </mesh>
        {/* Diameter Dimension Label */}
        <Text
          position={[0, 0.04, r + 0.38]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.22}
          color={caliperColor}
          anchorX="center"
          anchorY="middle"
        >
          {`|← ⌀ ${w.toFixed(1)}m DIAMETER →|`}
        </Text>
      </group>
    );
  }

  return (
    <group position={[0, 0, 0]}>
      {/* 1. Width Dimension Caliper Line on Floor (Front of Stall) */}
      <group position={[0, 0.03, d / 2 + 0.4]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[w, 0.015, 0.015]} />
          <meshBasicMaterial color={caliperColor} />
        </mesh>
        <mesh position={[-w / 2, 0, 0]}>
          <boxGeometry args={[0.015, 0.015, 0.12]} />
          <meshBasicMaterial color={caliperColor} />
        </mesh>
        <mesh position={[w / 2, 0, 0]}>
          <boxGeometry args={[0.015, 0.015, 0.12]} />
          <meshBasicMaterial color={caliperColor} />
        </mesh>
        <Text
          position={[0, 0.03, 0.12]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.22}
          color={caliperColor}
          anchorX="center"
          anchorY="middle"
        >
          {`|← ${w.toFixed(1)}m →|`}
        </Text>
      </group>

      {/* 2. Depth Dimension Caliper Line on Floor (Right Flank of Stall) */}
      <group position={[w / 2 + 0.4, 0.03, 0]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.015, 0.015, d]} />
          <meshBasicMaterial color={caliperColor} />
        </mesh>
        <mesh position={[0, 0, -d / 2]}>
          <boxGeometry args={[0.12, 0.015, 0.015]} />
          <meshBasicMaterial color={caliperColor} />
        </mesh>
        <mesh position={[0, 0, d / 2]}>
          <boxGeometry args={[0.12, 0.015, 0.015]} />
          <meshBasicMaterial color={caliperColor} />
        </mesh>
        <Text
          position={[0.12, 0.03, 0]}
          rotation={[-Math.PI / 2, 0, -Math.PI / 2]}
          fontSize={0.22}
          color={caliperColor}
          anchorX="center"
          anchorY="middle"
        >
          {`|← ${d.toFixed(1)}m →|`}
        </Text>
      </group>

      {/* 3. Safety Clearance Ring on Floor */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[Math.max(w, d) * 0.68, Math.max(w, d) * 0.72 + 0.04, 32]} />
        <meshBasicMaterial
          color={caliperColor}
          side={THREE.DoubleSide}
          transparent
          opacity={0.5}
        />
      </mesh>
    </group>
  );
};

/**
 * Flickering Brass Kuthu Vilakku (Traditional South Indian Oil Lamp) with Dynamic Light
 */
const FlickeringVilakkuLamp: React.FC<{ position: [number, number, number] }> = ({ position }) => {
  const flameRef = useRef<THREE.PointLight | null>(null);
  useFrame(({ clock }) => {
    if (flameRef.current) {
      const t = clock.getElapsedTime() * 12;
      flameRef.current.intensity = 0.8 + Math.sin(t) * 0.2 + Math.cos(t * 1.5) * 0.15;
    }
  });

  return (
    <group position={position}>
      {/* Base dish / stand */}
      <mesh position={[0, 0.04, 0]}>
        <cylinderGeometry args={[0.16, 0.2, 0.08, 24]} />
        <meshStandardMaterial color="#d97706" metalness={0.92} roughness={0.16} />
      </mesh>
      {/* Tiered Stem */}
      <mesh position={[0, 0.35, 0]}>
        <cylinderGeometry args={[0.03, 0.04, 0.55, 16]} />
        <meshStandardMaterial color="#d97706" metalness={0.92} roughness={0.16} />
      </mesh>
      {/* Decorative stem rings */}
      <mesh position={[0, 0.2, 0]}>
        <torusGeometry args={[0.06, 0.015, 8, 16]} />
        <meshStandardMaterial color="#d97706" metalness={0.95} />
      </mesh>
      <mesh position={[0, 0.45, 0]}>
        <torusGeometry args={[0.06, 0.015, 8, 16]} />
        <meshStandardMaterial color="#d97706" metalness={0.95} />
      </mesh>
      {/* Top 5-Wick Oil Cup */}
      <mesh position={[0, 0.65, 0]}>
        <cylinderGeometry args={[0.15, 0.08, 0.08, 20]} />
        <meshStandardMaterial color="#d97706" metalness={0.92} roughness={0.16} />
      </mesh>
      {/* Auspicious Anna Pakshi / Peacock Crest */}
      <mesh position={[0, 0.74, 0]}>
        <coneGeometry args={[0.04, 0.1, 8]} />
        <meshStandardMaterial color="#d97706" metalness={0.95} />
      </mesh>
      {/* Glowing Warm Flame Tip */}
      <mesh position={[0, 0.7, 0]}>
        <coneGeometry args={[0.025, 0.06, 8]} />
        <meshBasicMaterial color="#fef08a" />
      </mesh>
      <pointLight
        ref={flameRef}
        position={[0, 0.74, 0]}
        color="#f59e0b"
        intensity={0.9}
        distance={2.5}
      />
    </group>
  );
};

/**
 * 3D Sculpted Gold and Silver Deity Statue with Halo and Kasu Malai
 */
const SculptedDeityStatue: React.FC<{
  position: [number, number, number];
  primaryGold: string;
  accentSilver: string;
}> = ({ position, primaryGold, accentSilver }) => {
  return (
    <group position={position}>
      {/* 1. Pure Sterling Silver Lotus Base (கமலாசனம்) */}
      <mesh position={[0, 0.08, 0]}>
        <cylinderGeometry args={[0.34, 0.4, 0.16, 24]} />
        <meshStandardMaterial color={accentSilver} metalness={0.96} roughness={0.08} />
      </mesh>
      {/* Lotus petals ring around base */}
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
        const a = (i * Math.PI * 2) / 8;
        return (
          <mesh
            key={i}
            position={[Math.cos(a) * 0.36, 0.14, Math.sin(a) * 0.36]}
            rotation={[0, -a, Math.PI / 6]}
          >
            <coneGeometry args={[0.06, 0.14, 4]} />
            <meshStandardMaterial color={accentSilver} metalness={0.95} roughness={0.1} />
          </mesh>
        );
      })}

      {/* 2. Panchaloha Gold Sanctum Deity Figure */}
      {/* Lower Body & Pleated Silk Dhoti (பீதாம்பரம்) */}
      <mesh position={[0, 0.36, 0]}>
        <cylinderGeometry args={[0.18, 0.26, 0.4, 18]} />
        <meshStandardMaterial color={primaryGold} metalness={0.92} roughness={0.14} />
      </mesh>
      {/* Silver Waist Belt (ஒட்டியாணம்) */}
      <mesh position={[0, 0.52, 0]}>
        <torusGeometry args={[0.2, 0.02, 8, 20]} />
        <meshStandardMaterial color={accentSilver} metalness={0.98} roughness={0.05} />
      </mesh>

      {/* Torso & Auspicious Garland (காசு மாலை & திருவாபரணம்) */}
      <mesh position={[0, 0.72, 0]}>
        <boxGeometry args={[0.28, 0.36, 0.18]} />
        <meshStandardMaterial color={primaryGold} metalness={0.92} roughness={0.14} />
      </mesh>
      {/* Silver Kasu Malai Garland across chest */}
      <mesh position={[0, 0.74, 0.09]}>
        <torusGeometry args={[0.13, 0.018, 8, 16, Math.PI]} />
        <meshStandardMaterial color={accentSilver} metalness={0.98} roughness={0.05} />
      </mesh>

      {/* Arms: Left Abhaya Mudra & Right Varada Mudra */}
      <mesh position={[-0.2, 0.7, 0]} rotation={[0, 0, Math.PI / 5]}>
        <cylinderGeometry args={[0.04, 0.045, 0.28, 12]} />
        <meshStandardMaterial color={primaryGold} metalness={0.92} />
      </mesh>
      <mesh position={[0.2, 0.7, 0]} rotation={[0, 0, -Math.PI / 5]}>
        <cylinderGeometry args={[0.04, 0.045, 0.28, 12]} />
        <meshStandardMaterial color={primaryGold} metalness={0.92} />
      </mesh>

      {/* Divine Head with Gold Kiritam / Mukut Crown (கிரீடம்) */}
      <mesh position={[0, 1.02, 0]}>
        <sphereGeometry args={[0.11, 20, 16]} />
        <meshStandardMaterial color={primaryGold} metalness={0.92} roughness={0.12} />
      </mesh>
      {/* Towering Ornate Gold Temple Crown */}
      <mesh position={[0, 1.25, 0]}>
        <coneGeometry args={[0.1, 0.36, 16]} />
        <meshStandardMaterial color={primaryGold} metalness={0.95} roughness={0.08} />
      </mesh>
      {/* Silver Crown Jewel Ring */}
      <mesh position={[0, 1.15, 0]}>
        <torusGeometry args={[0.1, 0.015, 8, 16]} />
        <meshStandardMaterial color={accentSilver} metalness={0.98} />
      </mesh>

      {/* 3. Glowing Prabhavali Sun Halo Arch (பிரபாவளி / திருவாசி) */}
      <mesh position={[0, 0.85, -0.06]}>
        <torusGeometry args={[0.48, 0.035, 16, 32, Math.PI]} />
        <meshStandardMaterial
          color={primaryGold}
          metalness={0.95}
          roughness={0.1}
          emissive={primaryGold}
          emissiveIntensity={0.35}
        />
      </mesh>
      {/* Prabhavali Radiating Sun Flames / Rays */}
      {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => {
        const a = (i * Math.PI) / 8;
        const rx = -Math.cos(a) * 0.52;
        const ry = 0.85 + Math.sin(a) * 0.52;
        return (
          <mesh key={i} position={[rx, ry, -0.06]} rotation={[0, 0, -a + Math.PI / 2]}>
            <coneGeometry args={[0.025, 0.09, 6]} />
            <meshStandardMaterial
              color={primaryGold}
              metalness={0.95}
              emissive={primaryGold}
              emissiveIntensity={0.4}
            />
          </mesh>
        );
      })}
    </group>
  );
};

/**
 * True 3D Round Rotunda 360° Island Kiosk
 */
const RoundRotundaMesh: React.FC<{
  w: number;
  d: number;
  h: number;
  isSelected: boolean;
  primaryColor: string;
  accentColor: string;
  stallName: string;
  customTexture?: THREE.Texture | null;
}> = ({ w, h, isSelected, primaryColor, accentColor, stallName }) => {
  const radius = Math.max(1.2, w / 2);

  return (
    <group position={[0, 0, 0]}>
      {/* 1. Cylindrical Base Counter (360° Circular Island) */}
      <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[radius * 0.98, radius, 0.9, 48]} />
        <meshStandardMaterial
          color={isSelected ? "#e2c99a" : primaryColor}
          roughness={0.25}
          metalness={0.65}
        />
      </mesh>

      {/* 2. Top Countertop (Polished Italian Black Granite) */}
      <mesh position={[0, 0.92, 0]} receiveShadow>
        <cylinderGeometry args={[radius * 1.06, radius * 1.06, 0.06, 48]} />
        <meshStandardMaterial color="#0f172a" roughness={0.12} metalness={0.8} />
      </mesh>

      {/* 3. Circular Perimeter Brass Footrest Rail */}
      <mesh position={[0, 0.08, 0]}>
        <torusGeometry args={[radius * 1.04, 0.025, 16, 48]} />
        <meshStandardMaterial color="#d4af37" metalness={0.92} roughness={0.15} />
      </mesh>

      {/* 4. Four Radial Fluted Brass Columns */}
      {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((angle, idx) => {
        const colR = radius * 0.82;
        const cx = Math.cos(angle) * colR;
        const cz = Math.sin(angle) * colR;
        return (
          <group key={idx} position={[cx, h / 2, cz]}>
            {/* Column Shaft */}
            <mesh castShadow>
              <cylinderGeometry args={[0.045, 0.045, h, 16]} />
              <meshStandardMaterial color="#b78a4b" metalness={0.88} roughness={0.18} />
            </mesh>
            {/* Ornate Base & Capital Rings */}
            <mesh position={[0, -h / 2 + 0.1, 0]}>
              <torusGeometry args={[0.07, 0.02, 8, 16]} />
              <meshStandardMaterial color="#d4af37" metalness={0.95} />
            </mesh>
            <mesh position={[0, h / 2 - 0.1, 0]}>
              <torusGeometry args={[0.07, 0.02, 8, 16]} />
              <meshStandardMaterial color="#d4af37" metalness={0.95} />
            </mesh>
          </group>
        );
      })}

      {/* 5. 3D Conical Canopy Roof in Auspicious Festival Silk */}
      <mesh position={[0, h + 0.35, 0]} castShadow>
        <coneGeometry args={[radius * 1.18, 0.75, 48]} />
        <meshStandardMaterial color={accentColor} roughness={0.45} />
      </mesh>

      {/* Scalloped Silk Valance Ring along Roof Edge */}
      <mesh position={[0, h - 0.02, 0]}>
        <cylinderGeometry args={[radius * 1.18, radius * 1.18, 0.16, 48, 1, true]} />
        <meshStandardMaterial
          color="#d4af37"
          metalness={0.8}
          roughness={0.25}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* 6. Center Showcase Brass Uruli with Water & Floating Lotus */}
      <group position={[0, 0.95, 0]}>
        <mesh position={[0, 0.14, 0]}>
          <sphereGeometry args={[0.34, 24, 16, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} />
          <meshStandardMaterial
            color="#d97706"
            metalness={0.92}
            roughness={0.15}
            side={THREE.DoubleSide}
          />
        </mesh>
        <mesh position={[0, 0.17, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.31, 24]} />
          <meshStandardMaterial color="#38bdf8" roughness={0.1} transparent opacity={0.7} />
        </mesh>
        {/* Floating Lotus in Uruli */}
        <mesh position={[0, 0.19, 0]}>
          <sphereGeometry args={[0.1, 12, 12]} />
          <meshStandardMaterial color="#ec4899" />
        </mesh>
      </group>

      {/* 7. Circular Ring Signage Header */}
      <group position={[0, h + 0.8, 0]}>
        <mesh>
          <cylinderGeometry args={[radius * 0.7, radius * 0.7, 0.22, 32, 1, true]} />
          <meshStandardMaterial
            color="#090b12"
            emissive={accentColor}
            emissiveIntensity={0.25}
            side={THREE.DoubleSide}
          />
        </mesh>
        <Text
          position={[0, 0, radius * 0.71]}
          fontSize={0.2}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          {stallName}
        </Text>
      </group>
    </group>
  );
};

/**
 * Grand Swarna Mandapam & Gold-Silver Temple Shrine
 */
const TempleMandapamShrineMesh: React.FC<{
  w: number;
  d: number;
  h: number;
  primaryGold: string;
  accentSilver: string;
  stallName: string;
  customTexture?: THREE.Texture | null;
}> = ({ w, d, h, primaryGold, accentSilver, stallName, customTexture }) => {
  return (
    <group position={[0, 0, 0]}>
      {/* 1. Stepped Black Granite Plinth (3 Tiers) */}
      <mesh position={[0, 0.08, 0]} castShadow receiveShadow>
        <boxGeometry args={[w, 0.16, d]} />
        <meshStandardMaterial color="#0f172a" roughness={0.2} metalness={0.7} />
      </mesh>
      <mesh position={[0, 0.22, 0]} castShadow receiveShadow>
        <boxGeometry args={[w * 0.92, 0.14, d * 0.92]} />
        <meshStandardMaterial color="#1e293b" roughness={0.2} metalness={0.75} />
      </mesh>
      {/* Gold Trim Bevel on Tier 2 */}
      <mesh position={[0, 0.29, 0]}>
        <boxGeometry args={[w * 0.93, 0.02, d * 0.93]} />
        <meshStandardMaterial color={primaryGold} metalness={0.92} />
      </mesh>
      <mesh position={[0, 0.36, 0]} castShadow receiveShadow>
        <boxGeometry args={[w * 0.84, 0.14, d * 0.84]} />
        <meshStandardMaterial color="#0f172a" roughness={0.2} metalness={0.8} />
      </mesh>

      {/* 2. Four Heavy Carved Dravidian Stone & Teak Columns */}
      {[
        [-w * 0.36, -d * 0.34],
        [w * 0.36, -d * 0.34],
        [-w * 0.36, d * 0.34],
        [w * 0.36, d * 0.34],
      ].map(([cx, cz], idx) => (
        <group key={idx} position={[cx, h / 2, cz]}>
          {/* Base pedestal */}
          <mesh position={[0, -h / 2 + 0.5, 0]} castShadow>
            <boxGeometry args={[0.22, 0.26, 0.22]} />
            <meshStandardMaterial color="#1e293b" metalness={0.8} />
          </mesh>
          {/* Fluted column shaft */}
          <mesh castShadow>
            <cylinderGeometry args={[0.07, 0.075, h - 0.7, 16]} />
            <meshStandardMaterial color="#b78a4b" metalness={0.9} roughness={0.16} />
          </mesh>
          {/* Carved Yali bracket capital */}
          <mesh position={[0, h / 2 - 0.2, 0]} castShadow>
            <boxGeometry args={[0.26, 0.16, 0.26]} />
            <meshStandardMaterial color={primaryGold} metalness={0.95} />
          </mesh>
        </group>
      ))}

      {/* 3. Mandap Back Wall / Sanctum Niche */}
      <group position={[0, h / 2 + 0.1, -d * 0.32]}>
        <mesh>
          <boxGeometry args={[w * 0.74, h * 0.65, 0.06]} />
          <meshStandardMaterial color="#18181b" metalness={0.6} roughness={0.4} />
        </mesh>
        {/* If user uploaded a photo, display inside sacred gold sanctum frame */}
        {customTexture && (
          <mesh position={[0, 0, 0.04]}>
            <planeGeometry args={[w * 0.68, h * 0.58]} />
            <meshBasicMaterial map={customTexture} />
          </mesh>
        )}
      </group>

      {/* 4. Sculpted Gold & Silver Deity Statue */}
      <SculptedDeityStatue
        position={[0, 0.44, -d * 0.06]}
        primaryGold={primaryGold}
        accentSilver={accentSilver}
      />

      {/* 5. Twin Flickering Brass Kuthu Vilakku Lamps */}
      <FlickeringVilakkuLamp position={[-w * 0.35, 0.44, d * 0.22]} />
      <FlickeringVilakkuLamp position={[w * 0.35, 0.44, d * 0.22]} />

      {/* 6. Tiered Temple Gopuram / Vimana Canopy Top */}
      <group position={[0, h + 0.1, 0]}>
        {/* Tier 1 Roof */}
        <mesh position={[0, 0.1, 0]} castShadow>
          <boxGeometry args={[w * 0.86, 0.2, d * 0.86]} />
          <meshStandardMaterial color="#78350f" roughness={0.4} />
        </mesh>
        {/* Gold eaves cornice */}
        <mesh position={[0, 0.21, 0]}>
          <boxGeometry args={[w * 0.88, 0.03, d * 0.88]} />
          <meshStandardMaterial color={primaryGold} metalness={0.92} />
        </mesh>
        {/* Tier 2 Roof */}
        <mesh position={[0, 0.32, 0]} castShadow>
          <boxGeometry args={[w * 0.68, 0.18, d * 0.68]} />
          <meshStandardMaterial color="#78350f" roughness={0.4} />
        </mesh>
        {/* Tier 3 Roof */}
        <mesh position={[0, 0.5, 0]} castShadow>
          <boxGeometry args={[w * 0.5, 0.16, d * 0.5]} />
          <meshStandardMaterial color={primaryGold} metalness={0.9} roughness={0.2} />
        </mesh>

        {/* 3 Auspicious Brass Kalasams along Top Ridge */}
        {[-0.45, 0, 0.45].map((kx, ki) => (
          <group key={ki} position={[kx, 0.68, 0]}>
            <mesh position={[0, 0, 0]}>
              <cylinderGeometry args={[0.07, 0.09, 0.14, 16]} />
              <meshStandardMaterial color={primaryGold} metalness={0.95} />
            </mesh>
            <mesh position={[0, 0.12, 0]}>
              <coneGeometry args={[0.05, 0.16, 16]} />
              <meshStandardMaterial color={primaryGold} metalness={0.95} />
            </mesh>
          </group>
        ))}
      </group>

      {/* 7. Mandapam Arch Header Signage */}
      <group position={[0, h + 0.02, d * 0.34]}>
        <mesh>
          <boxGeometry args={[w * 0.72, 0.24, 0.06]} />
          <meshStandardMaterial
            color="#0c0d16"
            emissive={primaryGold}
            emissiveIntensity={0.3}
          />
        </mesh>
        <Text
          position={[0, 0, 0.04]}
          fontSize={0.16}
          color="#fef08a"
          anchorX="center"
          anchorY="middle"
          maxWidth={w * 0.68}
        >
          {stallName}
        </Text>
      </group>
    </group>
  );
};

/**
 * Heritage Temple Chariot Cart with 3D Spoked Wheels
 */
const HeritageChariotCartMesh: React.FC<{
  w: number;
  d: number;
  h: number;
  stallName: string;
}> = ({ w, d, h, stallName }) => {
  return (
    <group position={[0, 0, 0]}>
      {/* 1. Teakwood Cart Chassis */}
      <mesh position={[0, 0.48, 0]} castShadow receiveShadow>
        <boxGeometry args={[w * 0.88, 0.22, d * 0.85]} />
        <meshStandardMaterial color="#854d0e" roughness={0.35} metalness={0.2} />
      </mesh>
      {/* Brass corner brackets */}
      <mesh position={[0, 0.6, 0]}>
        <boxGeometry args={[w * 0.9, 0.03, d * 0.87]} />
        <meshStandardMaterial color="#d4af37" metalness={0.9} />
      </mesh>

      {/* 2. Two Large 3D Spoked Wooden Wheels on Sides */}
      {[-w / 2 + 0.04, w / 2 - 0.04].map((wx, wi) => (
        <group key={wi} position={[wx, 0.48, 0]} rotation={[0, 0, Math.PI / 2]}>
          {/* Wheel rim */}
          <mesh castShadow>
            <torusGeometry args={[0.46, 0.04, 16, 32]} />
            <meshStandardMaterial color="#854d0e" roughness={0.4} />
          </mesh>
          {/* Outer iron tire */}
          <mesh>
            <torusGeometry args={[0.48, 0.015, 8, 32]} />
            <meshStandardMaterial color="#1e293b" metalness={0.9} />
          </mesh>
          {/* Central brass hub */}
          <mesh>
            <cylinderGeometry args={[0.09, 0.09, 0.14, 16]} />
            <meshStandardMaterial color="#d4af37" metalness={0.95} />
          </mesh>
          {/* 12 Radial Spokes */}
          {[0, 1, 2, 3, 4, 5].map((si) => (
            <mesh key={si} rotation={[0, 0, (si * Math.PI) / 6]}>
              <cylinderGeometry args={[0.018, 0.018, 0.9, 8]} />
              <meshStandardMaterial color="#a16207" roughness={0.3} />
            </mesh>
          ))}
        </group>
      ))}

      {/* 3. Canopy Pillars */}
      {[
        [-w * 0.35, -d * 0.35],
        [w * 0.35, -d * 0.35],
        [-w * 0.35, d * 0.35],
        [w * 0.35, d * 0.35],
      ].map(([cx, cz], idx) => (
        <mesh key={idx} position={[cx, h / 2 + 0.2, cz]} castShadow>
          <cylinderGeometry args={[0.035, 0.035, h - 0.4, 8]} />
          <meshStandardMaterial color="#d4af37" metalness={0.88} />
        </mesh>
      ))}

      {/* 4. Arched Festival Pandal Awning Roof */}
      <mesh position={[0, h + 0.15, 0]} castShadow>
        <cylinderGeometry args={[w * 0.52, w * 0.54, d * 0.95, 32, 1, false, 0, Math.PI]} rotation={[0, 0, -Math.PI / 2]} />
        <meshStandardMaterial color="#ea580c" roughness={0.5} />
      </mesh>

      {/* 5. Cart Header Plate */}
      <mesh position={[0, h + 0.35, d * 0.4]}>
        <boxGeometry args={[w * 0.7, 0.22, 0.04]} />
        <meshStandardMaterial color="#0c0d16" emissive="#eab308" emissiveIntensity={0.3} />
      </mesh>
      <Text
        position={[0, h + 0.35, d * 0.43]}
        fontSize={0.16}
        color="#fef08a"
        anchorX="center"
        anchorY="middle"
      >
        {stallName}
      </Text>
    </group>
  );
};

/**
 * Concentric Stepped Brass Uruli Display Pavilion
 */
const SteppedUruliPavilionMesh: React.FC<{
  w: number;
  h: number;
  stallName: string;
}> = ({ w, h, stallName }) => {
  return (
    <group position={[0, 0, 0]}>
      {/* Tier 1: Large Bottom Uruli (1.2m diameter) */}
      <mesh position={[0, 0.25, 0]} castShadow>
        <sphereGeometry args={[0.6, 24, 16, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} />
        <meshStandardMaterial color="#d97706" metalness={0.92} roughness={0.16} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0.28, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.56, 24]} />
        <meshStandardMaterial color="#38bdf8" roughness={0.1} transparent opacity={0.7} />
      </mesh>

      {/* Center Pedestal Stem */}
      <mesh position={[0, 0.55, 0]}>
        <cylinderGeometry args={[0.14, 0.2, 0.5, 16]} />
        <meshStandardMaterial color="#d97706" metalness={0.9} />
      </mesh>

      {/* Tier 2: Middle Uruli (0.8m diameter) */}
      <mesh position={[0, 0.8, 0]} castShadow>
        <sphereGeometry args={[0.42, 24, 16, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} />
        <meshStandardMaterial color="#d97706" metalness={0.92} roughness={0.16} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0.82, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.39, 24]} />
        <meshStandardMaterial color="#38bdf8" roughness={0.1} transparent opacity={0.7} />
      </mesh>

      {/* Tier 3: Top Uruli (0.5m diameter) */}
      <mesh position={[0, 1.15, 0]} castShadow>
        <sphereGeometry args={[0.26, 20, 16, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} />
        <meshStandardMaterial color="#d97706" metalness={0.95} roughness={0.14} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 1.28, 0]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color="#f59e0b" emissive="#d97706" emissiveIntensity={0.4} />
      </mesh>

      {/* 4 Corner Brass Vilakku Oil Lamps */}
      {[
        [-0.75, -0.75],
        [0.75, -0.75],
        [-0.75, 0.75],
        [0.75, 0.75],
      ].map(([vx, vz], idx) => (
        <FlickeringVilakkuLamp key={idx} position={[vx, 0, vz]} />
      ))}

      {/* Header Sign Plate */}
      <group position={[0, h + 0.1, 0]}>
        <mesh>
          <boxGeometry args={[w * 0.7, 0.22, 0.04]} />
          <meshStandardMaterial color="#0c0d16" emissive="#d97706" emissiveIntensity={0.3} />
        </mesh>
        <Text position={[0, 0, 0.03]} fontSize={0.16} color="#ffffff" anchorX="center">
          {stallName}
        </Text>
      </group>
    </group>
  );
};

export const StallMesh: React.FC<StallMeshProps> = ({
  stall,
  isSelected,
  isDragging = false,
  onSelect,
  onStartDrag,
  showFocusLights = true,
}) => {
  const steamRef = useRef<THREE.Points | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const elevationGroupRef = useRef<THREE.Group | null>(null);

  // Smooth Physics Elevation Lift on Hover, Drag & Selection
  useFrame((_, delta) => {
    if (elevationGroupRef.current) {
      const targetY = isDragging ? 0.32 : isSelected ? 0.14 : isHovered ? 0.08 : 0.0;
      elevationGroupRef.current.position.y = THREE.MathUtils.damp(
        elevationGroupRef.current.position.y,
        targetY,
        14,
        delta
      );
    }
  });

  // Subtle floating steam animation for live cooking stalls (Dosa, Idli, Sweet)
  useFrame(({ clock }) => {
    if (steamRef.current && (stall.type === "dosa" || stall.type === "idli" || stall.type === "sweet_halwa")) {
      const positions = steamRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 1; i < positions.length; i += 3) {
        positions[i] = 1.2 + ((positions[i] + 0.015) % 0.8);
      }
      steamRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  const [w, d, h] = [stall.width, stall.depth, stall.height];

  // Steam particle setup for hot counters
  const steamCount = 18;
  const steamPositions = useMemo(() => {
    const pos = new Float32Array(steamCount * 3);
    for (let i = 0; i < steamCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * (w * 0.7);
      pos[i * 3 + 1] = 1.1 + Math.random() * 0.7;
      pos[i * 3 + 2] = (Math.random() - 0.5) * (d * 0.6);
    }
    return pos;
  }, [w, d]);

  // Custom photo billboard texture if stall was generated from uploaded photo
  const customTexture = useMemo(() => {
    if (!stall.customPhotoUrl) return null;
    const loader = new THREE.TextureLoader();
    const tex = loader.load(stall.customPhotoUrl);
    tex.wrapS = THREE.ClampToEdgeWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    return tex;
  }, [stall.customPhotoUrl]);

  // Custom dining table linen / optical illusion texture
  const tableTexture = useMemo(() => {
    if (!stall.customTableTextureUrl) return null;
    const loader = new THREE.TextureLoader();
    const tex = loader.load(stall.customTableTextureUrl);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(2, 2);
    return tex;
  }, [stall.customTableTextureUrl]);

  // HTML5 Video Texture for BKR Catering 3D Video Wall & Reel Screen
  const [videoTexture, setVideoTexture] = useState<THREE.VideoTexture | null>(null);
  useEffect(() => {
    if (stall.type === "bkr_video_wall") {
      const video = document.createElement("video");
      video.src = assetUrl("/bkr-logo-intro.mp4");
      video.crossOrigin = "anonymous";
      video.loop = true;
      video.muted = true;
      video.playsInline = true;
      video.autoplay = true;
      video.play().catch(() => {});

      const texture = new THREE.VideoTexture(video);
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.format = THREE.RGBAFormat;
      setVideoTexture(texture);

      return () => {
        video.pause();
        video.removeAttribute("src");
        video.load();
      };
    }
  }, [stall.type]);

  const isLiveCounter =
    stall.type === "dosa" ||
    stall.type === "idli" ||
    stall.type === "sweet_halwa" ||
    stall.type === "continental_pasta" ||
    stall.type === "buffet_spread" ||
    stall.type === "custom_stall";

  // Check 3D Model Shape Architecture
  const customShape = stall.customModelSpec?.shape;
  const nameLower = stall.name.toLowerCase();

  const isRound =
    customShape === "cylindrical_rotunda" ||
    (!customShape &&
      (nameLower.includes("round") ||
        nameLower.includes("rotunda") ||
        nameLower.includes("circular") ||
        (stall.type === "custom_stall" && Math.abs(w - d) < 0.1)));

  const isTempleMandapam =
    customShape === "temple_mandapam_shrine" ||
    (!customShape &&
      (nameLower.includes("temple") ||
        nameLower.includes("mandapam") ||
        nameLower.includes("statue") ||
        nameLower.includes("shrine") ||
        nameLower.includes("swarna") ||
        nameLower.includes("gold") ||
        nameLower.includes("amman") ||
        nameLower.includes("vasavi") ||
        nameLower.includes("idol")));

  const isChariot =
    customShape === "heritage_chariot_cart" ||
    (!customShape &&
      (nameLower.includes("chariot") ||
        nameLower.includes("cart") ||
        nameLower.includes("rath") ||
        nameLower.includes("ther")));

  const isUruliDisplay =
    customShape === "stepped_pyramid_uruli" ||
    (!customShape &&
      (nameLower.includes("uruli") || nameLower.includes("stepped")));

  const isCustomOrSpec = stall.type === "custom_stall" || !!stall.customModelSpec;

  return (
    <group
      position={stall.position}
      rotation={[0, stall.rotation, 0]}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(stall);
      }}
      onPointerDown={(e) => {
        if (e.button !== 0) return;
        e.stopPropagation();
        onSelect(stall);
        onStartDrag?.(stall.id);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setIsHovered(true);
        document.body.style.cursor = isDragging ? "grabbing" : "grab";
      }}
      onPointerOut={() => {
        setIsHovered(false);
        document.body.style.cursor = "default";
      }}
    >
      {/* Dynamic Floor Contact Shadow */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[w * 1.15, d * 1.15]} />
        <meshBasicMaterial
          color="#000000"
          transparent
          opacity={isDragging ? 0.2 : isHovered || isSelected ? 0.35 : 0.6}
        />
      </mesh>

      {/* 3D CAD Ground Calipers & Safety Ring */}
      {(isHovered || isSelected || isDragging) && (
        <StallDimensionCalipers3D
          w={w}
          d={d}
          h={h}
          isSelected={isSelected || isDragging}
          isRound={isRound}
        />
      )}

      {/* Elevating Physical Mesh Group with Smooth Spring Physics */}
      <group ref={elevationGroupRef}>
        {/* Selection Glow / Ring */}
        {isSelected && (
          <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[Math.max(w, d) * 0.65, Math.max(w, d) * 0.75, 32]} />
            <meshBasicMaterial color="#e2c99a" side={THREE.DoubleSide} transparent opacity={0.8} />
          </mesh>
        )}

        {/* 1. Dustbin Mesh */}
        {stall.type === "dustbin" ? (
          <group position={[0, 0, 0]}>
            <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[0.26, 0.28, 0.88, 24]} />
              <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.2} />
            </mesh>
            <mesh position={[0, 0.91, 0]}>
              <cylinderGeometry args={[0.28, 0.27, 0.06, 24]} />
              <meshStandardMaterial color="#cbd5e1" metalness={0.95} roughness={0.15} />
            </mesh>
            <mesh position={[0, 0.96, 0]}>
              <boxGeometry args={[0.12, 0.04, 0.03]} />
              <meshStandardMaterial color="#d8b36d" metalness={0.9} />
            </mesh>
            <mesh position={[0, 0.04, 0.28]}>
              <boxGeometry args={[0.14, 0.03, 0.1]} />
              <meshStandardMaterial color="#cbd5e1" metalness={0.9} />
            </mesh>
            <mesh position={[0, 0.52, 0.27]} rotation={[0, 0, 0]}>
              <circleGeometry args={[0.08, 16]} />
              <meshBasicMaterial color="#22c55e" />
            </mesh>
            <Text position={[0, 1.15, 0]} fontSize={0.13} color="#22c55e" anchorX="center">
              WASTE BIN
            </Text>
          </group>
        ) : stall.type === "bkr_video_wall" ? (
          /* 2. BKR Catering 3D Video Wall & Reel Screen */
          <group position={[0, 0, 0]}>
            <mesh position={[-w / 2 + 0.2, h / 2, 0]} castShadow>
              <boxGeometry args={[0.2, h, 0.4]} />
              <meshStandardMaterial color="#1e293b" metalness={0.9} />
            </mesh>
            <mesh position={[w / 2 - 0.2, h / 2, 0]} castShadow>
              <boxGeometry args={[0.2, h, 0.4]} />
              <meshStandardMaterial color="#1e293b" metalness={0.9} />
            </mesh>
            <mesh position={[0, h / 2 + 0.2, 0]} castShadow>
              <boxGeometry args={[w, h * 0.85, 0.15]} />
              <meshStandardMaterial color="#05070e" roughness={0.3} metalness={0.8} />
            </mesh>
            <mesh position={[0, h / 2 + 0.2, 0.08]}>
              <boxGeometry args={[w + 0.08, h * 0.85 + 0.08, 0.02]} />
              <meshStandardMaterial color="#d8b36d" metalness={0.9} roughness={0.1} />
            </mesh>
            <mesh position={[0, h / 2 + 0.2, 0.1]}>
              <planeGeometry args={[w * 0.94, h * 0.78]} />
              {videoTexture ? (
                <meshBasicMaterial map={videoTexture} />
              ) : (
                <meshStandardMaterial color="#0c0d16" emissive="#d8b36d" emissiveIntensity={0.2} />
              )}
            </mesh>
            <mesh position={[0, h + 0.45, 0]}>
              <boxGeometry args={[w * 0.7, 0.35, 0.06]} />
              <meshStandardMaterial color="#0c0d16" emissive="#d8b36d" emissiveIntensity={0.4} />
            </mesh>
            <Text
              position={[0, h + 0.45, 0.04]}
              fontSize={0.22}
              color="#fef08a"
              anchorX="center"
              anchorY="middle"
            >
              BKR CATERING & EVENTS
            </Text>
            <Text
              position={[0, 0.25, 0.12]}
              fontSize={0.14}
              color="#d4af37"
              anchorX="center"
              anchorY="middle"
            >
              Instagram: @bkr_events_ • Live Reel Highlights
            </Text>
          </group>
        ) : isCustomOrSpec && isRound ? (
          /* 3A. TRUE 3D CYLINDRICAL ROTUNDA ROUND KIOSK (Pakka 360° Circular Island) */
          <RoundRotundaMesh
            w={w}
            d={d}
            h={h}
            isSelected={isSelected}
            primaryColor={stall.customModelSpec?.materials.primaryColor || stall.color || "#1e293b"}
            accentColor={stall.customModelSpec?.materials.accentColor || stall.accentColor || "#f0c889"}
            stallName={stall.name}
            customTexture={customTexture}
          />
        ) : isCustomOrSpec && isTempleMandapam ? (
          /* 3B. GRAND SWARNA MANDAPAM & GOLD-SILVER STATUE SHRINE */
          <TempleMandapamShrineMesh
            w={w}
            d={d}
            h={h}
            primaryGold={stall.customModelSpec?.materials.primaryColor || "#d4af37"}
            accentSilver={stall.customModelSpec?.materials.accentColor || "#f1f5f9"}
            stallName={stall.name}
            customTexture={customTexture}
          />
        ) : isCustomOrSpec && isChariot ? (
          /* 3C. HERITAGE TEMPLE CHARIOT (RATH) CART WITH 3D WHEELS */
          <HeritageChariotCartMesh w={w} d={d} h={h} stallName={stall.name} />
        ) : isCustomOrSpec && isUruliDisplay ? (
          /* 3D. PANCHALOHA CONCENTRIC STEPPED URULI PAVILION */
          <SteppedUruliPavilionMesh w={w} h={h} stallName={stall.name} />
        ) : (
          /* 4. Standard Food / Beverage Stalls with Counter, Canopy & Focus Lights */
          <>
            <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
              <boxGeometry args={[w, 0.9, d]} />
              <meshStandardMaterial
                color={isSelected ? "#e2c99a" : stall.color}
                roughness={0.35}
                metalness={0.2}
              />
            </mesh>

            <mesh position={[0, 0.92, 0]} receiveShadow>
              <boxGeometry args={[w + 0.1, 0.06, d + 0.1]} />
              <meshStandardMaterial
                color={stall.type === "dosa" ? "#94a3b8" : "#1e293b"}
                roughness={0.15}
                metalness={stall.type === "dosa" ? 0.8 : 0.4}
              />
            </mesh>

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

                <mesh position={[0, h, 0]} castShadow>
                  <boxGeometry args={[w + 0.2, 0.18, d + 0.2]} />
                  <meshStandardMaterial color={stall.accentColor} roughness={0.5} />
                </mesh>

                <mesh position={[0, h + 0.2, 0]}>
                  <boxGeometry args={[w * 0.8, 0.25, 0.04]} />
                  <meshStandardMaterial
                    color="#0c0d16"
                    emissive={stall.accentColor}
                    emissiveIntensity={0.25}
                  />
                </mesh>

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

            {/* Custom live station shadowbox if custom texture is present on rectangular counter */}
            {stall.type === "custom_stall" && customTexture && (
              <mesh position={[0, 0.45, d / 2 + 0.01]}>
                <planeGeometry args={[w * 0.88, 0.78]} />
                <meshBasicMaterial map={customTexture} />
              </mesh>
            )}

            {isLiveCounter && showFocusLights && (
              <group position={[0, h + 0.5, d * 0.5]}>
                <mesh rotation={[Math.PI / 4, 0, 0]}>
                  <cylinderGeometry args={[0.06, 0.12, 0.18, 12]} />
                  <meshStandardMaterial color="#1e293b" metalness={0.9} />
                </mesh>
                <spotLight
                  position={[0, 0, 0]}
                  target-position={[0, -h, -d * 0.5]}
                  intensity={2.2}
                  angle={0.5}
                  penumbra={0.5}
                  distance={6}
                  color={stall.type === "dosa" ? "#fed7aa" : stall.type === "sweet_halwa" ? "#fde047" : "#e2c99a"}
                />
              </group>
            )}
          </>
        )}

        {/* Specific 3D Props per Stall Type */}
        {stall.type === "dosa" && (
          <group position={[0, 0.96, 0]}>
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
              <boxGeometry args={[w * 0.65, d * 0.7, 0.03]} />
              <meshStandardMaterial color="#1f2937" metalness={0.9} roughness={0.3} />
            </mesh>
            <mesh position={[0, 0.025, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <circleGeometry args={[0.26, 24]} />
              <meshStandardMaterial color="#fcd34d" roughness={0.6} />
            </mesh>
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

        {stall.type === "idli" && (
          <group position={[0, 0.96, 0]}>
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

        {stall.type === "sweet_halwa" && (
          <group position={[0, 0.96, 0]}>
            <mesh position={[0, 0.18, 0]}>
              <sphereGeometry args={[0.42, 24, 16, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} />
              <meshStandardMaterial color="#d97706" metalness={0.9} roughness={0.2} side={THREE.DoubleSide} />
            </mesh>
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

        {stall.type === "dining_table" && (
          <group>
            <mesh position={[0, 0.74, 0]}>
              <cylinderGeometry args={[1.0, 1.0, 0.05, 32]} />
              <meshStandardMaterial
                color={tableTexture ? "#ffffff" : "#f8fafc"}
                map={tableTexture || undefined}
                roughness={0.35}
              />
            </mesh>
            <mesh position={[0, 0.37, 0]}>
              <cylinderGeometry args={[0.15, 0.25, 0.74, 16]} />
              <meshStandardMaterial color="#334155" metalness={0.7} />
            </mesh>
            <mesh position={[0, 0.85, 0]}>
              <cylinderGeometry args={[0.08, 0.06, 0.16, 12]} />
              <meshStandardMaterial color="#d8b36d" metalness={0.8} />
            </mesh>
            <mesh position={[0, 0.98, 0]}>
              <sphereGeometry args={[0.14, 12, 12]} />
              <meshStandardMaterial color="#ec4899" />
            </mesh>
            {[0, 1, 2, 3, 4, 5].map((idx) => {
              const angle = (idx * Math.PI * 2) / 6;
              const cx = Math.cos(angle) * 1.35;
              const cz = Math.sin(angle) * 1.35;
              return (
                <group key={idx} position={[cx, 0, cz]} rotation={[0, -angle + Math.PI / 2, 0]}>
                  <mesh position={[0, 0.45, 0]}>
                    <boxGeometry args={[0.42, 0.06, 0.42]} />
                    <meshStandardMaterial color="#762934" />
                  </mesh>
                  <mesh position={[0, 0.75, -0.19]}>
                    <boxGeometry args={[0.4, 0.55, 0.04]} />
                    <meshStandardMaterial color="#762934" />
                  </mesh>
                  <mesh position={[0, 0.22, 0]}>
                    <cylinderGeometry args={[0.02, 0.02, 0.44, 8]} />
                    <meshStandardMaterial color="#d8b36d" metalness={0.8} />
                  </mesh>
                </group>
              );
            })}
          </group>
        )}

        {stall.type === "handwash_station" && (
          <group position={[0, 0.94, 0]}>
            {[-0.6, 0.6].map((xOffset, i) => (
              <group key={i} position={[xOffset, 0, 0]}>
                <mesh position={[0, 0.05, 0]}>
                  <cylinderGeometry args={[0.26, 0.18, 0.22, 24]} />
                  <meshStandardMaterial color="#d8b36d" metalness={0.9} roughness={0.2} />
                </mesh>
                <mesh position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                  <circleGeometry args={[0.22, 20]} />
                  <meshStandardMaterial color="#d4af37" roughness={0.1} transparent opacity={0.7} />
                </mesh>
                <mesh position={[0, 0.26, -0.18]}>
                  <cylinderGeometry args={[0.02, 0.02, 0.28, 8]} />
                  <meshStandardMaterial color="#cbd5e1" metalness={0.95} />
                </mesh>
              </group>
            ))}
            <mesh position={[0, 0.35, 0.35]}>
              <boxGeometry args={[1.6, 0.03, 0.03]} />
              <meshStandardMaterial color="#d8b36d" metalness={0.8} />
            </mesh>
            <mesh position={[-0.3, 0.2, 0.36]}>
              <boxGeometry args={[0.25, 0.32, 0.04]} />
              <meshStandardMaterial color="#f8fafc" roughness={0.8} />
            </mesh>
            <mesh position={[0.3, 0.2, 0.36]}>
              <boxGeometry args={[0.25, 0.32, 0.04]} />
              <meshStandardMaterial color="#f8fafc" roughness={0.8} />
            </mesh>
          </group>
        )}

        {stall.type === "tamboolam_beeda" && (
          <group position={[0, 0.94, 0]}>
            <mesh position={[-0.5, 0.06, 0]}>
              <cylinderGeometry args={[0.32, 0.28, 0.08, 24]} />
              <meshStandardMaterial color="#d8b36d" metalness={0.9} roughness={0.2} />
            </mesh>
            <mesh position={[-0.5, 0.11, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <circleGeometry args={[0.28, 20]} />
              <meshStandardMaterial color="#15803d" roughness={0.5} />
            </mesh>
            {[-0.1, 0.1].map((bz, bi) => (
              <mesh key={bi} position={[-0.5, 0.15, bz]} rotation={[0, bi * 0.5, 0]}>
                <coneGeometry args={[0.06, 0.1, 4]} />
                <meshStandardMaterial color="#166534" roughness={0.3} />
              </mesh>
            ))}
            {[-0.2, 0.15, 0.5, 0.85].map((bx, bi) => (
              <group key={bi} position={[bx, 0.18, 0]}>
                <mesh position={[0, 0, 0]}>
                  <boxGeometry args={[0.22, 0.32, 0.14]} />
                  <meshStandardMaterial
                    color={bi % 2 === 0 ? "#eab308" : "#ec4899"}
                    roughness={0.6}
                  />
                </mesh>
                <mesh position={[0, 0.2, 0]}>
                  <torusGeometry args={[0.06, 0.012, 8, 16, Math.PI]} />
                  <meshStandardMaterial color="#d8b36d" metalness={0.8} />
                </mesh>
              </group>
            ))}
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
    </group>
  );
};
