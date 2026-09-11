/**
 * The brand guide's source data.
 *
 * Deliberately holds token *names* and usage notes, never hex values — the
 * /style page reads the real values off the live stylesheet at runtime. That
 * way the guide can't drift from `globals.css`: change a colour there and the
 * guide reports the change on next load.
 */

export type ColorToken = {
  /** CSS custom property, without the leading `--`. */
  variable: string;
  name: string;
  usage: string;
  /** Text colour to use when this is a background. */
  on?: "ink" | "shell";
};

export const COLOR_GROUPS: { title: string; note: string; tokens: ColorToken[] }[] = [
  {
    title: "Grounds",
    note: "Backgrounds. The page is warm off-white by default; the other two mark a change of section, never a change of importance.",
    tokens: [
      { variable: "color-shell", name: "Shell", usage: "The page. Default background everywhere." },
      { variable: "color-shell-warm", name: "Shell Warm", usage: "Alternating sections and cards, to break a long page." },
      { variable: "color-paper", name: "Paper", usage: "Input fields and raised surfaces. Use sparingly — it reads colder than the shell." },
    ],
  },
  {
    title: "Ink",
    note: "Text. Three weights of emphasis and nothing else — if something needs more attention, make it larger, don't make it blacker.",
    tokens: [
      { variable: "color-ink", name: "Ink", usage: "Headlines, solid buttons, anything primary.", on: "shell" },
      { variable: "color-ink-soft", name: "Ink Soft", usage: "Body copy. The default for paragraphs.", on: "shell" },
      { variable: "color-ink-mute", name: "Ink Mute", usage: "Eyebrows, captions, meta, placeholders.", on: "shell" },
      { variable: "color-hairline", name: "Hairline", usage: "Dividers and borders. Ink at 8% — never a solid rule." },
    ],
  },
  {
    title: "Green",
    note: "Taken from the grease itself, not chosen from a palette. It is the only accent — resist adding a second.",
    tokens: [
      { variable: "color-pistachio", name: "Pistachio", usage: "Accent blocks and highlights." },
      { variable: "color-pistachio-soft", name: "Pistachio Soft", usage: "Tint panels, selected states, photography slots." },
      { variable: "color-pistachio-deep", name: "Pistachio Deep", usage: "Accent text, numerals, the script line.", on: "shell" },
      { variable: "color-forest", name: "Forest", usage: "Footer, dark blocks, focus rings.", on: "shell" },
    ],
  },
  {
    title: "Clay",
    note: "Warmth without introducing another colour. Use where green would feel clinical.",
    tokens: [
      { variable: "color-clay", name: "Clay", usage: "Warm tint, error and notice panels." },
      { variable: "color-clay-soft", name: "Clay Soft", usage: "Quiet tint panels and photography slots." },
    ],
  },
];

export const TYPEFACES = [
  {
    name: "Fraunces",
    role: "Display",
    detail: "Weight 600. Tracking −0.028em, leading 0.98. Everything from the wordmark down to sub-headings.",
    source: "Google Fonts — free, open licence",
    sample: "Feed the soil.",
    className: "display",
  },
  {
    name: "Inter",
    role: "Body & UI",
    detail: "Regular. Line height 1.65–1.72. Every paragraph, label, form field and button.",
    source: "Google Fonts — free, open licence",
    sample: "A scalp-first conditioning grease, made in small batches.",
    className: "",
  },
  {
    name: "Parisienne",
    role: "Script accent",
    detail: "Reserved for the line from the jar. Two or three uses per page, never for anything you expect to be read quickly.",
    source: "Google Fonts — free, open licence",
    sample: "Stimulates Scalp",
    className: "font-script",
  },
] as const;

export const TYPE_SCALE = [
  { className: "display display-hero", label: "Hero", note: "Fitted to the container width by <FitText>, not this class alone.", sample: "Feed the soil." },
  { className: "display display-xl", label: "Section", note: "Section openers.", sample: "Seventeen oils and two butters." },
  { className: "display display-lg", label: "Sub-section", note: "Sub-heads and card titles.", sample: "Where it's going" },
  { className: "display display-md", label: "Card title", note: "Small headings inside cards and lists.", sample: "Feeds the scalp" },
  { className: "prose-airy", label: "Body", note: "Default paragraph. Never set body copy in the display face.", sample: "Grease your parts, seal your ends, and let the scalp do what it already knows how to do." },
  { className: "eyebrow", label: "Eyebrow", note: "Section labels. Uppercase, 0.22em tracking.", sample: "Why it works" },
] as const;

export const MOTION = [
  { name: "Soft easing", value: "cubic-bezier(0.16, 1, 0.3, 1)", note: "The only easing curve. Fast out, long settle." },
  { name: "Reveal", value: "900ms", note: "Scroll-triggered rise. Stagger siblings by 70–140ms." },
  { name: "Line wipe", value: "1100ms", note: "Masked headline reveal." },
  { name: "Hover", value: "420–500ms", note: "Buttons, links, cards. Slow enough to feel considered." },
] as const;

export const LAYOUT = [
  { name: "Page gutter", value: "clamp(1.25rem, 5vw, 5rem)", note: "`.shell-x`. Every full-width section uses it." },
  { name: "Section rhythm", value: "clamp(5rem, 13vh, 10.5rem)", note: "`.section-y`. Vertical breathing room between sections." },
  { name: "Card radius", value: "1.5rem", note: "Bento cells, panels, tint blocks." },
  { name: "Large radius", value: "1.75rem", note: "Photography, feature panels." },
  { name: "Buttons", value: "Full round", note: "Pills only. No square buttons anywhere." },
] as const;

export const VOICE = {
  principles: [
    "Plain and specific. \"Two to four months\" beats \"long-lasting\".",
    "Never oversell. It is a cosmetic grease, not a treatment — no growth or medical claims, ever.",
    "Warm, not cute. Talk like a person who knows hair, not a brand doing a voice.",
    "Short sentences carry the weight. Let the space do the rest.",
  ],
  pairs: [
    { bad: "Revolutionary breakthrough formula!", good: "Seventeen oils and two butters." },
    { bad: "Guaranteed to regrow your edges", good: "Feeds the scalp so ends stay conditioned." },
    { bad: "Luxurious self-care experience", good: "Four steps, twice a week." },
  ],
} as const;
