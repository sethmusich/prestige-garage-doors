# Prestige Garage Doors — website

Marketing site for Prestige Garage Doors (Denver Metro, Castle Rock to Longmont). Built with [Astro](https://astro.build), deployed to GitHub Pages.

Live (until the custom domain is set up): https://sethmusich.github.io/prestige-garage-doors/

## Run it

```sh
npm install
npm run dev       # local dev server
npm test          # build + run the site checks in tests/
npm run preview   # serve the built site
```

Pushing to `main` deploys automatically (`.github/workflows/deploy.yml`). One-time setup: repo **Settings → Pages → Source: GitHub Actions**.

## Where things live

| What | Where |
|------|-------|
| Phone, booking link, Google rating, socials, form key | `src/config.ts` |
| Services text | `src/data/services.ts` |
| City list | `src/data/cities.ts` |
| FAQ | `src/data/faqs.ts` |
| Reviews shown on the site | `src/data/reviews.ts` |
| Photos | `src/assets/photos/` |
| Gallery | drop images into `src/assets/gallery/` — they appear automatically |
| Original logo / source photos | `assets-source/` |

Search the code for `TODO:` to find details still waiting on Kevin.

## Contact form

The contact form posts to [Web3Forms](https://web3forms.com). Kevin creates a free access key with his email address, then paste it into `formAccessKey` in `src/config.ts`.

## Switching to a custom domain

1. In `astro.config.mjs`, set `SITE` to the domain (e.g. `https://www.example.com`) and `BASE` to `'/'`.
2. Add `public/CNAME` containing the bare domain, and update the Sitemap URL in `public/robots.txt`.
3. Point DNS at GitHub Pages and set the domain in repo Settings → Pages.
