import React, { useRef, useState, useCallback } from "react";

interface PhysicsCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  maxTilt?: number; // max tilt degrees (e.g. 10)
  specular?: boolean;
  className?: string;
  onClick?: () => void;
}

export const PhysicsCard: React.FC<PhysicsCardProps> = ({
  children,
  maxTilt = 8,
  specular = true,
  className = "",
  onClick,
  ...props
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState({ rotateX: 0, rotateY: 0, scale: 1 });
  const [lightPos, setLightPos] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const normX = (x / rect.width) * 2 - 1;
      const normY = (y / rect.height) * 2 - 1;

      setTransform({
        rotateX: -normY * maxTilt,
        rotateY: normX * maxTilt,
        scale: 1.015,
      });

      setLightPos({
        x: (x / rect.width) * 100,
        y: (y / rect.height) * 100,
        opacity: 0.15,
      });
    },
    [maxTilt]
  );

  const handleMouseLeave = useCallback(() => {
    setTransform({ rotateX: 0, rotateY: 0, scale: 1 });
    setLightPos((prev) => ({ ...prev, opacity: 0 }));
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        perspective: "1000px",
      }}
      className={`relative transition-transform duration-200 ease-out will-change-transform ${className}`}
      {...props}
    >
      <div
        style={{
          transform: `rotateX(${transform.rotateX}deg) rotateY(${transform.rotateY}deg) scale3d(${transform.scale}, ${transform.scale}, 1)`,
          transition: "transform 0.18s cubic-bezier(0.2, 0, 0, 1)",
          transformStyle: "preserve-3d",
        }}
        className="w-full h-full relative"
      >
        {children}

        {/* Specular light highlight hotspot */}
        {specular && (
          <div
            className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-300"
            style={{
              opacity: lightPos.opacity,
              background: `radial-gradient(circle 220px at ${lightPos.x}% ${lightPos.y}%, rgba(255, 255, 255, 0.45), transparent 70%)`,
            }}
          />
        )}
      </div>
    </div>
  );
};
