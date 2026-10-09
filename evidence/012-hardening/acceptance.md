# Evidence: Feature 012 Hardening

Run: `npm test` (full output in `tests.txt`) · Result: **79 / 79 passing** (72 from Features 001 to 011, 7 from Feature 012)

| AC | Test | Result | Implemented in |
|----|------|--------|----------------|
| AC-1 | `AC-1: photographs are served as image/jpeg` | PASS | `src/server.js` → `TYPES` |
| AC-2 | `AC-2: the server listens on 127.0.0.1 port 3000 by default; HOST and PORT override` | PASS | `src/server.js` → `listenAddress()` (SEC-5) |
| AC-3 | `AC-3: an old Node stops npm test and the edit hook with a message naming both versions` | PASS | `scripts/check-node.mjs`, `package.json` → `pretest`, `hooks/run-tests.mjs`, `.nvmrc` |
| AC-4 | `AC-4: CI runs on push and pull request and can be started by hand` | PASS | `.github/workflows/ci.yml` |
| AC-5 | `AC-5: at phone width the header stacks the brand above the links and splits no label` | PASS | `public/styles.css` (narrow-screen block) |
| AC-6 | `AC-6: at phone width a bag line is two rows` | PASS | `public/styles.css` (narrow-screen block) |
| AC-7 | `AC-7: at phone width the Discover studio and look fit the screen` | PASS | `public/discover.css` (narrow-screen block) |

Scope check: every file touched is listed under Scope. In `src/server.js` only the file-type table and the listen address changed. No new dependencies.

This feature adds no API endpoint, so there is no `api-responses.md`.

## Checked for real

- **Listen address.** Started with `PORT=3002 node src/server.js`: the process was listening on `127.0.0.1:3002`, and `/photos/group.jpg` came back `200 image/jpeg`.
- **Old Node.** With Node 20.20.2 first on `PATH`, both `npm test` and `node hooks/run-tests.mjs` printed "Tests need Node 22 or newer; this shell runs Node 20.20.2. …" and stopped (hook exit code 2).
- **Phone width.** Headless Chrome emulating a 390 × 844 phone, every page and the Discover studio and look screens: before the fixes the Discover studio overflowed sideways by 25 px, the bag by 90 px, and the header split "Shade Finder" across two lines. After them, no page overflowed and nothing extended past the screen edge. Front screen and bag were looked at.

## Limits of this evidence

- **CI is not shown to work.** Before this feature the workflow was valid and active on GitHub yet had never produced a run, with no error recorded. This feature adds a manual trigger so a run can be started by hand; whether pushes now trigger it, and why they did not, is recorded in the pull request, not here.
- The phone check used one size (390 px) in an emulator, not a real phone. Tablet widths were not checked.
- The narrow-screen tests read the stylesheet; they do not measure the page.
- Tests in other files still open their test server on all interfaces, on a random port, for the length of the run.
- The Node check does not install or switch Node. A machine whose default is Node 20 still needs that changed by its owner.
- The photographs' licence position is unchanged: Pexels stock, suitable for a demo only.
