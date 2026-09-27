"use client";

import { memo, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { type Klip, medyaUrl, STIL_ETIKET, STIL_RENK, sureYaz, TEMPO_ETIKET } from "@/lib/montaj";

interface Props {
  klip: Klip;
  sira: number;
  secili: boolean;
  referans: boolean;
  onSec: (id: string) => void;
}

/** Izgara kartı: afiş, üstüne gelince 8 saniyelik sessiz önizleme. */
function KlipKartiIc({ klip, sira, secili, referans, onSec }: Props) {
  const [uzerinde, setUzerinde] = useState(false);
  const [hazir, setHazir] = useState(false);
  const [ilerleme, setIlerleme] = useState(0);
  // Afiş geçici olarak gelmezse (deploy anı, ağ kesintisi) iki kez yeniden dener.
  const [deneme, setDeneme] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const renk = STIL_RENK[klip.stil[0]] ?? "var(--mj-ink)";

  useEffect(() => {
    if (!uzerinde) {
      setHazir(false);
      setIlerleme(0);
    }
  }, [uzerinde]);

  const dikey = klip.oran === "dikey";

  return (
    <button
      type="button"
      onClick={() => onSec(klip.id)}
      onPointerEnter={(e) => {
        if (e.pointerType === "mouse") setUzerinde(true);
      }}
      onPointerLeave={() => setUzerinde(false)}
      onFocus={() => setUzerinde(true)}
      onBlur={() => setUzerinde(false)}
      aria-pressed={secili}
      data-klip={klip.id}
      aria-label={`${klip.urun}: ${klip.ozet}`}
      className="group block w-full text-left outline-none"
      style={{ "--mj-renk": renk } as React.CSSProperties}
    >
      <div
        className={cn(
          "relative aspect-video overflow-hidden rounded-[9px] border bg-[color:var(--mj-sunk)] transition-[border-color,box-shadow] duration-200",
          secili
            ? "border-[color:var(--mj-ink)] shadow-[0_0_0_1px_var(--mj-ink)]"
            : "border-[color:var(--mj-line)] group-hover:border-[color:var(--mj-renk)] group-focus-visible:border-[color:var(--mj-ink)]",
        )}
      >
        {/* biome-ignore lint/performance/noImgElement: afişler kalıcı birimden geliyor, next/image optimizasyonu dışında */}
        <img
          src={deneme ? `${medyaUrl(klip.id, "afis")}?r=${deneme}` : medyaUrl(klip.id, "afis")}
          alt=""
          onError={() => {
            if (deneme < 2) window.setTimeout(() => setDeneme((d) => d + 1), 1200 * (deneme + 1));
          }}
          loading={sira < 12 ? "eager" : "lazy"}
          decoding="async"
          className={cn(
            "absolute inset-0 size-full transition-[transform,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.025]",
            dikey ? "object-contain" : "object-cover",
            hazir && "opacity-0",
          )}
        />
        {uzerinde ? (
          <video
            ref={videoRef}
            src={medyaUrl(klip.id, "onizleme")}
            muted
            playsInline
            autoPlay
            loop
            preload="auto"
            onPlaying={() => setHazir(true)}
            onTimeUpdate={(e) => {
              const v = e.currentTarget;
              if (v.duration) setIlerleme(v.currentTime / v.duration);
            }}
            className={cn(
              "absolute inset-0 size-full transition-opacity duration-300",
              dikey ? "object-contain" : "object-cover",
              hazir ? "opacity-100" : "opacity-0",
            )}
          />
        ) : null}

        <span className="mj-mono absolute left-2 top-2 rounded-[5px] bg-[color:var(--mj-canvas)]/85 px-1.5 py-0.5 text-[10px] text-[color:var(--mj-ink-2)] backdrop-blur-sm">
          #{String(sira + 1).padStart(3, "0")}
        </span>
        {klip.kaynak === "opus55" ? (
          <span className="mj-mono absolute right-2 top-2 rounded-[5px] bg-[color:var(--mj-claude)] px-1.5 py-0.5 text-[10px] font-medium text-[#0e0e0c]">
            Opus 5.5
          </span>
        ) : null}
        {referans ? (
          <span className="mj-mono absolute bottom-2 left-2 rounded-[5px] border border-[color:var(--mj-ink)] bg-[color:var(--mj-canvas)] px-1.5 py-0.5 text-[10px] text-[color:var(--mj-ink)]">
            referans
          </span>
        ) : null}
        <span className="mj-mono absolute bottom-2 right-2 rounded-[5px] bg-[color:var(--mj-canvas)]/85 px-1.5 py-0.5 text-[10px] text-[color:var(--mj-ink)] backdrop-blur-sm">
          {sureYaz(klip.sure)}
        </span>
        {uzerinde ? (
          <span
            className="absolute bottom-0 left-0 h-[3px] bg-[color:var(--mj-renk)]"
            style={{ width: `${ilerleme * 100}%` }}
          />
        ) : null}
      </div>
      <div className="mt-2 flex items-baseline justify-between gap-2 px-0.5">
        <span className="truncate text-[13px] font-medium tracking-[-0.01em]">{klip.urun}</span>
        <span className="mj-mono shrink-0 text-[10px] text-[color:var(--mj-ink-3)]">
          {TEMPO_ETIKET[klip.tempo].toLocaleLowerCase("tr")}
        </span>
      </div>
      <div className="flex items-center gap-2.5 overflow-hidden whitespace-nowrap px-0.5 text-[12px] text-[color:var(--mj-ink-3)]">
        {klip.stil.map((s) => (
          <span key={s} className="inline-flex shrink-0 items-center gap-1.5">
            <span className="size-[7px] rounded-[2px]" style={{ background: STIL_RENK[s] }} />
            {STIL_ETIKET[s]}
          </span>
        ))}
      </div>
    </button>
  );
}

export const KlipKarti = memo(KlipKartiIc);
