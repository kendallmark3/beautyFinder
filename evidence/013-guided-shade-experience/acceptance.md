# Evidence: Guided Shade Experience

Intent: `intent/features/Feature7.md` (titled "Feature 007: Guided Shade Experience"). Filed here as **013** because 007 was already used by Beauty Discovery; the intent file itself is unchanged.

Run: `npm test` (full output in `tests.txt`) · Result: **85 / 85 passing** (79 from Features 001 to 012, 6 new)

**Status: built and evidenced. The human visual review the intent requires has not been done.** See `review.md`.

## How the intent was read

The intent names no files and does not number its criteria; it leaves the solution to the implementer. These choices were made to run it:

- **"The existing shade-selection experience … a functional form-and-results interaction"** was taken to be `/shade-finder.html`, which was a slider, three buttons, and a row of result cards.
- **Scope:** changed `public/shade-finder.html`; created `public/guided-shade.js`, `public/shade-finder.css`, `tests/guided-shade.test.js`. Nothing under `src/` changed. No other page changed.
- **Acceptance criteria:** the six functional success criteria, in the order written, as AC-1 to AC-6.
- **"Model/skin visualization capability":** the photo models (Feature 008) and the shade colour function. No photograph is recoloured.

## Functional criteria

| AC | Criterion (from the intent) | Test | Result | Implemented in |
|----|-----------------------------|------|--------|----------------|
| AC-1 | Existing shade matching continues to produce the same valid recommendations | `AC-1: existing shade matching produces the same recommendations, and the page keeps their order` | PASS | `src/lib/shadeMatch.js` (unchanged), `public/guided-shade.js` → `presentMatches()` |
| AC-2 | A shopper can complete shade discovery and identify the primary recommended shade | `AC-2: a shopper can complete discovery and identify the primary recommended shade` | PASS | `public/shade-finder.html` (three steps, "Your closest match") |
| AC-3 | The shopper can visually understand the effect of her shade selection | `AC-3: the shopper can see the effect of her selection` | PASS | `public/guided-shade.js` → `complexion()`, `difference()`; `public/shade-finder.html` → `paint()` |
| AC-4 | Existing product and bag functionality continue to work | `AC-4: product and bag functionality continue to work from the recommendation` | PASS | `public/shade-finder.html` → `add()`, `public/cart.js` (unchanged) |
| AC-5 | Existing automated tests continue to pass | `AC-5: what earlier features require of this page still holds`, and the 79 earlier tests | PASS | none changed |
| AC-6 | The experience remains usable on desktop and mobile | `AC-6: the experience is laid out for desktop and for mobile` | PASS | `public/shade-finder.css` |

AC-1 was checked for all 57 choices the page offers (19 depths × 3 undertones): the API's answer equals the rules library's, and the page presents it in the same order. No earlier test was changed.

## Running-product evidence

Captured from the running app (`screens/`), headless Chrome. Desktop is 1280 × 860; mobile emulates a 390 × 844 phone.

| Required by the intent | File | What it shows |
|------------------------|------|---------------|
| Initial shade-discovery experience | `desktop-1-initial.jpg`, `mobile-1-initial.jpg` | Step 1 open, steps 2 and 3 locked, nothing chosen |
| Light-complexion interaction | `desktop-2-light-complexion.jpg` | Depth 2, Rosy: complexion circle `rgb(224, 198, 187)`, lighter model |
| Medium-complexion interaction | `desktop-4-medium-complexion.jpg`, `mobile-2-medium-steps.jpg`, `mobile-3-medium-complexion.jpg` | Depth 5: complexion circle `rgb(194, 144, 105)` (In between) and `rgb(204, 153, 95)` (Golden), light-to-medium model |
| Deep-complexion interaction | `desktop-5-deep-complexion.jpg` | Depth 8.5, Golden: complexion circle `rgb(128, 87, 40)`, deeper model |
| Resulting primary recommendation | `desktop-3-light-recommendation.jpg`, `desktop-6-deep-recommendation.jpg`, `mobile-4-recommendation.jpg` | 140 Fair Rose; 340 Cocoa; 230 Honey Beige, each as "Your closest match" above two "Also close" |
| Transition into product / bag flow | `desktop-7-added-to-bag.jpg`, `desktop-8-bag.jpg`, `mobile-5-alternatives-and-next.jpg`, `mobile-6-bag.jpg` | Add to bag, bag count 1, bag page with shade 340 Cocoa at $42.00 and a bundle suggestion |
| Desktop evidence | the eight `desktop-*` files | |
| Mobile evidence | the six `mobile-*` files | |
| Automated test results | `tests.txt` | 85 / 85 |

Values read from the page during the capture run:

| Selection | Model shown | Primary | Alternatives |
|-----------|-------------|---------|--------------|
| Depth 2, Rosy (cool) | lighter | 140 Fair Rose, excellent | 120 Ivory, 110 Porcelain |
| Depth 5, In between (neutral) | light to medium | 230 Honey Beige, excellent | 220 Natural Buff, 240 Rose Beige |
| Depth 5, Golden (warm), mobile | light to medium | 230 Honey Beige, excellent | 220 Natural Buff, 250 True Beige |
| Depth 8.5, Golden (warm) | deeper | 340 Cocoa, excellent | 330 Warm Amber, 360 Espresso |

No page scrolled sideways at either size. After "Reveal my match" the recommendation was in view at both sizes.

## Limits of this evidence

- **The experiential criteria are not assessed here.** The intent says they are for human review and must not be scored automatically. `review.md` holds the five questions, unanswered, with the builder's observations.
- The screenshots are stills. The colour transitions, the cross-fade between models, and the scroll to the recommendation are not captured.
- Mobile was one emulated size, not a real phone. Keyboard use was not exercised by hand.
- `consultation: true` still cannot occur with the shipped catalog, so the consultation notice was not seen.
- The undertone hints (jewelry, tanning, flushing) are common rules of thumb, reused from Discover. They are not from `context/` or the shade-science skill.
- The screenshots include the Pexels stock photographs (see `public/credits.html`).
- Tests were run on Node 25.6.1.
