// @ts-check
import { defineConfig } from 'astro/config';

// Astro 5 config — projecthome.sg
//
// Notes:
//  - `site`             — used by @astrojs/sitemap (when we add it in Stage 2) and any
//                         build-time URL generation.
//  - `build.format`     — `directory` outputs /disclaimer/index.html  →  clean URL /disclaimer.
//                         The old HTML site lives in the parent folder until cutover.
//  - `trailingSlash`    — `ignore` so Cloudflare serves both /disclaimer and /disclaimer/
//                         without redirect chains. We canonicalise no-trailing-slash in <head>.
//  - `publicDir`        — Astro copies the contents of /public/ to the build root verbatim.
//                         We sync the parent /assets/ folder into /public/assets/ via
//                         scripts/sync-public.mjs before every `dev`/`build` — that keeps
//                         the existing absolute /assets/... references working in the
//                         Astro build with zero edits to legacy CSS/JS.
//
// When we get to Stage 3 (cutover), we'll add:
//   - @astrojs/sitemap   — auto-generated sitemap.xml from all routes
//   - @astrojs/mdx       — blog posts as .mdx with frontmatter
//   - redirects map      — /page.html → /page (301) inside this config
//
// For Stage 0 we're keeping it minimal.

export default defineConfig({
  site: 'https://projecthome.sg',
  build: {
    format: 'directory',
  },
  trailingSlash: 'ignore',
});
