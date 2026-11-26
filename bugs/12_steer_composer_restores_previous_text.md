# Bug 12 — A previous steering message reappears in the composer after a newer send

**Status:** 🔧 fix implemented and contracts green; main-profile build-12 restart/acceptance pending
**GitHub issue:** https://github.com/MikalaiKryvusha/KIMI-KRINIK-VSCODE-EXTENSION/issues/26
**Version/build:** originally `8ac5df733`; reproduced by the owner on KIMI KRINIK 1.0.0 build 3 · installed VSIX on the owner's accumulated VS Code profile · **When/context:** 2026-11-24 13:09 +03:00 and again at 2026-11-24 19:07 +03:00, owner live steering acceptance
**Severity:** S2
**Fixing:** this session inside KIMI KRINIK; reproduce at the store boundary and verify fixes in an isolated VS Code environment
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

2026-11-24 19:07 +03:00, build 3: after an AUTO STEER OFF batch the composer contained the batch's first text (`resume` and `ну, вроде загружился новый экстеншен. сборка номер 3`). With AUTO STEER ON, one Enter likewise left the just-sent `тест стиринга. Одно сообщение. Нажимаю Enter.` in the composer. Both are owner screenshots on the accumulated real profile; the asynchronous cause is not inferred from the images.

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

## Fix evidence — 2026-11-24 22:02 +03:00

The store restores text/media only for the latest failed outbound `clientId`. `InputArea` also refuses to restore `pendingInput` when a message with the same ID is still present; genuine failed input with no message retains the old restoration path.

Hygiene: reverse-order rejection was red (`older` restored) before the guard and green afterward; the existing-message InputArea case was red (`steer base`) before the guard and green afterward. Combined affected suites pass.
Functional run: NONE on final build 9 yet. The build is installed on the owner's main-profile disk, but full VS Code restart and composer observation are still required.
