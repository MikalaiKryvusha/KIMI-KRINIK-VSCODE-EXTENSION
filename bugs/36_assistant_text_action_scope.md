# Bug 36 — Assistant Copy joins text items and its actions sit after unrelated tools

**Status:** 🔧 fixed and verified on isolated packaged build 36; accumulated main-profile acceptance pending
**GitHub issue:** https://github.com/MikalaiKryvusha/KIMI-KRINIK-VSCODE-EXTENSION/issues/12
**Version/build:** reported from the owner's current accumulated UI; fixed in KIMI KRINIK 1.0.0 build 36 · **When/context:** 2026-11-26, owner visual review during the UI-polish session
**Severity:** S2
**Fixing:** this session, completed through the isolated packaged user path
**Fix accepted when (observable):** every assistant text item has its own Copy/Fork block immediately beneath it, Copy writes only that item's text, both actions use the shared custom tooltip, code-block copying retains its existing behavior, and the layout remains correct after session replay.

## Symptom

The Copy/Branch actions appeared after the tools used by the agent instead of beside the text they belonged to. Copy concatenated multiple text items from the last step. The owner requires one two-button block under every text item and only the adjacent text in the clipboard.

Owner's reports:
- «Нужно переместить блок кнопок Копировать сообщение и Ответвить диалог с этого места вплотную к текстовому сообщению ии агента, к которому они имеют отношение.»
- «Под КАЖДЫМ текстовым сообщением ИИ агента должен быть такой блок из двух кнопок.»
- «Она должна копировать ТОЛЬКО ОДНО текстовое сообщение, рялом с которым она находится.»

## Repro

1. Produce an assistant response with a text item, a tool call and another text item.
2. Inspect where the action block appears.
3. Click Copy beside the second text and read the text passed to the Clipboard API.
4. Hover both actions and inspect whether the extension's custom tooltip or native `title` appears.
5. Reload the session and repeat the placement check.

## Forensics

- `AssistantMessage` rendered one action block after all steps.
- Its `contentToCopy` branch filtered every text item in the last step and joined them with `\n`.
- Both Copy and Fork used native `title` attributes.

## Root cause

Action ownership belonged to the whole assistant record instead of the individual text item. The copy projection mirrored that whole-record boundary and explicitly combined the last step's texts.

## Fix

- Render `AssistantTextActions` as the last child of each text-item wrapper and pass only that item's `content` to Copy.
- Keep Fork on the existing `turnIndex` supplied by `ChatArea`; no bridge or protocol change.
- Show actions for finished text even while a later text item is still streaming; keep the currently unfinished text without actions.
- Preserve fallback text without steps and skip empty text.
- Use the shared custom tooltip for message Copy/Fork with localized accessible names and no native title.
- Preserve the existing native title for the shared CopyButton's code-block consumer through the message-only `customTooltip` option.

## Verification

Red first: the two new per-text cases failed before implementation. The code-copy preservation case also failed before the message-only tooltip boundary was added.

Hygiene: final full extension 646 passed / 1 skipped / 0 failed; root lint, extension/webview typecheck and VSIX audit pass. Targeted final file: 11/11.

Functional run: isolated build 36 executed text → ReadFile → held text → completion. Both text items had two-button blocks; the first was present while the second response was held. The inner Clipboard API received exactly `K35 second answer`; Copy and Fork custom tooltips were read in WebP. After process restart and session replay, both blocks and exact copying remained. Report: `testcases/reports/2026-11-26_build_36_assistant_text_actions.md`.

REAL WORLD: accumulated — the owner's main profile has build 36 installed but has not been reloaded and observed; data and machine — his Windows VS Code; path — Second Side Bar. The isolated packaged path is verified, while the accumulated running main path remains pending. This bug is not DONE.

TWINS: searched `contentToCopy`, text-item joins, native title forms and all `CopyButton` consumers. The remaining join in `ToolRenderers` produces a subagent output summary, not copied assistant text. The Markdown code-copy consumer intentionally retains its old native title.

## Decisions made without the owner

- Finished text receives actions during an active turn; the currently unfinished text item does not.
- Every text item in one assistant turn keeps the same fork turn index; the owner requested a scope change only for copying.
- Custom tooltips are limited to message actions so code-block copy presentation does not change.
- The build number advanced from 35 to 36 after the code-copy preservation correction so the final VSIX identity could not be confused with the intermediate package.

## Links

- `testcases/reports/2026-11-26_build_36_assistant_text_actions.md`
- `apps/vscode/webview-ui/src/components/ChatMessage.tsx`
- `apps/vscode/webview-ui/src/components/CopyButton.tsx`
- `apps/vscode/test/webview/chat-message.test.tsx`
