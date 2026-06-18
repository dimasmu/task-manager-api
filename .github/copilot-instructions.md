# Repository rules and Copilot guidance for task-manager-api

This file defines repository-specific rules Copilot sessions should follow when editing or adding code.

## Quick commands
- Start (production): npm run start
- Start (dev with autoreload): npm run dev
- Run tests (full suite): npm test
- Run tests directly with Jest: npx jest
- Run a single test file: npx jest tests/tasks.test.js
- Run a specific test by name: npx jest -t "<test name regex>"
- Lint: npm run lint
- Change port: set PORT environment variable (PowerShell example): $env:PORT=3001; npm run dev

## Project rules (apply to all contributions)
- Language: JavaScript (ES2022+, ESM). Do NOT add TypeScript files.
- Framework: Express.js. Use Zod for all request validation.
- Testing: Use Jest with describe/it blocks. Aim for >80% coverage; prefer unit tests + integration tests using Supertest against the exported app.
- Error handling: Always use the AppError pattern from src/middleware/errorHandler.js for application-level errors. Throw new AppError(message, statusCode) instead of manually setting responses in business logic.
- Style:
  - Prefer const over let; avoid var.
  - Use arrow functions for callbacks and exported functions where appropriate.
  - Use async/await for asynchronous logic — do not introduce callbacks or mix with then/catch.
- Naming:
  - camelCase for variables and functions (e.g., myHandler, createTask).
  - PascalCase for classes and error constructors (e.g., AppError).
- Validation: All route handlers MUST validate input using the Zod schemas before any processing or side effects. Validation should occur at the top of the handler and return/throw on failure.
- JSDoc: Add JSDoc comments to all exported functions (modules' exported helpers and route handlers). Include param types and return description. Example:
  /**
   * Create a task
   * @param {Request} req
   * @param {Response} res
   * @returns {void}
   */
- Exports: Prefer named exports when exporting helpers; the Express app is exported as default from src/index.js for tests.

## Enforcement notes for Copilot
- When suggesting code edits, prefer small, surgical changes that follow these rules.
- If adding routes, also add or update Zod schemas in src/schemas and corresponding tests in tests/.
- When modifying src/index.js, preserve the start guard (start server only when file executed directly) so tests can import app safely.
- For changes that affect routes, update tests to match (tests currently use Jest + Supertest). If existing tests reference a different base path, align route mounts or tests (do not leave mismatches).

## File-level expectations
- src/routes/*.js: Express Routers, validate input, throw AppError for 4xx cases, export Router as default.
- src/schemas/*.js: Zod schemas for request payloads. Keep create vs update schemas separate when semantics differ.
- src/middleware/errorHandler.js: Centralize error mapping (ZodError -> 400, AppError -> provided status, otherwise 500). Reuse AppError class.
- tests/*.test.js: Use Supertest to hit exported app. Prefer --runInBand in CI if tests mutate shared in-memory state.

## Small examples
- Throwing a 404:
  throw new AppError('Task not found', 404);

- Validating request body:
  const data = createTaskSchema.parse(req.body);

- JSDoc for exported helper:
  /**
   * @param {string} id
   * @returns {Task | undefined}
   */
  export const findTask = (id) => { ... };

## Notes
- Repo uses ESM (package.json: "type": "module"). Keep imports/exports compatible.
- Data storage is in-memory Map for tasks. Tests rely on in-process state; prefer isolated tests or run in band.

---

If you'd like, merge these rules into the existing copilot-instructions.md (done), or expand with example eslint rules and Jest coverage commands. Let me know which additions to make.