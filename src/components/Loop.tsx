"use client";

import { useEffect, useState } from "react";

/**
 * A short clip that plays itself, quietly and forever.
 *
 * Muted, inline and looping, which is what lets it autoplay at all — a browser
 * will block anything with sound. It replaces what would otherwise be a GIF:
 * same effect, a fraction of the weight, and none of the banding.
 *
 * Renders the poster frame on the server and swaps in the video on the client,
 * so it costs nothing until it's mounted — and under prefers-reduced-motion it
 * simply stays a still photograph rather than moving at someone who asked the
 * whole system not to.
 */
export function Loop({
  src,
  label,
  ratio = "3 / 4",
  className = "",
}: {
  /** Path without extension: /video/howto → howto.webm, howto.mp4, -poster.webp */
  src: string;
  label: string;
  ratio?: string;
  className?: string;
}) {
  const [motion, setMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setMotion(!mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return (
    <div
      style={{ aspectRatio: ratio }}
      className={`relative w-full overflow-hidden bg-shell-warm ${className}`}
    >
      {motion ? (
        <video
          className="absolute inset-0 h-full w-full object-cover"
          poster={`${src}-poster.webp`}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-label={label}
        >
          <source src={`${src}.webm`} type="video/webm" />
          <source src={`${src}.mp4`} type="video/mp4" />
        </video>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`${src}-poster.webp`}
          alt={label}
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
    </div>
  );
}
