# Epic 01 — Надёжный конвейер исходящих сообщений чата

> **Создан:** 2026-11-24
> **Родитель:** `researches/54_chat_pipeline_reliability.md`; `GOAL.md` критерии 3–4; `bugs/11`–`bugs/16`
> **Статус:** предложен по исследованию; фаза 0 не начата
> **Вовне:** технические решения и последующие фазы требуют отдельной приёмки; публичный релиз не входит в эпик
> **Потомки:** `plans/02_epic01_characterize_chat_pipeline.md`
> **Проверка:** [TESTED: 2026-11-24 · source and scope review; requirements/attribution lint and fable-judge VERIFIED WITH CAVEATS — scenario-lint SKIPPED, no implementation or functional run claimed]

## 1. Вектор цели

**Achieve.** Пользователь сразу видит каждое отправленное сообщение и вложения, а KIMI KRINIK один раз проводит сообщение от нажатия Send до движка и постоянной истории.

**Maintain.** Официальный Kimi engine, его `promptId`, состояния `running | queued | blocked`, существующие сессии и контракты replay сохраняются как источники истины.

**Avoid.** Потери и дубли сообщений, ложное подтверждение steering, восстановление старого текста в редакторе, аватар агента над чужим сообщением и показ внутренних hook-инструкций в чате.

## 2. Критерии приёмки эпика

| # | Fit criterion — как измеряем приёмку | Цель |
|---|---|---|
| AC1 | Момент появления пузыря относительно deferred `steerChat` в store/component test | пузырь и миниатюры видны до разрешения Promise |
| AC2 | Различие ответов `running`, `queued`, `blocked` в runtime/host/store | каждое состояние имеет отдельный видимый результат; `blocked` не считается успехом |
| AC3 | Матрица text/media × ON/OFF × running/turn-end/rejected × live/replay | 0 потерянных и 0 повторных сообщений и вложений |
| AC4 | Два и более deferred запроса, завершающиеся в обратном порядке | ответ меняет только свою запись; старый текст в редакторе не появляется |
| AC5 | Переход `running → idle` с fallback в обычный `prompt()` | один вызов каждого пути, один `promptId`, один пузырь |
| AC6 | Видимая очередь при AUTO STEER OFF и продвижение `queued → running` по `turn.started.promptId` | очередь видна сразу, сообщение продвигается без дубля |
| AC7 | Порядок секций, media viewer, hook filtering и старые replay-записи | пользователь выше аватара, viewer открывается, hook-текст скрыт, старые сессии читаются |
| AC8 | `pnpm lint`, typecheck, полный `apps/vscode/test`, build и изолированный VSIX на Windows | все команды зелёные; пользовательские сценарии прочитаны по DOM/log/WebP |

Эпик не закрывается unit-тестами без изолированного пользовательского прогона. C09/C10/C19 возвращаются к `pass` только после AC3–AC8.

## 3. Архитектурное решение

FORK: options < только optimistic renderer | единый outbound lifecycle с двумя ID | перенос Claude/app-client целиком > · price of error < потерянные или повторные сообщения, несовместимость с официальным engine > · consulted <`researches/54_chat_pipeline_reliability.md`; Claude bundle 2.1.331; `usePromptPipeline`; `PromptSubmissionResult`>.

Выбирается единый outbound lifecycle с двумя ID. Локальный `clientId` создаётся при Send и связывает мгновенную запись с RPC-ответом. Движковый `promptId` связывает ту же запись с `turn.started` и replay. Публичный SDK в базовом варианте не меняется.

Outbound-запись хранит полное содержимое, модель, выбранный режим и состояние. `pendingInput`, очередь и optimistic bubble становятся проекциями записи, а не независимыми копиями истины. Ответы изменяют только запись с совпадающим ID. Неизвестная доставка после рестарта получает явный uncertain/failed статус и не переотправляется автоматически.

## 4. Инвентарь старого пути — что сохраняется и где

| Старое поведение/контракт | Место в новом варианте |
|---|---|
| `autoSteer=true` вызывает `session.steer`, OFF использует обычную очередь | режим выбирается при создании outbound-записи, прежний SDK остаётся |
| `session.steer` возвращает `PromptSubmissionResult` | результат проходит runtime → host → webview без сокращения до `ok` |
| `prompt({ promptId })` поддерживает идентификатор | fallback продолжает ту же запись |
| `turn.started.promptId` и replay attributes | live promotion и replay reconciliation |
| Текст, image/video parts и `toSdkPromptInput` | содержимое записи не меняет форму; конвертер используется прежний |
| `pendingInput` нужен retry исходного turn | исходный turn и outbound follow-up разделяются; retry не подменяется новой записью |
| Восстановление последнего failed draft | только актуальная failed запись восстанавливается один раз вместе с media |
| Старые replay без `promptId` | читаются по прежнему content/order fallback, миграция данных не требуется |
| Internal UserPromptSubmit parts передаются агенту | остаются в engine input, удаляются из всех UI-проекций |
| Session broadcast для нескольких webview | сохраняется; отдельное расширение optimistic broadcast не входит в фазы 0–1 |

## 5. Фазы, порядок и ворота

### Phase 0 — Characterization and red contracts

**Зачем первая:** текущие тесты закрепляют безусловный `SteerInput` и mocked `ok:true`, поэтому они не отличают успех от queue/blocked.

Работы: инвентарь flow, red regression tests для результатов SDK, deferred acknowledgement, очереди, media, avatar и hook filtering, тестовая матрица в `testcases/`.

**Вход:** research 54 и этот план записаны.

**Выход:** каждый пункт bugs/11–16 имеет минимальную проверку, которая падает на исходном коде по ожидаемой причине; production diff фазы — только tests/docs.

### Phase 1 — Honest engine result and identity propagation

**Зачем вторая:** optimistic UI без честного результата продолжит лгать о доставке.

Работы: `SessionRuntime.steer` возвращает `PromptSubmissionResult`; host передаёт его; `SteerInput` перестаёт быть безусловным; `TurnBegin` и replay получают `promptId`; обычный fallback использует `prompt({promptId})`.

**Вход:** Phase 0 red contracts подтверждены.

**Выход:** running/queued/blocked различимы в runtime/host tests; `promptId` проходит live и replay; существующие session/runtime/adapter suites зелёные; changeset для каждого затронутого пакета.

### Phase 2 — Outbound lifecycle and exactly-once delivery

**Зачем третья:** только после identity можно безопасно сделать мгновенный optimistic UI и гонки ответов.

Работы: единая outbound-запись, immediate optimistic bubble, visible queue, per-ID completion, stale-response guard, media ownership, serialisation/FIFO, exactly-once fallback и восстановление только актуального draft.

**Вход:** Phase 1 identity/result contracts зелёные.

**Выход:** AC1–AC6 в store/component tests; обратный порядок ответов не меняет чужие записи; `pnpm lint`, typecheck и полный extension suite зелёные.

### Phase 3 — Timeline, attachments, replay and hook filtering

**Зачем четвёртая:** правильная delivery model позволяет разделить пользовательскую и assistant-секции без косметических обходов.

Работы: steering как отдельная user entry, avatar ниже пользователя, общие `MessageMedia`/`MediaPreviewModal`, replay по ID со старым fallback, скрытие hook parts во всех UI-путях.

**Вход:** Phase 2 exactly-once contracts зелёные.

**Выход:** AC7 и соответствующие replay/component regressions зелёные; старые записи читаются; replay attention остаётся выключенным.

### Phase 4 — Isolated VSIX acceptance and hardening

**Зачем последняя:** mocked Promise и unit tests не доказывают реальную границу turn, media и restart на Windows.

Работы: packaged VSIX, длинный controlled turn, text/media ON/OFF, rejected/late sends, replay/reload, две webview, hook output, скриншоты и host/model logs. После этого возобновляются C08, C11–C12 и C18–C23.

**Вход:** Phases 0–3 закрыты, VSIX собран из одного чистого набора файлов.

**Выход:** AC1–AC8 прочитаны на изолированном VS Code; `bugs/11`–`16` получают отдельные DONE-статусы с Hygiene и Functional run; независимый `/skill:fable-judge` подтверждает claims.

## 6. Обязательная матрица проверок

- positive smoke: idle text, ON accepted text, OFF queued text;
- состояния: running, queued, blocked, turn just ended, rejected RPC, stream ended without acknowledgement;
- гонки: два/три запроса в обратном порядке, send during completion, repeated Enter;
- содержимое: multiline, text+image, media-only, video, старые replay без ID;
- lifetime: immediate, accepted, queued→running, reload, two webviews;
- внутренние данные: UserPromptSubmit hooks present and absent;
- платформа: Windows path/media, isolated accumulated-like profile, VS Code 1.123.0.

Каждая новая проверка сначала падает на названной исходной версии. Контрольный случай отличает `queued`/`blocked` от успешного `running`; без него зелёный optimistic UI не является доказательством доставки.

## 7. Риски и границы

- **Дубли при retry:** автоматическая повторная отправка запрещена при неизвестной доставке; решение принимается по engine result/replay.
- **Старые сессии:** отсутствие ID остаётся поддержанным content/order fallback, не миграцией.
- **Два клиента:** фазы 0–1 сохраняют текущий broadcast. До Phase 2 определяется, нужен ли другим клиентам optimistic echo; это не блокирует первую фазу.
- **SDK events:** `prompt.submitted` и `prompt.steered` пока остаются dropped. Их включение — отдельное изменение SDK с анализом потребителей, если `PromptSubmissionResult` + `turn.started` окажется недостаточно.
- **Объём:** компоненты Claude и `app-client` не копируются. Контракты и сценарии переносятся через `apps/vscode/shared`, runtime, store и адаптеры.
- [AI] **Не менять постановку тестов ради зелёного:** существующий тест безусловного `SteerInput` и тест видимого hook текста меняются осознанно по требованиям из `bugs/11`–`bugs/16`, с justification в коммите.

## 8. Decisions made without the owner

[AI] by mandate — «Гугли, как устроен харнес Claude Code … Пиши конспект и планы починки и переделки нашего флоу конвеера чата.»

- Выбрана единая lifecycle-модель с локальным и движковым ID, без изменения публичного SDK на старте.
- Фаза 0 содержит только characterization tests/docs; фазы исполнения идут от результата движка к optimistic UI и далее к replay.
- При неизвестной доставке выбран явный uncertain/failed статус без автоматического resend.
- Слияние нескольких сообщений из `app-client` не переносится: одно действие пользователя остаётся одной видимой записью.
- Операционный план детализируется только для Phase 0; следующие планы пишутся после закрытия предыдущих фаз.
