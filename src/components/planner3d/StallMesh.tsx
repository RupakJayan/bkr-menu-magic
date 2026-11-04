import React, { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import { StallItem } from "@/types/planner3d";
import { assetUrl } from "@/utils/assetUrl";

interface StallMeshProps {
  stall: StallItem;
  isSelected: boolean;
  onSelect: (stall: StallItem) => void;
  onMove?: (id: string, newPos: [number, number, number]) => void;
  showFocusLights?: boolean;
}

const StallDimensionCalipers3D: React.FC<{
  w: number;
  d: number;
  h: number;
  isSelected: boolean;
}> = ({ w, d, h, isSelected }) => {
  const caliperColor = isSelected ? "#c5a059" : "#38bdf8";

  return (
    <group position={[0, 0, 0]}>
      {/* 1. Width Dimension Caliper Line (Front of Stall) */}
      <group position={[0, 0.05, d / 2 + 0.45]}>
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
          position={[0, 0.22, 0]}
          fontSize={0.24}
          color={caliperColor}
          anchorX="center"
          anchorY="middle"
        >
          {`|← ${w.toFixed(1)}m →|`}
        </Text>
      </group>

      {/* 2. Depth Dimension Caliper Line (Right Flank of Stall) */}
      <group position={[w / 2 + 0.45, 0.05, 0]}>
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
          position={[0, 0.22, 0]}
          rotation={[0, -Math.PI / 2, 0]}
          fontSize={0.24}
          color={caliperColor}
          anchorX="center"
          anchorY="middle"
        >
          {`|← ${d.toFixed(1)}m →|`}
        </Text>
      </group>

      {/* 3. Safety Clearance Ring on Floor */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[Math.max(w, d) * 0.7, Math.max(w, d) * 0.75 + 0.08, 32]} />
        <meshBasicMaterial
          color={caliperColor}
          side={THREE.DoubleSide}
          transparent
          opacity={0.45}
        />
      </mesh>
    </group>
  );
};

export const StallMesh: React.FC<StallMeshProps> = ({
  stall,
  isSelected,
  onSelect,
  showFocusLights = true,
}) => {
  const steamRef = useRef<THREE.Points | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const elevationGroupRef = useRef<THREE.Group | null>(null);

  // Smooth Physics Elevation Lift on Hover & Selection
  useFrame((_, delta) => {
    if (elevationGroupRef.current) {
      const targetY = isSelected ? 0.22 : isHovered ? 0.14 : 0.0;
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

  // Custom photo billboard texture if stall was generated from uploaded photo
  const customTexture = React.useMemo(() => {
    if (!stall.customPhotoUrl) return null;
    const loader = new THREE.TextureLoader();
    const tex = loader.load(stall.customPhotoUrl);
    tex.wrapS = THREE.ClampToEdgeWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    return tex;
  }, [stall.customPhotoUrl]);

  // Custom dining table linen / optical illusion texture
  const tableTexture = React.useMemo(() => {
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

  return (
    <group
      position={stall.position}
      rotation={[0, stall.rotation, 0]}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(stall);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setIsHovered(true);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        setIsHovered(false);
        document.body.style.cursor = "default";
      }}
    >
      {/* Dynamic Floor Contact Shadow */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[w * 1.1, d * 1.1]} />
        <meshBasicMaterial
          color="#000000"
          transparent
          opacity={isHovered || isSelected ? 0.3 : 0.6}
        />
      </mesh>

      {/* 3D CAD Calipers & Safety Ring */}
      {(isHovered || isSelected) && (
        <StallDimensionCalipers3D w={w} d={d} h={h} isSelected={isSelected} />
      )}

      {/* Floating 3D Precision Datum & Coordinates Tag */}
      {(isHovered || isSelected) && (
        <group position={[0, h + 0.65, 0]}>
          <mesh position={[0, 0, 0]}>
            <planeGeometry args={[Math.max(w * 0.95, 2.8), 0.55]} />
            <meshBasicMaterial color="#090b12" transparent opacity={0.92} />
          </mesh>
          <Text
            position={[0, 0.12, 0.01]}
            fontSize={0.17}
            color="#e2c99a"
            anchorX="center"
          >
            {stall.name.toUpperCase()}
          </Text>
          <Text
            position={[0, -0.12, 0.01]}
            fontSize={0.12}
            color="#94a3b8"
            anchorX="center"
          >
            {`X: ${stall.position[0] >= 0 ? "+" : ""}${stall.position[0].toFixed(1)}m | Z: ${stall.position[2] >= 0 ? "+" : ""}${stall.position[2].toFixed(1)}m | ${stall.capacityPerHour} Pax/Hr`}
          </Text>
        </group>
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
          {/* Main Cylindrical Stainless Steel Bin */}
          <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.26, 0.28, 0.88, 24]} />
            <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.2} />
          </mesh>
          {/* Top Stainless Dome Lid with Hinge */}
          <mesh position={[0, 0.91, 0]}>
            <cylinderGeometry args={[0.28, 0.27, 0.06, 24]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.95} roughness={0.15} />
          </mesh>
          {/* Lid Handle */}
          <mesh position={[0, 0.96, 0]}>
            <boxGeometry args={[0.12, 0.04, 0.03]} />
            <meshStandardMaterial color="#d8b36d" metalness={0.9} />
          </mesh>
          {/* Foot Pedal at Bottom */}
          <mesh position={[0, 0.04, 0.28]}>
            <boxGeometry args={[0.14, 0.03, 0.1]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.9} />
          </mesh>
          {/* Eco Green Leaf / Recycle Badge */}
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
          {/* Structural Trusses & Stand */}
          <mesh position={[-w / 2 + 0.2, h / 2, 0]} castShadow>
            <boxGeometry args={[0.2, h, 0.4]} />
            <meshStandardMaterial color="#1e293b" metalness={0.9} />
          </mesh>
          <mesh position={[w / 2 - 0.2, h / 2, 0]} castShadow>
            <boxGeometry args={[0.2, h, 0.4]} />
            <meshStandardMaterial color="#1e293b" metalness={0.9} />
          </mesh>
          {/* Carbon Fiber Video Screen Frame */}
          <mesh position={[0, h / 2 + 0.2, 0]} castShadow>
            <boxGeometry args={[w, h * 0.85, 0.15]} />
            <meshStandardMaterial color="#05070e" roughness={0.3} metalness={0.8} />
          </mesh>
          {/* Glowing Gold Border Bezel */}
          <mesh position={[0, h / 2 + 0.2, 0.08]}>
            <boxGeometry args={[w + 0.08, h * 0.85 + 0.08, 0.02]} />
            <meshStandardMaterial color="#d8b36d" metalness={0.9} roughness={0.1} />
          </mesh>
          {/* Active Video Screen Surface with HTML5 Video Texture */}
          <mesh position={[0, h / 2 + 0.2, 0.1]}>
            <planeGeometry args={[w * 0.94, h * 0.78]} />
            {videoTexture ? (
              <meshBasicMaterial map={videoTexture} />
            ) : (
              <meshStandardMaterial color="#0c0d16" emissive="#d8b36d" emissiveIntensity={0.2} />
            )}
          </mesh>
          {/* Top Header Sign: BKR CATERING & EVENTS */}
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
          {/* Bottom Reel Details: @bkr_events_ • Instagram Reels */}
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
      ) : (
        /* Standard Food / Beverage Stalls with Counter, Canopy & Focus Lights */
        <>
          {/* Counter Base / Table */}
          <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
            <boxGeometry args={[w, 0.9, d]} />
            <meshStandardMaterial
              color={isSelected ? "#e2c99a" : stall.color}
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
                <meshStandardMaterial color={stall.accentColor} roughness={0.5} />
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

          {/* Dynamic Focus Spotlight to make live counter look cool and dramatic */}
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
          {/* Round Table Top with Tablecloth or Custom Illusion Pattern */}
          <mesh position={[0, 0.74, 0]}>
            <cylinderGeometry args={[1.0, 1.0, 0.05, 32]} />
            <meshStandardMaterial
              color={tableTexture ? "#ffffff" : "#f8fafc"}
              map={tableTexture || undefined}
              roughness={0.35}
            />
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

      {/* 5. Traditional Handwash Station (கை கழுவும் இடம்) */}
      {stall.type === "handwash_station" && (
        <group position={[0, 0.94, 0]}>
          {/* Dual Brass / Chrome Sinks */}
          {[-0.6, 0.6].map((xOffset, i) => (
            <group key={i} position={[xOffset, 0, 0]}>
              {/* Wash Basin */}
              <mesh position={[0, 0.05, 0]}>
                <cylinderGeometry args={[0.26, 0.18, 0.22, 24]} />
                <meshStandardMaterial color="#d8b36d" metalness={0.9} roughness={0.2} />
              </mesh>
              {/* Water in Basin */}
              <mesh position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <circleGeometry args={[0.22, 20]} />
                <meshStandardMaterial color="#d4af37" roughness={0.1} transparent opacity={0.7} />
              </mesh>
              {/* Swan-Neck Tap */}
              <mesh position={[0, 0.26, -0.18]}>
                <cylinderGeometry args={[0.02, 0.02, 0.28, 8]} />
                <meshStandardMaterial color="#cbd5e1" metalness={0.95} />
              </mesh>
            </group>
          ))}
          {/* Towel Hanger Bar */}
          <mesh position={[0, 0.35, 0.35]}>
            <boxGeometry args={[1.6, 0.03, 0.03]} />
            <meshStandardMaterial color="#d8b36d" metalness={0.8} />
          </mesh>
          {/* Clean Cotton Hand Towels */}
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

      {/* 6. Traditional Tamboolam Bag & Sweet Beeda Counter */}
      {stall.type === "tamboolam_beeda" && (
        <group position={[0, 0.94, 0]}>
          {/* Center Brass Thamboolam Uruli / Tray */}
          <mesh position={[-0.5, 0.06, 0]}>
            <cylinderGeometry args={[0.32, 0.28, 0.08, 24]} />
            <meshStandardMaterial color="#d8b36d" metalness={0.9} roughness={0.2} />
          </mesh>
          {/* Fresh Betel Leaves (வெற்றிலை பாக்கு) */}
          <mesh position={[-0.5, 0.11, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.28, 20]} />
            <meshStandardMaterial color="#15803d" roughness={0.5} />
          </mesh>
          {/* Meetha Sweet Beeda Pyramids */}
          {[-0.1, 0.1].map((bz, bi) => (
            <mesh key={bi} position={[-0.5, 0.15, bz]} rotation={[0, bi * 0.5, 0]}>
              <coneGeometry args={[0.06, 0.1, 4]} />
              <meshStandardMaterial color="#166534" roughness={0.3} />
            </mesh>
          ))}
          {/* Silk / Jute Tamboolam Gift Bags (மஞ்சள் குங்குமம் தேங்காய் பை) */}
          {[-0.2, 0.15, 0.5, 0.85].map((bx, bi) => (
            <group key={bi} position={[bx, 0.18, 0]}>
              <mesh position={[0, 0, 0]}>
                <boxGeometry args={[0.22, 0.32, 0.14]} />
                <meshStandardMaterial
                  color={bi % 2 === 0 ? "#eab308" : "#ec4899"} // Auspicious Yellow & Pink silk bags
                  roughness={0.6}
                />
              </mesh>
              {/* Bag String Handles */}
              <mesh position={[0, 0.2, 0]}>
                <torusGeometry args={[0.06, 0.012, 8, 16, Math.PI]} />
                <meshStandardMaterial color="#d8b36d" metalness={0.8} />
              </mesh>
            </group>
          ))}
        </group>
      )}

      {/* 7. Custom Photo-Generated 3D Stall Billboard */}
      {stall.type === "custom_stall" && (
        <group position={[0, 0.95, 0]}>
          {/* Front Facade Photo Billboard Display */}
          {customTexture ? (
            <mesh position={[0, -0.45, d / 2 + 0.02]}>
              <planeGeometry args={[w * 0.92, 0.8]} />
              <meshBasicMaterial map={customTexture} side={THREE.DoubleSide} />
            </mesh>
          ) : (
            /* Holographic Neon Badge */
            <mesh position={[0, -0.45, d / 2 + 0.02]}>
              <planeGeometry args={[w * 0.85, 0.7]} />
              <meshStandardMaterial
                color="#0c0d16"
                emissive="#8b5cf6"
                emissiveIntensity={0.3}
              />
            </mesh>
          )}
          {/* Top Specialty Food Showcase Dome */}
          <mesh position={[0, 0.2, 0]}>
            <sphereGeometry args={[0.38, 20, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial
              color="#a855f7"
              roughness={0.2}
              transparent
              opacity={0.7}
              metalness={0.6}
            />
          </mesh>
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
