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
   * Carmel's statement, as she wrote it. Two house rules applied and nothing
   * else: MiMi Crack is spelt the way the product and the rest of the site
   * spell it, and her three em dashes are commas, because the site carries
   * none. Both are one-line reverts if she wants her own punctuation back.
   */
  founderStatement: {
    paragraphs: [
      "MiMi Crack began with my hair-care journey and one realization: what we consistently care for can grow and flourish, including us.",
      "I created MiMi Crack for anyone ready to stop chasing quick fixes and commit to their crown. I mixed, perfected, and poured this formula with ingredients chosen to nourish hair, care for the scalp, lock in moisture, and support stronger, healthier-looking hair.",
      "But MiMi Crack is more than what's inside the jar. Your hair is part of you, and you deserve the love and care you give to others. When you believe in yourself, pour into yourself, and consistently show up for yourself, you can show up for others whole, not broken or in pieces.",
      "MiMi Crack represents everything I believe through Commit with Carmel: we are not chasing perfection; we are choosing commitment, one routine, one application, and one loving act of self-care at a time.",
    ],
    closing: ["Care for yourself. Stay consistent. Stay committed.", "Commitment is the Key."],
    signature: {
      salutation: "With love,",
      name: "Carmel Gaines",
      roles: ["Creator of MiMi Crack Hair Fertilizer", "Commit with Carmel: The Journey"],
    },
  },
} as const;
