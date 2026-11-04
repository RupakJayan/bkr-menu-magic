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
  particleCount = 55,
  speed = 0.6,
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

    // Color palettes for Lusion effect
    const darkPalette = [
      "rgba(226, 201, 154, ",   // Lusion Cyan
      "rgba(56, 189, 248, ",  // Sky Glow
      "rgba(216, 179, 109, ", // Celestial Gold
      "rgba(168, 85, 247, ",  // Violet Nebula
    ];

    const lightPalette = [
      "rgba(118, 41, 52, ",   // BKR Royal Burgundy
      "rgba(183, 138, 75, ",  // Warm Gold Brass
      "rgba(2, 132, 199, ",   // Sapphire Accent
    ];

    const palette = isDark ? darkPalette : lightPalette;
    const effectiveCount = window.innerWidth < 768 ? Math.min(25, particleCount) : particleCount;

    const particles: Particle[] = [];
    for (let i = 0; i < effectiveCount; i++) {
      const baseRadius = Math.random() * 2.2 + 0.8;
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * speed,
        vy: (Math.random() - 0.5) * speed,
        radius: baseRadius,
        baseRadius,
        color: palette[Math.floor(Math.random() * palette.length)],
        alpha: Math.random() * 0.6 + 0.25,
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Render constellation filaments
      const maxDist = 110;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.hypot(dx, dy);

          if (dist < maxDist) {
            const lineAlpha = (1 - dist / maxDist) * (isDark ? 0.18 : 0.12);
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = isDark
              ? `rgba(226, 201, 154, ${lineAlpha})`
              : `rgba(183, 138, 75, ${lineAlpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      // Update and draw particles
      for (const p of particles) {
        // Move
        p.x += p.vx;
        p.y += p.vy;

        // Bounce off edges
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Mouse interaction (repulsion + growth)
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.hypot(dx, dy);

        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          const angle = Math.atan2(dy, dx);
          p.x -= Math.cos(angle) * force * 3;
          p.y -= Math.sin(angle) * force * 3;
          p.radius = p.baseRadius * (1 + force * 1.5);
        } else {
          p.radius = Math.max(p.baseRadius, p.radius * 0.95);
        }

        // Draw particle with soft radial bloom
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${p.alpha})`;
        ctx.shadowColor = isDark ? "#e2c99a" : "#b78a4b";
        ctx.shadowBlur = isDark ? 8 : 4;
        ctx.fill();
        ctx.shadowBlur = 0; // reset
      }

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
      className={`pointer-events-none absolute inset-0 z-0 h-full w-full ${className}`}
      aria-hidden="true"
    />
  );
};
