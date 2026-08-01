/**
 * Vitrin tier sites.
 *
 * Every Vitrin customer is one entry in this array plus a folder of photos under
 * `public/vitrin/<slug>/`. Nothing else. The route at `src/pages/[vitrin].astro`
 * builds the page, and the existing Pages workflow publishes it. That is what
 * makes "aynı gün yayında" true rather than a promise we quietly break.
 *
 * After adding an entry, three scripts finish the job. None of them need
 * arguments; each takes an optional slug to do one customer:
 *
 *   npm run foto    sizes the owner's photos and writes the srcset manifest
 *   npm run qr      table QR + print-ready A6 masa-karti.pdf/.png
 *   npm run kart    the portfolio thumbnail and social image
 *
 * The QR is in this tier, not held back for Kurumsal, because the rule below is
 * that the ceiling sits at our labour and a generated code costs none. What
 * Kurumsal adds is prices in the menu behind it.
 *
 * WHAT BELONGS IN VITRIN, AND WHY THE SHAPE IS WHAT IT IS
 *
 * The ceiling is drawn at our labour, not at how good the page looks. Anything
 * an owner can hand over in one WhatsApp message is in. Anything that costs us
 * an hour of typing is not. That is why `liste` holds category and service NAMES
 * with no prices: every real Turkish site surveyed (Zübeyir, Perran, Kenan Usta)
 * shows menu categories without a single number, because inflation turns a
 * printed price into a maintenance burden and a liability. Kurumsal is where
 * priced menus, scraped reviews and SEO work live.
 *
 * Three fields exist here that the template builders do not have a slot for, and
 * they came out of reading nine real Turkish esnaf sites:
 *
 *   `ustaAdi`  The customer attaches to the person, not the shop. Salon İmaj has
 *              seven testimonials and "Salim ağabey" appears in four of them.
 *   `tarif`    Nobody navigates by street address. Salon İmaj writes "PTT'nin
 *              olduğu bina, İgdaş ödeme noktası karşısı". A map embed does not
 *              replace this.
 *   `kapaliGunler`  Stated separately and loudly. The single most common reason
 *              anyone opens one of these pages is to find out if you are open.
 */

export type VitrinTur = 'yemek' | 'usta';

export type VitrinSaat = {
  /** Human-readable day span, e.g. "Pazartesi - Cumartesi". */
  gunler: string;
  /** 24h "HH:MM". Fed to openingHoursSpecification for real businesses. */
  acilis: string;
  kapanis: string;
  /** Machine day names for schema. Omit and no schema row is emitted. */
  gunKodlari?: (
    | 'Monday'
    | 'Tuesday'
    | 'Wednesday'
    | 'Thursday'
    | 'Friday'
    | 'Saturday'
    | 'Sunday'
  )[];
};

export type VitrinListe = {
  baslik: string;
  /** Names only. Never prices: see the file header. */
  maddeler: string[];
};

export type VitrinGorsel = {
  /** Path under /vitrin/<slug>/. */
  src: string;
  alt: string;
};

export type VitrinYorum = {
  /** Full name. Initials read as invented, which defeats the point. */
  ad: string;
  metin: string;
};

export type Vitrin = {
  /** Becomes the URL: mevcut.digital/<slug>. Must not collide with a repo name. */
  slug: string;
  tur: VitrinTur;

  isletme: string;
  /** The person behind the counter. Rendered prominently on the usta template. */
  ustaAdi?: string;
  /** Shown as an eyebrow above the name, e.g. "BERBER". */
  kategori: string;
  /** One line under the business name. Under ~60 chars or it wraps badly on 375px. */
  vurgu: string;
  /** "2002 yılından bu güne" style trust signal. Rendered as "<yıl>'den beri". */
  kurulusYili?: number;

  /** Two or three sentences, first person plural, written by a human. */
  hakkinda: string;

  telefon: string;
  /** E.164, digits only, no plus. Used for both tel: and wa.me. */
  telefonE164: string;
  whatsappMesaj: string;
  instagram?: string;

  adres: {
    satirlar: string[];
    /** Landmark directions. The thing people actually navigate by. */
    tarif?: string;
    ilce: string;
    sehir: string;
    /** Google Maps link. No embed: an iframe would ship third-party cookies. */
    haritaUrl?: string;
  };

  saatler: VitrinSaat[];
  /** e.g. "Pazar günleri kapalıyız". Rendered separately and emphasised. */
  kapaliGunler?: string;

  listeBasligi: string;
  liste: VitrinListe[];
  /**
   * The line under the list. Defaults to the "call us for current prices" note.
   *
   * Exists because an esnaf lokantası cooks a different pot every morning. Under
   * a günün yemekleri list the default sentence answers a question nobody asked,
   * while the one people do ask ("is this today's food?") goes unanswered.
   */
  listeNotu?: string;

  kapak: VitrinGorsel;
  galeri: VitrinGorsel[];
  yorumlar: VitrinYorum[];

  seo: {
    /** Under ~43 chars: the layout appends " | <isletme>". */
    baslik: string;
    /** 150 to 160 chars. */
    aciklama: string;
  };

  /**
   * True when the business is invented for demonstration.
   *
   * This flag is load-bearing, not decorative. A kurgu page is served `noindex`
   * and emits NO LocalBusiness JSON-LD. Publishing an indexable page with a
   * schema-marked address, telephone and opening hours for a business that does
   * not exist would be feeding Google a fabricated business record. The template
   * supports the full schema; a real customer switches it on by simply not
   * carrying this flag.
   */
  kurgu?: boolean;

  /**
   * Overrides which section the table QR opens. See src/lib/vitrinHedef.ts.
   *
   * The default comes from `tur` and is right for every customer so far. This is
   * here for the one whose page is built around something else.
   */
  qrBolum?: string;
};

export const vitrinler: Vitrin[] = [
  {
    slug: 'bereket-lokantasi',
    tur: 'yemek',
    isletme: 'Bereket Lokantası',
    kategori: 'Esnaf Lokantası',
    vurgu: 'Her sabah taze pişer, öğlene kalmaz',
    kurulusYili: 1992,
    hakkinda:
      'Bereket, Hikmet Usta’nın babasından devraldığı bir esnaf lokantası. 1992’den bu yana aynı köşedeyiz. Sabah altıda ocak yanar, tencereler öğlene yetişsin diye erken kurulur. Yemeklerimiz her gün değişir; ne pişerse tezgâhta durur, bitince o gün için biter. Bir kişilik de veririz, tencereyle de. Mahallenin esnafı öğle arasında burada yer, biz de ona göre hızlı çıkarırız.',
    telefon: '0212 555 26 40',
    telefonE164: '902125552640',
    whatsappMesaj: 'Merhaba, bugün hangi yemekler var?',
    adres: {
      satirlar: ['Adnan Kahveci Mahallesi, Pazar Sokak'],
      tarif:
        'PTT’nin arka sokağı. Salı pazarının kurulduğu yerin köşesindeyiz, kepenkte turuncu tabela var.',
      ilce: 'Bahçelievler',
      sehir: 'İstanbul',
    },
    saatler: [
      {
        gunler: 'Pazartesi - Cuma',
        acilis: '08:00',
        kapanis: '20:00',
        gunKodlari: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      },
      {
        gunler: 'Cumartesi',
        acilis: '08:00',
        kapanis: '18:00',
        gunKodlari: ['Saturday'],
      },
    ],
    kapaliGunler: 'Pazar günleri kapalıyız.',
    listeBasligi: 'Tencerede ne varsa',
    listeNotu:
      'Yemekler her gün değişir, buradakiler sürekli yaptıklarımızdır. Bugün ne olduğunu sormak için arayın veya WhatsApp’tan yazın.',
    liste: [
      {
        baslik: 'Çorbalar',
        maddeler: ['Mercimek', 'Ezogelin', 'İşkembe (pazartesi ve perşembe)', 'Yayla'],
      },
      {
        baslik: 'Sulu Yemekler',
        maddeler: ['Kuru fasulye', 'Nohut', 'Etli türlü', 'Karnıyarık', 'Taze fasulye', 'Barbunya'],
      },
      {
        baslik: 'Yanında',
        maddeler: ['Pirinç pilavı', 'Bulgur pilavı', 'Cacık', 'Turşu', 'Mevsim salata'],
      },
      {
        baslik: 'Tatlı ve İçecek',
        maddeler: ['Sütlaç', 'Kemalpaşa', 'Revani', 'Ayran', 'Şalgam'],
      },
    ],
    kapak: {
      src: '/vitrin/bereket-lokantasi/kapak.webp',
      alt: 'Üstten çekilmiş lokanta masası: bakır sahanda soğan dolması, iki kâse işkembe çorbası, çiğ köfte ve sıcak pide ekmeği',
    },
    galeri: [
      {
        src: '/vitrin/bereket-lokantasi/galeri-1.webp',
        alt: 'Beyaz duvarlı lokanta salonu, örtülü masalar ve pencere önünde dizili sandalyeler',
      },
      {
        src: '/vitrin/bereket-lokantasi/galeri-2.webp',
        alt: 'Masada lahmacun, ızgara sucuk, kelle paça ve közlenmiş biber tabakları',
      },
      {
        src: '/vitrin/bereket-lokantasi/galeri-3.webp',
        alt: 'Zeytinyağlı dolma, bulgur pilavı ve közlenmiş patlıcan tabaklarıyla kurulmuş sofra',
      },
      {
        src: '/vitrin/bereket-lokantasi/galeri-4.webp',
        alt: 'Lokantanın açık mutfağı: tezgâhta tencereler, arkada ocak başında çalışan aşçılar',
      },
    ],
    // The owner sent no reviews and we do not write them. The section simply
    // does not render, which is the behaviour a real same-day onboarding needs.
    yorumlar: [],
    seo: {
      baslik: 'Bahçelievler Esnaf Lokantası',
      aciklama:
        'Bahçelievler’de 1992’den beri esnaf lokantası. Her gün değişen sulu yemek, çorba ve ev tatlıları. Çalışma saatleri, yol tarifi ve tek dokunuşla arama.',
    },
    kurgu: true,
  },
  {
    slug: 'cinaralti-kahvalti',
    tur: 'yemek',
    isletme: 'Çınaraltı Kahvaltı Salonu',
    kategori: 'Kahvaltı Salonu',
    vurgu: 'Sabahın en güzel hâli, çınarın altında',
    kurulusYili: 1998,
    hakkinda:
      'Çınaraltı, adını kapımızın önündeki çınardan alıyor. 1998’den bu yana aynı sokakta, aynı tezgâhta kahvaltı veriyoruz. Peynirimiz Ezine’den, balımız Kars’tan geliyor; hamur işini her sabah burada açıyoruz. Serpme kahvaltımız iki kişilikten başlıyor, ama tek başına gelip çayını içen de bizim misafirimiz.',
    telefon: '0212 555 40 12',
    telefonE164: '902125554012',
    whatsappMesaj: 'Merhaba, kahvaltı için yer ayırtmak istiyorum.',
    instagram: 'https://instagram.com/cinaraltikahvalti',
    adres: {
      satirlar: ['Yıldız Sokak No: 14/A'],
      tarif: 'Muhtarlığın olduğu sokak, eczanenin tam karşısı. Kapının önünde büyük çınar var.',
      ilce: 'Bahçelievler',
      sehir: 'İstanbul',
    },
    saatler: [
      {
        gunler: 'Pazartesi - Cuma',
        acilis: '07:00',
        kapanis: '16:00',
        gunKodlari: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      },
      {
        gunler: 'Cumartesi - Pazar',
        acilis: '08:00',
        kapanis: '17:00',
        gunKodlari: ['Saturday', 'Sunday'],
      },
    ],
    listeBasligi: 'Sofrada neler var',
    liste: [
      {
        baslik: 'Serpme Kahvaltı',
        maddeler: [
          'Ezine beyaz peynir',
          'Eski kaşar',
          'Kars balı ve kaymak',
          'Köy tereyağı',
          'Zeytin çeşitleri',
          'Mevsim yeşillikleri',
        ],
      },
      {
        baslik: 'Tavadan',
        maddeler: ['Sucuklu yumurta', 'Menemen', 'Pastırmalı yumurta', 'Kaygana'],
      },
      {
        baslik: 'Fırından',
        maddeler: ['Sıcak açma', 'Susamlı simit', 'Tahinli çörek', 'Peynirli börek'],
      },
      {
        baslik: 'İçecekler',
        maddeler: ['Demlik çay', 'Türk kahvesi', 'Taze sıkılmış portakal suyu', 'Ihlamur'],
      },
    ],
    kapak: {
      src: '/vitrin/cinaralti-kahvalti/kapak.webp',
      alt: 'Ahşap masada bakır sahan içinde sucuklu yumurta, sepette simit ve ekmek, yanında zeytin ve acuka',
    },
    galeri: [
      {
        src: '/vitrin/cinaralti-kahvalti/galeri-1.webp',
        alt: 'Üstten çekilmiş serpme kahvaltı sofrası: peynir tabağı, sigara böreği, zeytin, reçel ve yumurta',
      },
      {
        src: '/vitrin/cinaralti-kahvalti/galeri-2.webp',
        alt: 'Beyaz tabakta peynir, domates ve zeytin; arkasında tahta tepside ekmek ve bakır cezve',
      },
      {
        src: '/vitrin/cinaralti-kahvalti/galeri-3.webp',
        alt: 'İnce belli bardakta demlenmiş çay ve tabağında kaşığı',
      },
      {
        src: '/vitrin/cinaralti-kahvalti/galeri-4.webp',
        alt: 'Kilim örtülü masada kahvaltı tabağı, tost, çay ve Türk kahvesi',
      },
    ],
    yorumlar: [
      {
        ad: 'Selin Akgün',
        metin:
          'Kahvaltıya gidip de acele ettirilmediğim tek yer. Çayı bitince kimse sormadan yenisi geliyor.',
      },
      {
        ad: 'Murat Yıldırım',
        metin:
          'Peynirin tadı çocukluğumu hatırlattı. Serpmeyi iki kişi bitiremedik, abartmıyorum.',
      },
      {
        ad: 'Hatice Demirci',
        metin: 'Sokakta çınarın altında oturup kahvaltı etmek başka bir şey. Yazın mutlaka gidin.',
      },
    ],
    seo: {
      baslik: 'Bahçelievler Kahvaltı Salonu',
      aciklama:
        'Bahçelievler’de 1998’den beri serpme kahvaltı. Ezine peyniri, Kars balı, her sabah açılan hamur işi. Çalışma saatleri, adres ve tek dokunuşla arama.',
    },
    kurgu: true,
  },
  {
    slug: 'usta-nuri-berber',
    tur: 'usta',
    isletme: 'Usta Nuri Erkek Kuaförü',
    ustaAdi: 'Nuri Usta',
    kategori: 'Erkek Kuaförü',
    vurgu: 'Otuz yıldır aynı makas, aynı özen',
    kurulusYili: 1995,
    hakkinda:
      'Nuri Usta 1995’ten bu yana bu dükkânda tıraş yapıyor. Randevu ile çalışıyoruz. Böylece koltuktaki müşteriye acele ettirmeden bakabiliyoruz, gelen de kapıda yarım saat oyalanmıyor. Ustura tıraşı, sakal düzeltme ve klasik erkek kesimi; işin özü değişmedi, sadece ekipman yenilendi.',
    telefon: '0212 555 18 34',
    telefonE164: '902125551834',
    whatsappMesaj: 'Merhaba, tıraş için randevu almak istiyorum.',
    instagram: 'https://instagram.com/ustanuriberber',
    adres: {
      satirlar: ['Menekşe Caddesi No: 27'],
      tarif: 'PTT’nin yanındaki pasajın girişi, kırtasiyenin üst katı.',
      ilce: 'Bahçelievler',
      sehir: 'İstanbul',
    },
    saatler: [
      {
        gunler: 'Pazartesi - Cumartesi',
        acilis: '09:00',
        kapanis: '20:00',
        gunKodlari: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      },
    ],
    kapaliGunler: 'Pazar günleri kapalıyız.',
    listeBasligi: 'Hizmetlerimiz',
    liste: [
      {
        baslik: 'Saç',
        maddeler: ['Klasik erkek kesimi', 'Makine kesimi', 'Çocuk tıraşı', 'Fön ve şekillendirme'],
      },
      {
        baslik: 'Sakal',
        maddeler: ['Ustura tıraşı', 'Sakal kesimi ve düzeltme', 'Sıcak havlu bakımı'],
      },
      {
        baslik: 'Bakım',
        maddeler: ['Yüz maskesi', 'Kaş alma', 'Ağda'],
      },
    ],
    kapak: {
      src: '/vitrin/usta-nuri-berber/kapak.webp',
      alt: 'Berber koltuğunda başı geriye yaslanmış müşterinin sakalı makasla düzeltiliyor',
    },
    galeri: [
      {
        src: '/vitrin/usta-nuri-berber/galeri-1.webp',
        alt: 'Dükkânın ahşap kepenklerinden içeri vuran gün ışığı ve pencere önündeki berber koltuğu',
      },
      {
        src: '/vitrin/usta-nuri-berber/galeri-2.webp',
        alt: 'Tarak ve makasla yapılan klasik erkek saç kesimi',
      },
      {
        src: '/vitrin/usta-nuri-berber/galeri-3.webp',
        alt: 'Tuğla duvarlı dükkânda sarkıt lambaların altında sıralanmış üç berber koltuğu',
      },
      {
        src: '/vitrin/usta-nuri-berber/galeri-4.webp',
        alt: 'Akşam saatlerinde dükkânın aynalı tezgâhı ve deri berber koltukları',
      },
    ],
    yorumlar: [
      {
        ad: 'Emre Şahin',
        metin:
          'On iki senedir Nuri Usta’ya gidiyorum. Ne istediğimi söylemeye gerek kalmıyor, oturuyorum yeterli.',
      },
      {
        ad: 'Kadir Öztürk',
        metin: 'Ustura tıraşını hâlâ düzgün yapan kaç kişi kaldı bilmiyorum. Nuri Usta onlardan biri.',
      },
      {
        ad: 'Bora Çelik',
        metin:
          'Randevu ile çalışması çok iyi. Girip yarım saat sıra beklemiyorsun, saatinde giriyorsun.',
      },
    ],
    seo: {
      baslik: 'Bahçelievler Erkek Kuaförü',
      aciklama:
        'Bahçelievler’de 1995’ten beri Nuri Usta. Ustura tıraşı, sakal düzeltme ve klasik erkek kesimi. Randevu ile çalışıyoruz. Çalışma saatleri ve tek dokunuşla arama.',
    },
    kurgu: true,
  },
];
