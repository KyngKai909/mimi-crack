"use client";

import { useEffect, useRef, useState } from "react";

/**
 * A line of type, labelled with the size it actually computes to at the
 * current viewport. Most of the scale is fluid, so a fixed number in a table
 * would be wrong on every screen but one.
 */
export function TypeSpecimen({
  className,
  label,
  note,
  sample,
}: {
  className: string;
  label: string;
  note: string;
  sample: string;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [meta, setMeta] = useState<string | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const read = () => {
      const cs = getComputedStyle(el);
      const px = Math.round(parseFloat(cs.fontSize));
      const lh =
        cs.lineHeight === "normal"
          ? "normal"
          : `${(parseFloat(cs.lineHeight) / parseFloat(cs.fontSize)).toFixed(2)}`;
      setMeta(`${px}px · line-height ${lh}`);
    };

    read();
    const ro = new ResizeObserver(read);
    ro.observe(document.documentElement);
    return () => ro.disconnect();
  }, []);

  return (
    <div className="hairline py-8">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <p className="eyebrow">{label}</p>
        <p className="text-[0.8rem] text-ink-mute tabular-nums">
          <code>.{className.split(" ").join(".")}</code>
          {meta ? ` — ${meta}` : ""}
        </p>
      </div>
      <p ref={ref} className={`mt-5 ${className}`}>
        {sample}
      </p>
      <p className="mt-4 max-w-md text-sm leading-relaxed text-ink-mute">{note}</p>
    </div>
  );
}
