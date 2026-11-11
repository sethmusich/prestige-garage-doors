# Prestige Garage Doors — Website Design

Date: 2026-11-11

## Intent

Replace Prestige Garage Doors' current Squarespace site (prestigegaragedoorsco.com) with a custom-built marketing site that looks and is structured like **https://www.speckgaragedoors.com/**, but in Prestige's own navy-and-gold brand. Prestige is a small, locally owned garage door company in the Denver metro area, run by owner **Kevin Reynoso**.

The site has one job: get people in the Denver metro to **call** or **send a booking request**. Every page should make both easy. Speck's site works because it feels established and trustworthy: dark, premium look, real photos, reviews and badges up front, and the phone number everywhere. We want the same feel.

## Goals

- Look and flow like the Speck site (overall look + section structure — the user's words: "overall look, sections").
- Make calling `(720) 295-3221` and booking a request the obvious next step on every page.
- Show trust: 4.9★ Google rating (53 reviews), locally owned, licensed & insured, same-day repairs.
- Rank locally: separate pages per service and a service-areas page covering Castle Rock → Longmont.
- Deploy to **GitHub Pages**. Custom domain is handled later by the user.

## Non-goals

- No custom-built scheduling. Online booking is handled by Kevin's existing Housecall Pro booking page; the site just sends people there.
- No e-commerce, no customer accounts, no CMS / admin panel.
- No commercial-door services (Prestige's content is residential).
- No blog for now (Speck has one; we skip it).
- No custom domain setup in this project.

## Anti-goals (would be a failure even if it works)

- Copying Speck's actual text, photos, logo, or branding. We copy the **style and structure only**.
- Inventing claims, reviews, numbers, or testimonials that aren't Kevin's. Anything unknown is a clearly marked placeholder.
- Looking like a generic template. It should feel premium and specific to Prestige.
- Hiding the phone number or making booking take more than one click from anywhere.
- Broken on phones. Most visitors will be on mobile, likely mid-garage-emergency.

## Constraints

- **Hosting:** GitHub Pages (static only — no server). Must work at a project-path URL (e.g. `username.github.io/repo/`) now and at a root custom domain later, so asset/links must respect a configurable base path.
- **Forms:** GitHub Pages can't send email, so forms post to a third-party form service (builder's call between Web3Forms / Formspree / similar free tier). Kevin will need to verify his email with that service; the form endpoint/key must be a single config value that's easy to swap.
- **Repo:** https://github.com/sethmusich/prestige-garage-doors (public), local folder `/Users/seth/Documents/GitHub/prestige_garage_doors`, branch `main`. GitHub Actions deploy workflow to Pages; initial URL `https://sethmusich.github.io/prestige-garage-doors/` (base path `/prestige-garage-doors`). The user enables Pages → Source: GitHub Actions in repo settings.

## Decided

### Tech
- **Astro** static site, deployed to GitHub Pages via GitHub Actions. (Claude's call; user approved custom-built + GitHub.)

### Brand / look
- **Colors from the logo:** deep navy (~`#0A1128` as in logo background) as the base, shifting between darker and slightly lighter navy section-to-section (Speck shifts black ↔ maroon/brown). Metallic **gold** (~`#C9A45C`, sample from logo) for section titles, accent bars, icons, and primary buttons. White text.
- Buttons: rounded pill shapes like Speck. Primary = gold (possibly a brighter gold so it pops); secondary = white/outlined with phone number.
- **Type:** an elegant serif for headings echoing the logo's wide-spaced serif wordmark (Claude's call — keeps Speck's bold confidence while matching Prestige); clean sans-serif for body.
- Lots of real photography; text over darkened photo backgrounds in the hero and service cards, like Speck.
- Logo: provided as a square PNG (navy background, gold crest + "PRESTIGE / GARAGE DOORS"). Source: `assets-source/logo-original.png` in the repo. The header needs a transparent or crest-only version; builder may crop/extract from this file. (A cleaner vector from Kevin would be better later.)

### Business facts (use exactly)
- Name: Prestige Garage Doors. Owner: Kevin Reynoso.
- Phone: **(720) 295-3221** (tap-to-call `tel:+17202953221`).
- Google: **4.9★, 53 reviews**. Google profile link (use for "Read more reviews" / "Leave a review"): https://share.google/bAm84qO8wrcA6NIo4
- No street address or business hours on the site: mark it as a **service-area business** in the structured data (Claude's call; hours = TODO placeholder if Kevin wants them).
- Area: Denver metro, **Castle Rock to Longmont**.
- Instagram: https://www.instagram.com/prestigegaragedoorsco/
- Facebook / TikTok: exist per the old footer but URLs unknown → placeholders (old site's links point to Squarespace's own accounts, which is a bug — don't copy).
- Claims the user approved: licensed & insured, same-day service (trucks fully stocked), warranty-backed work, discounts available. Specifics (warranty length, who gets discounts) unknown → generic wording unless answered.

### Copy (from Kevin's current site — reuse, light polish OK)

**Who we are:** "Prestige Garage Doors is a locally owned small business located in the Denver Metro area. We service anywhere from Castle Rock to Longmont. Our goal is to provide outstanding service and fair pricing to every person that gives us the opportunity to earn their business. We truly put people first and make it our mission to offer the best solution for our customers whether it's simple repairs to major repairs or upgrades. We're here every step of the way!"

**Door Tune-Ups:** "The garage door safety tune-up includes a complete 40-point inspection of the garage door, oil/lubrication of essential moving parts and tightening of hardware. We recommend having a tune-up done 1-2 times per year to ensure your door runs efficiently and to reduce risk of potential damage to door."

**Garage Door Repair:** "Repairs can range from replacement of springs, rollers, motors, bearings, or tracks to alignments of spring system, tracks, or door adjustments. We come equipped with fully stocked trucks to get repairs done same day. It is important to note that some unique doors require specific parts that may need to be ordered so please be as detailed as possible when booking appointments."

**Free Estimates (new doors):** "We provide free estimates for new garage doors. We will take measurements and pictures on site and give an in depth estimate with multiple options for doors, pricing and time frames."

**Contact intro:** "Interested in working together? Or have any questions about a repair or project you want to get done? Fill out some info and we will be in touch shortly. We can't wait to hear from you!"

**Booking note:** customers book online through Housecall Pro or call; for unique doors, add as much detail as possible when booking.

### Photos
- Start with the job photos on the current site (Squarespace CDN, e.g. `tune+up+pic.jpg`, `Repair+pic.PNG`, `IMG_0170.PNG`, `IMG_0890.jpg`, `IMG_2629.jpg`, `IMG_2638.jpg`, `v982-d3-04.jpg`; the services page also uses `IMG_2589.jpg`, `IMG_2586.jpg`, `IMG_0883.jpg`). Download them into the repo and optimize.
- More photos will come from Instagram later (user downloads manually). Gallery should be easy to add images to (drop files in a folder).

### Pages and sections

**Global header (sticky):** logo, nav (Home, Services ▾, About, Service Areas, Reviews, Gallery, FAQ, Contact), phone number with icon, gold "Book Now" button, small "4.9★ Google · 53 reviews" badge. Mobile: hamburger + always-visible tap-to-call and Book Now.

**Home** (mirrors Speck's order):
1. **Hero** — darkened garage photo, headline like "Trusted Garage Door Service Across the Denver Metro", subline "Repairs, tune-ups & new doors — Castle Rock to Longmont", buttons: Call (720) 295-3221 · Book Now.
2. **Call-now strip + trust** — "Call now for fast, reliable garage door service", Google 4.9★ badge, licensed & insured, locally owned; photo slideshow beside it.
3. **Free quote form** (the contact/quote form below, plus a "Book online" button) with "Or call us at (720) 295-3221".
4. **Welcome / Who we are** — photo + Who-we-are copy + checkmarks (Licensed & Insured, Same-Day Repairs, Free Estimates on New Doors, Discounts Available) + Book / Call buttons. Use a real photo of Kevin/crew if available, else a job photo.
5. **Our Services** — 3 cards over photos (Tune-Ups, Repair, Free Estimates), each linking to its page.
6. **Why Choose Us?** — gold accordion bars: Locally Owned & Operated, Same-Day Repairs (fully stocked trucks), Fair, Upfront Pricing, Warranty-Backed Work, People First. Photo collage beside it.
7. **Reviews** — "4.9★ from 53 Google reviews" + review cards + "Read more reviews" linking to Google.
8. **FAQ** (short, links to full FAQ page).
9. **Service Areas** — city list with gold pin icons + embedded map of Denver metro.
10. **Footer** — logo, nav, phone, socials, service area summary, © line. (Drop the old "sign up for promotions" email box.)

**Service pages (×3):** `/services/tune-ups`, `/services/repair`, `/services/free-estimates`. Hero with photo, the copy above, what's included, CTA band (call + book), related services. `/services` index lists all three.

**About:** Who-we-are copy, Kevin as owner, values (people first, fair pricing, every step of the way), photos.

**Service Areas:** intro + full city list + map. Cities between Castle Rock and Longmont — builder may draft a reasonable list (e.g. Castle Rock, Castle Pines, Parker, Highlands Ranch, Lone Tree, Centennial, Littleton, Englewood, Aurora, Denver, Lakewood, Golden, Arvada, Westminster, Thornton, Northglenn, Broomfield, Boulder, Louisville, Lafayette, Erie, Longmont) and mark it for Kevin to confirm.

**Reviews:** rating summary + review cards + link to Google profile.

**Gallery:** photo grid with lightbox.

**FAQ:** accordion. Draft common garage-door questions answered only from known facts (how often to tune up → 1–2×/year; same-day repair → yes with stocked trucks, unique doors may need parts ordered; are estimates free → yes for new doors; areas served; how booking works → book online via Housecall Pro or call).

**Book** (`/book`): Housecall Pro booking (embed or link out) + phone + area served.

**Contact** (`/contact`): contact form + phone + Instagram + area served + link to Book.

### Booking — Housecall Pro (user-provided, overrides earlier form plan)
Kevin books jobs through **Housecall Pro**. Every "Book Now" / "Book Online" button goes to:
`https://book.housecallpro.com/book/Prestige-Garage-Doors/6a27e72806254cf3ae84c4cd25c6b0b9?v2=true`
Store this URL as a single config value. The `/book` page presents booking (phone + "Book online" via Housecall Pro); builder decides whether to embed the HCP page in an iframe on `/book` (if HCP allows framing) or link out in a new tab — linking out is the fallback.

### Contact / quote form (questions only, not booking)
The Home "Free Quote" form and the Contact page use a lightweight form posting to the form service: First name*, Last name*, Phone*, Email*, City*, Message* (+ optional "What service?" dropdown: Tune-Up / Repair / Free Estimate on New Door / Other). Success message: "Thanks! We'll be in touch shortly." Spam protection via the form service's honeypot/captcha. Next to the form: "Ready to schedule? Book online" (HCP link) and the phone number.

### SEO basics
Per-page titles/descriptions targeting "garage door repair/tune-up/[city]"; LocalBusiness structured data (name, phone, area served, rating); sitemap; Open Graph image from logo.

## Left to the builder

- Exact color values, fonts, spacing, animations, icon set.
- Form service choice and wiring (one swappable config value).
- Component structure, image optimization, map embed method.
- Hero headline and other short marketing lines (stay truthful; match Kevin's plain, friendly voice).
- Placeholder style for unknowns (must be obviously findable, e.g. `TODO:` in content files).

## Open items (placeholders until answered)

- Review text to display (real Google reviews — need Kevin's permission/selection, or embed).
- Warranty length and discount specifics.
- Facebook and TikTok URLs.
- Photo of Kevin / crew / truck.
- Clean logo files (transparent PNG or SVG).
- Final confirmed city list.
