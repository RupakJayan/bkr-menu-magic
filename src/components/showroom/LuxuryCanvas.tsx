import React, { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, ContactShadows, Float } from "@react-three/drei";
import * as THREE from "three";
import { HeroModel } from "./HeroModel";
import { CameraScrollRig } from "./CameraScrollRig";

function DynamicLighting() {
  const lightRef = useRef<THREE.DirectionalLight>(null);

  useFrame((state, delta) => {
    if (!lightRef.current) return;
    // Dynamic specular highlight tracking pointer coordinates
    const targetX = state.pointer.x * 5;
    const targetY = state.pointer.y * 3 + 4;
    lightRef.current.position.x = THREE.MathUtils.lerp(lightRef.current.position.x, targetX, delta * 3);
    lightRef.current.position.y = THREE.MathUtils.lerp(lightRef.current.position.y, targetY, delta * 3);
  });

  return (
    <>
      <ambientLight intensity={0.45} />
      <directionalLight
        ref={lightRef}
        position={[4, 5, 4]}
        intensity={2.4}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0001}
        color="#fffaf0"
      />
      {/* Warm Champagne Gold Rim Light */}
      <spotLight
        position={[-5, 2.5, -4]}
        intensity={2.0}
        color="#e2c99a"
        angle={0.65}
        penumbra={0.8}
      />
      {/* Cold Deep Titanium Fill */}
      <pointLight position={[0, -2.5, 2]} intensity={0.6} color="#7a8da3" />
    </>
  );
}

interface LuxuryCanvasProps {
  scrollProgress: number;
  activeHotspot: string | null;
  onSelectHotspot: (id: string | null) => void;
}

export const LuxuryCanvas: React.FC<LuxuryCanvasProps> = ({
  scrollProgress,
  activeHotspot,
  onSelectHotspot,
}) => {
  return (
    <div className="fixed inset-0 w-full h-full pointer-events-auto z-0">
      <Canvas
        shadows
        gl={{
          antialias: true,
          alpha: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.15,
          powerPreference: "high-performance",
        }}
        dpr={[1, 2]}
        camera={{ position: [0, 0.5, 5.2], fov: 42 }}
      >
        <Suspense fallback={null}>
          <DynamicLighting />
          <Environment preset="city" environmentIntensity={0.5} />

          <CameraScrollRig scrollProgress={scrollProgress} activeHotspot={activeHotspot} />

          <Float speed={1.2} rotationIntensity={0.12} floatIntensity={0.2}>
            <HeroModel activeHotspot={activeHotspot} onSelectHotspot={onSelectHotspot} />
          </Float>

          {/* Luxury Soft Contact Shadow */}
          <ContactShadows
            position={[0, -1.3, 0]}
            opacity={0.7}
            scale={11}
            blur={2.6}
            far={4.5}
            color="#050608"
          />
        </Suspense>
      </Canvas>
    </div>
  );
};
