/**
 * Capture the tall portrait renders the homepage hero scrolls inside a phone frame.
 *
 *   npm run dev                              # in one terminal
 *   node scripts/vitrin-telefon.mjs          # everyone
 *   node scripts/vitrin-telefon.mjs usta-nuri-berber
 *
 * Sibling of vitrin-kart.mjs and deliberately separate from it. That one shoots a
 * single viewport for the portfolio grid and the social card; this one shoots a
 * tall strip that the hero animates behind a mask, so the visitor watches a real
 * page scroll on a real phone before reading a word of copy.
 *
 * Writes public/isler/<slug>-telefon-<width>.webp. The manifest entry it adds to
 * src/data/gorseller.json carries the `telefon` role, which src/lib/gorsel.ts maps
 * to the hero's `sizes`. vitrin-foto.mjs skips these files by name, the same way it
 * already skips the og.jpg, because their widths are decided here and re-cutting
 * them as 16:10 card variants would produce files nothing requests.
 *
 * Why a 1600px-tall CSS strip and not the whole page:
 *
 *  - It is a little under two phone screens, so the loop has 756 CSS px of travel
 *    and never reaches the bottom of the strip, which would snap.
 *  - A full Vitrin page is 4400-4500 CSS px. Shooting all of it would nearly
 *    triple the bytes for scroll distance nobody ever sees.
 *  - Height is the only real cost lever here. This started at 2000 and the drop to
 *    1600 took the 660w berber strip from 77 KB to 60 KB, which is most of the
 *    difference between the home page loading at 169 KB and at 152 KB.
 *
 * STRIP_BOY is a contract with `--serit` in global.css. Change one and the other
 * must follow, or the keyframe scrolls past the end of the image and the phone
 * shows a black band.
 *
 * Shot at deviceScaleFactor 2 and downscaled, for the same reason vitrin-kart.mjs
 * gives: a 1x capture of 16px text is visibly soft once it lands on a phone.
 * The widths exist for specific slots: a phone at 57vw/DPR3 asks for 641 px and
 * takes 660; a desktop frame at 19rem asks for 608 at DPR2 and 912 at DPR3, so it
 * takes 660 and 880. 440 is there for DPR1. Detail past that is bytes spent on
 * something no eye resolves, because the image never stops moving.
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer';
import sharp from 'sharp';

import { vitrinler } from '../src/data/vitrin.ts';

const KOK = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const CIKTI = path.join(KOK, 'public', 'isler');
const MANIFEST = path.join(KOK, 'src', 'data', 'gorseller.json');
const TABAN = process.env.VITRIN_TABAN ?? 'http://localhost:4321';

/** The phone we are pretending to be. 390x844 is an iPhone 14 / Pixel 7 class screen. */
const EN = 390;
const STRIP_BOY = 1600;
const OLCEK = 2;

/** Downscaled widths written to disk, narrowest first so the srcset reads in order. */
const GENISLIKLER = [440, 660, 880];

/**
 * 62 rather than the 76 vitrin-foto.mjs uses for cards. These strips are two and a
 * half screens tall and there are two of them in the hero, so they are the largest
 * thing on the page; and they never stop moving, which hides artefacts that would
 * be obvious on a still.
 *
 * Measured at 480w, all three demos: quality 70 gave 54 / 75 / 78 KB, quality 62
 * gives 49 / 71 / 73 KB. That is 6 to 9 percent, not the large win it looks like it
 * should be, because what actually costs bytes here is STRIP_BOY, not the quantiser.
 * Dropping quality further starts showing on the menu text before it saves anything
 * worth having, so this is the floor rather than a tuning knob.
 */
const KALITE = 62;

const secilen = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const hedefler =
  secilen.length > 0 ? vitrinler.filter((v) => secilen.includes(v.slug)) : vitrinler;

if (hedefler.length === 0) {
  console.error(`Eslesen vitrin yok: ${secilen.join(', ')}`);
  process.exit(1);
}

// The two flags are not optional on this machine: without them the page's CDP
// session drops on the first setViewport with "Session closed".
const tarayici = await puppeteer.launch({
  headless: true,
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
});

/** Manifest entries this run produced, merged into the file at the end. */
const manifest = {};

try {
  await mkdir(CIKTI, { recursive: true });

  for (const vitrin of hedefler) {
    const sayfa = await tarayici.newPage();
    await sayfa.setViewport({ width: EN, height: 844, deviceScaleFactor: OLCEK });
    await sayfa.goto(`${TABAN}/${vitrin.slug}`, { waitUntil: 'networkidle0' });

    /*
     * A clip capture does not scroll, so everything the reveal animation is still
     * holding at opacity 0 photographs as blank. The first attempt drove the real
     * IntersectionObserver by scrolling the page in 600px steps; it left the
     * services section empty, because the observer is throttled and a sweep fast
     * enough to be worth doing outruns it.
     *
     * So drive the end state directly instead of racing the observer: add the class
     * the observer would have added, and promote every lazy image to eager so the
     * gallery below the fold is decoded rather than deferred. Deterministic, and it
     * cannot half-fire.
     */
    await sayfa.evaluate(async () => {
      /*
       * The call bar is position:fixed, so a clip capture prints it once, stranded
       * wherever the viewport happened to be, and it would then scroll up the frame
       * with everything else. A floating green bar drifting through the middle of
       * the menu is worse than not showing it, so it comes out of the strip.
       */
      for (const el of document.querySelectorAll('.v-cagri-bar')) {
        el.style.display = 'none';
      }
      for (const el of document.querySelectorAll('.v-reveal, .reveal')) {
        el.classList.add('is-visible');
      }
      for (const img of document.querySelectorAll('img[loading="lazy"]')) {
        img.loading = 'eager';
        if (img.dataset.src) img.src = img.dataset.src;
      }
      await Promise.all(
        [...document.images].filter((i) => !i.complete).map(
          (i) =>
            new Promise((r) => {
              i.addEventListener('load', r, { once: true });
              i.addEventListener('error', r, { once: true });
            }),
        ),
      );
      await Promise.all([...document.images].map((i) => i.decode().catch(() => {})));
    });

    // Webfonts settle after networkidle, and a capture taken mid-swap shows the
    // fallback face. The açık/kapalı line is written on load, so give it a beat too.
    await sayfa.evaluate(() => document.fonts.ready);
    await sayfa.evaluate(() => new Promise((r) => requestAnimationFrame(() => r())));
    await new Promise((r) => setTimeout(r, 400));

    const ham = await sayfa.screenshot({
      type: 'png',
      clip: { x: 0, y: 0, width: EN, height: STRIP_BOY, scale: OLCEK },
    });

    const kamuYolu = `/isler/${vitrin.slug}-telefon.webp`;
    const yazilan = [];

    for (const genislik of GENISLIKLER) {
      const veri = await sharp(ham)
        .resize({ width: genislik })
        .webp({ quality: KALITE })
        .toBuffer();

      const dosya = path.join(CIKTI, `${vitrin.slug}-telefon-${genislik}.webp`);
      await writeFile(dosya, veri);
      yazilan.push(`${genislik}w ${(veri.length / 1024).toFixed(0)}KB`);

      // The widest variant is also written unsuffixed, because that is the path
      // the manifest keys on and the `src` a browser ignoring srcset falls back
      // to. Same convention as the kart images: base file equals widest variant.
      if (genislik === GENISLIKLER[GENISLIKLER.length - 1]) {
        await writeFile(path.join(CIKTI, `${vitrin.slug}-telefon.webp`), veri);
      }
    }

    manifest[kamuYolu] = { rol: 'telefon', genislikler: GENISLIKLER };
    console.log(`${vitrin.slug}-telefon  ${yazilan.join('  ')}`);

    await sayfa.close();
  }
} finally {
  await tarayici.close();
}

// Merge rather than replace, exactly as vitrin-foto.mjs does: running this against
// one customer must not wipe every other customer's srcset out of the manifest.
let onceki = {};
try {
  onceki = JSON.parse(await readFile(MANIFEST, 'utf8'));
} catch {
  // First run.
}
const birlesik = { ...onceki, ...manifest };
const sirali = Object.fromEntries(Object.entries(birlesik).sort(([a], [b]) => a.localeCompare(b)));
await writeFile(MANIFEST, JSON.stringify(sirali, null, 2) + '\n');

console.log(`\n${Object.keys(manifest).length} telefon gorseli yazildi.`);
