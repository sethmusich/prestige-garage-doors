// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// When the custom domain is ready: set SITE to it, BASE to '/', and add public/CNAME.
const SITE = 'https://sethmusich.github.io';
const BASE = '/prestige-garage-doors';

export default defineConfig({
  site: SITE,
  base: BASE,
  trailingSlash: 'always',
  integrations: [
    sitemap({ filter: (page) => !page.includes('/thanks/') }),
  ],
});
