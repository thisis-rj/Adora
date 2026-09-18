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
design/                 the full-page reference mockup
```

## Adding your images

Every photo is a named slot. Drop files into `assets/images/` with the filenames
listed in [`assets/images/README.md`](assets/images/README.md) and they appear —
no code change needed. Until a file exists, its slot renders as a tinted
placeholder labelled with the filename it expects.

## Sections

1. Hero — "Water is step zero in beauty"
2. `01` Your water report — pincode lookup that fills the report card
3. `02` The invisible truth — the four contaminant cut-outs
4. `03` Our technology — the four filter stages
5. `04` Real results — Hair/Skin/Shower tabs, stat bars, before/after slider
6. `05` Real people — testimonial carousel with the Day 0 / Day 90 cartridges
7. FAQ — accordion (added so the `FAQs` nav link has a destination; delete the
   `#faq` section and its nav entry if you don't want it)
8. Closing CTA + footer

## Before launch

- **Water data is placeholder.** `SAMPLE_WATER_DATA` in `assets/js/main.js` holds
  illustrative figures for eight city prefixes plus a fallback. Wire it to a real
  groundwater source before publishing, or the numbers are decoration presented
  as fact.
- **Stats are placeholder.** `RESULTS_DATA` in the same file carries the 92/89/87
  style percentages from the mockup. Replace with figures you can substantiate.
- Testimonials, the cart count and the `Shop` links are all static.
