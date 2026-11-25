# Repository-level Agent Guide

Reply in the same language as the user.

This is a TypeScript monorepo for collaborative agent development. Root `AGENTS.md` holds only hot-path rules: project map, hard constraints and workflow requirements every task needs.

A message that opens with the word `resume` (or the resume alias of your language) is an ORDER to run /resume in full before the rest of the message (`AGENT_GUIDE.md` → "A leading skill word is an order").

## Working principles

- Think from first principles: start from real requirements, code facts and verification results; when the goal is unclear, discuss it with the user first.
- Confirm behavior in code. Do not read general Markdown for implementation details unless the user asks or an `AGENTS.md` points to a design document. When docs conflict with code, check requirements and published contracts first. Fix implementation that violates a contract; update genuinely stale docs with the change.
- Before changing code, read the relevant code and current constraints, and follow the nearest `AGENTS.md` in the directory tree.
- Keep changes focused; do not add unrelated refactoring.
- Do not add co-author trailers to commits, and do not disclose the agent's identity in commit messages, PR descriptions or any other explanatory text.

## Project map

- `apps/kimi-code`: CLI / TUI application; the main TUI path uses core capabilities through `@moonshot-ai/kimi-code-sdk`.
- `apps/desktop`: Electron desktop application sharing `apps/desktop/src/renderer` with the browser Web UI; Web artifacts are synchronized during the CLI build, see `apps/kimi-code/AGENTS.md`.
- `apps/vis`, `apps/vis/server`, `apps/vis/web`: visual debugging tools for sessions and replay.
- `apps/vscode`: VS Code extension.
- `docs`: user documentation site (VitePress), with Chinese and English pages in `docs/zh/` and `docs/en/`.
- `packages/agent-core-v2`: DI × Scope agent engine (the v2 port behind kap-server), including the remote execution stack in `src/remote`.
- `packages/core`: Loop, LLM and tool runtime without DI; the LLM module design guide is `packages/agent-core-v2/docs/en/llm.md`.
- `packages/node-sdk`: public TypeScript SDK and harness.
- `packages/oauth`: Kimi OAuth and managed authentication tools.
- `packages/telemetry`: shared client telemetry infrastructure.
- `packages/session-import`: standalone Node.js module that converts external sessions into a single user message without depending on engine or UI; callers provide the target session's attachment directory and context budget.
- `packages/kap-server`: Kimi Code server built on `@moonshot-ai/agent-core-v2`, exposing Kimi Agent Protocol (KAP) through REST (`/api/v1`) and WebSocket (`/api/v1/ws`); see `packages/kap-server/AGENTS.md` and `packages/kap-server/docs/kap.md`. Internal reflection RPC endpoints `/api/v1/debug/*` are enabled only with `--debug-endpoints` and a loopback binding, and require bearer authentication.
- `packages/remote-control`: Kimi Remote Control tunnel client that registers the local machine with a relay and forwards traffic to local services, with a machine-wide single-instance lock; used by kap-server (`/api/v1/remote-control` toggle) and CLI (`kimi web --remote-control`).
- `packages/klient`: client SDK with a contract-driven agent-core-v2 facade, selecting the transport by subpath (`@moonshot-ai/klient/ipc|memory`); e2e test suites also live here.
- `packages/tree-sitter-bash`: pure TypeScript bash parser that only parses and makes no security judgments; callers must treat an aborted or `hasError` syntax tree as "unanalyzable" and fall back gracefully. Differences from the original tree-sitter-bash are documented in the package README section "Known differences from tree-sitter-bash".
- `packages/minidb`: embedded JSON document store (`MiniDb`) behind kap-server's search index.
- `packages/app-core`: KAP client and session logic shared by desktop and Web.
- `packages/app-client`: renderer state, panels and Vue composables.
- `packages/app-components`: product UI components for chat, settings and more.
- `packages/app-composer`: message editor and its input/send logic.
- `packages/app-i18n`: renderer localization resources.
- `packages/app-markdown`: Markdown rendering.
- `packages/app-ui`: foundational UI components and styles.
- `packages/vite-preset`: shared Vite build configuration.
- `packages/acp-server`: Agent Client Protocol (ACP) host built directly on agent-core-v2.
- `packages/product`: Kimi Code product logic shared by clients and hosts.
- `packages/migration-legacy`: migrates kimi-cli data (`~/.kimi/`) to kimi-code (`~/.kimi-code/`).
- `packages/pi-tui`: terminal UI library forked from upstream `earendil-works/pi`'s `packages/tui`.
- `packages/testkit`: fake model and KAP fixtures.
- `tests/scenarios`: real KAP scenario tests.

## Verification before finishing

Before finishing any code change, run `pnpm lint`; choose type checks and tests from this table according to the affected scope.

| Check | Command | Notes |
|---|---|---|
| Lint and repository checks | `pnpm lint` | Must exit 0. Runs comment checks, oxlint, agent-core-v2 import boundaries, and guards/ratchets/instruction checks in `scripts/checks/`. For errors in untouched code, run `pnpm install` and retry: stale installed dependencies can make type-aware rules report nonexistent errors |
| Single-project type check | `pnpm exec tsc -p <directory>/tsconfig.json --noEmit` | CI checks CLI and each package separately; `packages/app-*` is checked with desktop via `pnpm --filter kimi-code-app run typecheck`. `pnpm typecheck` builds libraries first |
| Affected tests | `pnpm exec vitest run --reporter=agent <file or directory>` | Prints failures only. Do not run the full suite by default |
| minidb | `pnpm --filter @moonshot-ai/minidb test` | Not included in root tests or CI |
| pi-tui | `pnpm --filter @moonshot-ai/pi-tui test` | Uses `node --test` |

- Bug fixes must include regression tests that fail before the fix. Choose the smallest deterministic boundary that observes the contract. Use the module's public interface when possible. For cross-layer failures, verify through real entry points such as kap-server, klient conformance tests (`packages/klient/test/helpers/conformance.ts`) or the TUI virtual terminal (`packages/pi-tui/test/virtual-terminal.ts`). Cover other trigger paths for the same bug.
- Regular PR tests run on Linux. Also run Windows-specific tests for desktop and other specific paths. For changes involving paths, child processes, shells or terminal input, state in the PR which platforms were checked and how.
- Report only commands and results you actually ran. If a check cannot run, write "not verified" and the reason; never report existing failures as passing.

## Environment requirements

- **Node.js**: `>=24.15.0` (from root `package.json` `engines`; `.nvmrc` is `24.15.0`, and nvm / fnm / mise use it to select the recommended minimum version).
- **pnpm**: `10.33.0` (from root `package.json` `packageManager`).
- When the Node version does not satisfy the requirement, `pnpm install` fails because `.npmrc` sets `engine-strict=true`.

## Monorepo workspace maintenance

- `pnpm-workspace.yaml` is the sole authority for workspace members, but `flake.nix` also has **hardcoded** `workspacePaths` and `workspaceNames` lists.
- **Whenever adding or removing a workspace package, update both `pnpm-workspace.yaml` and `flake.nix`, including leaf, test and e2e packages that nothing depends on.**
  - `pnpm-workspace.yaml` uses wildcards (`packages/*`, `apps/*`), so most packages join automatically; `flake.nix` is entirely handwritten and omissions happen here.
  - If `workspacePaths` omits a path, the Nix build's `src` file set silently drops those files.
  - If `workspaceNames` omits a name, `pnpmConfigHook` fails because that workspace's dependencies are not fetched.
- `scripts/check-nix-workspace.mjs` validates only the transitive dependency closure of `@moonshot-ai/kimi-code`. Even when it passes, manually check packages outside that closure.

## General coding rules

- Do not write comments in JS/TS code. `pnpm lint` (`scripts/check-comments.mjs`) rejects them except tool directives (`@ts-*`, `oxlint-`/`eslint-` disables, `prettier-ignore`, etc.), shebang, `/// <reference>`, and single-tag JSDoc `@type` assertions in JS files. Express behavior through naming, types and structure; express constraints as types, tests or lint rules rather than comments.
- Paths listed in `.commentignore` (gitignore syntax) are exempt from this check. Unless the user asks, do not change existing comments in those files; add entries to `.commentignore` only when the user asks.
- Optional object properties do not need an additional `undefined` union in the type.
  - Yes: `interface Options { user?: User }`
  - No: `interface Options { user?: User | undefined }`
- Do not convert a single-argument internal method into an options object just for stylistic consistency.
- Split functions only by abstraction level: each function should read as a narrative at one level (Step-down Rule); wrapper functions that add no new abstraction level, especially with only one call site, should be inlined rather than extracted.
- Except for a package's own `index.ts`, prefer `export * from './module';` in other `index.ts` files.
- Unless the user explicitly requires it, do not sacrifice code quality for external compatibility. But behavior must not change silently: record every behavior change in the PR behavior-change table; breaking changes require a changeset and `major`; before writing `major`, stop and wait for user confirmation (see the changeset rules in "Workflow requirements").

## Tests

- Add tests to the modified module's existing test files; create a new file only when no suitable existing file exists.
- When a test fails, first confirm expectations from the issue, requirement spec or published contract, then locate the failure. Never copy current output as the expectation.
  - When requirements intentionally change behavior, update implementation, assertions and related documentation together, and record it in the PR behavior-change table.
  - If implementation violates a contract, fix the implementation. If a fixture, tool or runtime environment is wrong, fix the corresponding layer and verify again.
  - If an old assertion itself seems wrong, list the concern and contractual evidence in the PR. Do not change assertions just to make this change pass.
- Do not make tests pass by weakening assertions, deleting tests, using sleep or timeout synchronization, retrying until green, or rewriting snapshots unread. In lint-covered Vitest files, `.only` is an error; disabled-test violations (including `.skip`) are frozen per file. pi-tui and `.mjs` `node:test` cases are checked by review.
- The same applies to flaky tests: do not skip, add sleep or retry; find and fix the root cause. If no root cause can be found, the flaky test may be deleted — this is the only allowed reason to delete a failing test.
- When rewriting, porting or moving code removes tests, move their assertions to the new code path unless the behavior is intentionally removed.
- When deleting tests, state in the PR: the cases, original coverage, deletion reason, and which case continues to verify the contract. If it was the last coverage, explicitly list the lost protection and let maintainers decide whether to accept it.
- Before modifying or deleting tests or snapshots that guard contract files (see "Code review rules"), stop and ask the user.
- If the same failure is not fixed after three attempts, stop and report what was tried and what is suspected. After pushing, make at most two attempts to fix CI failures; if still failing, stop and hand it to a human.

## Before changing behavior

- Do not combine porting, rewriting or relocation with behavior changes in the same PR.
- For changes over 2,000 lines (excluding generated files, lockfiles and snapshots), stop and propose splitting. Mechanical changes are exempt, such as syncing a release branch back to main, bulk renames and bulk deletions. If splitting is genuinely impossible, explain why in the PR description.
- Before adding state, a list or a mapping table, find where that concern already belongs and reuse it instead of duplicating it.
- When adding an event, message type or enum member, update every place that branches on it; a `default` branch must not silently swallow it.
- Check your change against situations this repository has missed in past bugs:
  - sessions written by older versions are resumed or replayed;
  - the server or CLI restarts mid-session;
  - events arriving mid-turn: background task results, queued or interjected messages, approvals;
  - cancellation, undo or compaction while work is still running;
  - two clients connected to the same session;
  - Windows paths, CRLF line endings, UTF-8 BOM;
  - invalid or incomplete configuration: it must produce a clear error, not be silently ignored.
- Before opening a PR, review your diff against the "Code review rules" below and add everything they require.

## Experimental features

- Unreleased functionality goes behind experimental flags. Environment variables control flags, defaulting off: `KIMI_CODE_EXPERIMENTAL_<NAME>` controls one, `KIMI_CODE_EXPERIMENTAL_FLAG` enables all. Precedence: individual env var > `[experimental]` config > global env var > `default`. For public release, change that entry's `default` to `true`.
  - `packages/agent-core-v2` and kap-server modules: there is no centralized flag catalog. Declare the flag in its domain with `registerFlagDefinition` at import time, then check it with `IFlagService.enabled(id)`.

## Maintaining instruction files

- When a code change makes a fact in an `AGENTS.md` (path, command, map entry) untrue, update it in the same PR.
- Submit new or changed team processes and empirical rules as a separate PR. Contracts for new interfaces, architectural constraints that take effect with the implementation, and preventive measures with clear risk evidence are reviewed in the same PR that introduces them.
- Put rules needed by almost every task in root `AGENTS.md`; put local rules in the nearest subdirectory `AGENTS.md`.
- In the project map, write exactly one line per workspace package; put deeper package guidance in that package's own `AGENTS.md`.
- If a lint rule, test or script can catch a class of error, add a check instead of a rule; name the enforcing check beside the rule.
- Keep instruction-file changes focused and grounded in code facts.
- Before turning experience into a team rule, confirm the same mistake happened at least twice, the rule will change agent behavior, and it will still be useful six months later.
- `scripts/checks/instructions.mjs` in `pnpm lint` checks inline links and backtick-quoted repository paths in every `AGENTS.md` and root file size. For external paths or build outputs, add them to `unresolved` in `scripts/checks/instructions.json` with the reason. If the file exceeds the limit, first move directory-specific content into that directory's `AGENTS.md` and compress it; raise the limit in `scripts/checks/instructions.json` only when genuinely necessary, with the reason in the PR.

## Release process

- Accumulate changesets in `main`; `release/*` branches maintain the `ci: release packages` PR. Merging a version PR authorizes the official release, and corresponding versions are published after CI passes on the merge commit. Ordinary pushes do not publish a release.
- CLI is published to npm and GitHub, desktop installers to GitHub Release, and the VS Code extension to the extension marketplace. CDN upload and routing require separate approval. Migration and back-sync are described in `.changeset/README.md`.

## Workflow requirements

- Prefer `rg` / `rg --files` for reading code.
- Follow existing boundaries and local conventions when designing changes.
- Fix lint errors in code. Do not add disable directives, modify `.oxlintrc.json` or `.oxlintrc.ratchet.json`, rewrite snapshots, or raise baselines in `scripts/checks/baselines/` just to pass; if a rule does not fit, stop and report it. Required disables must name the rule and reason after ` -- `. `.oxlintrc.json` changes are detected by `scripts/checks/guards.mjs`; new violations by `scripts/checks/ratchet.mjs`; `.oxlintrc.ratchet.json` or baseline changes only by review.
- `.oxlintrc.ratchet.json` rules already have violations in existing code and are frozen per file in `scripts/checks/baselines/oxlint-ratchet.json`. New code must not add violations; after removing existing violations, run `node scripts/checks/ratchet.mjs --update` to lower the baseline.
- Do not run `pnpm lint:fix`: some oxlint autofixes change behavior (for example, `unicorn/no-unnecessary-await` removes an `await` and changes when subsequent code executes).
- In public text and test data, replace real internal identifiers with neutral placeholders (for example `example.com`, `example.test` and `YOUR_API_KEY`). Before opening a PR, ask a read-only agent to review the diff for environment-specific internal identifiers.
- When creating or updating a PR, fill in `.github/pull_request_template.md`; the PR title must use Conventional Commit format, for example `chore: remove legacy format commands` (checked by `.github/workflows/pr-title-checker.yml`).
- When an AI agent creates or updates a PR, fill in `.github/pull_request_template.md`: link the relevant issue or describe the problem, then describe what changed. Do not leave placeholder text or give only a generic diff summary.
- Do not submit vague AI-generated PR text. The human author must understand the change well enough to explain its code, edge cases and why it fits this repository.
- After completing a task and before submitting a PR, write a changeset under `.changeset/` according to this file's product boundaries.
- For user-visible changes in CLI, desktop or the VS Code extension, write one short English changeset per product. Library source changes get technical entries; pure docs, tests and ignored packages need no changeset.
- When generating a changeset, **never** decide a `major` bump on your own: stop, explain why, and get explicit user confirmation first; use `minor` by default, then `patch`.
- Prefer `import ... from '#/...'`, which is equivalent to `import ... from '@/...'`.
- Do not commit temporary drafts or exploratory files. Never stage:
  - agent work notes or handover/summary documents (for example `HANDOVER-*.md`, `HANDOFF-*.md`, `handoff.md`).
  - temporary UI/UX prototypes or design drafts (for example `*-designs.html`, `*-mockup.html`, `*-demo(s).html` in the repository root or `design/`). The only `.html` files that should be tracked are Vite `index.html` entry points.

  Before committing or opening a PR, run `git status` and `git diff --staged --stat`, and remove files matching these patterns from the staging area and commit. Put drafts in `.tmp/` (gitignored), not in the repository root or source tree.

## Code review rules

These rules apply to every PR review, automatic or human. Review the diff against the contract files below and all affected existing users.

### Review scope: the PR diff, not the whole repository

- Review only the PR's diff relative to base. Problems in untouched code (already present in base) may be raised only as non-blocking notes, never as blockers; the sole exception is existing code that the PR's behavior directly triggers or amplifies.
- Report each class of issue once, in full: if one issue appears in multiple places in the diff, list all locations at once rather than over several rounds.
- Do not raise purely stylistic or personal-preference issues. Label every issue by severity: P0 blocker / P1 should fix / P2 suggestion.
- Reviews are incremental: inspect only what changed since the last review; do not repeat issues in unchanged code or reopen resolved discussions. Before treating a resolved discussion as settled, verify current code: drop the issue only if it was actually fixed or no longer applies.
- Each domain has an official home for its rules: changesets (this file's "Workflow requirements"), comments ("General coding rules"), PR text (`.github/pull_request_template.md`). Review according to those homes, not ad hoc personal taste.

### List changed behaviors, not just bugs

Any input that worked before must behave the same after the change unless the PR declares otherwise. Inputs include config items, environment variables, CLI arguments, model-service structures, older sessions, client requests and hook payloads. For every deleted or narrowed branch, condition, default or prompt sentence, ask who reached it before and where they go now. For every added condition, ask which existing inputs match first. If a PR claims a path is "unchanged" but its branch condition moved, point it out.

### Flipping a default or removing behavior requires naming the loss and an escape hatch

Everyone using the old default is affected. Require all three: the changeset states what behavior users lose, not only the new default; an escape hatch is provided through configuration, environment variable or flag, or a maintainer explicitly signs off in the PR; and a test preserves the old behavior for those who still use it.

### Prompt text is behavior

Editing or deleting sentences in `packages/agent-core-v2/src/**/*.md` (system prompts, tool descriptions, reminders, overlays, built-in skills) changes agent behavior for every recipient. "No test references this sentence" proves no lack of impact. The PR must state which audiences receive it (every session, plan mode, Tower and other flag-gated features), what it constrained, who relied on it, and what constrains it now.

### Contract files are tripwires

These files define cross-component or external contracts: manifests under `packages/agent-core-v2/docs/` (`config-manifest.toml`, `wire-manifest.d.ts`, `state-manifest.d.ts`), `packages/kap-server/test/__snapshots__/apiSurface.snapshot.test.ts.snap`, `packages/kap-server/docs/kap.md`, `packages/node-sdk/src/index.ts`, `packages/agent-core-v2/src/features/externalHooks/`, `packages/acp-server/` and `apps/kimi-code/src/cli/`. Consumers include this repo's desktop and Web clients, external agents and bots using KAP for core sessions/conversations, the VS Code extension, ACP clients such as Zed, SDK users, hook scripts, and programs parsing headless output. When they change, the PR must name consumers and explain how older data and clients keep working.

### Ports and refactors must include the old path's feature inventory

When a change replaces or bypasses an existing path, list everything the old path did (supported environment variables, fallback logic, accepted inputs), and state where each item lives in the new path. An item dropped silently is a regression, not cleanup.

### Silent failure is worse than a crash

The most serious change is one that makes the product silently ignore configuration, silently approve or skip an action, or silently lose data: users receive no signal and therefore cannot report it.
