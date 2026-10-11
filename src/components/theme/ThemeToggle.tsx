import React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

interface ThemeToggleProps {
  /** Renders the variant name beside the icon. */
  showLabel?: boolean;
  className?: string;
}

/**
 * Switches between the warm light and deep sage dark palettes.
 * Both read from the same --tp-* tokens, so nothing else changes.
 */
export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  showLabel = false,
  className = "",
}) => {
  const { resolvedTheme, toggleTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      title={isDark ? "Switch to light theme" : "Switch to dark theme"}
      className={`tp-pressable inline-flex h-10 items-center gap-2 rounded-btn border border-line bg-transparent px-3 text-sm font-semibold text-ink hover:bg-surf2 ${className}`}
    >
      {isDark ? (
        <Moon className="h-4 w-4" aria-hidden="true" />
      ) : (
        <Sun className="h-4 w-4" aria-hidden="true" />
      )}
      {showLabel && <span>{isDark ? "Light" : "Dark"}</span>}
    </button>
  );
};
