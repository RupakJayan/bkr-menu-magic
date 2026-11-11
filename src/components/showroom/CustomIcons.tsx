import React from "react";

interface IconProps {
  className?: string;
  size?: number;
}

export const SphereIcon: React.FC<IconProps> = ({ className = "", size = 20 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`transition-transform duration-300 group-hover:rotate-45 group-hover:scale-110 ${className}`}
  >
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
    <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="12" cy="12" r="1.5" fill="currentColor" />
  </svg>
);

export const Compass3DIcon: React.FC<IconProps> = ({ className = "", size = 20 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`transition-all duration-300 group-hover:rotate-180 group-hover:scale-110 ${className}`}
  >
    <path
      d="M12 2L15 9L22 12L15 15L12 22L9 15L2 12L9 9L12 2Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <circle cx="12" cy="12" r="2" fill="currentColor" />
  </svg>
);

export const RaytraceIcon: React.FC<IconProps> = ({ className = "", size = 20 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`transition-all duration-300 group-hover:scale-125 ${className}`}
  >
    <path d="M4 4L20 20M20 4L4 20" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.4" />
    <circle cx="12" cy="12" r="7" stroke="currentColor" strokeWidth="1.5" />
    <path d="M12 2V6M12 18V22M2 12H6M18 12H22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const ApertureIcon: React.FC<IconProps> = ({ className = "", size = 20 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`transition-transform duration-500 group-hover:rotate-90 ${className}`}
  >
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
    <path d="M14.31 8L20.05 17.94" stroke="currentColor" strokeWidth="1.5" />
    <path d="M9.69 8H21.21" stroke="currentColor" strokeWidth="1.5" />
    <path d="M7.38 12L13.12 2.06" stroke="currentColor" strokeWidth="1.5" />
    <path d="M9.69 16L3.95 6.06" stroke="currentColor" strokeWidth="1.5" />
    <path d="M14.31 16H2.79" stroke="currentColor" strokeWidth="1.5" />
    <path d="M16.62 12L10.88 21.94" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);
