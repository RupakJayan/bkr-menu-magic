import React from "react";

interface VectorIconProps {
  className?: string;
  size?: number;
}

export const CrosshairVector: React.FC<VectorIconProps> = ({ className = "", size = 18 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="8" strokeOpacity="0.4" strokeDasharray="2 2" />
    <circle cx="12" cy="12" r="3" strokeWidth="1.5" />
    <path d="M12 2V6M12 18V22M2 12H6M18 12H22" strokeLinecap="round" />
    <circle cx="12" cy="12" r="0.75" fill="currentColor" />
  </svg>
);

export const DimensionCaliperVector: React.FC<VectorIconProps> = ({ className = "", size = 18 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <path d="M4 6V18M20 6V18" strokeLinecap="round" />
    <path d="M4 12H20" strokeLinecap="round" />
    <path d="M7 9L4 12L7 15M17 9L20 12L17 15" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const CompassRoseVector: React.FC<VectorIconProps> = ({ className = "", size = 18 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="9" strokeOpacity="0.3" />
    <polygon points="12,3 14.5,10.5 21,12 14.5,13.5 12,21 9.5,13.5 3,12 9.5,10.5" fill="none" strokeWidth="1.5" />
    <polygon points="12,3 14.5,10.5 12,12" fill="currentColor" />
  </svg>
);

export const SpatialGridVector: React.FC<VectorIconProps> = ({ className = "", size = 18 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <path d="M12 2L2 7L12 12L22 7L12 2Z" strokeLinejoin="round" />
    <path d="M2 17L12 22L22 17" strokeLinejoin="round" />
    <path d="M2 12L12 17L22 12" strokeLinejoin="round" />
  </svg>
);

export const QueuingCurveVector: React.FC<VectorIconProps> = ({ className = "", size = 18 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <path d="M3 20H21" strokeLinecap="round" />
    <path d="M3 4V20" strokeLinecap="round" />
    <path d="M4 17C9 17 11 15 14 9C17 3 19 3 20 3" strokeWidth="1.75" strokeLinecap="round" />
    <circle cx="14" cy="9" r="1.5" fill="currentColor" />
  </svg>
);

export const DatumVector: React.FC<VectorIconProps> = ({ className = "", size = 18 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="7" strokeOpacity="0.4" />
    <path d="M12 5V19M5 12H19" strokeLinecap="round" />
  </svg>
);
