# Interview #003 — Доступ к Marketplace и краткое описание build 61

> Topic: завершение публикации KIMI KRINIK 1.0.0 в Visual Studio Marketplace
> Source of the idea: owner's Marketplace publication handover, 2026-11-27
> Created: 2026-11-27 16:52 +03:00
> Status: **✅ ANSWERS RECEIVED AND APPLIED 2026-11-27 — Q1 option D, detailed major-capability release notes published; Q2 option A, GitHub Trusted Publishing configured and verified. Marketplace 1.0.0 build 62 is public; the owner explicitly approved the pink robot logo**

## Что уже проверено

Универсальный VSIX имеет версию `1.0.0`, build `61` и SHA-256 `529e33801affd593257be8f290ed08d8983a5c29688d1ef5581bbb13e7d29f92`. Локальный файл и GitHub Release совпадают. Аудит пакета, импорт entry point, 17 профильных тестов, typecheck и lint зелёные. README, CHANGELOG, изображение, privacy и support links готовы.

Для публикации подготовлен `.github/workflows/vscode-marketplace-publish.yml`. Workflow скачивает универсальный VSIX из GitHub Release, сверяет SHA-256, повторяет аудит и использует GitHub Trusted Publishing без долгоживущего токена.

Внутри build 61 осталось краткое описание: «An improved and advanced Kimi Code extension for VS Code based on vanilla Kimi Code and Kimi Fork». Оно начинается со сравнения и основы продукта. Предлагаемое описание по правилу R10: [AI]«KIMI KRINIK helps you manage long Kimi Code sessions, send follow-ups without losing messages, and get notified when your attention is needed.»[/AI]

На машине нет `VSCE_PAT`, сохранённого издателя `vsce` и Azure CLI. В GitHub нет секрета `VSCE_PAT`. Marketplace показывает `Extension "mikalai-kryvusha.kimi-code-kaif" not found`. Настройка издателя требует входа владельца в Microsoft-аккаунт.

## QUESTIONS

### Q1. Какой пакет публиковать с учётом краткого описания?

<!-- archaeology: search "marketpla|publish|trust|publishi|packa|descripti" → 43 hits · read: interviews/interview_001_kimi_krinik_1_0_0_release.md, researches/58_vscode_marketplace_publication.md, apps/vscode/package.json, packaged extension/package.json · prior: owner authorized Marketplace 1.0.0 and exact build-61 artifacts; no decision authorizes replacing an already published GitHub asset -->

- **A) (Рекомендовано) Исправить описание перед публикацией**
  - Situation. Build 61 содержит старое краткое описание, GitHub Release уже опубликован.
  - Action. Разрешаешь заменить универсальный VSIX в GitHub Release пакетом с предложенным описанием и опубликовать исправленный пакет в Marketplace.
  - Result. Версия `1.0.0` и build `61` сохраняются, SHA-256 универсального VSIX меняется, GitHub и Marketplace получают одинаковый пакет с описанием, которое говорит о пользе для пользователя.
  - Check. `unzip -p apps/vscode/artifacts/vsix/kimi-code-universal.vsix extension/package.json` содержит новое description; локальный и GitHub SHA-256 совпадают.
- **B) Опубликовать исходный build 61 без изменений**
  - Situation. SHA-256 всех release-артефактов сохраняется.
  - Action. Разрешаешь опубликовать исходный универсальный VSIX со старым кратким описанием.
  - Result. Marketplace получает точный GitHub build 61; краткое описание остаётся прежним до следующей версии.
  - Check. SHA-256 равен `529e33801affd593257be8f290ed08d8983a5c29688d1ef5581bbb13e7d29f92`.
- **D) your own answer** — напиши свой вариант в Answer

**Answer:** D) — не понимаю вопрос. Актуальное описание подробное нужно составить. <!-- owner-review: by Mikalai Kryvusha · 27 ноября 2026, 17:07 (+03:00) -->

### Q2. Как настроить доступ издателя к публикации?

<!-- archaeology: search "marketpla|publish|trust|publishi|packa|descripti" → 43 hits · read: researches/58_vscode_marketplace_publication.md, official VS Code Publishing Extensions documentation, local vsce/gh authentication probes · prior: owner authorized preparation and publication; Microsoft account and publisher access remain unconfigured -->

- **A) (Рекомендовано) Настроить GitHub Trusted Publishing**
  - Situation. Workflow готов. Только владелец может войти в Microsoft-аккаунт и создать или выбрать издателя.
  - Action. Открой https://marketplace.visualstudio.com/manage/publishers/ и войди в Microsoft-аккаунт. Создай или выбери издателя с ID `mikalai-kryvusha`. В разделе **Trusted Publishing → Create** заполни: Policy name `KIMI KRINIK GitHub Releases`; Repository owner `MikalaiKryvusha`; Repository `KIMI-KRINIK-VSCODE-EXTENSION`; Workflow `vscode-marketplace-publish.yml`; Environment оставь пустым. Нажми **Create**, затем выбери A.
  - Result. Агент запускает workflow для `v1.0.0`, проверяет опубликованную версию и открывает публичную страницу Marketplace.
  - Check. В Trusted Publishing издателя видна политика `KIMI KRINIK GitHub Releases`; `gh workflow run vscode-marketplace-publish.yml -f release_tag=v1.0.0` запускается после ответа.
- **B) Загрузить универсальный VSIX вручную**
  - Situation. Настройка Trusted Publishing не требуется.
  - Action. Открой страницу управления издателем, создай или выбери `mikalai-kryvusha`, загрузи выбранный в Q1 универсальный VSIX через **New extension → Visual Studio Code**, затем выбери B.
  - Result. Пакет отправляется на обработку Marketplace; агент проверяет публичную версию и страницу.
  - Check. На странице издателя виден `kimi-code-kaif` версии `1.0.0`.
- **D) your own answer** — напиши свой вариант в Answer

**Answer:** A) <!-- owner-review: by Mikalai Kryvusha · 27 ноября 2026, 17:07 (+03:00) -->

[OWNER] «сделал» · 2026-11-27 17:23 +03:00 (чат), после заполнения полей Trusted Publishing из Q2.

## Marketplace icon decision — 2026-11-27 17:42 +03:00

[OWNER] «розовый робот - наш логотим, да, это я одобряю, со мной согласовано» · 2026-11-27 17:42 +03:00 (чат)

Scope: the existing pink KIMI KRINIK robot is explicitly approved as the product logo, including the Visual Studio Marketplace storefront icon. The rejected black K icon was replaced in release `1.0.0` build `62`.

## Publication receipt — 2026-11-27 17:55 +03:00

GitHub Trusted Publishing run 46017994560 published `mikalai-kryvusha.kimi-code-kaif` 1.0.0 with universal VSIX SHA-256 `5cf8731783d417d60b4ed611cc29f4d85582d4fd7e3180ba5e25b0711a51ccd8`. The public Marketplace item returned HTTP 200 at 17:54 +03:00 and was read in EN/RU/ZH. A clean VS Code profile installed version 1.0.0 by extension ID; its manifest reports build 62 and its icon matches the approved source. The packaged short description and README remain future-version polish surfaces; version 1.0.0 is left unchanged after verification.
