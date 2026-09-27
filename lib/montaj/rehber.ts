// Montaj sayfasının yazı katmanı: altı adım, yönetmen sözlüğü, araç çantası, SSS.
// Akış, Rexan Wong'un 26 Eyl 2026 tarihli X notundan uyarlandı (kaynak bölümünde anılır).

export type OdakAlani = "kutuphane" | "motor" | "bilesen" | "marka" | "storyboard" | "yonetmen";

export interface Adim {
  no: string;
  kisa: string;
  baslik: string;
  metin: string;
  yoksa: string;
  odak: OdakAlani;
  /** After Effects'in ilk altı katman etiket rengi; zaman çizelgesi ve rehber kartları. */
  renk: string;
}

export const ADIMLAR: Adim[] = [
  {
    no: "01",
    kisa: "Referans",
    baslik: "Taklit edilecek referansı seç",
    metin:
      "Stilini beğendiğin bir ya da iki video seç ve Opus'a bunları taklit etmesini söyle. Bir stili tarif etmekle uğraşma, adını ve örneğini ver.",
    yoksa:
      "Referans olmadan Opus kendi varsayılan görünümüne döner ve ortada metin, gradyan zemin ve yavaşça beliren öğelerle o tanıdık video çıkar. X'te dolaşan videoların birbirine benzemesinin sebebi bu. Referans ona tempoyu, tipografiyi ve geçişleri hazır verir.",
    odak: "kutuphane",
    renk: "#d0574a",
  },
  {
    no: "02",
    kisa: "Motor",
    baslik: "HyperFrames ya da Remotion kur",
    metin:
      "İkisi de Opus'un her sahneyi kod olarak yazmasını ve doğrudan MP4'e render etmesini sağlıyor. Araya video editörü girmiyor. Hızlı kurguda HyperFrames, şeffaf katmanlı motion'da Remotion kullanıyorum.",
    yoksa:
      "Motor yoksa Opus videoyu ancak tarif eder ya da ekran kaydını senin alacağın kaba bir HTML sayfası verir. Bu araçlarla her kare sabitlenir. Bir şeyi değiştirmek istediğinde Opus yalnız o satırı düzeltip yeniden render eder.",
    odak: "motor",
    renk: "#e3cf4e",
  },
  {
    no: "03",
    kisa: "Bileşen",
    baslik: "Gerçek bileşen kütüphanesi ekle",
    metin:
      "21st.dev'deki hazır buton, kart ve arayüz bileşenlerini videoya koy. Bunları gerçek ürünlerde çalışan tasarımcılar hazırlıyor. Efekt katmanı için Canvas UI, kontrol paneli gibi uygulama arayüzleri için Toolcraft, genel tasarım zevki için Taste Skill ekliyorum.",
    yoksa:
      "Opus ürün arayüzünü sıfırdan çizince boşluklar kayar, yer tutucu kutular kalır ve butonlar sahte durur. Arayüzden anlayan biri bunu bir saniyede fark eder ve bütün video ucuz görünür.",
    odak: "bilesen",
    renk: "#6fc0b8",
  },
  {
    no: "04",
    kisa: "Bağlam",
    baslik: "Bütün bağlamı Opus'a dök",
    metin:
      "İlk üç adım kurulumdu. Şimdi Opus'a markanı (logo, renkler, fontlar), gerçek ürün ekran görüntülerini, referans videoyu ve kafandaki videoyu anlatan kısa bir notu ver. Sonra üç farklı storyboard (sahne sahne taslak) iste.",
    yoksa:
      "Opus renklerini, fontunu, hatta ürününün ne yaptığını tahmin eder ve video herhangi bir girişime ait olabilir. Bağlamla yalnız sana ait olur. Üç varyant da ilk fikri düzeltmekle uğraşmak yerine bir yön seçmeni sağlar.",
    odak: "marka",
    renk: "#e6a3bc",
  },
  {
    no: "05",
    kisa: "Storyboard",
    baslik: "Storyboard'u seç, önce durağan kare iste",
    metin:
      "Beğendiğin storyboard'u seç ve animasyona geçmeden önce her sahne için tek bir durağan kare iste. Her karenin yanında o sahnenin görevi yazsın: izleyici bu anda neyi anlamalı? Storyboard düzeltmek render düzeltmekten çok daha ucuz.",
    yoksa:
      "Dördüncü sahnenin yanlış olduğunu her şey animasyona girdikten sonra öğrenirsin ve her düzeltme yeniden render demektir. Durağan kare saniyeler içinde değişir. Görev cümlesi olmazsa sonraki notların tek ölçüsü referansa benzemek olur; varsa her zoom ve kesimi o cümleye göre tartarsın.",
    odak: "storyboard",
    renk: "#a7a3d6",
  },
  {
    no: "06",
    kisa: "Yönetmen",
    baslik: "Araya girme, render gelince yönetmen gibi not ver",
    metin:
      'Claude işini yaparken araya girme. Render gelince notlarını kamera diliyle ver: "her zoom\'u 0,7x\'e yavaşlat", "burada sert kesim", "butona yaklaş".',
    yoksa:
      'İlk render çoğu zaman iskeleti doğru getirir, profesyonel görüntü sonraki not turlarında çıkar. "Daha iyi yap" gibi belirsiz notlar rastgele değişiklik getirir. Kamera diliyle yazılmış not tam istediğin değişikliği getirir.',
    odak: "yonetmen",
    renk: "#e7b585",
  },
];

export interface Terim {
  tr: string;
  en: string;
  aciklama: string;
  not: string;
}

export const SOZLUK: Terim[] = [
  {
    tr: "Yaklaşma",
    en: "push in",
    aciklama: "Kamera konuya doğru yavaşça yaklaşır ve dikkati bir noktada toplar.",
    not: "Kayıt butonuna 0,8 saniyede ease-out ile 1,15x yaklaş.",
  },
  {
    tr: "Geri çekilme",
    en: "pull out",
    aciklama: "Detaydan bütüne açılır, izleyiciye bağlamı gösterir.",
    not: "Son sahnede bütün arayüz görünsün diye 0,85x'e geri çekil.",
  },
  {
    tr: "Sert kesim",
    en: "hard cut",
    aciklama: "Geçiş efekti olmadan sahne anında değişir ve videoya enerji katar.",
    not: "Üçüncü ile dördüncü sahne arasındaki geçişi kaldır, sert kesim yap.",
  },
  {
    tr: "Eşleşen kesim",
    en: "match cut",
    aciklama: "Bir sahnedeki şekil, sonraki sahnede aynı konumda devam eder.",
    not: "Logodaki daireyi sonraki sahnedeki butonla aynı konumda eşleştirip kes.",
  },
  {
    tr: "Maske geçişi",
    en: "mask reveal",
    aciklama: "Yeni görüntü bir şeklin içinden açılarak gelir.",
    not: "Başlığı soldan sağa dikdörtgen maskeyle 0,5 saniyede aç.",
  },
  {
    tr: "Savurma pan",
    en: "whip pan",
    aciklama: "Hızlı yatay savrulma ve hareket bulanıklığıyla sahne değişir.",
    not: "Sahne geçişini 0,25 saniyelik yatay savurma panla yap, bulanıklık ekle.",
  },
  {
    tr: "Kademeli giriş",
    en: "stagger",
    aciklama: "Öğeler sırayla, kısa aralıklarla ekrana gelir.",
    not: "Kartları 60 ms arayla, alttan 12 px kayarak getir.",
  },
  {
    tr: "Aşma",
    en: "overshoot",
    aciklama: "Hareket hedefini biraz geçip geri oturur ve canlı hissettirir.",
    not: "Kartların girişine yüzde 8 aşma ekle, sonra yerine otursun.",
  },
  {
    tr: "Yumuşak duruş",
    en: "ease out",
    aciklama: "Hareket hızlı başlar ve yavaşlayarak durur.",
    not: "Bütün girişlerde cubic-bezier(0.16, 1, 0.3, 1) kullan.",
  },
  {
    tr: "Hız rampası",
    en: "speed ramp",
    aciklama: "Hareket bir anda hızlanıp yavaşlar, vurgu yaratır.",
    not: "Yakınlaşmanın ilk 0,2 saniyesi hızlı olsun, sonra 0,3x'e düşür.",
  },
  {
    tr: "Bekleme",
    en: "hold",
    aciklama: "Görüntü okunabilsin diye bir süre hareketsiz kalır.",
    not: "Her başlıktan sonra okuma için 1,2 saniye bekle.",
  },
  {
    tr: "Paralaks",
    en: "parallax",
    aciklama: "Katmanlar farklı hızlarda kayar ve derinlik oluşur.",
    not: "Arka planı ön plana göre 0,4x hızda kaydır.",
  },
  {
    tr: "Odak kaydırma",
    en: "rack focus",
    aciklama: "Netlik bir katmandan diğerine geçer.",
    not: "Netliği 0,6 saniyede arka plandan öndeki karta taşı.",
  },
  {
    tr: "Ritme oturtma",
    en: "beat sync",
    aciklama: "Kesimler müziğin vuruşlarına denk gelir.",
    not: "Kesimleri 120 BPM'e göre her iki vuruşta bir oturt.",
  },
];

export interface Arac {
  ad: string;
  rol: string;
  metin: string;
  url: string;
}

export const ARACLAR: Arac[] = [
  {
    ad: "HyperFrames",
    rol: "Motor",
    metin:
      "Açık kaynak bu araç sahneleri HTML ile yazıp MP4'e render ediyor. Hızlı kurgu için ilk tercihim.",
    url: "https://github.com/heygen-com/hyperframes",
  },
  {
    ad: "Remotion",
    rol: "Motor",
    metin:
      "Videoyu React bileşenleriyle kuruyor. Şeffaf katman ve uzun seri işlerde sağlam çalışıyor.",
    url: "https://www.remotion.dev",
  },
  {
    ad: "21st.dev",
    rol: "Bileşen",
    metin:
      "Gerçek ürünlerde kullanılan hazır arayüz bileşenleri sunuyor. Videodaki ürün ekranı bunlarla sahte durmuyor.",
    url: "https://21st.dev",
  },
  {
    ad: "Canvas UI",
    rol: "Efekt",
    metin:
      "Tarayıcıda çalışan hazır efekt bileşenleri sunuyor. Bu sayfadaki noktalı klaket nesnesi oradan geliyor.",
    url: "https://canvasui.dev",
  },
  {
    ad: "Toolcraft",
    rol: "Arayüz",
    metin:
      "AI ile tasarım uygulaması kurmak için bileşen seti sunuyor. Bu masanın panel ve keyframe dili oradan uyarlandı.",
    url: "https://toolcraft.sh",
  },
  {
    ad: "Taste Skill",
    rol: "Zevk",
    metin:
      "Claude Code'un jenerik arayüz üretmesini engelleyen skill dosyalarını tek komutla kuruyor.",
    url: "https://www.tasteskill.dev",
  },
];

export interface Soru {
  s: string;
  c: string;
}

export const SSS: Soru[] = [
  {
    s: "Montaj nedir?",
    c: "Montaj, Claude ile motion graphic üretenler için kurduğum Türkçe referans kütüphanesi ve prompt masasıdır. Videolar gerçek ürün lansmanlarından ve Eylül 2026'da Opus 5.5 ile kodla üretilmiş örneklerden seçildi. Her kayıtta stil, tempo, teknik ve Claude'a verilecek bir yönetmen notu var.",
  },
  {
    s: "Tek prompt yetmiyor mu?",
    c: "İlk denemede iskelet genelde doğru çıkıyor. Kalan kısım referans, storyboard ve yönetmen notlarıyla kapanıyor. Masadaki prompt bu akışı tek metinde topluyor.",
  },
  {
    s: "HyperFrames mı, Remotion mı?",
    c: "İkisi de iş görüyor. HTML ile hızlı ilerlemek istiyorsan HyperFrames, React biliyorsan ya da şeffaf katman üreteceksen Remotion daha rahat. Prompt ayarındaki motor seçimi talimatları buna göre değiştiriyor.",
  },
  {
    s: "Videolar kime ait?",
    c: "Her video sahibine ait. Kayıtlarda orijinal X gönderisinin linki duruyor ve referans verirken o linki kullanabilirsin. Kaldırılmasını istediğin bir kayıt varsa X'te @_msevimli hesabına yaz, 72 saat içinde çıkarılır.",
  },
  {
    s: "Liste güncelleniyor mu?",
    c: "Elle güncelliyorum. Son tarama 26 Eylül 2026'da yapıldı.",
  },
];
