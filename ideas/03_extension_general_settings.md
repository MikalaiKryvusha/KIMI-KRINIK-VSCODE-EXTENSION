# Idea 03 — KIMI KRINIK-owned General Settings

> **Created:** 2026-11-24 · **Parent:** owner's direct request in chat · **Status:** 🔧 custom localized General Settings and separate On/Off lines verified on isolated build 39; accumulated main-profile acceptance pending · **Outbound:** none

## Goal vector

**Achieve.** KIMI KRINIK has its own General Settings page whose language follows the extension selection immediately, while every setting has exactly one owning screen.

**Avoid.** Duplicate controls in unrelated dialogs and a native VS Code settings page that cannot follow the extension's language.

## Acceptance criteria

- The extension opens its own General Settings page in English, Русский or 中文 according to `kimi.language`, without depending on the VS Code display language.
- Context Window Control and all four thresholds move from Control Panel settings into this General Settings page; no copy remains in Control Panel settings.
- Every migrated setting retains its current persisted key, validation, host action and existing user value.
- Existing dedicated screens remain for their own domains; General Settings does not duplicate their controls.
- For two-state descriptions, render «Вкл: …» and «Выкл: …» on separate lines so the second state never trails as a fragment on the first state's line; apply the same layout to English and 中文.
- Component tests cover language switching, migration ownership and persistence; the installed VSIX path is read after implementation.
- Work is scheduled after the current closure; no release is authorized by this document.

## Essence

Create one extension-owned settings surface instead of trying to override the native VS Code settings localization. Migrate by functional ownership, not by collecting every option indiscriminately.

## How it fits the master plan and vision

This extends the accepted three-language UI and the existing Control Panel contract. The official engine and persisted configuration remain unchanged.

## Implementation sketch (KISS)

1. Inventory current settings, their owning screens and persisted keys before choosing the page structure.
2. Reuse the existing extension configuration store, dictionaries and dialog patterns for one General Settings surface.
3. Move Context Window Control and its four thresholds out of `ControlPanelSettingsDialog` without changing their host/config behavior.
4. Keep other settings in their existing dedicated screens unless the inventory identifies a clearer owner.
5. Verify EN/RU/ZH, existing persisted values, full hygiene and the installed VSIX path.

## Refinement evidence — 2026-11-26 03:17 +03:00

General Settings now renders each two-state description as separate block lines in EN/RU/ZH. The ZH boundary requires no whitespace before `关闭：`. Component cases cover all three languages; the isolated build 39 showed two adjacent lines for every RU setting. Evidence: `testcases/reports/2026-11-26_build_39_ui_refinements.md` and `.tmp/k5-vscode/112-build39-general-lines.webp`.

## Open questions / what needs the human's answer

None. <!-- attribution-ok: the owner's verbatim decisions are quoted below -->

## Owner's original decisions

«Давай тогда тупо свою страницу General Settings сделаем и туда всё свалим, отвяжемся от General Settings VS Code. Но будем в Наши General Settings переносить умно, так, чтобы не дублировать настройки, которые уже есть в другом месте. Например - фича контроля контестного окна и её проценты пойдут в General Settings и уходят из настройки Панели Управления»

Earlier question that defined the native limitation: «General Settings расширения в VS Code можно так переводить, чтобы оно отображалось по языку, выбранному в экстеншене, а не по языку, выбранному в VS Code?»
