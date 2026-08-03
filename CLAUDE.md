# Loud Rag — Shopify Theme

## About the Store
- **Brand:** Loud Rag (formerly Funny Shirtz)
- **Location:** Boise, Idaho
- **Concept:** Original graphic tees, printed in small runs, new drop the 1st of every month
- **Contact email:** 510ricogn@gmail.com
- **Fulfillment:** Printify print-on-demand

## Design System — "Riot Press"
Punk flyer / screenprint aesthetic. Sharp edges, no rounded corners, heavy display type.

### Palette
| Token | Hex | Use |
|---|---|---|
| `--lr-ink` | `#111110` | Page background |
| `--lr-ink-2` | `#1A1A18` | Alternate section background |
| `--lr-red` | `#C41E1E` | Primary accent, buttons, announcement bar |
| `--lr-bone` | `#F2EDE3` | Body text, light sections |
| `--lr-mustard` | `#E8C547` | Secondary accent, stats, tape, badges |
| `--lr-muted` | `#4A4844` | Borders, hairlines |

### Type
- **Archivo Black** — all display and headings (`--lr-display`)
- **Instrument Serif** — pull quotes and review marks (`--lr-voice`)
- **Karla** — body copy and UI (`--lr-body`)

Loaded via Google Fonts in `layout/theme.liquid`.

## Files

### Assets
- `assets/loud-rag.css` — full design system: palette, type scale, grain overlay, misprint headlines, halftone patterns, marquee, buttons, cards, header/footer overrides
- `assets/loud-rag.js` — motion layer

### Custom Sections
- `sections/lr-hero.liquid` — full-viewport hero, cinematic wipe load, rotating stamp, trust stats, marquee
- `sections/lr-countdown.liquid` — next-drop countdown + email capture
- `sections/lr-story.liquid` — About / Our Story with parallax panel
- `sections/lr-testimonials.liquid` — reviews (block-based, add/remove in theme editor)
- `sections/lr-custom.liquid` — custom orders CTA + info row + marquee

## Motion Layer
Loaded from CDN in `assets/loud-rag.js`:

- **Lenis** 1.0.42 — smooth scroll, synced to GSAP ticker
- **GSAP** 3.12.5 + **ScrollTrigger** — all scroll choreography
- **SplitType** 0.3.4 — headings split to words, masked rise-in on `.lr-split`

Features: custom cursor (morphs on hover, contextual labels via `data-cursor`), magnetic buttons, hero wipe + line assemble, scroll-triggered counters (`data-count`), cursor-proximity stamp spin, scroll-reactive marquees, clip-path section wipes.

Degrades gracefully — if CDNs fail, everything is made visible and counters/countdown still run.

## Utility Classes
- `.lr-split` — heading splits into words and staggers in on scroll
- `.lr-fade-up` / `.lr-fade-left` / `.lr-fade-right` — directional reveals
- `[data-stagger]` — stagger direct children
- `[data-count]` — counts up on scroll (`data-suffix`, `data-dec` optional)
- `[data-cursor="Label"]` — shows a label inside the custom cursor
- `.lr-misprint` with `data-text` — screenprint offset headline
- `.lr-marks` — corner registration ticks
- `.lr-index` — oversized watermark numeral

## Notes
- Shopify 2.0 architecture (sections + blocks)
- All section copy is editable in the theme editor — no hardcoded strings
- Placeholders are marked `[REPLACE: ...]`
- Homepage order set in `templates/index.json`: hero → drop → countdown → story → reviews → custom orders
- Reviews are placeholder copy and must be swapped for real ones before launch
