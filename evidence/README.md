# Evidence

One folder per feature. A feature is not done until its folder proves every acceptance criterion.

```
evidence/<feature-id>/
  tests.txt          full npm test output
  acceptance.md      AC → test → PASS/FAIL → implementing file
  api-responses.md   real responses from the running app (valid + invalid)
```

Generated with the `/evidence <feature-id>` command. Checked into git, reviewed in the PR.
