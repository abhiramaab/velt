export function PlaneIcon({ className = "w-5 h-5", inverse = false }: { className?: string; inverse?: boolean }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      className={`inline-block shrink-0 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 ${className}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="planeGradIcon" x1="6" y1="6" x2="28" y2="28" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#0284c7" />
        </linearGradient>
      </defs>
      {/* Main body of paper plane */}
      <path
        d="M28 4L4 16L15 19.5L23 9.5L16.5 21.5L25.5 28L28 4Z"
        fill="url(#planeGradIcon)"
        stroke={inverse ? "#ffffff" : "#0f172a"}
        strokeWidth="1.8"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {/* Underfold crease */}
      <path
        d="M15 19.5V26L18.5 22.5"
        stroke={inverse ? "#ffffff" : "#0f172a"}
        strokeWidth="1.8"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {/* Facet highlight */}
      <path
        d="M15 19.5L23 9.5L16.5 21.5L15 19.5Z"
        fill={inverse ? "#e0f2fe" : "#bae6fd"}
        stroke={inverse ? "#ffffff" : "#0f172a"}
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Logo({
  className = "",
  showIcon = true,
  inverse = false,
}: {
  className?: string;
  showIcon?: boolean;
  inverse?: boolean;
}) {
  return (
    <span className={`group inline-flex items-center gap-2 font-lastik tracking-[-0.02em] ${className}`}>
      {showIcon && <PlaneIcon className="w-5 h-5 sm:w-6 sm:h-6" inverse={inverse} />}
      <span>velt</span>
    </span>
  );
}
