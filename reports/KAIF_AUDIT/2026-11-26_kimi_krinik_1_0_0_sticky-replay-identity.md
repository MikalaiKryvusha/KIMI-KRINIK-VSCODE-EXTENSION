# Audit 001 · Family: replayed sticky prompt identity

**Mechanism:** durable turn identity is reused for multiple user actions, collapsing distinct replayed prompts into one UI identity.
**Already guarded by:** clientId/durable-turn precedence for distinct turns; no same-turn prompt fixture.
**Occurrences:** F1.

## F1 — Two replayed prompts share one sticky key

**Quote:** `apps/vscode/webview-ui/src/components/StickyUserPrompt.tsx:18` — ``if (message.turnIndex !== undefined) return `turn:${message.turnIndex}`;``.

**Failure scenario:** an ordinary prompt and immediate steers persist under one engine turn ID. Replay emits TurnBegin for each with the same `turnIndex`; `getPromptKey` returns the same key and ChatArea's `findIndex` selects the first prompt instead of the latest fully scrolled-out prompt. Expansion ownership also fails to reset.

**Severity:** Track — wrong prompt and expansion state after replay without durable data modification; high likelihood for reloaded turns containing steers.

**Baseline:** new.

kaif-fp: apps/vscode/webview-ui/src/components/StickyUserPrompt.tsx :: same-turn-replay-key-collision :: v2.10

**Dedup attestation:** searches for duplicate turnIndex/sticky replay identity found no existing ticket. `chat-area.test.tsx` tests key precedence but never two prompts sharing one durable turn.

**Fix sketch:** prefer a durable prompt/user-message ID when present, otherwise add a stable occurrence identity to the turn key. Test selection and expansion through actual replay, not precedence alone.

**Fix accepted when:** `distinguishes replayed steering prompts within one durable turn` produces distinct keys, selects the correct latest fully scrolled-out prompt and resets expansion on ownership change. Run `pnpm exec vitest run --reporter=agent apps/vscode/test/webview/chat-area.test.tsx -t "distinguishes replayed steering prompts within one durable turn"`. Today's real replay produced `["turn:7","turn:7"]` and sticky text `prompt 1`.

**Do not touch:** the 80px boundary, hysteresis, visible-prompt exclusion, one-line behavior and the build-45 animation timing.

**Meta:** links plans/03 AC6/AC8, bugs 16/37/41, EXP-0018/0022. Skeptic confirmed both the keys and actual ChatArea selection in a controlled renderer probe; packaged-VSIX replay remains unobserved.
