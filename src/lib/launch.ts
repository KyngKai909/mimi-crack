/**
 * Launch timing and the pre-launch gate.
 *
 * NOTE ON THE TIME ZONE: the brief said "2:00pm September 22nd, 2026 PST".
 * California is on PDT (UTC−7) in September, not PST (UTC−8) — PST resumes in
 * November. This is set to 2pm Pacific *daylight* time, which is what "2pm on
 * the 22nd" means to anyone in California on that date. If UTC−8 was meant
 * literally, change the offset below to -08:00.
 */
export const LAUNCH_ISO =
  process.env.NEXT_PUBLIC_LAUNCH_AT ?? "2026-09-22T14:00:00-07:00";

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

/** Human-readable launch moment, for the page and the confirmation copy. */
export const LAUNCH_LABEL = new Intl.DateTimeFormat("en-US", {
  weekday: "long",
  month: "long",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
  timeZone: "America/Los_Angeles",
  timeZoneName: "short",
}).format(LAUNCH_AT);
