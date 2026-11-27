# Plan 06 — Epic 04 Phase 2: пять Act-находок независимого аудита

> **Создан:** 2026-11-27
> **Родитель:** `plans/04_EPIC_release_blocker_remediation.md` — «Phase 2 — Пять Act-находок аудита»
> **Статус:** шаги 4.1–4.2 выполнены, включая multi-item batch path, full 670/1, typecheck/lint/build-53 audit and Extension Host smoke green; `secondary-primary-default`, `sound-default-manifest`, `model-picker-enter-bubbling` и packaged acceptance открыты · [TESTED: 2026-11-27 · 60/60 runtime+controller and 16/16 status pills in `testcases/reports/2026-11-27_phase2_context_queue.md`; packaged guest/main acceptance not verified]
> **Вовне:** каждая находка обновляет audit card, owning bug/issue при наличии, `STATUS.md` и `testcases/reports/`; следующий operational plan пишется после закрытия фазы

## 1. Вектор цели

**Achieve.** Все пять подтверждённых Act-механизмов устранены на owning public boundary с красной до исправления и зелёной после неё проверкой.

**Maintain.** `running | queued | blocked`, old sessions, deliberate primary model/effort changes, persisted sound choices, keyboard/mouse selection, genuine errors and existing queue restoration remain control cases.

**Avoid.** Потерянный context closure, повторная модельная отправка, скрытая смена primary default, неправильные fresh-install sounds и случайный model change через Enter.

## 2. Критерии приёмки фазы

- Context Window Control: два одинаковых blocked force observations вызывают два submissions; поздний accepted результат фиксирует stage один раз.
- Accepted queued steer: completion до durable start вызывает ноль `streamChat`; поздний durable start оставляет exactly one final submission и убирает запись из visible queue.
- Secondary-only save: global B + resumed A + secondary S сохраняет S без изменения primary model или thinking.
- Sound defaults: manifest deep-equals `DEFAULT_SOUND_SETTINGS`; fresh Extension Host читает Glass/Voice/Alert/Chime, существующие пользовательские значения не меняются.
- Model picker: Enter на favorite/provider выполняет только native action; search/list Enter выбирает active row как раньше.
- Все новые проверки красные на исходном коде; affected suites, full extension, typecheck, lint и packaged VSIX paths зелёные. Каждая карточка получает Hygiene и Functional run строки.

## 3. Test basis и существующие артефакты

- Пять family cards в `reports/KAIF_AUDIT/2026-11-26_kimi_krinik_1_0_0_*.md` с точными failure scenarios и «Do not touch».
- `apps/vscode/test/session-runtime.test.ts`, `context-window-control.test.ts`, `bridge-handler.test.ts`, `sounds.test.ts`, `extension-host/index.cjs`, `webview/status-pills.test.tsx`, `webview/model-picker.test.tsx`.
- `apps/vscode/src/runtime/context-window-control.ts`, `session-runtime.ts`, `handlers/config.handler.ts`, `apps/vscode/package.json`, `shared/sounds.ts`, `webview-ui/src/stores/chat.store.ts`, `components/ModelPickerDialog.tsx`.
- Packaged Windows VS Code 1.123.0, fake model и существующий `.tmp/k5-vscode-ui.mjs` / CDP guest harness.

## 4. Шаги

### 4.1 Context blocked retry

Anchor: Epic 04 Phase 2 — «context blocked retry … red-before public-interface regression и packaged-path verification».

- [x] В `Context Window Control runtime delivery` добавить public runtime regression: два одинаковых blocked force observations → две `session.steer` submissions; поздний accepted running → ровно одно дальнейшее принятое действие.
- [x] Запустить на исходном коде и записать, что после первого blocked повторной отправки нет.
- [x] Вернуть `PromptSubmissionResult` из delivery в controller; `said` записывать только после accepted running/queued. Сохранить blocked без успешной отметки, generation reset, coalescing и accepted exactly-once.
- [x] Verification: targeted runtime/controller tests зелёные; реальный SDK/provider boundary подтверждает blocked retry без автоматического resend принятого сообщения.

### 4.2 Accepted queued resubmission

Anchor: Epic 04 Phase 2 — «accepted queued resubmission … red-before public-interface regression».

- [x] В `status-pills.test.tsx` добавить accepted `state: "queued"`: Q1 восстановлен в visible queue, прежний completion наступает до durable start; ожидание не вызывает `streamChat`; поздний `TurnBegin(clientId=q1)` удаляет Q1 и оставляет Q2.
- [x] Запустить на исходном store и зафиксировать повторную `streamChat` отправку Q1.
- [x] Пометить restored accepted item как engine-accepted; automatic selection пропускает его, visible presentation и ручное восстановление rejected/blocked сохраняются. Не использовать timer/idle probe для разрешения неопределённости.
- [x] Verification: accepted item не отправляется повторно, durable promotion удаляет его, rejected items восстанавливаются по исходному индексу, whole-batch draining не сломан.

### 4.3 Secondary primary default

Anchor: Epic 04 Phase 2 — «secondary primary default … red-before public-interface regression».

- [ ] В `bridge-handler.test.ts` смоделировать global B, resumed A и secondary S с `effortChanged:false`; потребовать, что `setConfig`, `setModel` и `setThinking` не вызываются для primary, а S сохраняется.
- [ ] Запустить на исходном handler и зафиксировать запись primary A.
- [ ] Ветвить secondary-only persistence до primary setters, сохранив deliberate primary save и `effortChanged:false` без secondaryModel как control.
- [ ] Verification: primary config остаётся B, secondary S валидно записано, primary runtime A не меняется, ошибка secondary save не оставляет скрытой primary записи.

### 4.4 Sound default manifest

Anchor: Epic 04 Phase 2 — «sound manifest defaults … red-before public-interface regression».

- [ ] В `sounds.test.ts` сравнить `apps/vscode/package.json` `kimi.sounds.default` с `DEFAULT_SOUND_SETTINGS`; в `extension-host/index.cjs` прочитать fresh `workspace.getConfiguration("kimi").get("sounds")`.
- [ ] Запустить на исходном manifest и получить Voice/Voice/Voice/Off вместо Glass/Voice/Alert/Chime.
- [ ] Выровнять manifest и description выборов с shared constant, не меняя normalization, partial-map migration или сохранённые пользовательские настройки.
- [ ] Verification: manifest/shared deep equality и fresh Extension Host defaults зелёные; VSIX несёт те же значения.

### 4.5 Model picker Enter

Anchor: Epic 04 Phase 2 — «model-picker Enter … red-before public-interface regression».

- [ ] В `model-picker.test.tsx` сфокусировать favorite и provider и нажать Enter: currentModel не меняется, диалог остаётся открытым, native favorite/filter action выполняется. Search/list Enter остаётся control.
- [ ] Запустить на исходном компоненте и зафиксировать выбор active row + закрытие диалога.
- [ ] Пропускать nested buttons в dialog-level Enter branch без глобального preventDefault/stopPropagation; mouse и Arrow navigation не менять.
- [ ] Verification: favorite toggles only favorite, provider toggles only filter, currentModel/dialog сохраняются, search/list selection не сломан.

### 4.6 Общая и packaged проверка

Anchor: Epic 04 gates — «affected suites, full extension, typecheck, lint и packaged VSIX paths зелёные».

- [ ] Прогнать affected suites, полный `apps/vscode/test`, `pnpm --filter kimi-code-kaif run typecheck`, `pnpm lint` и win32-x64 package/audit после всех пяти исправлений.
- [ ] Установить следующий build на main и isolated profiles, проверить running build и выполнить реальные fresh defaults, secondary-only, keyboard и queue paths в guest.
- [ ] Записать `testcases/reports/2026-11-27_phase2_act_findings.md` с Hygiene, Functional run, Found, Traces, Verdict и REAL WORLD.
- [ ] Обновить audit cards/`STATUS.md`/issues и чекбоксы плана; затем `/skill:fable-judge` перед commit/push и перед написанием Phase 3.

## 5. Риски и stop rules

- Accepted queued item нельзя скрыть: он остаётся видимым до durable promotion, но не должен стать новым sendable intent.
- Secondary-only нельзя чинить сменой публичного UI payload ради теста: используется существующий `secondaryModel + effortChanged:false` контракт.
- Нельзя менять сохранённые звуки пользователя, слои normalization или keyboard search/list behavior ради зелёного.
- Любой новый regression сначала наблюдается красным; fixture/mock ошибки сначала исправляются как stand defects.
- Три неудачные fix→build→test итерации одной находки вызывают `/skill:bug-research`, а не четвёртую слепую правку.

## 6. Decisions made without the owner

[AI] by mandate — владелец разрешил анализировать, планировать, исправлять и тестировать названные блокеры.

- Пять Act-находки выполняются как одна фаза с отдельными красными границами и evidence на каждую, а не как один общий diff без владельца результата.
- Изменения используют существующие state/config/event contracts; новых RPC, dependencies или архитектурных stores не требуется.
- Packaged acceptance разделяет fresh-profile defaults и накопленный main-profile boundary; DONE не выводится из unit tests.
