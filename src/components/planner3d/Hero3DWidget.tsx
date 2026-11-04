import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Float, Text } from "@react-three/drei";
import * as THREE from "three";
import { useNavigate } from "react-router-dom";
import { Sparkles, Maximize2, Users, Utensils } from "lucide-react";
import { Button } from "@/components/ui/button";

const HologramStall: React.FC = () => {
  const meshRef = useRef<THREE.Group | null>(null);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = clock.getElapsedTime() * 0.4;
    }
  });

  return (
    <group ref={meshRef}>
      {/* Floating Holographic Platform */}
      <mesh position={[0, -0.6, 0]}>
        <cylinderGeometry args={[2.2, 2.4, 0.2, 32]} />
        <meshStandardMaterial
          color="#0c0d16"
          emissive="#00f5d4"
          emissiveIntensity={0.2}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>

      {/* Hologram Light Rings */}
      <mesh position={[0, -0.48, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.8, 2.0, 32]} />
        <meshBasicMaterial color="#00f5d4" side={THREE.DoubleSide} transparent opacity={0.6} />
      </mesh>

      {/* 3D Dosa Station Model */}
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.3}>
        {/* Stainless Steel Tawa Base */}
        <mesh position={[0, 0, 0]} castShadow>
          <boxGeometry args={[2.2, 0.8, 1.2]} />
          <meshStandardMaterial color="#f59e0b" roughness={0.3} metalness={0.4} />
        </mesh>
        {/* Hot Griddle Top */}
        <mesh position={[0, 0.42, 0]}>
          <boxGeometry args={[2.3, 0.05, 1.3]} />
          <meshStandardMaterial color="#334155" metalness={0.9} roughness={0.2} />
        </mesh>
        {/* Golden Roast Dosa */}
        <mesh position={[0, 0.46, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.35, 32]} />
          <meshStandardMaterial color="#fcd34d" emissive="#f59e0b" emissiveIntensity={0.3} />
        </mesh>
        {/* Brass Pillars */}
        {[-0.95, 0.95].map((x, i) => (
          <React.Fragment key={i}>
            <mesh position={[x, 0.8, -0.45]}>
              <cylinderGeometry args={[0.03, 0.03, 1.6, 8]} />
              <meshStandardMaterial color="#d8b36d" metalness={0.9} />
            </mesh>
            <mesh position={[x, 0.8, 0.45]}>
              <cylinderGeometry args={[0.03, 0.03, 1.6, 8]} />
              <meshStandardMaterial color="#d8b36d" metalness={0.9} />
            </mesh>
          </React.Fragment>
        ))}
        {/* Canopy Marquee */}
        <mesh position={[0, 1.6, 0]}>
          <boxGeometry args={[2.3, 0.2, 1.3]} />
          <meshStandardMaterial color="#762934" roughness={0.4} />
        </mesh>
        {/* Signboard Text */}
        <Text
          position={[0, 1.8, 0]}
          fontSize={0.22}
          color="#00f5d4"
          anchorX="center"
          anchorY="middle"
        >
          LIVE DOSA COUNTER
        </Text>
      </Float>
    </group>
  );
};

export const Hero3DWidget: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="relative w-full max-w-xl mx-auto aspect-square sm:aspect-[4/3] rounded-3xl overflow-hidden border border-[#00f5d4]/40 bg-gradient-to-b from-[#0c0d16]/90 via-[#050508]/95 to-[#0c0d16]/90 backdrop-blur-2xl shadow-2xl shadow-[#00f5d4]/10 group">
      {/* 3D Canvas */}
      <Canvas shadows camera={{ position: [0, 2.2, 4.2], fov: 42 }}>
        <ambientLight intensity={1.0} />
        <directionalLight position={[5, 8, 5]} intensity={1.8} castShadow />
        <pointLight position={[0, 3, 0]} intensity={1.5} color="#00f5d4" />
        <pointLight position={[0, 1, 2]} intensity={1.0} color="#f59e0b" />
        <HologramStall />
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={1.2} maxPolarAngle={Math.PI / 2 - 0.1} />
      </Canvas>

      {/* Floating HUD Badges & Overlays */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00f5d4]/15 border border-[#00f5d4]/40 text-[#00f5d4] text-[11px] font-bold uppercase tracking-wider backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-[#00f5d4] animate-ping" />
          Interactive 3D Hologram
        </span>
      </div>

      <div className="absolute top-4 right-4 z-10">
        <span className="px-2.5 py-1 rounded-full bg-black/60 border border-white/10 text-white/80 text-[10px] font-mono backdrop-blur-md">
          Drag to Rotate 360°
        </span>
      </div>

      {/* Bottom Floating Card */}
      <div className="absolute bottom-4 inset-x-4 z-10 p-3.5 rounded-2xl bg-[#0c0d16]/85 border border-white/10 backdrop-blur-xl flex items-center justify-between gap-3 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <Utensils className="h-4 w-4 text-[#f59e0b]" />
            <span className="font-bold text-xs text-white">Live Dosa & Buffet Planner</span>
          </div>
          <p className="text-[10px] text-white/70 mt-0.5">
            Auto-recommends <strong>2x Dosa Counters</strong> for &gt;200 guests to eliminate queues.
          </p>
        </div>

        <Button
          size="sm"
          onClick={() => navigate("/3d-planner")}
          className="h-8 px-3.5 text-xs bg-gradient-to-r from-[#00f5d4] to-[#0284c7] hover:opacity-90 text-black font-extrabold rounded-xl shadow-md flex items-center gap-1.5 shrink-0"
        >
          <Maximize2 className="h-3 w-3" />
          Full 3D Venue
        </Button>
      </div>
    </div>
  );
};
