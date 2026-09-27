"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { type Klip, normalize, STIL_ETIKET, STIL_RENK, STILLER, TEKNIK_ETIKET } from "@/lib/montaj";
import { type PromptAyar, VARSAYILAN_AYAR } from "@/lib/montaj/prompt";
import { ADIMLAR } from "@/lib/montaj/rehber";
import { KlipKarti } from "./clip-card";
import { Segment } from "./controls";
import { Inceleyici, type Sekme } from "./inspector";
import { BOS_FILTRE, type Filtre, filtreDolu, KatmanPaneli } from "./layers-panel";
import { AkisCizelgesi } from "./workflow-timeline";

type Siralama = "one-cikan" | "yeni" | "kisa";

const easeOutExpo = [0.16, 1, 0.3, 1] as const;
const SAYFA_BOYU = 24;

function sirala(liste: Klip[], s: Siralama): Klip[] {
  if (s === "one-cikan") return liste;
  const kopya = liste.slice();
  if (s === "yeni") kopya.sort((a, b) => b.tarih.localeCompare(a.tarih));
  else kopya.sort((a, b) => a.sure - b.sure);
  return kopya;
}

export function MontajApp({ klipler }: { klipler: Klip[] }) {
  const [sorgu, setSorgu] = useState("");
  const [filtre, setFiltre] = useState<Filtre>(BOS_FILTRE);
  const [siralama, setSiralama] = useState<Siralama>("one-cikan");
  const [seciliId, setSeciliId] = useState<string>(klipler[0]?.id ?? "");
  const [referansIds, setReferansIds] = useState<string[]>([]);
  const [ayar, setAyar] = useState<PromptAyar>(VARSAYILAN_AYAR);
  const [sekme, setSekme] = useState<Sekme>("klip");
  const [adim, setAdim] = useState(-1);
  const [akisOynuyor, setAkisOynuyor] = useState(false);
  const [etkilesim, setEtkilesim] = useState(false);
  const [sayfa, setSayfa] = useState(false);
  const [filtreSayfa, setFiltreSayfa] = useState(false);
  const aramaRef = useRef<HTMLInputElement>(null);
  const kokRef = useRef<HTMLElement>(null);

  // Paylaşılabilir bağlantı: ?klip=<id>
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("klip");
    if (id && klipler.some((k) => k.id === id)) setSeciliId(id);
  }, [klipler]);

  // Sabit başlığın yüksekliği: masa ekranın kalanını doldurur.
  useEffect(() => {
    const olc = () => {
      const h = document.querySelector("header")?.getBoundingClientRect().height ?? 61;
      kokRef.current?.style.setProperty("--mj-ust", `${Math.round(h)}px`);
    };
    olc();
    window.addEventListener("resize", olc);
    return () => window.removeEventListener("resize", olc);
  }, []);

  // "/" aramaya odaklar, Esc alt sayfaları kapatır.
  useEffect(() => {
    const tus = (e: KeyboardEvent) => {
      const hedef = e.target as HTMLElement | null;
      const yaziyor = hedef && (hedef.tagName === "INPUT" || hedef.tagName === "TEXTAREA");
      if (e.key === "/" && !yaziyor) {
        e.preventDefault();
        aramaRef.current?.focus();
      }
      if (e.key === "Escape") {
        setSayfa(false);
        setFiltreSayfa(false);
      }
    };
    window.addEventListener("keydown", tus);
    return () => window.removeEventListener("keydown", tus);
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = sayfa || filtreSayfa ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [sayfa, filtreSayfa]);

  const sayim = useMemo(() => {
    const stil: Record<string, number> = {};
    const teknik: Record<string, number> = {};
    for (const k of klipler) {
      for (const s of k.stil) stil[s] = (stil[s] ?? 0) + 1;
      for (const t of k.teknik) teknik[t] = (teknik[t] ?? 0) + 1;
    }
    return {
      toplam: klipler.length,
      opus55: klipler.filter((k) => k.kaynak === "opus55").length,
      secki: klipler.filter((k) => k.puan >= 5).length,
      stil,
      teknik,
    };
  }, [klipler]);

  const gorunen = useMemo(() => {
    const q = normalize(sorgu.trim());
    const f = filtre;
    const liste = klipler.filter((k) => {
      if (f.koleksiyon === "opus55" && k.kaynak !== "opus55") return false;
      if (f.koleksiyon === "secki" && k.puan < 5) return false;
      if (f.stiller.length && !f.stiller.some((s) => k.stil.includes(s))) return false;
      if (f.zemin !== "hepsi" && k.zemin !== f.zemin) return false;
      if (f.tempo !== "hepsi" && k.tempo !== f.tempo) return false;
      if (f.maxSure < 90 && k.sure > f.maxSure) return false;
      if (f.teknikler.length && !f.teknikler.every((t) => k.teknik.includes(t))) return false;
      if (q) {
        const metin = normalize(
          [
            k.urun,
            k.ozet,
            k.gorsel,
            k.yazar,
            ...k.stil.map((s) => STIL_ETIKET[s]),
            ...k.teknik.map((t) => TEKNIK_ETIKET[t]),
          ].join(" "),
        );
        if (!q.split(/\s+/).every((p) => metin.includes(p))) return false;
      }
      return true;
    });
    return sirala(liste, siralama);
  }, [klipler, sorgu, filtre, siralama]);

  // Izgara kademeli basılır: mobilde 260 kart alt alta dizilince alttaki rehber
  // ulaşılmaz olur. Masaüstünde panel içinde kaydırdıkça kendiliğinden dolar,
  // mobilde düğmeyle.
  const [limit, setLimit] = useState(SAYFA_BOYU);
  const izgaraRef = useRef<HTMLDivElement>(null);
  const nobetciRef = useRef<HTMLDivElement>(null);
  const kalan = Math.max(0, gorunen.length - limit);

  // biome-ignore lint/correctness/useExhaustiveDependencies: filtre, arama ya da sıra değişince baştan başla
  useEffect(() => {
    setLimit(SAYFA_BOYU);
    izgaraRef.current?.scrollTo({ top: 0 });
  }, [sorgu, filtre, siralama]);

  useEffect(() => {
    const kok = izgaraRef.current;
    const hedef = nobetciRef.current;
    if (!kok || !hedef || kalan === 0) return;
    if (!window.matchMedia("(min-width: 1024px)").matches) return;
    const io = new IntersectionObserver(
      (girdiler) => {
        if (girdiler.some((g) => g.isIntersecting)) setLimit((l) => l + SAYFA_BOYU);
      },
      { root: kok, rootMargin: "0px 0px 600px 0px" },
    );
    io.observe(hedef);
    return () => io.disconnect();
  }, [kalan]);

  const secili = useMemo(() => klipler.find((k) => k.id === seciliId) ?? null, [klipler, seciliId]);
  const referanslar = useMemo(
    () =>
      referansIds
        .map((id) => klipler.find((k) => k.id === id))
        .filter((k): k is Klip => Boolean(k)),
    [klipler, referansIds],
  );

  const sec = useCallback((id: string) => {
    setSeciliId(id);
    setEtkilesim(true);
    setSekme("klip");
    const url = new URL(window.location.href);
    url.searchParams.set("klip", id);
    window.history.replaceState(null, "", url);
    if (window.matchMedia("(max-width: 1023px)").matches) setSayfa(true);
  }, []);

  const referansDegistir = useCallback((id: string) => {
    setReferansIds((ids) =>
      ids.includes(id) ? ids.filter((x) => x !== id) : ids.length >= 2 ? ids : [...ids, id],
    );
  }, []);

  // Akış adımı masada ilgili alanı gösterir.
  const odak = adim >= 0 ? ADIMLAR[adim].odak : null;
  useEffect(() => {
    if (!odak) return;
    if (odak === "motor" || odak === "marka" || odak === "storyboard" || odak === "bilesen")
      setSekme("prompt");
    if (odak === "yonetmen") setSekme("klip");
    // İşaretlenen alan panelin görünmeyen kısmındaysa yalnız o paneli kaydır, sayfayı değil.
    const t = window.setTimeout(() => {
      for (const el of document.querySelectorAll<HTMLElement>('[data-mj-odak="1"]')) {
        const kap = el.parentElement?.closest<HTMLElement>(".mj-scroll");
        if (!kap || el.offsetParent === null) continue;
        const k = kap.getBoundingClientRect();
        const e = el.getBoundingClientRect();
        if (e.top < k.top || e.bottom > k.bottom) {
          kap.scrollTo({ top: kap.scrollTop + e.top - k.top - 16, behavior: "smooth" });
        }
      }
    }, 80);
    return () => window.clearTimeout(t);
  }, [odak]);

  const inceleyici = (
    <Inceleyici
      klip={secili}
      referanslar={referanslar}
      onReferans={referansDegistir}
      ayar={ayar}
      setAyar={setAyar}
      sekme={sekme}
      setSekme={setSekme}
      odak={odak}
      otomatikOynat={etkilesim}
    />
  );

  const hizliStiller = STILLER.filter((s) => (sayim.stil[s] ?? 0) >= 8);

  return (
    <section
      ref={kokRef}
      className="mj mj-dots relative border-b border-[color:var(--mj-line)]"
      aria-label="Montaj referans masası"
      style={
        adim >= 0 ? ({ "--mj-odak-renk": ADIMLAR[adim].renk } as React.CSSProperties) : undefined
      }
    >
      <div className="flex flex-col gap-2 p-2 lg:h-[calc(100dvh-var(--mj-ust,61px))] lg:min-h-[700px]">
        {/* Üst şerit */}
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: easeOutExpo }}
          className="mj-panel flex flex-col gap-3 px-3.5 py-3 lg:h-14 lg:flex-row lg:items-center lg:gap-5 lg:py-0"
        >
          <div className="flex min-w-0 items-baseline gap-3">
            <h1 className="mj-serif text-[26px] italic leading-none tracking-[-0.02em]">Montaj</h1>
            <p className="truncate text-[12px] text-[color:var(--mj-ink-2)]">
              Claude ile motion graphic için referans masası
            </p>
          </div>
          <label className="relative flex h-9 items-center lg:ml-auto lg:w-[340px]">
            <Search className="pointer-events-none absolute left-2.5 size-3.5 text-[color:var(--mj-ink-3)]" />
            <input
              ref={aramaRef}
              value={sorgu}
              onChange={(e) => setSorgu(e.target.value)}
              placeholder="Ürün, stil ya da teknik ara"
              aria-label="Kütüphanede ara"
              className="h-full w-full rounded-[9px] border border-[color:var(--mj-line)] bg-[color:var(--mj-sunk)] pl-8 pr-9 text-[13px] outline-none placeholder:text-[color:var(--mj-ink-3)] focus:border-[color:var(--mj-line-strong)]"
            />
            {sorgu ? (
              <button
                type="button"
                onClick={() => setSorgu("")}
                aria-label="Aramayı temizle"
                className="absolute right-2 grid size-5 place-items-center rounded text-[color:var(--mj-ink-3)] hover:text-[color:var(--mj-ink)]"
              >
                <X className="size-3.5" />
              </button>
            ) : (
              <kbd className="mj-mono absolute right-2 rounded-[5px] border border-[color:var(--mj-line)] px-1.5 text-[10px] text-[color:var(--mj-ink-3)]">
                /
              </kbd>
            )}
          </label>
          <div className="mj-mono hidden shrink-0 items-center gap-3 text-[11px] text-[color:var(--mj-ink-2)] lg:flex">
            <span>
              <span className="text-[color:var(--mj-ink)]">{sayim.toplam}</span> klip
            </span>
            <span className="h-3 w-px bg-[color:var(--mj-line-strong)]" />
            <span>
              <span className="text-[color:var(--mj-claude)]">{sayim.opus55}</span> Opus 5.5
            </span>
          </div>
        </motion.div>

        {/* Mobil hızlı filtre şeridi */}
        <div className="mj-noscroll -mx-2 flex gap-1.5 overflow-x-auto px-2 lg:hidden">
          <button
            type="button"
            onClick={() => setFiltreSayfa(true)}
            className={cn(
              "flex h-8 shrink-0 items-center gap-1.5 rounded-[8px] border px-3 text-[12px]",
              filtreDolu(filtre)
                ? "border-[color:var(--mj-ink)] bg-[color:var(--mj-sel)] text-[color:var(--mj-on-sel)]"
                : "border-[color:var(--mj-line-strong)] bg-[color:var(--mj-panel)]",
            )}
          >
            <SlidersHorizontal className="size-3.5" />
            Filtreler
          </button>
          <button
            type="button"
            onClick={() =>
              setFiltre({
                ...filtre,
                koleksiyon: filtre.koleksiyon === "opus55" ? "hepsi" : "opus55",
              })
            }
            className={cn(
              "h-8 shrink-0 rounded-[8px] border px-3 text-[12px]",
              filtre.koleksiyon === "opus55"
                ? "border-[color:var(--mj-ink)] bg-[color:var(--mj-sel)] text-[color:var(--mj-on-sel)]"
                : "border-[color:var(--mj-line)] bg-[color:var(--mj-panel)] text-[color:var(--mj-ink-2)]",
            )}
          >
            Opus 5.5 · {sayim.opus55}
          </button>
          {hizliStiller.map((s) => {
            const on = filtre.stiller.includes(s);
            return (
              <button
                key={s}
                type="button"
                onClick={() =>
                  setFiltre({
                    ...filtre,
                    stiller: on ? filtre.stiller.filter((x) => x !== s) : [...filtre.stiller, s],
                  })
                }
                className={cn(
                  "inline-flex h-8 shrink-0 items-center gap-1.5 rounded-[8px] border px-3 text-[12px]",
                  on
                    ? "border-[color:var(--mj-ink)] bg-[color:var(--mj-sel)] text-[color:var(--mj-on-sel)]"
                    : "border-[color:var(--mj-line)] bg-[color:var(--mj-panel)] text-[color:var(--mj-ink-2)]",
                )}
              >
                <span className="size-[7px] rounded-[2px]" style={{ background: STIL_RENK[s] }} />
                {STIL_ETIKET[s]}
              </button>
            );
          })}
        </div>

        {/* Orta: katmanlar · tuval · inceleyici */}
        <div className="grid min-h-0 flex-1 gap-2 lg:grid-cols-[236px_minmax(0,1fr)_352px]">
          <motion.aside
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55, delay: 0.05, ease: easeOutExpo }}
            className="mj-panel hidden min-h-0 overflow-hidden lg:flex"
          >
            <KatmanPaneli filtre={filtre} setFiltre={setFiltre} sayim={sayim} className="w-full" />
          </motion.aside>

          <div
            className="flex min-h-0 flex-col rounded-[12px]"
            data-mj-odak={odak === "kutuphane" ? "1" : undefined}
          >
            <div className="flex items-center justify-between gap-3 px-1 pb-2 pt-1">
              <div className="mj-mono text-[11px] text-[color:var(--mj-ink-2)]">
                <span className="text-[color:var(--mj-ink)]">{gorunen.length}</span> /{" "}
                {sayim.toplam} klip
                {filtreDolu(filtre) || sorgu ? (
                  <button
                    type="button"
                    onClick={() => {
                      setFiltre(BOS_FILTRE);
                      setSorgu("");
                    }}
                    className="ml-2 underline decoration-[color:var(--mj-line-strong)] underline-offset-2 hover:text-[color:var(--mj-ink)]"
                  >
                    sıfırla
                  </button>
                ) : null}
              </div>
              <div className="w-[228px]">
                <Segment<Siralama>
                  ad="Sıralama"
                  gizliAd
                  deger={siralama}
                  secenekler={[
                    { deger: "one-cikan", etiket: "Öne çıkan" },
                    { deger: "yeni", etiket: "Yeni" },
                    { deger: "kisa", etiket: "Kısa" },
                  ]}
                  onChange={setSiralama}
                />
              </div>
            </div>
            <div
              ref={izgaraRef}
              className="mj-scroll min-h-0 flex-1 overflow-y-auto px-1 pb-2 lg:pr-2"
            >
              {gorunen.length ? (
                <>
                  <div className="grid grid-cols-2 gap-x-3 gap-y-5 sm:grid-cols-3 lg:grid-cols-[repeat(auto-fill,minmax(210px,1fr))]">
                    {gorunen.slice(0, limit).map((k, i) => (
                      <KlipKarti
                        key={k.id}
                        klip={k}
                        sira={i}
                        secili={k.id === seciliId}
                        referans={referansIds.includes(k.id)}
                        onSec={sec}
                      />
                    ))}
                  </div>
                  {kalan > 0 ? (
                    <div ref={nobetciRef} className="flex justify-center pb-2 pt-6">
                      <button
                        type="button"
                        onClick={() => setLimit((l) => l + SAYFA_BOYU)}
                        className="mj-mono h-9 rounded-[9px] border border-[color:var(--mj-line-strong)] bg-[color:var(--mj-panel)] px-4 text-[12px] text-[color:var(--mj-ink)] transition-colors hover:bg-[color:var(--mj-raise)]"
                      >
                        {Math.min(SAYFA_BOYU, kalan)} klip daha · {kalan} kaldı
                      </button>
                    </div>
                  ) : null}
                </>
              ) : (
                <div className="grid h-60 place-items-center text-center">
                  <div>
                    <p className="text-[14px]">Bu filtrelerle klip yok.</p>
                    <button
                      type="button"
                      onClick={() => {
                        setFiltre(BOS_FILTRE);
                        setSorgu("");
                      }}
                      className="mt-3 h-8 rounded-[8px] border border-[color:var(--mj-line-strong)] px-3 text-[12px] hover:bg-[color:var(--mj-raise)]"
                    >
                      Filtreleri sıfırla
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <motion.aside
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55, delay: 0.1, ease: easeOutExpo }}
            className="mj-panel hidden min-h-0 overflow-hidden lg:flex lg:flex-col"
          >
            {inceleyici}
          </motion.aside>
        </div>

        {/* Alt: akış çizelgesi */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.15, ease: easeOutExpo }}
          className="mj-panel h-[150px] shrink-0 overflow-hidden"
        >
          <AkisCizelgesi
            aktif={adim}
            setAktif={setAdim}
            oynuyor={akisOynuyor}
            setOynuyor={setAkisOynuyor}
          />
        </motion.div>
      </div>

      {/* Mobil: inceleyici alt sayfası */}
      <AnimatePresence>
        {sayfa ? (
          <>
            <motion.button
              type="button"
              aria-label="Kapat"
              onClick={() => setSayfa(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/50 lg:hidden"
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Klip ayrıntısı"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.45, ease: easeOutExpo }}
              className="mj fixed inset-x-0 bottom-0 z-50 flex h-[88dvh] flex-col overflow-hidden rounded-t-[16px] border-t border-[color:var(--mj-line-strong)] bg-[color:var(--mj-panel)] lg:hidden"
            >
              <div className="mx-auto mt-2 h-1 w-10 shrink-0 rounded-full bg-[color:var(--mj-line-strong)]" />
              <div className="min-h-0 flex-1">
                <Inceleyici
                  klip={secili}
                  referanslar={referanslar}
                  onReferans={referansDegistir}
                  ayar={ayar}
                  setAyar={setAyar}
                  sekme={sekme}
                  setSekme={setSekme}
                  odak={null}
                  otomatikOynat
                  onKapat={() => setSayfa(false)}
                />
              </div>
            </motion.div>
          </>
        ) : null}
        {filtreSayfa ? (
          <>
            <motion.button
              type="button"
              aria-label="Kapat"
              onClick={() => setFiltreSayfa(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/50 lg:hidden"
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Filtreler"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.45, ease: easeOutExpo }}
              className="mj fixed inset-x-0 bottom-0 z-50 flex h-[80dvh] flex-col overflow-hidden rounded-t-[16px] border-t border-[color:var(--mj-line-strong)] bg-[color:var(--mj-panel)] lg:hidden"
            >
              <div className="flex h-12 shrink-0 items-center justify-between border-b border-[color:var(--mj-line)] px-4">
                <span className="text-[14px] font-medium">Filtreler</span>
                <button
                  type="button"
                  onClick={() => setFiltreSayfa(false)}
                  className="h-8 rounded-[8px] bg-[color:var(--mj-sel)] px-3 text-[12px] font-medium text-[color:var(--mj-on-sel)]"
                >
                  {gorunen.length} klibi göster
                </button>
              </div>
              <KatmanPaneli
                filtre={filtre}
                setFiltre={setFiltre}
                sayim={sayim}
                baslikGizli
                className="min-h-0 flex-1"
              />
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>
    </section>
  );
}
