import { ArrowUpRight } from "lucide-react";
import { ADIMLAR, ARACLAR, SOZLUK, SSS } from "@/lib/montaj/rehber";
import { KopyaDugmesi } from "./copy-button";
import { DitherKlaket } from "./dither-mark";

const KAYNAK_TWEET = "https://x.com/rexan_wong/status/2103707054108299437";

function Etiket({ children }: { children: React.ReactNode }) {
  return (
    <p className="mj-mono mb-4 text-[11px] uppercase tracking-[0.16em] text-[color:var(--mj-ink-3)]">
      {children}
    </p>
  );
}

export function RehberBolumu({ toplam, opus }: { toplam: number; opus: number }) {
  return (
    <div className="mj">
      {/* Altı sahne */}
      <section id="rehber" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-20 sm:px-6 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[14px] border border-[#e9e2d2]/10 bg-[#0e0e0c]">
              <DitherKlaket className="absolute inset-0" />
              <div className="mj-mono pointer-events-none absolute inset-x-4 top-3 flex justify-between text-[10px] uppercase tracking-[0.14em] text-[#e9e2d2]/55">
                <span>Sahne 00</span>
                <span>çek ve döndür</span>
              </div>
              <div className="mj-mono pointer-events-none absolute inset-x-4 bottom-3 flex justify-between text-[10px] text-[#e9e2d2]/45">
                <span>1-bit bayer · canvas ui</span>
                <span>00:00:06:00</span>
              </div>
            </div>
            <div className="mt-8">
              <Etiket>Rehber · 6 sahne</Etiket>
              <h2 className="text-[34px] font-semibold leading-[1.05] tracking-[-0.03em] sm:text-[42px]">
                Pro görünen motion graphic'in{" "}
                <span className="mj-serif font-normal italic">altı sahnesi</span>
              </h2>
              <p className="mt-5 max-w-[46ch] text-[15px] leading-relaxed text-[color:var(--mj-ink-2)]">
                Eylül 2026'nın son haftasında X, Opus 5.5 ile yapılmış motion graphic videolarla
                doldu ve çoğu "tek prompt" diye paylaşıldı. Ben Claude'u uzun süredir motion graphic
                için kullanıyorum. İyi çıkan videoların arkasında aynı altı adım var ve bu akışı
                Rexan Wong bir X notunda derledi. Yukarıdaki masa birinci, dördüncü ve beşinci adım
                için kuruldu.
              </p>
              <div className="mj-mono mt-6 flex gap-5 text-[11px] text-[color:var(--mj-ink-2)]">
                <span>
                  <span className="text-[18px] text-[color:var(--mj-ink)]">{toplam}</span> referans
                </span>
                <span>
                  <span className="text-[18px] text-[color:var(--mj-ink)]">{opus}</span> Opus 5.5
                  örneği
                </span>
                <span>
                  <span className="text-[18px] text-[color:var(--mj-ink)]">{SOZLUK.length}</span>{" "}
                  kamera terimi
                </span>
              </div>
            </div>
          </div>

          <ol className="grid gap-3">
            {ADIMLAR.map((a, i) => (
              <li
                key={a.no}
                className="mj-panel relative overflow-hidden"
                style={{ boxShadow: `inset 3px 0 0 ${a.renk}, var(--mj-shadow)` }}
              >
                <div className="flex items-center justify-between border-b border-[color:var(--mj-line)] px-5 py-3">
                  <span className="mj-mono flex items-center gap-2.5 text-[11px] uppercase tracking-[0.14em] text-[color:var(--mj-ink-3)]">
                    <span className="size-2 rotate-45" style={{ backgroundColor: a.renk }} />
                    Sahne {a.no} · {a.kisa}
                  </span>
                  <span className="mj-mono text-[11px] text-[color:var(--mj-ink-3)]">
                    00:0{i}:00 → 00:0{i + 1}:00
                  </span>
                </div>
                <div className="px-5 pb-5 pt-4">
                  <h3 className="text-[20px] font-semibold leading-snug tracking-[-0.02em]">
                    {a.baslik}
                  </h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-[color:var(--mj-ink)]">
                    {a.metin}
                  </p>
                  <div className="mt-4 border-l-2 pl-4" style={{ borderColor: `${a.renk}99` }}>
                    <p className="mj-mono mb-1 text-[10px] uppercase tracking-[0.14em] text-[color:var(--mj-ink-3)]">
                      Atlarsan
                    </p>
                    <p className="text-[14px] leading-relaxed text-[color:var(--mj-ink-2)]">
                      {a.yoksa}
                    </p>
                  </div>
                </div>
              </li>
            ))}
            <li className="px-1 pt-4">
              <p className="mj-serif text-[24px] italic leading-snug tracking-[-0.01em] sm:text-[28px]">
                Herkesin elinde aynı model var. Aynı modelden profesyonel video çıkması ona verdiğin
                bağlama bağlı.
              </p>
            </li>
          </ol>
        </div>
      </section>

      {/* Yönetmen sözlüğü */}
      <section className="border-t border-[color:var(--mj-line)]">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-24">
          <div className="mb-10 grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
            <div>
              <Etiket>Sözlük · {SOZLUK.length} terim</Etiket>
              <h2 className="text-[30px] font-semibold leading-[1.08] tracking-[-0.03em] sm:text-[36px]">
                Claude'a <span className="mj-serif font-normal italic">kamera diliyle</span> not ver
              </h2>
            </div>
            <p className="self-end text-[15px] leading-relaxed text-[color:var(--mj-ink-2)]">
              "Daha iyi yap" rastgele değişiklik getiriyor. Terimi ve bir ölçü verdiğinde Claude tek
              satırı değiştirip yeniden render ediyor. Her terimin altındaki not doğrudan kopyalanıp
              yapıştırılabilir.
            </p>
          </div>
          <div className="grid overflow-hidden rounded-[14px] border border-[color:var(--mj-line)] sm:grid-cols-2">
            {SOZLUK.map((t) => (
              <div
                key={t.en}
                className="border-b border-[color:var(--mj-line)] bg-[color:var(--mj-panel)] p-5 sm:[&:nth-child(odd)]:border-r"
              >
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="text-[16px] font-semibold tracking-[-0.01em]">{t.tr}</h3>
                  <span className="mj-mono text-[11px] text-[color:var(--mj-ink-3)]">{t.en}</span>
                </div>
                <p className="mt-1 text-[14px] leading-relaxed text-[color:var(--mj-ink-2)]">
                  {t.aciklama}
                </p>
                <div className="mt-3 flex items-start justify-between gap-3 rounded-[10px] bg-[color:var(--mj-sunk)] px-3 py-2.5">
                  <p className="mj-serif text-[15px] italic leading-snug">{t.not}</p>
                  <KopyaDugmesi metin={t.not} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Araç çantası */}
      <section className="border-t border-[color:var(--mj-line)]">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-24">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
            <div>
              <Etiket>Araç çantası</Etiket>
              <h2 className="text-[30px] font-semibold leading-[1.08] tracking-[-0.03em] sm:text-[36px]">
                Kurulumdaki <span className="mj-serif font-normal italic">altı parça</span>
              </h2>
              <p className="mt-5 max-w-[42ch] text-[15px] leading-relaxed text-[color:var(--mj-ink-2)]">
                Hepsinin açık kaynak sürümü ya da ücretsiz planı var. Motor video üretir, geri
                kalanı videonun ucuz görünmesini engeller.
              </p>
            </div>
            <ul className="divide-y divide-[color:var(--mj-line)] border-y border-[color:var(--mj-line)]">
              {ARACLAR.map((a) => (
                <li key={a.ad}>
                  <a
                    href={a.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group grid grid-cols-[72px_minmax(0,1fr)_auto] items-start gap-4 py-5 transition-colors"
                  >
                    <span className="mj-mono pt-1 text-[11px] uppercase tracking-[0.12em] text-[color:var(--mj-ink-3)]">
                      {a.rol}
                    </span>
                    <span>
                      <span className="block text-[17px] font-semibold tracking-[-0.01em] group-hover:underline group-hover:decoration-[color:var(--mj-line-strong)] group-hover:underline-offset-4">
                        {a.ad}
                      </span>
                      <span className="mt-1 block text-[14px] leading-relaxed text-[color:var(--mj-ink-2)]">
                        {a.metin}
                      </span>
                    </span>
                    <ArrowUpRight className="mt-1 size-4 text-[color:var(--mj-ink-3)] transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[color:var(--mj-ink)]" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* SSS */}
      <section className="border-t border-[color:var(--mj-line)]">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16 lg:py-24">
          <div>
            <Etiket>Sık sorulanlar</Etiket>
            <h2 className="text-[30px] font-semibold leading-[1.08] tracking-[-0.03em] sm:text-[36px]">
              Kısa <span className="mj-serif font-normal italic">cevaplar</span>
            </h2>
          </div>
          <div className="divide-y divide-[color:var(--mj-line)] border-y border-[color:var(--mj-line)]">
            {SSS.map((q) => (
              <details key={q.s} className="group py-4 [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[16px] font-medium tracking-[-0.01em]">
                  {q.s}
                  <span className="mj-mono text-[14px] text-[color:var(--mj-ink-3)] transition-transform duration-200 group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 max-w-[62ch] text-[15px] leading-relaxed text-[color:var(--mj-ink-2)]">
                  {q.c}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Kapanış */}
      <section className="border-t border-[color:var(--mj-line)]">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="grid gap-8 rounded-[16px] bg-[#0e0e0c] p-7 text-[#e9e2d2] sm:p-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <div>
              <p className="mj-mono mb-4 text-[11px] uppercase tracking-[0.16em] text-[#e9e2d2]/50">
                Sonraki kare
              </p>
              <p className="max-w-[26ch] text-[28px] font-semibold leading-[1.1] tracking-[-0.03em] sm:text-[34px]">
                Claude ile gerçek sistemler kuruyorum,{" "}
                <span className="mj-serif font-normal italic">kurarken</span> gösteriyorum.
              </p>
            </div>
            <div className="flex flex-wrap gap-2.5">
              <a
                href="https://www.youtube.com/@msevimli"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 items-center gap-2 rounded-[10px] bg-[#e9e2d2] px-5 text-[14px] font-medium text-[#0e0e0c] transition active:scale-[0.98]"
              >
                Kurulum videoları
                <ArrowUpRight className="size-4" />
              </a>
              <a
                href="https://muhammedsevimli.com/atolye"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 items-center gap-2 rounded-[10px] border border-[#e9e2d2]/25 px-5 text-[14px] font-medium transition hover:border-[#e9e2d2]/60 active:scale-[0.98]"
              >
                Atölye
              </a>
            </div>
          </div>

          <div className="mt-10 grid gap-3 text-[12px] leading-relaxed text-[color:var(--mj-ink-3)] sm:grid-cols-2">
            <p>
              Katalog,{" "}
              <a
                href="https://whatships.com"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2"
              >
                whatships.com
              </a>{" "}
              kataloğundan (MIT,{" "}
              <a
                href="https://github.com/dingyi/whatships.com"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2"
              >
                dingyi/whatships.com
              </a>
              ) süzülüp Türkçeye uyarlandı; stil, tempo ve teknik etiketleri kareler incelenerek
              verildi. Opus 5.5 örnekleri 25 ve 26 Eylül 2026'da X'te tarandı. Altı adımlık akış{" "}
              <a
                href={KAYNAK_TWEET}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2"
              >
                Rexan Wong'un notundan
              </a>{" "}
              uyarlandı.
            </p>
            <p>
              Videolar ve markalar sahiplerine ait, her kayıt orijinal X gönderisine bağlanıyor.
              Montaj bu ürünlerin hiçbiriyle bağlantılı değil. Kaldırma talebi için X'te @_msevimli
              hesabına yaz, 72 saat içinde çıkarılır. Panel dili Toolcraft'tan (MIT) uyarlandı.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
