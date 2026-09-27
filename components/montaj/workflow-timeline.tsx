"use client";

// Altı adımlık akış, bir keyframe izi gibi. Toolcraft'taki zaman çizelgesi
// hapından (oynat, döngü, süre, konum) uyarlandı. Aktif adım, çalışma
// masasında ilgili alanı halka ile işaretler.

import { Pause, Play, Repeat } from "lucide-react";
import { useEffect } from "react";
import { cn } from "@/lib/cn";
import { ADIMLAR } from "@/lib/montaj/rehber";

const ADIM_MS = 4200;

interface Props {
  aktif: number;
  setAktif: (i: number) => void;
  oynuyor: boolean;
  setOynuyor: (v: boolean) => void;
}

export function AkisCizelgesi({ aktif, setAktif, oynuyor, setOynuyor }: Props) {
  useEffect(() => {
    if (!oynuyor) return;
    const t = window.setTimeout(() => setAktif((aktif + 1) % ADIMLAR.length), ADIM_MS);
    return () => window.clearTimeout(t);
  }, [oynuyor, aktif, setAktif]);

  const adim = aktif >= 0 ? ADIMLAR[aktif] : null;
  const konum = aktif >= 0 ? (aktif + 0.5) / ADIMLAR.length : 0;

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex h-10 shrink-0 items-center gap-3 border-b border-[color:var(--mj-line)] px-2.5">
        <div className="flex items-center gap-0.5 rounded-[8px] border border-[color:var(--mj-line)] bg-[color:var(--mj-sunk)] p-0.5">
          <button
            type="button"
            aria-label={oynuyor ? "Akışı durdur" : "Akışı oynat"}
            onClick={() => {
              if (aktif < 0) setAktif(0);
              setOynuyor(!oynuyor);
            }}
            className="grid size-6 place-items-center rounded-[6px] text-[color:var(--mj-ink)] hover:bg-[color:var(--mj-raise)]"
          >
            {oynuyor ? (
              <Pause className="size-3.5" fill="currentColor" strokeWidth={0} />
            ) : (
              <Play className="size-3.5" fill="currentColor" strokeWidth={0} />
            )}
          </button>
          <span className="grid size-6 place-items-center text-[color:var(--mj-ink-3)]" aria-hidden>
            <Repeat className="size-3.5" />
          </span>
        </div>
        <span className="text-[13px] font-medium">İş akışı</span>
        <span className="mj-mono text-[11px] text-[color:var(--mj-ink-3)]">süre: 6 adım</span>
        <span className="mj-mono ml-auto text-[11px] text-[color:var(--mj-ink-2)]">
          {aktif >= 0 ? `${String(aktif + 1).padStart(2, "0")} / 06` : "-- / 06"}
        </span>
      </div>

      <div className="relative min-h-0 flex-1 px-4 pb-3 pt-2">
        <div className="mj-noscroll -mx-4 overflow-x-auto px-4">
          <div className="min-w-[560px]">
            {/* cetvel */}
            <div className="relative h-4">
              {Array.from({ length: 25 }, (_, i) => i).map((i) => (
                <span
                  key={`c${i}`}
                  className={cn(
                    "absolute bottom-0 w-px bg-[color:var(--mj-line-strong)]",
                    i % 4 === 0 ? "h-2.5" : "h-1.5",
                  )}
                  style={{ left: `${(i / 24) * 100}%` }}
                />
              ))}
            </div>
            {/* iz */}
            <div className="relative mt-1 h-[54px] rounded-[8px] border border-[color:var(--mj-line)] bg-[color:var(--mj-sunk)]">
              {/* After Effects katman çubukları gibi: her adım kendi etiket renginde bir şerit. */}
              {ADIMLAR.map((a, i) => (
                <span
                  key={`s${a.no}`}
                  aria-hidden
                  className="absolute inset-y-1.5 rounded-[5px] border-l-2 transition-[background-color] duration-300"
                  style={{
                    left: `calc(${(i / ADIMLAR.length) * 100}% + 3px)`,
                    width: `calc(${100 / ADIMLAR.length}% - 6px)`,
                    borderColor: a.renk,
                    backgroundColor: `${a.renk}${i === aktif ? "4d" : "1f"}`,
                  }}
                />
              ))}
              {aktif >= 0 ? (
                <span
                  className="absolute inset-y-0 w-px transition-[left,background-color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                  style={{ left: `${konum * 100}%`, backgroundColor: ADIMLAR[aktif].renk }}
                >
                  <span
                    className="absolute -top-1 left-1/2 size-2 -translate-x-1/2 rotate-45"
                    style={{ backgroundColor: ADIMLAR[aktif].renk }}
                  />
                </span>
              ) : null}
              {ADIMLAR.map((a, i) => {
                const secili = i === aktif;
                return (
                  <button
                    key={a.no}
                    type="button"
                    onClick={() => {
                      setOynuyor(false);
                      setAktif(secili ? -1 : i);
                    }}
                    aria-pressed={secili}
                    className="group absolute top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1.5"
                    style={{ left: `${((i + 0.5) / ADIMLAR.length) * 100}%` }}
                  >
                    <span
                      className={cn(
                        "size-2.5 rotate-45 border transition-transform duration-200 group-hover:scale-125",
                        secili ? "scale-150 border-[color:var(--mj-ink)]" : "border-transparent",
                      )}
                      style={{ backgroundColor: a.renk }}
                    />
                    <span
                      className={cn(
                        "mj-mono whitespace-nowrap text-[10px] transition-colors",
                        secili
                          ? "text-[color:var(--mj-ink)]"
                          : "text-[color:var(--mj-ink-2)] group-hover:text-[color:var(--mj-ink)]",
                      )}
                    >
                      {a.no} {a.kisa}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        <p
          className="mt-2 min-h-[1.25rem] truncate text-[12px] text-[color:var(--mj-ink-2)]"
          aria-live="polite"
        >
          {adim ? (
            <>
              <span
                className="mr-1.5 inline-block size-2 -translate-y-px rotate-45"
                style={{ backgroundColor: adim.renk }}
              />
              <span className="text-[color:var(--mj-ink)]">{adim.baslik}.</span> {adim.metin}
            </>
          ) : (
            "Bir adıma tıklayınca masada karşılık gelen alan işaretlenir."
          )}
        </p>
      </div>
    </div>
  );
}
