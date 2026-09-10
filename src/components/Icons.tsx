/**
 * Line icons.
 *
 * All four are drawn to the same optical bounds inside the 24px box — roughly
 * x 6→18, y 5→20 — so they read as one set. Sizing is fixed here rather than
 * left to each call site; passing different Tailwind sizes in different places
 * is what made the header look mismatched.
 */
type IconProps = { className?: string };

/** One size for every icon in the chrome. */
const SIZE = "h-5 w-5 shrink-0";

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.4,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

/** The jar — used for "shop", since the shop is one jar. */
export function JarIcon({ className = SIZE }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M6.6 8.4h10.8a.9.9 0 0 1 .9.9v8.9a2 2 0 0 1-2 2H7.7a2 2 0 0 1-2-2V9.3a.9.9 0 0 1 .9-.9Z" />
      <path d="M8 8.4V6a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2.4" />
      <path d="M9 13.4c1.4-1 4.6-1 6 0" />
    </svg>
  );
}

export function BagIcon({ className = SIZE }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M6.6 8.4h10.8l.9 10.5a1 1 0 0 1-1 1.1H6.7a1 1 0 0 1-1-1.1Z" />
      <path d="M9.3 10.6V7.6a2.7 2.7 0 0 1 5.4 0v3" />
    </svg>
  );
}

export function MenuIcon({ className = SIZE }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M5 9h14M5 15h14" />
    </svg>
  );
}

export function CloseIcon({ className = SIZE }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M6.5 6.5l11 11M17.5 6.5l-11 11" />
    </svg>
  );
}
