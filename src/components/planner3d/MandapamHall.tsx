import React from "react";
import * as THREE from "three";
import { MandapamVenue } from "@/types/planner3d";

interface MandapamHallProps {
  venue: MandapamVenue;
  blueprintOpacity: number;
  showGrid: boolean;
  isDark: boolean;
}

export const MandapamHall: React.FC<MandapamHallProps> = ({
  venue,
  blueprintOpacity,
  showGrid,
  isDark,
}) => {
  const { hallWidth: w, hallLength: l, hallHeight: h } = venue;

  // Load blueprint texture if available
  const blueprintTexture = React.useMemo(() => {
    if (!venue.blueprintUrl) return null;
    const loader = new THREE.TextureLoader();
    const tex = loader.load(venue.blueprintUrl);
    tex.wrapS = THREE.ClampToEdgeWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    return tex;
  }, [venue.blueprintUrl]);

  const pillarCountX = 6;
  const pillarSpacingZ = l / (pillarCountX - 1);

  return (
    <group>
      {/* 1. Main Hall Floor (Polished Italian / Thanjavur Marble) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[w, l]} />
        <meshStandardMaterial
          color={isDark ? "#0f111a" : "#f1ede6"}
          roughness={0.2}
          metalness={0.1}
        />
      </mesh>

      {/* Floor Grid Lines (for planning alignment) */}
      {showGrid && (
        <gridHelper
          args={[Math.max(w, l), Math.round(Math.max(w, l)), isDark ? "#00f5d4" : "#762934", isDark ? "#1e293b" : "#e2e8f0"]}
          position={[0, 0.005, 0]}
        />
      )}

      {/* 2. Google Maps / Mandapam Floor Blueprint Projection Plane */}
      {blueprintTexture && blueprintOpacity > 0 && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
          <planeGeometry args={[w * 0.96, l * 0.96]} />
          <meshBasicMaterial
            map={blueprintTexture}
            transparent
            opacity={blueprintOpacity}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {/* 3. Mandapam Royal Stage (Rear) */}
      <group position={venue.stagePosition}>
        {/* Stage Platform */}
        <mesh position={[0, 0.45, 0]} receiveShadow castShadow>
          <boxGeometry args={[w * 0.65, 0.9, 6.0]} />
          <meshStandardMaterial
            color={isDark ? "#1e1b2e" : "#762934"} // Imperial Stage Burgundy
            roughness={0.4}
          />
        </mesh>
        {/* Gold Trim Border */}
        <mesh position={[0, 0.91, 2.95]}>
          <boxGeometry args={[w * 0.66, 0.06, 0.12]} />
          <meshStandardMaterial color="#d8b36d" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Ceremonial Backdrop Screen */}
        <mesh position={[0, 3.2, -2.8]}>
          <boxGeometry args={[w * 0.6, 4.5, 0.2]} />
          <meshStandardMaterial
            color={isDark ? "#0c0d16" : "#fffdfa"}
            roughness={0.3}
          />
        </mesh>
        {/* Stage Golden Floral Arch */}
        <mesh position={[0, 4.8, -2.6]}>
          <torusGeometry args={[w * 0.24, 0.18, 16, 48, Math.PI]} />
          <meshStandardMaterial color="#d8b36d" metalness={0.9} roughness={0.2} />
        </mesh>
        {/* Stage Light Accent */}
        <spotLight
          position={[0, 7.5, 1]}
          target-position={[0, 0.5, 0]}
          intensity={1.8}
          distance={15}
          angle={0.7}
          penumbra={0.5}
          color="#fef08a"
        />
      </group>

      {/* 4. Grand Entrance Arch (Front) */}
      <group position={venue.entrancePosition}>
        {/* Left Pillar */}
        <mesh position={[-4, h / 2, 0]} castShadow>
          <cylinderGeometry args={[0.35, 0.45, h, 16]} />
          <meshStandardMaterial color={isDark ? "#1e2238" : "#e2d8ce"} />
        </mesh>
        {/* Right Pillar */}
        <mesh position={[4, h / 2, 0]} castShadow>
          <cylinderGeometry args={[0.35, 0.45, h, 16]} />
          <meshStandardMaterial color={isDark ? "#1e2238" : "#e2d8ce"} />
        </mesh>
        {/* Arch Beam with Welcome Sign */}
        <mesh position={[0, h - 0.5, 0]} castShadow>
          <boxGeometry args={[8.8, 0.8, 0.8]} />
          <meshStandardMaterial color={isDark ? "#00f5d4" : "#762934"} roughness={0.3} />
        </mesh>
        {/* Traditional Brass Kuthuvilakku Lamps at entrance */}
        <group position={[-3.2, 0, 0.8]}>
          <cylinderGeometry args={[0.1, 0.3, 1.6, 12]} />
          <meshStandardMaterial color="#d8b36d" metalness={0.9} roughness={0.2} />
          {/* Flame Glow */}
          <pointLight color="#f59e0b" intensity={0.9} distance={3} position={[0, 1.7, 0]} />
        </group>
        <group position={[3.2, 0, 0.8]}>
          <cylinderGeometry args={[0.1, 0.3, 1.6, 12]} />
          <meshStandardMaterial color="#d8b36d" metalness={0.9} roughness={0.2} />
          <pointLight color="#f59e0b" intensity={0.9} distance={3} position={[0, 1.7, 0]} />
        </group>
      </group>

      {/* 5. Architectural Mandapam Pillars along East and West Wings */}
      {Array.from({ length: pillarCountX }).map((_, i) => {
        const zPos = -l / 2 + 3 + i * pillarSpacingZ;
        return (
          <React.Fragment key={i}>
            {/* West Wing Pillar */}
            <mesh position={[-w / 2 + 0.6, h / 2, zPos]} castShadow>
              <cylinderGeometry args={[0.28, 0.35, h, 12]} />
              <meshStandardMaterial
                color={isDark ? "#171a2e" : "#d8cfc4"}
                metalness={0.2}
                roughness={0.4}
              />
            </mesh>
            {/* East Wing Pillar */}
            <mesh position={[w / 2 - 0.6, h / 2, zPos]} castShadow>
              <cylinderGeometry args={[0.28, 0.35, h, 12]} />
              <meshStandardMaterial
                color={isDark ? "#171a2e" : "#d8cfc4"}
                metalness={0.2}
                roughness={0.4}
              />
            </mesh>
          </React.Fragment>
        );
      })}

      {/* 6. Perimeter Baseboard Lighting / Luminous Guide Lines */}
      {isDark && (
        <>
          <mesh position={[-w / 2 + 0.1, 0.04, 0]}>
            <boxGeometry args={[0.08, 0.08, l]} />
            <meshBasicMaterial color="#00f5d4" transparent opacity={0.6} />
          </mesh>
          <mesh position={[w / 2 - 0.1, 0.04, 0]}>
            <boxGeometry args={[0.08, 0.08, l]} />
            <meshBasicMaterial color="#00f5d4" transparent opacity={0.6} />
          </mesh>
        </>
      )}
    </group>
  );
};
