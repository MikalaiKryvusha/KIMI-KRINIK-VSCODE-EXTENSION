# Bug 42 — Subagent model settings button needs a «Субагенты» text label in its large form

**Status:** 🔧 fixed and verified on isolated build 42 — large form 92.97px wide with «Субагенты» visible in the row, compact form exactly 24×24 icon-only; accumulated main-profile acceptance pending
**Version/build:** owner's accumulated main profile, KIMI KRINIK 1.0.0 build 40 · **When/context:** 2026-11-26 ≈10:56 +03:00, tossed by the owner mid-task during the UI-polish review
**Severity:** S3 (cosmetic, owner-flagged)
**Fixing:** this session, together with bug 41
**Fix accepted when (observable):** in the large (wide composer) form the subagent model button shows the robot icon with the localized text «Субагенты»/«Subagents»/the 中文 equivalent; in the compact form it stays the bare robot icon exactly as now.

## Symptom

The subagent model settings button is only a robot icon in every form. Owner's order: «Кнопке настройки моделей субагентов даем текст в крупном виде с текстом "Субагенты" в компактном виде она такая же, как сейчас - просто иконка робота.»

## Repro

1. Look at the Control Panel subagent-model button at a wide composer width — icon only, no label.

## Fix

1. Added `subagent.button` = «Subagents»/«Субагенты»/«子智能体» (matching the existing ZH dictionary term) and a label span with the Control Panel's responsive `@max-[480px]/composer:hidden` pattern. The compact form keeps the exact `size-6` icon-only square; the large form expands via `@min-[480px]/composer:w-auto/px-1.5/gap-1`.
2. Component test pins the label text, its compact-hiding class and the preserved compact square; verify on the isolated build at both widths (R2).

## Decisions made without the owner

[AI] ZH label uses the dictionary's existing 子智能体 rather than introducing a second translation for subagents.

## Links

- `bugs/40_control_panel_on_off_case_and_tint.md` · `HOUSE_RULES.md` R4
