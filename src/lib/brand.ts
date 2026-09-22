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
      body: "Showing up for the parts of you that don't get applause. A scalp responds to consistency, not intensity. Small and regular beats heroic and occasional.",
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
    body: "When the three agree, the routine stops being something you make yourself do. You stop negotiating, and start just doing it. That's the whole point of a commitment: it takes the decision off the table.",
  },

  /** Any entry without an href is dropped rather than rendered as a dead link. */
  socials: [
    { label: "TikTok", handle: "@carmelgaines", href: "https://www.tiktok.com/@carmelgaines" },
    { label: "Instagram", handle: "@just_me_carmel_g", href: "https://www.instagram.com/just_me_carmel_g/" },
    { label: "Facebook", handle: "@dwainncarmel.gaines", href: "https://www.facebook.com/dwainncarmel.gaines/" },
    { label: "Snapchat", handle: "@justmecarmelg", href: "https://www.snapchat.com/@justmecarmelg" },
  ],

  /**
   * Carmel's own words, cut down for the page but not rewritten — her phrases,
   * her order, her sign-off. The full-length version is hers to publish
   * wherever she likes; this is the reading length.
   *
   * Spelt MiMi Crack here, as the product and the rest of the site are.
   *
   * No em dashes. They read as machine-written, and this is the one piece of
   * copy on the site that is unmistakably a person talking.
   */
  founderStatement: {
    paragraphs: [
      "MiMi Crack began with my own hair-care journey and one simple realization: everything we care for consistently has the chance to grow and flourish, including us.",
      "I mixed, perfected and poured this formula myself, for anyone ready to stop chasing quick fixes and start committing to their crown.",
      "But this is bigger than what's in the jar. Your hair is a part of you, and you deserve the same love and care you give so freely to everyone else. When you pour into yourself, you show up for others whole, not in pieces.",
      "We are not chasing perfection. We are choosing commitment. One routine, one application, one loving act of self-care at a time.",
    ],
    closing: ["Care for yourself. Stay consistent. Stay committed.", "Commitment is the Key."],
    signature: {
      salutation: "With love,",
      name: "Carmel Gaines",
      roles: ["Creator of MiMi Crack Hair Fertilizer", "Commit with Carmel: The Journey"],
    },
  },
} as const;
