# Prestige Garage Doors Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A multi-page Astro marketing site for Prestige Garage Doors, styled and structured like speckgaragedoors.com in Prestige's navy/gold brand, deployed to GitHub Pages.

**Architecture:** Static Astro site. All business facts live in one config module (`src/config.ts`) and small data files (`src/data/*`); pages compose shared section components. Tests run against the built `dist/` HTML with `node:test` + `node-html-parser`; a final Playwright pass checks mobile layout. GitHub Actions builds and deploys to Pages.

**Tech Stack:** Astro 5, plain CSS (custom properties), `@astrojs/sitemap`, `sharp` (via Astro image), `node:test`, `node-html-parser`, Playwright (already available via MCP for the visual pass).

**Spec:** `docs/superpowers/specs/2026-11-11-prestige-website-design.md` — read it before any task; copy text and facts come from there verbatim.

## Global Constraints

- Node 20+ (local is v24). Repo `sethmusich/prestige-garage-doors`, branch `main`.
- `astro.config.mjs`: `site: 'https://sethmusich.github.io'`, `base: '/prestige-garage-doors'`, `trailingSlash: 'always'`. Every internal link/asset goes through a `url(path)` helper so moving to a root custom domain later is a one-line config change.
- Phone: display `(720) 295-3221`, link `tel:+17202953221`.
- Booking URL: `https://book.housecallpro.com/book/Prestige-Garage-Doors/6a27e72806254cf3ae84c4cd25c6b0b9?v2=true` — every "Book Now"/"Book Online" button uses it (opens in new tab, `rel="noopener"`) except the header/nav link to the internal `/book/` page.
- Google profile: `https://share.google/bAm84qO8wrcA6NIo4`; rating `4.9`, count `53`.
- Instagram: `https://www.instagram.com/prestigegaragedoorsco/`. Facebook/TikTok unknown → `null` in config; null socials are not rendered.
- Colors: navy base ~`#0A1128`, lighter navy for alternating sections, gold ~`#C9A45C` (sample from logo), white text. Headings in a wide-spaced serif (e.g. Cinzel or Cormorant via Google Fonts, self-hosted with `@fontsource`), body in a clean sans (e.g. Inter / Source Sans 3). Pill buttons.
- Copy: use the spec's "Copy" section verbatim (light polish OK). Never invent claims, numbers, reviews or testimonials. Approved claims only: locally owned, licensed & insured, same-day repairs (stocked trucks), free estimates on new doors, warranty-backed work, discounts available.
- Placeholders: marked `// TODO:` in source/data files, **never visible** in built HTML.
- Do not copy Speck's text, images or branding.
- Mobile-first; no horizontal scroll at 375px wide.

## Review Focus

1. **Base path** — site served under `/prestige-garage-doors/`: every internal `href`/`src` must resolve to a real file in `dist/`. Test: `internal links resolve` (Task 1, extended as pages land).
2. **Phone on mobile** — a visitor at 375px must see tap-to-call and Book Now without opening the menu, and the page must not scroll sideways. Test: Playwright check in Task 8.
3. **Housecall Pro won't frame** — if HCP sends `X-Frame-Options`/CSP `frame-ancestors`, an iframe shows blank. Expected: `/book/` falls back to a big link-out button. Check in Task 6.
4. **Contact form failure / no JS** — form must work as a plain HTML POST (no JS required) and show a clear error if the service rejects it. Test: `contact form posts without JS` (Task 6).
5. **Placeholders leaking** — "TODO", empty review cards, or null social icons showing up on the live site. Test: `no visible placeholders` (Task 1, runs on every page).

---

## File Structure

```
astro.config.mjs, package.json, tsconfig.json
.github/workflows/deploy.yml
src/config.ts                  # business facts, URLs, form endpoint
src/lib/url.ts                 # url(path) base-path helper
src/data/services.ts           # 3 services: slug, title, summary, body, image, included[]
src/data/cities.ts             # draft city list (TODO: Kevin to confirm)
src/data/faqs.ts               # Q/A pairs
src/data/reviews.ts            # [] for now (TODO: real reviews w/ permission)
src/data/whyChooseUs.ts        # accordion items
src/styles/global.css          # tokens, typography, base, utilities
src/layouts/BaseLayout.astro   # <head>, SEO props, Header, Footer, JSON-LD slot
src/components/Header.astro, Footer.astro, Button.astro, SectionHeading.astro,
  RatingBadge.astro, CtaBand.astro, Accordion.astro, ServiceCard.astro,
  ReviewsSection.astro, ServiceAreas.astro, ContactForm.astro, PhotoSlideshow.astro,
  Lightbox.astro, LocalBusinessSchema.astro
src/components/home/Hero.astro, TrustStrip.astro, Welcome.astro, WhyChooseUs.astro
src/pages/index.astro, about/, services/index + [slug], service-areas/, reviews/,
  gallery/, faq/, book/, contact/, thanks/, 404.astro
src/assets/logo/                # crest.png (transparent), logo-full.png
src/assets/photos/              # job photos from current site
src/assets/gallery/             # drop-in gallery images (globbed)
scripts/process-logo.mjs        # one-off: navy → transparent crest/wordmark
tests/helpers.mjs               # loadPage(route), allPages(), internalRefs(html)
tests/site.test.mjs
```

---

### Task 1: Scaffold, config, layout shell, test harness, deploy workflow

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `src/config.ts`, `src/lib/url.ts`, `src/styles/global.css`, `src/layouts/BaseLayout.astro`, `src/components/{Header,Footer,Button,RatingBadge}.astro`, `src/pages/index.astro` (stub), `src/pages/404.astro`, `tests/helpers.mjs`, `tests/site.test.mjs`, `.github/workflows/deploy.yml`, `README.md`

**Interfaces:**
- Produces:
  - `src/config.ts` exports `SITE` = `{ name, owner, phoneDisplay, phoneHref, bookingUrl, googleUrl, rating: 4.9, reviewCount: 53, instagram, facebook: null, tiktok: null, area: 'Castle Rock to Longmont', formEndpoint, formAccessKey }` (`formAccessKey` = `// TODO:` placeholder string until Kevin verifies email).
  - `url(path: string): string` in `src/lib/url.ts` — prefixes `import.meta.env.BASE_URL`, normalizes slashes, keeps trailing slash for pages.
  - `BaseLayout` props: `{ title: string; description: string; image?: string; noindex?: boolean }`, with a `head` named slot for JSON-LD.
  - `Button` props: `{ href: string; variant: 'gold' | 'outline'; external?: boolean }`.
  - `RatingBadge` props: `{ compact?: boolean }` — reads rating/count from `SITE`, links to `googleUrl`.
  - `tests/helpers.mjs`: `loadPage(route: string): HTMLElement` (reads `dist/<route>/index.html`), `allPages(): string[]` (all routes in dist), `internalRefs(root): string[]`.

- [ ] **Step 1:** `npm create astro@latest . -- --template minimal --no-install --no-git --typescript strict -y`, then `npm i` and `npm i -D node-html-parser @astrojs/sitemap` (add sitemap integration). Add scripts: `"build": "astro build"`, `"test": "npm run build && node --test tests/"`.
- [ ] **Step 2: Write failing tests** in `tests/site.test.mjs`:
  - `home has tap-to-call`: `loadPage('/')` contains an `a[href="tel:+17202953221"]` with text `(720) 295-3221`.
  - `home has Housecall Pro booking link`: some `a` has `href` === `SITE.bookingUrl` and `target="_blank"`.
  - `header shows Google rating`: header text includes `4.9` and `53`.
  - `internal links resolve`: for every page in `allPages()`, every `href`/`src` starting with `/` starts with `/prestige-garage-doors/` and maps to an existing file in `dist/` (strip base, `index.html` for trailing slash, ignore `#` fragments).
  - `no visible placeholders`: for every page, body text (excluding `<script>`) contains no `TODO`, `lorem`, `undefined`, `null`; no `a[href=""]` or `a[href="null"]`.
- [ ] **Step 3:** Run `npm test` → FAIL (stub page lacks content).
- [ ] **Step 4: Implement** config, `url()`, `global.css` tokens (`--navy-900`, `--navy-800`, `--navy-700`, `--gold`, `--gold-bright`, `--white`, font vars, section spacing), BaseLayout (fonts, meta, OG, canonical), sticky Header (logo placeholder text until Task 2, nav per spec, phone, gold Book Now → `url('/book/')`, RatingBadge; mobile: hamburger with phone + Book visible outside the menu), Footer (logo, nav, phone, Instagram, area summary, © year), 404 page. Stub home with a hero heading, call button and Book Online (HCP) button.
- [ ] **Step 5:** `npm test` → PASS.
- [ ] **Step 6:** Add `.github/workflows/deploy.yml` using `withastro/action@v3` + `actions/deploy-pages@v4` on push to `main` (permissions: `pages: write`, `id-token: write`). README: how to run, where facts live (`src/config.ts`), how to add gallery photos, how to switch to custom domain (`site`/`base` + `public/CNAME`).
- [ ] **Step 7:** Commit `feat: scaffold Astro site with config, layout and deploy workflow`.

### Task 2: Brand assets and photos

**Files:**
- Create: `scripts/process-logo.mjs`, `src/assets/logo/crest.png`, `src/assets/logo/logo-full.png`, `public/favicon.png`, `public/og.png`, `src/assets/photos/*`
- Modify: `src/components/Header.astro`, `Footer.astro`, `BaseLayout.astro`

**Interfaces:**
- Consumes: `assets-source/logo-original.png` (1500×1500, navy `~#0A1128` background).
- Produces: `src/assets/logo/crest.png` (gold crest only, transparent), `logo-full.png` (crest + wordmark, transparent), photos named by content: `tune-up.jpg`, `repair.png`, `estimate.jpg`, `job-1.jpg`… used via `astro:assets` `<Image>`.

- [ ] **Step 1:** Write `scripts/process-logo.mjs` with `sharp`: make pixels near the navy background transparent (color-distance threshold, soft edge), crop crest region (≈ y 400–880) → `crest.png`, trim full → `logo-full.png`; also `favicon.png` (crest 64px on navy) and `og.png` (1200×630, logo centered on navy). Run it; visually check output with the Read tool.
- [ ] **Step 2:** Download every photo listed in the spec's Photos section from the current site's Squarespace CDN (`https://images.squarespace-cdn.com/content/v1/691ab07e1cea1c05dff775a2/...`; get exact URLs from the live pages `/` and `/services`, use `?format=2500w`). Skip the Facebook icon. Rename by content after viewing each.
- [ ] **Step 2b:** Also import the user's new photos from `assets-source/photos/` (crew in branded shirts at the truck, tech working on a door, team member at laptop in branded polo, truck with opener rail, finished wood-look door, before/after door shots). Prefer these over the old-site photos: branded crew shots for the Welcome/About and Why Choose Us sections, the finished door or crew-at-work for the hero, all of them in the gallery. Crop out black letterbox bars from phone screenshots. Don't caption anyone by name unless the user confirms who it is.
- [ ] **Step 3:** Swap Header/Footer to `<Image>` logos (header: crest + "PRESTIGE / GARAGE DOORS" or `logo-full` at small height — pick what reads best at 56px tall); add favicon + OG image to BaseLayout.
- [ ] **Step 4:** Add test `logo and favicon present`: header contains an `img` with alt `Prestige Garage Doors`; `<link rel="icon">` present. `npm test` → PASS.
- [ ] **Step 5:** Commit `feat: add processed logo, favicon, OG image and job photos`.

### Task 3: Shared section components + data files

**Files:**
- Create: `src/data/{services,cities,faqs,reviews,whyChooseUs}.ts`, `src/components/{SectionHeading,CtaBand,Accordion,ServiceCard,ReviewsSection,ServiceAreas,PhotoSlideshow,ContactForm}.astro`

**Interfaces:**
- Produces:
  - `services: Service[]`, `Service = { slug: 'tune-ups' | 'repair' | 'free-estimates'; title: string; short: string; body: string; included: string[]; image: ImageMetadata }`. `body` = spec copy verbatim.
  - `cities: string[]` — the spec's draft list, file header `// TODO: Kevin to confirm`.
  - `faqs: { q: string; a: string }[]` — answers only from spec facts (tune-up 1–2×/year; same-day repairs, unique doors may need parts ordered; estimates free for new doors; area Castle Rock–Longmont; booking via Housecall Pro or call; licensed & insured).
  - `reviews: { name: string; text: string; when?: string }[]` = `[]` with `// TODO:`.
  - `whyChooseUs: { title: string; body: string }[]` — Locally Owned & Operated, Same-Day Repairs, Fair, Upfront Pricing, Warranty-Backed Work, People First (bodies drawn from spec copy).
  - `SectionHeading { title: string; eyebrow?: string; align?: 'left'|'center' }` (gold serif uppercase).
  - `CtaBand { heading?: string }` — call + Book Online buttons.
  - `Accordion { items: {title, body}[]; variant: 'gold' | 'plain' }` — native `<details>/<summary>` (works without JS); first item open.
  - `ServiceCard { service: Service }` — photo background, dark overlay, title, short, "Learn more".
  - `ReviewsSection { limit?: number }` — rating summary + RatingBadge + cards from `reviews` (hidden when empty) + "Read our Google reviews" button.
  - `ServiceAreas { compact?: boolean }` — gold pin list in 2–3 columns + Google Maps embed iframe (`https://www.google.com/maps?q=Denver+metro+Colorado&output=embed`, lazy).
  - `PhotoSlideshow { images: ImageMetadata[] }` — CSS scroll-snap carousel with dots; no JS required.

  - `ContactForm { compact?: boolean }` — see Task 6 for fields/behavior; built here so Home can use it. Task 6 adds its tests and pages.

- [ ] **Step 1:** Create data files and components (including `ContactForm` per Task 6 Step 4). Behavior is verified by the page tests in Tasks 4–6; this task's check is type-safety.
- [ ] **Step 2:** `npx astro check` → 0 errors.
- [ ] **Step 3:** Commit `feat: add shared section components and content data`.

### Task 4: Home page

**Files:**
- Create: `src/components/home/{Hero,TrustStrip,Welcome,WhyChooseUs}.astro`
- Modify: `src/pages/index.astro`, `tests/site.test.mjs`

**Interfaces:**
- Consumes: everything from Task 3 (including `ContactForm compact`).

- [ ] **Step 1: Failing tests:**
  - `home sections in Speck order`: h1/h2 text order on `/` matches: hero h1 → "Call now" heading → "Who we are"/welcome → "Our Services" → "Why Choose Us" → reviews heading → "FAQ" → "Service Areas".
  - `home links each service`: `/` has links to `/prestige-garage-doors/services/tune-ups/`, `/repair/`, `/free-estimates/`.
  - `home lists approved claims`: text includes `Licensed & Insured`, `Same-Day`, `Free Estimates`.
- [ ] **Step 2:** `npm test` → FAIL.
- [ ] **Step 3:** Build sections per spec "Home" 1–10: Hero (darkened job photo, h1 "Trusted Garage Door Service Across the Denver Metro", subline "Repairs, tune-ups & new doors — Castle Rock to Longmont", Call + Book Online), TrustStrip (call-now heading, rating badge, licensed & insured, locally owned; PhotoSlideshow), quote form block, Welcome (photo + Who-we-are copy + 4 checkmarks + buttons), Our Services (3 ServiceCards), WhyChooseUs (gold Accordion + photo collage), ReviewsSection, FAQ (first 4 faqs + link), ServiceAreas compact. Alternate `--navy-900`/`--navy-800` backgrounds; gold rule between hero and body like Speck.
- [ ] **Step 4:** `npm test` → PASS. Screenshot `/` at 1440 and 375 with Playwright (`npm run preview`) and compare against the Speck screenshots in `.playwright-mcp/speck-*.jpg` for look/feel; fix obvious gaps.
- [ ] **Step 5:** Commit `feat: build home page`.

### Task 5: Service, About, Service Areas, Reviews, Gallery, FAQ pages

**Files:**
- Create: `src/pages/services/index.astro`, `src/pages/services/[slug].astro`, `src/pages/about/index.astro`, `src/pages/service-areas/index.astro`, `src/pages/reviews/index.astro`, `src/pages/gallery/index.astro`, `src/pages/faq/index.astro`, `src/components/Lightbox.astro`
- Modify: `tests/site.test.mjs`

**Interfaces:**
- Consumes: Task 3 data/components.
- Produces: routes `/services/`, `/services/{tune-ups,repair,free-estimates}/`, `/about/`, `/service-areas/`, `/reviews/`, `/gallery/`, `/faq/`.

- [ ] **Step 1: Failing tests:**
  - `each service page has its copy`: `/services/tune-ups/` contains `40-point inspection`; `/services/repair/` contains `fully stocked trucks`; `/services/free-estimates/` contains `multiple options for doors`. Each has a tel link and the booking URL.
  - `service areas lists Castle Rock and Longmont`: `/service-areas/` text includes both and has a map `iframe`.
  - `about names the owner`: `/about/` includes `Kevin Reynoso`.
  - `gallery renders photos`: `/gallery/` has ≥ 6 `img`.
  - `faq page`: `/faq/` has one `details` per entry in `faqs`.
- [ ] **Step 2:** `npm test` → FAIL.
- [ ] **Step 3:** Implement. Service pages: photo hero with title, body copy, "What's included" list, CtaBand, other two services as cards. Gallery: `import.meta.glob('../../assets/{photos,gallery}/*', { eager: true })` grid; Lightbox = `<dialog>` with small inline script, images still viewable (link to full size) without JS. Per-page `title`/`description` targeting "garage door repair Denver", etc.
- [ ] **Step 4:** `npm test` → PASS.
- [ ] **Step 5:** Commit `feat: add services, about, service areas, reviews, gallery and FAQ pages`.

### Task 6: Book and Contact pages, contact form

**Files:**
- Create: `src/pages/book/index.astro`, `src/pages/contact/index.astro`, `src/pages/thanks/index.astro`
- Modify: `src/components/ContactForm.astro` (from Task 3) if tests require, `tests/site.test.mjs`

**Interfaces:**
- Consumes: `SITE.formEndpoint`, `SITE.formAccessKey`, `SITE.bookingUrl`.
- Produces: `ContactForm { compact?: boolean }`.

- [ ] **Step 1: Check framing:** `curl -sI "<bookingUrl>" | grep -iE 'x-frame-options|content-security-policy'`. If either blocks framing → `/book/` is link-out only (large gold "Book Online" button + phone + what to expect). If framing allowed → iframe (min-height 900px) **plus** the link-out button above it. Record which in a code comment.
- [ ] **Step 2: Failing tests:**
  - `contact form posts without JS`: `/contact/` has `form[method="POST"]` whose `action` === `SITE.formEndpoint`, with `name` inputs `first_name`, `last_name`, `phone`, `email`, `city`, `message` (all `required`), optional `service` `select` with options Tune-Up / Repair / Free Estimate on New Door / Other, a hidden access-key input, a hidden `redirect` to the absolute `/prestige-garage-doors/thanks/` URL, and a honeypot field.
  - `book page links Housecall Pro`: `/book/` has an `a[href=bookingUrl]` and the tel link.
  - `thanks page`: `/thanks/` includes `We'll be in touch shortly` and is `noindex`.
- [ ] **Step 3:** `npm test` → FAIL.
- [ ] **Step 4:** Implement with Web3Forms field conventions (`access_key`, `redirect`, `botcheck`; endpoint `https://api.web3forms.com/submit`). Progressive enhancement: small script submits via `fetch`, shows inline success, or inline error "Something went wrong — please call (720) 295-3221" on non-OK; without JS the redirect handles success. Contact page: intro copy from spec, form, phone, Instagram, area, "Ready to schedule? Book online".
- [ ] **Step 5:** `npm test` → PASS.
- [ ] **Step 6:** Commit `feat: add book and contact pages with contact form`.

### Task 7: SEO and structured data

**Files:**
- Create: `src/components/LocalBusinessSchema.astro`
- Modify: `src/layouts/BaseLayout.astro`, `src/pages/*` (titles/descriptions), `tests/site.test.mjs`

- [ ] **Step 1: Failing tests:**
  - `local business schema`: `/` has `script[type="application/ld+json"]` parsing to `@type` `HomeAndConstructionBusiness` with `telephone` `+1-720-295-3221`, `aggregateRating.ratingValue` `4.9`, `reviewCount` `53`, `areaServed` array including `Castle Rock` and `Longmont`, and **no** `address.streetAddress`.
  - `unique titles`: every page has a non-empty, unique `<title>` and `meta[name=description]`.
  - `sitemap`: `dist/sitemap-index.xml` exists and excludes `/thanks/`.
- [ ] **Step 2:** `npm test` → FAIL.
- [ ] **Step 3:** Implement schema (from `SITE` + `cities`, `sameAs` = non-null socials), sitemap filter, canonical URLs.
- [ ] **Step 4:** `npm test` → PASS.
- [ ] **Step 5:** Commit `feat: add structured data, sitemap and per-page SEO`.

### Task 8: Mobile/visual verification and deploy

**Files:**
- Modify: whatever the checks surface.

- [ ] **Step 1:** `npm run build && npm run preview`. With Playwright at 375×812 and 1440×900, visit every route: assert `document.documentElement.scrollWidth <= innerWidth`, tel link and Book Now visible in header without opening the menu, menu opens/closes. Screenshot `/`, `/services/repair/`, `/book/` at both sizes and review them.
- [ ] **Step 2:** Fix issues; `npm test` → PASS.
- [ ] **Step 3:** Commit `fix: mobile and visual polish`, then `git push`.
- [ ] **Step 4:** Ask the user to set **Settings → Pages → Source: GitHub Actions** on the repo (one-time). Then confirm the Actions run succeeds and `https://sethmusich.github.io/prestige-garage-doors/` loads with images and working links.
- [ ] **Step 5:** Report the open TODOs to the user: Web3Forms access key (Kevin verifies email), real reviews, warranty/discount specifics, Facebook/TikTok URLs, owner/crew photo, clean logo files, confirmed city list.
