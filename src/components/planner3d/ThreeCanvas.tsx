import React, { useRef, useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import { StallItem, MandapamVenue, CameraViewMode } from "@/types/planner3d";
import { MandapamHall } from "./MandapamHall";
import { StallMesh } from "./StallMesh";
import { CrowdFlowSimulation } from "./CrowdFlowSimulation";
import { CadAisleOverlay } from "./CadAisleOverlay";
import { MagneticAlignmentOverlay } from "./MagneticAlignmentOverlay";
import { CadBlueprintDimensionsOverlay } from "./CadBlueprintDimensionsOverlay";
import { playMagneticSnap } from "@/utils/soundFeedback";

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
  showFocusLights?: boolean;
  showMagneticGuides?: boolean;
  cinematicAutoRotate?: boolean;
  isDark: boolean;
  isModalOpen?: boolean;
  canvasRef?: React.MutableRefObject<HTMLCanvasElement | null>;
}

// Camera controller component inside Canvas
const CameraRig: React.FC<{
  viewMode: CameraViewMode;
  venue: MandapamVenue;
  cinematicAutoRotate?: boolean;
  isOrbitEnabled?: boolean;
}> = ({ viewMode, venue, cinematicAutoRotate = false, isOrbitEnabled = true }) => {
  const { camera } = useThree();
  const controlsRef = useRef<any>(null);

  const dim = Math.max(venue.hallWidth, venue.hallLength);

  useEffect(() => {
    if (viewMode === "top_down") {
      // 2D Blueprint top-down orthographic view looking directly down
      camera.position.set(0, dim * 1.25, 0.01);
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
      // Dynamic 3D Orbit view scaled to venue dimensions
      const camX = Math.max(16, dim * 0.42);
      const camY = Math.max(18, dim * 0.48);
      const camZ = Math.max(22, dim * 0.58);
      camera.position.set(camX, camY, camZ);
      camera.lookAt(0, 0, 0);
      if (controlsRef.current) {
        controlsRef.current.target.set(0, 0, 0);
        controlsRef.current.enableRotate = true;
        controlsRef.current.update();
      }
    }
  }, [viewMode, venue, camera, dim]);

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      enabled={isOrbitEnabled}
      autoRotate={cinematicAutoRotate && isOrbitEnabled}
      autoRotateSpeed={0.9}
      maxPolarAngle={viewMode === "top_down" ? 0.05 : Math.PI / 2 - 0.05}
      minDistance={4}
      maxDistance={Math.max(140, dim * 2.8)}
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
      const time = venue.timeOfDay || (isDark ? "night" : "morning");
      if (time === "night") {
        scene.background = new THREE.Color(isDark ? "#080a10" : "#1e2433");
      } else if (time === "sunset") {
        scene.background = new THREE.Color(isDark ? "#12141d" : "#f5f3ef");
      } else if (time === "morning") {
        scene.background = new THREE.Color(isDark ? "#0d1017" : "#f4f6fa");
      } else {
        scene.background = new THREE.Color(isDark ? "#0d1017" : "#f8fafc");
      }
      scene.environment = null;
    }
  }, [venue.panoramicSkyboxUrl, venue.timeOfDay, isDark, scene]);

  return null;
};

// Floor Plane supporting both Click-to-Place and Direct Real-time Pointer Dragging
const FloorPlaneDragCatcher: React.FC<{
  venue: MandapamVenue;
  stalls: StallItem[];
  selectedStallId: string | null;
  draggingStallId: string | null;
  onEndDrag: () => void;
  onMoveStall: (id: string, newPos: [number, number, number]) => void;
  onDeselect: () => void;
}> = ({
  venue,
  stalls,
  selectedStallId,
  draggingStallId,
  onEndDrag,
  onMoveStall,
  onDeselect,
}) => {
  // Global pointer up fallback so drag release is 100% reliable
  useEffect(() => {
    const handleGlobalPointerUp = () => {
      if (draggingStallId) {
        onEndDrag();
      }
    };
    window.addEventListener("pointerup", handleGlobalPointerUp);
    return () => window.removeEventListener("pointerup", handleGlobalPointerUp);
  }, [draggingStallId, onEndDrag]);

  const snapAndMove = (stallId: string, pointX: number, pointZ: number, playSound = false) => {
    const halfW = venue.hallWidth / 2 - 2;
    const halfL = venue.hallLength / 2 - 2;
    let clampedX = Math.max(-halfW, Math.min(halfW, Math.round(pointX * 2) / 2));
    let clampedZ = Math.max(-halfL, Math.min(halfL, Math.round(pointZ * 2) / 2));

    // Magnetic snaps:
    // 1. Centerline snap: if |clampedX| <= 1.0m, snap to 0!
    if (Math.abs(clampedX) <= 1.0) {
      clampedX = 0;
      if (playSound) playMagneticSnap(580);
    } else {
      // 2. Neighbor stall alignment snap
      for (const other of stalls) {
        if (other.id === stallId) continue;
        const [ox, , oz] = other.position;
        if (Math.abs(clampedX - ox) <= 1.0) {
          clampedX = ox;
          if (playSound) playMagneticSnap(640);
          break;
        }
        if (Math.abs(clampedZ - oz) <= 1.0) {
          clampedZ = oz;
          if (playSound) playMagneticSnap(640);
          break;
        }
      }
    }

    onMoveStall(stallId, [clampedX, 0, clampedZ]);
  };

  return (
    <mesh
      position={[0, 0, 0]}
      rotation={[-Math.PI / 2, 0, 0]}
      visible={false}
      onPointerMove={(e) => {
        if (!draggingStallId || !e.point) return;
        e.stopPropagation();
        snapAndMove(draggingStallId, e.point.x, e.point.z, false);
      }}
      onPointerUp={(e) => {
        e.stopPropagation();
        if (draggingStallId) {
          onEndDrag();
        }
      }}
      onClick={(e) => {
        e.stopPropagation();
        if (draggingStallId) {
          onEndDrag();
          return;
        }
        if (selectedStallId && e.point) {
          snapAndMove(selectedStallId, e.point.x, e.point.z, true);
        } else {
          onDeselect();
        }
      }}
    >
      <planeGeometry args={[venue.hallWidth * 2.5, venue.hallLength * 2.5]} />
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
  showFocusLights = true,
  showMagneticGuides = true,
  cinematicAutoRotate = false,
  isDark,
  isModalOpen = false,
  canvasRef,
}) => {
  const [draggingStallId, setDraggingStallId] = React.useState<string | null>(null);

  const handleStartDrag = (id: string) => {
    setDraggingStallId(id);
    document.body.style.cursor = "grabbing";
  };

  const handleEndDrag = () => {
    if (draggingStallId) {
      playMagneticSnap(580);
      setDraggingStallId(null);
      document.body.style.cursor = "default";
    }
  };

  return (
    <div className={`relative w-full h-full overflow-hidden select-none transition-colors duration-300 ${
      isDark ? "bg-[#07090e]" : "bg-[#f4f6fa]"
    }`}>
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
          isOrbitEnabled={!draggingStallId}
        />

        <SceneEnvironment venue={venue} isDark={isDark} />

        {/* Dynamic Lighting setup according to Time of Day & Weather (Google Studio Standard) */}
        {venue.timeOfDay === "sunset" ? (
          <>
            <ambientLight intensity={isDark ? 0.8 : 1.05} color="#fff8f0" />
            <directionalLight
              position={[20, 22, 16]}
              intensity={1.2}
              color="#ffeed6"
              castShadow
              shadow-mapSize-width={2048}
              shadow-mapSize-height={2048}
              shadow-camera-far={60}
              shadow-camera-left={-25}
              shadow-camera-right={25}
              shadow-camera-top={25}
              shadow-camera-bottom={-25}
            />
            <directionalLight position={[-15, 12, -12]} intensity={0.35} color="#e2e8f0" />
          </>
        ) : venue.timeOfDay === "night" ? (
          <>
            <ambientLight intensity={0.45} color="#cbd5e1" />
            <directionalLight
              position={[12, 28, 10]}
              intensity={0.65}
              color="#cbd5e1"
              castShadow
              shadow-mapSize-width={2048}
              shadow-mapSize-height={2048}
            />
            {/* Warm Festival Chandelier Fill */}
            <pointLight position={[0, 8, 0]} intensity={1.2} color="#fff1d6" distance={40} />
          </>
        ) : (
          <>
            <ambientLight intensity={isDark ? 0.9 : 1.25} color="#ffffff" />
            <directionalLight
              position={[15, 25, 12]}
              intensity={1.25}
              color="#fffbf2"
              castShadow
              shadow-mapSize-width={2048}
              shadow-mapSize-height={2048}
              shadow-camera-far={60}
              shadow-camera-left={-25}
              shadow-camera-right={25}
              shadow-camera-top={25}
              shadow-camera-bottom={-25}
            />
            <directionalLight position={[-15, 15, -12]} intensity={0.4} color="#e8edf8" />
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

        {/* 2D Architectural CAD Blueprint Dimension Callouts */}
        <CadBlueprintDimensionsOverlay
          venue={venue}
          stalls={stalls}
          active={viewMode === "top_down"}
        />

        {/* Magnetic Alignment Snap-Lines (Pure 3D Floor Guides, Zero Modal Bleed) */}
        <MagneticAlignmentOverlay
          venue={venue}
          stalls={stalls}
          selectedStallId={selectedStallId || draggingStallId}
          active={showMagneticGuides}
          isModalOpen={isModalOpen}
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
            isDragging={stall.id === draggingStallId}
            onSelect={onSelectStall}
            onStartDrag={handleStartDrag}
            onMove={onMoveStall}
            showFocusLights={showFocusLights}
          />
        ))}

        {/* Floor click and drag detection for interactive placement */}
        <FloorPlaneDragCatcher
          venue={venue}
          stalls={stalls}
          selectedStallId={selectedStallId}
          draggingStallId={draggingStallId}
          onEndDrag={handleEndDrag}
          onMoveStall={onMoveStall}
          onDeselect={() => onSelectStall(null)}
        />
      </Canvas>
    </div>
  );
};
