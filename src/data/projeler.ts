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
};

export const projeler: Proje[] = [
  {
    slug: 'sarihan-cinematic',
    isletme: 'Sarıhan İşkembe',
    sektor: 'Lokanta',
    sehir: 'İstanbul',
    baslik: 'Kaydırdıkça pişen bir çorba',
    ozet:
      'Sayfayı kaydırdıkça tereyağı çorbanın üzerine düşüyor ve yayılıyor. Ziyaretçiyi ilk saniyelerde yakalayan sinematik bir açılış.',
    seoBaslik: 'Animasyonlu Lokanta Web Sitesi',
    seoAciklama:
      'Bir işkembe lokantası için hazırladığımız konsept: sayfayı kaydırdıkça çorbanın üzerine tereyağı düşüyor. Sinematik açılış, tam menü ve tek dokunuşla arama.',
    hikaye: [
      'Bir lokantanın sitesine giren kişi tek bir şeyi merak eder: burası iyi mi? Fotoğraf galerisi bu soruya cevap vermiyor. İştah açıyor ama ikna etmiyor.',
      'Bu konsept çalışmada açılışı videoya değil, parmağın hareketine bağladık. Ziyaretçi kaydırdıkça çorbanın üzerine acılı tereyağı düşüyor ve yavaşça yayılıyor. Hareketi sayfa değil, kullanıcı yönetiyor.',
      'Amaç gösteriş değil. İnsanın ekranda kalma süresini uzatmak istiyoruz, çünkü duran kişi menüye iniyor ve menüye inen kişi telefonu açıyor.',
    ],
    ozellikler: [
      'Kaydırmayla ilerleyen sinematik açılış',
      'Tam menü ve fiyat bölümü',
      'Google yorumlarından seçkiler',
      'Tek dokunuşla arama ve yol tarifi',
      'Telefonda da akıcı çalışan animasyon',
    ],
    teknik:
      'Video oynatmak yerine klip 98 adet WebP kareye bölünüyor ve kaydırma konumuna göre canvas üzerine çiziliyor. Videoyu currentTime ile kaydırmak takılıyor, bu yöntem takılmıyor.',
    demoUrl: 'https://mevcut.digital/sarihan-cinematic/',
    gorsel: '/isler/sarihan-cinematic.webp',
    gorselAlt: 'Sarıhan İşkembe sinematik konsept sitesinin açılış ekranı',
    paket: 'Özel',
    izinli: false,
  },
  {
    slug: 'sarihan-zeytinburnu',
    isletme: 'Sarıhan İşkembe Zeytinburnu',
    sektor: 'Lokanta',
    sehir: 'Zeytinburnu, İstanbul',
    baslik: 'Şubenin kendi sayfası',
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
    teknik: 'Derleme adımı olmayan statik HTML ve CSS. Açılışı neredeyse anlık.',
    demoUrl: 'https://mevcut.digital/sarihan-zeytinburnu/',
    gorsel: '/isler/sarihan-zeytinburnu.webp',
    gorselAlt: 'Sarıhan İşkembe Zeytinburnu konsept sitesinin açılış ekranı',
    paket: 'Kurumsal',
    izinli: false,
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
    teknik: 'React ve Tailwind. Bölüm geçişlerinde Framer Motion.',
    demoUrl: 'https://mevcut.digital/the-barber-company/',
    gorsel: '/isler/the-barber-company.webp',
    gorselAlt: 'The Barber Company konsept sitesinin açılış ekranı',
    paket: 'Kurumsal',
    izinli: false,
  },
  {
    slug: 'develi-etli-pide',
    isletme: 'Develi Etli Pide',
    sektor: 'Pide Salonu',
    sehir: 'İstanbul',
    baslik: 'Menü, fotoğrafın önünde',
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
    teknik: 'React ve Vite. İkonlar Lucide.',
    demoUrl: 'https://mevcut.digital/develi-etli-pide/',
    gorsel: '/isler/develi-etli-pide.webp',
    gorselAlt: 'Develi Etli Pide konsept sitesinin açılış ekranı',
    paket: 'Kurumsal',
    izinli: false,
  },
  {
    slug: 'sarihan-lokanta',
    isletme: 'Sarıhan Lokanta',
    sektor: 'Lokanta',
    sehir: 'İstanbul',
    baslik: 'Ana lokantanın vitrini',
    ozet:
      'Markanın ana sayfası. Menü, hikâye ve şube yönlendirmesi tek bir kaydırma akışında.',
    seoBaslik: 'Restoran Web Sitesi Tasarımı',
    seoAciklama:
      'Restoran ana sayfası için konsept çalışma. Marka hikâyesi, imza tabaklar, tam menü ve şube yönlendirmesi tek bir kaydırma akışında toplanıyor.',
    hikaye: [
      'Ana marka sayfasının işi farklı. Gelen kişiyi doğru şubeye ve doğru masaya yönlendirmesi gerekiyor.',
      'Bu konsept çalışmada lokantanın hikâyesini, imza tabaklarını ve şube yönlendirmesini tek bir kaydırma akışına yerleştirdik.',
      'Ziyaretçi ne yiyeceğini ve nerede yiyeceğini sayfadan çıkmadan öğreniyor.',
    ],
    ozellikler: [
      'Marka hikâyesi bölümü',
      'İmza tabaklar',
      'Tam menü',
      'Şube yönlendirmesi',
      'Google yorumları',
    ],
    teknik: 'Statik HTML, CSS ve JavaScript. Derleme adımı yok.',
    demoUrl: 'https://mevcut.digital/sarihan-lokanta/',
    gorsel: '/isler/sarihan-lokanta.webp',
    gorselAlt: 'Sarıhan Lokanta konsept sitesinin açılış ekranı',
    paket: 'Kurumsal',
    izinli: false,
  },
];
