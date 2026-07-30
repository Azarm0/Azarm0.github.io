// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import sitemap from '@astrojs/sitemap';

import { vitrinler } from './src/data/vitrin';

/*
 * Kurgu Vitrin pages are served `noindex`, so listing them in the sitemap would
 * be asking Google to crawl pages we have just told it to ignore. Derived from
 * the data file rather than hardcoded, so a new demo cannot drift back in.
 */
const haricTutulan = new Set(
  vitrinler.filter((v) => v.kurgu).map((v) => `https://mevcut.digital/${v.slug}`),
);

// https://astro.build/config
export default defineConfig({
  site: 'https://mevcut.digital',
  trailingSlash: 'ignore',

  // Off so headless screenshots (OG image, verification shots) stay clean.
  devToolbar: { enabled: false },

  build: {
    inlineStylesheets: 'auto',
  },

  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [
    sitemap({
      filter: (sayfa) => !haricTutulan.has(sayfa.replace(/\/$/, '')),
    }),
  ]
});