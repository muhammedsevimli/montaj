// Montaj · motion graphic referans masası (26 Eyl 2026).
// Katalog whatships.com (MIT, dingyi) verisinden süzüldü; X'teki Opus 5.5 videoları
// xquik ile tarandı. Etiketler kareler incelenerek elle verildi. Veri üretim hattı:
// excalidraw/content-os/products/montaj/ (indir.py → donustur.py → derle.py).

export const STILLER = [
  "kinetik-tipografi",
  "arayuz",
  "3d",
  "urun",
  "illustrasyon",
  "soyut",
  "piksel",
  "editoryal",
  "kolaj",
  "terminal",
  "veri",
  "sinematik",
] as const;
export type Stil = (typeof STILLER)[number];

export const ZEMINLER = ["koyu", "acik", "renkli"] as const;
export type Zemin = (typeof ZEMINLER)[number];

export const TEMPOLAR = ["sakin", "orta", "hizli"] as const;
export type Tempo = (typeof TEMPOLAR)[number];

export const TEKNIKLER = [
  "yakinlastirma",
  "imlec",
  "maske",
  "sert-kesim",
  "morph",
  "kaydirma",
  "yazma",
  "sayac",
  "izgara",
  "kamera-3d",
  "parcacik",
] as const;
export type Teknik = (typeof TEKNIKLER)[number];

export type Kaynak = "katalog" | "opus55";
export type Oran = "yatay" | "dikey" | "kare";

export interface Klip {
  id: string;
  kaynak: Kaynak;
  urun: string;
  ozet: string;
  gorsel: string;
  not: string;
  stil: Stil[];
  zemin: Zemin;
  tempo: Tempo;
  teknik: Teknik[];
  puan: number;
  /** Saniye. */
  sure: number;
  oran: Oran;
  /** ISO tarih. */
  tarih: string;
  tweetUrl: string;
  yazar: string;
  izlenme?: number;
}

// Stil renkleri: After Effects katman etiket paletinden (motion'ın kendi renk dili).
// Marka iki renkli kalır; bu palet yalnız /montaj sayfasına özel istisnadır (26 Eyl 2026,
// kullanıcı isteği: "biraz daha renklendir"). Renk yalnız etiket, nokta ve işaret olarak kullanılır,
// metin rengi olarak değil.
export const STIL_RENK: Record<Stil, string> = {
  "kinetik-tipografi": "#d0574a",
  arayuz: "#6e86e6",
  "3d": "#6fc0b8",
  urun: "#e7b585",
  illustrasyon: "#e6a3bc",
  soyut: "#a7a3d6",
  piksel: "#5dae5b",
  editoryal: "#b8a47f",
  kolaj: "#e8912d",
  terminal: "#9fc3a0",
  veri: "#e3cf4e",
  sinematik: "#3da2a5",
};

export const STIL_ETIKET: Record<Stil, string> = {
  "kinetik-tipografi": "Kinetik tipografi",
  arayuz: "Arayüz animasyonu",
  "3d": "3D sahne",
  urun: "Ürün çekimi",
  illustrasyon: "İllüstrasyon",
  soyut: "Soyut ve shader",
  piksel: "Piksel ve ASCII",
  editoryal: "Editoryal",
  kolaj: "Kolaj",
  terminal: "Terminal ve kod",
  veri: "Veri ve sayaç",
  sinematik: "Sinematik",
};

/** Prompt'a giden İngilizce karşılık: Claude stil adını İngilizce literatürden tanıyor. */
export const STIL_INGILIZCE: Record<Stil, string> = {
  "kinetik-tipografi": "kinetic typography",
  arayuz: "UI animation",
  "3d": "3D scene",
  urun: "product CGI",
  illustrasyon: "illustration",
  soyut: "abstract shader",
  piksel: "pixel / ASCII",
  editoryal: "editorial",
  kolaj: "collage",
  terminal: "terminal / code",
  veri: "data viz",
  sinematik: "cinematic",
};

export const ZEMIN_ETIKET: Record<Zemin, string> = {
  koyu: "Koyu",
  acik: "Açık",
  renkli: "Renkli",
};

export const TEMPO_ETIKET: Record<Tempo, string> = {
  sakin: "Sakin",
  orta: "Orta",
  hizli: "Hızlı",
};

export const TEKNIK_ETIKET: Record<Teknik, string> = {
  yakinlastirma: "Yakınlaşma",
  imlec: "İmleç",
  maske: "Maske geçişi",
  "sert-kesim": "Sert kesim",
  morph: "Morph",
  kaydirma: "Kaydırma",
  yazma: "Yazma efekti",
  sayac: "Sayaç",
  izgara: "Izgara",
  "kamera-3d": "3D kamera",
  parcacik: "Parçacık",
};
