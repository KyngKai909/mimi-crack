import { PRODUCT } from "@/lib/product";

/**
 * The named botanicals: the lead as a headline, the rest as things you can
 * count.
 *
 * This sits in a bento beside cards whose whole content is one enormous
 * numeral. A numbered column lost that fight, and a run of dot-separated
 * names read as a paragraph — the eye slid off it. Discrete tinted chips read
 * as a set at a glance, which is what a shortlist is.
 *
 * The lead is Pure Mango Butter because that's what defines the grease. It
 * isn't merely the first item in an array, and reordering the shortlist
 * should not quietly promote something else.
 */
export function Highlights({ size = "md" }: { size?: "md" | "lg" }) {
  const [lead, ...rest] = PRODUCT.highlights;
  const large = size === "lg";

  return (
    <>
      <p
        className={`display leading-[1.02] ${
          large
            ? "text-[clamp(2rem,4vw,3.4rem)]"
            : "text-[clamp(1.75rem,3.1vw,2.7rem)]"
        }`}
      >
        {lead}
      </p>
      <ul className={`flex flex-wrap ${large ? "mt-6 gap-2.5" : "mt-5 gap-2"}`}>
        {rest.map((name) => (
          <li
            key={name}
            className={`rounded-full bg-pistachio-soft text-forest ${
              large ? "px-4 py-2 text-[0.95rem]" : "px-3.5 py-1.5 text-[0.85rem]"
            }`}
          >
            {name}
          </li>
        ))}
      </ul>
    </>
  );
}
