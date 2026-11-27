# Plan 07 — Epic 04 Phase 3: видимость сообщений и exactly-once steering

> **Создан:** 2026-11-27
> **Родитель:** `plans/04_EPIC_release_blocker_remediation.md` — «Phase 3 — Видимость сообщений и exactly-once steering: `bugs/25`, `bugs/11`»
> **Статус:** активен с 2026-11-27 11:13 +03:00 после закрытия Phase 2 на packaged build 55; production code ещё не менялся · [NOT-TESTED]
> **Вовне:** результаты обновляют `bugs/25`, `bugs/11`, issues #2/#16, `STATUS.md` и `testcases/reports/`; релиз не авторизуется этим планом

## 1. Вектор цели

**Achieve.** Свежая причина исчезновения видимого assistant текста установлена по кадрам реального webview, либо честно зафиксированы невоспроизведённые варианты без новой правки вслепую. Steering показывает user bubble синхронно и доставляет каждое действие ровно один раз через running, queued, blocked, fallback, completion и reload.

**Maintain.** Исправленные Phase 1–2 lifecycle, accepted queue, turn identity, internal-hook filtering и старые сессии остаются control cases.

**Avoid.** Потерянный или продублированный текст, новый regression без frame-level причины, перезагрузка основного self-host окна и DONE только по isolated/jsdom evidence.

## 2. Критерии приёмки фазы

- Положительный smoke на актуальном isolated build сначала показывает durable user/assistant текст и отсутствие внутренних hook messages в chat.
- MutationObserver/requestAnimationFrame измеряют именно видимый текст и assistant identity через progress text → prompt-only steer → original completion → новый TurnBegin; ни один реальный assistant текст не исчезает без новой видимой замены и причины.
- Immediate steer user bubble наблюдается до acknowledgement; accepted running, accepted queued, blocked/rejected и running→idle fallback дают ровно один provider request и одну durable history запись на пользовательское действие.
- Completion и reload сохраняют тот же user/assistant текст в том же порядке; replay не создаёт пустой или промежуточно стёртый кадр.
- Если свежий симптом `bugs/25` не воспроизводится, протокол содержит не менее трёх вариантов по осям data/state, timing/race и entry point/fresh-vs-accumulated; код не меняется без воспроизведённой причины.
- Accumulated main-profile путь проверяется после безопасного перезапуска владельцем/отдельной сессией. До этого isolated результат не называется production DONE.
- Affected regressions, full extension, typecheck, lint и packaged VSIX остаются зелёными; каждый запуск получает Hygiene, Functional run, Found, Traces, Verdict и REAL WORLD.

## 3. Test basis и существующие артефакты

- `bugs/25_first_prompt_assistant_message_flicker.md` — свежий owner-observed progress-text recurrence и требование frame-level capture.
- `bugs/11_steer_delivery_and_immediate_display.md` — synchronous display и running→idle exactly-once acceptance; сложная охота ранее припаркована словом владельца.
- EXP-0016: измерять исчезающий видимый текст, а не выживший wrapper; live adapter важнее replay-only проверки.
- EXP-0022: turn-scoped identity обязана переживать каждый adapter boundary и late original event после optimistic steer.
- EXP-0029: completion принадлежит всему outbound lifecycle; каждая отсрочка имеет named later emitter и явный dedup.
- `apps/vscode/test/webview/chat-message.test.tsx`, `chat-area.test.tsx`, `chat-store.test.ts`, `status-pills.test.tsx`, `event-adapter.test.ts`, `session-runtime.test.ts`.
- Packaged build 55, fake model `hold` / `hold-after-first`, existing `.tmp/k5-cdp.mjs`, `.tmp/k5-vscode-ui.mjs`, isolated actual-window close/relaunch route.

## 4. Шаги

### 4.1 Instrumentation и положительный smoke

Anchor: Epic 04 Phase 3 — «свежий frame-level захват должен читать уже исправленный queue/terminal порядок Phase 2».

- [ ] Восстановить isolated stand на testkit primary, AUTO STEER ON и актуальный fake provider; убрать временные context/secondary fixtures после сохранения Phase 2 evidence.
- [ ] До отправки prompt установить MutationObserver на видимые assistant text nodes, assistant IDs и user bubble timestamps; включить provider request и durable wire readback.
- [ ] Выполнить positive first-prompt smoke и прочитать экран/log; если основной путь не работает, сначала исправить stand.

### 4.2 Изолированные race/replay варианты

Anchor: `bugs/25` — «next packaged check must observe this exact progress-text → prompt-only steer sequence with DOM mutations».

- [ ] Held first chunk → immediate steering → original late completion: проверить видимый первый chunk, один user steer, один final assistant и один provider action на каждое сообщение.
- [ ] Progress text → prompt-only steer → original completion → новый durable TurnBegin: измерить удаление/замену текста по assistant ID и кадрам.
- [ ] Два последовательных steer и send синхронно с running→idle boundary: отличить product duplicate от лишнего harness send и проверить exactly-once fallback.
- [ ] Reload/history replay после каждого settled сценария: сравнить durable entries, видимый порядок и отсутствие пустого replay кадра.

### 4.3 Дефект либо честное невоспроизведение

Anchor: `bugs/25` — «before changing code» и `BUG_FIXING_FRAMEWORK.md` — targeted changes only after reproduction.

- [ ] Если текст исчезает: приложить кадры до/после, owning event и assistant ID; добавить red-before regression наименьшей public boundary и исправить только подтверждённый механизм.
- [ ] Если текст не исчезает: записать все варианты и отрицательный результат без нового product diff; не объявлять owner symptom опровергнутым.
- [ ] Выполнить TWINS/TWINS-MECH для любого исправления и проверить live adapter, renderer identity, list reset, text replacement и viewport как разные механизмы.

### 4.4 Accumulated main и финальная приёмка

Anchor: `GOAL.md` — «финальная приёмка идёт на моём накопленном профиле VS Code»; `HOUSE_RULES.md` R7.

- [ ] Установить проверенный следующий build на main без перезагрузки активной self-host сессии.
- [ ] Когда вся остальная работа завершена, вызвать владельца мягким голосом для перезапуска VS Code и нового `resume`; не закрывать текущую сессию через Reload Window.
- [ ] На накопленном main повторить first/progress/steer/completion/reload capture; при воспроизведении остановить release и исправить по кадрам.
- [ ] Записать отдельный run report, обновить bugs/issues/STATUS и выполнить `/skill:fable-judge` перед DONE или Phase 4.

## 5. Риски и stop rules

- Никакого `Developer: Reload Window` в основном окне текущей сессии.
- Отсутствие воспроизведения не доказывает отсутствие дефекта; минимум три названных варианта обязательны.
- Не менять assertions или product code ради зелёного isolated результата; harness duplicate сначала исключается по provider evidence.
- Три неудачные fix→build→test итерации одного подтверждённого дефекта вызывают `/skill:bug-research`.
- Audible output и `bugs/46` не входят в эту фазу и сохраняют отдельную оговорку.

## 6. Decisions made without the owner

[AI] by mandate — владелец разрешил анализ, планирование, исправление и итеративное тестирование названных release blockers.

- Фаза начинается с наблюдения на build 55 и не предполагает новый product diff без кадровой причины.
- Manual compaction используется только как уже проверенный queued-state fixture Phase 2, не как замена свежего owner recurrence.
- Accumulated main остаётся обязательной границей, но безопасный перезапуск переносится на конец остальной работы, чтобы не оборвать self-host сессию.
