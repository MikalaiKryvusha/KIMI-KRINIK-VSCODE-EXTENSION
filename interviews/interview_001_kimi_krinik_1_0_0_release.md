# Interview #001 — Установка build 19 и публикация KIMI KRINIK 1.0.0

> Topic: разрешение на финальную приёмку build 19 на основном профиле и последующую публикацию релиза
> Source of the idea: owner's «готовь релиз 1.0.0» in chat, 2026-11-25
> Created: 2026-11-25 14:07 +03:00
> Status: **🟡 awaiting the owner's answers**

## Context / what I already found in the code

Build 19 is committed and pushed. The VSIX contains the complete changelog and has SHA-256 `8ef5b5e37606ca9de1a6c96f97e68eb5ea8e3f8327730416a912db9b031f405d`. The full extension has 607 passed / 1 skipped, typecheck and lint are green, and six-target static/import verification passed. README and release notes are complete in EN/RU/ZH, with the neutral factual title `KIMI KRINIK 1.0.0`. The main profile runs build 14; installing build 19 there is the remaining real-world acceptance boundary. Publishing a tag and GitHub Release requires a separate explicit authorization.

## QUESTIONS

### Q1. Разрешаешь установить build 19 на основной профиль и затем опубликовать 1.0.0 после зелёной приёмки?

**Answer target:** `STATUS.md` → release readiness and K5 acceptance

**Origin:** owner asked to prepare 1.0.0. Main-profile installation changes the running environment; GitHub Release is an outward action requiring separate authorization.

<!-- archaeology: search "публикац|релиз|kimi|krini|основн|профи" → 34 hits · read: GOAL.md, MASTER_PLAN.md, plans/01_EPIC_chat_pipeline_reliability.md, plans/03_sticky_viewport_prompt.md · prior: unrelated — earlier decisions do not authorize this specific build-19 installation or 1.0.0 publication -->

- **A) (recommended) Разрешить установку build 19 и публикацию после зелёной приёмки**
  - Situation. Build 19 готов, основной профиль на build 14.
  - Action. Выбираешь A.
  - Result. Агент устанавливает build 19 и публикует `v1.0.0` только при зелёных проверках.
  - Check. `gh release view v1.0.0` показывает VSIX.

- **B) Разрешить только установку build 19**
  - Situation. Публикация пока не разрешена.
  - Action. Выбираешь B.
  - Result. Агент устанавливает build 19 и передаёт приёмку; публикации нет.
  - Check. Manifest `buildNumber: 19`; `gh release list` не содержит `v1.0.0`.

- **C) Не устанавливать на основной профиль**
  - Situation. Основной профиль остаётся на build 14.
  - Action. Выбираешь C.
  - Result. Агент останавливается перед финальной приёмкой; публикации нет.
  - Check. Основной manifest `buildNumber: 14`; `gh release list` не содержит `v1.0.0`.

- **D) your own answer** — напиши свой вариант здесь

**Answer:**

## Proposed implementation plan (after answers)

1. Install build 19 only if A or B is selected, then run the accumulated-profile acceptance and record the results.
2. Publish only if A is selected and every check is green: create the `v1.0.0` tag and GitHub Release with the neutral factual title and the three language notes.
3. Open the published page and read the first screen. If any check fails, stop and report it without publishing.
