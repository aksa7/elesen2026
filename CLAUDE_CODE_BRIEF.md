# BRIEF: "The Greatest ELESEN Show" — landing page + registracija

## Kontekstas

Statome statinį renginio landing page'ą pagal jau paruoštus assets, ištrauktus iš dizainerės PSD.
Visi assets yra šiame aplanke. PSD failo nėra ir nereikia — visa reikalinga informacija yra
`manifest.json`, `photos_manifest.json`, `text_content.json` ir `REFERENCE_desktop_1920.jpg`.

**Renginys:** 2026.09.24, Kino teatras „Daina", Kaunas.

---

## GRIEŽTI TECHNINIAI APRIBOJIMAI

Šitų nekeisk ir nesiūlyk alternatyvų:

- **Tik vanilla HTML + CSS + JS.** Jokio React, Vue, Svelte, Next.js, Astro.
- **Jokio build step'o, jokio bundlerio, jokio npm dependency runtime'e.** Failai turi veikti
  atidarius tiesiai per statinį serverį.
- **Jokio CSS framework'o** (Tailwind, Bootstrap). Grynas CSS su custom properties.
- **Jokių JS bibliotekų** (jQuery, GSAP, AOS). Jei reikia animacijos — CSS arba
  IntersectionObserver.
- **Jokio localStorage / sessionStorage.**
- Assets aplanko turinio **neperdaryk ir neperkoduok** — WebP failai jau optimizuoti.
  Vienintelė išimtis: gali generuoti mažesnes versijas responsive `srcset`, jei to prireiks.

---

## FAILŲ STRUKTŪRA (sukurk tiksliai tokią)

```
/
├── index.html              # landing page
├── registracija.html       # registracijos forma
├── aciu.html               # thank-you page
├── css/
│   ├── base.css            # reset, CSS variables, tipografija, fontai
│   ├── layout.css          # sekcijos, dekoro pozicionavimas
│   └── form.css            # formos stiliai (registracija + aciu)
├── js/
│   ├── config.js           # FORM_ENDPOINT ir kiti konfigūracijos kintamieji
│   └── form.js             # formos validacija + submit
├── fonts/
│   └── (Gautreaux-Light — pateiks užsakovas)
└── assets/                 # NEKEISK turinio
    ├── bg_slices/
    ├── cutouts/
    ├── photos/
    ├── manifest.json
    ├── photos_manifest.json
    ├── text_content.json
    └── REFERENCE_desktop_1920.jpg
```

---

## ASSETS: kaip skaityti koordinates

Originalus dizainas yra **1920 × 9048 px**. Visos koordinatės manifestuose yra šitoje erdvėje,
nuo viršutinio kairio kampo (0,0).

### `manifest.json` — dekoro elementai

Kiekvienas įrašas turi `x`, `y`, `width`, `height`, `file`. Pvz.:

```json
"mic": { "x": 1357, "y": -34, "width": 133, "height": 587, "file": "cutouts/mic.png" }
```

Neigiamos `x`/`y` reikšmės yra normalios — elementas sąmoningai iškiša už canvas krašto.
Desktop'e tai turi likti taip (overflow: hidden ant sekcijos konteinerio).

### `manifest.json > _background_sections` — fono atkarpos

4 fono atkarpos su `y_start` / `y_end`. Fone yra **tik** uždanga, spotlight ir švytėjimai —
jokio teksto, jokio dekoro. Viską kitą dedi ant viršaus.

### `photos_manifest.json` — dress code nuotraukos

14 atskirų nuotraukų su `row` (1–7, originalaus grid'o eilutė), `canvas_x`, `canvas_y`,
`width`, `height`. Eilučių sudėtis: 1, 2, 2, 3, 2, 1, 3 nuotraukos.

### `text_content.json` — visas tekstas

Visas realus tekstas iš PSD. **Naudok jį, neperrašinėk ir netaisyk rašybos.** Lietuviški
kabučių ženklai („ ") ir brūkšneliai turi likti tokie, kokie yra.

### `REFERENCE_desktop_1920.jpg`

Pilnas dizaino renderis 1920×9048. Tai tavo **vizualus taikinys desktop'ui**. Naudok jį
palyginimui su Playwright screenshot'ais.

---

## PUSLAPIŲ TURINYS

### `index.html` — sekcijų seka

1. **Hero** (bg_1_hero) — antraštė „The Greatest / elesen / show", data ir vieta, mikrofonas
2. **Intro tekstas** — įvadinė pastraipa
3. **CTA** — mygtukas „Registracija į renginį" → veda į `/registracija.html`
4. **Renginio programa** (bg_2_program) — 5 laiko blokai
5. **Aprangos kodas** (bg_3_dresscode) — antraštė, tekstas, bullet sąrašas, akcentinė eilutė
6. **Nuotraukų galerija** (bg_4_photos) — 14 nuotraukų, 7 eilutės

Semantinis markup: `<header>`, `<section>`, `<h1>`/`<h2>`, `<ul>` bullet'ams.
Antraštė „The Greatest ELESEN show" turi būti realus `<h1>` tekstas (SEO), ne paveikslėlis.

### `registracija.html`

Tas pats fonas (naudok `bg_1_hero.webp`), ta pati tipografija, minimalus dekoras.
Laukai:

| Laukas | `name` | Tipas | Privalomas |
|---|---|---|---|
| Vardas, pavardė | `vardas` | text | taip |
| Telefono nr. | `telefonas` | tel | taip |
| El. paštas | `elpastas` | email | taip |
| Miestas | `miestas` | text | taip |
| Ar vyksite autobusu? | `autobusas` | radio: Taip / Ne | taip |
| (honeypot) | `company` | text, paslėptas | ne |

Honeypot: `<input name="company" tabindex="-1" autocomplete="off">` paslėptas per CSS
(`position:absolute; left:-9999px`), **ne** `display:none` ir **ne** `type="hidden"` —
kai kurie botai tuos praleidžia.

Validacija JS'e prieš siuntimą, klaidos rodomos po lauku lietuviškai. Naudok `aria-invalid`
ir `aria-describedby` klaidų pranešimams.

Siunčiant: mygtukas disabled + „Siunčiama...". Sėkmės atveju →
`window.location.href = '/aciu.html'`. Klaidos atveju — pranešimas virš formos, mygtukas
vėl aktyvus, duomenys formoje išlieka.

### `aciu.html`

Tas pats fonas ir stilius. Turinys:
- Antraštė: „Ačiū! Registracija sėkminga"
- Tekstas, kad registracija gauta ir laukiame renginyje
- Renginio priminimas: 2026.09.24, Kino teatras „Daina", Kaunas
- Nuoroda atgal į pagrindinį puslapį

`<meta name="robots" content="noindex">` šitam puslapiui.

---

## GOOGLE SHEETS INTEGRACIJA

`js/config.js`:

```javascript
// Google Apps Script Web App endpoint. Pakeisti į realų /exec URL prieš deploy.
export const FORM_ENDPOINT = 'PLACEHOLDER_APPS_SCRIPT_EXEC_URL';
```

`js/form.js` submit dalis — **content-type turi būti `text/plain`**:

```javascript
const res = await fetch(FORM_ENDPOINT, {
  method: 'POST',
  headers: { 'Content-Type': 'text/plain;charset=utf-8' },
  body: JSON.stringify(payload)
});
const data = await res.json();
if (!data.ok) throw new Error(data.error || 'submit_failed');
```

Priežastis: `application/json` sukelia CORS preflight, kurio Google Apps Script netvarko.
`text/plain` yra "simple request" — preflight'o nėra. **Nekeisk į `application/json`
ir nenaudok `mode: 'no-cors'`.**

Payload raktai turi tiksliai atitikti: `vardas`, `telefonas`, `elpastas`, `miestas`,
`autobusas`, `company`.

---

## MOBILE (klientas patvirtino: adaptacija programuotojo nuožiūra)

Mobile dizaino PSD'e nėra. Taisyklės:

- **Breakpoint'ai:** `> 1024px` desktop (pixel-accurate), `768–1024px` tablet, `< 768px` mobile.
- **Dekoras desktop'e** — absoliučiai pozicionuotas pagal manifest koordinates, konteineris
  `position: relative; width: 1920px` centruotas, `overflow: hidden`.
- **Dekoras mobile'e** — nesikartok su desktop koordinatėmis. Palik **maks. 1–2 elementus
  vienai sekcijai**, sumažintus, prie kraštų. Likusius `display: none`.
  Prioritetas ką palikti: mikrofonas (hero), viena kino juostelė, varlytė, viena žvaigždė.
  Kamerą, clapperboard'ą, žiedus ir šviestuvus mobile'e slėpk — jie per detalūs mažame ekrane.
- **Fonas mobile'e** — kiekviena sekcija gauna savo `background-image` su
  `background-size: cover; background-position: center`. Sekcijos aukštis nustatomas turinio,
  ne fono.
- **Nuotraukų galerija:** desktop — originalus 7 eilučių išdėstymas pagal `photos_manifest.json`.
  Mobile — CSS Grid `grid-template-columns: repeat(2, 1fr)` su `gap`, nuotraukos eilės tvarka
  `photo_01` → `photo_14`, `aspect-ratio` išlaikomas, `object-fit: cover`.
- **Tipografija** — naudok `clamp()` tarp mobile ir desktop dydžių, ne fiksuotus px su
  media query kiekvienam elementui.
- Minimalus touch target: 44×44px (mygtukai, radio).

---

## FONTAI

Nexa (originalus brandbook šriftas) yra komercinis ir **kol kas negaunamas**.

CSS kintamieji `base.css` viršuje, kad pakeitimas vėliau būtų vienos eilutės darbas:

```css
:root {
  --font-display: 'Gautreaux', cursive;   /* antraštė */
  --font-body: 'Jost', sans-serif;        /* laikinas Nexa pakaitalas */
}
```

- **Gautreaux-Light** — `.otf` failą pateiks užsakovas. Įdėk `@font-face` deklaraciją
  `fonts/` kelyje su `font-display: swap`. Kol failo nėra, naudok `cursive` fallback.
- **Body šriftas** — laikinai **Jost** iš Google Fonts, self-hosted (ne CDN link — atsisiųsk
  woff2 ir dėk į `fonts/`, kad nebūtų render-blocking third-party request).
  Naudok tik reikalingus svorius: 400, 600, 700. Įtrauk lietuviškų rašmenų subsetą.

**Nedaryk:** neatsisiuntinėk Nexa iš nelegalių šaltinių, net jei rasi. Jei `fonts/` aplanke
atsiras Nexa failai — naudok juos, bet pats jų neieškok.

---

## PERFORMANCE TIKSLAS: Lighthouse 90+ mobile

Privaloma:

- Visi `<img>` su aiškiais `width` ir `height` atributais (CLS prevencija).
- `loading="lazy"` visoms nuotraukoms **išskyrus** hero sekcijos turinį.
- `fetchpriority="high"` hero fono paveikslėliui.
- Fono paveikslėliai per CSS `background-image` su media query — mobile'e neatsisiųsk
  desktop versijos ir atvirkščiai.
- Kritinis CSS (hero sekcija) inline `<head>`; likęs CSS su `media="print" onload="this.media='all'"`
  arba tiesiog atskiras `<link>`, jei paprasčiau ir vis tiek pasiekia 90+.
- Jokių render-blocking third-party request'ų.
- `js/form.js` su `defer`.
- Preload tik tiems fontams, kurie naudojami first paint'e.

---

## SEO / META

Kiekvienam puslapiui:
- `<html lang="lt">`
- Unikalus `<title>` ir `<meta name="description">`
- Open Graph tag'ai (`og:title`, `og:description`, `og:image`, `og:url`)
- `og:image` — sugeneruok 1200×630 crop iš `REFERENCE_desktop_1920.jpg` hero dalies
- `Event` JSON-LD structured data `index.html` puslapyje (pavadinimas, data, vieta)
- `aciu.html` — `noindex`

---

## DARBO TVARKA

Dirbk etapais. **Po kiekvieno etapo sustok ir parodyk rezultatą — nepradėk kito, kol
nepatvirtinsiu.**

1. **Skeletas.** Failų struktūra, `base.css` su kintamaisiais ir tipografija, `index.html`
   semantinis markup su realiu tekstu iš `text_content.json`. Be dekoro, be fono.
2. **Desktop fonas ir sekcijos.** 4 fono atkarpos, sekcijų aukščiai, teksto pozicijos.
3. **Desktop dekoras.** Visi elementai pagal `manifest.json` koordinates.
4. **Nuotraukų galerija** pagal `photos_manifest.json`.
5. **Mobile adaptacija** visoms sekcijoms.
6. **Registracijos ir ačiū puslapiai** + formos JS.
7. **Performance auditas** ir optimizacija iki 90+.

## VERIFIKACIJA (Playwright MCP)

Po 3, 4 ir 5 etapo:

1. Paleisk lokalų serverį (`python3 -m http.server 8080`).
2. Per **playwright mcp** atidaryk `http://localhost:8080`, nustatyk viewport 1920px plotį.
3. Padaryk full-page screenshot'ą.
4. Palygink su `assets/REFERENCE_desktop_1920.jpg`.
5. Įvardyk konkrečius neatitikimus (elementas, kryptis, apytikslis px skirtumas) ir ištaisyk.
6. Kartok, kol neliks matomų neatitikimų.

Po 5 etapo tą patį pakartok su viewport 390×844 (iPhone), bet **nelygink su reference** —
mobile dizaino nėra. Tikrink: ar nėra horizontalaus scroll'o, ar tekstas neišeina iš
konteinerių, ar nesikerta dekoro elementai su tekstu, ar mygtukai pasiekiami pirštu.

## KO NEDARYTI

- Nekeisk teksto iš `text_content.json` — nei rašybos, nei formuluočių.
- Neperdaryk assets failų.
- Nepridėk framework'ų, bibliotekų ar build tool'ų.
- Nedaryk kelių etapų iš karto.
- Nekeisk `Content-Type: text/plain` formos submit'e.
- Nedaryk `git commit` ar `git push` be atskiro nurodymo.
- Jei kažkas neaišku — klausk, nespėliok.
