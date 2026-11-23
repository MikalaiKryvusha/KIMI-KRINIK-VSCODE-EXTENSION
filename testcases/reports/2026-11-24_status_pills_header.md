# Test run report — live status pills and session header

**Created:** 2026-11-24 02:10 +03:00 · **Run by:** project agent ·
**Version/build:** KIMI KRINIK 1.0.0 · `kaif/no-auto-compaction` working tree

## 1. Work

Complete K1.4–K1.5 without static indicators: queued messages and file changes keep their existing stores/panels; Background Bash and Sub Agents come from `session.listBackgroundTasks()`; Todos come from the last `SetTodoList` display; the context pill appears after compaction. Add the live session title and KIMI KRINIK robot to the header. Basis: `D:/work/ai_sandbox/KAIF/plans/149_epic147_K1_ui_convergence.md` and the reference `StatusPills`/`Header` at pinned `4298cb7f`.

The target SDK has no reference-only `includeAttached` option, so the new RPC calls `listBackgroundTasks()` without options. Polling uses native timers with cancellation on session change and a visible error state. `BottomToolbar` is fully replaced by `StatusPills`, with approval/question, queue and file-change behavior preserved.

## 2. Contour

Windows, real host handlers and `SessionRuntime`, real React components and Zustand stores, Vitest node/jsdom, mocked bridge boundaries for task and file events, and the actual robot resource `apps/vscode/resources/krinik-robot-logo.png` inspected before wiring.

REAL WORLD: accumulated — the owner's working tree, reference snapshot and robot asset; data and machine — the owner's Windows machine; path — host RPC/event tests and webview interaction through Testing Library. Real data flow verified; the owner's accumulated VS Code profile and live Second Side Bar were not exercised.

## 3. Runs

| # | Moment | Command | Exit / outcome |
|---|---|---|---|
| 1 | 2026-11-24 01:59 +03:00 | `pnpm exec vitest run --reporter=agent apps/vscode/test/bridge-handler.test.ts apps/vscode/test/session-runtime.test.ts` before host implementation | 1 · background-task RPC and session-title expectations failed; other 71 tests passed |
| 2 | 2026-11-24 02:00 +03:00 | same two host suites after implementation | 0 · 73 passed |
| 3 | 2026-11-24 02:06 +03:00 | `pnpm exec vitest run --reporter=agent apps/vscode/test/webview/status-pills.test.tsx apps/vscode/test/webview/header.test.tsx apps/vscode/test/webview/chat-store.test.ts apps/vscode/test/webview/input-area-file-picker.test.tsx apps/vscode/test/webview/i18n.test.ts` | 0 · 38 passed |
| 4 | 2026-11-24 02:07 +03:00 | `pnpm exec vitest run --reporter=agent apps/vscode/test` | 0 · 44 files, 527 passed, 1 skipped, 0 failed |
| 5 | 2026-11-24 02:07 +03:00 | `pnpm lint` | 1 · one new `unicorn/no-array-sort` finding in `StatusPills.tsx`; baseline unchanged |
| 6 | 2026-11-24 02:09 +03:00 | `pnpm lint` after replacing `sort()` with `toSorted()` | 0 · all checks passed |
| 7 | 2026-11-24 02:07 +03:00 | `pnpm --filter kimi-code-kaif run typecheck` and `pnpm --filter kimi-code-kaif run build` | 0 · typecheck and both production builds passed |

## 4. Checks

Hygiene: host red-to-green coverage; new StatusPills and Header suites green; full extension suite 527 passed / 1 skipped; typecheck, lint and both builds green. Existing InputArea composition and i18n parity checks remained green.
Functional run: NONE — host and jsdom checks are hygiene evidence, not a live Extension Host walk or visual acceptance.

| Case | Status | Observation |
|---|---|---|
| Background-task RPC | pass | Handler called `listBackgroundTasks()` and returned task id/kind/description/status/timestamps |
| Queued and Changed | pass | Queue store produced `1 Queued`; file event produced `1 Changed` and `+3 / −1` |
| Background Bash and Sub Agents | pass | RPC rows opened `pnpm build` / Bash and `Explore code` / Agent panels |
| Last Todo display | pass | `SetTodoList` produced `Todos 1/2` with both item titles and the done count |
| Compaction viewer | pass | Compaction state exposed Context; clicking loaded `Current Context` through the real dialog path |
| Polling failure | pass | Rejected read displayed `Background tasks unavailable: boom` via `role=alert` |
| Session title | pass | `session.meta.updated` refreshed summary and broadcast `session_title`; store/header displayed `· Fix login` |
| Brand robot | pass | Header image used `/resources/krinik-robot-logo.png` with KIMI KRINIK accessible name |
| Reset | pass | New conversation cleared the old permission override and old title while keeping model/effort |
| Live Second Side Bar | skipped | Actual panel transitions, layout and VS Code acceptance remain K5 |

TWINS: searched `BottomToolbar`, `includeAttached` and the old `kimi-logo.png` product reference — no remaining live usage; only an unrelated VSIX fixture creates that old filename. `BottomToolbar` was deleted and its barrel export now exposes `StatusPills`.

## 5. Found

- none — one new immutable-sort lint finding was corrected before delivery; no product defect was filed

## 6. Traces

- `apps/vscode/webview-ui/src/components/StatusPills.tsx`
- `apps/vscode/src/handlers/chat.handler.ts`
- `apps/vscode/src/runtime/session-runtime.ts`
- `apps/vscode/webview-ui/src/components/Header.tsx`
- `apps/vscode/webview-ui/src/components/KimiLogo.tsx`
- `apps/vscode/test/webview/status-pills.test.tsx`
- `apps/vscode/test/webview/header.test.tsx`
- `apps/vscode/test/bridge-handler.test.ts`
- `apps/vscode/test/session-runtime.test.ts`

## 7. Verdict

partial — real data sources, host contracts, component behavior, reset semantics and full hygiene passed; live Second Side Bar and Extension Host acceptance remain unobserved.
