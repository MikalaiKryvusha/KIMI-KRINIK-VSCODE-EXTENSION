# Idea 02 — Control Panel skill picker with localized descriptions

> **Created:** 2026-11-24 · **Parent:** owner's direct request in chat · **Status:** 🔧 all owner refinements implemented and verified on isolated build 39; accumulated main-profile acceptance pending · **Outbound:** KAIF translation work stays in `D:/work/ai_sandbox/KAIF/ideas/39_srill_multilang_descriptions.md` and is not duplicated here

## Goal vector

**Achieve.** A user can open the existing skill inventory from Control Panel, distinguish skills by name and localized description, and send the selected skill through the same queue-or-Steer path as an ordinary message.

**Avoid.** A second message-delivery path, untranslated fallback behavior or an unreadable flat list.

## Acceptance criteria

- Control Panel shows a «Навык» / localized skill button that opens a scrollable skill list.
- Every row shows a bold skill name on the first line and a regular-weight description on the second line.
- Selecting a skill sends its prompt through the existing path: queued while AUTO STEER is OFF, immediate Steer while ON, with one visible entry and one engine submission.
- RU reads `metadata.description_ru`; ZH reads `metadata.description_zh`; missing `metadata` or the requested key falls back to `description`; EN always reads only `description`.
- Component/parser regressions run before implementation is accepted; the real installed VSIX path is read after implementation.
- The skill picker ships in KIMI KRINIK 1.0.0; the owner's 2026-11-25 18:10 +03:00 decision revokes the earlier post-release deferral.
- The non-KAIF `.agents/skills` content is removed from this project. By the owner's interview #002 decision, `check-kimi-code-docs`, `update-config`, `write-goal`, `mcp-config` and `import-from-cc-codex` remain fully English; `custom-theme`, `sub-skill`, `sub-skill.review` and `sub-skill.consolidate` are unavailable in KIMI KRINIK, including manual slash activation.
- The open dialog always occupies nearly the full webview with 2rem margins on every side and has no compact-view toggle. A collapsed long description shows two clear lines and a faded third; only text exceeding two lines gets a chevron. Max-height animation expands and collapses the description with reduced-motion support, and the fade follows the card's hover background.
- Skill is the first behavior button immediately after Permission mode by default.
- Control Panel settings provide Up/Down chevrons for every button, including hidden ones. Their persisted top-to-bottom order becomes left-to-right order on Control Panel.

## Essence

Add one Control Panel action and one skill-picker dialog backed by the existing skill/slash-command inventory. Reuse the current chat store and runtime rather than creating another outbound path.

## How it fits the master plan and vision

This extends the existing Control Panel and three-language UI without changing the official engine or introducing custom providers. The message path remains the one lifecycle established by the chat-pipeline work.

## Implementation sketch (KISS)

1. Reuse the existing skill/slash-command host inventory; locate its current parser before changing anything.
2. Add localized-description resolution at that single parser boundary with the fallback rules above.
3. Add the Control Panel button and a scrollable two-line-row dialog using existing dialog/store patterns.
4. Route selection through the existing `sendMessage` lifecycle and cover ON/OFF, EN/RU/ZH, missing metadata and missing localized keys.
5. Verify component tests, full hygiene and the installed VSIX user path.

## Implementation status — 2026-11-25 19:22 +03:00

- [x] `readSkillMetadata` exposes the existing parser through an additive SDK API; nested YAML `metadata` is projected once, with no second parser or KAP change.
- [x] `getSlashCommands` carries optional `description_ru` / `description_zh`; missing files, metadata and localized keys keep the base description.
- [x] Control Panel has a localized Skill button and a scrollable two-line dialog, plus `kimi.controlPanel.skills` and the matching settings checkbox.
- [x] Selection uses the existing `sendMessage`: one immediate steer while ON, one queued item while OFF.
- [x] Real parser, host inventory, localization, row layout, ON/OFF and visibility regressions pass; full extension is 621 passed / 1 skipped, SDK typecheck/build and root lint pass.
- [x] Isolated packaged build 25 showed 47 skills in a scrollable two-line dialog, delivered one immediate-skill entry into the active model request, and showed `1 в очереди` with no queued skill in the model request.
- [ ] Accumulated main-profile running-build acceptance remains open: build 25 is installed with matching hashes, but the current Extension Host has not been restarted.

Contract consumers: `packages/node-sdk/src/index.ts` gains one additive function and its metadata type. The VS Code extension is the only new consumer; older SDK clients and KAP payloads are unchanged.

## Decisions made without the owner

[AI] by mandate — the owner required the existing inventory and message path.

- Used an additive SDK metadata reader instead of changing `SkillSummary`, KAP or adding a YAML dependency.
- Placed Skill after Control in the existing K2 group; an empty inventory disables the button and shows the localized empty tooltip.
- Limited metadata projection to the two requested optional fields and the base-description fallback.
- `bugs/33_DONE_skill_variant_windows_path_separator_test.md` records the separate pre-existing Windows test-portability failure; it was fixed independently of this feature.

## Next-chat owner refinements — 2026-11-26 00:36 +03:00

- Increase the skill dialog's outer margin from 32px to 48px on every side.
- Increase the welcome robot ↔ KIMI gap beyond the current 16px and align the header robot ↔ KIMI KRINIK spacing with that direction; the header currently has an 8px gap.

Implemented and verified on isolated build 39: skill margins are 48px, Welcome gap is 24px and header gap is 12px. All 42 accepted skills remain present, rejected skills stay absent, and description animation remains functional. Evidence: `testcases/reports/2026-11-26_build_39_ui_refinements.md`, WebP 108/111/113 in `.tmp/k5-vscode/`.

## Open questions / what needs the human's answer

None. The button, row layout, scrolling, routing, fallback rules and release dependency were decided by the owner. <!-- attribution-ok: the owner's verbatim requests are quoted in the next section -->

## Owner's original request

«На панель управления нужно будт добавить новую кнопку "Навык" - клик по ней будет открывать спискоу навыков:
Название - Описание

Выбор навыка в списке -отправляет в чат по зажаному маршруту - в очередь или авто стиром сразу»

«в парсере навыков нужно будет сделать поддержку описаний на ru и zh языках, они будут хранится в metadata, как в примере ниже.

Если поле metadata или строка на искомом языке отсутствует - то берётся описание из description. Для EN языка всегда берётся описание из description.

В KAIF я сделаю перевод всёх скилов по этой схемме»

«Только название жирно в верхней строчке, а описание обычным шрифтом строчкой ниже. Спискок можно скролить.»

«в kaif я завел задачу
D:\work\ai_sandbox\KAIF\ideas\39_srill_multilang_descriptions.md

потом будет делать, когда KIMI KRINIK 1.0.0 доделаем и зарелизим»

[OWNER] «кнопку навыков на панели управления я заказывал. Это делаем в 1.0.0!!!» · 2026-11-25 18:10 +03:00 (чат) — отменяет перенос кнопки на период после релиза 1.0.0.

```yaml
---
name: api-error-audit
description: Audits REST API error handling and HTTP status codes.
metadata:
  description_ru: Проверяет обработку ошибок REST API и HTTP-статусы.
  description_zh: 审查 REST API 错误处理和 HTTP 状态码。
---
```
