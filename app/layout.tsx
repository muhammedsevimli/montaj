import type { Metadata, Viewport } from "next";
import { Fraunces, Geist, Geist_Mono } from "next/font/google";
import type { ReactNode } from "react";
import "./globals.css";

const geist = Geist({ subsets: ["latin", "latin-ext"], variable: "--font-geist", display: "swap" });
const geistMono = Geist_Mono({
  subsets: ["latin", "latin-ext"],
  variable: "--font-geist-mono",
  display: "swap",
});
const fraunces = Fraunces({
  subsets: ["latin", "latin-ext"],
  variable: "--font-fraunces",
  display: "swap",
  axes: ["opsz", "SOFT"],
});

export const metadata: Metadata = {
  title: "Montaj · Motion graphic referans kütüphanesi",
  description:
    "Claude ile motion graphic yapanlar için Türkçe referans masası. Referans seç, HyperFrames ya da Remotion için hazır prompt'u kopyala.",
  alternates: { canonical: "https://muhammedsevimli.com/montaj" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#e4dccb" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0b0a" },
  ],
};

// Tema sistem tercihini izler; ilk boyamadan önce çalışır ki sayfa yanıp sönmesin.
const TEMA = `(function(){try{var m=window.matchMedia("(prefers-color-scheme: dark)");var u=function(){document.documentElement.classList.toggle("dark",m.matches)};u();m.addEventListener("change",u)}catch(e){}})();`;

const DIS = { target: "_blank", rel: "noopener noreferrer" } as const;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="tr"
      suppressHydrationWarning
      className={`${geist.variable} ${geistMono.variable} ${fraunces.variable}`}
    >
      <head>
        {/* biome-ignore lint/security/noDangerouslySetInnerHtml: sabit tema betiği */}
        <script dangerouslySetInnerHTML={{ __html: TEMA }} />
      </head>
      <body>
        <header className="mj flex h-12 items-center justify-between gap-4 border-b border-[color:var(--mj-line)] px-4 sm:px-5">
          <div className="flex min-w-0 items-baseline gap-3">
            <span className="mj-serif text-[20px] italic leading-none">Montaj</span>
            <span className="mj-mono hidden truncate text-[11px] uppercase tracking-[0.14em] text-[color:var(--mj-ink-3)] sm:inline">
              açık kaynak sürüm
            </span>
          </div>
          <nav className="flex items-center gap-4 text-[13px] text-[color:var(--mj-ink-2)]">
            <a href="https://muhammedsevimli.com/montaj" {...DIS} className="hover:text-[color:var(--mj-ink)]">
              Canlı sürüm
            </a>
            <a
              href="https://github.com/muhammedsevimli/montaj"
              {...DIS}
              className="hover:text-[color:var(--mj-ink)]"
            >
              GitHub
            </a>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
