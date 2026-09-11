/**
 * Single source of truth for the one product this store sells.
 *
 * Prices are stored in cents so nothing ever touches a float. Anything the
 * shop owner is likely to change lives here rather than being sprinkled
 * through the components.
 */

export const PRODUCT = {
  id: "mimi-crack-hair-fertilizer-9-5oz",
  name: "MiMi Crack — Hair Fertilizer",
  shortName: "Hair Fertilizer",
  tagline: "Revitalizing & Nourishing Hair Grease",
  subtitle: "Stimulating & Strength Formula",
  scriptLine: "Stimulates Scalp",
  badge: "Premium Grease",

  /** Retail price, in cents. */
  priceCents: 2499,
  currency: "usd",

  size: {
    label: "9.5 oz | 269g",
    ounces: 9.5,
    grams: 269,
  },

  /**
   * Shipping parcel — the jar packed in its mailer box.
   * Adjust once you've weighed a real packed order on a scale; Shippo rate
   * accuracy depends entirely on these numbers being honest.
   */
  parcel: {
    lengthIn: 5,
    widthIn: 5,
    heightIn: 4,
    weightLb: 1.2,
  },

  /**
   * The eleven worth naming on the page — Carmel's own shortlist, in her
   * order. Mango butter leads because it's the one that defines the grease;
   * everything after it is a supporting botanical.
   *
   * These are short common names for display. The legal declaration is
   * `ingredients` below, and that's the one that has to be complete.
   */
  highlights: [
    "Pure Mango Butter",
    "Jojoba",
    "Rosemary",
    "Coconut",
    "Olive",
    "Moringa",
    "Pomegranate",
    "Peppermint",
    "Honey",
    "Sage",
    "Eucalyptus",
  ],

  /**
   * The full declaration, in the order printed on the jar, each tagged with
   * the group it belongs to.
   *
   * One list, not two. The page shows these grouped, because thirty-nine
   * names in a paragraph is not something anyone reads — but the order is the
   * label order, and the page still prints the declaration in that order
   * underneath. Grouping is a reading aid; the sequence is the legal artefact,
   * so don't sort this array and don't prune it to the pretty ones.
   */
  ingredients: [
    { name: "Mango Butter", group: "base" },
    { name: "Petrolatum", group: "base" },
    { name: "Cetyl Alcohol", group: "finish" },
    { name: "Arrowroot Powder", group: "finish" },
    { name: "Lanolin", group: "base" },
    { name: "Olive Oil", group: "carrier" },
    { name: "Lecithin", group: "finish" },
    { name: "Coconut Oil", group: "carrier" },
    { name: "Rice Bran Oil", group: "carrier" },
    { name: "Cocoa Butter", group: "base" },
    { name: "Sunflower Oil", group: "carrier" },
    { name: "Methyl Soyate", group: "finish" },
    { name: "Jojoba Oil", group: "carrier" },
    { name: "Safflower Oil", group: "carrier" },
    { name: "Moringa Oil", group: "carrier" },
    { name: "Canola Oil", group: "carrier" },
    { name: "Pomegranate", group: "extract" },
    { name: "Rosehip", group: "extract" },
    { name: "Pumpkin Seed Oil", group: "carrier" },
    { name: "Acerola", group: "extract" },
    { name: "Rosemary Extract", group: "extract" },
    { name: "Carrot Extract", group: "extract" },
    { name: "Honey Extract", group: "extract" },
    { name: "Mushroom Extract", group: "extract" },
    { name: "Chickpea Extract", group: "extract" },
    { name: "Lentil Extract", group: "extract" },
    { name: "Cocoa Extract", group: "extract" },
    { name: "Sesame Seed Oil", group: "carrier" },
    { name: "Herbal Extracts", group: "extract" },
    { name: "Peppermint Oil", group: "essential" },
    { name: "Sage Oil", group: "essential" },
    { name: "Eucalyptus Oil", group: "essential" },
    { name: "Frankincense Oil", group: "essential" },
    { name: "Geranium Oil", group: "essential" },
    { name: "Grapefruit Oil", group: "essential" },
    { name: "Lavender Oil", group: "essential" },
    { name: "Menthol", group: "finish" },
    { name: "Isopropyl Myristate", group: "finish" },
    { name: "Fragrance (Parfum)", group: "finish" },
  ],

  benefits: [
    {
      title: "Feeds the scalp",
      body: "Jojoba, olive and rosemary go on where it counts — the scalp — to soften flaking and soothe tightness between washes. Peppermint and menthol are why it tingles.",
    },
    {
      title: "Seals in moisture",
      body: "Mango and cocoa butter form a breathable seal over the strand, so the water your hair drank on wash day is still there on day five.",
    },
    {
      title: "Guards against breakage",
      body: "Slip where you need it. Ends stay conditioned and pliable, so combs glide instead of snagging and lengths hold on to what they've grown.",
    },
    {
      title: "Built for protective styles",
      body: "Thick enough to grease a part, light enough not to build up. Works under braids, twists, locs and press without leaving a waxy film.",
    },
  ],

  /**
   * The four steps, written against Carmel's own directions rather than
   * around them. Hers read: apply a small amount to scalp and hair, massage
   * gently and style as desired, best on damp to seal in moisture or on a dry
   * scalp as needed, use daily.
   *
   * Two of those changed what was here. It says "a small amount", not
   * "pea-sized" — that was her specific correction. And it's daily, which is
   * the frequency the rest of the site now quotes as well.
   */
  howToUse: [
    {
      step: "Part & apply",
      body: "Section the hair into rows and lay a small amount along each part with a fingertip. Damp is best — it seals the water in — but a dry scalp works whenever it needs it.",
    },
    {
      step: "Massage in",
      body: "Work it into the scalp gently, with the pads of your fingers, for a minute or two. Small circles, light pressure — this is the part that matters.",
    },
    {
      step: "Smooth the lengths",
      body: "Emulsify what's left between your palms and run it down the strand, paying extra attention to ends and edges.",
    },
    {
      step: "Style & repeat",
      body: "Style as you like, then do it again tomorrow. Daily is the point — a scalp answers to consistency, not intensity.",
    },
  ],

  /** Carmel's own sign-off on the directions, in her words. */
  directionsClose: "Stay consistent. Stay committed. Commitment is the key.",

  faqs: [
    {
      q: "What does \"Hair Fertilizer\" actually mean?",
      a: "It's the spirit of the thing — you feed soil to grow a garden, you feed the scalp to grow hair. MiMi Crack is a scalp-first conditioning grease: it moisturizes, soothes and protects the environment your hair grows out of. It is a cosmetic product, not a drug, and it isn't a treatment for hair loss.",
    },
    {
      q: "Will it weigh my hair down?",
      a: "Used as directed — pea-sized, scalp-first — no. It's a grease, so a heavy hand will feel heavy. Start with less than you think you need.",
    },
    {
      q: "Is it safe for color-treated or relaxed hair?",
      a: "Yes. It's a leave-in conditioning grease with no sulfates, peroxide or ammonia, so it won't lift or strip color.",
    },
    {
      q: "Can I use it on my kids' hair?",
      a: "It's commonly used on children's hair for greasing parts and braids. As with any new product, patch test first and keep it out of eyes.",
    },
    {
      q: "Anything in it I should know about?",
      a: "Two things people ask about: it contains lanolin, and it's fragranced, with peppermint and menthol that give the scalp a cool tingle. The full ingredient list is on this page, grouped — read it first if you have a known allergy.",
    },
    {
      q: "Is it alright to use every day?",
      a: "That's how it's meant to be used — a small amount on the scalp daily, and down the lengths when they want it. A scalp answers to consistency rather than to intensity, so little and often beats a heavy hand on a Sunday.",
    },
    {
      q: "How fast does it ship?",
      a: "Orders are packed and handed to the carrier within 1–2 business days. You'll get a tracking number by email the moment the label is created.",
    },
  ],

  /**
   * Handling, as five things rather than one paragraph.
   *
   * `label` is what the product page shows in a pill; `full` is the sentence
   * that belongs in a block of small print. Both live here so they can't say
   * different things — CAUTIONS below joins the sentences for the footer.
   */
  handling: [
    { icon: "hand", label: "External use only", full: "For external use only." },
    { icon: "eye", label: "Avoid eyes", full: "Avoid contact with eyes." },
    {
      icon: "alert",
      label: "Stop if irritated",
      full: "Discontinue use if irritation occurs.",
    },
    {
      icon: "child",
      label: "Keep from kids",
      full: "Keep out of reach of children.",
    },
    {
      icon: "heat",
      label: "Store below 80°F",
      full: "Store below 80°F — the grease will soften in heat and re-set as it cools, which does not affect performance.",
    },
  ],

} as const;

/**
 * The groups the declaration is read in: what the grease is built on, what
 * carries it, what it's scented and cooled with, what's infused into it, and
 * what sets the texture.
 *
 * `shown` is Carmel's call, not a design one. She doesn't want the formula
 * laid out clearly enough to be copied at home, so the extracts and the
 * texture agents aren't broken out into tidy labelled lists. Every one of them
 * is still on the page: the declaration below the groups prints the whole jar,
 * in order, because that part is a labeling obligation and not ours to edit.
 */
export const INGREDIENT_GROUPS = [
  { key: "base", label: "Butters & base", shown: true },
  { key: "carrier", label: "Carrier oils", shown: true },
  { key: "essential", label: "Essential oils", shown: true },
  { key: "extract", label: "Botanical extracts", shown: false },
  { key: "finish", label: "Texture & finish", shown: false },
] as const;

export type IngredientGroup = (typeof INGREDIENT_GROUPS)[number]["key"];

/**
 * The groups that get their own list on the page. Jar order is kept within
 * each. Groups marked `shown: false` are left out here and appear only inside
 * the full declaration.
 */
export const GROUPED_INGREDIENTS = INGREDIENT_GROUPS.filter((g) => g.shown)
  .map((group) => ({
    ...group,
    items: PRODUCT.ingredients
      .filter((i) => i.group === group.key)
      .map((i) => i.name),
  }))
  .filter((group) => group.items.length > 0);

/** The handling sentences, for places that want small print rather than pills. */
export const CAUTIONS = PRODUCT.handling.map((h) => h.full).join(" ");

/**
 * What the broken-out groups actually name, and how many of those are oils.
 *
 * Counted off the shown groups rather than off the whole declaration: the
 * header sits above the groups, so it has to describe them. Quoting the full
 * thirty-nine there would claim a breakdown the page deliberately doesn't give.
 */
const NAMED_INGREDIENTS = GROUPED_INGREDIENTS.flatMap((group) => group.items);

export const NAMED_INGREDIENT_COUNT = NAMED_INGREDIENTS.length;

export const NAMED_OIL_COUNT = NAMED_INGREDIENTS.filter((name) =>
  name.endsWith(" Oil"),
).length;

/** The declaration as one string, in the order printed on the jar. */
export const INGREDIENT_DECLARATION = PRODUCT.ingredients
  .map((i) => i.name)
  .join(", ");

/**
 * How many of the ingredients are botanical oils.
 *
 * Derived rather than written down: the home page makes this claim in a
 * headline, and a hand-typed number would quietly go wrong the next time the
 * formula changes.
 */
export const BOTANICAL_OIL_COUNT = PRODUCT.ingredients.filter((i) =>
  i.name.endsWith(" Oil"),
).length;

/** Max jars per order — keeps the flat parcel maths honest. */
export const MAX_QUANTITY = 12;

export function formatPrice(cents: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(cents / 100);
}
