// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

import svelte from '@astrojs/svelte';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  site: 'https://eduardoms.dev',
  output: 'static',
  // Swap to `@astrojs/cloudflare` (same `output: 'static'` config shape) to deploy on Cloudflare Pages instead.
  adapter: vercel(),
  integrations: [svelte(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
    // Only affects `astro preview` (used to demo the site through a tunnel); irrelevant to the built static site.
    preview: {
      allowedHosts: true
    }
  }
});
