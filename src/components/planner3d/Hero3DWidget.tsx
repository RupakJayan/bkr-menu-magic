import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Float, Text } from "@react-three/drei";
import * as THREE from "three";
import { useNavigate } from "react-router-dom";
import { Maximize2, Utensils } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CrosshairVector, DatumVector } from "@/components/ui/VectorIcons";

const DosaStallModel: React.FC = () => {
  const meshRef = useRef<THREE.Group | null>(null);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = clock.getElapsedTime() * 0.35;
    }
  });

  return (
    <group ref={meshRef}>
      {/* 1. Precision Metric Base Plinth */}
      <mesh position={[0, -0.6, 0]}>
        <cylinderGeometry args={[2.2, 2.4, 0.16, 32]} />
        <meshStandardMaterial
          color="#0e1017"
          roughness={0.3}
          metalness={0.8}
        />
      </mesh>

      {/* 2. Geometric Coordinate Datum Ring */}
      <mesh position={[0, -0.51, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.9, 2.05, 32]} />
        <meshBasicMaterial color="#e2c99a" side={THREE.DoubleSide} transparent opacity={0.35} />
      </mesh>

      {/* 3. 3D Architectural Counter Assembly */}
      <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.15}>
        {/* Obsidian Stone Counter Base */}
        <mesh position={[0, 0, 0]} castShadow>
          <boxGeometry args={[2.2, 0.8, 1.2]} />
          <meshStandardMaterial color="#1a1c24" roughness={0.4} metalness={0.6} />
        </mesh>

        {/* Stainless Steel Deck Top */}
        <mesh position={[0, 0.42, 0]}>
          <boxGeometry args={[2.3, 0.05, 1.3]} />
          <meshStandardMaterial color="#2d313d" metalness={0.9} roughness={0.2} />
        </mesh>

        {/* Seasoned Cast Iron Griddle (185°C) */}
        <mesh position={[0, 0.46, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.38, 32]} />
          <meshStandardMaterial color="#d4af37" emissive="#967822" emissiveIntensity={0.2} />
        </mesh>

        {/* Champagne Titanium Columns */}
        {[-0.95, 0.95].map((x, i) => (
          <React.Fragment key={i}>
            <mesh position={[x, 0.8, -0.45]}>
              <cylinderGeometry args={[0.025, 0.025, 1.6, 8]} />
              <meshStandardMaterial color="#e2c99a" metalness={0.95} roughness={0.15} />
            </mesh>
            <mesh position={[x, 0.8, 0.45]}>
              <cylinderGeometry args={[0.025, 0.025, 1.6, 8]} />
              <meshStandardMaterial color="#e2c99a" metalness={0.95} roughness={0.15} />
            </mesh>
          </React.Fragment>
        ))}

        {/* Overhead Monolith Canopy */}
        <mesh position={[0, 1.6, 0]}>
          <boxGeometry args={[2.3, 0.16, 1.3]} />
          <meshStandardMaterial color="#11131a" roughness={0.3} metalness={0.7} />
        </mesh>

        {/* Architectural Label */}
        <Text
          position={[0, 1.78, 0.66]}
          fontSize={0.16}
          color="#f4f6fa"
          anchorX="center"
          anchorY="middle"
        >
          LIVE DOSA // BAY 01
        </Text>
      </Float>
    </group>
  );
};

export const Hero3DWidget: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="relative w-full max-w-xl mx-auto aspect-square sm:aspect-[4/3] rounded-2xl overflow-hidden border border-white/10 bg-[#090a0f]/90 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] group select-none">
      {/* 3D WebGL Canvas */}
      <Canvas shadows camera={{ position: [0, 2.2, 4.2], fov: 42 }}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 8, 5]} intensity={1.8} castShadow />
        <pointLight position={[0, 3, 0]} intensity={1.2} color="#fff" />
        <pointLight position={[0, 1, 2]} intensity={0.8} color="#e2c99a" />
        <DosaStallModel />
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={1.0} maxPolarAngle={Math.PI / 2 - 0.1} />
      </Canvas>

      {/* Top Left CAD Telemetry Badge */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
        <span className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#12141c]/90 border border-white/10 text-white text-[10px] font-mono tracking-wider">
          <DatumVector size={12} className="text-[#e2c99a]" />
          <span>STALL // 3.0m × 1.5m</span>
        </span>
      </div>

      {/* Top Right Interaction Prompt */}
      <div className="absolute top-4 right-4 z-10">
        <span className="px-2.5 py-1 rounded-md bg-black/70 border border-white/10 text-neutral-300 text-[10px] font-mono">
          DRAG TO ORBIT 360°
        </span>
      </div>

      {/* Bottom Technical Telemetry Card */}
      <div className="absolute bottom-4 inset-x-4 z-10 p-3.5 rounded-xl bg-[#0c0e14]/90 border border-white/10 backdrop-blur-xl flex items-center justify-between gap-3">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <CrosshairVector size={14} className="text-[#e2c99a]" />
            <span className="font-mono font-bold text-xs text-white">LIVE COOKING MODULE</span>
          </div>
          <p className="text-[10px] font-mono text-neutral-400 mt-0.5">
            Capacity: 1,200 dosas/hr • Thermal recovery: 6.2s • Erlang-C Queue
          </p>
        </div>

        <Button
          size="sm"
          onClick={() => navigate("/3d-planner")}
          className="h-8 px-3.5 text-xs font-mono font-bold bg-[#e2c99a] hover:bg-[#c5a059] text-black rounded-lg shadow-sm flex items-center gap-1.5 shrink-0 transition-transform active:scale-95"
        >
          <Maximize2 className="h-3 w-3" />
          <span>Full 3D Stage</span>
        </Button>
      </div>
    </div>
  );
};
