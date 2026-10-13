# Feature 017: Screen Size and Type

**Status:** Done · Evidence: `evidence/017-screen-size-and-type/` · **Team:** Platform

## Story
As a shopper on any page, I want every screen to fill the window the way the front screen
does, and I want to read the words without leaning in, so that the whole site feels as
generous as its first impression.

## Outcome
A better look. Every screen uses the window well, and the text is bigger everywhere.

## Inputs
What is already here: the pages, photographs, styles and rules in this repository. Nothing new
is brought in.

## What was measured before
On a 1728 px wide window the front screen's photographs use 100% of the width; the catalog,
Discover studio, Shade Finder, bag and picks use 63%, and Discover's welcome 49%. Across the
pages, 50 to 68% of text elements are smaller than 14 px, and the smallest is 10 px.

## Scope
- **In (create):** `tests/scale.test.js`
- **In (change):** the five stylesheets in `public/` (`styles.css`, `discover.css`, `shade-finder.css`, `cart.css`, `recommendations.css`);
  `tests/layout.test.js` and `tests/bag-experience.test.js` (the patterns that pin the old page width and summary width only)
- **Out:** `src/`, every HTML file, copy, photographs, colours, the order of anything on a page, a mobile menu.

## Feature rules
- One type scale. Every font size is relative to one root size, which grows with the window between a phone and a large desktop. No stylesheet sets a font size in pixels.
- Nothing is smaller than four fifths of the root size.
- One page width, still defined once (`--page`), now a share of the window up to a cap, so wide windows are used and narrow ones are unchanged.
- Bigger must not mean broken: no page scrolls sideways at phone, laptop or wide-desktop width, and the phone layout keeps today's text size.
- No new dependencies. No changes outside Scope.

## Acceptance criteria
- **AC-1** Every font size in every stylesheet is relative to one root size; none is in pixels.
- **AC-2** The root size is defined once and grows with the window, from 16 px on a phone to 20 px at most.
- **AC-3** No font size is below 0.8 of the root size, and buttons take their size from the scale, not the browser's default.
- **AC-4** The page width is a share of the window up to a cap, defined once, and used by the header and every section.
- **AC-5** The picks, the bag and the Discover screens are sized to fill that width rather than sit small inside it.
- **AC-6** Narrow-screen rules are kept, so phones are laid out as before.

## Success, measured in the running app
- On a 1728 px window, every inner screen uses at least 75% of the width (was 63%, or 49%).
- On a 1280 px and a 1728 px window, no text is under 13 px, and under a fifth of text elements are under 14 px (was half to two thirds).
- No sideways scrolling at 390, 1280 or 1728 px.

## Done when
`npm test` passes, every AC maps to a passing test, the measurements above are met, and
`evidence/017-screen-size-and-type/` is complete.
