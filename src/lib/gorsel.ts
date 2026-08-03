import manifest from '../data/gorseller.json';

/**
 * Builds the srcset/sizes pair for an image that scripts/vitrin-foto.mjs has
 * already sized.
 *
 * The widths live in a generated manifest rather than being assumed from the
 * path, because how many variants a photo gets depends on how big the owner's
 * original was. Guessing produces a srcset entry pointing at a file that was
 * never written, which is a 404 on a customer's page that no build step catches.
 *
 * An image missing from the manifest degrades to a plain src. That is the case
 * that matters most: it is what happens the moment someone drops a new photo in
 * and forgets to run the script, and it must render rather than break.
 */

type Rol = 'kapak' | 'galeri' | 'kart' | 'telefon';

type Kayit = { rol: string; genislikler: number[] };

/**
 * How wide each role renders, as the browser needs to know it before layout.
 * Read off the built pages rather than guessed:
 *  - kapak   is full bleed on every breakpoint
 *  - galeri  is a 2-up grid on phones and 4-up from md
 *  - kart    is 1-up on phones, 2-up from sm, inside a max-width shell
 *  - telefon is the hero's phone frame: ~19rem inside the lg screen, ~57vw below
 *    it. The strip is masked and permanently in motion, so the browser is asked
 *    for the frame width and no more.
 */
const OLCULER: Record<Rol, string> = {
  kapak: '100vw',
  galeri: '(min-width: 768px) 23vw, 47vw',
  kart: '(min-width: 1024px) 33rem, (min-width: 640px) 47vw, 92vw',
  telefon: '(min-width: 1024px) 19rem, 57vw',
};

export type GorselNitelikleri = {
  src: string;
  srcset?: string;
  sizes?: string;
};

/**
 * @param olcuGecersizKilma  Overrides the role default when the same file is
 *   used at a different size somewhere. The isler card photo is the live case:
 *   a thumbnail on the homepage grid and a full-width hero on the detail page.
 *   Letting the card's `sizes` apply there would hand a 400 px file to a 1136 px
 *   slot, which is the same bug as shipping the 1600 px one, just visible
 *   instead of slow.
 */
export function gorselNitelikleri(
  src: string,
  olcuGecersizKilma?: string,
): GorselNitelikleri {
  const kayit = (manifest as Record<string, Kayit>)[src];
  if (!kayit || kayit.genislikler.length === 0) return { src };

  const govde = src.replace(/\.[^./]+$/, '');
  const olcu = olcuGecersizKilma ?? OLCULER[kayit.rol as Rol];

  return {
    src,
    srcset: kayit.genislikler.map((g) => `${govde}-${g}.webp ${g}w`).join(', '),
    ...(olcu ? { sizes: olcu } : {}),
  };
}
