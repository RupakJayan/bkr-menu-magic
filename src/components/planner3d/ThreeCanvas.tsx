import React, { useRef, useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import { StallItem, MandapamVenue, CameraViewMode } from "@/types/planner3d";
import { MandapamHall } from "./MandapamHall";
import { StallMesh } from "./StallMesh";
import { CrowdFlowSimulation } from "./CrowdFlowSimulation";
import { CadAisleOverlay } from "./CadAisleOverlay";

interface ThreeCanvasProps {
  venue: MandapamVenue;
  stalls: StallItem[];
  selectedStallId: string | null;
  onSelectStall: (stall: StallItem | null) => void;
  onMoveStall: (id: string, newPos: [number, number, number]) => void;
  viewMode: CameraViewMode;
  blueprintOpacity: number;
  showGrid: boolean;
  showCrowdSimulation?: boolean;
  showCadAisles?: boolean;
  cinematicAutoRotate?: boolean;
  isDark: boolean;
  canvasRef?: React.MutableRefObject<HTMLCanvasElement | null>;
}

// Camera controller component inside Canvas
const CameraRig: React.FC<{
  viewMode: CameraViewMode;
  venue: MandapamVenue;
  cinematicAutoRotate?: boolean;
}> = ({ viewMode, venue, cinematicAutoRotate = false }) => {
  const { camera } = useThree();
  const controlsRef = useRef<any>(null);

  useEffect(() => {
    if (viewMode === "top_down") {
      // 2D Blueprint top-down view
      camera.position.set(0, Math.max(venue.hallWidth, venue.hallLength) * 1.1, 0.01);
      camera.lookAt(0, 0, 0);
      if (controlsRef.current) {
        controlsRef.current.target.set(0, 0, 0);
        controlsRef.current.enableRotate = false;
        controlsRef.current.update();
      }
    } else if (viewMode === "walkthrough") {
      // Guest eye-level perspective inside the entrance facing the stage
      camera.position.set(0, 1.7, venue.entrancePosition[2] - 2);
      camera.lookAt(venue.stagePosition[0], 1.5, venue.stagePosition[2]);
      if (controlsRef.current) {
        controlsRef.current.target.set(venue.stagePosition[0], 1.5, venue.stagePosition[2]);
        controlsRef.current.enableRotate = true;
        controlsRef.current.update();
      }
    } else {
      // Standard 3D Orbit view
      camera.position.set(18, 22, 26);
      camera.lookAt(0, 0, 0);
      if (controlsRef.current) {
        controlsRef.current.target.set(0, 0, 0);
        controlsRef.current.enableRotate = true;
        controlsRef.current.update();
      }
    }
  }, [viewMode, venue, camera]);

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      autoRotate={cinematicAutoRotate}
      autoRotateSpeed={0.9}
      maxPolarAngle={viewMode === "top_down" ? 0.05 : Math.PI / 2 - 0.05}
      minDistance={4}
      maxDistance={70}
      dampingFactor={0.08}
    />
  );
};

// Environment / Skybox Handler
const SceneEnvironment: React.FC<{
  venue: MandapamVenue;
  isDark: boolean;
}> = ({ venue, isDark }) => {
  const { scene } = useThree();

  useEffect(() => {
    if (venue.panoramicSkyboxUrl) {
      const loader = new THREE.TextureLoader();
      loader.load(venue.panoramicSkyboxUrl, (texture) => {
        texture.mapping = THREE.EquirectangularReflectionMapping;
        scene.background = texture;
        scene.environment = texture;
      });
    } else {
      // Atmospheric sky color based on time of day and theme
      const time = venue.timeOfDay || (isDark ? "night" : "afternoon");
      if (time === "night") {
        scene.background = new THREE.Color("#05050a");
      } else if (time === "sunset") {
        scene.background = new THREE.Color("#2a1215");
      } else if (time === "morning") {
        scene.background = new THREE.Color(isDark ? "#0f172a" : "#e0f2fe");
      } else {
        scene.background = new THREE.Color(isDark ? "#0b0c14" : "#f8fafc");
      }
      scene.environment = null;
    }
  }, [venue.panoramicSkyboxUrl, venue.timeOfDay, isDark, scene]);

  return null;
};
const FloorPlaneClickCatcher: React.FC<{
  venue: MandapamVenue;
  selectedStallId: string | null;
  onMoveStall: (id: string, newPos: [number, number, number]) => void;
  onDeselect: () => void;
}> = ({ venue, selectedStallId, onMoveStall, onDeselect }) => {
  return (
    <mesh
      position={[0, 0, 0]}
      rotation={[-Math.PI / 2, 0, 0]}
      visible={false}
      onClick={(e) => {
        e.stopPropagation();
        if (selectedStallId && e.point) {
          // Clamp inside venue bounds
          const halfW = venue.hallWidth / 2 - 2;
          const halfL = venue.hallLength / 2 - 2;
          const clampedX = Math.max(-halfW, Math.min(halfW, Math.round(e.point.x * 2) / 2));
          const clampedZ = Math.max(-halfL, Math.min(halfL, Math.round(e.point.z * 2) / 2));
          onMoveStall(selectedStallId, [clampedX, 0, clampedZ]);
        } else {
          onDeselect();
        }
      }}
    >
      <planeGeometry args={[venue.hallWidth * 1.5, venue.hallLength * 1.5]} />
      <meshBasicMaterial transparent opacity={0} />
    </mesh>
  );
};

export const ThreeCanvas: React.FC<ThreeCanvasProps> = ({
  venue,
  stalls,
  selectedStallId,
  onSelectStall,
  onMoveStall,
  viewMode,
  blueprintOpacity,
  showGrid,
  showCrowdSimulation = false,
  showCadAisles = false,
  cinematicAutoRotate = false,
  isDark,
  canvasRef,
}) => {
  return (
    <div className="relative w-full h-full bg-[#050508] overflow-hidden select-none">
      <Canvas
        shadows
        gl={{ preserveDrawingBuffer: true, antialias: true }}
        onCreated={({ gl }) => {
          if (canvasRef) {
            canvasRef.current = gl.domElement;
          }
        }}
      >
        <PerspectiveCamera makeDefault position={[18, 22, 26]} fov={45} />
        <CameraRig
          viewMode={viewMode}
          venue={venue}
          cinematicAutoRotate={cinematicAutoRotate}
        />

        <SceneEnvironment venue={venue} isDark={isDark} />

        {/* Dynamic Lighting setup according to Time of Day & Weather */}
        {venue.timeOfDay === "sunset" ? (
          <>
            <ambientLight intensity={0.7} color="#fed7aa" />
            <directionalLight
              position={[25, 12, 18]}
              intensity={1.8}
              color="#f97316"
              castShadow
              shadow-mapSize-width={2048}
              shadow-mapSize-height={2048}
            />
            <directionalLight position={[-15, 8, -12]} intensity={0.4} color="#ec4899" />
          </>
        ) : venue.timeOfDay === "night" ? (
          <>
            <ambientLight intensity={0.45} color="#60a5fa" />
            <directionalLight
              position={[12, 28, 10]}
              intensity={0.65}
              color="#93c5fd"
              castShadow
              shadow-mapSize-width={2048}
              shadow-mapSize-height={2048}
            />
            {/* Warm Festival Ambient Fill */}
            <pointLight position={[0, 8, 0]} intensity={1.5} color="#fef08a" distance={35} />
          </>
        ) : (
          <>
            <ambientLight intensity={isDark ? 0.8 : 1.2} />
            <directionalLight
              position={[15, 25, 12]}
              intensity={1.4}
              castShadow
              shadow-mapSize-width={2048}
              shadow-mapSize-height={2048}
              shadow-camera-far={60}
              shadow-camera-left={-25}
              shadow-camera-right={25}
              shadow-camera-top={25}
              shadow-camera-bottom={-25}
            />
            <directionalLight position={[-15, 15, -12]} intensity={0.6} />
          </>
        )}

        {/* Mandapam Hall Architecture & Blueprint */}
        <MandapamHall
          venue={venue}
          blueprintOpacity={blueprintOpacity}
          showGrid={showGrid}
          isDark={isDark}
        />

        {/* CAD Dimension & Clearance Lines */}
        <CadAisleOverlay
          venue={venue}
          stalls={stalls}
          active={showCadAisles}
        />

        {/* Interactive 3D Crowd Flow & Heatmap Simulator */}
        <CrowdFlowSimulation
          venue={venue}
          stalls={stalls}
          active={showCrowdSimulation}
        />

        {/* Stalls & Live Cooking Counters */}
        {stalls.map((stall) => (
          <StallMesh
            key={stall.id}
            stall={stall}
            isSelected={stall.id === selectedStallId}
            onSelect={onSelectStall}
            onMove={onMoveStall}
          />
        ))}

        {/* Floor click detection for interactive placement */}
        <FloorPlaneClickCatcher
          venue={venue}
          selectedStallId={selectedStallId}
          onMoveStall={onMoveStall}
          onDeselect={() => onSelectStall(null)}
        />
      </Canvas>
    </div>
  );
};
