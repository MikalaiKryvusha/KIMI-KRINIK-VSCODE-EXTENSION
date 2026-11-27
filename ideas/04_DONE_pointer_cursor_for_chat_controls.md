# Idea 04 — Pointer cursor for interactive chat controls

> **Created:** 2026-11-27 · **Parent:** owner's direct requests in chat · **Status:** ✅ DONE — 2026-11-27 13:56 +03:00, installed build-58 hover/click acceptance for all eight controls · **Outbound:** GitHub issue #35
> **GitHub issue:** https://github.com/MikalaiKryvusha/KIMI-KRINIK-VSCODE-EXTENSION/issues/35

## Goal vector

**Achieve.** Every control named by the owner gives the same visible mouse-hover affordance as the existing Control Panel buttons: the cursor becomes a hand/pointer over its interactive hit area.

**Avoid.** A partial fix that covers only the first seven controls, changes click behavior or applies a global cursor rule to non-interactive content.

## Acceptance criteria

- Hovering each of these eight enabled controls yields computed `cursor: pointer`: Add file or media, History, Settings gear, Send message, Stop AI agent, Session, Create new chat and the floating scroll-chat-to-bottom button.
- Regression checks identify all eight controls through their existing public UI and fail on the pre-fix implementation.
- The installed VSIX is exercised with real mouse hover; the observed cursor style and an actual click action are recorded for every named control.
- Existing actions, disabled states, keyboard focus and EN/RU/ZH layouts remain unchanged.
- The final report lists all eight controls individually; a sample of controls is not acceptance of the whole request.

## Essence

Apply the existing pointer-cursor convention to the named interactive elements at their own button/hit-area boundaries. Keep the change presentational and limited to the requested controls.

## How it fits the master plan and vision

This is a narrow K1 UI-convergence improvement: existing visible controls keep their real actions and gain the same interaction feedback as the rest of Control Panel. It introduces no engine, configuration or architecture change.

## Implementation sketch (KISS)

1. Locate the eight existing renderers and their current cursor styles, including the floating scroll-to-bottom control.
2. Reuse the established button cursor style at each interactive root rather than introducing a new component or global selector.
3. Add focused regressions for the complete named set and prove them red before the style change.
4. Run affected tests, typecheck, lint and package checks; install the resulting VSIX on the isolated and main profiles by the existing R5/R7 route.
5. Hover and click every named control on the installed VSIX and record the observations before marking the idea DONE and closing issue #35.

## Open questions / what needs the human's answer

None. The control set and expected cursor were specified directly by the owner.

## Owner's original requests

«дополнительный импрувмент:
- при ховере курсора мыши на "Добавить файл или медиа", "История", шестеренка настроек, отправить сообщение, остановить ии агента, "Сессия", "создать новый чат" - курсор мыши должен меняться на руку с пальцем, как на других кнопках панели управления это делает.»

«у кнопки пролистывания чата вниз - тоже курсор-указатель должен быть» — с приложенным изображением плавающей розовой кнопки со стрелкой вниз.

## Implementation and verification — 2026-11-27 13:56 +03:00

Targeted pointer classes now cover all eight controls in `Header.tsx`, `InputArea.tsx`, `ActionMenu.tsx` and `ChatArea.tsx`, including the floating scroll-to-bottom button. Disabled controls retain `cursor-default`; no global selector or click behavior changed.

Three regression groups failed before the change and pass afterward. Full affected suites are 29/29, full extension is 682 passed / 1 skipped, with typecheck and root lint green. Build 58 was installed on isolated and main profiles; real mouse hover and an actual click were recorded for every named control on the isolated packaged product. Run report: `testcases/reports/2026-11-27_pointer_chat_controls.md`.

REAL WORLD: build 58 is installed on the owner's main profile without reload. The idea's installed-VSIX acceptance was performed on the real packaged isolated product; accumulated-main and release gates remain separate.

## Decisions made without the owner

Kept the change presentational and limited each class to a named interactive root. Chose `disabled:cursor-default` to preserve disabled behavior. No engine, configuration, global selector or unrelated control changed.
