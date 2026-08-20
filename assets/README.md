# Elesen "The Greatest ELESEN Show" — ištraukti assets

Šaltinis: `Elesen_web_landing_page.psd`, canvas **1920 × 9048px**.
Visos koordinatės `manifest.json` faile yra x/y/width/height šitoje 1920px pločio erdvėje
(top-left = 0,0), tiesiai naudojamos CSS `position: absolute; left / top`.

## Struktūra

- `bg_slices/` — 4 fono atkarpos (WebP, jau su spalvų korekcija ir spotlight/glow efektais baked in), sukirpta pagal turinio sekcijas, ne po lygiai:
  - `bg_1_hero.webp` — 0–1900px (antraštė, intro, CTA mygtukas)
  - `bg_2_program.webp` — 1900–3450px (renginio programa)
  - `bg_3_dresscode.webp` — 3450–6300px (dress code tekstas + kolažo pradžia)
  - `bg_4_photos.webp` — 6300–9048px (kolažo pabaiga, uždarymas)
  - `bg_full_single.webp` — tas pats turinys vienu failu, jei vis dėlto norėsi vieno background'o (žr. pastabą apačioje)
- `cutouts/` — 15 transparent PNG: logo, mikrofonas, 3× kino juostelė, varlytė, 3× žiedas, 2× šviestuvas, walk of fame žvaigždė, clapperboard, kamera, ir visas nuotraukų kolažas (jau vientisas, 1074×4774).
- `manifest.json` — kiekvieno cutout'o tiksli x/y/w/h pozicija originaliam 1920px canvas'e + fono sekcijų ribos + šriftų pavadinimai.
- `text_content.json` — visas realus tekstas iš PSD text layer'ių (be perrašinėjimo iš screenshot'ų).

## Dėl fono: vienas failas vs. 4 atkarpos

**Pataisyta klaida:** ankstesnėje versijoje background'as buvo sukompozituotas iš viso PSD flatten'o, tad tekstas ir dekoro elementai (kino juostelė ir pan.) buvo įkepti į foną. Dabar composite'as daromas TIK iš `BG` + `Spotlight` + tikros color grading + dviejų apatinių "sviesa" blyksnių — jokio teksto, jokių dekoro objektų. Patikrinta vizualiai.

Kadangi švarus fonas (be teksto/foto detalių) kompresuojasi kur kas geriau, dabar 4 atkarpos iš viso sveria ~159KB (buvo ~805KB su viskuo įkepta). 4 atkarpos vis tiek geresnis pasirinkimas nei vienas failas:
- **Lazy loading** — naršyklė kraus tik tą fono atkarpą, kuri realiai artėja į viewport, ne visus 9000px iš karto.
- **Responsive alignment** — kiekviena sekcija (hero/programa/dress code/photos) gauna savo `background-image` su `background-size: cover`. Mobile'e turinys pailgės (tekstas laužysis kitaip), bet kiekviena atkarpa vis tiek dengs tiksliai savo sekciją, nesvarbu koks jos aukštis. Su vienu ilgu fonu ir absoliučiu pozicionavimu tas pats nepavyktų — spotlight/glow efektai atsidurtų ne ten, kur turėtų, kai mobile'e turinys ištemps sekcijas.

Jei vis tiek nori vieno failo — `bg_full_single.webp` yra paruoštas, tik tada dekoro elementų pozicijas reikės skaičiuoti procentais nuo viso 9048px aukščio, o ne nuo sekcijos.

## Šriftai

- Antraštė ("The Greatest" / "show") — **Gautreaux-Light** (script)
- Visas kitas tekstas — **Nexa** šeima (Book / Regular / Bold / ExtraBold / Heavy)

Abu mokami. Reikės arba web-font licencijos, arba artimo nemokamo analogo, jei nėra.

## Ko čia NĖRA (sąmoningai)

- Jokio teksto kaip paveikslėlio — visas tekstas realus, `text_content.json`.
- "Registracija į renginį" mygtukas — nerastas kaip cutout, nes tai turėtų būti tikras `<button>`/`<a>`, ne paveikslėlis (klikabilumas, hover state).
- "Sviesa" (išplitę švytėjimai apačioje) — baked į background sekcijas, ne atskiri cutout'ai, nes neturi aiškaus krašto ir nereikia jų atskirai pozicionuoti.
