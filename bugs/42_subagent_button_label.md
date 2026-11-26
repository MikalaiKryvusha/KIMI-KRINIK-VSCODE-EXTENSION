# Bug 42 — Subagent model settings button needs a «Субагенты» text label in its large form

**Status:** 🔴 OPEN
**Version/build:** owner's accumulated main profile, KIMI KRINIK 1.0.0 build 40 · **When/context:** 2026-11-26 ≈10:56 +03:00, tossed by the owner mid-task during the UI-polish review
**Severity:** S3 (cosmetic, owner-flagged)
**Fixing:** this session, together with bug 41
**Fix accepted when (observable):** in the large (wide composer) form the subagent model button shows the robot icon with the localized text «Субагенты»/«Subagents»/the 中文 equivalent; in the compact form it stays the bare robot icon exactly as now.

## Symptom

The subagent model settings button is only a robot icon in every form. Owner's order: «Кнопке настройки моделей субагентов даем текст в крупном виде с текстом "Субагенты" в компактном виде она такая же, как сейчас - просто иконка робота.»

## Repro

1. Look at the Control Panel subagent-model button at a wide composer width — icon only, no label.

## Fix plan

1. Add the same responsive label pattern the other Control Panel buttons use (`@max-[480px]/composer:hidden` span) to the subagent button, with a new i18n key in EN/RU/ZH (R4).
2. Component test for the label presence and the compact-hiding class; verify on the isolated build at both widths (R2).

## Decisions made without the owner

To fill at closing.

## Links

- `bugs/40_control_panel_on_off_case_and_tint.md` · `HOUSE_RULES.md` R4
