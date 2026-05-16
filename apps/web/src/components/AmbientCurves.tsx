/**
 * Decorative full-viewport SVG curves. Pointer-events none; respects reduced motion in CSS.
 */
export function AmbientCurves() {
  return (
    <div className="ambient-curves" aria-hidden="true">
      <svg
        className="ambient-curves__svg"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="ambient-grad-a" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--ambient-stroke-1)" stopOpacity="0.45" />
            <stop offset="100%" stopColor="var(--ambient-stroke-2)" stopOpacity="0.2" />
          </linearGradient>
          <linearGradient id="ambient-grad-b" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="var(--ambient-stroke-3)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="var(--ambient-stroke-1)" stopOpacity="0.12" />
          </linearGradient>
        </defs>
        <g className="ambient-curves__layer ambient-curves__layer--a">
          <path
            fill="none"
            stroke="url(#ambient-grad-a)"
            strokeWidth="2.5"
            d="M-120 420 C 280 180, 520 620, 920 380 S 1320 200, 1580 480"
          />
          <path
            fill="none"
            stroke="url(#ambient-grad-b)"
            strokeWidth="2"
            d="M-80 720 C 340 520, 600 880, 1000 600 S 1400 400, 1620 780"
          />
        </g>
        <g className="ambient-curves__layer ambient-curves__layer--b">
          <path
            fill="none"
            stroke="url(#ambient-grad-b)"
            strokeWidth="1.8"
            d="M200 -40 C 420 200, 180 480, 520 720 S 1100 520, 1380 860"
          />
          <path
            fill="none"
            stroke="url(#ambient-grad-a)"
            strokeWidth="2"
            d="M-40 200 C 360 80, 480 360, 780 220 S 1180 120, 1500 320"
          />
        </g>
      </svg>
    </div>
  );
}
