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
  const isOutdoor = venue.terrainType === "open_lawn" || venue.terrainType === "mega_ground";

  // Load blueprint texture if available
  const blueprintTexture = React.useMemo(() => {
    if (!venue.blueprintUrl) return null;
    const loader = new THREE.TextureLoader();
    const tex = loader.load(venue.blueprintUrl);
    tex.wrapS = THREE.ClampToEdgeWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    return tex;
  }, [venue.blueprintUrl]);

  const pillarCountX = Math.min(10, Math.max(4, Math.round(l / 6)));
  const pillarSpacingZ = l / (pillarCountX - 1);

  // Serial lights garland positions for outdoor lawns or festive atmosphere
  const fairyLights = React.useMemo(() => {
    if (!isOutdoor && venue.weather !== "festive_serial_lights") return [];
    const strings: [number, number, number][][] = [];
    const numStrings = 5;
    for (let s = 0; s < numStrings; s++) {
      const z = -l / 2 + (l / (numStrings + 1)) * (s + 1);
      const points: [number, number, number][] = [];
      const steps = 12;
      for (let i = 0; i <= steps; i++) {
        const x = -w / 2 + (w / steps) * i;
        const sag = Math.sin((i / steps) * Math.PI) * 1.5;
        const y = h * 0.75 - sag;
        points.push([x, y, z]);
      }
      strings.push(points);
    }
    return strings;
  }, [isOutdoor, venue.weather, w, l, h]);

  return (
    <group>
      {/* 1. Ground / Main Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[w, l]} />
        <meshStandardMaterial
          color={
            isOutdoor
              ? isDark ? "#122818" : "#2d5a27" // Lush green lawn grass
              : isDark ? "#0f111a" : "#f1ede6" // Polished Mandapam Italian marble
          }
          roughness={isOutdoor ? 0.85 : 0.2}
          metalness={isOutdoor ? 0.05 : 0.15}
        />
      </mesh>

      {/* Decorative Paved Pathways for Outdoor Lawn */}
      {isOutdoor && (
        <>
          {/* Central Royal Carpet / Paver Pathway */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0]} receiveShadow>
            <planeGeometry args={[4.5, l * 0.88]} />
            <meshStandardMaterial
              color={isDark ? "#762934" : "#991b1b"} // Regal Maroon Red Carpet
              roughness={0.6}
            />
          </mesh>
          {/* North & South Cross Walkways */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]} receiveShadow>
            <planeGeometry args={[w * 0.85, 3.5]} />
            <meshStandardMaterial
              color={isDark ? "#1e293b" : "#e2e8f0"} // Granite paver tiles
              roughness={0.4}
            />
          </mesh>
        </>
      )}

      {/* Floor Grid Lines (for planning alignment) */}
      {showGrid && (
        <gridHelper
          args={[
            Math.max(w, l),
            Math.round(Math.max(w, l)),
            isDark ? "#00f5d4" : "#762934",
            isDark ? (isOutdoor ? "#1e3a24" : "#1e293b") : "#cbd5e1",
          ]}
          position={[0, 0.008, 0]}
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
          <boxGeometry args={[Math.min(w * 0.65, 24), 0.9, 6.0]} />
          <meshStandardMaterial
            color={isDark ? "#1e1b2e" : "#762934"} // Imperial Stage Burgundy
            roughness={0.4}
          />
        </mesh>
        {/* Gold Trim Border */}
        <mesh position={[0, 0.91, 2.95]}>
          <boxGeometry args={[Math.min(w * 0.66, 24.2), 0.06, 0.12]} />
          <meshStandardMaterial color="#d8b36d" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Ceremonial Backdrop Screen */}
        <mesh position={[0, 3.2, -2.8]}>
          <boxGeometry args={[Math.min(w * 0.6, 22), 4.5, 0.2]} />
          <meshStandardMaterial
            color={isDark ? "#0c0d16" : "#fffdfa"}
            roughness={0.3}
          />
        </mesh>
        {/* Stage Golden Floral Arch */}
        <mesh position={[0, 4.8, -2.6]}>
          <torusGeometry args={[Math.min(w * 0.22, 8), 0.18, 16, 48, Math.PI]} />
          <meshStandardMaterial color="#d8b36d" metalness={0.9} roughness={0.2} />
        </mesh>
        {/* Stage Light Accent */}
        <spotLight
          position={[0, 8.0, 1.5]}
          target-position={[0, 0.5, 0]}
          intensity={2.2}
          distance={20}
          angle={0.65}
          penumbra={0.4}
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
          <pointLight color="#f59e0b" intensity={1.2} distance={4} position={[0, 1.7, 0]} />
        </group>
        <group position={[3.2, 0, 0.8]}>
          <cylinderGeometry args={[0.1, 0.3, 1.6, 12]} />
          <meshStandardMaterial color="#d8b36d" metalness={0.9} roughness={0.2} />
          <pointLight color="#f59e0b" intensity={1.2} distance={4} position={[0, 1.7, 0]} />
        </group>
      </group>

      {/* 5. Architectural Pillars or Outdoor Light Poles */}
      {Array.from({ length: pillarCountX }).map((_, i) => {
        const zPos = -l / 2 + 3 + i * pillarSpacingZ;
        return (
          <React.Fragment key={i}>
            {/* West Wing Pillar / Light Pole */}
            <mesh position={[-w / 2 + 0.6, h / 2, zPos]} castShadow>
              <cylinderGeometry
                args={isOutdoor ? [0.08, 0.12, h, 8] : [0.28, 0.35, h, 12]}
              />
              <meshStandardMaterial
                color={isOutdoor ? "#334155" : isDark ? "#171a2e" : "#d8cfc4"}
                metalness={isOutdoor ? 0.8 : 0.2}
                roughness={0.4}
              />
            </mesh>
            {/* East Wing Pillar / Light Pole */}
            <mesh position={[w / 2 - 0.6, h / 2, zPos]} castShadow>
              <cylinderGeometry
                args={isOutdoor ? [0.08, 0.12, h, 8] : [0.28, 0.35, h, 12]}
              />
              <meshStandardMaterial
                color={isOutdoor ? "#334155" : isDark ? "#171a2e" : "#d8cfc4"}
                metalness={isOutdoor ? 0.8 : 0.2}
                roughness={0.4}
              />
            </mesh>
            {/* Warm Lantern / Fairy Light Glow on Outdoor Poles */}
            {isOutdoor && (
              <>
                <pointLight
                  position={[-w / 2 + 0.6, h - 0.5, zPos]}
                  color="#fef08a"
                  intensity={0.6}
                  distance={8}
                />
                <pointLight
                  position={[w / 2 - 0.6, h - 0.5, zPos]}
                  color="#fef08a"
                  intensity={0.6}
                  distance={8}
                />
              </>
            )}
          </React.Fragment>
        );
      })}

      {/* 6. Festive Overhead Fairy Lights Garlands (Outdoor / Night) */}
      {fairyLights.map((stringPts, sIdx) => (
        <group key={`fairy-${sIdx}`}>
          {stringPts.map((pt, pIdx) => (
            <mesh key={`bulb-${pIdx}`} position={pt}>
              <sphereGeometry args={[0.07, 8, 8]} />
              <meshBasicMaterial
                color={pIdx % 3 === 0 ? "#fef08a" : pIdx % 3 === 1 ? "#38bdf8" : "#f472b6"}
              />
            </mesh>
          ))}
        </group>
      ))}

      {/* 7. Perimeter Boundary / Luminous Guide Lines */}
      {isDark && (
        <>
          <mesh position={[-w / 2 + 0.1, 0.04, 0]}>
            <boxGeometry args={[0.08, 0.08, l]} />
            <meshBasicMaterial
              color={isOutdoor ? "#22c55e" : "#00f5d4"}
              transparent
              opacity={0.6}
            />
          </mesh>
          <mesh position={[w / 2 - 0.1, 0.04, 0]}>
            <boxGeometry args={[0.08, 0.08, l]} />
            <meshBasicMaterial
              color={isOutdoor ? "#22c55e" : "#00f5d4"}
              transparent
              opacity={0.6}
            />
          </mesh>
        </>
      )}
    </group>
  );
};
