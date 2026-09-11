import { PRODUCT } from "@/lib/product";

/**
 * The named botanicals, set as type rather than listed.
 *
 * This sits in a bento next to cards whose whole content is one enormous
 * numeral, and a numbered column of names lost that fight badly. So it plays
 * the same game: the lead ingredient at display size, the rest flowing after
 * it with pistachio separators, ending on the count of everything else.
 *
 * The lead is Pure Mango Butter because that's what defines the grease — it
 * isn't just the first item in an array, and reordering the shortlist should
 * not quietly promote something else.
 */
export function Highlights({ size = "md" }: { size?: "md" | "lg" }) {
  const [lead, ...rest] = PRODUCT.highlights;

  return (
    <>
      <p
        className={
          size === "lg"
            ? "display text-[clamp(2rem,4vw,3.4rem)] leading-[1.02]"
            : "display text-[clamp(1.75rem,3.1vw,2.7rem)] leading-[1.02]"
        }
      >
        {lead}
      </p>
      <p
        className={`mt-4 leading-[1.5] text-ink-soft ${
          size === "lg"
            ? "text-[clamp(1.05rem,1.5vw,1.3rem)]"
            : "text-[clamp(1rem,1.2vw,1.1rem)]"
        }`}
      >
        {/* Whitespace sits outside the separator, not inside it: without a
            real break opportunity the whole run is one unbreakable word and
            overflows the card instead of wrapping. The space before the dot
            is non-breaking so the dot stays with the name it follows — a line
            may end "Coconut ·" but never begin "· Peppermint". The dot is
            decorative, so a screen reader hears the names rather than "middle
            dot" ten times. */}
        {rest.map((name, i) => (
          <span key={name}>
            {i > 0 && (
              <>
                {"\u00A0"}
                <span aria-hidden="true" className="text-pistachio-deep">
                  ·
                </span>{" "}
              </>
            )}
            {name}
          </span>
        ))}
      </p>
    </>
  );
}
