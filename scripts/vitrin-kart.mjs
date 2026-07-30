/**
 * Capture the portfolio card and social image for every Vitrin site.
 *
 *   npm run dev                 # in one terminal
 *   node scripts/vitrin-kart.mjs
 *
 * Writes public/isler/<slug>.webp (1200x750, the card in the işler grid) and
 * public/isler/<slug>-og.jpg (1200x630, what WhatsApp and Facebook show). Both
 * paths are what src/pages/isler/[slug].astro already expects, so a new Vitrin
 * customer needs no further wiring.
 *
 * Shot at deviceScaleFactor 2 and downscaled, because a 1x capture of 16px text
 * looks visibly soft once the card is rendered on any modern phone.
 *
 * The "örnek çalışmadır" banner on kurgu pages is deliberately left in frame. It
 * is what the page actually looks like, and cropping it out to make a tidier
 * thumbnail would be quietly dishonest about a business that does not exist.
 */
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer';
import sharp from 'sharp';

import { vitrinler } from '../src/data/vitrin.ts';

const KOK = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const CIKTI = path.join(KOK, 'public', 'isler');
const TABAN = process.env.VITRIN_TABAN ?? 'http://localhost:4321';

const OLCULER = [
  { ad: 'kart', en: 1200, boy: 750, uzanti: 'webp' },
  { ad: 'og', en: 1200, boy: 630, uzanti: 'jpg' },
];

// The two flags are not optional on this machine: without them the page's CDP
// session drops on the first setViewport with "Session closed".
const tarayici = await puppeteer.launch({
  headless: true,
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
});

try {
  await mkdir(CIKTI, { recursive: true });

  for (const vitrin of vitrinler) {
    const sayfa = await tarayici.newPage();

    for (const olcu of OLCULER) {
      await sayfa.setViewport({
        width: olcu.en,
        height: olcu.boy,
        deviceScaleFactor: 2,
      });

      await sayfa.goto(`${TABAN}/${vitrin.slug}`, { waitUntil: 'networkidle0' });

      // Webfonts settle after networkidle, and a capture taken mid-swap shows
      // the fallback face. The açık/kapalı line is written by a script on load,
      // so give that a beat too.
      await sayfa.evaluate(() => document.fonts.ready);
      await new Promise((r) => setTimeout(r, 400));

      const ham = await sayfa.screenshot({ type: 'png' });

      const dosya = path.join(
        CIKTI,
        olcu.ad === 'kart' ? `${vitrin.slug}.webp` : `${vitrin.slug}-og.jpg`,
      );

      const islenmis = sharp(ham).resize(olcu.en, olcu.boy, { fit: 'cover', position: 'top' });
      const veri =
        olcu.uzanti === 'webp'
          ? await islenmis.webp({ quality: 82 }).toBuffer()
          : await islenmis.jpeg({ quality: 84, mozjpeg: true }).toBuffer();

      await writeFile(dosya, veri);
      console.log(`${path.basename(dosya)}  ${olcu.en}x${olcu.boy}  ${(veri.length / 1024).toFixed(0)}KB`);
    }

    await sayfa.close();
  }
} finally {
  await tarayici.close();
}
