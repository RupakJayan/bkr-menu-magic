import { useEffect, useRef, useState } from "react";
import { BrandLogo } from "@/components/BrandLogo";
import { useTheme } from "@/contexts/ThemeContext";

interface OpeningLoaderProps {
  onComplete: () => void;
}

export function OpeningLoader({ onComplete }: OpeningLoaderProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const [reducedMotion] = useState(() =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  useEffect(() => {
    const timeout = window.setTimeout(
      onComplete,
      reducedMotion ? 900 : isDark ? 1600 : 6000,
    );

    if (!reducedMotion && !isDark) {
      void videoRef.current?.play().catch(() => undefined);
    }

    return () => window.clearTimeout(timeout);
  }, [isDark, onComplete, reducedMotion]);

  return (
    <div
      className="bkr-opening-loader"
      role="status"
      aria-label="BKR Catering opening"
    >
      <div className="bkr-opening-content">
        {isDark || reducedMotion ? (
          <BrandLogo className="bkr-opening-static-logo" />
        ) : (
          <div className="bkr-opening-video-frame">
            <video
              ref={videoRef}
              className="bkr-opening-video"
              muted
              playsInline
              preload="auto"
              poster="/bkr-catering-reference.png"
              onEnded={onComplete}
              onError={onComplete}
            >
              <source src="/bkr-logo-intro.mp4" type="video/mp4" />
            </video>
          </div>
        )}
        <p>Good food, warmly served.</p>
      </div>
      <button
        type="button"
        className="bkr-opening-skip"
        onClick={onComplete}
      >
        Skip intro
      </button>
    </div>
  );
}
