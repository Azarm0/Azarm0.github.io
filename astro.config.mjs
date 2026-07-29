// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import sitemap from '@astrojs/sitemap';

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

  integrations: [sitemap()]
});