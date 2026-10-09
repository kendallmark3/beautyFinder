# Feature 009: Navigation Home

**Status:** Done · Evidence: `evidence/009-navigation/` · **Team:** Platform

## Story
As a shopper anywhere on the site, I want one obvious way back to the front screen, so that
I never have to step back through pages to get home.

## Goal
Every page has the same header. The brand name at the left is a link home, the first
navigation item is "Home", the page you are on is marked, and the header stays at the top
of the window while you scroll.

## Scope
- **In (create):** `tests/nav.test.js`
- **In (change):** the `<header>` of `public/index.html`, `public/discover.html`, `public/shade-finder.html`, `public/cart.html`,
  `public/credits.html`; `public/styles.css` (header rules); `public/discover.css` (sticky offset only);
  `tests/cart.test.js` and `tests/discover.test.js` (header pattern only)
- **In (remove):** the script in `public/index.html` that revealed the Shade Finder link once that page existed
- **Out:** `src/`, page content below the header, a mobile menu, breadcrumbs, search.

## Feature rules
- The header markup is identical on every page except for which link is marked current.
- The link to `/` is labelled "Home" (it was "Catalog"; the catalog is on the front screen).
- No new dependencies. No changes outside Scope.

## Acceptance criteria
- **AC-1** On every page the brand name is a link to `/`.
- **AC-2** Every page's navigation lists Home, Discover, Shade Finder and Bag, in that order, with the same addresses.
- **AC-3** The link for the page you are on is marked `aria-current="page"`, and no other link is.
- **AC-4** The header stays at the top of the window while the page scrolls.
- **AC-5** The Shade Finder link is always shown on the front screen.

## Done when
`npm test` passes, every AC maps to a passing test, and `evidence/009-navigation/` is complete.
