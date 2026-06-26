// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://projecthome.sg',
  build: {
    format: 'directory',
  },
  trailingSlash: 'ignore',
  integrations: [
    sitemap({
      filter: (page) => !page.endsWith('/404/'),
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
      serialize(item) {
        // `directory` build format means every URL has a trailing slash.
        const path = item.url.replace('https://projecthome.sg', '').replace(/\/$/, '') || '/';
        if (path === '/') {
          item.priority = 1.0;
          item.changefreq = 'weekly';
        } else if (
          path === '/7-steps-buyer-framework' ||
          path === '/navis-primekey-analysis' ||
          path === '/our-services' ||
          path === '/blog' ||
          path === '/blog/new-launches'
        ) {
          item.priority = 0.9;
          item.changefreq = 'weekly';
        } else if (path.startsWith('/blog/')) {
          item.priority = 0.8;
          item.changefreq = 'monthly';
        } else if (path === '/privacy-policy' || path === '/disclaimer') {
          item.priority = 0.3;
          item.changefreq = 'yearly';
        }
        return item;
      },
    }),
  ],
});
