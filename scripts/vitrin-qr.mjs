/**
 * Print-ready table card and bare QR for every Vitrin customer.
 *
 *   node scripts/vitrin-qr.mjs                 # everyone
 *   node scripts/vitrin-qr.mjs cinaralti-kahvalti
 *
 * Writes, per customer:
 *   public/vitrin/<slug>/qr.svg          bare code, vector, for anyone's designer
 *   public/vitrin/<slug>/masa-karti.pdf  A6 card, ready to hand to a print shop
 *
 * WHY THIS IS IN VITRIN AND NOT ONLY KURUMSAL
 *
 * The rule this package is built on (see the header of src/data/vitrin.ts) is
 * that the ceiling sits at OUR labour, not at how good the thing looks. A QR
 * costs no labour: the page already exists, the code is generated, the card is
 * a template. Charging for it as an upgrade would be drawing the line somewhere
 * other than where the rule says.
 *
 * What still separates Kurumsal is the menu behind the code. Vitrin lists dish
 * names with no prices, deliberately, because a printed price is stale within a
 * month under inflation. Priced menus stay a Kurumsal feature.
 *
 * DESIGN NOTES THAT ARE NOT ARBITRARY
 *
 * - Error correction is 'H' (30% recoverable). This card lives on a table in a
 *   lokanta and will get grease, scratches and a corner torn off. 'M' is the
 *   usual default and is the wrong default here.
 * - The card is cream in both templates even though the usta site is near-black.
 *   A dark A6 card is a flooded ink area: it costs more at the print shop, it
 *   scuffs white at the folds, and cheap stock buckles. The shop's identity is
 *   carried by the display face and the accent rule instead.
 * - The usta accent is darkened from the site's brass (#c08a4b) because brass on
 *   cream is a contrast failure on paper, where there is no backlight.
 * - The QR encodes the canonical trailing-slash URL plus the section fragment,
 *   built by src/lib/vitrinHedef.ts. Without the slash the site 301s, and a
 *   redirect on a scan is a visible pause on someone's phone. Without the
 *   fragment the scan opens the hero photo, which is not what the card promises.
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import QRCode from 'qrcode';
import puppeteer from 'puppeteer';
import sharp from 'sharp';
import jsQR from 'jsqr';

import { vitrinler } from '../src/data/vitrin.ts';
import { vitrinKisaUrl, vitrinQrUrl } from '../src/lib/vitrinHedef.ts';

const kok = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const secilen = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const hedefler =
  secilen.length > 0 ? vitrinler.filter((v) => secilen.includes(v.slug)) : vitrinler;

if (hedefler.length === 0) {
  console.error(`Eşleşen vitrin yok: ${secilen.join(', ')}`);
  process.exit(1);
}

const SUNUM = {
  yemek: {
    font: 'Fraunces',
    dosya: 'fraunces-tr-600.woff2',
    agirlik: 600,
    accent: '#a6472e',
    cagri: 'Menümüz için karekodu okutun',
  },
  usta: {
    font: 'Oswald',
    dosya: 'oswald-tr-500.woff2',
    agirlik: 500,
    // Darkened from the site's #c08a4b: brass on cream fails on paper.
    accent: '#8a5f2e',
    cagri: 'Hizmetler ve randevu için karekodu okutun',
  },
};

/**
 * Rasterise the generated code and read it back with a real decoder.
 *
 * This is not belt-and-braces. A QR that encodes the wrong string looks exactly
 * like one that encodes the right string, and the failure surfaces after a print
 * run, in a shop, in front of a customer. Nothing else in this pipeline can
 * catch it: the SVG renders, the PDF renders, the card looks finished.
 */
async function karekoduDogrula(qrSvg, beklenen) {
  const { data, info } = await sharp(Buffer.from(qrSvg))
    .resize({ width: 512, kernel: 'nearest' })
    .flatten({ background: '#ffffff' })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const okunan = jsQR(new Uint8ClampedArray(data), info.width, info.height);

  if (!okunan) throw new Error(`Karekod okunamadı: ${beklenen}`);
  if (okunan.data !== beklenen) {
    throw new Error(`Karekod yanlış adrese gidiyor.\n  beklenen: ${beklenen}\n  okunan:   ${okunan.data}`);
  }
  return okunan.data;
}

const fontOnbellek = new Map();
async function fontVeri(dosya) {
  if (!fontOnbellek.has(dosya)) {
    const b = await readFile(path.join(kok, 'src', 'fonts', dosya));
    fontOnbellek.set(dosya, b.toString('base64'));
  }
  return fontOnbellek.get(dosya);
}

function kartHtml({ isletme, kategori, qrSvg, sunum, fontB64, kisaUrl }) {
  return `<!doctype html><html lang="tr"><head><meta charset="utf-8">
<style>
  @font-face {
    font-family: '${sunum.font}';
    font-weight: ${sunum.agirlik};
    src: url(data:font/woff2;base64,${fontB64}) format('woff2');
  }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { width: 105mm; height: 148mm; }
  body {
    background: #fbf7f0;
    color: #2c211a;
    font-family: '${sunum.font}', Georgia, serif;
    /* Both faces are subset at a single weight, so ask for that weight rather
       than relying on CSS to match 400 against it. Georgia is the fallback only
       if the embedded font fails to decode. */
    font-weight: ${sunum.agirlik};
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    padding: 12mm 9mm 9mm;
    text-align: center;
    -webkit-font-smoothing: antialiased;
  }
  .kategori {
    font-size: 3mm;
    letter-spacing: .32em;
    text-transform: uppercase;
    color: ${sunum.accent};
  }
  .isletme {
    margin-top: 3mm;
    font-size: 8.5mm;
    line-height: 1.1;
    font-weight: ${sunum.agirlik};
  }
  .cizgi { width: 14mm; height: .6mm; background: ${sunum.accent}; margin: 5mm auto 0; }
  /* The quiet zone is part of the code. Without the white margin a scanner on a
     patterned tablecloth fails, which is the whole card wasted. */
  .kod { background: #fff; padding: 4mm; border-radius: 1.5mm; }
  .kod svg { display: block; width: 52mm; height: 52mm; }
  .cagri { font-size: 4mm; line-height: 1.35; max-width: 70mm; }
  .adres { font-size: 3.1mm; color: #6b5b4e; letter-spacing: .04em; }
</style></head><body>
  <div>
    <p class="kategori">${kategori}</p>
    <h1 class="isletme">${isletme}</h1>
    <div class="cizgi"></div>
  </div>
  <div class="kod">${qrSvg}</div>
  <div>
    <p class="cagri">${sunum.cagri}</p>
    <p class="adres" style="margin-top:3mm">${kisaUrl}</p>
  </div>
</body></html>`;
}

// Same two flags as scripts/vitrin-kart.mjs, and for the same reason: without
// them the CDP session drops on this machine. A page is opened per card rather
// than reused, which also avoids "Requesting main frame too early".
const tarayici = await puppeteer.launch({
  headless: true,
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
});

for (const vitrin of hedefler) {
  const sayfa = await tarayici.newPage();
  const sunum = SUNUM[vitrin.tur];
  const url = vitrinQrUrl(vitrin);
  const dizin = path.join(kok, 'public', 'vitrin', vitrin.slug);
  await mkdir(dizin, { recursive: true });

  const qrSvg = await QRCode.toString(url, {
    type: 'svg',
    errorCorrectionLevel: 'H',
    margin: 0,
    color: { dark: '#000000', light: '#ffffff' },
  });

  const dogrulanan = await karekoduDogrula(qrSvg, url);
  await writeFile(path.join(dizin, 'qr.svg'), qrSvg);

  const html = kartHtml({
    isletme: vitrin.isletme,
    kategori: vitrin.kategori,
    qrSvg,
    sunum,
    fontB64: await fontVeri(sunum.dosya),
    kisaUrl: vitrinKisaUrl(vitrin),
  });

  await sayfa.setContent(html, { waitUntil: 'load' });
  await sayfa.evaluateHandle('document.fonts.ready');

  const pdf = await sayfa.pdf({
    width: '105mm',
    height: '148mm',
    printBackground: true,
    pageRanges: '1',
  });
  await writeFile(path.join(dizin, 'masa-karti.pdf'), pdf);

  // PNG alongside the PDF because the whole business runs on WhatsApp, and a
  // PDF arrives there as a file an owner has to open while a picture just shows.
  await sayfa.setViewport({ width: 397, height: 559, deviceScaleFactor: 2 });
  const png = await sayfa.screenshot({ type: 'png' });
  await writeFile(path.join(dizin, 'masa-karti.png'), png);
  await sayfa.close();

  console.log(
    `${vitrin.slug.padEnd(22)} qr.svg ${(qrSvg.length / 1024).toFixed(1)} KB` +
      `  pdf ${(pdf.length / 1024).toFixed(1)} KB` +
      `  png ${(png.length / 1024).toFixed(1)} KB` +
      `  okundu -> ${dogrulanan}`,
  );
}

await tarayici.close();
console.log('\nKartlar A6 (105x148mm). Matbaaya bu haliyle verilebilir.');
