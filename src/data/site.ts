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
   * Prices are deliberately absent — they are still being negotiated. When a number
   * is finally settled, fill this in and the card renders it. Nothing else changes.
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
      'İşletmenizi internete taşımanın en hızlı yolu. Kendi alan adınızı almadan, bizim adresimiz üzerinden yayında olursunuz.',
    kapsam: [
      'Tek sayfalık site',
      'mevcut.digital/isletmeniz adresinde yayın',
      'Telefonda kusursuz görünüm',
      'Tek dokunuşla arama ve WhatsApp',
      'Google Haritalar ve yol tarifi',
      'Fotoğraf galerisi',
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
      'Kendi alan adınız, kendi kimliğiniz. Alan adını ve yayını sizin adınıza biz alır, biz yönetiriz — siz işinize bakarsınız.',
    kapsam: [
      'Vitrin paketindeki her şey',
      'Kendi alan adınız (isletmeniz.com)',
      'Alan adı ve yayın yönetimi bizde',
      'Menü veya hizmet listesi',
      'Google yorumları bölümü',
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
      'Hazır şablon yok. Tasarımdan animasyona kadar işletmeniz için sıfırdan kurgulanan bir site.',
    kapsam: [
      'Kurumsal paketteki her şey',
      'Sıfırdan özel tasarım',
      'Sinematik animasyon ve video',
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
      'WhatsApp’tan yazın, işletmenizi anlatın. Ne yaptığınızı, kimin geldiğini ve neyi değiştirmek istediğinizi dinliyoruz. Ücretsiz.',
  },
  {
    adim: '02',
    baslik: 'Örneğini görüyorsunuz',
    metin:
      'Size özel bir taslak hazırlıyoruz. Beğenmezseniz yükümlülüğünüz yok — bu sayfadaki işlerin çoğu böyle başladı.',
  },
  {
    adim: '03',
    baslik: 'Yayına alıyoruz',
    metin:
      'Onaydan sonra fotoğrafları, menüyü ve iletişim bilgilerini yerleştirip siteyi yayına alıyoruz.',
  },
  {
    adim: '04',
    baslik: 'Arkasında duruyoruz',
    metin:
      'Saatiniz değişti, menüye yeni bir şey eklendi — yazın, güncelleyelim. Site yayında kaldığı sürece yanınızdayız.',
  },
];
