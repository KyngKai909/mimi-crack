/**
 * Launch timing and the pre-launch gate.
 *
 * TIME ZONE: southern California is on PDT (UTC−7) in September — PST doesn't
 * resume until November. 5pm Pacific on the 22nd is 2026-09-23T00:00:00Z.
 */
export const LAUNCH_ISO =
  process.env.NEXT_PUBLIC_LAUNCH_AT ?? "2026-09-22T17:00:00-07:00";

export const LAUNCH_AT = new Date(LAUNCH_ISO);

export function hasLaunched(now: number = Date.now()): boolean {
  const t = LAUNCH_AT.getTime();
  return Number.isFinite(t) ? now >= t : true;
}

/** Whole days/hours/minutes/seconds remaining, floored at zero. */
export function timeUntilLaunch(now: number = Date.now()) {
  const ms = Math.max(0, LAUNCH_AT.getTime() - now);
  const total = Math.floor(ms / 1000);
  return {
    done: ms === 0,
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
  };
}

/**
 * The launch moment, in three pieces.
 *
 * The teaser shows them as one unbroken line and drops pieces on narrow
 * screens rather than wrapping — the zone first, then the weekday — so they
 * have to be separable rather than one pre-baked string.
 */
const PACIFIC = { timeZone: "America/Los_Angeles" } as const;

/** "Tuesday" */
export const LAUNCH_WEEKDAY = new Intl.DateTimeFormat("en-US", {
  weekday: "long",
  ...PACIFIC,
}).format(LAUNCH_AT);

/** "September 22 at 5:00 PM" — the part that never gets dropped. */
export const LAUNCH_DATE_TIME = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
  ...PACIFIC,
}).format(LAUNCH_AT);

/** "PDT" */
export const LAUNCH_ZONE =
  new Intl.DateTimeFormat("en-US", { timeZoneName: "short", ...PACIFIC })
    .formatToParts(LAUNCH_AT)
    .find((part) => part.type === "timeZoneName")?.value ?? "";

/** Human-readable launch moment, for metadata and confirmation copy. */
export const LAUNCH_LABEL = `${LAUNCH_WEEKDAY}, ${LAUNCH_DATE_TIME} ${LAUNCH_ZONE}`.trim();
