"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

export function KopyaDugmesi({ metin, etiket = "kopyala" }: { metin: string; etiket?: string }) {
  const [tamam, setTamam] = useState(false);
  return (
    <button
      type="button"
      onClick={() =>
        navigator.clipboard
          ?.writeText(metin)
          .then(() => {
            setTamam(true);
            window.setTimeout(() => setTamam(false), 1500);
          })
          .catch(() => {})
      }
      className="mj-mono inline-flex shrink-0 items-center gap-1 text-[10px] text-[color:var(--mj-ink-3)] transition-colors hover:text-[color:var(--mj-ink)]"
    >
      {tamam ? <Check className="size-3" /> : <Copy className="size-3" />}
      {tamam ? "kopyalandı" : etiket}
    </button>
  );
}
