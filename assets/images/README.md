# Image slots

Drop your section images into this folder using these exact filenames. Any slot
that is missing renders as a tinted placeholder labelled with the filename it is
waiting for, so the page never breaks while assets are still coming in.

| Filename | Section | What it shows | Suggested size |
|---|---|---|---|
| `hero-showerhead.webp` | Hero | Showerhead with the Adora filter, pink light | 2400 × 1600, wide crop |
| `water-report-sphere.webp` | 01 · Your water report | Water sphere holding mineral particles | 1600 × 1100 |
| `particle-iron.webp` | 02 · The invisible truth | Rust-coloured iron cluster | 800 × 800, transparent PNG/WebP |
| `particle-hardness.webp` | 02 | Calcium + magnesium crystals | 800 × 800, transparent |
| `particle-sediment.webp` | 02 | Dark sediment grains | 800 × 800, transparent |
| `particle-other.webp` | 02 | Fine pink impurities | 800 × 800, transparent |
| `technology-stages.webp` | 03 · Our technology | Filter exploded into its four media stages | 2000 × 1000, transparent |
| `results-hair-before.webp` | 04 · Real results | Hair before — dull, rough | 1400 × 1400 |
| `results-hair-after.webp` | 04 | Hair after — smooth, glossy | 1400 × 1400 |
| `cartridge-day-0.webp` | 05 · Real people | Clean white cartridge | 600 × 800, transparent |
| `cartridge-day-90.webp` | 05 | Same cartridge stained orange | 600 × 800, transparent |
| `avatar-nikhil.webp` | 05 | Customer portrait | 160 × 160 square |
| `avatar-aditi.webp` | 05 | Customer portrait | 160 × 160 square |
| `avatar-meera.webp` | 05 | Customer portrait (carousel slide 3) | 160 × 160 square |
| `avatar-rohan.webp` | 05 | Customer portrait (carousel slide 4) | 160 × 160 square |
| `cta-portrait.webp` | Closing CTA | Woman under the shower | 1600 × 2000, tall crop |

## Notes

- **Before/after pair** (`results-hair-before` / `results-hair-after`) must be
  framed identically — the slider wipes one over the other, so any shift in crop
  or scale is visible as a jump.
- **Cut-outs** (particles, filter stages, cartridges) sit directly on the section
  colour, so they need transparent backgrounds.
- The hero and CTA photos are `object-fit: cover`; keep the subject away from the
  left third of the hero, where the headline sits.
- Prefer WebP around quality 80. If you only have JPG or PNG, either convert or
  change the `src` in `index.html` — the extension is not special-cased anywhere.
