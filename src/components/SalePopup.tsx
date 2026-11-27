"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { PHOTOS } from "@/lib/photos";
import {
  SALE_DEAL_LINE,
  SALE_END_LABEL,
  SALE_NAME,
  SALE_SINGLE_LINE,
  SALE_TIER_NOTE,
} from "@/lib/sale";
import { useSaleLive } from "@/lib/useSaleLive";
import { SaleCountdown } from "./SaleCountdown";

/** Dismissal is remembered for the visit, not forever: a sale that runs a
 *  week shouldn't nag on every page view, and shouldn't be gone for good
 *  after one stray click either. */
const STORAGE_KEY = "mimi-crack.sale-popup.v1";

/** How far the page has to move before a scroll counts as "dismissed".
 *  Browsers can fire a scroll event while restoring a position, and iOS
 *  reports a pixel or two of rubber-banding as scroll. */
const SCROLL_TOLERANCE = 24;

/** Long enough that it reads as an invitation rather than an ambush. */
const APPEAR_DELAY = 1100;

export function SalePopup({ saleOn }: { saleOn: boolean }) {
  const on = useSaleLive(saleOn);
  const [open, setOpen] = useState(false);
  const [shown, setShown] = useState(false);

  const close = useCallback(() => {
    setShown(false);
    try {
      window.sessionStorage.setItem(STORAGE_KEY, "closed");
    } catch {
      // Private mode or blocked storage. Closing still works; it just may
      // come back on the next page, which is the harmless failure.
    }
    // Let it fade before it leaves the tree.
    window.setTimeout(() => setOpen(false), 260);
  }, []);

  // Open it, once, a beat after the page settles.
  useEffect(() => {
    if (!on) return;
    try {
      if (window.sessionStorage.getItem(STORAGE_KEY)) return;
    } catch {
      // Unreadable storage is treated as "not dismissed".
    }
    const id = window.setTimeout(() => {
      setOpen(true);
      // A second frame so the entrance transition has a state to move from.
      requestAnimationFrame(() => requestAnimationFrame(() => setShown(true)));
    }, APPEAR_DELAY);
    return () => window.clearTimeout(id);
  }, [on]);

  // Three ways out besides the X: Escape, a click past the card, or scrolling
  // the page. The scroll baseline is taken when it opens rather than assuming
  // the top of the document, so arriving mid-page doesn't close it instantly.
  useEffect(() => {
    if (!open) return;

    const from = window.scrollY;
    const onScroll = () => {
      if (Math.abs(window.scrollY - from) > SCROLL_TOLERANCE) close();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  if (!on || !open) return null;

  return (
    <div
      className={`fixed inset-0 z-[70] flex items-end justify-center p-4 transition-opacity duration-300 ease-soft sm:items-center ${
        shown ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* The backdrop is the outside-click target. It's a button so a
          keyboard can reach the same way out, and it's hidden from screen
          readers because the X below says the same thing properly. */}
      <button
        type="button"
        aria-hidden="true"
        tabIndex={-1}
        onClick={close}
        className="absolute inset-0 cursor-default bg-ink/60 backdrop-blur-[3px]"
      />

      <div
        role="dialog"
        aria-modal="false"
        aria-labelledby="sale-popup-title"
        className={`relative w-full max-w-[26rem] overflow-hidden rounded-[1.75rem] bg-ink text-shell shadow-[0_30px_80px_-20px_rgba(26,22,19,0.55)] transition-all duration-500 ease-soft motion-reduce:transition-none ${
          shown ? "translate-y-0 scale-100" : "translate-y-3 scale-[0.98]"
        }`}
      >
        <div className="relative aspect-[16/9] w-full">
          <Image
            src={PHOTOS.productArray}
            alt="A batch of MiMi Crack jars, one open with a spatula resting in it"
            fill
            sizes="(min-width: 640px) 26rem, 100vw"
            className="object-cover"
            style={{ objectPosition: "50% 45%" }}
          />
          {/* Grounds the photo into the card so the type below it doesn't
              sit on a hard seam. */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-ink via-ink/25 to-transparent"
          />
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full bg-ink/55 text-[1.05rem] text-shell backdrop-blur transition-colors duration-300 hover:bg-ink/80"
          >
            <span aria-hidden="true">✕</span>
          </button>
        </div>

        <div className="px-6 pb-7 pt-1 sm:px-7">
          <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.6rem] uppercase tracking-[0.2em] text-pistachio">
            {SALE_NAME}
            <span aria-hidden="true" className="text-shell/25">
              ·
            </span>
            <span className="text-shell/55">One week only</span>
          </p>

          <p id="sale-popup-title" className="display mt-3 text-[clamp(2rem,9vw,2.6rem)] leading-none">
            {SALE_DEAL_LINE}
          </p>
          <p className="font-script mt-2 text-[1.75rem] leading-none text-pistachio-deep">
            Stock the shelf.
          </p>
          <p className="mt-3 text-[0.95rem] text-shell/65">
            {SALE_SINGLE_LINE}{" "}
            <span aria-hidden="true" className="text-shell/25">
              ·
            </span>{" "}
            {SALE_TIER_NOTE}
          </p>

          <SaleCountdown className="mt-5" />

          <Link
            href="/product"
            onClick={close}
            className="mt-6 flex min-h-12 w-full items-center justify-center gap-3 rounded-full bg-shell px-6 text-[0.95rem] text-ink transition-transform duration-500 ease-soft hover:-translate-y-0.5 motion-reduce:transition-none"
          >
            Shop the jar
            <span aria-hidden="true">→</span>
          </Link>

          <p className="mt-4 text-center text-[0.7rem] text-shell/40">
            Ends {SALE_END_LABEL}
          </p>
        </div>
      </div>
    </div>
  );
}
