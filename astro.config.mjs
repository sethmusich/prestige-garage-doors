// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Custom domain. To go back to the GitHub test URL: SITE = 'https://sethmusich.github.io', BASE = '/prestige-garage-doors', delete public/CNAME.
const SITE = 'https://www.prestigegaragedoorsco.com';
const BASE = '/';

export default defineConfig({
  site: SITE,
  base: BASE,
  trailingSlash: 'always',
  integrations: [
    sitemap({ filter: (page) => !page.includes('/thanks/') }),
  ],
});
