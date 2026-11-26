# Plan 05 — Epic 04 Phase 1: steering, completion и attention audio

> **Создан:** 2026-11-27
> **Родитель:** `plans/04_EPIC_release_blocker_remediation.md` — «Phase 1 — Steering и attention: `bugs/44`, `bugs/45`, `bugs/46`»
> **Статус:** активен; шаги 4.1–4.2 выполнены на packaged build 49, далее `bugs/45` и `bugs/46` · [TESTED: 2026-11-27 · 52/52 runtime, 664/1 full extension, typecheck/lint/package audit and isolated immediate+queued guest acceptance in `testcases/reports/2026-11-27_steer_completion_attention_build49.md`; accumulated main/audible output not verified]
> **Вовне:** результаты обновляют `bugs/44`–`bugs/46`, их GitHub Issues и `testcases/reports/`; следующий operational plan пишется после закрытия фазы

## 1. Вектор цели

**Achieve.** Принятые immediate и queued steering не создают ложного completion или красного error frame, а каждое attention-уведомление начинается с первого записанного слова.

**Maintain.** Настоящие ошибки остаются видимыми, single-turn completion звучит один раз, replay молчит, пользовательские звуки и исходные MP3 не меняются без доказательства.

**Avoid.** Закрытие кандидата `bugs/44` по unit-тестам, подавление неизвестной ошибки и добавление секунды тишины как слепого workaround.

## 2. Критерии приёмки фазы

- Для accepted running steer существует отдельный regression порядка «accept → старый terminal → новый `turn.started`»; результат на исходном кандидате записан до любой правки.
- Immediate и queued steering на packaged VS Code дают 0 completion/audio во время работы и ровно 1 на genuine idle.
- `bugs/45` имеет захваченные error payload, owning message и DOM insertion/removal; accepted steering не показывает красный кадр, а реальный rejected/failed control показывает настоящую ошибку.
- `bugs/46` имеет first/warmed timelines с `loadstart`, `loadeddata`, `canplay`, `play`, `playing`, `currentTime`, rejection и, где доступно, аудиозаписью вывода.
- Исправления имеют red-before regressions и зелёные affected suites; EN/RU/ZH проверены на packaged audio path в доступном объёме.
- Фаза оставляет отдельные Hygiene/Functional run/REAL WORLD строки и judge verdict. DONE ставится только при выполнении критерия конкретного bug-документа.

## 3. Test basis и существующие артефакты

- `bugs/44_steer_turn_complete_attention.md`, `bugs/45_steer_transient_error_flash.md`, `bugs/46_attention_audio_start_clipped.md`.
- `apps/vscode/test/session-runtime.test.ts`, `event-adapter.test.ts`, `webview/chat-store.test.ts`, `webview/attention.test.ts`, `webview/sounds.test.ts` и owning component suites при захвате ошибки.
- `testcases/reports/2026-11-26_steer_completion_attention.md` и `testcases/TC_K5_live_acceptance.md`.
- `apps/vscode/src/runtime/session-runtime.ts`, `webview-ui/src/stores/chat.store.ts`, `event-handlers.ts`, `webview-ui/src/lib/attention.ts`, `sounds.ts`.
- Изолированный Windows VS Code 1.123.0, fake model и существующий `.tmp/k5-vscode-ui.mjs`; временные probes остаются в `.tmp/`.

## 4. Шаги

### 4.1 Восстановить работающий наблюдаемый контур

Anchor: Epic 04 Phase 1 — «immediate/queued steering и audio прочитаны на реальном VS Code».

- [x] Зафиксировать исходный commit, build 46 и новый isolated profile; завершить старый isolated PID tree, перезапустить и прочитать running build в Action Menu по EXP-0024.
- [x] Не перезагружать основное self-hosting окно. Проверить fake-model positive smoke до steering: prompt → request → rendered response → idle.
- [x] Восстановить guest composer доступ через существующий CDP/UI harness. При повторном outer-only target исправить observation path и записать, что именно видно; не приписывать это продукту.
- [x] Добавить временную регистрацию `new Audio`, `AudioContext`, `play`, `playing`, `currentTime`, `AudioContext.resume/close`, bridge events и DOM error frames.
- [x] Verification: immediate/queued сценарии управляются harness, а их события и видимый DOM читаются в одной временной последовательности.

### 4.2 Закрыть приёмку `bugs/44`

Anchor: Epic 04 Phase 1 — «кандидат `bugs/44` требует реальной приёмки до дальнейшего выпуска».

- [x] В `session-runtime.test.ts` добавить публичный regression: accepted running steer с новым `turnId`, затем terminal старого turn ДО `turn.started` нового. Запустить на неизменённом кандидате и записать фактический результат.
- [x] Если сценарий красный, записать `INTENT:` и исправить только accepted-turn ownership; не менять queued, replay, error и single-turn семантику. Добавить control cases для same-turn steered result и terminal без steering.
- [x] Прогнать targeted runtime/adapter/store/attention suites, затем выполнить real immediate steering: 0 completion при продолжающейся работе, 1 при idle.
- [x] Выполнить accepted queued steering с completion до durable start: 0 completion в ожидании, 1 после queued turn и idle.
- [x] Verification: emitted `stream_complete`, `new Audio`/`AudioContext` и видимый Working/idle state совпадают во всех трёх путях; отчёт отличает звук от DOM-proxy.

### 4.3 Идентифицировать и исправить `bugs/45`

Anchor: Epic 04 Phase 1 — «красный error frame идентифицирован».

- [ ] Повторить immediate, queued и running→idle sends с MutationObserver и bridge/runtime error payload log до изменения продукта.
- [ ] Записать точные code/message/detail/phase/terminal, owning client/turn и первый/последний красный DOM frame. Отдельно выполнить genuine rejected/failed control.
- [ ] Если переход воспроизводится, добавить red-before regression на owning public store/runtime path и внести одну адресную правку после `INTENT:`.
- [ ] Если переход не воспроизводится минимум на трёх названных вариантах, не подавлять ошибки; зафиксировать охоту и перенести захват на накопленный профиль по R7.
- [ ] Verification: accepted immediate/queued не создают красный кадр; genuine failure остаётся видимым с правильным rollback.

### 4.4 Измерить и исправить `bugs/46`

Anchor: Epic 04 Phase 1 — «аудио исправляется только по измеренной причине».

- [ ] На packaged RU `turnComplete.mp3` сравнить first-play после активации и warmed second play того же файла; читать media events, `currentTime`, rejection и фактический аудиовыход при доступном захвате.
- [ ] Повторить EN/ZH и Glass как control; сверить running build и source/installed MP3 hashes.
- [ ] Если подтверждена readiness-гонка, добавить красный regression в `sounds.test.ts` и сравнить readiness-first playback с короткой playback-side задержкой без изменения MP3. Выбрать минимальный механизм по наблюдению и записать `FORK:` с consulted sources.
- [ ] Если источник или lifecycle окажется причиной, исправлять доказанный слой; равномерную секунду тишины не добавлять без отдельного обоснования.
- [ ] Verification: первое слово присутствует на first и warmed play, `play()` rejection не считается успехом, повторные уведомления не обрывают друг друга.

### 4.5 Проверить, задокументировать и закрыть фазу

Anchor: Epic 04 gates — «Каждая фаза оставляет отчёт … обновляет bug-документы и `STATUS.md` … проходит `/skill:fable-judge`».

- [ ] Прогнать affected tests, полный `apps/vscode/test`, `pnpm --filter kimi-code-kaif run typecheck`, `pnpm lint` и packaged win32-x64 build/audit после любых product changes.
- [ ] Записать `testcases/reports/2026-11-27_phase1_steering_attention.md` с командами, моментами, Hygiene, Functional run, Found, Traces, Verdict и REAL WORLD.
- [ ] Обновить `bugs/44`–`bugs/46`, связанные issues, `STATUS.md` и чекбоксы этого плана; DONE-переименование выполнять только при полном доказательстве.
- [ ] Проверить `git status` и фактический outgoing diff, закоммитить и запушить каждый проверенный кусок отдельными действиями.
- [ ] Выполнить `/skill:fable-judge` по claims фазы. Только после VERIFIED или явно принятых caveats написать operational plan Phase 2.

## 5. Риски и stop rules

- Outer-only CDP target — дефект наблюдения до доказанного обратного; не считать продукт зелёным или красным по отсутствию DOM.
- Любой новый running build сначала подтверждается в Action Menu; installed VSIX hash не заменяет эту проверку.
- Три неудачные fix→build→test итерации одного дефекта вызывают `/skill:bug-research`.
- Нельзя скрывать все transient errors, ослаблять tests, использовать sleep для синхронизации или добавлять исходную тишину без измерения.
- Если живой звук нельзя захватить, DOM/media observation и слышимый результат записываются раздельно; DONE без обязательной части не ставится.

## 6. Decisions made without the owner

[AI] by mandate — владелец разрешил планирование и последующее исполнение.

- Phase 1 объединяет три свежих steering/attention дефекта, но каждый сохраняет собственную причину, regression и DONE-критерий.
- Сначала добавляется непокрытый accepted-running-before-start ordering, поскольку текущий candidate suite оставляет это окно неизмеренным.
- Временная инструментация живёт в `.tmp/`; постоянные regressions добавляются только в существующие owning suites.
