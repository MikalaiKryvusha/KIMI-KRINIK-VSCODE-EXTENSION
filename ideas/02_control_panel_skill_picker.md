# Idea 02 — Control Panel skill picker with localized descriptions

> **Created:** 2026-11-24 · **Parent:** owner's direct request in chat · **Status:** ✅ owner-approved; deliberately deferred until KIMI KRINIK 1.0.0 is completed and released · **Outbound:** KAIF translation work stays in `D:/work/ai_sandbox/KAIF/ideas/39_srill_multilang_descriptions.md` and is not duplicated here

## Goal vector

**Achieve.** A user can open the existing skill inventory from Control Panel, distinguish skills by name and localized description, and send the selected skill through the same queue-or-Steer path as an ordinary message.

**Avoid.** A second message-delivery path, untranslated fallback behavior or an unreadable flat list.

## Acceptance criteria

- Control Panel shows a «Навык» / localized skill button that opens a scrollable skill list.
- Every row shows a bold skill name on the first line and a regular-weight description on the second line.
- Selecting a skill sends its prompt through the existing path: queued while AUTO STEER is OFF, immediate Steer while ON, with one visible entry and one engine submission.
- RU reads `metadata.description_ru`; ZH reads `metadata.description_zh`; missing `metadata` or the requested key falls back to `description`; EN always reads only `description`.
- Component/parser regressions run before implementation is accepted; the real installed VSIX path is read after implementation.
- Work starts only after KIMI KRINIK 1.0.0 is completed and released, not during the current closure.

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

```yaml
---
name: api-error-audit
description: Audits REST API error handling and HTTP status codes.
metadata:
  description_ru: Проверяет обработку ошибок REST API и HTTP-статусы.
  description_zh: 审查 REST API 错误处理和 HTTP 状态码。
---
```
