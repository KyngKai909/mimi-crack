/** The botanical sprig from the label, used as a section divider. */
export function Sprig({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 24"
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.1"
      strokeLinecap="round"
    >
      <path d="M6 12h34M80 12h34" />
      <path d="M60 4c-4 3-6 6-6 8s2 5 6 8c4-3 6-6 6-8s-2-5-6-8Z" />
      <path d="M60 4v16" />
      <path d="M46 12c2-2 4-3 6-3M74 12c-2-2-4-3-6-3" />
    </svg>
  );
}
