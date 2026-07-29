/**
 * Case studies. Adding a new client = one entry in this array.
 *
 * IMPORTANT: every site here is an unsolicited concept study — no business has
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
  /** Shown on the detail page — the owner-facing reason this build exists. */
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
      'Sayfayı kaydırdıkça tereyağı çorbanın üzerine düşüyor ve yayılıyor. Ziyaretçiyi ilk üç saniyede yakalayan sinematik bir açılış.',
    hikaye: [
      'Bir lokantanın internet sitesine giren kişi genelde tek bir soruyu sorar: burası iyi mi? Fotoğraf galerisi bu soruya cevap vermez; iştah açar ama ikna etmez.',
      'Bu konsept çalışmada açılış bölümünü bir videoya değil, kaydırma hareketine bağladık. Ziyaretçi parmağını kaydırdıkça çorbanın üzerine acılı tereyağı düşüyor ve yavaşça yayılıyor. Hareketi kullanıcı yönetiyor, sayfa değil.',
      'Amaç gösteriş değil: insanın ekranda durma süresini uzatmak. Duran kişi menüye iniyor, menüye inen kişi telefonu açıyor.',
    ],
    ozellikler: [
      'Kaydırmayla ilerleyen sinematik açılış',
      'Tam menü ve fiyat bölümü',
      'Google yorumlarından seçkiler',
      'Tek dokunuşla arama ve yol tarifi',
      'Telefonda da akıcı çalışan animasyon',
    ],
    teknik:
      'Video oynatmak yerine klip 98 adet WebP kareye bölünüp <canvas> üzerinde kaydırma konumuna göre çiziliyor — video currentTime ile kaydırmak takılıyor, bu yöntem takılmıyor.',
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
    hikaye: [
      'Çok şubeli işletmelerde herkes aynı hatayı yapıyor: tek bir site, içinde küçük bir "şubelerimiz" listesi. Zeytinburnu\'ndan arayan müşteri ise Zeytinburnu\'nun saatini, adresini ve telefonunu arıyor.',
      'Bu konsept çalışmada şubeye kendi sayfasını verdik. Kendi adresi, kendi çalışma saatleri, kendi yorumları. Google\'da "Zeytinburnu işkembe" araması yapan kişi doğrudan buraya düşüyor.',
      'Marka dili ortak kalıyor, ama sayfa mahalleye ait.',
    ],
    ozellikler: [
      'Şubeye özel adres, saat ve telefon',
      'Bölgesel aramalar için hazırlanmış içerik',
      'Menü ve öne çıkan tabaklar',
      'Google yorumları bölümü',
      'Mobilde tek dokunuşla arama',
    ],
    teknik: 'Derlemesiz statik HTML ve CSS — açılışı neredeyse anlık.',
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
      '69 yorumun tamamı beş yıldız olan bir berber dükkânı. Site bunu ana sayfanın en üstüne taşıyor.',
    hikaye: [
      'Bu dükkânın Google puanı 69 yorumda 5,0. Bu sıradan bir sonuç değil — ama o puanı görmek için insanın önce Google\'a bakması gerekiyor.',
      'Konsept çalışmada bu rakamı sitenin en üstüne aldık. Ziyaretçi daha kaydırmadan neyle karşı karşıya olduğunu görüyor.',
      'Altında da işin kendisi var: kesim fotoğrafları, hizmet listesi, çalışma saatleri ve randevu için tek bir düğme.',
    ],
    ozellikler: [
      'Puan ve yorumlar en üstte',
      'Çalışma fotoğrafları galerisi',
      'Hizmet ve saat listesi',
      'WhatsApp ile randevu',
      'Instagram bağlantısı',
    ],
    teknik: 'React ve Tailwind; bölüm geçişlerinde Framer Motion.',
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
      'Pide salonunda karar hızlı verilir. Bu sayfa menüyü öne alıyor, süslemeyi arkaya.',
    hikaye: [
      'Pide salonu arayan kişi ilham aramıyor, karar veriyor. Ne var, ne kadar, ne zaman açık — üçü de ilk ekranda olmalı.',
      'Bu konsept çalışmada menü sayfanın merkezine alındı. Fotoğraflar var ama menünün önüne geçmiyor.',
      'Sipariş yönlendirmesi tek dokunuş: telefon ya da WhatsApp.',
    ],
    ozellikler: [
      'Menü ve fiyatlar ön planda',
      'Yemek fotoğrafları galerisi',
      'Çalışma saatleri ve konum',
      'Tek dokunuşla sipariş',
      'Hızlı açılan mobil tasarım',
    ],
    teknik: 'React ve Vite; ikonlar Lucide.',
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
      'Markanın ana sayfası: menü, hikâye ve şubelere yönlendirme tek akışta.',
    hikaye: [
      'Ana marka sayfasının işi farklı: gelen kişiyi doğru şubeye ve doğru masaya yönlendirmek.',
      'Bu konsept çalışmada lokantanın hikâyesi, imza tabakları ve şube yönlendirmesi tek bir kaydırma akışına yerleştirildi.',
      'Ziyaretçi ne yediğini, nerede yiyeceğini ve nasıl ulaşacağını sayfayı terk etmeden öğreniyor.',
    ],
    ozellikler: [
      'Marka hikâyesi bölümü',
      'İmza tabaklar',
      'Tam menü',
      'Şube yönlendirmesi',
      'Google yorumları',
    ],
    teknik: 'Statik HTML, CSS ve JavaScript — derleme adımı yok.',
    demoUrl: 'https://mevcut.digital/sarihan-lokanta/',
    gorsel: '/isler/sarihan-lokanta.webp',
    gorselAlt: 'Sarıhan Lokanta konsept sitesinin açılış ekranı',
    paket: 'Kurumsal',
    izinli: false,
  },
];
