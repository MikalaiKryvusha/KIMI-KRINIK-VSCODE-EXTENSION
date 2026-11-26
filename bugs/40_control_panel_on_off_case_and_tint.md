# Bug 40 — Control Panel descriptions: «Вкл»/«Выкл» must be «ВКЛ»/«ВЫКЛ» with a slight green/red tint

**Status:** 🔧 fixed; full suite 651/1, lint and typecheck green; real visual acceptance pending
**GitHub issue:** https://github.com/MikalaiKryvusha/KIMI-KRINIK-VSCODE-EXTENSION/issues/6
**Version/build:** owner's accumulated main profile, KIMI KRINIK 1.0.0 build 39 · **When/context:** 2026-11-26 10:11 +03:00, tossed by the owner mid-task during the UI-polish review
**Severity:** S3 (cosmetic, owner-flagged)
**Fixing:** this session, after the sticky items
**Fix accepted when (observable):** every Control Panel button description spells the state in UPPERCASE («ВКЛ:»/«ВЫКЛ:», «ON:»/«OFF:», the 中文 wording unchanged — no case exists) and the state word is tinted slightly green for ON, slightly red for OFF, in all three interface languages.

## Symptom

Control Panel button descriptions (tooltips) write the state as «Вкл:»/«Выкл:» in plain gray. Owner's order: «во всех кнопках Панели Управления в описаниях пересмотреть написания "Выкл" и "Вкл". Писать их в ВЕРХНЕМ РЕГИСТРЕ, как "ВКЛ" и "ВЫКЛ". Если можно, то красить "ВКЛ" и "ВЫКЛ" от их серого в чуть-чуть зеленый и чуть-чуть красный тона» (screenshot of the Compact tooltip «Выкл: автоматическое сжатие контекста чата отключено…»).

## Repro

1. Hover any Control Panel toggle button (Compact, Steer, Context Window…).
2. Read the state prefix — mixed case, gray.

## Root cause / Hypotheses

The i18n strings (`menu.*On/Off`, `controlWindow.*` etc. in `webview-ui/src/i18n/{en,ru,zh}.ts`) carry mixed-case state words, and the tooltip renders them as plain text with no styled state span.

## Fix

1. The six Control Panel state strings (`controlWindow.on/off`, `menu.autoCompactOn/Off`, `menu.autoSteerOn/Off`) now open with «ВКЛ:»/«ВЫКЛ:» in Russian and «ON:»/«OFF:» in English; 中文 keeps 开启：/关闭： (no case exists).
2. New `StateDescription` in `BehaviorButtons.tsx` splits the leading state word and tints it `text-green-600 dark:text-green-400` for ON, `text-red-600 dark:text-red-400` for OFF; all three tooltips (Compact, Steer, Context Window) render through it.
3. Scope kept to Control Panel button descriptions. The General Settings «Вкл:/Выкл:» description lines are a separate surface (redone in build 39) — consciously out of scope unless the owner says otherwise.
4. Tests: i18n pins updated to the uppercase strings (owner-ordered behavior change); a new `StateDescription` test pins the green/red tint in EN, RU and ZH, including the full-width colon.

## Decisions made without the owner

[AI] Tint colors follow the app's existing accent convention (blue-600/dark:blue-400 on the active buttons) mapped to green/red; ZH wording unchanged since case does not apply, the tint still applies.

## Links

- `ideas/02_control_panel_skill_picker.md` · `HOUSE_RULES.md` R4 (all three languages)
