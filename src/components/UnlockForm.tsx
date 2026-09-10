"use client";

import { useRef, useState } from "react";

type State = "idle" | "sending" | "error";

/**
 * Password entry for the pre-launch site.
 *
 * Collapsed to a single word alongside the copyright by default — the teaser is the page, and a
 * password box competing with the launch list would say the wrong thing about
 * which one visitors are meant to use.
 *
 * On success we do a full navigation rather than a router push: the gate lives
 * in middleware, and only a fresh request will be re-evaluated against the
 * cookie the API just set.
 */
export function UnlockForm() {
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [state, setState] = useState<State>("idle");
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function reveal() {
    setOpen(true);
    // The field is being mounted this tick; focus after it exists.
    requestAnimationFrame(() => inputRef.current?.focus());
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("sending");
    setError(null);
    try {
      const res = await fetch("/api/unlock", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.ok) {
        throw new Error(data?.error ?? "That didn't go through.");
      }
      window.location.assign("/");
    } catch (err) {
      setState("error");
      setError(err instanceof Error ? err.message : "That didn't go through.");
      inputRef.current?.select();
    }
  }

  if (!open) {
    // Deliberately not .eyebrow: that class sets a colour in the same layer
    // as the hover utility, so source order rather than intent would decide.
    return (
      <button
        type="button"
        onClick={reveal}
        className="link-draw pointer-events-auto text-[0.6rem] uppercase tracking-[0.22em] text-ink-mute transition-colors hover:text-ink"
      >
        Enter site
      </button>
    );
  }

  return (
    <form onSubmit={submit} className="pointer-events-auto w-full max-w-xs">
      <div className="flex items-center gap-2">
        <label htmlFor="site-password" className="sr-only">
          Site password
        </label>
        <input
          ref={inputRef}
          id="site-password"
          type="password"
          required
          autoComplete="current-password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (state === "error") setState("idle");
          }}
          placeholder="Password"
          className="min-h-[2.6rem] flex-1 rounded-full border border-hairline bg-paper px-5 text-[0.9rem] text-ink outline-none transition-colors duration-300 placeholder:text-ink-mute/70 focus:border-forest"
        />
        <button
          type="submit"
          disabled={state === "sending"}
          className="pill pill-sm pill-quiet min-h-[2.6rem] whitespace-nowrap py-0 disabled:opacity-50"
        >
          {state === "sending" ? "…" : "Enter"}
        </button>
      </div>
      {error ? (
        <p className="mt-2 text-center text-[0.78rem] text-ink" role="alert">
          {error}
        </p>
      ) : null}
    </form>
  );
}
