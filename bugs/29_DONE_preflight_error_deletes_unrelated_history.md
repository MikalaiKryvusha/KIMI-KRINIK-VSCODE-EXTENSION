# Bug 29 — A preflight error deletes the latest chat turn without proving ownership

**Status:** ✅ DONE — store regressions, full extension hygiene and the real packaged-VSIX preflight path all pass
**Version/build:** KIMI KRINIK 1.0.0 build 14 · current main · **When/context:** 2026-11-25 12:15 +03:00, deterministic code review after difficult live reproduction was parked · **Closed:** 2026-11-26 12:37 +03:00, real packaged-VSIX preflight verification
**Severity:** S2 — successful or newer user-visible history can be deleted
**Fixing:** this session
**Goal vector:** **Avoid + Maintain.** A late or unrelated preflight error must not remove another turn or change its streaming state; a genuine failure of the current optimistic send keeps its existing rollback behavior.
**Fix accepted when (observable):** store regressions preserve interrupted history with no active send and preserve a newer steering turn when a stale preflight error arrives, while a current optimistic send is still rolled back on its own preflight error.

## Symptom

`handlePreflightError` removes the latest assistant when it has no content and then removes the latest user message. It does this without checking that an active send exists or that the pair belongs to the failed request. A stale error can therefore delete a newer steering entry and mark its turn idle.

## Repro (deterministic)

`pnpm exec vitest run --reporter=agent apps/vscode/test/webview/chat-store.test.ts -t "preflight error"`

Before the product edit: 2 failed / 1 passed / 28 skipped.

1. A no-active-send case with an interrupted user/assistant pair loses both entries: expected `interrupted-user, interrupted-assistant`, received `[]`.
2. A stale preflight error after a newer steering send removes `second` and its assistant placeholder: expected `first, "", second, ""`, received `first, ""`.
3. The control case rolls back the current optimistic send and passes before the fix; it must remain green afterward.

## Forensics

`apps/vscode/webview-ui/src/stores/event-handlers.ts:277-298` changes streaming state and pops messages unconditionally. `ChatState.pendingInput` already identifies the active send, and optimistic user/assistant entries carry the same `clientId` (`chat.store.ts:173-181`), so ownership can be checked locally without changing the bridge or SDK contract.

## Root cause

The error cleanup used timeline position as request identity. Timeline position changes when a newer steering action arrives, while an older asynchronous preflight error can still be delivered.

## Fix plan

FORK: options <store ownership guard | propagate an error clientId through host/runtime> · price of error <deleting unrelated user-visible history or unnecessary cross-layer contract churn> · consulted <`PROJECT_ARCHITECTURE_INTERNAL_MAP.md` invariant 5; existing optimistic-clientId store tests>.

1. Keep the two red ownership regressions and the genuine-current-send control in `apps/vscode/test/webview/chat-store.test.ts`.
2. Before any cleanup, require active streaming, a pending send and a latest pair owned by that pending send. Use `clientId` when present and content compatibility for legacy pending input.
3. Leave the bridge, runtime, event types and genuine rollback path unchanged.
4. Run the focused file, affected extension tests, typecheck and root lint. Search for other position-only destructive cleanup in the same store and record the twin sweep.

## Fix evidence — 2026-11-25 12:17 +03:00

The preflight handler now returns before any state mutation unless streaming is active, a pending send exists and the latest user/assistant pair belongs to that send. `clientId` owns current turns; legacy pending input falls back to content matching. No bridge, runtime or event contract changed.

Hygiene: the two new ownership cases failed before the edit and pass afterward. The genuine-current-send control stayed green. Focused file: 31/31. Full extension: 48 files, 601 passed / 1 skipped / 0 failed. Typecheck and root `pnpm lint` exit 0.

Functional run: `testcases/reports/2026-11-26_build_43_preflight_error_history.md`. On the packaged build 43 with the provider pointed at a dead port, a real preflight error was produced: all six prior user turns survived, the newer steering message «k43 preflight second» survived the first message's preflight error, and the inline error with Retry was shown (WebP 124).

REAL WORLD: accumulated — existing sessions and newer steering entries on the owner's profile; data and machine — the owner's Windows VS Code; path — preflight failure while another turn is visible. Verified at the real store's public event interface with deterministic states AND on the packaged VSIX with a real preflight error. The genuine-current-send rollback is covered by the store control case.

TWINS: searched `draft.messages.pop()`, `messages = []` and preflight handlers — found one other position-based pop pair in `retryLastMessage`; it is intentionally scoped to the last assistant carrying an inline error during an explicit retry, not preflight cleanup. Replay/new-conversation resets are intentional whole-session replacements, not per-error deletion.

TWINS-MECH: using timeline position instead of request identity for destructive cleanup can appear as `pop`, `splice`, `filter` or a whole-list reset. Those forms were searched across `apps/vscode/webview-ui/src/stores`; no second preflight deletion site exists.

REAL WORLD: accumulated — existing sessions and newer steering entries on the owner's profile; data and machine — the owner's Windows VS Code; path — preflight failure while another turn is visible. Verified at the real store's public event interface with deterministic states AND on the packaged VSIX with a real preflight error. The genuine-current-send rollback is covered by the store control case. Main-profile accumulated observation is a separate acceptance step, not a precondition for this bug's mechanism.

## Decisions made without the owner

Chose the existing store-owned `pendingInput`/`clientId` identity over adding an optional error field through host and runtime. This is the smallest contract-preserving change and directly follows the owner's priority for clear, high-value fixes.

## Links

- `bugs/11_steer_delivery_and_immediate_display.md`
- `PROJECT_ARCHITECTURE_INTERNAL_MAP.md` invariant 5
- `apps/vscode/test/webview/chat-store.test.ts`
