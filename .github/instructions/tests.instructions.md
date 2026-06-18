---
applyTo: "**/*.test.js"
---

# Test conventions for task-manager-api

- Use describe/it blocks (do not use the test() global). This keeps semantics consistent across the codebase.
- Each describe block should include a beforeEach to set up shared test state and reset any in-memory stores.
- Cover both success and error cases for each route and helper (happy path + validation / not-found / edge cases).
- Use meaningful test names that describe observable behavior (e.g., "should return 400 when title is missing").
- Prefer Supertest against the exported app and run tests `--runInBand` in CI when tests rely on shared in-process state.
