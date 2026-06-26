// Sync the parent repo's /assets/ directory into ./public/assets/ so that
// absolute paths like /assets/css/style.css?v=149 resolve correctly in the
// Astro dev server AND in the production build output.
//
// This script runs automatically before `npm run dev` and `npm run build`.
//
// Why not symlink? Windows symlinks need admin/dev-mode and Git treats them
// inconsistently. A plain copy works everywhere and ./public/assets/ is
// gitignored, so we never commit the duplication.
//
// Cost: ~30 MB local disk in the Astro folder. Sync takes ~1 second on SSD.

import { cp, mkdir, stat } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ASTRO_ROOT = resolve(__dirname, '..');
const SRC = resolve(ASTRO_ROOT, '..', 'assets');
const DST = resolve(ASTRO_ROOT, 'public', 'assets');

async function exists(p) {
  try { await stat(p); return true; } catch { return false; }
}

console.log(`[sync-public] ${SRC}  →  ${DST}`);

if (!(await exists(SRC))) {
  console.error(`[sync-public] ERROR: source dir does not exist: ${SRC}`);
  console.error(`[sync-public] Are you running this from the wrong directory?`);
  process.exit(1);
}

await mkdir(DST, { recursive: true });
await cp(SRC, DST, { recursive: true, force: true });
console.log(`[sync-public] done.`);
