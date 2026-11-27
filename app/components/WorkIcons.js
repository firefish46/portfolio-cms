// Custom line icons for the work categories. 48×48 grid, 1.5px strokes,
// drawn in currentColor so they follow the neutral palette.

const base = {
  width: 48,
  height: 48,
  viewBox: "0 0 48 48",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
};

/** Vector pen tool drawing a bezier curve, with anchors and handles. */
export function GraphicDesignIcon(props) {
  return (
    <svg {...base} {...props}>
      {/* pen nib, tip resting on the curve */}
      <path d="M19 9V5h10v4" />
      <path d="M24 32 15 19l4-10h10l4 10z" />
      <path d="M24 32v-9.5" />
      <circle cx="24" cy="20.5" r="2" />
      {/* bezier curve */}
      <path d="M6 40c8-10 28-10 36 0" />
      {/* handles */}
      <path d="M6 40 12 31M42 40l-6-9" strokeDasharray="1.5 2.5" />
      <circle cx="12" cy="31" r="1.5" />
      <circle cx="36" cy="31" r="1.5" />
      {/* anchors */}
      <rect x="4" y="38" width="4" height="4" rx="0.8" />
      <rect x="40" y="38" width="4" height="4" rx="0.8" />
    </svg>
  );
}

/** Browser window with a hero block and content columns. */
export function WebsitesIcon(props) {
  return (
    <svg {...base} {...props}>
      <rect x="4" y="8" width="40" height="32" rx="4" />
      <path d="M4 15h40" />
      <circle cx="8.5" cy="11.5" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="12" cy="11.5" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="15.5" cy="11.5" r="0.9" fill="currentColor" stroke="none" />
      <rect x="9" y="20" width="18" height="9" rx="1.5" />
      <path d="M31 21h8M31 25h6M31 29h7" />
      <path d="M9 34h8M21 34h8M33 34h6" />
    </svg>
  );
}

/** Phone with a 2×2 app grid and home indicator. */
export function MobileAppIcon(props) {
  return (
    <svg {...base} {...props}>
      <rect x="13" y="3" width="22" height="42" rx="5" />
      <path d="M21 7h6" />
      <rect x="17.5" y="13" width="5" height="5" rx="1.5" />
      <rect x="25.5" y="13" width="5" height="5" rx="1.5" />
      <rect x="17.5" y="21" width="5" height="5" rx="1.5" />
      <rect x="25.5" y="21" width="5" height="5" rx="1.5" />
      <path d="M21 40h6" />
    </svg>
  );
}

/** A loose cluster of primitives: "everything else". */
export function OthersIcon(props) {
  return (
    <svg {...base} {...props}>
      <circle cx="15" cy="15" r="8" />
      <rect x="27" y="7" width="15" height="15" rx="3" />
      <path d="M15 27 23 41H7z" />
      <path d="M34.5 28v12M28.5 34h12" />
    </svg>
  );
}

export const CATEGORY_ICONS = {
  "graphic-design": GraphicDesignIcon,
  websites: WebsitesIcon,
  "mobile-app": MobileAppIcon,
  others: OthersIcon,
};
