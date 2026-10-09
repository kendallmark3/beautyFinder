# Feature 011: One Background

**Status:** Done · Evidence: `evidence/011-one-background/` · **Team:** Platform

## Story
As a shopper moving between pages, I want every page to have the same warm background, so
that the Shade Finder and the bag feel like part of the same site as Home and Discover.

## Goal
Every page uses the deeper blush background that Discover had. It is defined once, in the
shared stylesheet, and no page or section overrides it. Page headings share one typeface.

## Scope
- **In (create):** `tests/theme.test.js`
- **In (change):** `public/styles.css` (`body`, `h2`, `.hero`, footer rule colour), `public/discover.css` (remove its own background and heading face)
- **Out:** `src/`, every HTML file, panel and card colours, the header, the dark band.

## Feature rules
- The background is set on `body` only. A page that needs a different one would be a new feature.
- The gradient is centred, so it does not lean left or right (Feature 010).
- No new dependencies. No changes outside Scope.

## Changes to earlier features
- **003:** the page background is deeper than the one 003 introduced, and the hero no longer has its own.
- **007:** Discover no longer sets its own background or heading typeface; it inherits both.

## Acceptance criteria
- **AC-1** The page background is defined once, on `body`, and is the deeper blush.
- **AC-2** No page or section sets a page background of its own: not Discover, not the hero, not any HTML file.
- **AC-3** Every page loads the shared stylesheet, so every page gets that background.
- **AC-4** Page headings use one typeface on every page.

## Done when
`npm test` passes, every AC maps to a passing test, and `evidence/011-one-background/` is complete.
