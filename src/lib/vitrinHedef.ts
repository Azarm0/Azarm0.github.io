import type { Vitrin, VitrinTur } from '../data/vitrin';

/**
 * Where a table QR actually sends someone, and the section ids that make it land.
 *
 * WHY THIS IS ONE FILE AND NOT A STRING IN THREE PLACES
 *
 * The printed card says "Menümüz için karekodu okutun", and the sales script
 * Kadirhan reads from says "karekodu okutunca menünüz telefonda açılıyor". The
 * QR used to encode the page root, so scanning at a table opened the hero photo
 * and the menu was two or three swipes further down. The card was making a
 * promise the code did not keep, and nothing could catch it: the SVG rendered,
 * the PDF rendered, the card looked finished.
 *
 * So the fragment lives here, the templates take their section id from the same
 * constant, and the two cannot drift apart. Renaming a section without moving
 * the QR is now a type error rather than a wasted print run.
 */

export const VITRIN_TABAN = 'https://mevcut.digital';

/**
 * The section a scan should open, per template.
 *
 * `yemek` goes to the menu: someone holding a phone over a table card wants the
 * dish list. `usta` goes to services, because a berber's equivalent question is
 * what you do and what it takes, and the appointment button sits right under it.
 */
export const QR_BOLUM: Record<VitrinTur, string> = {
  yemek: 'menu',
  usta: 'hizmetler',
};

/** The section id for a Vitrin, honouring a per-customer override. */
export function vitrinBolum(vitrin: Pick<Vitrin, 'tur' | 'qrBolum'>): string {
  return vitrin.qrBolum ?? QR_BOLUM[vitrin.tur];
}

/**
 * What the QR encodes: canonical trailing-slash URL plus the section fragment.
 *
 * The slash is not cosmetic. Without it the site 301s, and a redirect on a scan
 * is a visible pause on someone's phone while they are standing at a table.
 */
export function vitrinQrUrl(vitrin: Pick<Vitrin, 'slug' | 'tur' | 'qrBolum'>): string {
  return `${VITRIN_TABAN}/${vitrin.slug}/#${vitrinBolum(vitrin)}`;
}

/**
 * What gets printed under the code, for anyone typing it by hand.
 *
 * Deliberately fragment-free. "mevcut.digital/bereket-lokantasi/#menu" in print
 * is noise to read out loud and the page works without it; the fragment is the
 * scanner's business, not the reader's.
 */
export function vitrinKisaUrl(vitrin: Pick<Vitrin, 'slug'>): string {
  return `mevcut.digital/${vitrin.slug}`;
}
