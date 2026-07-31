# projecthome.sg

Live: **<https://projecthome.sg>** — served by Cloudflare Pages from
`astro/dist/` on every push to `main`.

Astro 5 static site. The Cloudflare Pages Function at
`functions/api/lead.js` handles `POST /api/lead` (Resend integration for
the enquiry forms).

## Working on the site

Content and layout live inside [`astro/`](./astro/) — see
[`astro/README.md`](./astro/README.md) for install / dev / build
instructions and the full folder map.

## Cloudflare Pages build settings

| Setting | Value |
|---|---|
| Build command | `cd astro && npm install && npm run build` |
| Build output directory | `astro/dist` |
| Root directory | `/` (kept at repo root so `functions/api/lead.js` is discovered) |
| Node version | 18 |

Env vars on the Pages project:

| Var | Type | Required |
|---|---|---|
| `RESEND_API_KEY` | Secret | yes |
| `LEAD_TO_EMAIL` | Plaintext | optional (defaults to `projecthome.sg@gmail.com`) |

## Legacy HTML backup

The pre-Astro hand-written HTML site is preserved as a local-only
snapshot at `C:\Claude\projecthome-sg-html-backup\` — not tracked in
this repo. It's not needed for production and shouldn't be restored
here; the `.gitignore` blocks the paths it used to occupy.
