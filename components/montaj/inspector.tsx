"use client";

import { ArrowRight, Check, Copy, ExternalLink, Minus, Plus, X } from "lucide-react";
import { useMemo, useState } from "react";
import { cn } from "@/lib/cn";
import {
  type Klip,
  medyaUrl,
  STIL_ETIKET,
  STIL_RENK,
  sayiYaz,
  sureYaz,
  TEKNIK_ETIKET,
  TEMPO_ETIKET,
  tarihYaz,
  ZEMIN_ETIKET,
} from "@/lib/montaj";
import { type Format, type Motor, type PromptAyar, promptKur } from "@/lib/montaj/prompt";
import type { OdakAlani } from "@/lib/montaj/rehber";
import { Anahtar, Bolum, IkonDugme, Kaydirici, Metin, Segment } from "./controls";
import { Oynatici } from "./player";

export type Sekme = "klip" | "prompt";

function useKopyala(): [string | null, (anahtar: string, metin: string) => void] {
  const [son, setSon] = useState<string | null>(null);
  const kopyala = (anahtar: string, metin: string) => {
    navigator.clipboard
      ?.writeText(metin)
      .then(() => {
        setSon(anahtar);
        window.setTimeout(() => setSon((s) => (s === anahtar ? null : s)), 1600);
      })
      .catch(() => {});
  };
  return [son, kopyala];
}

function Rozet({
  children,
  claude,
  renk,
}: {
  children: React.ReactNode;
  claude?: boolean;
  renk?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex h-6 items-center gap-1.5 rounded-[6px] border px-2 text-[11px]",
        claude
          ? "border-transparent bg-[color:var(--mj-claude)] font-medium text-[#0e0e0c]"
          : "border-[color:var(--mj-line)] bg-[color:var(--mj-raise)] text-[color:var(--mj-ink-2)]",
      )}
    >
      {renk ? <span className="size-[7px] rounded-[2px]" style={{ background: renk }} /> : null}
      {children}
    </span>
  );
}

interface Props {
  klip: Klip | null;
  referanslar: Klip[];
  onReferans: (id: string) => void;
  ayar: PromptAyar;
  setAyar: (a: PromptAyar) => void;
  sekme: Sekme;
  setSekme: (s: Sekme) => void;
  odak: OdakAlani | null;
  otomatikOynat: boolean;
  onKapat?: () => void;
}

export function Inceleyici({
  klip,
  referanslar,
  onReferans,
  ayar,
  setAyar,
  sekme,
  setSekme,
  odak,
  otomatikOynat,
  onKapat,
}: Props) {
  const [son, kopyala] = useKopyala();
  const promptRefs = referanslar.length ? referanslar : klip ? [klip] : [];
  const prompt = useMemo(() => promptKur(promptRefs, ayar), [promptRefs, ayar]);
  const referansta = klip ? referanslar.some((r) => r.id === klip.id) : false;
  const guncelle = <K extends keyof PromptAyar>(k: K, v: PromptAyar[K]) =>
    setAyar({ ...ayar, [k]: v });

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex h-10 shrink-0 items-center justify-between border-b border-[color:var(--mj-line)] pl-1.5 pr-2">
        <div role="tablist" aria-label="İnceleyici" className="flex h-full items-stretch">
          {(
            [
              ["klip", "Klip"],
              ["prompt", "Prompt"],
            ] as const
          ).map(([k, etiket]) => (
            <button
              key={k}
              type="button"
              role="tab"
              aria-selected={sekme === k}
              onClick={() => setSekme(k)}
              className={cn(
                "relative px-2.5 text-[13px] font-medium transition-colors",
                sekme === k
                  ? "text-[color:var(--mj-ink)]"
                  : "text-[color:var(--mj-ink-3)] hover:text-[color:var(--mj-ink)]",
              )}
            >
              {etiket}
              {k === "prompt" && referanslar.length ? (
                <span className="mj-mono ml-1 text-[10px] text-[color:var(--mj-ink-3)]">
                  {referanslar.length}/2
                </span>
              ) : null}
              {sekme === k ? (
                <span className="absolute inset-x-2.5 bottom-[-1px] h-[1.5px] rounded bg-[color:var(--mj-ink)]" />
              ) : null}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-0.5">
          {klip ? (
            <IkonDugme etiket="Orijinal gönderiyi X'te aç" href={klip.tweetUrl}>
              <ExternalLink className="size-3.5" />
            </IkonDugme>
          ) : null}
          {onKapat ? (
            <IkonDugme etiket="Kapat" onClick={onKapat}>
              <X className="size-4" />
            </IkonDugme>
          ) : null}
        </div>
      </div>

      <div className="mj-scroll min-h-0 flex-1 overflow-y-auto">
        {sekme === "klip" ? (
          klip ? (
            <div>
              <div className="p-3">
                <Oynatici klip={klip} otomatik={otomatikOynat} />
              </div>
              <div className="px-3.5 pb-3">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-[17px] font-semibold leading-tight tracking-[-0.02em]">
                    {klip.urun}
                  </h2>
                  {klip.kaynak === "opus55" ? <Rozet claude>Opus 5.5</Rozet> : null}
                </div>
                <p className="mt-1 text-[13px] leading-snug text-[color:var(--mj-ink-2)]">
                  {klip.ozet}
                </p>
              </div>
              <dl className="mj-mono grid grid-cols-[88px_1fr] gap-y-1.5 border-y border-[color:var(--mj-line)] px-3.5 py-3 text-[11px]">
                <dt className="text-[color:var(--mj-ink-3)]">kaynak</dt>
                <dd className="truncate">@{klip.yazar}</dd>
                <dt className="text-[color:var(--mj-ink-3)]">süre</dt>
                <dd>{sureYaz(klip.sure)}</dd>
                <dt className="text-[color:var(--mj-ink-3)]">tarih</dt>
                <dd>{tarihYaz(klip.tarih)}</dd>
                <dt className="text-[color:var(--mj-ink-3)]">zemin</dt>
                <dd>{ZEMIN_ETIKET[klip.zemin].toLocaleLowerCase("tr")}</dd>
                <dt className="text-[color:var(--mj-ink-3)]">tempo</dt>
                <dd>{TEMPO_ETIKET[klip.tempo].toLocaleLowerCase("tr")}</dd>
                {klip.izlenme ? (
                  <>
                    <dt className="text-[color:var(--mj-ink-3)]">izlenme</dt>
                    <dd>{sayiYaz(klip.izlenme)}</dd>
                  </>
                ) : null}
              </dl>
              <div className="flex flex-wrap gap-1.5 px-3.5 pt-3">
                {klip.stil.map((s) => (
                  <Rozet key={s} renk={STIL_RENK[s]}>
                    {STIL_ETIKET[s]}
                  </Rozet>
                ))}
                {klip.teknik.map((t) => (
                  <Rozet key={t}>{TEKNIK_ETIKET[t]}</Rozet>
                ))}
              </div>
              <Bolum etiket="Ekranda ne var" className="border-b-0">
                <p className="text-[13px] leading-relaxed text-[color:var(--mj-ink)]">
                  {klip.gorsel}
                </p>
              </Bolum>
              <div className="px-3.5 pb-3.5" data-mj-odak={odak === "yonetmen" ? "1" : undefined}>
                <div className="rounded-[10px] border border-[color:var(--mj-line)] bg-[color:var(--mj-raise)] p-3">
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="mj-mono text-[10px] uppercase tracking-[0.14em] text-[color:var(--mj-ink-3)]">
                      Yönetmen notu
                    </span>
                    <button
                      type="button"
                      onClick={() => kopyala("not", klip.not)}
                      className="mj-mono flex items-center gap-1 text-[10px] text-[color:var(--mj-ink-2)] hover:text-[color:var(--mj-ink)]"
                    >
                      {son === "not" ? <Check className="size-3" /> : <Copy className="size-3" />}
                      {son === "not" ? "kopyalandı" : "kopyala"}
                    </button>
                  </div>
                  <p className="mj-serif text-[15px] italic leading-snug">{klip.not}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 px-3.5 pb-4">
                <button
                  type="button"
                  onClick={() => onReferans(klip.id)}
                  disabled={!referansta && referanslar.length >= 2}
                  className="flex h-9 items-center justify-center gap-1.5 rounded-[9px] border border-[color:var(--mj-line-strong)] text-[12px] font-medium transition hover:bg-[color:var(--mj-raise)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {referansta ? <Minus className="size-3.5" /> : <Plus className="size-3.5" />}
                  {referansta ? "Referanstan çıkar" : "Referansa ekle"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!referansta && referanslar.length === 0) onReferans(klip.id);
                    setSekme("prompt");
                  }}
                  className="flex h-9 items-center justify-center gap-1.5 rounded-[9px] bg-[color:var(--mj-sel)] text-[12px] font-medium text-[color:var(--mj-on-sel)] transition active:scale-[0.98]"
                >
                  Prompt oluştur
                  <ArrowRight className="size-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="grid h-full place-items-center p-8 text-center text-[13px] text-[color:var(--mj-ink-3)]">
              Kütüphaneden bir klip seç.
            </div>
          )
        ) : (
          <div>
            <Bolum etiket="Referanslar" sag={`${promptRefs.length}/2`}>
              {promptRefs.length ? (
                <ul className="grid gap-1.5">
                  {promptRefs.map((r) => (
                    <li
                      key={r.id}
                      className="flex items-center gap-2.5 rounded-[9px] border border-[color:var(--mj-line)] bg-[color:var(--mj-raise)] p-1.5 pr-2"
                    >
                      {/* biome-ignore lint/performance/noImgElement: kalıcı birimdeki afiş */}
                      <img
                        src={medyaUrl(r.id, "afis")}
                        alt=""
                        className="h-8 w-14 shrink-0 rounded-[5px] object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-[12px] font-medium">{r.urun}</div>
                        <div className="truncate text-[11px] text-[color:var(--mj-ink-3)]">
                          {r.stil.map((s) => STIL_ETIKET[s]).join(" · ")}
                        </div>
                      </div>
                      {referanslar.some((x) => x.id === r.id) ? (
                        <IkonDugme etiket="Referanstan çıkar" onClick={() => onReferans(r.id)}>
                          <X className="size-3.5" />
                        </IkonDugme>
                      ) : null}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-[12px] text-[color:var(--mj-ink-3)]">
                  Önce kütüphaneden bir klip seç.
                </p>
              )}
              <p className="mt-2 text-[11px] leading-snug text-[color:var(--mj-ink-3)]">
                En fazla iki referans eklenebilir. Stili tarif etmek yerine örnek göstermek daha iyi
                çalışıyor.
              </p>
            </Bolum>
            <Bolum etiket="Motor ve format">
              <div className="grid gap-3">
                <Segment<Motor>
                  ad="Motor"
                  deger={ayar.motor}
                  odak={odak === "motor"}
                  secenekler={[
                    { deger: "hyperframes", etiket: "HyperFrames" },
                    { deger: "remotion", etiket: "Remotion" },
                  ]}
                  onChange={(v) => guncelle("motor", v)}
                />
                <Segment<Format>
                  ad="Format"
                  deger={ayar.format}
                  secenekler={[
                    { deger: "16:9", etiket: "16:9" },
                    { deger: "9:16", etiket: "9:16" },
                    { deger: "1:1", etiket: "1:1" },
                  ]}
                  onChange={(v) => guncelle("format", v)}
                />
                <Kaydirici
                  ad="Süre"
                  deger={ayar.sure}
                  min={10}
                  max={60}
                  adim={5}
                  birim=" sn"
                  onChange={(v) => guncelle("sure", v)}
                />
                <Kaydirici
                  ad="Tempo (referansa göre)"
                  deger={ayar.tempo}
                  min={0.5}
                  max={1.5}
                  adim={0.1}
                  yaz={(v) => `${v.toFixed(1).replace(".", ",")}x`}
                  odak={odak === "yonetmen"}
                  onChange={(v) => guncelle("tempo", v)}
                />
              </div>
            </Bolum>
            <Bolum etiket="Marka">
              <div className="grid gap-3" data-mj-odak={odak === "marka" ? "1" : undefined}>
                <Metin
                  ad="Ürün adı"
                  deger={ayar.urun}
                  yerTutucu="ör. Kargo Takip"
                  onChange={(v) => guncelle("urun", v)}
                />
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[12px] text-[color:var(--mj-ink-2)]">Renkler</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      aria-label="Birinci renk"
                      value={ayar.renk1}
                      onChange={(e) => guncelle("renk1", e.target.value)}
                      className="mj-swatch"
                    />
                    <input
                      type="color"
                      aria-label="İkinci renk"
                      value={ayar.renk2}
                      onChange={(e) => guncelle("renk2", e.target.value)}
                      className="mj-swatch"
                    />
                    <span className="mj-mono text-[11px] text-[color:var(--mj-ink-2)]">
                      {ayar.renk1.toUpperCase()} · {ayar.renk2.toUpperCase()}
                    </span>
                  </div>
                </div>
                <Metin
                  ad="Font"
                  deger={ayar.font}
                  yerTutucu="ör. Geist, Fraunces"
                  onChange={(v) => guncelle("font", v)}
                />
              </div>
            </Bolum>
            <Bolum etiket="Akış">
              <div className="grid gap-3" data-mj-odak={odak === "storyboard" ? "1" : undefined}>
                <Anahtar
                  ad="Önce storyboard ve durağan kare"
                  deger={ayar.storyboard}
                  onChange={(v) => guncelle("storyboard", v)}
                />
                {ayar.storyboard ? (
                  <Kaydirici
                    ad="Storyboard varyantı"
                    deger={ayar.varyant}
                    min={1}
                    max={5}
                    onChange={(v) => guncelle("varyant", v)}
                  />
                ) : null}
                <Anahtar
                  ad="Müzik ve ses tasarımı"
                  deger={ayar.ses}
                  onChange={(v) => guncelle("ses", v)}
                />
              </div>
            </Bolum>
            <Bolum etiket="Prompt" sag={`${prompt.length} karakter`} className="border-b-0">
              <pre
                data-mj-odak={odak === "bilesen" ? "1" : undefined}
                className="mj-mono mj-scroll max-h-72 overflow-auto whitespace-pre-wrap rounded-[10px] border border-[color:var(--mj-line)] bg-[color:var(--mj-sunk)] p-3 text-[11px] leading-relaxed text-[color:var(--mj-ink-2)]"
              >
                {prompt}
              </pre>
            </Bolum>
          </div>
        )}
      </div>

      {sekme === "prompt" ? (
        <div className="shrink-0 border-t border-[color:var(--mj-line)] p-3">
          <button
            type="button"
            onClick={() => kopyala("prompt", prompt)}
            className="flex h-10 w-full items-center justify-center gap-2 rounded-[10px] bg-[color:var(--mj-sel)] text-[13px] font-medium text-[color:var(--mj-on-sel)] transition active:scale-[0.99]"
          >
            {son === "prompt" ? <Check className="size-4" /> : <Copy className="size-4" />}
            {son === "prompt" ? "Kopyalandı, Claude'a yapıştır" : "Prompt'u kopyala"}
          </button>
        </div>
      ) : null}
    </div>
  );
}
