export const site = {
  ad: 'Mevcut Digital',
  slogan: 'Dijitalde Var Olun, Müşteriyi Kazanın.',
  url: 'https://mevcut.digital',
  telefon: '+90 537 548 30 79',
  telefonHref: 'tel:+905375483079',
  whatsappNo: '905375483079',
  eposta: 'MevcutDigital@pm.me',
};

/** Pre-filled WhatsApp message so the visitor never faces an empty chat box. */
export function whatsapp(mesaj = 'Merhaba, işletmem için web sitesi hakkında bilgi almak istiyorum.') {
  return `https://wa.me/${site.whatsappNo}?text=${encodeURIComponent(mesaj)}`;
}

export type Paket = {
  ad: string;
  vurgu: string;
  aciklama: string;
  kapsam: string[];
  /**
   * Prices are deliberately absent while they are still being negotiated. Once a
   * number is settled, fill this in and the card renders it. Nothing else changes.
   */
  fiyat: string | null;
  fiyatNotu: string | null;
  oneCikan: boolean;
  cta: string;
};

export const paketler: Paket[] = [
  {
    ad: 'Vitrin',
    vurgu: 'Önce görünür olun',
    aciklama:
      'İşletmenizi internete taşımanın en hızlı yolu. Kendi alan adınızı almanız gerekmiyor, sitemiz üzerinden bir adres alıyorsunuz ve aynı gün yayına giriyorsunuz.',
    kapsam: [
      'Aynı gün yayında',
      'Tek sayfalık site',
      'mevcut.digital/isletmeniz adresinde yayın',
      'Telefonda düzgün görünen tasarım',
      'Tek dokunuşla arama ve WhatsApp',
    ],
    fiyat: null,
    fiyatNotu: 'Başlangıç paketi',
    oneCikan: false,
    cta: 'Vitrin paketi hakkında bilgi almak istiyorum.',
  },
  {
    ad: 'Kurumsal',
    vurgu: 'Kendi adınızla',
    aciklama:
      'Kendi alan adınız, kendi kimliğiniz. Alan adını sizin adınıza biz alıyoruz, yayında kalmasını da biz takip ediyoruz. Siz işinize bakıyorsunuz.',
    kapsam: [
      'Vitrin paketindeki her şey',
      'Kendi alan adınız (isletmeniz.com)',
      'Alan adı ve yayın yönetimi bizde',
      'Menü veya hizmet listesi',
      'Instagram bağlantısı',
      'Google’da bulunabilirlik kurulumu',
      'Yıllık bakım ve güncelleme',
    ],
    fiyat: null,
    fiyatNotu: 'Kurulum + yıllık bakım',
    oneCikan: true,
    cta: 'Kurumsal paket hakkında bilgi almak istiyorum.',
  },
  {
    ad: 'Özel',
    vurgu: 'Tamamen size özel',
    aciklama:
      'Şablon kullanmadığımız paket. Tasarımı, animasyonu ve akışı işletmeniz için sıfırdan kuruyoruz. Bu sayfadaki gece açılışlı lokanta çalışması bu paketten çıktı.',
    kapsam: [
      'Kurumsal paketteki her şey',
      'Sıfırdan özel tasarım',
      'Sinematik animasyon ve video',
      'Menünüzü ve saatlerinizi bilen yapay zekâ asistanı',
      'Asistan sitede, WhatsApp’ta veya Instagram’da yanıtlar',
      'Rezervasyon veya sipariş yönlendirmesi',
      'Çok şubeli yapı',
      'Öncelikli destek',
    ],
    fiyat: null,
    fiyatNotu: 'Projeye göre',
    oneCikan: false,
    cta: 'Özel paket hakkında bilgi almak istiyorum.',
  },
];

export const surec = [
  {
    adim: '01',
    baslik: 'Konuşuyoruz',
    metin:
      'WhatsApp’tan yazın, işletmenizi anlatın. Ne yaptığınızı ve müşterinizin sizi nasıl bulduğunu dinliyoruz. Bu görüşme için para almıyoruz.',
  },
  {
    adim: '02',
    baslik: 'Örneğini görüyorsunuz',
    metin:
      'Size özel bir taslak hazırlıyoruz. Bu sayfadaki işlerin hepsi böyle başladı: kimse istemeden önce yaptık, sonra sahibine gösterdik.',
  },
  {
    adim: '03',
    baslik: 'Yayına alıyoruz',
    metin:
      'Onayınızdan sonra fotoğrafları, menüyü ve iletişim bilgilerinizi yerleştirip siteyi açıyoruz. Genelde birkaç gün sürüyor.',
  },
  {
    adim: '04',
    baslik: 'Arkasında duruyoruz',
    metin:
      'Saatiniz değişti, menüye yeni bir tabak eklendi. Yazın, aynı gün güncelliyoruz. Site yayında kaldığı sürece bu böyle devam ediyor.',
  },
];

/**
 * Answers to the questions we get asked on WhatsApp before anything else.
 * Rendered as visible copy and mirrored into FAQPage structured data, which is
 * what Google and AI assistants quote from.
 */
export const sorular = [
  {
    soru: 'Web sitesi yaptırmak ne kadar sürüyor?',
    cevap:
      'Tek sayfalık bir site genelde birkaç gün içinde yayında oluyor. Menü, galeri ve şube sayfası olan daha büyük işler bir haftayı bulabiliyor. Fotoğraflarınız ve menüniz hazırsa süre kısalıyor.',
  },
  {
    soru: 'Fiyatlar ne kadar?',
    cevap:
      'İşin kapsamına göre değişiyor, o yüzden sayfaya sabit bir fiyat yazmıyoruz. WhatsApp’tan işletmenizi anlatın, aynı gün net bir fiyat söylüyoruz.',
  },
  {
    soru: 'Yapay zekâ asistanı ne işe yarıyor?',
    cevap:
      'Menünüzü, saatlerinizi ve adresinizi öğreniyor; “kaça kadar açıksınız”, “şu yemek kaç para” gibi soruları gecenin üçünde de yanıtlıyor. Sitede, WhatsApp’ta veya Instagram’da çalışabiliyor. Bilmediği bir şey sorulduğunda uydurmuyor, sizin numaranıza yönlendiriyor. Özel pakette veriyoruz.',
  },
  {
    soru: 'Alan adı benim adıma mı olacak?',
    cevap:
      'Kurumsal ve Özel paketlerde alan adını sizin işletmeniz adına alıyoruz, faturasını ve yenilemesini biz takip ediyoruz. Bizimle çalışmayı bırakırsanız alan adı size devredilir, sizde kalır.',
  },
  {
    soru: 'Instagram hesabım var, siteye gerek var mı?',
    cevap:
      'Instagram müşteriyi elinizde tutmak için iyi çalışıyor ama arama için çalışmıyor. Google’da “yakınımdaki berber” diye arayan kişi Instagram gönderilerinizi görmüyor. Menüniz de aranabilir değil, adresiniz haritaya düşmüyor.',
  },
  {
    soru: 'Sitemi kendim güncelleyebilir miyim?',
    cevap:
      'Gerek yok, güncellemeleri biz yapıyoruz ve bunun için ayrıca ücret almıyoruz. Saat değişikliği, yeni fotoğraf, menüye eklenen bir tabak: WhatsApp’tan yazmanız yeterli.',
  },
  {
    soru: 'Nerelerde çalışıyorsunuz?',
    cevap:
      'İstanbul’daki işletmelerle çalışıyoruz, ağırlıklı olarak Bahçelievler, Zeytinburnu ve çevresi. Site işi uzaktan yürüdüğü için Türkiye’nin başka şehirlerinden de iş alıyoruz.',
  },
];
