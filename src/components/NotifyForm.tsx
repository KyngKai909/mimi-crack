"use client";

import { useState } from "react";

type State = "idle" | "sending" | "done" | "error";

/**
 * Launch-notification capture, posted to Formspree over fetch so the visitor
 * stays on the page instead of being bounced to a thank-you screen.
 *
 * Set NEXT_PUBLIC_FORMSPREE_ID to the form id from your Formspree dashboard.
 * Until it's set the field renders but explains that it isn't connected, which
 * is friendlier than a button that silently fails.
 */
export function NotifyForm() {
  const formId = process.env.NEXT_PUBLIC_FORMSPREE_ID;
  const [email, setEmail] = useState("");
  const [state, setState] = useState<State>("idle");
  const [message, setMessage] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!formId) {
      setState("error");
      setMessage("The list isn't connected yet — check back shortly.");
      return;
    }
    setState("sending");
    setMessage(null);
    try {
      const res = await fetch(`https://formspree.io/f/${formId}`, {
        method: "POST",
        headers: { "content-type": "application/json", accept: "application/json" },
        body: JSON.stringify({ email, _subject: "MiMi Crack — launch list signup" }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.errors?.[0]?.message ?? "That didn't go through.");
      }
      setState("done");
      setEmail("");
    } catch (err) {
      setState("error");
      setMessage(err instanceof Error ? err.message : "That didn't go through.");
    }
  }

  if (state === "done") {
    return (
      <p className="prose-airy text-center" role="status">
        You&rsquo;re on the list. We&rsquo;ll email you the moment the jar goes live —
        and you&rsquo;ll get first go at launch pricing.
      </p>
    );
  }

  return (
    <form onSubmit={submit} className="mx-auto w-full max-w-lg">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <label htmlFor="notify-email" className="sr-only">
          Email address
        </label>
        <input
          id="notify-email"
          type="email"
          required
          autoComplete="email"
          inputMode="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="min-h-[clamp(2.85rem,6vh,3.25rem)] flex-1 rounded-full border border-hairline bg-paper px-6 text-[0.95rem] text-ink outline-none transition-colors duration-300 placeholder:text-ink-mute/70 focus:border-forest"
        />
        <button
          type="submit"
          disabled={state === "sending"}
          className="pill pill-solid min-h-[clamp(2.85rem,6vh,3.25rem)] whitespace-nowrap py-0 disabled:opacity-50"
        >
          {state === "sending" ? "Adding you…" : "Notify me"}
        </button>
      </div>

      <p
        className={`mt-[clamp(0.5rem,1.4vh,0.85rem)] text-center text-[0.8rem] sm:text-sm ${state === "error" ? "text-ink" : "text-ink-mute"}`}
        role={state === "error" ? "alert" : undefined}
      >
        {message ?? "Launch news, early access and the occasional discount. No spam, leave whenever."}
      </p>
    </form>
  );
}
