# Evidence: Feature 008 Real Photography

Run: `npm test` (full output in `tests.txt`) · Result: **57 / 57 passing** (49 from Features 001 to 007, 8 from Feature 008)

| AC | Test | Result | Implemented in |
|----|------|--------|----------------|
| AC-1 | `AC-1: the hero and the band show photographs of women, each with alternative text` | PASS | `public/index.html`, `public/models.js` |
| AC-2 | `AC-2: every foundation shade is shown beside the model with the closest skin depth` | PASS | `public/models.js` → `nearestModel()` |
| AC-3 | `AC-3: a picked shade is shown on a card, and the page says a photo cannot show a shade exactly` | PASS | `public/index.html`, `public/styles.css` → `.shade-card` |
| AC-4 | `AC-4: no photograph is recoloured or filtered` | PASS | `public/styles.css`, `public/discover.css`, all pages |
| AC-5 | `AC-5: every photograph is a JPEG kept in the app, and no page loads anything from another site` | PASS | `public/photos/`, all pages |
| AC-6 | `AC-6: the credits page lists every photograph with its photographer and source, and says the models endorse nothing` | PASS | `public/credits.html`, footers in `public/index.html`, `public/discover.html` |
| AC-7 | `AC-7: the people pictured are never given a name` | PASS | `public/models.js`, `public/discover.js` → `lookName()` |
| AC-8 | `AC-8: the illustrated models are gone` | PASS | `public/hero.svg` removed, `public/discover.js` |

Tests of earlier features changed by this feature, all passing: 003 AC-2, AC-5, AC-6; 004 AC-5, AC-6; 007 AC-2, AC-3, AC-7.

Scope check: every file touched is listed under Scope. Nothing under `src/` changed. No new dependencies.

This feature adds no API endpoint, so there is no `api-responses.md`.

## Checked in a real browser

Headless Chrome, 1280 px wide, against the running app:

1. Front screen: all five images loaded. Picking 350 Mahogany showed the deeper model with a "350 Mahogany" card in that shade's colour; 250 True Beige showed the medium-to-deep model; 120 Ivory showed the lighter model.
2. The photo band showed all three women's faces beside the text panel.
3. Discover: the welcome showed four portraits; choosing a model swapped the stage photo; the palette showed Foundation, Finish, Eyes, Lips and Cheeks chips that changed with each choice.
4. A full run (Deeper, Golden, Dewy glow, Dramatic, Berry, Pink) revealed "Evening Berry Glow" with 360 Espresso, serum, mascara and lipstick; "Add the whole look to my bag" took the bag count to 4.
5. The credits page listed five photographs.

## Limits of this evidence

- **Licence.** The Pexels licence allows free commercial use but says not to imply that the people pictured endorse a product. This app shows them beside foundation shades on a shop front. The pages and the credits page say they are stock models who endorse nothing, which suits a class demo. It is not a substitute for licensed, model-released photography in anything real.
- **Photographer names** for two photos (model-lighter, model-medium-deep) were read from the Pexels pages by an automated summary, and the other three from search results. None was checked by a person.
- **Depth placement is a judgement.** Each model's place on the 1 to 10 scale was set by eye, by the builder, from one photo under its own lighting.
- **Served type.** `src/server.js` has no entry for `.jpg`, so photos are served as `application/octet-stream`. Chrome renders them; other browsers were not tested. Adding the type is a one-line change to a file this feature may not edit.
- The photos carry whatever metadata Pexels left in them; it was not stripped.
- Page behaviour is tested by matching page source; the clicks were done once, by the browser run above. The phone-width layout is not verified.
- Tests were run on Node 25.6.1. `npm test` does not run on Node 20.
