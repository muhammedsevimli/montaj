# Montaj · Claude için kurulum notu

Kullanıcı "kur", "setup" ya da "çalıştır" derse:

1. `bun --version` ile Bun var mı bak. Yoksa npm kullan.
2. Bağımlılıkları kur: `bun install` (ya da `npm install`).
3. Geliştirme sunucusunu arka planda başlat: `bun run dev` (ya da `npm run dev`).
4. Kullanıcıya `http://localhost:3000` adresini ver ve masayı nasıl kullanacağını iki cümleyle anlat: sol panelden süz, bir ya da iki referans seç, sağda "Prompt" sekmesinden prompt'u kopyala.

Komutları kullanıcıya yazdırma, kendin çalıştır. Bir şey takılırsa sebebini düz Türkçeyle anlat.

Bilmen gerekenler:

- Klip medyası internetten gelir (`https://muhammedsevimli.com/montaj-medya`). Önizlemeler boş görünüyorsa önce internet bağlantısına bak. Adres `.env.local` içindeki `NEXT_PUBLIC_MONTAJ_MEDYA` ile değişir.
- Prompt metni `lib/montaj/prompt.ts`, rehber metinleri `lib/montaj/rehber.ts`, veri `lib/montaj/data/klipler.json` içinde.
- Arayüz metinleri Türkçe. Küçük harfe çevirirken `toLocaleLowerCase("tr")` kullan, düz `toLowerCase()` "I" ve "İ" harflerini bozar.
