# Epic 04 — Устранение критических блокеров KIMI KRINIK 1.0.0

> **Создан:** 2026-11-27
> **Родитель:** `researches/59_release_blocker_remediation.md`; `GOAL.md`; `STATUS.md`; `reports/KAIF_AUDIT/2026-11-26_kimi_krinik_1_0_0_SUMMARY.md`
> **Статус:** активен; начат 2026-11-27 00:18 +03:00 · [TESTED: 2026-11-27 · phase anchors, source paths and scoped requirements lint checked; no product functional run claimed]
> **Вовне:** исправления и доказательства обновляют локальные bug-документы и связанные GitHub Issues по `HOUSE_RULES.md` R9; публикация релиза не входит в эпик
> **Потомки:** `plans/05_epic04_phase1_steering_attention.md`

## 1. Вектор цели

**Achieve.** Каждый названный критический блокер 1.0.0 получает доказанную причину, адресное исправление, регрессионную проверку и наблюдаемую приёмку на реальном продукте.

**Maintain.** Официальный Kimi engine, существующие SDK/bridge-контракты, старые сессии, сохранённые настройки пользователя и уже исправленные пути остаются рабочими.

**Avoid.** Потеря или повторная отправка сообщений, потеря принудительного context closure, скрытое изменение primary model, ложное completion attention, скрытие настоящих ошибок и закрытие бага по одним unit-тестам.

## 2. Критерии приёмки эпика

| # | Fit criterion | Цель |
|---|---|---|
| AC1 | Количество названных блокеров с красной до исправления и зелёной после неё проверкой на owning public boundary | каждый подтверждённый дефект имеет regression; незакрытый путь явно назван |
| AC2 | Immediate/queued steering, running→idle и replay в runtime/store и packaged VS Code | 0 потерянных и 0 повторных пользовательских действий; completion attention ровно один на genuine idle |
| AC3 | Blocked Context Window Control и secondary-only save | blocked повторяется до accepted; primary model/effort не меняется при secondary-only действии |
| AC4 | Fresh-host sound defaults и клавиатурные действия model picker | Glass/Voice/Alert/Chime; favorite/provider Enter не меняет модель и не закрывает диалог |
| AC5 | Первая и warmed notification на реальном webview | первое записанное слово слышно; rejection и genuine error не маскируются |
| AC6 | Видимый текст и durable history для `bugs/25` и `bugs/11` | нет исчезающего текста; steering виден сразу и доставляется exactly-once через completion/reload |
| AC7 | `pnpm lint`, typecheck, полный `apps/vscode/test`, package audits и функциональные отчёты | все применимые команды зелёные; Hygiene и Functional run записаны раздельно |
| AC8 | Независимый `/skill:fable-judge` по каждой закрываемой фазе и по эпику | нет unsupported DONE, weakened tests или claims шире наблюдения |

Эпик закрывается только после выполнения критериев каждого bug-документа и DONE-переименования соответствующих файлов. Недоступная реальная проверка является явным стопом, а не скрытым «pass».

## 3. Архитектурные границы

- `plans/01_EPIC_chat_pipeline_reliability.md` остаётся архитектурным родителем chat pipeline. Этот эпик не создаёт вторую outbound-модель и не копирует чужие stores.
- Публичный SDK не меняется, пока существующих `PromptSubmissionResult`, `turn.started.promptId` и replay attributes достаточно для наблюдения.
- Исправления идут в owning boundary: runtime result, accepted queue state, secondary persistence, manifest/shared mirror, event-target handling, media readiness или renderer identity — по наблюдению.
- Постоянная пауза в MP3, подавление ошибок, автоматический resend неопределённой доставки и изменение публичных контрактов без доказанной необходимости не допускаются.

## 4. Фазы, порядок и зависимости

### Phase 1 — Steering и attention: `bugs/44`, `bugs/45`, `bugs/46`

**Почему первая:** это самые свежие симптомы владельца и первая очередь в `STATUS.md`; кандидат `bugs/44` требует реальной приёмки до дальнейшего выпуска.

**Вход:** research 59, этот эпик и operational plan `plans/05` закоммичены; build 46 и текущие regressions доступны.

**Выход:** immediate/queued steering и audio прочитаны на реальном VS Code; красный error frame идентифицирован; аудио исправляется только по измеренной причине; новые проверки зелёные либо блокер записан.

### Phase 2 — Пять Act-находок аудита

**Почему вторая:** механизмы уже подтверждены и имеют точные публичные границы. Queue исправление предшествует финальной работе с `bugs/25/11`, чтобы не менять одну гонку дважды.

**Вход:** Phase 1 закрыта judge-проверкой; текущие diff и harness зелёные.

**Выход:** context blocked retry, accepted queued resubmission, secondary primary default, sound manifest defaults и model-picker Enter имеют red-before regressions, зелёные affected suites и наблюдения на packaged paths.

### Phase 3 — Видимость сообщений и exactly-once steering: `bugs/25`, `bugs/11`

**Почему третья:** свежий frame-level захват должен читать уже исправленный queue/terminal порядок Phase 2.

**Вход:** Phase 2 закрыта; актуальный isolated build содержит предыдущие исправления.

**Выход:** причина свежего исчезновения установлена по видимым кадрам либо воспроизведение честно остаётся открытым; steering выполняет immediate-display/exactly-once acceptance через running, queued, blocked, fallback, completion и reload.

### Phase 4 — Release-candidate hardening

**Почему последняя:** финальный артефакт должен содержать все исправления одним build identity.

**Вход:** Phases 1–3 закрыты judge-проверками; нет красных affected suites.

**Выход:** полный extension suite, typecheck, lint, universal+target VSIX audits, изолированная и накопленная основная приёмка, WebP/log/DOM evidence, changeset и финальный judge. GitHub Release и Marketplace остаются отдельными действиями владельца.

## 5. Общие ворота и stop rules

- Каждый новый regression сначала наблюдается красным на названной исходной версии; fixture failure сначала исправляется как проблема стенда.
- Положительный smoke выполняется до negative/boundary cases; lint и unit suites не называются функциональным тестом.
- Каждая фаза оставляет отчёт в `testcases/reports/`, обновляет bug-документы и `STATUS.md`, коммитит только проверенные куски и проходит `/skill:fable-judge`.
- Основное окно, выполняющее текущую сессию, не перезагружается. Накопленная приёмка следует `HOUSE_RULES.md` R7.
- Три неудачные итерации одного исправления переводят работу в `/skill:bug-research`; четвёртой слепой правки нет.
- Нельзя ослаблять assertions, добавлять sleep/retry-until-green, скрывать настоящие ошибки или объявлять DONE без Functional run и REAL WORLD boundary.

## 6. Риски

- Гость webview может остаться недоступен прежнему CDP harness; сначала чинится наблюдение, не продукт.
- Аудиособытия DOM не доказывают слышимый первый звук; нужен доступный аудиозахват или явно записанное ограничение.
- Исправления terminal/queue меняют общие пути и требуют control cases для single-turn, rejected, replay и старых событий без ID.
- Накопленный профиль нельзя обновить перезагрузкой из активной self-hosting сессии; финальная приёмка планируется безопасно и не подменяется installed-hash.
- Реальные macOS/Linux установки и слышимое качество EN/RU/ZH могут остаться вне возможностей машины и будут названы отдельно.

## 7. Decisions made without the owner

[AI] by mandate — владелец приказал анализировать, планировать, исправлять и тестировать все названные блокеры.

- Создан umbrella-эпик для release blockers; существующий chat epic сохранён как источник архитектуры, без дублирующего redesign.
- Порядок фаз следует свежим owner symptoms, затем подтверждённым Act-механизмам, затем нестабильным main-profile симптомам и общей сборке.
- Публикация релиза исключена из объёма; разрешение на исправления не трактуется как разрешение на GitHub Release или Marketplace.
