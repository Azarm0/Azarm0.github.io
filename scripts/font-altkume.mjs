/**
 * Subset Inter down to the characters Turkish actually uses.
 *
 *   node scripts/font-altkume.mjs
 *
 * Writes src/fonts/inter-tr-<weight>.woff2 and inter-tr-ext-<weight>.woff2,
 * which src/styles/global.css and src/styles/vitrin.css both @font-face
 * against. Vite fingerprints them from there, so nothing else needs wiring.
 *
 * WHY THIS EXISTS
 *
 * Inter shipped as @fontsource-variable/inter cost 133 KB across two subsets on
 * every page of this site, more than every image on the homepage combined. A
 * variable font carries the whole 100-900 weight axis; this site renders two
 * weights. Moving to fontsource's static subsets barely helped, because Inter's
 * latin-ext file is 35 KB per weight on its own: it covers Polish, Czech,
 * Romanian, Welsh and the rest of Europe, and Turkish needs five letters and a
 * lira sign out of all that.
 *
 * WHY THERE ARE STILL TWO FILES PER WEIGHT
 *
 * Fontsource splits along Google's unicode ranges and the two files share no
 * glyphs, so neither one can be subset alone. The split is kept in the output
 * because it costs nothing: the ext face carries six glyphs and lands near 1 KB.
 *
 * Worth knowing, because it is not where you would guess: ı (U+0131) lives in
 * the *latin* file while İ (U+0130) lives in *latin-ext*. Turkish dotted and
 * dotless i are split across the two.
 *
 * WHY THE SET IS DEFINED BY RULE, NOT BY SCANNING THE COPY
 *
 * Subsetting to exactly today's glyphs works until the first Vitrin customer
 * whose shop name has a letter nobody used before, and then it fails as tofu
 * boxes in production with no build error. So the set below covers what a
 * Turkish small business page can plausibly contain.
 *
 * Rerun when Inter is upgraded. Deliberately not part of `npm run build`: the
 * output is committed, deterministic, and changes roughly never.
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import subsetFont from 'subset-font';

const kok = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const cikti = path.join(kok, 'src', 'fonts');
const kaynakDizin = (paket) => path.join(kok, 'node_modules', '@fontsource', paket, 'files');

/**
 * Families and weights that actually render, verified against computed styles
 * rather than guessed.
 *
 * Fraunces and Oswald are the Vitrin display faces, one per template. They are
 * here for the same reason Inter is: Fraunces latin-600 alone is 17.7 KB and
 * latin-ext another 16.9 KB, for headings on a page whose whole job is to open
 * fast on a shop owner's phone.
 */
const AILELER = [
  { paket: 'inter', kisa: 'inter', agirliklar: [400, 600] },
  { paket: 'fraunces', kisa: 'fraunces', agirliklar: [600] },
  { paket: 'oswald', kisa: 'oswald', agirliklar: [500] },
];

const aralik = (bas, son) =>
  Array.from({ length: son - bas + 1 }, (_, i) => String.fromCodePoint(bas + i)).join('');

const kumeler = {
  // Everything in Google's "latin" range that this site can use. Note ı, the
  // dotless i, is here rather than in ext.
  latin: [
    aralik(0x20, 0x7e), // printable ASCII
    aralik(0xa0, 0xff), // Latin-1: ç ö ü â î û and capitals, plus · and °
    'ı',
    '‘’“”', // curly quotes; site.ts uses ’ in every "WhatsApp’tan"
    '…–•', // ellipsis, en dash, bullet. No em dash: banned from this site's copy.
  ].join(''),

  // Google's "latin-ext" range, cut to the six glyphs Turkish needs.
  'latin-ext': 'ğĞİşŞ₺',
};

/**
 * Emitted into the CSS so the browser knows which file serves which character.
 * Must stay in sync with `kumeler` above.
 */
const araliklar = {
  latin:
    'U+0000-00FF, U+0131, U+2018-201D, U+2013, U+2022, U+2026',
  'latin-ext': 'U+011E-011F, U+0130, U+015E-015F, U+20BA',
};

await mkdir(cikti, { recursive: true });

let once = 0;
let sonra = 0;

for (const aile of AILELER) {
  for (const agirlik of aile.agirliklar) {
    for (const [altKume, karakterler] of Object.entries(kumeler)) {
      const kaynakYol = path.join(
        kaynakDizin(aile.paket),
        `${aile.paket}-${altKume}-${agirlik}-normal.woff2`,
      );
      const kaynak = await readFile(kaynakYol);

      const sonuc = await subsetFont(kaynak, karakterler, { targetFormat: 'woff2' });

      // A subset that lost glyphs it was asked for is worse than no subset: it
      // ships tofu. harfbuzz drops silently, so treat a suspiciously tiny
      // result as a failure rather than writing it.
      if (sonuc.length < 500) {
        throw new Error(
          `${aile.paket}-${altKume}-${agirlik} subset came back at ${sonuc.length} bytes, which ` +
            `means the source does not contain the requested glyphs. Check the unicode ranges.`,
        );
      }

      const ek = altKume === 'latin' ? '' : '-ext';
      const ad = `${aile.kisa}-tr${ek}-${agirlik}.woff2`;
      await writeFile(path.join(cikti, ad), sonuc);

      once += kaynak.length;
      sonra += sonuc.length;
      console.log(
        `${ad.padEnd(26)} ${(sonuc.length / 1024).toFixed(1).padStart(6)} KB` +
          `   (kaynak ${(kaynak.length / 1024).toFixed(1)} KB)`,
      );
    }
  }
}

console.log(`\nunicode-range for global.css / vitrin.css:`);
for (const [altKume, aralikMetni] of Object.entries(araliklar)) {
  console.log(`  ${altKume.padEnd(10)} ${aralikMetni}`);
}
console.log(`\ntoplam: ${(once / 1024).toFixed(1)} KB -> ${(sonra / 1024).toFixed(1)} KB`);
