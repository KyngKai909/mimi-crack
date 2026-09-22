/**
 * Every photograph on the site, imported rather than linked.
 *
 * A file under public/ keeps the same URL for its whole life, so replacing the
 * picture behind one leaves browsers, the CDN and Next's image optimiser all
 * holding the old bytes with no reason to ask for more. That is why a changed
 * photo kept showing up as the previous one.
 *
 * Imported through the build instead, each file gets a URL with a hash of its
 * own contents. Change the picture and the address changes with it, so nothing
 * anywhere can serve a stale copy, and unchanged files stay cached forever.
 */
import aboutFounder from "@/photos/about-founder.webp";
import cartPackshot from "@/photos/cart-packshot.webp";
import claimBreakage from "@/photos/claim-breakage.webp";
import claimMoisture from "@/photos/claim-moisture.webp";
import claimScalp from "@/photos/claim-scalp.webp";
import formulaIngredients from "@/photos/formula-ingredients.webp";
import heroJars from "@/photos/hero-jars.webp";
import productArray from "@/photos/product-array.webp";
import productInUse from "@/photos/product-inuse.webp";
import productPackshot from "@/photos/product-packshot.webp";
import productScoop from "@/photos/product-scoop.webp";
import stepApply from "@/photos/step-apply.webp";
import stepLengths from "@/photos/step-lengths.webp";
import stepMassage from "@/photos/step-massage.webp";
import stepStyle from "@/photos/step-style.webp";
import textureMacro from "@/photos/texture-macro.webp";

export const PHOTOS = {
  aboutFounder,
  cartPackshot,
  claimBreakage,
  claimMoisture,
  claimScalp,
  formulaIngredients,
  heroJars,
  productArray,
  productInUse,
  productPackshot,
  productScoop,
  stepApply,
  stepLengths,
  stepMassage,
  stepStyle,
  textureMacro,
} as const;

export type PhotoKey = keyof typeof PHOTOS;
