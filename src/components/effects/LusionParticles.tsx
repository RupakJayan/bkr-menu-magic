import React, { useEffect, useRef } from "react";
import { useTheme } from "@/contexts/ThemeContext";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseRadius: number;
  color: string;
  alpha: number;
}

interface LusionParticlesProps {
  className?: string;
  particleCount?: number;
  speed?: number;
  interactive?: boolean;
}

export const LusionParticles: React.FC<LusionParticlesProps> = ({
  className = "",
  particleCount = 45,
  speed = 0.5,
  interactive = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const mouse = {
      x: -1000,
      y: -1000,
      radius: 120,
    };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    window.addEventListener("resize", handleResize);
    if (interactive && canvas.parentElement) {
      canvas.parentElement.addEventListener("mousemove", handleMouseMove);
      canvas.parentElement.addEventListener("mouseleave", handleMouseLeave);
    }

    // Studio 3D Palettes: Warm Champagne, Brushed Brass, Titanium Pearl
    const darkPalette = [
      "rgba(226, 201, 154, ", // Brushed Champagne Gold
      "rgba(197, 160, 89, ",  // Warm Antique Brass
      "rgba(244, 239, 230, ", // Polished Titanium Pearl
      "rgba(180, 140, 75, ",  // Deep Amber Ochre
    ];

    const lightPalette = [
      "rgba(118, 41, 52, ",   // BKR Heritage Maroon
      "rgba(197, 160, 89, ",  // Warm Gold Brass
      "rgba(85, 80, 75, ",    // Studio Graphite
    ];

    const palette = isDark ? darkPalette : lightPalette;
    const effectiveCount = window.innerWidth < 768 ? Math.min(20, particleCount) : particleCount;

    const particles: Particle[] = [];
    for (let i = 0; i < effectiveCount; i++) {
      const baseRadius = Math.random() * 2.0 + 0.8;
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * speed,
        vy: (Math.random() - 0.5) * speed,
        radius: baseRadius,
        baseRadius,
        color: palette[Math.floor(Math.random() * palette.length)],
        alpha: Math.random() * 0.5 + 0.2,
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Render architectural filaments
      const maxDist = 110;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.hypot(dx, dy);

          if (dist < maxDist) {
            const lineAlpha = (1 - dist / maxDist) * (isDark ? 0.16 : 0.1);
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = isDark
              ? `rgba(226, 201, 154, ${lineAlpha})`
              : `rgba(197, 160, 89, ${lineAlpha})`;
            ctx.lineWidth = 0.75;
            ctx.stroke();
          }
        }
      }

      // Draw and update particles
      particles.forEach((p) => {
        // Subtle Mouse repulsion
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.hypot(dx, dy);
        if (dist < mouse.radius) {
          const force = (1 - dist / mouse.radius) * 1.5;
          p.x += (dx / dist) * force;
          p.y += (dy / dist) * force;
          p.radius = p.baseRadius * 1.35;
        } else {
          p.radius = THREE_Math_lerp(p.radius, p.baseRadius, 0.05);
        }

        // Move
        p.x += p.vx;
        p.y += p.vy;

        // Wrap boundaries
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Draw particle with soft glow
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${p.alpha})`;
        ctx.shadowBlur = isDark ? 8 : 4;
        ctx.shadowColor = isDark ? "rgba(226, 201, 154, 0.35)" : "rgba(197, 160, 89, 0.2)";
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      if (interactive && canvas.parentElement) {
        canvas.parentElement.removeEventListener("mousemove", handleMouseMove);
        canvas.parentElement.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, [isDark, particleCount, speed, interactive]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 z-0 opacity-80 ${className}`}
    />
  );
};

function THREE_Math_lerp(x: number, y: number, t: number) {
  return (1 - t) * x + t * y;
}
