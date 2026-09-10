# MiMi Crack

Single-product storefront for **MiMi Crack — Hair Fertilizer**, a 9.5 oz
scalp-first conditioning grease.

Next.js 15 (App Router) · Tailwind v4 · Stripe Checkout · Shippo live rates.

---

## Pages

| Route      | What it does |
|------------|--------------|
| `/`        | Landing — fitted hero, pinned product scene, formula bento, the commitment, FAQ |
| `/about`   | Carmel, the three pillars, and what commitment means for the shop |
| `/style`   | Brand guide — wordmark, colour, type, layout, motion, voice. `noindex` |
| `/soon`    | Pre-launch teaser — wordmark, countdown, Formspree launch list |
| `/product` | Product detail — gallery, price, add to cart, directions, FAQ |
| `/cart`    | Checkout — bag, shipping address, live carrier rates, hand-off to Stripe |
| `/success` | Post-payment confirmation; clears the cart |

API routes:

| Route                    | What it does |
|--------------------------|--------------|
| `POST /api/shipping/rates` | Quotes live rates from Shippo for a destination + quantity |
| `POST /api/checkout`       | Creates a Stripe Checkout Session and returns its URL |
| `POST /api/webhooks/stripe`| Fulfilment: verifies the signature, logs the order, optionally buys the label |

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill it in
npm run dev
```

Every key in `.env.example` is documented inline. The site renders fine with no
keys at all — it's only the rate quote and the checkout hand-off that need
them, and both fail with a readable message rather than a stack trace.

### Stripe webhooks locally

```bash
stripe listen --forward-to localhost:3310/api/webhooks/stripe
```

Paste the `whsec_...` it prints into `STRIPE_WEBHOOK_SECRET`.

## How checkout fits together

Stripe Checkout can't call out for live shipping rates mid-flow, so the order
of operations is inverted: the cart page collects the destination address,
quotes Shippo directly, and lets the customer pick a rate **before** payment.
The chosen rate goes into the Checkout Session as its single shipping option,
and its Shippo rate id rides along in session metadata so fulfilment can buy
exactly the label that was quoted.

Prices are never taken from the browser. `/api/checkout` builds the line item
from `src/lib/product.ts` server-side, so a tampered request can't discount
anything.

### Buying labels

`POST /api/webhooks/stripe` will buy the Shippo label automatically, but only
when `SHIPPO_AUTO_BUY_LABEL=true`. It ships off by default because label
purchase debits the Shippo account for real money — leave it off until you've
watched a few orders come through, then flip it.

## Editing the product

Nearly everything a shop owner would want to change lives in
[`src/lib/product.ts`](src/lib/product.ts): price, size, copy, benefits,
directions, FAQ, cautions, and the parcel dimensions used for rate quotes.

Brand voice — Carmel's tagline, the three pillars and her social handles —
lives in [`src/lib/brand.ts`](src/lib/brand.ts). Its `founderStatement` is
deliberately empty: the About page renders a visible prompt asking for her
words rather than inventing a founder story. Fill it in and the prompt is
replaced by the quote.

**Before launch:** the ingredient list in `product.ts` was transcribed from the
product photography and is incomplete. Replace it with the full declaration
from the physical jar and set `ingredientsAreComplete: true` — until you do,
the product page renders a visible note saying so.

## Art direction — the shot list

The site ships before the photography exists. Every image is a `<Shot/>`
placeholder: a quiet tinted panel captioned with the shot that belongs there.
Swapping one in is a one-line change — replace `<Shot/>` with
`<Image fill className="object-cover"/>` inside the same wrapper.

| Where | Shot |
|-------|------|
| Home hero | Jar three-quarter, soft daylight, warm surface |
| Home / benefits | Jar in hand, soft daylight |
| Home / formula | Texture — grease surface, macro, raking light |
| Home / commitment ×4 | One per step, 16:9 |
| Product gallery | Packshot upright · open jar top-down · open jar with lid · in use |
| Checkout | Small packshot |
| About | Portrait — Carmel, natural light |

Older photography shot on green felt lives in git history on the
`feat/brutalist-redesign` branch, along with `scripts/process-photos.mjs`
(a chromaticity-based background key) if it's ever wanted again.

## The pre-launch gate

`src/middleware.ts` rewrites every route to `/soon` until `NEXT_PUBLIC_LAUNCH_AT`
passes, then lifts on its own — no deploy needed at launch. It's a rewrite, not
a redirect, so links people were sent still land correctly the moment the shop
opens.

The teaser carries the way through the gate: **Enter site**, on the copyright
line, opens a password field. The password is `commitment123` unless
`SITE_PASSWORD` is set. Correct entries get an httpOnly cookie good for 30
days, handed out by `src/app/api/unlock/route.ts` — the password itself never
touches anything a script on the page can read.

The same password works as a link: `?preview=<password>` on any URL sets the
same cookie, which is the easier thing to text someone.

`SITE_PASSWORD` is read inside middleware, which Next compiles for the edge
with `process.env` inlined at build time. **Changing it in Vercel needs a
redeploy** — it is not picked up live.

Two gotchas worth keeping:

- Middleware **must** live at `src/middleware.ts` in a `src/` project. At the
  repo root it is silently never invoked, and the gate simply doesn't apply.
- The teaser wordmark is fitted at its *heaviest* weight. `wght` changes glyph
  widths, so a line fitted at rest overflows its container the moment a letter
  thickens under the pointer.

## Icons and link previews

The favicon is the uppercase **M** from the wordmark — Fraunces, weight 700,
on the same cream the site is built on. Every size is drawn at its own size
rather than scaled down from one large one, so Fraunces' optical-size axis
gives the 16px version sturdier stems instead of hairlines that disappear in a
browser tab.

| File | What it is |
|---|---|
| `src/app/favicon.ico` | 16 / 32 / 48, for `/favicon.ico` |
| `src/app/icon.png` | 512, for high-DPI and install prompts |
| `src/app/apple-icon.png` | 180, iOS home screen |
| `public/og/*.png` | 1200x630 share banners |

Four banners: `default` (the site, home, and anything without its own),
`product`, `about` and `soon` for the teaser. `src/lib/seo.ts` attaches them. It builds both the Open Graph and Twitter tag
sets in one call because **Next merges metadata shallowly** — a page that
declares `openGraph` replaces the layout's whole object, so anything it
doesn't restate is silently lost.

They're static files rather than generated per request, which also means a
crawler can fetch them while the shop is behind the pre-launch gate: the
middleware skips anything with a file extension.

### The countdown card

Before launch the teaser shares a dated banner — "Opens in 12 days", "Opens
tomorrow", "Opens today at 5:00 PM PDT" — so the card in a text message counts
down with the page. `soon-<days>.png` is drawn for every day between generation
and launch; `teaserBanner()` in `src/lib/seo.ts` picks today's, falls back to
the undated `soon.png` past `MAX_COUNTDOWN_DAYS`, and switches to `default`
once the shop opens.

Two things this depends on:

- The teaser and the brand guide use `generateMetadata` with `revalidate =
  3600`, not an exported constant. A constant is evaluated once when the module
  first loads, so the count would freeze there and never move.
- **Messaging apps cache link previews.** The count is only as fresh as the
  last time the app fetched the page — changing the image URL daily is what
  lets a re-fetch pick up the new number instead of reusing the cached picture,
  but nothing can force an app that isn't asking again. Treat it as a nice
  touch, not a live clock.

The brand guide's **Assets** section shows the icon sizes and the current set
of cards, so it stays accurate as they're regenerated.

### Regenerating them

```
node scripts/brand-assets.mjs      # then open http://localhost:4321
```

Press **Generate & save**. The drawing happens in a browser
(`scripts/brand-assets.html`) rather than in Node because Fraunces is a
variable font, and only a real text engine applies its weight and optical-size
axes correctly — Node-side SVG rasterisers either ignore the axes or want a
static instance of the font this project doesn't carry. The server writes the
files, quantises the PNGs (a banner goes from ~515 kB to ~88 kB) and assembles
the `.ico`.

To add a banner: add it to `BANNERS` in the HTML, to `ALLOWED` in the script,
then pass its name to `share()`. Rerun it if the launch date moves — the
generator reads the date straight out of `src/lib/launch.ts`, so the cards and
the countdown on the page can't disagree.

## The brand guide

`/style` is the reference for anything made outside this repo — other pages,
blog posts, flyers, social graphics.

Its colour and type values are **read off the live stylesheet at runtime**.
`src/lib/designTokens.ts` holds CSS variable names and usage notes, never hex
codes, so the guide cannot drift from `globals.css` — change a colour there and
the guide reports the new value on next load. Fluid type sizes are reported as
they compute at the reader's own viewport.

## Layout notes

Three pieces of the layout are load-bearing and easy to break:

- **`<FitText>`** scales a line to fill its container exactly. It *iterates*
  three times rather than scaling by one ratio, because Fraunces has an
  optical-size axis — glyph widths are not linear in font-size, and a
  single-ratio fit overshoots by 10-20% at phone sizes and clips the line.
- **`<CommitmentScroll>`** pins a scene and drives it sideways from scroll
  position. It falls back to an ordinary swipeable rail below `lg` and under
  `prefers-reduced-motion` — no scroll hijacking on touch.
- **`useScrollProgress`** returns a *callback* ref, not an object ref, because
  the element it measures is conditionally rendered. With an object ref the
  effect runs once at mount, finds `null`, and never attaches.

## Working on this

Never run `npm run build` while the dev server is up. They share `.next`, and
the production build replaces the dev output — the running page then 404s on
its own CSS chunk and renders as unstyled HTML. Stop the dev server, build,
then restart it.

## Deploying

Vercel, with the environment variables from `.env.example` set in project
settings.

`NEXT_PUBLIC_SITE_URL` should be **unset** for Preview and set only for
Production. Previews resolve their own origin from `VERCEL_URL`, so each one
gets correct absolute URLs. Do not set it to an empty string — see
`src/lib/siteUrl.ts` for why that used to fail the build.



Vercel is the path of least resistance. Set the same environment variables in
the project settings, point `NEXT_PUBLIC_SITE_URL` at the real domain, and add
a Stripe webhook endpoint for `https://yourdomain/api/webhooks/stripe`
subscribed to `checkout.session.completed`.

## Still to do

- Persist orders somewhere durable; right now Stripe's dashboard is the record
  of truth, which works at low volume but can't be queried.
- Sales tax — `automatic_tax` is off. Turn on Stripe Tax when you know your
  nexus.
- Confirm the parcel weight and dimensions in `src/lib/product.ts` against a
  real packed order on a scale.
