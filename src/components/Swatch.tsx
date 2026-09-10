"use client";

import { useEffect, useRef, useState } from "react";
import type { ColorToken } from "@/lib/designTokens";

/** rgb(26, 22, 19) → #1a1613. Leaves anything it doesn't recognise alone. */
function toHex(value: string): string {
  const m = value.match(/rgba?\(([^)]+)\)/i);
  if (!m) return value.trim();
  const parts = m[1].split(/[,\s/]+/).filter(Boolean).map(Number);
  const [r, g, b] = parts;
  if ([r, g, b].some((n) => !Number.isFinite(n))) return value.trim();
  const hex = [r, g, b].map((n) => n.toString(16).padStart(2, "0")).join("");
  const a = parts[3];
  // Alpha survives as a fourth pair so translucent tokens stay honest.
  const alpha =
    a !== undefined && a < 1
      ? Math.round(a * 255).toString(16).padStart(2, "0")
      : "";
  return `#${hex}${alpha}`;
}

/**
 * One colour chip.
 *
 * Reads its value off the live stylesheet rather than repeating a hex code in
 * two places — change `globals.css` and this reports the new value. Both hex
 * and RGB are shown because the RGB form is what design tools and print work
 * actually want.
 */
export function Swatch({ token }: { token: ColorToken }) {
  const chip = useRef<HTMLDivElement>(null);
  const [rgb, setRgb] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    if (!chip.current) return;
    setRgb(getComputedStyle(chip.current).backgroundColor);
  }, []);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(null), 1400);
    return () => clearTimeout(t);
  }, [copied]);

  const hex = rgb ? toHex(rgb) : null;

  async function copy(value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(value);
    } catch {
      // Clipboard blocked (insecure context, denied permission). The values
      // are on screen and selectable, so there's nothing to recover from.
    }
  }

  return (
    <div>
      <div
        ref={chip}
        style={{ background: `var(--${token.variable})` }}
        className="h-28 w-full rounded-2xl border border-hairline"
      />
      <p className="display display-md mt-4">{token.name}</p>

      <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
        <button
          type="button"
          onClick={() => hex && copy(hex)}
          className="link-draw text-sm text-ink tabular-nums"
          aria-label={hex ? `Copy hex ${hex}` : "Loading colour value"}
        >
          {copied === hex ? "Copied" : (hex ?? "—")}
        </button>
        <button
          type="button"
          onClick={() => rgb && copy(rgb)}
          className="link-draw text-sm text-ink-mute"
          aria-label={rgb ? `Copy ${rgb}` : "Loading colour value"}
        >
          {copied === rgb ? "Copied" : (rgb ?? "")}
        </button>
      </div>

      <p className="mt-2 text-[0.8rem] leading-relaxed text-ink-mute">
        <code className="text-ink-soft">--{token.variable}</code>
      </p>
      <p className="mt-2 text-sm leading-relaxed text-ink-soft">{token.usage}</p>
    </div>
  );
}
