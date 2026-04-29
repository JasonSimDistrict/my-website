# Cloudflare Pages — connection guide

This doc is the canonical reference for connecting `JasonSimDistrict/my-website` to Cloudflare Pages and attaching a custom domain. Follow it step-by-step the first time, and as a checklist any time deploys break.

## 1. Required build settings

When connecting the repo to Cloudflare Pages — or whenever you need to verify settings — these values **must** match exactly:

| Setting | Value |
| --- | --- |
| Framework preset | **Astro** |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Root directory | `/` (leave blank) |
| Build comments on PRs | optional |
| Production branch | `main` |
| Environment variable: `NODE_VERSION` | `20` (only if `.nvmrc` is ignored, which is rare) |

**Critical:** "Build output directory" defaults to `/` for "no framework". Astro outputs to `dist`. If this is wrong, every URL returns 404 with empty body — exactly the symptom we hit.

## 2. First-time connection (or full reset)

If a previous Pages project for `my-website` is in a broken state, **delete it and recreate it** — that's the cleanest way to ensure framework auto-detection runs from scratch.

### a) Delete the broken project (if it exists)

1. https://dash.cloudflare.com → **Workers & Pages**
2. Click `my-website`
3. **Settings** → scroll to bottom → **Delete project** → confirm
4. The `*.pages.dev` URL becomes available again immediately

### b) Create the project fresh

1. **Workers & Pages** → **Create application** → **Pages** tab → **Connect to Git**
2. Authorize Cloudflare's GitHub app for `JasonSimDistrict/my-website` (one-time)
3. Pick the repo → **Begin setup**
4. **Project name:** `my-website` (gives you `my-website.pages.dev`, or Cloudflare appends a random suffix if taken)
5. **Production branch:** `main`
6. **On the build configuration page (most critical step):**
   - **Framework preset:** select **Astro** from the dropdown
   - Build command auto-fills to `npm run build` ✓
   - Build output directory auto-fills to `dist` ✓
   - Leave Root directory blank
7. Click **Save and Deploy**
8. First build takes ~60–120 seconds. Watch the live build log; you should see:
   ```
   ✓ Completed in ~700ms.
   [@astrojs/sitemap] sitemap-index.xml created at dist
   [build] 11 page(s) built in ~3s
   [build] Complete!
   Success: Assets published!
   ```
9. The **Visit site** button activates and you're live at `https://my-website.pages.dev` (or similar).

## 3. If the build fails — diagnostic checklist

Click into the failed deployment, scroll to the build log, and look for these patterns:

| Error pattern in log | Root cause | Fix |
| --- | --- | --- |
| `npm ERR! engine Unsupported engine` | Wrong Node version | Set env var `NODE_VERSION=20` in **Settings → Environment variables** |
| `Cannot find module '@astrojs/...'` | `package-lock.json` mismatch | In Cloudflare: **Settings → Build & deployments → Build cache → Clear cache** then retry |
| `Cannot read properties of undefined (reading 'reduce')` (sitemap plugin) | Astro/sitemap version mismatch | Already fixed in this repo via Astro 5 + sitemap 3.7 — confirm `package.json` versions still match |
| `The 'site' option is required` | Astro config | Already set in `astro.config.mjs` to `https://projecthome.sg` |
| `Build directory '/' does not exist` or similar | Output directory wrong | Settings → Build & deployments → set **Build output directory** to `dist` |
| Build "Success" but URL 404s | Output directory wrong (Cloudflare looking elsewhere) | Same fix — set **Build output directory** to `dist` |

## 4. Attach your custom domain

Once the `*.pages.dev` URL is serving the site:

1. Open your Pages project → **Custom domains** tab → **Set up a custom domain**
2. Enter your domain (e.g. `projecthome.sg`)
3. Cloudflare will:
   - **Auto-create the DNS records** if your domain's nameservers are already on Cloudflare
   - **Show you the records to add** if your domain is registered/managed elsewhere
4. For an apex domain (`projecthome.sg`): a `CNAME` flattening record (or `A`/`AAAA` records pointing at Cloudflare's edge) is created
5. For a subdomain (`www.projecthome.sg`): a single `CNAME` to `my-website.pages.dev` is created
6. Wait for "Active" status (usually 5–60 seconds when domain is on Cloudflare; up to 24 hours if it's elsewhere)
7. Cloudflare auto-issues an SSL cert via Universal SSL — no action needed

### Recommended DNS pattern for `projecthome.sg`

| Type | Name | Target |
| --- | --- | --- |
| Apex | `projecthome.sg` | (Cloudflare auto-creates `CNAME`-flattened records) |
| WWW redirect | `www.projecthome.sg` | `CNAME → my-website.pages.dev` |

Then in **Rules → Redirect Rules**, add: `www.projecthome.sg/*` → `https://projecthome.sg/$1` (301 permanent) so users always land on the apex.

### Update `astro.config.mjs` after the custom domain is live

The `site` option in `astro.config.mjs` is currently `https://projecthome.sg` — already correct for that domain. If you attach a different domain, update the `site` field to match, commit, and push. The change updates canonical URLs, sitemap, and JSON-LD.

## 5. Subsequent deploys (the happy path)

Once connected:

1. Edit code locally → `git push origin main`
2. Cloudflare auto-detects the push within ~10 seconds
3. New build runs, takes 60–120 seconds
4. Deploy auto-promotes to production on success
5. PRs from feature branches get their own preview URL automatically (`<hash>.my-website.pages.dev`)

## 6. Bypass the auto-build if you ever need to

If Cloudflare's build is broken for any reason but the local build works, deploy the prebuilt `dist/` directly:

```bash
npx wrangler login                              # one-time browser auth
npm run build
npx wrangler pages deploy dist --project-name=my-website --branch=main
```

This skips Cloudflare's CI entirely and uploads the verified-working build artifact straight to the edge.

## 7. WhatsApp + lead form

The lead form is currently a client-side stub (shows confirmation, sends nothing). Before launch:

- **Easiest:** Set the form's `action` to a Formspree, Basin, or Web3Forms endpoint. See `README.md` → "Wiring the lead form".
- **Cloudflare-native:** Add `functions/api/lead.ts` to the repo — Pages will run it as a serverless function. Email yourself via Resend, MailChannels, or webhook to a CRM.

WhatsApp `+65 8282 2486` is wired and works without any backend changes.
