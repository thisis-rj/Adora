# Adora

Landing page for Adora — a four-stage shower filter designed for Indian water.

Static HTML, CSS and vanilla JavaScript. No build step, no dependencies.

## Run it

Open `index.html` directly, or serve the folder so relative paths behave exactly
as they will in production:

```sh
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Layout

```
index.html              markup for every section
assets/css/styles.css   design tokens + all section styling
assets/js/main.js       nav, pincode report, tabs, before/after slider, carousel
assets/images/          section images — see assets/images/README.md
design/                 the reference mockup this page was measured against
```

## How the desktop layout is built

The design was reverse-measured from `design/reference-full-page.webp` — text
blocks were located by pixel-profiling the mockup, and type sizes were solved by
matching rendered string widths against the measured ones.

Desktop therefore reproduces a **1440px design canvas**. Every dimension is
written in design pixels and multiplied by `--s`:

```css
--s: calc(min(100vw, 1440px) / 1440);   /* 1px at 1440, scales below */
font-size: calc(65 * var(--s));
```

So the whole composition keeps the mockup's proportions at any width, and caps
at 1440px. Below 1000px that scaling would push body copy under ~15px, so the
layout stacks and takes over its own fluid sizes from the `max-width: 999px`
block.

If you change a value, keep it in design pixels — read it off the mockup at
1440 and wrap it in `calc(N * var(--s))`.

## Typography

The original design uses a commercial display serif and a geometric sans that
aren't publicly available. These are the closest free equivalents, chosen by
comparing rendered letterforms and string widths against the mockup:

| Role | Font | Notes |
|---|---|---|
| Display / headlines | **Playfair Display** | stands in for the mockup's editorial serif |
| Body, UI, labels | **DM Sans** | 400 / 500 / 700 |
| Handwritten accents | **Caveat** | the three script notes |

Headline sizes are **per section**, not a single scale — the mockup genuinely
varies (hero 97px, sections 01/02 ~62–65px, section 03 55.5px, section 04 60px,
CTA 63.5px). That's deliberate, not drift.

Fonts load from Google Fonts. Self-host them if you want to drop the external
request.

## Sections

1. Hero — "Water is step zero in beauty"
2. `01` Your water report — pincode lookup that fills the report card
3. `02` The invisible truth — the four contaminant cut-outs
4. `03` Our technology — the four filter stages
5. `04` Real results — Hair/Skin/Shower tabs, stat bars, before/after slider
6. `05` Real people — testimonial carousel with the Day 0 / Day 90 cartridges
7. Closing CTA + footer

## Adding your images

Every photo is a named slot. Drop files into `assets/images/` with the filenames
listed in [`assets/images/README.md`](assets/images/README.md) and they appear —
no code change needed. Until a file exists, its slot renders as a tinted
placeholder labelled with the filename it expects.

## Before launch

- **The `FAQs` nav link goes nowhere.** The mockup's header and footer both show
  it, but the design has no FAQ section, so both are `href="#"` and marked
  `.is-placeholder`. Point them at a real page.
- **Water data is placeholder.** `SAMPLE_WATER_DATA` in `assets/js/main.js` holds
  illustrative figures for eight city prefixes plus a fallback. Wire it to a real
  groundwater source before publishing, or the numbers are decoration presented
  as fact.
- **Stats are placeholder.** `RESULTS_DATA` in the same file carries the 92/89/87
  style percentages from the mockup. Replace with figures you can substantiate.
- Testimonials, the cart count and the `Shop` links are all static.
