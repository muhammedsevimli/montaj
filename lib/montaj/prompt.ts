import { type Klip, STIL_INGILIZCE, TEKNIK_ETIKET, TEMPO_ETIKET, ZEMIN_ETIKET } from "./types";

export type Motor = "hyperframes" | "remotion";
export type Format = "16:9" | "9:16" | "1:1";

export interface PromptAyar {
  motor: Motor;
  format: Format;
  /** Saniye. */
  sure: number;
  /** Referansa göre hız çarpanı; 1 = aynı. */
  tempo: number;
  varyant: number;
  urun: string;
  renk1: string;
  renk2: string;
  font: string;
  storyboard: boolean;
  ses: boolean;
}

export const VARSAYILAN_AYAR: PromptAyar = {
  motor: "hyperframes",
  format: "16:9",
  sure: 30,
  tempo: 1,
  varyant: 3,
  urun: "",
  renk1: "#0E0E0C",
  renk2: "#E9E2D2",
  font: "",
  storyboard: true,
  ses: false,
};

const MOTOR_SATIRI: Record<Motor, string> = {
  hyperframes:
    "Motor: HyperFrames. Her sahneyi HTML, CSS ve zaman çizelgesiyle kod olarak yaz, CLI ile doğrudan MP4'e render et.",
  remotion:
    "Motor: Remotion. Her sahneyi ayrı bir React bileşeni olarak yaz, `npx remotion render` ile doğrudan MP4'e render et.",
};

const FORMAT_SATIRI: Record<Format, string> = {
  "16:9": "16:9 yatay (1920×1080)",
  "9:16": "9:16 dikey (1080×1920)",
  "1:1": "1:1 kare (1080×1080)",
};

function ondalik(n: number): string {
  return n.toFixed(1).replace(".", ",");
}

function referansBlogu(k: Klip, sira: number): string {
  const stil = k.stil.map((s) => STIL_INGILIZCE[s]).join(", ");
  const teknik = k.teknik.length
    ? k.teknik.map((t) => TEKNIK_ETIKET[t].toLocaleLowerCase("tr")).join(", ")
    : "";
  return [
    `${sira}. ${k.urun}: ${k.tweetUrl}`,
    `   Stil: ${stil}. Zemin ${ZEMIN_ETIKET[k.zemin].toLocaleLowerCase("tr")}, tempo ${TEMPO_ETIKET[k.tempo].toLocaleLowerCase("tr")}.${teknik ? ` Teknik: ${teknik}.` : ""}`,
    `   Ekranda: ${k.gorsel}`,
    `   Not: ${k.not}`,
  ].join("\n");
}

/** Referans klip(ler) ve ayarlardan Claude'a verilecek Türkçe ana prompt'u kurar. */
export function promptKur(referanslar: Klip[], a: PromptAyar): string {
  const urun = a.urun.trim() || "[ürün adı]";
  const font = a.font.trim() || "[marka fontu]";
  const satirlar: string[] = [];

  satirlar.push(
    `Bir motion designer gibi çalış. ${urun} için ${a.sure} saniyelik, ${FORMAT_SATIRI[a.format]} bir tanıtım videosu yapacağız.`,
  );

  satirlar.push("", "REFERANS");
  if (referanslar.length) {
    referanslar.forEach((k, i) => {
      satirlar.push(referansBlogu(k, i + 1));
    });
    satirlar.push(
      referanslar.length > 1
        ? "Bu iki referansın temposunu, tipografisini ve geçişlerini birleştir; ikisinin ortak dilinde kal."
        : "Bu referansın temposunu, tipografisini ve geçişlerini taklit et.",
    );
  } else {
    satirlar.push("[referans video linki]");
  }
  satirlar.push(
    "Kendi varsayılan görünümüne dönme: ortalanmış metin, gradyan zemin ve her şeyin yavaşça belirmesi bu videoda yok.",
  );
  if (Math.abs(a.tempo - 1) > 0.01) {
    satirlar.push(
      a.tempo < 1
        ? `Tüm hareketleri referansa göre ${ondalik(a.tempo)}x hızında, daha ağır tut.`
        : `Tüm hareketleri referansa göre ${ondalik(a.tempo)}x hızında, daha çevik tut.`,
    );
  }

  satirlar.push(
    "",
    "MARKA",
    `Ürün: ${urun}`,
    `Renkler: ${a.renk1.toUpperCase()} ve ${a.renk2.toUpperCase()}. Bu iki rengin dışına çıkma.`,
    `Font: ${font}`,
    "Logomu ve gerçek ürün ekran görüntülerimi ekliyorum. Ürün arayüzünü uydurma, bu ekranlardan kur.",
    "Buton, kart ve form gibi arayüz parçalarında 21st.dev'deki hazır bileşenleri kullan; yer tutucu kutu çizme.",
  );

  satirlar.push("", "İŞ AKIŞI");
  let adim = 1;
  if (a.storyboard) {
    satirlar.push(
      `${adim++}. Önce ${a.varyant} farklı storyboard varyantı öner. Her birinde sahne listesi, sahne süreleri ve geçişler olsun. Her sahnenin yanına tek cümlelik görevini yaz: izleyici bu anda neyi anlamalı?`,
      `${adim++}. Ben birini seçince her sahne için tek bir durağan kare üret ve görev cümlesini karenin yanına koy. Henüz hiçbir şey hareket etmesin.`,
      `${adim++}. Kareleri onaylayınca animasyona geç ve render et.`,
    );
  } else {
    satirlar.push(
      `${adim++}. Doğrudan animasyonu kur ve render et. Her sahnenin başına tek cümlelik görevini yorum olarak yaz: izleyici bu anda neyi anlamalı?`,
    );
  }
  satirlar.push(
    `${adim}. Notlarımı yönetmen gibi vereceğim ("her zoom'u 0,7x'e yavaşlat", "burada sert kesim", "butona yaklaş"). Yalnız ilgili satırı değiştir ve yeniden render et, baştan başlama. Hareketle ilgili her kararda önce sahnenin görevine bak, referansın stili ikinci ölçü.`,
  );

  satirlar.push("", "TEKNİK", MOTOR_SATIRI[a.motor]);
  satirlar.push(
    a.ses
      ? "Ses: müzik ve ses efektlerini de sen tasarla; kesimleri vuruşlara oturt."
      : "Ses: şimdilik sessiz render et, müziği sonra ekleyeceğim.",
  );
  satirlar.push(
    "Metinler Türkçe olacak; ı, İ, ş, ğ karakterlerinin doğru render edildiğini karede kontrol et.",
  );

  return satirlar.join("\n");
}
