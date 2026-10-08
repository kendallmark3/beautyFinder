---
description: Write the evidence pack for a feature into evidence/<feature-id>/.
argument-hint: [feature id, e.g. 002-shade-finder]
---

Create the evidence pack for feature $ARGUMENTS:

1. Run `npm test` and save the full output to `evidence/$ARGUMENTS/tests.txt`.
2. Write `evidence/$ARGUMENTS/acceptance.md`: a table of every acceptance criterion from
   `intent/features/$ARGUMENTS.md` → the test that proves it → PASS/FAIL → the source file that implements it.
3. Start the app (`npm start`), call each new endpoint once with a valid and an invalid request,
   and save the responses to `evidence/$ARGUMENTS/api-responses.md`. Stop the app afterwards.
4. If any AC has no passing test, say so plainly. Do not mark the feature done.
