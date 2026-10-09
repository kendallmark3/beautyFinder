# Feature 010: Balanced Layout

**Status:** Done · Evidence: `evidence/010-balanced-layout/` · **Team:** Platform

## Story
As a shopper arriving on the front screen, I want it to grab me straight away and sit evenly
across the window, so that I am not distracted by everything leaning to the right.

## Goal
The front screen is built around the centre line. The headline and main button are centred,
all four models stand side by side from the left edge of the window to the right, and every
section below is centred. On every page the header lines up with the content beneath it.

## Scope
- **In (create):** `tests/layout.test.js`
- **In (change):** `public/styles.css`; `public/index.html` (hero and band markup and order, and the try-on wiring that
  positions the shade card); `public/discover.css` (page width only); `public/models.js` (one photo's focus point)
- **Out:** `src/`, any copy other than the try-on hint, the photographs themselves, a mobile menu, the bag and
  Shade Finder page content.

## Feature rules
- One page width and one gutter, defined once (`--page`, `--gutter` in `public/styles.css`), used by the header and every section.
- Nothing is drawn over a model's face: the shade card sits below the photographs, not on them.
- The model closest to the picked shade is shown wider than the others. No photograph is recoloured, filtered, or dimmed (Feature 008 AC-4 still holds).
- No new dependencies. No changes outside Scope.

## Changes to earlier features
- **003 / 008:** the hero is no longer text on the left and one photograph on the right. The band's text is centred under its photograph, and the band now follows the bundles.
- **004 / 008:** the shade card moved from on top of the photograph to below the swatches. The "Previewing …" line is kept for screen readers and no longer shown.

## Acceptance criteria
- **AC-1** The header and every section share one page width and gutter, so the brand name lines up with the content below it on every page.
- **AC-2** The hero's headline, text, button and links are centred.
- **AC-3** All four models are shown side by side across the full width of the window, and the one closest to the picked shade is wider.
- **AC-4** The shade card is below the photographs, never over one.
- **AC-5** The try-on swatches, bundle heading, band text, collection heading and filters, and footer are centred.
- **AC-6** A row of products that does not fill the width is centred.

## Done when
`npm test` passes, every AC maps to a passing test, and `evidence/010-balanced-layout/` is complete.
