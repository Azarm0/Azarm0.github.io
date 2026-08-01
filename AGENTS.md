## Content lives in three data files

Site copy is split across three files, all of them read by the build.

| File | What it holds | Read by |
|---|---|---|
| `src/data/site.ts` | packages, process, FAQ, contact | the build |
| `src/data/projeler.ts` | case studies | the build |
| `src/data/vitrin.ts` | Vitrin customer sites | the build |

There used to be a fourth, `public/llms.txt`, a hand-written prose summary of the
other three that nothing read at build time and that drifted stale twice. It was
deleted on 2026-08-01. Two reasons: no major AI company reads llms.txt in
production, so it was not doing the job it was written for, and it carried the
agency's email and phone number as plaintext, which made it the easiest thing on
the site to scrape. Do not reintroduce it.

A file outside this repo does still drift:
`C:\Dev\Sites\_tools\satis\kadirhan-saha-karti.md` maps shop types to demo URLs.
A new demo that is not in that table never gets shown to a customer.

`CLAUDE.md` is a symlink to this file (git mode `120000`), so there is nothing to
mirror — edit `AGENTS.md` and both are current. Do not replace the symlink with a
copy; that reintroduces the drift it exists to prevent.

## Adding a Vitrin customer

One object in `src/data/vitrin.ts` plus photos. No new repo, no DNS, no per-customer
install. Read the header comment in `vitrin.ts` before writing the entry: it explains
why `liste` carries no prices, and why `ustaAdi`, `tarif` and `kapaliGunler` exist.

Raw phone photos go in `ham/<slug>/` at the project root, untouched, whatever the
phone called them. Write `ham/<slug>/eslesme.json` naming which is which:

```json
{ "IMG_4821.jpg": "kapak", "WhatsApp Image 2026-07-31 at 14.22.01.jpeg": "galeri-1" }
```

Then, per customer:

```
npm run foto -- <slug>     # normalise ham/, size variants, update the manifest
npm run qr   -- <slug>     # qr.svg + print-ready A6 masa-karti.pdf/.png
npm run kart -- <slug>     # portfolio thumbnail and OG image (needs a dev server)
```

`npm run font` is a project-level optimisation, not a per-customer step. Do not run
it during onboarding.

Things that are load-bearing here:

- **`ham/` is outside `public/` on purpose.** Astro copies `public/` verbatim, so
  raw originals placed there would publish several megabytes nobody asked for. It
  is gitignored apart from `eslesme.json`, which records a judgement call
  (which photo is the cover, in what gallery order) that filenames cannot.
- **The script will not guess the cover.** With no `eslesme.json` it lists what it
  found, with resolved dimensions and orientation, and exits 1. Guessing wrong is a
  wrong page, not a slow one.
- **EXIF rotation is baked into the pixels**, not left as a tag, because the
  normalised base file is the `src` fallback. A browser ignoring `srcset` would
  otherwise show the photo on its side.
- **Unrecognised filenames fail the run.** A photo dropped straight into
  `public/vitrin/<slug>/` under its phone name used to vanish silently.
- **A bad slug exits 1.** `npm run foto -- <slug>` once took a path, not a slug, and
  exited 0 having written nothing, shipping the untouched original as the only source.

## The table QR must keep pointing at the menu

`src/lib/vitrinHedef.ts` owns the QR target and the section ids. Both templates take
their section id from `QR_BOLUM` rather than a literal, so the printed code and the
anchor cannot drift apart.

This exists because they did. The card reads "Menümüz için karekodu okutun" and
Kadirhan's script promises the menu opens on the phone, but the generator encoded
the page root, so a scan landed on the hero photo. Nothing could catch it: the SVG
rendered, the PDF rendered, the card looked finished.

**Do not hardcode `#menu` or `#hizmetler` anywhere.** If a section is renamed,
rename it in `QR_BOLUM` and regenerate every affected card, because printed cards
in a shop cannot be patched.

`scripts/vitrin-qr.mjs` rasterises each generated code and reads it back with a real
decoder before writing it. Keep that check.

## `kurgu: true` is not decorative

An invented business gets `noindex, nofollow`, **no** LocalBusiness JSON-LD, a
visible disclaimer bar, and exclusion from the sitemap (derived in
`astro.config.mjs` from the data, so a new demo cannot drift back in). Publishing an
indexable page carrying a schema-marked address, telephone and opening hours for a
shop that does not exist would be feeding Google a fabricated business record.

Never invent reviews. `yorumlar: []` renders nothing, which is the correct outcome
when an owner sent none.

## Verifying a change

Use the repo's own Puppeteer, not the in-app Browser pane. On 2026-08-01 the pane
would not composite: scroll checks returned `canScroll: false` on a scrollable page
and screenshots timed out.

- Emulate **375x812 at `deviceScaleFactor: 3`**. Real Android phones are DPR 3, so
  the browser picks `kapak-1200`, not `kapak-768`. Measuring at DPR 2 understated a
  page as 165 KB when it was 283 KB.
- Fresh browser per run plus `setCacheEnabled(false)` and CDP
  `Network.setCacheDisabled`. A shared cache once reported a whole page as 4.5 KB.
- Sum `Network.loadingFinished.encodedDataLength` for real transferred bytes.
- Throttling **is** available via CDP `Network.emulateNetworkConditions`. Never claim
  a throttled test is impossible here.
- Serve the build, not the dev server: `mevcut-digital-preview` in
  `C:\Dev\Sites\.claude\launch.json`. The dev server injects an HMR client and
  serves unminified assets.
- Repeat any surprising throttled number. A one-off 503 KB reading did not survive
  three repeats.

Current baseline, cold cache, 375x812 DPR 3: a Vitrin page is 8 requests, **zero
JavaScript**, and 237 to 283 KB depending on cover aspect ratio. The cover image is
roughly three quarters of that. A portrait cover costs about 46 KB more than a
landscape one and is sharper, because the mobile hero box is tall.

## Development

Start the dev server in background mode:

```
astro dev --background
```

Manage it with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
