import React from "react";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import { MandapamVenue } from "@/types/planner3d";
import { generateVenueBlueprintCanvas } from "@/services/venueSynthesisService";

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

  // Dynamic Blueprint Texture: ALWAYS generate or load high-res architectural CAD blueprint
  const blueprintTexture = React.useMemo(() => {
    const url = venue.blueprintUrl || generateVenueBlueprintCanvas(venue);
    if (!url) return null;
    const loader = new THREE.TextureLoader();
    const tex = loader.load(url);
    tex.wrapS = THREE.ClampToEdgeWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    tex.anisotropy = 16;
    return tex;
  }, [venue.blueprintUrl, venue]);

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
      {/* 1. Main Ground Base Plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[w * 1.08, l * 1.08]} />
        <meshStandardMaterial
          color={
            isOutdoor
              ? isDark ? "#0c1710" : "#244d20"
              : isDark ? "#090b10" : "#e8e3dc"
          }
          roughness={isOutdoor ? 0.9 : 0.25}
          metalness={isOutdoor ? 0.05 : 0.15}
        />
      </mesh>

      {/* 2. Architectural Blueprint Projection Plane (High-Res 2048px CAD Blueprint) */}
      {blueprintTexture && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015, 0]}>
          <planeGeometry args={[w, l]} />
          <meshBasicMaterial
            map={blueprintTexture}
            transparent
            opacity={Math.max(0.35, blueprintOpacity)}
            side={THREE.DoubleSide}
            polygonOffset
            polygonOffsetFactor={-1}
          />
        </mesh>
      )}

      {/* Decorative Paved Pathways for Outdoor Lawn */}
      {isOutdoor && (
        <>
          {/* Central Royal Carpet / Paver Pathway */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} receiveShadow>
            <planeGeometry args={[4.5, l * 0.88]} />
            <meshStandardMaterial
              color={isDark ? "#581c25" : "#881324"}
              roughness={0.6}
            />
          </mesh>
          {/* East-West Cross Walkways */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.018, 0]} receiveShadow>
            <planeGeometry args={[w * 0.85, 3.5]} />
            <meshStandardMaterial
              color={isDark ? "#172033" : "#cbd5e1"}
              roughness={0.4}
            />
          </mesh>
        </>
      )}

      {/* Technical Floor Coordinate Grid Helper */}
      {showGrid && (
        <gridHelper
          args={[
            Math.max(w, l),
            Math.round(Math.max(w, l)),
            isDark ? "#c5a059" : "#762934",
            isDark ? (isOutdoor ? "#1a3320" : "#172033") : "#94a3b8",
          ]}
          position={[0, 0.022, 0]}
        />
      )}

      {/* 3. 3D Architectural Perimeter Shell & Walls */}
      {!isOutdoor ? (
        <group>
          {/* West Architectural Wall */}
          <mesh position={[-w / 2, h / 2, 0]} receiveShadow castShadow>
            <boxGeometry args={[0.3, h, l]} />
            <meshStandardMaterial
              color={isDark ? "#11141e" : "#ded7cc"}
              roughness={0.8}
            />
          </mesh>
          {/* East Architectural Wall */}
          <mesh position={[w / 2, h / 2, 0]} receiveShadow castShadow>
            <boxGeometry args={[0.3, h, l]} />
            <meshStandardMaterial
              color={isDark ? "#11141e" : "#ded7cc"}
              roughness={0.8}
            />
          </mesh>
          {/* North Architectural Wall (Rear Stage Wall with acoustic texture) */}
          <mesh position={[0, h / 2, -l / 2]} receiveShadow castShadow>
            <boxGeometry args={[w, h, 0.3]} />
            <meshStandardMaterial
              color={isDark ? "#0a0c12" : "#cfc8be"}
              roughness={0.6}
            />
          </mesh>
          {/* South Wall Left Portal Segment */}
          <mesh position={[-w / 4 - 3, h / 2, l / 2]} receiveShadow castShadow>
            <boxGeometry args={[w / 2 - 6, h, 0.3]} />
            <meshStandardMaterial
              color={isDark ? "#11141e" : "#ded7cc"}
              roughness={0.8}
            />
          </mesh>
          {/* South Wall Right Portal Segment */}
          <mesh position={[w / 4 + 3, h / 2, l / 2]} receiveShadow castShadow>
            <boxGeometry args={[w / 2 - 6, h, 0.3]} />
            <meshStandardMaterial
              color={isDark ? "#11141e" : "#ded7cc"}
              roughness={0.8}
            />
          </mesh>

          {/* Roof Steel Space-Frame Structural Trusses */}
          {Array.from({ length: Math.max(3, Math.round(l / 8)) }).map((_, idx) => {
            const zTruss = -l / 2 + 4 + idx * ((l - 8) / Math.max(1, Math.round(l / 8) - 1));
            return (
              <group key={`truss-${idx}`} position={[0, h - 0.35, zTruss]}>
                {/* Upper Beam */}
                <mesh position={[0, 0.25, 0]}>
                  <boxGeometry args={[w - 0.4, 0.12, 0.12]} />
                  <meshStandardMaterial color={isDark ? "#232838" : "#64748b"} metalness={0.7} />
                </mesh>
                {/* Lower Beam */}
                <mesh position={[0, -0.25, 0]}>
                  <boxGeometry args={[w - 0.4, 0.12, 0.12]} />
                  <meshStandardMaterial color={isDark ? "#232838" : "#64748b"} metalness={0.7} />
                </mesh>
                {/* Truss Downlight Mounts */}
                {[-w / 3.2, 0, w / 3.2].map((xSpot, sIdx) => (
                  <mesh key={`can-${sIdx}`} position={[xSpot, -0.45, 0]}>
                    <cylinderGeometry args={[0.1, 0.14, 0.24, 12]} />
                    <meshStandardMaterial color="#0f1118" metalness={0.9} />
                  </mesh>
                ))}
              </group>
            );
          })}
        </group>
      ) : (
        /* Outdoor Lawn Perimeter Kerb & Boundary */
        <group>
          <mesh position={[-w / 2, 0.2, 0]}>
            <boxGeometry args={[0.25, 0.4, l]} />
            <meshStandardMaterial color={isDark ? "#172033" : "#64748b"} roughness={0.7} />
          </mesh>
          <mesh position={[w / 2, 0.2, 0]}>
            <boxGeometry args={[0.25, 0.4, l]} />
            <meshStandardMaterial color={isDark ? "#172033" : "#64748b"} roughness={0.7} />
          </mesh>
          <mesh position={[0, 0.2, -l / 2]}>
            <boxGeometry args={[w, 0.4, 0.25]} />
            <meshStandardMaterial color={isDark ? "#172033" : "#64748b"} roughness={0.7} />
          </mesh>
          <mesh position={[0, 0.2, l / 2]}>
            <boxGeometry args={[w, 0.4, 0.25]} />
            <meshStandardMaterial color={isDark ? "#172033" : "#64748b"} roughness={0.7} />
          </mesh>
        </group>
      )}

      {/* 4. 3D CAD Floor Dimension Calipers & Coordinate Scale Rulers */}
      <group position={[0, 0.03, 0]}>
        {/* Width Scale Ticks along South entrance (X-axis) */}
        {Array.from({ length: Math.floor(w / 5) + 1 }).map((_, i) => {
          const xVal = -w / 2 + i * 5;
          return (
            <group key={`tick-x-${i}`} position={[xVal, 0, l / 2 + 0.35]}>
              <mesh rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[0.08, 0.6]} />
                <meshBasicMaterial color={isDark ? "#c5a059" : "#762934"} />
              </mesh>
              <Text
                position={[0, 0.05, 0.6]}
                rotation={[-Math.PI / 2, 0, 0]}
                fontSize={0.38}
                color={isDark ? "#c5a059" : "#762934"}
                anchorX="center"
                anchorY="middle"
              >
                {`${i * 5}m`}
              </Text>
            </group>
          );
        })}

        {/* Length Scale Ticks along West wall (Z-axis) */}
        {Array.from({ length: Math.floor(l / 5) + 1 }).map((_, j) => {
          const zVal = -l / 2 + j * 5;
          return (
            <group key={`tick-z-${j}`} position={[-w / 2 - 0.35, 0, zVal]}>
              <mesh rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[0.6, 0.08]} />
                <meshBasicMaterial color={isDark ? "#c5a059" : "#762934"} />
              </mesh>
              <Text
                position={[-0.6, 0.05, 0]}
                rotation={[-Math.PI / 2, 0, Math.PI / 2]}
                fontSize={0.38}
                color={isDark ? "#c5a059" : "#762934"}
                anchorX="center"
                anchorY="middle"
              >
                {`${j * 5}m`}
              </Text>
            </group>
          );
        })}

        {/* 3D North Arrow Indicator (Top Right Datum) */}
        <group position={[w / 2 - 2, 0.04, -l / 2 + 2]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.8, 0.95, 32]} />
            <meshBasicMaterial color="#c5a059" side={THREE.DoubleSide} />
          </mesh>
          <Text
            position={[0, 0.02, -1.3]}
            rotation={[-Math.PI / 2, 0, 0]}
            fontSize={0.45}
            color="#c5a059"
            anchorX="center"
          >
            NORTH ↑
          </Text>
        </group>
      </group>

      {/* 5. Mandapam Royal Stage (Rear) */}
      <group position={venue.stagePosition}>
        {/* Stage Platform */}
        <mesh position={[0, 0.45, 0]} receiveShadow castShadow>
          <boxGeometry args={[Math.min(w * 0.65, 24), 0.9, 6.0]} />
          <meshStandardMaterial
            color={isDark ? "#171a26" : "#681d27"}
            roughness={0.4}
          />
        </mesh>
        {/* Gold Trim Border */}
        <mesh position={[0, 0.91, 2.95]}>
          <boxGeometry args={[Math.min(w * 0.66, 24.2), 0.06, 0.12]} />
          <meshStandardMaterial color="#c5a059" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Ceremonial Backdrop Screen */}
        <mesh position={[0, 3.2, -2.8]}>
          <boxGeometry args={[Math.min(w * 0.6, 22), 4.5, 0.2]} />
          <meshStandardMaterial
            color={isDark ? "#090a0f" : "#fffdfa"}
            roughness={0.3}
          />
        </mesh>
        {/* Stage Golden Floral Arch */}
        <mesh position={[0, 4.8, -2.6]}>
          <torusGeometry args={[Math.min(w * 0.22, 8), 0.18, 16, 48, Math.PI]} />
          <meshStandardMaterial color="#c5a059" metalness={0.9} roughness={0.2} />
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

      {/* 6. Grand Entrance Arch (Front) */}
      <group position={venue.entrancePosition}>
        {/* Left Pillar */}
        <mesh position={[-3.8, h / 2, 0]} castShadow>
          <cylinderGeometry args={[0.35, 0.45, h, 16]} />
          <meshStandardMaterial color={isDark ? "#1c202e" : "#ded7cc"} />
        </mesh>
        {/* Right Pillar */}
        <mesh position={[3.8, h / 2, 0]} castShadow>
          <cylinderGeometry args={[0.35, 0.45, h, 16]} />
          <meshStandardMaterial color={isDark ? "#1c202e" : "#ded7cc"} />
        </mesh>
        {/* Arch Beam */}
        <mesh position={[0, h - 0.5, 0]} castShadow>
          <boxGeometry args={[8.4, 0.8, 0.8]} />
          <meshStandardMaterial color={isDark ? "#c5a059" : "#681d27"} roughness={0.3} />
        </mesh>
        {/* Entrance Signboard Plate */}
        <mesh position={[0, h - 0.5, 0.42]}>
          <boxGeometry args={[7.4, 0.6, 0.04]} />
          <meshStandardMaterial color="#0c0d16" emissive="#c5a059" emissiveIntensity={0.25} />
        </mesh>
        <Text
          position={[0, h - 0.38, 0.46]}
          fontSize={0.22}
          color="#fef08a"
          anchorX="center"
          anchorY="middle"
        >
          BKR CATERING &amp; EVENTS // ARCHITECTURAL STAGE
        </Text>
        <Text
          position={[0, h - 0.62, 0.46]}
          fontSize={0.17}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          நல்வரவு • MAIN ENTRANCE CONCOURSE
        </Text>

        {/* Traditional Brass Kuthuvilakku Lamps */}
        <group position={[-3.0, 0, 0.8]}>
          <cylinderGeometry args={[0.1, 0.3, 1.6, 12]} />
          <meshStandardMaterial color="#c5a059" metalness={0.9} roughness={0.2} />
          <pointLight color="#f59e0b" intensity={1.2} distance={4} position={[0, 1.7, 0]} />
        </group>
        <group position={[3.0, 0, 0.8]}>
          <cylinderGeometry args={[0.1, 0.3, 1.6, 12]} />
          <meshStandardMaterial color="#c5a059" metalness={0.9} roughness={0.2} />
          <pointLight color="#f59e0b" intensity={1.2} distance={4} position={[0, 1.7, 0]} />
        </group>
      </group>

      {/* 7. Directional CAD Concourse Totems */}
      {/* Handwash West Flank */}
      <group position={[-w / 2 + 4, 0, l / 2 - 3]}>
        <mesh position={[0, 1.3, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 2.6, 8]} />
          <meshStandardMaterial color="#334155" metalness={0.9} />
        </mesh>
        <mesh position={[0, 2.4, 0]}>
          <boxGeometry args={[2.2, 0.6, 0.06]} />
          <meshStandardMaterial color="#0c0d16" emissive="#14b8a6" emissiveIntensity={0.35} />
        </mesh>
        <Text position={[0, 2.52, 0.04]} fontSize={0.15} color="#14b8a6" anchorX="center">
          HANDWASH CONCOURSE // WEST
        </Text>
        <Text position={[0, 2.3, 0.04]} fontSize={0.12} color="#f8fafc" anchorX="center">
          கை கழுவும் இடம் [WEST CORRIDOR]
        </Text>
      </group>

      {/* Exit & Tamboolam East Flank */}
      <group position={[w / 2 - 4, 0, l / 2 - 3]}>
        <mesh position={[0, 1.3, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 2.6, 8]} />
          <meshStandardMaterial color="#334155" metalness={0.9} />
        </mesh>
        <mesh position={[0, 2.4, 0]}>
          <boxGeometry args={[2.2, 0.6, 0.06]} />
          <meshStandardMaterial color="#0c0d16" emissive="#f43f5e" emissiveIntensity={0.35} />
        </mesh>
        <Text position={[0, 2.52, 0.04]} fontSize={0.15} color="#f43f5e" anchorX="center">
          TAMBOOLAM &amp; RECEPTION EXIT
        </Text>
        <Text position={[0, 2.3, 0.04]} fontSize={0.12} color="#f8fafc" anchorX="center">
          நன்றி மீண்டும் வருக [EAST CORRIDOR]
        </Text>
      </group>

      {/* 8. Structural Wing Pillars or Outdoor Lighting Poles */}
      {Array.from({ length: pillarCountX }).map((_, i) => {
        const zPos = -l / 2 + 3 + i * pillarSpacingZ;
        return (
          <React.Fragment key={i}>
            <mesh position={[-w / 2 + 0.6, h / 2, zPos]} castShadow>
              <cylinderGeometry
                args={isOutdoor ? [0.08, 0.12, h, 8] : [0.26, 0.32, h, 12]}
              />
              <meshStandardMaterial
                color={isOutdoor ? "#334155" : isDark ? "#141724" : "#ded7cc"}
                metalness={isOutdoor ? 0.8 : 0.2}
                roughness={0.4}
              />
            </mesh>
            <mesh position={[w / 2 - 0.6, h / 2, zPos]} castShadow>
              <cylinderGeometry
                args={isOutdoor ? [0.08, 0.12, h, 8] : [0.26, 0.32, h, 12]}
              />
              <meshStandardMaterial
                color={isOutdoor ? "#334155" : isDark ? "#141724" : "#ded7cc"}
                metalness={isOutdoor ? 0.8 : 0.2}
                roughness={0.4}
              />
            </mesh>
          </React.Fragment>
        );
      })}

      {/* 9. Festive Overhead Fairy Lights Garlands */}
      {fairyLights.map((stringPts, sIdx) => (
        <group key={`fairy-${sIdx}`}>
          {stringPts.map((pt, pIdx) => (
            <mesh key={`bulb-${pIdx}`} position={pt}>
              <sphereGeometry args={[0.07, 8, 8]} />
              <meshBasicMaterial
                color={pIdx % 3 === 0 ? "#fef08a" : pIdx % 3 === 1 ? "#c5a059" : "#f472b6"}
              />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
};
