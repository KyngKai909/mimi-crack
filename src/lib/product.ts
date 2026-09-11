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
   * One list, not two. The page shows these grouped, because thirty-seven
   * names in a paragraph is not something anyone reads — but the order here
   * is the label order, and the page still prints the declaration in that
   * order underneath. Grouping is a reading aid; the sequence is the legal
   * artefact, so don't sort this array and don't prune it to the pretty ones.
   */
  ingredients: [
    { name: "Pure Mango Butter", group: "base" },
    { name: "Petrolatum", group: "base" },
    { name: "Lanolin", group: "base" },
    { name: "Olive Oil", group: "carrier" },
    { name: "Lecithin", group: "finish" },
    { name: "Coconut Oil", group: "carrier" },
    { name: "Rice Bran Oil", group: "carrier" },
    { name: "Cocoa Butter", group: "base" },
    { name: "Sunflower Oil", group: "carrier" },
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
    { name: "Sage Oil", group: "essential" },
    { name: "Eucalyptus Oil", group: "essential" },
    { name: "Frankincense Oil", group: "essential" },
    { name: "Geranium Oil", group: "essential" },
    { name: "Grapefruit Oil", group: "essential" },
    { name: "Lavender Oil", group: "essential" },
    { name: "Peppermint Oil", group: "essential" },
    { name: "Herbal Extracts", group: "extract" },
    { name: "Menthol", group: "finish" },
    { name: "Cetyl Alcohol", group: "finish" },
    { name: "Arrowroot Powder", group: "finish" },
    { name: "Fragrance", group: "finish" },
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

  howToUse: [
    {
      step: "Part & apply",
      body: "Section damp or dry hair into rows. Take a pea-sized amount on a fingertip and apply directly along each part.",
    },
    {
      step: "Massage in",
      body: "Work the grease into the scalp with the pads of your fingers for a minute or two. Small circles, gentle pressure — this is the part that matters.",
    },
    {
      step: "Smooth the lengths",
      body: "Emulsify what's left between your palms and run it down the strand, paying extra attention to ends and edges.",
    },
    {
      step: "Style & repeat",
      body: "Style as usual. Use 2–3 times a week, or daily on the scalp if you're wearing a protective style.",
    },
  ],

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
      q: "How long does one jar last?",
      a: "9.5 oz is a big jar. Used a few times a week on scalp and ends, most people get two to four months out of one.",
    },
    {
      q: "How fast does it ship?",
      a: "Orders are packed and handed to the carrier within 1–2 business days. You'll get a tracking number by email the moment the label is created.",
    },
  ],

  cautions:
    "For external use only. Avoid contact with eyes. Discontinue use if irritation occurs. Keep out of reach of children. Store below 80°F — the grease will soften in heat and re-set as it cools, which does not affect performance.",
} as const;

/**
 * The groups the declaration is read in, in the order they're shown: what the
 * grease is built on, what carries it, what it's scented and cooled with,
 * what's infused into it, and what sets the texture.
 */
export const INGREDIENT_GROUPS = [
  { key: "base", label: "Butters & base" },
  { key: "carrier", label: "Carrier oils" },
  { key: "essential", label: "Essential oils" },
  { key: "extract", label: "Botanical extracts" },
  { key: "finish", label: "Texture & finish" },
] as const;

export type IngredientGroup = (typeof INGREDIENT_GROUPS)[number]["key"];

/** The declaration, split into those groups. Jar order is kept within each. */
export const GROUPED_INGREDIENTS = INGREDIENT_GROUPS.map((group) => ({
  ...group,
  items: PRODUCT.ingredients
    .filter((i) => i.group === group.key)
    .map((i) => i.name),
})).filter((group) => group.items.length > 0);

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
