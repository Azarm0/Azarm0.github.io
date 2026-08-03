/**
 * Turn whatever an owner sent on WhatsApp into the sized webp set the templates
 * expect.
 *
 *   node scripts/vitrin-foto.mjs                     # every folder, skip current
 *   node scripts/vitrin-foto.mjs bereket-lokantasi   # one customer, by slug
 *   node scripts/vitrin-foto.mjs public/vitrin/x     # one folder, by path
 *   node scripts/vitrin-foto.mjs --force             # re-encode everything
 *
 * RAW INTAKE
 *
 * An owner sends six pictures on WhatsApp called IMG_4821.jpg and "WhatsApp
 * Image 2026-07-31 at 14.22.01.jpeg". Drop them, untouched, in
 * ham/<slug>/ and write ham/<slug>/eslesme.json saying which is which:
 *
 *   { "IMG_4821.jpg": "kapak", "photo_003.png": "galeri-1" }
 *
 * The script then normalises each mapped file into public/vitrin/<slug>/kapak.webp
 * and galeri-N.webp, and the sizing pass below runs on those as usual. Without
 * the mapping it prints what it found and stops. It never picks the cover photo
 * itself: that is the one decision in this pipeline a script cannot make, and
 * guessing it wrong is a wrong page rather than a slow one.
 *
 * ham/ sits at the project root and NOT under public/, because Astro copies
 * public/ to the built site verbatim. Raw phone photos there would publish
 * several megabytes of originals nobody requested, next to the sized webps that
 * exist precisely to avoid that.
 *
 * WHY THIS EXISTS
 *
 * The Vitrin package promises "aynı gün yayında". The step that actually costs
 * the time is not writing the page, it is photographs: an owner sends six
 * pictures straight off a phone, and until now they went into public/ at
 * whatever size they arrived. That is how cinaralti-kahvalti/kapak.webp ended up
 * at 371 KB while usta-nuri-berber/kapak.webp is 30 KB. Same template, same
 * slot, twelve times the bytes, decided by nothing but which photo happened to
 * be dropped in.
 *
 * A shop owner opening the demo on his own phone, on his own connection, is the
 * entire sales pitch. So this is not a tidiness script.
 *
 * WHAT IT DOES
 *
 * For each source image it writes <ad>-<genislik>.webp beside the original at
 * the widths that role is displayed at, never upscaling past the source. The
 * templates build a srcset from those by convention via src/lib/gorsel.ts, so
 * adding a customer stays "drop photos in a folder" with no wiring.
 *
 * The original file stays untouched and stays referenced as the `src` fallback,
 * so a browser that ignores srcset still gets a working page, and a photo this
 * script has never seen still renders.
 *
 * Accepts jpg/jpeg/png/webp in, always writes webp out. EXIF rotation is applied
 * rather than trusted, because phone photos arrive sideways constantly.
 */
import { access, readdir, readFile, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const kok = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const varMi = (yol) =>
  access(yol).then(
    () => true,
    () => false,
  );

/**
 * Widths per role, derived from how each image is actually laid out. Measured
 * from the rendered pages, not guessed: a phone at 375 CSS px with DPR 3 wants
 * about 1030 px for a full-bleed hero and about 490 px for a half-width gallery
 * tile, and photographic detail past that is invisible.
 */
const ROLLER = {
  kapak: { genislikler: [480, 768, 1200, 1600], kalite: 74 },
  galeri: { genislikler: [320, 480, 768], kalite: 76 },
  kart: { genislikler: [400, 800, 1200], kalite: 76 },
};

/**
 * How wide the normalised base file is written at during raw intake.
 *
 * Matches the widest variant of the role and no more. The base is what the
 * templates use as the `src` fallback, so leaving a 12 MP original there means
 * every browser that ignores srcset downloads the whole sensor.
 */
const TABAN_GENISLIK = { kapak: 1600, galeri: 768 };

/** Which role a file plays, by where it sits and what it is called. */
function rolBul(dosyaYolu) {
  const ad = path.basename(dosyaYolu);
  const dizin = path.dirname(dosyaYolu).replace(/\\/g, '/');

  // The og.jpg is generated at its final size by vitrin-kart.mjs, and the
  // -telefon variants are generated at their final sizes by vitrin-telefon.mjs.
  // Both are skipped on purpose rather than unrecognised. Without the -telefon
  // rule this would treat a 4000px-tall scrolling capture as a 16:10 card photo
  // and cut kart-width variants nothing ever requests.
  if (/[\\/]isler$/.test(dizin)) {
    if (ad.endsWith('-og.jpg') || /-telefon(-\d+)?\.webp$/.test(ad)) return 'yoksay';
    return 'kart';
  }
  if (ad.startsWith('kapak.')) return 'kapak';
  if (ad.startsWith('galeri-')) return 'galeri';
  // Print output from vitrin-qr.mjs, sized for A6 paper. Not a photograph and
  // deliberately not resized, but it does sit in this folder.
  if (ad.startsWith('masa-karti.')) return 'yoksay';
  return null;
}

const ZORLA = process.argv.includes('--force');
const hedefler = process.argv.slice(2).filter((a) => !a.startsWith('--'));

async function* gorselleriTara(dizin) {
  let girdiler;
  try {
    girdiler = await readdir(dizin, { withFileTypes: true });
  } catch {
    return;
  }
  for (const girdi of girdiler) {
    const tam = path.join(dizin, girdi.name);
    if (girdi.isDirectory()) {
      // Raw dumps live in ham/ at the project root, but guard the name here too:
      // if one is ever copied under public/ by hand, every WhatsApp filename in
      // it would read as an unrecognised file and fail the run.
      if (girdi.name === 'ham') continue;
      yield* gorselleriTara(tam);
    } else if (/\.(jpe?g|png|webp)$/i.test(girdi.name)) {
      // Skip our own output, or every run would generate variants of variants.
      if (/-\d{3,4}\.webp$/i.test(girdi.name)) continue;
      yield tam;
    }
  }
}

/**
 * Resolve an argument to a folder: a customer slug first, then a path.
 *
 * Exiting nonzero here is the point. Until this existed, `npm run foto -- <slug>`
 * resolved to a directory that does not exist, readdir threw, the generator
 * swallowed it and the process exited 0 having written nothing. The page then
 * built and shipped with the owner's untouched original as its only source,
 * which is the exact problem this script was written to remove, reintroduced
 * with no error anywhere.
 */
async function hedefCoz(arg) {
  const slugYolu = path.join(kok, 'public', 'vitrin', arg);
  if (await varMi(slugYolu)) return slugYolu;

  const yol = path.resolve(kok, arg);
  if (await varMi(yol)) return yol;

  console.error(
    `Bulunamadi: ${arg}\n` +
      `  slug olarak bakildi: ${path.relative(kok, slugYolu).replace(/\\/g, '/')}\n` +
      `  yol olarak bakildi:  ${path.relative(kok, yol).replace(/\\/g, '/')}`,
  );
  process.exit(1);
}

/**
 * Normalise an owner's raw dump into the files the templates expect.
 *
 * EXIF rotation is baked into the pixels here rather than left as a tag, because
 * this output is the `src` fallback. A browser that ignores srcset gets this
 * file, and a tag it chose not to honour would leave the photo on its side.
 */
async function hamIsle(vitrinDizini) {
  const hamDizin = path.join(kok, 'ham', path.basename(vitrinDizini));
  if (!(await varMi(hamDizin))) return;

  const dosyalar = (await readdir(hamDizin)).filter((a) => /\.(jpe?g|png|webp)$/i.test(a));
  if (dosyalar.length === 0) return;

  const eslesmeYolu = path.join(hamDizin, 'eslesme.json');
  let eslesme;
  try {
    eslesme = JSON.parse(await readFile(eslesmeYolu, 'utf8'));
  } catch {
    console.error(`\nEslesme yok: ${path.relative(kok, eslesmeYolu).replace(/\\/g, '/')}`);
    console.error('Hangi fotografin kapak oldugunu bu betik secemez. Bulunanlar:\n');
    for (const ad of dosyalar.sort()) {
      const m = await sharp(path.join(hamDizin, ad)).metadata();
      const dik = m.orientation && m.orientation >= 5;
      const en = dik ? m.height : m.width;
      const boy = dik ? m.width : m.height;
      console.error(
        `  ${ad.padEnd(46)} ${`${en}x${boy}`.padEnd(11)} ${boy > en ? 'dikey ' : 'yatay '} orient=${m.orientation ?? '-'}`,
      );
    }
    console.error('\nSu bicimde bir eslesme.json yazin:');
    console.error('  { "IMG_4821.jpg": "kapak", "photo_003.png": "galeri-1" }');
    process.exit(1);
  }

  const kullanilan = new Set();
  for (const [dosya, rolAdi] of Object.entries(eslesme)) {
    const tur = rolAdi.startsWith('galeri-') ? 'galeri' : rolAdi;
    if (!TABAN_GENISLIK[tur]) {
      console.error(`Gecersiz rol "${rolAdi}" (${dosya}). kapak veya galeri-N olmali.`);
      process.exit(1);
    }

    const kaynakYol = path.join(hamDizin, dosya);
    if (!(await varMi(kaynakYol))) {
      console.error(`eslesme.json ${dosya} diyor ama ham/ icinde yok.`);
      process.exit(1);
    }

    const hedefYol = path.join(vitrinDizini, `${rolAdi}.webp`);
    const kaynakBilgi = await stat(kaynakYol);

    // Same mtime skip the sizing pass uses. Without it every no-argument run
    // rewrites these bases, which bumps their mtime and forces every variant
    // underneath them to be re-encoded for nothing.
    if (!ZORLA) {
      try {
        const mevcut = await stat(hedefYol);
        if (mevcut.mtimeMs >= kaynakBilgi.mtimeMs) {
          kullanilan.add(dosya);
          continue;
        }
      } catch {
        // Not written yet, fall through.
      }
    }

    const cikti = await sharp(await readFile(kaynakYol))
      .rotate() // bake EXIF orientation into the pixels
      .resize({ width: TABAN_GENISLIK[tur], withoutEnlargement: true })
      .webp({ quality: ROLLER[tur].kalite, effort: 6 })
      .toBuffer();

    await writeFile(hedefYol, cikti);
    kullanilan.add(dosya);
    console.log(
      `  ham/${dosya.padEnd(44)} -> ${rolAdi}.webp  ${(kaynakBilgi.size / 1024) | 0} KB -> ${(cikti.length / 1024) | 0} KB`,
    );
  }

  // Not fatal: choosing a subset of what an owner sent is normal. Listing them
  // is, so nobody discovers a forgotten photo after the page is live.
  const artan = dosyalar.filter((a) => !kullanilan.has(a));
  if (artan.length > 0) console.log(`  kullanilmadi: ${artan.join(', ')}`);
}

const taranacak =
  hedefler.length > 0
    ? await Promise.all(hedefler.map(hedefCoz))
    : [path.join(kok, 'public', 'vitrin'), path.join(kok, 'public', 'isler')];

// Raw intake first, so the sizing pass below sees the files it just wrote.
for (const taban of taranacak) {
  const vitrinKok = path.join(kok, 'public', 'vitrin');
  const musteriDizinleri =
    path.resolve(taban) === vitrinKok
      ? (await readdir(taban, { withFileTypes: true }))
          .filter((d) => d.isDirectory())
          .map((d) => path.join(taban, d.name))
      : [taban];

  for (const dizin of musteriDizinleri) await hamIsle(dizin);
}

let yazilan = 0;
let atlanan = 0;
let kaynakToplam = 0;
let ciktiToplam = 0;

/**
 * Which widths exist for each source, keyed by the public URL the templates use.
 * Written to src/data/gorseller.json and read by src/lib/gorsel.ts.
 *
 * This has to be a manifest rather than a convention, because the widths a given
 * photo gets depend on how big it was: an owner's 900 px photo never produces a
 * 1200 variant. Emitting a srcset entry for a file that was never written is a
 * 404 on a customer's page, which is exactly the thing nobody would notice until
 * a prospect did.
 */
const manifest = {};

/**
 * Files sitting in a customer folder that match no role.
 *
 * Until this list existed they were dropped with a bare `continue`: no log, no
 * failure. Someone copies a photo into public/vitrin/<slug>/ under the name the
 * phone gave it, the run reports success, and the photo simply never appears.
 * That belongs in ham/ with a mapping, so say so and fail.
 */
const taninmayan = [];

for (const taban of taranacak) {
  for await (const kaynakYol of gorselleriTara(taban)) {
    const rol = rolBul(kaynakYol);
    if (rol === 'yoksay') continue;
    if (!rol) {
      taninmayan.push(path.relative(kok, kaynakYol).replace(/\\/g, '/'));
      continue;
    }

    const { genislikler, kalite } = ROLLER[rol];
    const dizin = path.dirname(kaynakYol);
    const govde = path.basename(kaynakYol).replace(/\.[^.]+$/, '');

    const kaynak = await readFile(kaynakYol);
    const kaynakBilgi = await stat(kaynakYol);
    const meta = await sharp(kaynak).metadata();
    // A sideways phone photo reports its pre-rotation width, so read the size
    // the way sharp will actually render it.
    const dik = meta.orientation && meta.orientation >= 5;
    const gercekGenislik = dik ? meta.height : meta.width;

    kaynakToplam += kaynak.length;
    let buDosyaCikti = 0;

    for (const genislik of genislikler) {
      // Never upscale. A 900 px source blown up to 1600 is bytes spent on blur.
      if (genislik > gercekGenislik) continue;

      const hedefYol = path.join(dizin, `${govde}-${genislik}.webp`);

      if (!ZORLA) {
        try {
          const mevcut = await stat(hedefYol);
          if (mevcut.mtimeMs >= kaynakBilgi.mtimeMs) {
            atlanan++;
            buDosyaCikti += mevcut.size;
            continue;
          }
        } catch {
          // Not there yet, fall through and write it.
        }
      }

      const cikti = await sharp(kaynak)
        .rotate() // applies EXIF orientation
        .resize({ width: genislik, withoutEnlargement: true })
        .webp({ quality: kalite, effort: 6 })
        .toBuffer();

      await writeFile(hedefYol, cikti);
      buDosyaCikti += cikti.length;
      yazilan++;
    }

    ciktiToplam += buDosyaCikti;

    // Key by the public URL, which is what the templates hold in their data.
    const kamuYolu =
      '/' + path.relative(path.join(kok, 'public'), kaynakYol).replace(/\\/g, '/');
    manifest[kamuYolu] = {
      rol,
      genislikler: genislikler.filter((g) => g <= gercekGenislik),
    };

    const gosterim = path.relative(kok, kaynakYol).replace(/\\/g, '/');
    console.log(
      `${gosterim.padEnd(46)} ${rol.padEnd(7)} ${(kaynak.length / 1024)
        .toFixed(0)
        .padStart(5)} KB -> ${(buDosyaCikti / 1024).toFixed(0).padStart(5)} KB across ${
        genislikler.filter((g) => g <= gercekGenislik).length
      } widths`,
    );
  }
}

// Merge rather than replace. Running this against one customer's folder must not
// wipe every other customer's srcset out of the manifest.
const manifestYolu = path.join(kok, 'src', 'data', 'gorseller.json');
let oncekiManifest = {};
try {
  oncekiManifest = JSON.parse(await readFile(manifestYolu, 'utf8'));
} catch {
  // First run.
}
const birlesik = { ...oncekiManifest, ...manifest };
const sirali = Object.fromEntries(Object.entries(birlesik).sort(([a], [b]) => a.localeCompare(b)));
await writeFile(manifestYolu, JSON.stringify(sirali, null, 2) + '\n');

console.log(
  `\n${yazilan} yazıldı, ${atlanan} atlandı.  ` +
    `kaynak ${(kaynakToplam / 1024).toFixed(0)} KB, varyantlar ${(ciktiToplam / 1024).toFixed(0)} KB`,
);
console.log(
  'Not: kaynak dosyalar silinmedi. Templates still point at them as the src fallback.',
);

if (taninmayan.length > 0) {
  console.error('\nRolu belirsiz dosyalar islenmedi:');
  for (const y of taninmayan) console.error(`  ${y}`);
  console.error(
    '\nBunlar kapak.* veya galeri-N.* degil. Ham fotografsa ham/ icine koyup\n' +
      'eslesme.json ile hangisi oldugunu yazin.',
  );
  process.exit(1);
}
