import { useTheme } from "@/contexts/ThemeContext";

interface BrandLogoProps {
  alt?: string;
  className?: string;
}

export function BrandLogo({
  alt = "BKR Catering",
  className = "",
}: BrandLogoProps) {
  const { resolvedTheme } = useTheme();

  return (
    <img
      src={
        resolvedTheme === "dark"
          ? "/bkr-catering-dark-logo.png"
          : "/bkr-catering-reference.png"
      }
      alt={alt}
      width={800}
      height={396}
      decoding="async"
      className={`bkr-brand-logo ${className}`.trim()}
    />
  );
}
