import React, { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

interface PhysicsHoverCardProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
  magnetic?: boolean;
  specular?: boolean;
  onClick?: () => void;
}

export const PhysicsHoverCard: React.FC<PhysicsHoverCardProps> = ({
  children,
  className = "",
  maxTilt = 7,
  magnetic = true,
  specular = true,
  onClick,
}) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Raw mouse coordinates relative to card center (-0.5 to 0.5)
  const normX = useMotionValue(0);
  const normY = useMotionValue(0);

  // Physics spring configuration: high responsiveness, critical damping
  const springConfig = { stiffness: 280, damping: 20, mass: 0.6 };
  const springX = useSpring(normX, springConfig);
  const springY = useSpring(normY, springConfig);

  // Physics-based 3D rotations
  const rotateX = useTransform(springY, [-0.5, 0.5], [maxTilt, -maxTilt]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-maxTilt, maxTilt]);

  // Subtle magnetic translation
  const translateX = useTransform(springX, [-0.5, 0.5], magnetic ? [-5, 5] : [0, 0]);
  const translateY = useTransform(springY, [-0.5, 0.5], magnetic ? [-5, 5] : [0, 0]);

  // Specular light reflection coordinates (percentage)
  const [lightPos, setLightPos] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    normX.set(x);
    normY.set(y);

    if (specular) {
      setLightPos({
        x: ((e.clientX - rect.left) / rect.width) * 100,
        y: ((e.clientY - rect.top) / rect.height) * 100,
      });
    }
  };

  const handleMouseEnter = () => setIsHovered(true);

  const handleMouseLeave = () => {
    setIsHovered(false);
    normX.set(0);
    normY.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        rotateX,
        rotateY,
        x: translateX,
        y: translateY,
        transformStyle: "preserve-3d",
      }}
      className={`relative perspective-[1000px] transition-shadow duration-300 ${className}`}
    >
      {/* Specular sheen layer tracking pointer position */}
      {specular && isHovered && (
        <div
          className="pointer-events-none absolute -inset-px rounded-[inherit] opacity-60 transition-opacity duration-300 z-20"
          style={{
            background: `radial-gradient(400px circle at ${lightPos.x}% ${lightPos.y}%, rgba(226, 201, 154, 0.12), transparent 80%)`,
          }}
          aria-hidden="true"
        />
      )}

      {/* Surface content */}
      <div className="relative z-10 w-full h-full">{children}</div>
    </motion.div>
  );
};
