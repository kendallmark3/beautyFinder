# Evidence: Feature 017 Screen Size and Type

Run: `npm test` (full output in `tests.txt`) · Result: **111 / 111 passing** (105 before, 6 from Feature 017)

| AC | Test | Result | Implemented in |
|----|------|--------|----------------|
| AC-1 | `AC-1: every font size in every stylesheet is relative to one root size; none is in pixels` | PASS | all five stylesheets in `public/` |
| AC-2 | `AC-2: the root size is defined once and grows with the window from 16px to 20px` | PASS | `public/styles.css` → `html` |
| AC-3 | `AC-3: no font size is below 0.8 of the root, and buttons take their size from the scale` | PASS | all five stylesheets; `public/styles.css` → `.cta` |
| AC-4 | `AC-4: the page width is a share of the window up to a cap, defined once, used by header and sections` | PASS | `public/styles.css` → `:root`; `public/discover.css` |
| AC-5 | `AC-5: the picks, the bag and the Discover screens are sized to fill the width` | PASS | `public/recommendations.css`, `public/cart.css`, `public/discover.css`, `public/styles.css` |
| AC-6 | `AC-6: narrow-screen rules are kept, so phones are laid out as before` | PASS | narrow-screen blocks in four stylesheets |

Scope check: only the five stylesheets changed, plus the new test. No HTML file and nothing under `src/` changed. Two earlier tests had the patterns that pinned the old page width, card width and summary width updated (`tests/layout.test.js`, `tests/bag-experience.test.js`). The intent's floor was raised from 0.75 to 0.8 of the root during the build, when measurement showed 0.75 left text under 14 px on a laptop.

This feature adds no API endpoint, so there is no `api-responses.md`.

## Success, measured in the running app

Headless Chrome against the running app, before and after, same script. "Width used" is the content width of each screen's main block as a share of the window. Text sizes are computed sizes of every visible element that holds text.

### Width used

| Screen | 1728 px before | 1728 px after | 1280 px before | 1280 px after |
|--------|----------------|---------------|----------------|---------------|
| Front screen photographs | 100% | 100% | 100% | 100% |
| Front screen catalog | 63% | 81% | 84% | 86% |
| Discover welcome | 49% | 83% | 67% | 88% |
| Discover studio | 63% | 81% | 84% | 86% |
| Shade Finder | 63% | 81% | 84% | 86% |
| Bag | 63% | 81% | 84% | 86% |
| Picks | 63% | 81% | 84% | 86% |
| Credits | 60% | 78% | 81% | 82% |

Target was at least 75% on a 1728 px window: **met on every screen.**

### Text size

| Screen | Smallest before | Smallest after (1280) | Smallest after (1728) | Share under 14 px before | After (both widths) |
|--------|-----------------|-----------------------|-----------------------|--------------------------|---------------------|
| Front screen | 11 px | 14.3 px | 15.3 px | 57% | 0% |
| Discover welcome | 12 px | 14.3 px | 15.3 px | 64% | 0% |
| Discover studio | 10 px | 14.3 px | 15.3 px | 68% | 0% |
| Shade Finder | 10.5 px | 14.3 px | 15.3 px | 54% | 0% |
| Bag | 12 px | 14.3 px | 15.3 px | 50% | 0% |
| Picks | 11 px | 14.3 px | 15.3 px | 52% | 0% |
| Credits | 12 px | 14.3 px | 15.3 px | 18% | 0% |

Target was nothing under 13 px and under a fifth of text under 14 px: **met; nothing is under 14 px at either width.** The root size computed to 17.84 px at 1280, 19.18 px at 1728, and 16 px on the phone.

### Sideways scrolling

None on any of nine screens (home, Discover welcome and studio, Shade Finder before and after the reveal, bag, checkout preview, picks, credits) at 390, 1280 or 1728 px.

Screenshots of the result are in `screens/` (`wide-*` at 1728 px, `laptop-*` at 1280 px, `phone-*` at 390 px).

## Found and fixed while checking

- The main buttons had never been given a font size and were using the browser's 13.3 px default. They now take theirs from the scale.
- On a phone, the bigger text made the four checkout step labels collide. They are now two rows of two.
- On a phone, the saving on the receipt wrapped onto two lines. Amounts no longer wrap.
- At 1280 px the front-screen headline left the single word "you." on its own line. Headings now balance their lines.

## Limits of this evidence

- **On a phone the text is only a little bigger.** The root size there is 16 px, as before; what changed is that nothing is under 12.8 px, where some labels were 10 px.
- Three window widths were checked. Windows between or beyond them were not, and nor was a real phone or tablet.
- Every screen was checked for sideways overflow and several were looked at, but not every screen at every width was inspected by eye for text crowding.
- Whether the result is "a better look" is a judgement; the evidence shows the measurements and the screens.
- Heading line balancing relies on a recent browser feature; older browsers will wrap headings as before.
- Tests were run on Node 25.6.1.
