# Bug 20 — Queue lightning gives no immediate response and submits duplicates

**Status:** 🔧 whole-batch delivery verified on isolated build 17; main-profile acceptance pending
**Version/build:** KIMI KRINIK 1.0.0 · owner's accumulated VS Code profile · **When/context:** 2026-11-24 16:02 +03:00, owner queue steering during an active response
**Severity:** S2
**Fixing:** this session before the other open chat-pipeline contracts; verify in isolated VS Code
**Fix accepted when (observable):** the first lightning click immediately removes only the selected queue row as accepted for processing and produces exactly one `steerChat` call for that item across ten rapid activations. A stale completion from a superseded turn opens no sending window. When a genuine sending window opens, every remaining queued item is submitted exactly once in its original order: the first starts the idle turn and the rest join that active turn through steering. An unaccepted or rejected call restores the current item at its original index and stops the batch, while a later genuine retry can send it once.

## Symptom

The owner clicks the queue lightning Steer action, sees no immediate response, clicks again and later discovers that about ten identical messages were submitted.

## Repro

1. During an active response, open a queue containing at least one message.
2. Activate its lightning action repeatedly before the first RPC settles.
3. Count outgoing `steerChat` calls and watch the queue row.

## Expected result

The first activation immediately changes the visible queue so the user knows the action was accepted. Duplicate delivery is prevented internally, not by presenting a disabled button as the UX solution. Failure restores the item for a deliberate retry.

[OWNER] «должна быть не блокировка - а мгновенный отклик UI/UX на действия пользователя» · 2026-11-24 16:02 +03:00 (чат)

## Actual result

The queue row remains unchanged until the RPC resolves and every activation starts another request.

2026-11-24 19:07 +03:00, build 3, AUTO STEER OFF: the owner activated lightning once on the first of several queued messages and observed that the second message was sent too. This is a different trigger from the earlier repeated-click defect and reopens the selected-item/exactly-once contract on the real path.

## Forensics

- `apps/vscode/webview-ui/src/components/QueuedMessagesPanel.tsx:18-22` awaits `bridge.steerChat(content)` and removes the row only for `result.ok`.
- `QueuedMessagesPanel.tsx:32-43` exposes the lightning without an in-flight guard or immediate queue projection change.
- There is no rejection handler, so a failed request has neither reliable restoration feedback nor a completed pending state.

## Root cause / Hypotheses

The component lacks an optimistic queue transition and an in-flight identity guard. The duplicate mechanism is confirmed by the event path; no engine defect is required to explain it.

## Fix plan

Add a regression at the existing `status-pills.test.tsx` user boundary. On the first activation, synchronously remove the item and issue one call; suppress repeat activation for the same in-flight item. Restore the captured item at its original index for `{ ok: false }` or rejection, then permit a genuine retry. Do not add an unconditional `SteerInput` echo or alter the official SDK in this targeted fix.

## Decisions made without the owner

Chose immediate queue removal as the optimistic response, with restoration on failure, following the owner's explicit rejection of a disabled-only answer and the existing `app-client` queue-restoration prior art in `researches/54`. This does not claim the wider optimistic/replay lifecycle is complete.

## Links

- `bugs/11_steer_delivery_and_immediate_display.md`
- `bugs/14_steer_queue_not_added.md`
- `bugs/19_DONE_tool_cards_hide_working_state.md`
- `apps/vscode/webview-ui/src/components/QueuedMessagesPanel.tsx`
- `apps/vscode/test/webview/status-pills.test.tsx`

## ✅ STATUS: DONE (2026-11-24 17:45 +03:00)

The first lightning activation removes the row immediately, one in-flight item produces one call, and false/rejected outcomes restore exact index for deliberate retry. Hygiene: 8/8 status-pill tests and full extension 571 passed/1 skipped. Functional run: isolated installed VSIX removed the row immediately, host logged one `steerChat`, fake model received one steering message across ten activations.

## Research after three failed live-fix iterations — 2026-11-24 20:42 +03:00

### Attempt log

1. Store-owned in-flight queue marker: red unit proved an immediate second dequeue, then turned green. Packaged build 4 appeared to repeat the live failure.
2. Full `PromptSubmissionResult` propagation plus running/queued/blocked contracts: runtime/host/store suites turned green. Packaged builds 5–6 appeared to repeat the same live failure.
3. One-completion queue suppression: timer-controlled red/green contract passed, but the apparent live result remained identical. The repeated identical result triggered this research stop.

### Forensic correction

The apparent build 4–6 live results are INVALID as observations of those builds. The isolated main `Code.exe` PID 44644 was created 2026-11-24 19:22:16 and remained active through all three launches. Every apparent relaunch reused that process and the same log session `user/logs/20261124T192216`.

The on-disk installation is not stale: installed `package.json` reads build 6, and source/installed SHA-256 values match for both `dist/extension.js` (`31d31fbb…eaa0e8c`) and `dist/webview.js` (`93684b09…01b63b0`). The defect is the running process/harness lifecycle, not the installed file set.

### Knowledge base — raw search data

- Playwright `browser.close()` documentation: “In case this browser is connected to, clears all created contexts belonging to this browser and disconnects from the browser server.” It does not promise termination of the remotely connected application. Source: https://playwright.dev/docs/api/class-browser
- VS Code extension marketplace documentation search result: “After an update, you are prompted to restart the extension host (Restart Extensions).” Source: https://code.visualstudio.com/docs/configure/extensions/extension-marketplace
- VS Code issue #214424 search result: “extension updates do not require the whole window reload. it still requires an action from me to click on ‘Restart Extensions’.” Source: https://github.com/microsoft/vscode/issues/214424

### Root cause / working hypothesis

The harness used Playwright `browser.close()` for a `connectOverCDP()` browser and treated its return as application termination. The next spawn delegated to the existing VS Code process. New VSIX files were installed byte-exactly, but no build 4–6 Extension Host was loaded. The identical outcomes therefore do not refute the three code changes and must not drive another product edit.

### Next focused coding/verification pass

1. Close the isolated application through raw CDP `Browser.close` (`.tmp/k5-close.mjs`), not Playwright's connected-browser `close()`.
2. Verify PID 44644 and the 9223 endpoint are gone before launching; after launch require a new main-process start time and a new log-session directory.
3. Read installed build 6 and source/installed dist hashes again, then repeat the two-item OFF queue/lightning scenario and read immediate plus post-completion queue/model counts.
4. Only then accept or reject the current product changes. Do not add another queue mechanism from the invalidated runs.

## Main-profile build-12 reproduction — 2026-11-24 23:54 +03:00

[OWNER] «это сообщение без автостиринга. поставлено в очереди», «это второе в очереди. первое отправлю из очереди стирингом принудительным», «бля, нажал стиринг у первого, а улетело оба в чат», «да, принудительный стиринг из очереди по-прежнему по два сообщения отправляет, хотя молнию у одного нажимаю» (чат).

The owner reproduced the selected-item failure twice on build 12 with AUTO STEER OFF. Two messages were visibly queued; one lightning activation on the first submitted both. This supersedes the earlier fresh-process build-6 scoped pass and reopens the real-path exactly-once contract. The earlier positive steering-speed observation does not close this defect.

2026-11-25 00:05 +03:00 — [OWNER] «юзер мог накидать в очередь большую пачку сообщеений, болье двух. И ожидаемое поведение при появляении окна - ВСЕ они улетают в запросы в этом окне» (чат). The required queue behavior is now explicit: a genuine sending window drains the whole remaining batch exactly once in order, not only one item. The stale-completion guard remains necessary so that a superseded turn does not create a false window.

## Fix evidence — 2026-11-25 00:41 +03:00

The store-level regression reproduced both parts of the real failure before the fix: a stale completion after a newer `TurnBegin` called `streamChat("second")`, and a three-item window released only the next item. The genuine completion path now starts a batch, while `QueueBatchReady` is emitted by the host immediately after the first prompt is accepted; later items use the existing sequential steering and failure-restoration path. Terminal events carry `turnIndex`, so a superseded turn cannot open a false window. Ordinary prompts keep the original runtime call shape.

TWINS: searched `completesQueueSteer`, `queueSteerInFlight` and `sendNextQueued` scheduling across `apps/vscode` and `packages` — the affected queue scheduler is only `apps/vscode/webview-ui/src/stores/chat.store.ts`; terminal correlation is added at its existing SDK adapter/runtime source.

Hygiene: red-to-green store and runtime contracts, 121 affected checks, extension typecheck and VSIX static audit pass. Full extension: 589 passed, 1 skipped, 1 pre-existing `usage-status-bar` selector failure. Root lint reaches `instructions` and stops on the previously documented dead non-KAIF skill link in `docs/AGENTS.md`.

Functional run: fresh-process isolated build 17, AUTO STEER OFF, three queued messages. One lightning activation first showed only `k23 first`; the genuine window then delivered `k23 first`, `k23 second` and `k23 third` in order into the same active model request. The final UI has four user bubbles including `k23 base`, one assistant response, no queue, no error and no Retry. WebP: `.tmp/k5-vscode/46-build-17-full-batch.webp`. Report: `testcases/reports/2026-11-25_queue_batch_build_17.md`.

REAL WORLD: accumulated — the owner reproduced the failure twice on main-profile build 12; data and machine — his actual queued messages and Windows profile; path — forced queue steering in Second Side Bar. The corrected build 17 is verified only on the isolated real VSIX path; main-profile acceptance remains pending, so this bug is not DONE.

## Decisions made without the owner — research update

Stopped product changes after three attempts and reclassified the apparent build 4–6 failures as harness evidence invalid. No claim is made that the current queue fix works until a genuinely new Extension Host reads it.

## Valid fresh-process result — 2026-11-24 22:02 +03:00

After raw CDP termination proved the old PID was gone, a genuinely new Extension Host loaded build 6. One lightning activation on `steer one` showed that entry while `steer two` remained visibly queued; releasing the held response promoted the remaining item. WebP: `.tmp/k5-vscode/40-build-6-selected-queue.webp`.

This supersedes the invalid apparent failures from the reused 19:22 process. Build 9 is installed in the main profile on disk; its real-profile queue acceptance still waits for a full VS Code restart. No DONE claim is made here.
