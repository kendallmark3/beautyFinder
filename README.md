# Beauty Advisor: IDE Series Day 04 Class Repo

**Intermediate Intent Skills for feature teams.** Built on the
[intent-drive-starter](https://github.com/kendallmark3/intent-drive-starter) base.

![The Beauty Advisor home page: a centred headline above four portraits, with 260 Golden Tan picked from the shade swatches](docs/images/home.jpg)

**Learn the method:** [Progressive Intent: The Practical Specification for Intent-Driven Engineering](https://www.learnteachmaster.org/post/progressive-intent-the-practical-specification-for-intent-driven-engineering)
on [learnteachmaster.org](https://www.learnteachmaster.org). For a shorter start, read
[Intent-Driven Engineering, Simplified](https://www.learnteachmaster.org/post/intent-driven-engineering-simplified).

**Where this repo is now:** the screenshot shows the app after fourteen intents, each built from a file in
[`intent/features/`](intent/features/) and proven in [`evidence/`](evidence/). The list and status of every
feature is in [`intent/project-intent.md`](intent/project-intent.md). The rest of this README is the original
Day 04 lab guide, which starts from Feature 001 and builds Feature 002.

You're a feature-team developer on **Beauty Advisor**, a shopper-facing beauty app.
Feature 001 (Product Catalog) is already shipped, with proof. Your story for today is
**Feature 002: Shade Finder**: recommend a shopper's three closest foundation shades.
You'll run it through the intermediate loop: **context → feature.md → build → verify → evidence**.

> Products and shades are fictional class data. Learn the methodology at
> [learnteachmaster.org](https://learnteachmaster.org) · [intent-driven-engineering.com](https://intent-driven-engineering.com)

---

## Quick start

Needs **Node.js 22+** and nothing else. No `npm install`, no dependencies.

```bash
npm start      # http://localhost:3000  (catalog page)
npm test       # 4 passing tests (Feature 001)
```

Open the repo in Claude Code from the repo root: `claude`

---

## The repo, layer by layer

```
beauty-advisor/
├── .claude/
│   ├── CLAUDE.md                 TEAM layer: stack, rules, definition of done (platform team owns)
│   ├── settings.json             Hook: runs tests after every edit
│   ├── commands/
│   │   ├── run-intent.md         /run-intent: plan → approve → build → verify → prove
│   │   └── evidence.md           /evidence <id>: writes the evidence pack
│   └── skills/shade-science/     Domain skill: depth, undertones, customer copy
├── docs/
│   └── personal-CLAUDE.md.example  YOUR layer: copy to ~/.claude/CLAUDE.md
├── intent/
│   ├── project-intent.md         Why the app exists + feature list
│   ├── current-feature.md        Pointer to the active feature
│   └── features/
│       ├── 001-product-catalog.md  Done
│       └── 002-shade-finder.md     ← TODAY'S LAB
├── context/                      Business rules (BR-SM-*), security (SEC-*), architecture, glossary
├── hooks/run-tests.mjs           The hook script (exit 2 = Claude must fix)
├── src/
│   ├── server.js                 Auto-loads src/routes/*.js. Features never edit it.
│   ├── routes/products.js        Feature 001
│   └── lib/catalog.js            Feature 001
├── public/                       index.html (catalog), styles.css, shade-color.js
├── tests/catalog.test.js         Test names start with the AC id
├── evidence/001-product-catalog/ What "done" looks like
├── reference/feature-002-shade-finder/  Instructor solution + example evidence
└── templates/feature-template.md Start every new feature here
```

---

## Follow along with the deck

| Slide | Topic | Open this |
|-------|-------|-----------|
| 04 | One Run → A System | This README tree: everything the system needs is a file |
| 05 | Today's Skills | `docs/personal-CLAUDE.md.example`, `intent/features/002-shade-finder.md`, `evidence/` |
| 06 | Three Layers of Context | `.claude/CLAUDE.md` (team) · `~/.claude/CLAUDE.md` (you) · `intent/features/002-shade-finder.md` (feature) |
| 07 | Start With Your CLAUDE.md | `docs/personal-CLAUDE.md.example`: copy it, edit it live |
| 08 | Anatomy of feature.md | `intent/features/002-shade-finder.md`: Goal, Scope, Rules, AC-1 to AC-6 |
| 09 | What feature.md Unlocks | Scope (In / Read only / Out) and how ACs become test names |
| 10 | One Feature, End to End | Run `/run-intent` live |
| 11 | Prompts Repeat. Loops Scale. | `.claude/commands/`, `.claude/skills/shade-science/`, `.claude/settings.json` |
| 12 | Done Means Proven | `evidence/001-product-catalog/acceptance.md` |
| 13 | Write Yours | Lab wrap-up |

---

## The lab: Feature 002 Shade Finder

**1. Set up your personal layer** (5 min)
```bash
mkdir -p ~/.claude
cp docs/personal-CLAUDE.md.example ~/.claude/CLAUDE.md   # then make it yours
```
Already have one? Merge in the parts you like instead of overwriting.

**2. Read the feature** (10 min): `intent/features/002-shade-finder.md`.
Find the Scope, the business rules it points to (`context/business-rules.md`), and the six ACs.

**3. Run it** (20 min)
```
/run-intent intent/features/002-shade-finder.md
```
Claude reads the intent, checks readiness, and **shows a plan, then stops.** Review it:
are all files inside Scope? Does every AC have a test? Then approve.
Watch the hook re-run tests after each edit.

**4. Prove it** (10 min)
```
/evidence 002-shade-finder
```
Then `npm start` and open http://localhost:3000. The **Shade Finder** link appears in the nav.

**Exit criteria:** `npm test` shows 10 passing, `evidence/002-shade-finder/acceptance.md`
maps AC-1 to AC-6 to passing tests, and the Shade Finder page works.

**Stretch:** copy `templates/feature-template.md` to `intent/features/003-<name>.md` and write
your own feature for this app (e.g. a skincare routine builder), then run it.

---

## Instructor notes

- **Fallback if the live run stalls:** `npm run lab:reference` copies the reference build into
  `src/`, `public/`, `tests/`. Then `npm test` → 10 passing, `npm start` → working Shade Finder.
- Example finished evidence: `reference/feature-002-shade-finder/evidence-example/002-shade-finder/`.
- **Reset between sessions:** delete `src/lib/shadeMatch.js`, `src/routes/shade-match.js`,
  `public/shade-finder.html`, `tests/shade-match.test.js`, and `evidence/002-shade-finder/`.
- Good talking point for AC-5: skin depth and undertone are personal data. The rule lives in
  `context/security.md` (SEC-2), the feature points to it, and a test proves it.
- Hooks run `node hooks/run-tests.mjs`, so they work on Windows, macOS, and Linux.
