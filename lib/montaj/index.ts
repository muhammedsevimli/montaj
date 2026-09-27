import veri from "./data/klipler.json";
import type { Klip } from "./types";

export * from "./types";

/** Derlenmiş kütüphane. Sıra: Opus 5.5 örnekleri, sonra puan ve tazelik. */
export const KLIPLER: Klip[] = (veri as Klip[]).slice().sort((a, b) => {
  if (a.kaynak !== b.kaynak) return a.kaynak === "opus55" ? -1 : 1;
  if (b.puan !== a.puan) return b.puan - a.puan;
  return b.tarih.localeCompare(a.tarih);
});

/**
 * Medya adresleri. Videolar başka creator'ların içeriği olduğu için repoda yok;
 * önizleme, afiş ve videolar muhammedsevimli.com'dan akar. Kendi kopyanı
 * yayınlıyorsan NEXT_PUBLIC_MONTAJ_MEDYA ile başka bir adres ver.
 */
const MEDYA = (process.env.NEXT_PUBLIC_MONTAJ_MEDYA ?? "https://muhammedsevimli.com/montaj-medya").replace(
  /\/$/,
  "",
);

export function medyaUrl(id: string, tur: "video" | "onizleme" | "afis"): string {
  if (tur === "video") return `${MEDYA}/${id}.mp4`;
  if (tur === "onizleme") return `${MEDYA}/${id}-p.mp4`;
  return `${MEDYA}/${id}.webp`;
}

export function sureYaz(saniye: number): string {
  const s = Math.max(0, Math.round(saniye));
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

const AYLAR = ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"];

export function tarihYaz(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return `${d.getUTCDate()} ${AYLAR[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

export function sayiYaz(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(".", ",")} Mn`;
  if (n >= 1_000) return `${Math.round(n / 1_000)} B`;
  return String(n);
}

/** Türkçe arama: diakritik ve büyük harf duyarsız. */
export function normalize(value: string): string {
  return value
    .toLocaleLowerCase("tr-TR")
    .replaceAll("ı", "i")
    .replaceAll("ş", "s")
    .replaceAll("ğ", "g")
    .replaceAll("ü", "u")
    .replaceAll("ö", "o")
    .replaceAll("ç", "c")
    .replaceAll("â", "a");
}
