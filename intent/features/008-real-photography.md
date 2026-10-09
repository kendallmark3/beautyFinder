# Feature 008: Real Photography

**Status:** Done · Evidence: `evidence/008-real-photography/` · **Team:** Complexion squad

## Story
As a shopper, I want the site to show real women rather than cartoon characters, so that it
feels like a beauty brand I would buy from.

## Goal
The illustrated models are replaced with photographs of women across skin depths: in the
front-screen hero, in a new photo band, and throughout Discover. Shade choices stay. A picked
shade is shown on a card beside the photo of the model whose skin depth is closest, and a
Discover look is shown as a palette of colour chips beside the chosen model's photo.

## Scope
- **In (create):** `public/photos/` (five JPEG files), `public/models.js`, `public/credits.html`, `tests/photos.test.js`
- **In (change):** `public/index.html`, `public/styles.css`, `public/discover.html`, `public/discover.js`, `public/discover.css`,
  and the tests of earlier features whose criteria this feature changes: `tests/home.test.js` (003 AC-2, AC-5, AC-6),
  `tests/try-on.test.js` (004 AC-5, AC-6), `tests/discover.test.js` (007 AC-2, AC-3, AC-7)
- **In (remove):** `public/hero.svg`
- **In (read only):** `public/try-on.js`, `public/shade-color.js`, `public/cart.js`
- **Out:** `src/` (server, routes, lib, data), `public/shade-finder.html`, `public/cart.html`, recolouring or
  filtering any photograph, AR or camera try-on, photographs of products, hotlinked images, web fonts.

## Context to read
- `intent/project-intent.md`: constraints (zero dependencies, inclusive by design)
- `context/security.md`: SEC-2
- Skill: `.claude/skills/shade-science/` (customer copy)
- `public/credits.html`: the licence and what it does not allow

## Feature rules
- Photographs are stock photographs under the Pexels licence, stored in the repo, and listed with photographer
  and source on the credits page. Nothing is loaded from another site.
- **No photograph is altered to show a shade.** No tint, blend, filter, or overlay on anyone's skin. A shade is
  shown as a colour chip beside the photo, and the page says a photo cannot show a shade exactly.
- The people pictured are not named and are not presented as customers or as endorsing anything. Pages that show
  them say so and link to the credits.
- The models' places on the depth scale (`depth` in `public/models.js`) are judged by eye from each photo.
- The set must span lighter to deeper skin. Adding or replacing a photo means updating `public/models.js`,
  `public/credits.html`, and the file list in `tests/photos.test.js` together.
- No new dependencies. No changes outside Scope.

## Changes to earlier features
- **003 Beauty Home:** the rule "No stock photos" is replaced by this feature's rules, and AC-2 now requires a
  photograph with alternative text rather than `/hero.svg`.
- **004 Shade Try-On:** the model is no longer repainted. A picked shade is shown on a card beside the model with the
  closest skin depth (AC-2 here). The auto-cycle, the reduced-motion rule, and the privacy rule are unchanged.
  004's AC-5 now requires one model photograph to show when no script runs.
- **007 Beauty Discovery:** the four drawn, named characters are replaced by four unnamed photo models, and the look
  is a palette rather than a repainted drawing (007 AC-3). Look names no longer include a person's name.

## Acceptance criteria
- **AC-1** The hero and the band show photographs of women, each with alternative text.
- **AC-2** Every foundation shade is shown beside the model with the closest skin depth; lighter-to-deeper shades never step back to a lighter model; all four models are used.
- **AC-3** A picked shade is shown on a card with its colour, and the page says a photo cannot show a shade exactly.
- **AC-4** No photograph is recoloured or filtered.
- **AC-5** Every photograph is a JPEG file under 200 KB kept in the app, and no page loads anything from another site.
- **AC-6** The credits page lists every photograph with its photographer and source and says the models endorse nothing; pages showing photographs say so and link to it.
- **AC-7** The people pictured are never given a name.
- **AC-8** The illustrated models are gone.

## Done when
`npm test` passes, every AC maps to a passing test, and `evidence/008-real-photography/` is complete.
