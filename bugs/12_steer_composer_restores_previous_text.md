# Bug 12 — A previous steering message reappears in the composer after a newer send

**Status:** 🔴 OPEN
**Version/build:** KIMI KRINIK 1.0.0 · `8ac5df733` · installed VSIX on the owner's accumulated VS Code profile · **When/context:** 2026-11-24 13:09 +03:00, owner live steering acceptance
**Severity:** S2
**Fixing:** next work session inside KIMI KRINIK; run and verify fixes in an isolated VS Code environment
**Fix accepted when (observable):** after a newer steering message is sent, a late completion or rejection of an older steer cannot restore old text into the composer; a genuine failure of the latest unsent message restores that exact text and its media exactly once.

## Symptom

After the owner sent «мы уже в KIMI KRINIK», the new bubble appeared in chat while the previous long farewell text reappeared in the input field. The owner reproduced and reported this repeatedly.

## Repro

1. Start a running turn and send a steering message whose acknowledgement can complete late.
2. Send a newer steering message before the older request settles.
3. Reject or otherwise settle the older request after the newer send and inspect the composer.

This ordering is a focused hypothesis derived from the asynchronous code; it still requires a failing regression before a fix.

## Expected result

Only the current failed send may be restored. An obsolete request must not overwrite or prepend older text after a newer user action.

## Actual result

The owner's screenshot shows the previous farewell in the composer while the newer message is already visible in chat.

## Forensics / hypotheses

- `apps/vscode/webview-ui/src/stores/chat.store.ts:303-310` calls `rollbackInput(content)` on every steering rejection without checking whether that request is still current.
- `apps/vscode/webview-ui/src/components/inputarea/InputArea.tsx:158-171` prepends `composerRestore` to the current editor text.
- Existing tests cover a single rejected steer, not out-of-order completion of multiple requests.

## Fix plan

Reproduce with two deferred steer requests completing in reverse order. Add request identity or an equivalent ordering guard at the owning store boundary, then verify that a real latest failure still restores text and media. Run the scenario in an isolated installed VSIX and take a screen capture of the composer after both settlements.

## Decisions made without the owner

Kept this separate from delivery loss because an obsolete asynchronous restoration can corrupt the editor even when delivery succeeds. No product code was changed in this report.

## Links

- `bugs/11_steer_delivery_and_immediate_display.md`
- `apps/vscode/test/webview/chat-store.test.ts`
