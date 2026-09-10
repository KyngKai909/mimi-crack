/**
 * The person behind the jar.
 *
 * Everything here that's quoted comes from Carmel's own public profiles —
 * the tagline and the three pillars are hers, not copy we invented. The
 * founder statement is deliberately left empty: it should be in her words,
 * and the About page renders a visible prompt until it is.
 */

export const BRAND = {
  founder: "Carmel Gaines",
  /** Her own tagline, from her TikTok profile. */
  tagline: "Commit with Carmel",
  /** Also hers, verbatim. */
  subtitle: "Walking the journey of commitment together",
  /** The three pillars she leads with. */
  pillars: [
    {
      name: "Mind",
      body: "Deciding once, so you're not renegotiating with yourself every wash day. The hardest part of any routine is the part where you talk yourself out of it.",
    },
    {
      name: "Body",
      body: "Showing up for the parts of you that don't get applause. A scalp responds to consistency, not intensity — small and regular beats heroic and occasional.",
    },
    {
      name: "Soul",
      body: "Treating care as something you're owed rather than something you earn. Twenty minutes with your hands in your hair is not vanity. It's maintenance.",
    },
  ],

  /**
   * Where the three pillars land. Alignment isn't a fourth pillar — it's what
   * you reach once the other three agree.
   */
  alignment: {
    name: "Alignment",
    body: "When the three agree, the routine stops being something you make yourself do. You stop negotiating, and start just doing it. That's the whole point of a commitment — it takes the decision off the table.",
  },

  /** Any entry without an href is dropped rather than rendered as a dead link. */
  socials: [
    { label: "TikTok", handle: "@carmelgaines", href: "https://www.tiktok.com/@carmelgaines" },
    { label: "Instagram", handle: "@just_me_carmel_g", href: "https://www.instagram.com/just_me_carmel_g/" },
    { label: "Snapchat", handle: "@justmecarmelg", href: "https://www.snapchat.com/@justmecarmelg" },
    { label: "Facebook", handle: "Dwainn Carmel Gaines", href: "https://www.facebook.com/dwainncarmel.gaines/" },
  ],

  /**
   * TODO(carmel): replace with your own words — why you made this, who you
   * made it for. Until this is filled in, the About page shows a note saying
   * it's missing rather than inventing a founder story.
   */
  founderStatement: "",
} as const;
