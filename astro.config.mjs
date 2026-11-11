// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Custom domain. To go back to the GitHub test URL: SITE = 'https://sethmusich.github.io', BASE = '/prestige-garage-doors', delete public/CNAME.
const SITE = 'https://prestigegaragedoorsco.com';
const BASE = '/';

export default defineConfig({
  site: SITE,
  base: BASE,
  trailingSlash: 'always',
  // Inline CSS into every page: a browser holding a cached page from a previous deploy
  // can't end up pointing at a renamed (deleted) stylesheet and rendering unstyled.
  build: { inlineStylesheets: 'always' },
  integrations: [
    sitemap({ filter: (page) => !page.includes('/thanks/') }),
  ],
});
