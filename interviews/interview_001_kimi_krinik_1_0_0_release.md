# Interview #001 — Установка build 19 и публикация KIMI KRINIK 1.0.0

> Topic: разрешение на финальную приёмку build 19 на основном профиле и последующую публикацию релиза
> Source of the idea: owner's «готовь релиз 1.0.0» in chat, 2026-11-25
> Created: 2026-11-25 14:07 +03:00
> Status: **✅ ANSWERS RECEIVED — Q1 option B, installation only; publication subsequently authorized on 2026-11-26, conditional on a successful positive smoke**

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

**Answer:** [OWNER] «разрешаю установить» · 2026-11-25 16:33 +03:00 (chat)

## Subsequent release authorization — 2026-11-26 13:10 +03:00

[OWNER] «и если позитивный смоук пройдет успешно: даю дабро на оформление и релиз KIMI KRINIK 1.0.0 !» · 2026-11-26 13:10 +03:00 (chat)

This supersedes the earlier installation-only limitation for release 1.0.0. The condition is binding: publish only after the positive smoke succeeds. The build-43 smoke exposed `bugs/41` (desynchronized sticky expansion), so the condition is not yet met.

## Marketplace and independent project-history decision — 2026-11-26 16:06 +03:00

[OWNER] «мое дерешие: да, разрешаю, делаем. Выполняй подготовку. Оформляй Ридми и всё, что нужно. Отвязываемся от наследия оффициального экстеншена, оформляем свою сопроводительную документацию и историю проекта KIMI KRINIK для - Маркетплейса VS Code - GitHub. чистим теги, которых там накопилось от оффициального КИМИ, ведем свою историю тегов» · 2026-11-26 16:06 +03:00 (chat)

Scope: prepare KIMI KRINIK's own Marketplace and GitHub presentation, documentation, changelog and release-tag history; publish through Marketplace only after its readiness gates pass. Remote tag deletion is handled as a separate destructive action with an exact inventory before deletion.

## Proposed implementation plan (after answers)

1. Install build 19 only if A or B is selected, then run the accumulated-profile acceptance and record the results.
2. Publish under Q1 option A or the subsequent explicit authorization above only after the positive smoke and every release check are green: create the `v1.0.0` tag and GitHub Release with the neutral factual title and the three language notes.
3. Open the published page and read the first screen. If any check fails, stop and report it without publishing.

## Release with documented Known issues — 2026-11-27 14:03 +03:00

[OWNER] «движемся в сторону оформления релизной документации для GitHub и VS Code Marketplace.

Будем релизить 1.0.0 в том виде, в котором она есть со ссылкой на то, что вероятно есть ряд нерешённых issues в GitHub, которые предстоит релить в экстеншене KIMI KRINIK в будующих версих» · 2026-11-27 14:03 +03:00 (chat)

Scope: prepare and publish KIMI KRINIK 1.0.0 for GitHub and VS Code Marketplace with an explicit Known issues section and a link to the open GitHub issue tracker. Open issues and accumulated-profile scenarios are documented as follow-up work for future versions; they are not represented as fixed and no longer block this release by the owner's direct decision. Release packaging, documentation accuracy, artifact integrity and publication verification still must pass. The 123 legacy remote tags remain untouched.

## Release window — 2026-11-27 14:03 +03:00

[OWNER] «этот чат + максимум один следующий - у нас должны состояться релизы 1.0.0» · 2026-11-27 14:03 +03:00 (chat)

Scope: both GitHub `v1.0.0` and VS Code Marketplace 1.0.0 must be published in this chat or, at the latest, in the immediately following chat. Work stays on the release path; the next chat can resume from `STATUS.md` and the release documents rather than re-deriving completed verification.

## GitHub publication receipt — 2026-11-27 16:02 +03:00

`v1.0.0` is published at https://github.com/MikalaiKryvusha/KIMI-KRINIK-VSCODE-EXTENSION/releases/tag/v1.0.0 with seven build-61 VSIX packages. All assets are uploaded and their remote SHA-256 values match the local artifacts. Release notes are value-led in English, Russian and Chinese with no KAIF mention and with an explicit Known issues section. The rendered page was reopened and read. Marketplace publication is left for the next chat under the same owner decision.
