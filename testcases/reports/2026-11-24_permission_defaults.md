# Test run report — persisted permission defaults for new chats

**Created:** 2026-11-24 01:26 +03:00 · **Run by:** project agent ·
**Version/build:** KIMI KRINIK 1.0.0 · `kaif/no-auto-compaction` working tree

## 1. Work

Implement the owner's persistence requirement for Auto / Manual / YOLO while retaining the existing main-model and reasoning-effort defaults. Basis: `STATUS.md` persistence item and `D:/work/ai_sandbox/KAIF/plans/149_epic147_K1_ui_convergence.md` K1.1–K1.3. The canonical engine `defaultPermissionMode` applies to new sessions; legacy `kimi.yoloMode` remains the fallback; a restored session keeps its own approval metadata.

## 2. Contour

Windows, real extension host handlers and runtime, webview stores/components, real Node SDK with temporary isolated Kimi home and fake provider, plus mocked bridge boundaries for focused checks. The real-SDK case writes Auto through the actual mode handler, reloads the same home through a second harness, and creates a fresh real session with legacy YOLO enabled to prove canonical-default precedence.

REAL WORLD: accumulated — the owner's working tree and current extension configuration contracts; data and machine — the owner's Windows machine; path — real SDK config/session path and webview/component paths. The isolated home verifies real persistence and session creation; the owner's accumulated VS Code profile and live Extension Host restart were not exercised, so live acceptance remains open.

## 3. Runs

| # | Moment | Command | Exit / outcome |
|---|---|---|---|
| 1 | 2026-11-24 01:16 +03:00 | `pnpm exec vitest run --reporter=agent apps/vscode/test/modes-handler.test.ts apps/vscode/test/kimi-runtime.test.ts apps/vscode/test/bridge-handler.test.ts apps/vscode/test/webview/app-init.test.tsx apps/vscode/test/webview/chat-store.test.ts apps/vscode/test/webview/control-panel-settings.test.tsx` before implementation | 1 · 8 new expectations failed; 106 other tests passed |
| 2 | 2026-11-24 01:19 +03:00 | same six targeted files after implementation | 0 · 114 tests passed |
| 3 | 2026-11-24 01:19 +03:00 | `pnpm --filter kimi-code-kaif run typecheck` | 1 · one `previous` optional-type error in rollback; no product test failure |
| 4 | 2026-11-24 01:20 +03:00 | `pnpm --filter kimi-code-kaif run typecheck` after adding the undefined guard | 0 · extension and webview checks passed |
| 5 | 2026-11-24 01:21 +03:00 | `pnpm exec vitest run --reporter=agent apps/vscode/test/bridge-handler.test.ts` | 0 · 34 passed, including real `streamChat` bridge-to-runtime wiring |
| 6 | 2026-11-24 01:23 +03:00 | `pnpm exec vitest run --reporter=agent apps/vscode/test/kimi-harness.integration.test.ts` | 0 · 52 passed, including real SDK persistence and fresh-session Auto |
| 7 | 2026-11-24 01:24 +03:00 | `pnpm exec vitest run --reporter=agent apps/vscode/test` | 0 · 41 files, 514 passed, 1 skipped, 0 failed |
| 8 | 2026-11-24 01:24 +03:00 | `pnpm --filter kimi-code-kaif run typecheck` and `pnpm lint` | 0 · both passed |
| 9 | 2026-11-24 01:26 +03:00 | `pnpm --filter kimi-code-kaif run build` | 0 · extension and webview production builds passed |

## 4. Checks

Hygiene: red-to-green targeted coverage; full extension suite 514 passed / 1 skipped; typecheck, root lint and both builds green. Rollback test proves a failed default write restores the previous live mode. Bridge test proves `streamChat` forwards the engine default into `runtime.openSession`.
Functional run: real SDK `kimi-harness.integration.test.ts`; READ the second harness's reloaded `defaultPermissionMode: "auto"`, the fresh session's `permission: "auto"`, and its `{ yolo: false, afk: true }` approval metadata.

| Case | Status | Observation |
|---|---|---|
| Mode selection persists the default | pass | Handler calls `setConfig({ defaultPermissionMode })` with and without a live session |
| Failed default write rolls back live mode | pass | Auto mutation is followed by Manual restoration and no status announcement |
| Restart loads model, effort and default mode | pass | App initialization observed Reasoning / high / Auto from engine config |
| New conversation keeps model and effort, clears old session mode | pass | Next send used Reasoning / high and omitted the previous session's permission override |
| Canonical default reaches session creation | pass | Bridge `streamChat` forwarded Auto; real runtime created Auto despite legacy YOLO true |
| Restored-session behavior | pass | Existing metadata and global-YOLO resume tests remained green; no new default overwrite was added to that path |
| Live VS Code restart and Extension Host acceptance | skipped | Remains part of K5 live acceptance |

TWINS: searched `setPermissionMode`, `toggleLegacyApproval`, `withGlobalYoloMode` and legacy default fallbacks — found `chat.handler.ts`, `session-runtime.ts` and `slash-command.ts` as intentional per-session paths; they do not write the global default. The shared new-session default path is `bridge-handler.ts` → `kimi-runtime.ts`; resumed metadata handling is unchanged.

## 5. Found

- none — the single typecheck error was an implementation-time optional-type narrowing mistake, corrected before the full green run

## 6. Traces

- `apps/vscode/src/handlers/modes.handler.ts`
- `apps/vscode/src/runtime/kimi-runtime.ts`
- `apps/vscode/src/bridge-handler.ts`
- `apps/vscode/test/kimi-harness.integration.test.ts`
- `apps/vscode/test/webview/app-init.test.tsx`
- `apps/vscode/test/webview/chat-store.test.ts`

## 7. Verdict

partial — persistence, real SDK creation, bridge wiring, rollback, restart-state and full hygiene passed; the actual VS Code restart and live Extension Host acceptance remain unobserved.
