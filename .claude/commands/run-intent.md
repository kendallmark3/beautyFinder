---
description: Run a feature intent end to end: plan, approve, build in scope, test, prove.
argument-hint: [path to feature file, defaults to intent/current-feature.md]
---

Run this feature intent: $ARGUMENTS
(If no path was given, read `intent/current-feature.md` and use the feature file it points to.)

1. **Read** the feature file, `intent/project-intent.md`, and every `context/` file the feature lists.
2. **Check readiness.** If Goal, Scope, or numbered Acceptance Criteria are missing or vague, stop and list what's missing.
3. **Plan.** Show: files you will create or change (must be inside Scope), and which test proves each AC. Then STOP and wait for my approval.
4. **Build** after approval. Tests first for each AC, then code. Stay inside Scope.
5. **Verify.** `npm test` must pass (the PostToolUse hook also runs it after every edit).
6. **Prove.** Run `/evidence` for this feature.
7. **Report** a table: AC id → test name → pass/fail.
