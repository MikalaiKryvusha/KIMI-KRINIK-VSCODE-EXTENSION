# Bug 17 — Attention voice omits the owner and project identity

**Status:** 🔴 OPEN
**Version/build:** KIMI KRINIK 1.0.0 · installed VSIX on the owner's accumulated VS Code profile · **When/context:** 2026-11-24 15:26 +03:00, tossed by the owner during chat-pipeline characterization
**Severity:** S2
**Fixing:** this session, before the parked chat-pipeline contracts resume; verify in isolated VS Code
**Fix accepted when (observable):** every spoken attention notification through both the configured Glass command and browser speech fallback begins exactly once with «Николай, это Кими Криник», preserves the event message and never adds the prefix to non-voice tones or silent notifications; the generated phrase and the isolated user path are observed.

## Symptom

The owner heard a voice phrase with neither the speaker/project nor the addressee named. The accepted voice rule requires every address to identify both.

## Repro

1. Enable a voice attention notification in KIMI KRINIK.
2. Complete a turn or trigger another voice-enabled attention event.
3. Read/hear the spoken phrase.

The current attention boundary can be exercised without a live provider by calling `notifyAttention("Done", { sound: "voice", volume: 80 })` with the Glass route available and again with it unavailable.

## Expected result

`HOUSE_RULES.md` R1 requires the opening «Николай, это Кими Криник». The owner's new report makes this binding for attention voice as well as direct agent calls.

[OWNER] «только что звучл голос - ни автора кто говорит, ни ображения, к кому говорят.» · 2026-11-24 15:26 +03:00 (чат)

## Actual result

The raw event text is spoken without identity. Existing dictionaries include short attention strings such as `Done` and `Готово`.

## Forensics

- `apps/vscode/webview-ui/src/lib/attention.ts` sends the caller's raw `message` to `bridge.notifyAttention` and to `SpeechSynthesisUtterance`.
- `apps/vscode/src/handlers/attention.handler.ts:78-100` writes `params.message` unchanged to the Glass phrase file.
- `apps/vscode/test/webview/attention.test.ts:45-64` explicitly expects raw `Answer required` / `Нужен ответ`, so both routes currently encode the defective contract.
- `apps/vscode/test/attention-handler.test.ts:134-148` expects the raw phrase-file content.
- The live temp phrase file is removed on child exit and was no longer available for inspection; no claim is made about the exact phrase heard beyond the owner's report and the confirmed code path.

## Root cause / Hypotheses

The shared webview attention boundary has no identity-prefixing stage. The defect is confirmed in both voice routes; non-voice sounds are outside it.

## Fix plan

Add a red contract at the shared attention boundary for Glass and browser fallback. Prefix the phrase once at that single boundary, preserve already compliant text, and leave tone/off/global-OFF behavior unchanged. Keep the host phrase-file assertion as an integration control, run affected suites and observe the installed VSIX phrase path in isolation.

## Decisions made without the owner

Classified attention speech as covered by the existing R1 identity rule because the owner explicitly rejected the unidentified spoken phrase. No production code was changed when this report was filed.

## Links

- `HOUSE_RULES.md` R1
- `apps/vscode/webview-ui/src/lib/attention.ts`
- `apps/vscode/test/webview/attention.test.ts`
- `apps/vscode/test/attention-handler.test.ts`
