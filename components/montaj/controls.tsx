"use client";

// Toolcraft (MIT, pixel-point/toolcraft) kontrol dilinden uyarlanmış hafif kontroller:
// etiket solda, değer sağda; ince hatlı kaydırıcı, kare tutamak; segment seçici.
// Kütüphane taşınmadı, yalnız ölçü ve davranış dili alındı.

import type { ReactNode } from "react";
import { useId } from "react";
import { cn } from "@/lib/cn";

export function PanelBaslik({
  baslik,
  sag,
  className,
}: {
  baslik: ReactNode;
  sag?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex h-10 shrink-0 items-center justify-between gap-2 border-b border-[color:var(--mj-line)] px-3.5",
        className,
      )}
    >
      <div className="min-w-0 truncate text-[13px] font-medium tracking-[-0.01em]">{baslik}</div>
      {sag ? <div className="flex items-center gap-0.5">{sag}</div> : null}
    </div>
  );
}

export function IkonDugme({
  etiket,
  onClick,
  children,
  aktif,
  href,
}: {
  etiket: string;
  onClick?: () => void;
  children: ReactNode;
  aktif?: boolean;
  href?: string;
}) {
  const sinif = cn(
    "grid size-7 place-items-center rounded-[7px] text-[color:var(--mj-ink-2)] transition-colors duration-150",
    "hover:bg-[color:var(--mj-raise)] hover:text-[color:var(--mj-ink)] active:scale-[0.96]",
    "focus-visible:outline focus-visible:outline-1 focus-visible:outline-[color:var(--mj-ink)]",
    aktif && "bg-[color:var(--mj-raise)] text-[color:var(--mj-ink)]",
  );
  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={etiket}
        title={etiket}
        className={sinif}
      >
        {children}
      </a>
    );
  }
  return (
    <button type="button" aria-label={etiket} title={etiket} onClick={onClick} className={sinif}>
      {children}
    </button>
  );
}

export function Bolum({
  etiket,
  sag,
  children,
  className,
}: {
  etiket: string;
  sag?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "border-b border-[color:var(--mj-line)] px-3.5 py-3 last:border-b-0",
        className,
      )}
    >
      <div className="mb-2.5 flex items-center justify-between gap-2">
        <h3 className="mj-mono text-[10px] uppercase tracking-[0.14em] text-[color:var(--mj-ink-3)]">
          {etiket}
        </h3>
        {sag ? <div className="mj-mono text-[10px] text-[color:var(--mj-ink-3)]">{sag}</div> : null}
      </div>
      {children}
    </section>
  );
}

export function Kaydirici({
  ad,
  deger,
  min,
  max,
  adim = 1,
  birim,
  yaz,
  onChange,
  odak,
}: {
  ad: string;
  deger: number;
  min: number;
  max: number;
  adim?: number;
  birim?: string;
  yaz?: (v: number) => string;
  onChange: (v: number) => void;
  odak?: boolean;
}) {
  const id = useId();
  const dolu = ((deger - min) / (max - min)) * 100;
  return (
    <div className="grid gap-1" data-mj-odak={odak ? "1" : undefined}>
      <div className="flex items-center justify-between gap-3">
        <label htmlFor={id} className="text-[12px] text-[color:var(--mj-ink-2)]">
          {ad}
        </label>
        <span className="mj-mono text-[12px] text-[color:var(--mj-ink)]">
          {yaz ? yaz(deger) : deger}
          {birim ?? ""}
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={adim}
        value={deger}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mj-range"
        style={{ "--fill": `${dolu}%` } as React.CSSProperties}
      />
    </div>
  );
}

export function Segment<T extends string>({
  ad,
  deger,
  secenekler,
  onChange,
  odak,
  gizliAd,
}: {
  ad: string;
  deger: T;
  secenekler: ReadonlyArray<{ deger: T; etiket: string }>;
  onChange: (v: T) => void;
  odak?: boolean;
  gizliAd?: boolean;
}) {
  return (
    <div className="grid gap-1.5" data-mj-odak={odak ? "1" : undefined}>
      {gizliAd ? null : <span className="text-[12px] text-[color:var(--mj-ink-2)]">{ad}</span>}
      <fieldset
        aria-label={ad}
        className="m-0 flex h-7 min-w-0 items-stretch gap-0.5 rounded-[8px] border border-[color:var(--mj-line)] bg-[color:var(--mj-sunk)] p-0.5"
      >
        {secenekler.map((s) => {
          const secili = s.deger === deger;
          return (
            <button
              key={s.deger}
              type="button"
              aria-pressed={secili}
              onClick={() => onChange(s.deger)}
              className={cn(
                "min-w-0 flex-1 truncate rounded-[6px] px-1.5 text-[12px] transition-[background-color,color,box-shadow] duration-150",
                secili
                  ? "bg-[color:var(--mj-raise)] text-[color:var(--mj-ink)] shadow-[0_1px_2px_rgb(0_0_0/0.12)]"
                  : "text-[color:var(--mj-ink-3)] hover:text-[color:var(--mj-ink)]",
              )}
            >
              {s.etiket}
            </button>
          );
        })}
      </fieldset>
    </div>
  );
}

export function Metin({
  ad,
  deger,
  yerTutucu,
  onChange,
}: {
  ad: string;
  deger: string;
  yerTutucu?: string;
  onChange: (v: string) => void;
}) {
  const id = useId();
  return (
    <div className="grid gap-1.5">
      <label htmlFor={id} className="text-[12px] text-[color:var(--mj-ink-2)]">
        {ad}
      </label>
      <input
        id={id}
        value={deger}
        placeholder={yerTutucu}
        onChange={(e) => onChange(e.target.value)}
        className="h-8 rounded-[8px] border border-[color:var(--mj-line)] bg-[color:var(--mj-sunk)] px-2.5 text-[13px] text-[color:var(--mj-ink)] outline-none transition-colors placeholder:text-[color:var(--mj-ink-3)] focus:border-[color:var(--mj-line-strong)]"
      />
    </div>
  );
}

export function Anahtar({
  ad,
  deger,
  onChange,
  odak,
}: {
  ad: string;
  deger: boolean;
  onChange: (v: boolean) => void;
  odak?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={deger}
      onClick={() => onChange(!deger)}
      data-mj-odak={odak ? "1" : undefined}
      className="flex w-full items-center justify-between gap-3 py-0.5 text-left"
    >
      <span className="text-[12px] text-[color:var(--mj-ink-2)]">{ad}</span>
      <span
        className={cn(
          "relative h-4 w-7 shrink-0 rounded-full border transition-colors duration-200",
          deger
            ? "border-[color:var(--mj-ink)] bg-[color:var(--mj-ink)]"
            : "border-[color:var(--mj-line-strong)] bg-[color:var(--mj-sunk)]",
        )}
      >
        <span
          className={cn(
            "absolute top-1/2 size-2.5 -translate-y-1/2 rounded-full transition-[left,background-color] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]",
            deger
              ? "left-[14px] bg-[color:var(--mj-on-sel)]"
              : "left-[2px] bg-[color:var(--mj-ink-3)]",
          )}
        />
      </span>
    </button>
  );
}
