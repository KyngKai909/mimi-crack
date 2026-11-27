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

/**
 * The sale, offered once on the home page.
 *
 * Same dark card as the rest of the site — forest, shell type, a script line
 * in pistachio, a house pill for the way out — so it reads as the shop
 * talking rather than an ad someone dropped on top of it. Nothing here
 * animates faster than the page's own easing.
 */
export function SalePopup({ saleOn }: { saleOn: boolean }) {
  const on = useSaleLive(saleOn);
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);

  const close = useCallback(() => {
    setClosing(true);
    try {
      window.sessionStorage.setItem(STORAGE_KEY, "closed");
    } catch {
      // Private mode or blocked storage. Closing still works; it just may
      // come back on the next page, which is the harmless failure.
    }
    // Let it fade before it leaves the tree.
    window.setTimeout(() => setOpen(false), 420);
  }, []);

  // Open it, once, a beat after the page settles.
  useEffect(() => {
    if (!on) return;
    try {
      if (window.sessionStorage.getItem(STORAGE_KEY)) return;
    } catch {
      // Unreadable storage is treated as "not dismissed".
    }
    const id = window.setTimeout(() => setOpen(true), APPEAR_DELAY);
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
      className={`fixed inset-0 z-[70] flex items-end justify-center p-4 transition-opacity duration-[420ms] ease-soft sm:items-center ${
        closing ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      {/* The backdrop is the outside-click target. It's a button so the
          pointer behaviour and the hit area are one thing, and it's hidden
          from screen readers because the X below says the same thing
          properly. */}
      <button
        type="button"
        aria-hidden="true"
        tabIndex={-1}
        onClick={close}
        className="popup-fade absolute inset-0 cursor-default bg-forest/55 backdrop-blur-[3px]"
      />

      <div
        role="dialog"
        aria-modal="false"
        aria-labelledby="sale-popup-title"
        className="popup-rise relative w-full max-w-[25rem] overflow-hidden rounded-[1.75rem] bg-forest text-shell shadow-[0_30px_80px_-24px_rgba(26,22,19,0.5)]"
      >
        <div className="relative aspect-[16/9] w-full">
          <Image
            src={PHOTOS.productArray}
            alt="A batch of MiMi Crack jars, one open with a spatula resting in it"
            fill
            sizes="(min-width: 640px) 25rem, 100vw"
            className="object-cover"
            style={{ objectPosition: "50% 45%" }}
          />
          {/* Grounds the photo into the card so the type below it doesn't
              sit on a hard seam. */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-forest via-forest/25 to-transparent"
          />
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="icon-btn absolute right-3 top-3 bg-forest/50 text-shell backdrop-blur hover:bg-forest/80 hover:text-shell"
          >
            <span aria-hidden="true" className="text-[1.05rem] leading-none">
              ✕
            </span>
          </button>
        </div>

        <div className="px-7 pb-8 pt-1">
          <p className="eyebrow text-pistachio">
            {SALE_NAME}
            <span aria-hidden="true" className="px-2.5 text-shell/25">
              ·
            </span>
            <span className="text-shell/45">One week only</span>
          </p>

          <p id="sale-popup-title" className="display display-lg mt-4">
            {SALE_DEAL_LINE}
          </p>
          <p className="font-script mt-1.5 text-[1.9rem] leading-tight text-pistachio">
            Stock the shelf.
          </p>

          <p className="mt-3.5 text-[0.95rem] leading-relaxed text-shell/60">
            {SALE_SINGLE_LINE}
            <span aria-hidden="true" className="px-2 text-shell/25">
              ·
            </span>
            {SALE_TIER_NOTE}
          </p>

          <SaleCountdown className="mt-6" />

          <Link href="/product" onClick={close} className="pill pill-invert mt-7 w-full">
            Shop the jar
            <span aria-hidden="true">→</span>
          </Link>

          <p className="mt-5 text-center text-xs text-shell/40">Ends {SALE_END_LABEL}</p>
        </div>
      </div>
    </div>
  );
}
