/**
 * Case studies. Adding a new client means one entry in this array.
 *
 * IMPORTANT: every site here is an unsolicited concept study. No business has
 * commissioned, paid for, or approved these. Copy must stay in "konsept çalışma"
 * language. Never write "müşterimiz" or "referansımız" for an entry whose
 * `izinli` flag is false.
 */

export type Proje = {
  slug: string;
  isletme: string;
  sektor: string;
  sehir: string;
  baslik: string;
  ozet: string;
  /** Under 43 chars so the built <title> stays inside Google's ~60 char cut-off. */
  seoBaslik: string;
  /** Aim for 150 to 160 chars. Shorter wastes the SERP snippet. */
  seoAciklama: string;
  /** Shown on the detail page: the owner-facing reason this build exists. */
  hikaye: string[];
  /** Owner-facing capabilities, not tech features. */
  ozellikler: string[];
  /** Technical notes, kept short and secondary. */
  teknik: string;
  demoUrl: string;
  gorsel: string;
  gorselAlt: string;
  paket: 'Vitrin' | 'Kurumsal' | 'Özel';
  /** True only once the business has given written permission to be featured. */
  izinli: boolean;
  /**
   * True when the business itself is invented rather than a real one we built
   * for unasked. Every other entry is a real İstanbul business with real
   * scraped reviews, so a fictional one has to say so — otherwise the visible
   * disclaimer ("bu işletmelerle henüz bir anlaşmamız bulunmuyor") reads as a
   * claim that this shop exists and simply has not signed yet.
   */
  kurgu?: boolean;
};

export const projeler: Proje[] = [
  {
    slug: 'sarihan-zeytinburnu',
    isletme: 'Sarıhan İşkembe Zeytinburnu',
    sektor: 'Lokanta',
    sehir: 'Zeytinburnu, İstanbul',
    baslik: 'Zeytinburnu’nu arayan, Zeytinburnu’nu buluyor',
    ozet:
      'Çok şubeli bir lokantanın tek bir şubesi için hazırlanan, o mahalleye konuşan bağımsız sayfa.',
    seoBaslik: 'Şubeye Özel Lokanta Web Sitesi',
    seoAciklama:
      'Çok şubeli işletmeler için konsept çalışma: her şubenin kendi adresi, saati ve yorumlarıyla ayrı sayfası. Zeytinburnu şubesi örneği üzerinden anlattık.',
    hikaye: [
      'Çok şubeli işletmelerde herkes aynı şeyi yapıyor: tek bir site, içinde küçük bir şubeler listesi. Ama Zeytinburnu’ndan arayan müşteri Zeytinburnu’nun saatini ve adresini arıyor, genel merkezin numarasını değil.',
      'Bu konsept çalışmada şubeye kendi sayfasını verdik. Kendi adresi, kendi çalışma saatleri, o şubeye yazılmış yorumlar. Google’da “Zeytinburnu işkembe” diye arayan kişi doğrudan buraya düşüyor.',
      'Marka dili ortak kalıyor. Sayfa ise mahalleye ait.',
    ],
    ozellikler: [
      'Şubeye özel adres, saat ve telefon',
      'Bölgesel aramalar için hazırlanmış içerik',
      'Menü ve öne çıkan tabaklar',
      'Google yorumları bölümü',
      'Mobilde tek dokunuşla arama',
    ],
    teknik: 'Sayfa neredeyse anında açılıyor, yükleme beklemesi yok.',
    demoUrl: 'https://mevcut.digital/sarihan-zeytinburnu/',
    gorsel: '/isler/sarihan-zeytinburnu.webp',
    gorselAlt: 'Sarıhan İşkembe Zeytinburnu konsept sitesinin açılış ekranı',
    paket: 'Kurumsal',
    izinli: false,
  },
  {
    slug: 'mikron-teknik',
    isletme: 'Mikron Teknik Servis',
    sektor: 'Telefon Tamiri',
    sehir: 'Bahçelievler, İstanbul',
    baslik: 'Fiyatı soran müşteri, cevabı sayfada buluyor',
    ozet:
      'Cihazını ve arızasını seçen müşteri fiyatı ve süreyi anında görüyor. Bıraktığı cihazın durumunu da koduyla takip ediyor.',
    seoBaslik: 'Telefon Tamiri Web Sitesi',
    seoAciklama:
      'Telefon tamircisi için konsept çalışma: cihaz ve arıza seçilince fiyat anında çıkıyor, bırakılan cihaz takip koduyla izleniyor. Kurgusal örnek işletme.',
    hikaye: [
      'Telefon tamircisine gelen ilk soru her zaman aynı: “ekran kaç para?” Bu soruya telefonda cevap vermek günde kırk kez tekrar eden bir iş, ve soranın çoğu fiyatı duyunca kapatıyor.',
      'Bu konsept çalışmada cevabı sayfaya taşıdık. Müşteri cihazını, arızasını ve parça tercihini seçiyor; tahmini fiyatı, süresini ve garanti süresini kendisi görüyor. Dükkân da sadece gelmeye karar vermiş kişiyle konuşuyor.',
      'İkinci parça, cihazı bırakan müşteri için: fişteki kodu girince cihazının hangi aşamada olduğunu görüyor. “Hazır mı?” diye arayan telefonları kesen şey bu.',
    ],
    ozellikler: [
      'Cihaz ve arızaya göre anında fiyat',
      'Orijinal ve uyumlu parça karşılaştırması',
      'Takip koduyla arıza durumu sorgulama',
      'Fiyatı hazır gelen WhatsApp mesajı',
      'Telefonda tek elle kullanılan fiyat çubuğu',
    ],
    teknik:
      'Fiyat tablosu ve takip kayıtları tek bir yerde tutuluyor, yeni telefon modeli eklemek birkaç dakika sürüyor. Sunucu yok, sayfa tamamen tarayıcıda çalışıyor.',
    demoUrl: 'https://mevcut.digital/mikron-teknik/',
    gorsel: '/isler/mikron-teknik.webp',
    gorselAlt: 'Mikron Teknik Servis konsept sitesinin fiyat sorgulama ekranı',
    paket: 'Özel',
    izinli: false,
    kurgu: true,
  },
  {
    slug: 'the-barber-company',
    isletme: 'The Barber Company',
    sektor: 'Berber',
    sehir: 'Bahçelievler, İstanbul',
    baslik: 'Beş yıldızın görünür hali',
    ozet:
      '69 yorumun tamamı beş yıldız olan bir berber dükkânı. Bu konseptte o rakamı ana sayfanın en üstüne taşıdık.',
    seoBaslik: 'Berber Web Sitesi Tasarımı',
    seoAciklama:
      'Bahçelievler’deki bir berber için konsept çalışma. Google puanı sayfanın en üstünde, altında kesim fotoğrafları, hizmet listesi ve WhatsApp’tan randevu.',
    hikaye: [
      'Bu dükkânın Google puanı 69 yorumda 5,0. Sıradan bir sonuç değil. Ama o puanı görmek için insanın önce Google’a bakması gerekiyor.',
      'Konsept çalışmada rakamı sitenin en üstüne aldık. Ziyaretçi henüz kaydırmadan neyle karşı karşıya olduğunu görüyor.',
      'Altında da işin kendisi var: kesim fotoğrafları, hizmet listesi, çalışma saatleri ve randevu için tek bir düğme.',
    ],
    ozellikler: [
      'Puan ve yorumlar en üstte',
      'Çalışma fotoğrafları galerisi',
      'Hizmet ve saat listesi',
      'WhatsApp ile randevu',
      'Instagram bağlantısı',
    ],
    teknik: 'Bölümler arası geçişler yumuşak animasyonlu, telefonda da masaüstünde de aynı hızda açılıyor.',
    demoUrl: 'https://mevcut.digital/the-barber-company/',
    gorsel: '/isler/the-barber-company.webp',
    gorselAlt: 'The Barber Company konsept sitesinin açılış ekranı',
    paket: 'Kurumsal',
    izinli: false,
  },
  {
    slug: 'sarihan-cinematic',
    isletme: 'Sarıhan İşkembe',
    sektor: 'Lokanta',
    sehir: 'Zeytinburnu, İstanbul',
    baslik: 'Gece açık olduğu ilk saniyede belli',
    ozet:
      'Sayfa gece yarısı yanan vitrinle açılıyor. 7/24 açık bir salonun en büyük avantajı, tek bir cümle okumadan anlaşılıyor.',
    seoBaslik: 'Videolu Lokanta Web Sitesi',
    seoAciklama:
      'Gece açık bir işkembe salonu için konsept çalışma: açılışta ıslak asfalta düşen vitrin ışığı, altında tam menü, Google yorumları ve tek dokunuşla arama.',
    hikaye: [
      'Gece boyu açık olmak bu salonun en güçlü tarafı. Ama sayfaya “7/24 açığız” diye yazdığınızda kimse durup okumuyor.',
      'Bu konsept çalışmada sayfayı gece yarısının kendisiyle açtık: ıslak asfalt, camdan sokağa düşen sıcak ışık, kapı önünde duran buhar. Ziyaretçi saati düşünmeden “burası şu an açık” hissine kapılıyor.',
      'Altında süsleme yok. Menü, fotoğraflar, yorumlar ve arama düğmesi; sırayla.',
    ],
    ozellikler: [
      'Sessiz döngüye alınmış sinematik açılış',
      'Tam menü ve fiyat bölümü',
      'Google yorumlarından seçkiler',
      'Çalışma saatleri ve yol tarifi',
      'Tek dokunuşla arama',
    ],
    teknik:
      'Açılış videosu sessiz ve döngüde oynuyor. Yüklenmeden önce yerini bir poster görseli tutuyor, yani sayfa hiçbir zaman boş açılmıyor.',
    demoUrl: 'https://mevcut.digital/sarihan-cinematic/',
    gorsel: '/isler/sarihan-cinematic.webp',
    gorselAlt: 'Sarıhan İşkembe sinematik konsept sitesinin açılış ekranı',
    paket: 'Özel',
    izinli: false,
  },
  {
    slug: 'develi-etli-pide',
    isletme: 'Develi Etli Pide',
    sektor: 'Pide Salonu',
    sehir: 'İstanbul',
    baslik: 'Menü önce, süsleme sonra',
    ozet:
      'Pide salonunda karar hızlı verilir. Bu sayfa menüyü öne alıyor, süslemeyi arkaya bırakıyor.',
    seoBaslik: 'Pide Salonu Web Sitesi',
    seoAciklama:
      'Pide salonu için konsept çalışma: menü ve fiyatlar ilk ekranda, altında yemek fotoğrafları. Telefondan tek dokunuşla sipariş ve yol tarifi bağlantısı.',
    hikaye: [
      'Pide salonu arayan kişi ilham aramıyor, karar veriyor. Ne var, ne kadar ve kaça kadar açık: bu üçü ilk ekranda olmalı.',
      'Bu konsept çalışmada menüyü sayfanın merkezine aldık. Fotoğraflar var, ama menünün önüne geçmiyor.',
      'Sipariş için tek dokunuş yeterli: telefon ya da WhatsApp.',
    ],
    ozellikler: [
      'Menü ve fiyatlar ön planda',
      'Yemek fotoğrafları galerisi',
      'Çalışma saatleri ve konum',
      'Tek dokunuşla sipariş',
      'Hızlı açılan mobil tasarım',
    ],
    teknik: 'Hafif bir yapı, menü fotoğrafları telefon bağlantısı zayıfken bile hızlı yükleniyor.',
    demoUrl: 'https://mevcut.digital/develi-etli-pide/',
    gorsel: '/isler/develi-etli-pide.webp',
    gorselAlt: 'Develi Etli Pide konsept sitesinin açılış ekranı',
    paket: 'Kurumsal',
    izinli: false,
  },
];
