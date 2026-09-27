"use client";

import { ChevronDown, Film, RotateCcw, Sparkles, Star } from "lucide-react";
import { type ReactNode, useState } from "react";
import { cn } from "@/lib/cn";
import {
  STIL_ETIKET,
  STIL_RENK,
  STILLER,
  type Stil,
  TEKNIK_ETIKET,
  TEKNIKLER,
  type Teknik,
  type Tempo,
  type Zemin,
} from "@/lib/montaj";
import { Kaydirici, PanelBaslik, Segment } from "./controls";

export type Koleksiyon = "hepsi" | "opus55" | "secki";

export interface Filtre {
  koleksiyon: Koleksiyon;
  stiller: Stil[];
  zemin: Zemin | "hepsi";
  tempo: Tempo | "hepsi";
  maxSure: number;
  teknikler: Teknik[];
}

export const BOS_FILTRE: Filtre = {
  koleksiyon: "hepsi",
  stiller: [],
  zemin: "hepsi",
  tempo: "hepsi",
  maxSure: 90,
  teknikler: [],
};

export function filtreDolu(f: Filtre): boolean {
  return (
    f.koleksiyon !== "hepsi" ||
    f.stiller.length > 0 ||
    f.zemin !== "hepsi" ||
    f.tempo !== "hepsi" ||
    f.maxSure < 90 ||
    f.teknikler.length > 0
  );
}

function Grup({
  ad,
  sayi,
  children,
  acik: ilk = true,
}: {
  ad: string;
  sayi?: string;
  children: ReactNode;
  acik?: boolean;
}) {
  const [acik, setAcik] = useState(ilk);
  return (
    <div className="border-b border-[color:var(--mj-line)] last:border-b-0">
      <button
        type="button"
        onClick={() => setAcik((a) => !a)}
        aria-expanded={acik}
        className="flex h-9 w-full items-center gap-1.5 px-3 text-left text-[12px] font-medium text-[color:var(--mj-ink)] hover:bg-[color:var(--mj-raise)]/60"
      >
        <ChevronDown
          className={cn(
            "size-3.5 text-[color:var(--mj-ink-3)] transition-transform duration-200",
            !acik && "-rotate-90",
          )}
        />
        <span className="flex-1">{ad}</span>
        {sayi ? (
          <span className="mj-mono text-[10px] font-normal text-[color:var(--mj-ink-3)]">
            {sayi}
          </span>
        ) : null}
      </button>
      {acik ? <div className="pb-2">{children}</div> : null}
    </div>
  );
}

function Satir({
  ikon,
  ad,
  sayi,
  secili,
  onClick,
}: {
  ikon: ReactNode;
  ad: string;
  sayi: number;
  secili: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={secili}
      disabled={sayi === 0}
      className={cn(
        "mx-1.5 flex h-[30px] w-[calc(100%-12px)] items-center gap-2 rounded-[7px] px-2.5 text-left text-[12px] transition-colors duration-150 disabled:opacity-35",
        secili
          ? "bg-[color:var(--mj-sel)] text-[color:var(--mj-on-sel)]"
          : "text-[color:var(--mj-ink-2)] hover:bg-[color:var(--mj-raise)] hover:text-[color:var(--mj-ink)]",
      )}
    >
      <span className={cn("shrink-0", secili ? "opacity-90" : "text-[color:var(--mj-ink-3)]")}>
        {ikon}
      </span>
      <span className="flex-1 truncate">{ad}</span>
      <span
        className={cn(
          "mj-mono text-[10px]",
          secili ? "opacity-70" : "text-[color:var(--mj-ink-3)]",
        )}
      >
        {sayi}
      </span>
    </button>
  );
}

interface Props {
  filtre: Filtre;
  setFiltre: (f: Filtre) => void;
  sayim: {
    toplam: number;
    opus55: number;
    secki: number;
    stil: Record<string, number>;
    teknik: Record<string, number>;
  };
  className?: string;
  baslikGizli?: boolean;
}

export function KatmanPaneli({ filtre, setFiltre, sayim, className, baslikGizli }: Props) {
  const degis = <K extends keyof Filtre>(k: K, v: Filtre[K]) => setFiltre({ ...filtre, [k]: v });
  const toggle = <T extends string>(liste: T[], v: T): T[] =>
    liste.includes(v) ? liste.filter((x) => x !== v) : [...liste, v];

  return (
    <div className={cn("flex min-h-0 flex-col", className)}>
      {baslikGizli ? null : (
        <PanelBaslik
          baslik="Katmanlar"
          sag={
            filtreDolu(filtre) ? (
              <button
                type="button"
                onClick={() => setFiltre(BOS_FILTRE)}
                aria-label="Filtreleri sıfırla"
                title="Filtreleri sıfırla"
                className="grid size-7 place-items-center rounded-[7px] text-[color:var(--mj-ink-2)] hover:bg-[color:var(--mj-raise)] hover:text-[color:var(--mj-ink)]"
              >
                <RotateCcw className="size-3.5" />
              </button>
            ) : null
          }
        />
      )}
      <div className="mj-scroll min-h-0 flex-1 overflow-y-auto">
        <Grup ad="Koleksiyon">
          <Satir
            ikon={<Film className="size-3.5" />}
            ad="Tüm klipler"
            sayi={sayim.toplam}
            secili={filtre.koleksiyon === "hepsi"}
            onClick={() => degis("koleksiyon", "hepsi")}
          />
          <Satir
            ikon={<Sparkles className="size-3.5 text-[color:var(--mj-claude)]" />}
            ad="Opus 5.5 ile yapılanlar"
            sayi={sayim.opus55}
            secili={filtre.koleksiyon === "opus55"}
            onClick={() => degis("koleksiyon", filtre.koleksiyon === "opus55" ? "hepsi" : "opus55")}
          />
          <Satir
            ikon={<Star className="size-3.5" />}
            ad="Seçki"
            sayi={sayim.secki}
            secili={filtre.koleksiyon === "secki"}
            onClick={() => degis("koleksiyon", filtre.koleksiyon === "secki" ? "hepsi" : "secki")}
          />
        </Grup>
        <Grup
          ad="Stil"
          sayi={filtre.stiller.length ? `${filtre.stiller.length} seçili` : undefined}
        >
          {STILLER.map((s) => (
            <Satir
              key={s}
              ikon={
                <span
                  className="block size-2.5 rounded-[3px] shadow-[inset_0_0_0_1px_rgb(0_0_0/0.18)]"
                  style={{ background: STIL_RENK[s] }}
                />
              }
              ad={STIL_ETIKET[s]}
              sayi={sayim.stil[s] ?? 0}
              secili={filtre.stiller.includes(s)}
              onClick={() => degis("stiller", toggle(filtre.stiller, s))}
            />
          ))}
        </Grup>
        <Grup ad="Zemin ve tempo">
          <div className="grid gap-3 px-3 pt-1">
            <Segment<Zemin | "hepsi">
              ad="Zemin"
              deger={filtre.zemin}
              secenekler={[
                { deger: "hepsi", etiket: "Hepsi" },
                { deger: "koyu", etiket: "Koyu" },
                { deger: "acik", etiket: "Açık" },
                { deger: "renkli", etiket: "Renkli" },
              ]}
              onChange={(v) => degis("zemin", v)}
            />
            <Segment<Tempo | "hepsi">
              ad="Tempo"
              deger={filtre.tempo}
              secenekler={[
                { deger: "hepsi", etiket: "Hepsi" },
                { deger: "sakin", etiket: "Sakin" },
                { deger: "orta", etiket: "Orta" },
                { deger: "hizli", etiket: "Hızlı" },
              ]}
              onChange={(v) => degis("tempo", v)}
            />
            <Kaydirici
              ad="En uzun süre"
              deger={filtre.maxSure}
              min={10}
              max={90}
              adim={5}
              yaz={(v) => (v >= 90 ? "sınırsız" : `${v} sn`)}
              onChange={(v) => degis("maxSure", v)}
            />
          </div>
        </Grup>
        <Grup
          ad="Teknik"
          acik={false}
          sayi={filtre.teknikler.length ? `${filtre.teknikler.length} seçili` : undefined}
        >
          <div className="flex flex-wrap gap-1.5 px-3 pt-1">
            {TEKNIKLER.map((t) => {
              const secili = filtre.teknikler.includes(t);
              return (
                <button
                  key={t}
                  type="button"
                  aria-pressed={secili}
                  onClick={() => degis("teknikler", toggle(filtre.teknikler, t))}
                  className={cn(
                    "h-6 rounded-[6px] border px-2 text-[11px] transition-colors",
                    secili
                      ? "border-[color:var(--mj-ink)] bg-[color:var(--mj-sel)] text-[color:var(--mj-on-sel)]"
                      : "border-[color:var(--mj-line)] text-[color:var(--mj-ink-2)] hover:border-[color:var(--mj-line-strong)] hover:text-[color:var(--mj-ink)]",
                  )}
                >
                  {TEKNIK_ETIKET[t]}
                  <span className="mj-mono ml-1 opacity-60">{sayim.teknik[t] ?? 0}</span>
                </button>
              );
            })}
          </div>
        </Grup>
      </div>
    </div>
  );
}
