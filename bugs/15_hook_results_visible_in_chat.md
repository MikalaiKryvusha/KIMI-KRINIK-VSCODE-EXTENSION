# Bug 15 — Internal KAIF hook results are rendered as assistant chat text

**Status:** 🔴 OPEN
**Version/build:** KIMI KRINIK 1.0.0 · `8ac5df733` · installed VSIX on the owner's accumulated VS Code profile · **When/context:** 2026-11-24 13:09 +03:00, owner live steering acceptance
**Severity:** S2
**Fixing:** next work session inside KIMI KRINIK; run and verify fixes in an isolated VS Code environment
**Fix accepted when (observable):** initial prompts, steering messages and resumed history deliver UserPromptSubmit hook results to the agent but render no `KAIF context refresh`, `clock-now`, `KAIF knowledge` or raw `hook_result` text in the visible conversation; the user's own content remains unchanged.

## Symptom

Technical blocks appear under «Размышление» after the owner's messages. Examples include `KAIF context refresh`, `clock-now · 2026-11-24 13:04 +03:00` and `KAIF knowledge: the owner spoke`. The owner does not know why these internal messages are shown.

## Repro

1. Run KIMI KRINIK with the project's KAIF hooks active.
2. Send an ordinary message and then steering messages during the turn.
3. Inspect visible assistant steps immediately and after session reload.

## Expected result

Hook results accompany the agent's internal work only. They must never become a separate user-facing message or assistant content. [OWNER] «Звучит логично, чтобы это не по отправкам сообщений юзера происходила, а по самой подкапотной работе агента. Юзеру в чат это показывать смысла нет. Юзеру это не нужно и путает его.» · 2026-11-24 14:37 +03:00 (чат)

## Actual result

The owner's screenshots show complete internal hook instructions as visible chat text.

## Forensics

`apps/vscode/src/runtime/replay-adapter.ts:116-126` explicitly filters `user prompt submit hook` parts, extracts `hookResultBody(part.text)` and emits each as a normal `ContentPart`. `apps/vscode/test/replay-adapter.test.ts:385-435` currently expects `merged hook note` to be emitted as visible content, so the test encodes behavior that contradicts the owner's requirement. The live non-replay path still needs its own observation.

## Root cause / Hypotheses

The replay adapter has a confirmed user-facing rendering path for internal hook text. Whether the immediate steering display uses the same path or an additional adapter is not yet established. A separate hypothesis raised by the owner is the KAIF↔Kimi integration itself: `UserPromptSubmit` may be the wrong place to surface agent-internal instructions. That requires a hook-contract review and is not proof of a KAIF defect; the visible UI rendering is already proven.

## Fix plan

Change the replay contract and its existing assertion intentionally from visible hook text to hidden hook text, then inspect the live event adapter for the twin path. Verify ordinary, steering and resumed sessions in an isolated installed VSIX with real KAIF hooks and screenshots.

## Decisions made without the owner

Classified these messages as internal because their contents are agent instructions, and the owner explicitly rejected their visible appearance. No product code or tests were changed in this report.

## Links

- `apps/vscode/src/utils/hook-parts.ts`
- `apps/vscode/src/runtime/replay-adapter.ts`
- `apps/vscode/test/replay-adapter.test.ts`
