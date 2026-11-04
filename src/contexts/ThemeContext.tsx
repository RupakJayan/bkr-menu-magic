import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { assetUrl } from "@/utils/assetUrl";

/**
 * WEDDING SUITE ships one palette with a light "paper" and a dark "dusk"
 * variant of the same token contract, so switching is only a matter of the
 * `dark` class on <html>. "system" follows the visitor's OS preference.
 */
export type Theme = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

const STORAGE_KEY = "theme";
const DARK_CLASS = "dark";
const MEDIA_QUERY = "(prefers-color-scheme: dark)";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: ResolvedTheme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

const isTheme = (value: string | null): value is Theme =>
  value === "light" || value === "dark" || value === "system";

const readStoredTheme = (): Theme => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return isTheme(stored) ? stored : "system";
  } catch {
    return "system";
  }
};

const systemPrefersDark = (): boolean => {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia(MEDIA_QUERY).matches;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [theme, setTheme] = useState<Theme>(readStoredTheme);
  const [systemDark, setSystemDark] = useState<boolean>(systemPrefersDark);

  // Track the OS preference so "system" stays live.
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;

    const mediaQuery = window.matchMedia(MEDIA_QUERY);
    const handleChange = (event: MediaQueryListEvent) =>
      setSystemDark(event.matches);

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const resolvedTheme: ResolvedTheme =
    theme === "system" ? (systemDark ? "dark" : "light") : theme;

  useEffect(() => {
    const isDark = resolvedTheme === "dark";
    document.documentElement.classList.toggle(DARK_CLASS, isDark);
    const favicon = document.querySelector<HTMLLinkElement>('link[rel~="icon"]');
    if (favicon) {
      favicon.href = isDark
        ? assetUrl("/bkr-catering-dark-logo.png")
        : assetUrl("/bkr-catering-reference.png");
    }
  }, [resolvedTheme]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      /* storage unavailable - the in-memory choice still applies */
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((current) => {
      const isDark = current === "system" ? systemPrefersDark() : current === "dark";
      return isDark ? "light" : "dark";
    });
  }, []);

  return (
    <ThemeContext.Provider
      value={{ theme, setTheme, resolvedTheme, toggleTheme }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
