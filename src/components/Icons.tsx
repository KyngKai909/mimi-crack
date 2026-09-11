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

/* --- handling ------------------------------------------------------------
   Drawn to the same optical bounds as the chrome icons above, and used at a
   smaller size inside the handling pills. Each one has to survive at 16px, so
   none of them carry more than three strokes. */

/** A hand — for "external use only". */
export function HandIcon({ className = SIZE }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M10.3 12.4V7.1a1.3 1.3 0 0 1 2.6 0v4" />
      <path d="M12.9 11.1V6.2a1.3 1.3 0 0 1 2.6 0v5.2" />
      <path d="M15.5 11.4V8.5a1.3 1.3 0 0 1 2.5 0v5.9a5.6 5.6 0 0 1-5.6 5.6h-1a4.4 4.4 0 0 1-3.1-1.3l-2.2-2.2a1.3 1.3 0 0 1 1.9-1.9l1.6 1.4" />
    </svg>
  );
}

/** An eye — for "avoid the eyes". */
export function EyeIcon({ className = SIZE }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M5.6 12.5s2.8-4.9 6.4-4.9 6.4 4.9 6.4 4.9-2.8 4.9-6.4 4.9-6.4-4.9-6.4-4.9Z" />
      <circle cx="12" cy="12.5" r="2.1" />
    </svg>
  );
}

/** An alert — for "stop if it irritates". */
export function AlertIcon({ className = SIZE }: IconProps) {
  return (
    <svg {...base} className={className}>
      <circle cx="12" cy="12.5" r="6.6" />
      <path d="M12 9.2v3.7" />
      <path d="M12 15.8h.01" />
    </svg>
  );
}

/** A small figure — for "keep from children". */
export function ChildIcon({ className = SIZE }: IconProps) {
  return (
    <svg {...base} className={className}>
      <circle cx="12" cy="8" r="2.4" />
      <path d="M8.2 19.8v-3.3a3.8 3.8 0 0 1 7.6 0v3.3" />
    </svg>
  );
}

/** A thermometer — for "store below 80°F". */
export function ThermometerIcon({ className = SIZE }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M13.8 14V7.3a1.8 1.8 0 1 0-3.6 0V14a3.4 3.4 0 1 0 3.6 0Z" />
      <path d="M12 10.6v5.5" />
    </svg>
  );
}
