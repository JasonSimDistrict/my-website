import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://my-website-af3.pages.dev',
  integrations: [
    sitemap({
      changefreq: 'weekly',
      priority: 0.8,
      lastmod: new Date(),
    }),
  ],
  trailingSlash: 'ignore',
  build: {
    format: 'directory',
    inlineStylesheets: 'auto',
  },
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport',
  },
});
