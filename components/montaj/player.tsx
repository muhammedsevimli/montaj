"use client";

import { Pause, Play, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { type Klip, medyaUrl, sureYaz } from "@/lib/montaj";

/** İnceleyici oynatıcısı: tıkla oynat, ince zaman çubuğu, ses anahtarı. */
export function Oynatici({ klip, otomatik }: { klip: Klip; otomatik: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [oynuyor, setOynuyor] = useState(false);
  const [sessiz, setSessiz] = useState(true);
  const [an, setAn] = useState(0);
  const [sure, setSure] = useState(klip.sure);

  // biome-ignore lint/correctness/useExhaustiveDependencies: klip değişince oynatıcı sıfırlanır
  useEffect(() => {
    setAn(0);
    setSure(klip.sure);
    setOynuyor(false);
    const v = ref.current;
    if (v && otomatik) {
      v.muted = true;
      setSessiz(true);
      v.play().catch(() => {});
    }
  }, [klip.id]);

  const degistir = () => {
    const v = ref.current;
    if (!v) return;
    if (v.paused) v.play().catch(() => {});
    else v.pause();
  };

  const sar = (e: React.PointerEvent<HTMLDivElement>) => {
    const v = ref.current;
    if (!v?.duration) return;
    const r = e.currentTarget.getBoundingClientRect();
    v.currentTime = Math.min(
      v.duration,
      Math.max(0, ((e.clientX - r.left) / r.width) * v.duration),
    );
  };

  const dikey = klip.oran === "dikey";

  return (
    <div className="overflow-hidden rounded-[10px] border border-[color:var(--mj-line)] bg-[color:var(--mj-sunk)]">
      <div className="relative aspect-video">
        <video
          key={klip.id}
          ref={ref}
          src={medyaUrl(klip.id, "video")}
          poster={medyaUrl(klip.id, "afis")}
          playsInline
          muted={sessiz}
          preload="metadata"
          loop
          onClick={degistir}
          onPlay={() => setOynuyor(true)}
          onPause={() => setOynuyor(false)}
          onTimeUpdate={(e) => setAn(e.currentTarget.currentTime)}
          onLoadedMetadata={(e) => setSure(e.currentTarget.duration || klip.sure)}
          className={cn(
            "absolute inset-0 size-full cursor-pointer",
            dikey ? "object-contain" : "object-cover",
          )}
        />
        {!oynuyor ? (
          <button
            type="button"
            onClick={degistir}
            aria-label="Oynat"
            className="absolute left-1/2 top-1/2 grid size-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-[color:var(--mj-sel)] text-[color:var(--mj-on-sel)] shadow-lg transition-transform duration-200 hover:scale-105 active:scale-95"
          >
            <Play className="ml-0.5 size-4" fill="currentColor" strokeWidth={0} />
          </button>
        ) : null}
      </div>
      <div className="flex items-center gap-2.5 border-t border-[color:var(--mj-line)] px-2.5 py-2">
        <button
          type="button"
          onClick={degistir}
          aria-label={oynuyor ? "Duraklat" : "Oynat"}
          className="grid size-6 place-items-center rounded-[6px] text-[color:var(--mj-ink)] hover:bg-[color:var(--mj-raise)]"
        >
          {oynuyor ? (
            <Pause className="size-3.5" fill="currentColor" strokeWidth={0} />
          ) : (
            <Play className="size-3.5" fill="currentColor" strokeWidth={0} />
          )}
        </button>
        <div
          role="slider"
          aria-label="Zaman"
          aria-valuemin={0}
          aria-valuemax={Math.round(sure)}
          aria-valuenow={Math.round(an)}
          tabIndex={0}
          onPointerDown={sar}
          onKeyDown={(e) => {
            const v = ref.current;
            if (!v) return;
            if (e.key === "ArrowRight")
              v.currentTime = Math.min(v.duration || 0, v.currentTime + 2);
            if (e.key === "ArrowLeft") v.currentTime = Math.max(0, v.currentTime - 2);
          }}
          className="relative h-4 flex-1 cursor-pointer"
        >
          <span className="absolute inset-x-0 top-1/2 h-[2px] -translate-y-1/2 rounded bg-[color:var(--mj-line-strong)]" />
          <span
            className="absolute left-0 top-1/2 h-[2px] -translate-y-1/2 rounded bg-[color:var(--mj-ink)]"
            style={{ width: `${sure ? (an / sure) * 100 : 0}%` }}
          />
        </div>
        <span className="mj-mono text-[11px] text-[color:var(--mj-ink-2)]">
          {sureYaz(an)} / {sureYaz(sure)}
        </span>
        <button
          type="button"
          onClick={() => setSessiz((s) => !s)}
          aria-label={sessiz ? "Sesi aç" : "Sesi kapat"}
          className="grid size-6 place-items-center rounded-[6px] text-[color:var(--mj-ink-2)] hover:bg-[color:var(--mj-raise)] hover:text-[color:var(--mj-ink)]"
        >
          {sessiz ? <VolumeX className="size-3.5" /> : <Volume2 className="size-3.5" />}
        </button>
      </div>
    </div>
  );
}
