# HANDOFF: "The Greatest ELESEN Show" — būklė ir likę darbai

Skaityk kartu su: `CLAUDE_CODE_BRIEF.md` (originalus spec, vis dar galioja, išskyrus žemiau
aprašytą architektūros pataisymą), `assets/manifest.json`, `assets/photos_manifest.json`,
`assets/text_content.json`, `assets/text_layout.json`, `assets/REFERENCE_desktop_1920.jpg`.

Projektas pradėtas su Claude Code. Stage 1 (skeletas + fontai) atliktas ir patikrintas.
Stage 2 (fonas + sekcijos + teksto pozicionavimas) darytas du kartus, abu su klaidomis.
Šis dokumentas: (1) ką privaloma sutvarkyti dabar, (2) kas liko iki galo.

---

## 1. KRITINIS BUG'AS — sutvarkyti prieš tęsiant bet ką kitą

### Kas negerai

Dabartinė realizacija renderina visą turinį **fiksuotais px pagal 1920px dizaino canvas'ą**,
nepriklausomai nuo realaus lango dydžio. Hero sekcija dizaine yra 1900px aukščio (beveik
kvadratas) — fiksuotu dydžiu tai reiškia, kad ji fiziškai ~2x didesnė už tipinio laptop
ekrano aukštį. Atidarius puslapį realiame Chrome lange (ne 1920px Playwright viewport'e),
antraštė "The Greatest" viena užpildo beveik visą ekraną, "show" nusmenka toli už matomos
srities.

Ankstesnis taisymas (flex centravimas + neigiami margin'ai + overflow-hidden kirpimas ant
`.canvas`/`body`/`html`) išsprendė centravimą, bet ne mastelio problemą. Tą sudėtingą
sprendimą reikia **pašalinti** — jis sprendžia neteisingą problemą.

### Kaip taisyti

Vietoj fiksuoto 1920px canvas'o — **proporcingas mastelio keitimas** per `vw`-pagrįstą root
`font-size`, kad visas dizainas mažėtų kaip plakatas, siaurėjant langui, ir niekad
neviršytų natūralaus dydžio plačiuose monitoriuose.

```css
html {
  font-size: 10px; /* bazė mobile/tablet — Stage 5 apibrėš savo taisykles čia */
}

@media (min-width: 1025px) {
  html {
    font-size: min(10px, calc(100vw / 192));
  }
}
```

Ties tiksliai 1920px pločiu `1rem = 10px`, tad kiekviena esama dizaino px reikšmė
konvertuojasi paprastai: **dizaino_px / 10 = rem**. Pvz. 220px tarpas → `22rem`.

Konvertuok į `rem` **visas** `font-size`, `margin`, `padding`, `width`, `height`, `gap`
reikšmes `base.css` ir `layout.css`, kurios šiuo metu yra fiksuotais px pagal 1920 dizainą.
Fono sekcijų aukščiai ir `background-size: cover` **lieka nepakeisti** — jie jau procentiniai,
mastelio problema jų neliečia.

`.canvas` supaprastėja iki:

```css
.canvas {
  width: 100%;
  max-width: 1920px;
  margin: 0 auto;
}
```

Jokio `transform`, jokios rankinės centravimo matematikos, jokio `overflow` hack'o.
Pašalink viską, ką pridėjai praeitą kartą tam spręsti.

**Kodėl formulė riboja tik desktop diapazoną (1025px+):** žemiau 1025px bus visai kita
mobile struktūra (Stage 5) — perstatytas layout, paslėptas dekoras, ne tiesiog sumažinta
desktop versija. Todėl formulė specialiai apribota `@media (min-width: 1025px)` viduje;
Stage 5 apibrėš savo `html { font-size: ... }` mobile diapazonui, nepratęsiant šitos
formulės žemiau.

### Verifikacija (privaloma prieš judant toliau)

Patikrink realiame naršyklės lange (jei turi playwright mcp — per jį; jei ne, atidaryk
patį naršyklėje ir resize'ink rankomis) trimis pločiais: **1920, 1512, 1440**.

- 1920px: turi likti identiškas `REFERENCE_desktop_1920.jpg` — mastelio koeficientas 1,
  čia niekas nesikeičia.
- 1512 ir 1440: proporcijos turi atrodyti kaip sumažinta ta pati kompozicija — jokio
  neproporcingai didelio teksto, jokio elemento, nusmenkančio už antro ekrano aukščio be
  reikalo.
- Pasakyk apytiksliai, kiek reikia scrollinti (viewport aukščiais), kol pasiekiamas CTA
  mygtukas 1512px lange. Vienas viso puslapio ilgio scroll'as normalu (tai vienas ilgas
  event puslapis) — bet antraštė viena neturi užimti dviejų ekranų aukščių.

Neik prie Stage 3, kol šis fix'as nepatikrintas trimis pločiais ir screenshot'ai neparodyti.

---

## 2. KAS LIKO PADARYTI (Stage 3–7)

Laikykis originalaus brief'o etapų tvarkos: **vienas etapas, sustoji, laukiat patvirtinimo,
tik tada kitas.**

### Stage 3 — desktop dekoras

Visi elementai iš `manifest.json` (logo, mikrofonas, kino juostelės, varlytė, žiedai,
šviestuvai, walk of fame žvaigždė, clapperboard, kamera) — absoliučiai pozicionuoti pagal
`x`/`y`/`width`/`height`.

**Svarbu dėl naujos architektūros:** kadangi dabar viskas skaliuojasi per `rem`, dekoro
koordinatės irgi turi būti `rem`, ne fiksuoti px — kitaip dekoras nebesiderins su tekstu ir
fonu siaurėjant langui. Konvertuok tuo pačiu principu (`px / 10 = rem`), pozicionuok per
`top`/`left` procentais arba `rem` nuo `.canvas` (kuris pats jau `rem`-santykinis per
`max-width`), ne nuo viewport'o.

Neigiamos `x`/`y` reikšmės (pvz. `film_reel_1` prie `x=-272`) — normalu, elementas
sąmoningai kiša už canvas krašto, `.canvas` turi `overflow: hidden` tam.

### Stage 4 — nuotraukų galerija

14 nuotraukų iš `photos_manifest.json`, originalus 7 eilučių išdėstymas desktop'e pagal
`canvas_x`/`canvas_y` (irgi konvertuotas į rem).

### Stage 5 — mobile adaptacija

Pagal `CLAUDE_CODE_BRIEF.md` mobile skyrių — savo `html { font-size }` taisyklė šitam
diapazonui (žr. #1 aukščiau), dekoro apkarpymas (palikti 1-2 elementus per sekciją),
galerija → CSS Grid 2 stulpeliai, fonas per sekciją su `background-size: cover`.

### Stage 6 — registracija + ačiū puslapiai

`registracija.html` forma (5 laukai + honeypot), `js/config.js` su `FORM_ENDPOINT`
placeholder, `js/form.js` su `Content-Type: text/plain` (būtina — žr. brief). `aciu.html`
su `noindex`.

### Stage 7 — performance + SEO

Lighthouse 90+ mobile tikslas, meta tag'ai, OG, JSON-LD Event structured data — viskas
kaip aprašyta `CLAUDE_CODE_BRIEF.md`.

---

## GRIEŽTI APRIBOJIMAI (nesikeičia, vis dar galioja)

- Tik vanilla HTML + CSS + JS. Jokio React/Vue/Next/build tool'o/CSS framework'o/JS
  bibliotekos.
- `assets/` turinio neperdaryk, nekeisk.
- Teksto nekeisk — verbatim iš `text_content.json`, lietuviškos kabutės „ " ir brūkšneliai
  tiksliai kaip šaltinyje.
- Vienas etapas per kartą, stabdyk ir laukiat patvirtinimo.
- Jei kažkas neaišku — klausk, nespėliok.
