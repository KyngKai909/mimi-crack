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

/**
 * How many daily countdown banners exist under public/og.
 *
 * scripts/brand-assets.html draws soon-0.png through soon-<days remaining>,
 * never more than this many. Beyond it the teaser falls back to the plain
 * soon.png, which names the date instead of counting down.
 */
export const MAX_COUNTDOWN_DAYS = 45;

/**
 * Whole days until launch, counted in calendar days on Pacific time rather
 * than in 24-hour blocks: 0 is launch day, 1 is the day before. That's how
 * people say it — "opens tomorrow" at 6pm the night before, not "in 0 days".
 */
export function daysUntilLaunch(now: number = Date.now()): number {
  const day = (date: Date) =>
    new Intl.DateTimeFormat("en-CA", {
      timeZone: "America/Los_Angeles",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(date);

  const [launch, today] = [day(LAUNCH_AT), day(new Date(now))].map((d) =>
    Date.parse(`${d}T00:00:00Z`),
  );
  if (!Number.isFinite(launch) || !Number.isFinite(today)) return 0;
  return Math.max(0, Math.round((launch - today) / 86_400_000));
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
