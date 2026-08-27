# Design Reference

`af-net-live-styles.css` is the **actual CSS pulled from the live af.net homepage**
(extracted from its inline `<style>` blocks). It's kept here as ground truth for
matching colors, fonts, spacing, and component styles (buttons, cards, etc.)
while building out the Next.js frontend page by page — not meant to be used
directly in the app.

## Key tokens extracted so far (see `src/app/globals.css` / `tailwind.config.ts`)

**Colors** (Kadence global palette):
| Var | Hex | Usage |
|---|---|---|
| `--global-palette1` | `#E21E51` | Primary accent (pink/red) |
| `--global-palette2` | `#5d9eff` | Secondary accent (blue) |
| `--global-palette3` | `#000b33` | Dark navy (buttons, headings) |
| `--global-palette6` | `#003153` | Dark navy variant |
| `--global-palette7` | `#deddeb` | Light lavender-gray |
| `--global-palette8` | `#f9f9f9` | Off-white |
| `--global-palette9` | `#ffffff` | White |

**Fonts:**
- Body/UI default: **Lexend** (most frequently used)
- Headings: **Montserrat** / **Poppins**
- Accents: **Playfair Display**
- Per-language overrides (from WPML CSS): Arabic → Noto Sans Arabic, Chinese → Noto Sans CJK SC, Russian → PT Sans

**Buttons (`.kb-button`):** fully rounded/pill shape (`border-radius: 500%`), navy background, white text/border.

## Next steps for full pixel-parity

This file only covers the **homepage**. As we build out each page (summits,
news, about, membership), re-run the same extraction against that page's URL
and diff against what's already ported, updating this reference and the
Tailwind/CSS tokens accordingly.
