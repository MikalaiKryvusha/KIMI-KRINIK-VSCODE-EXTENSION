# Interview #002 — Какие движковые навыки оставить в KIMI KRINIK

> Topic: индивидуальный выбор движковых навыков, которые остаются в KIMI KRINIK
> Source of the idea: owner's direct request in chat, 2026-11-25 21:54 +03:00
> Created: 2026-11-25 21:54 +03:00
> Status: **✅ ANSWERS RECEIVED 2026-11-25 22:01 +03:00 — Q1–Q5 keep fully English; Q6–Q9 remove from KIMI KRINIK; implementation in progress**

## Что обнаружено в исходниках

В движке сейчас девять навыков. Все их исходные описания уже на английском языке. Китайский `review-duplication` находится отдельно в `.agents/skills` и удаляется независимо от этих решений.

| # | Навык | Краткое описание |
|---|---|---|
| 1 | `check-kimi-code-docs` | Отвечает на вопросы о Kimi Code по официальной документации: настройка, команды, возможности, тарифы, API и коды ошибок. |
| 2 | `update-config` | Проверяет и изменяет `config.toml` и `tui.toml`: модели, провайдеры, разрешения, хуки, тему, редактор, уведомления и автообновление. |
| 3 | `write-goal` | Помогает составить точную цель для режима Goal: конечный результат, доказательства, границы и правило остановки. |
| 4 | `mcp-config` | Настраивает MCP-серверы в `mcp.json` и выполняет OAuth-вход на сервер, который запросил авторизацию. |
| 5 | `import-from-cc-codex` | Переносит выбранные инструкции, навыки и MCP-настройки из Claude Code и Codex после предварительного просмотра и подтверждения. |
| 6 | `custom-theme` | Создаёт и изменяет пользовательскую JSON-тему цветов для терминального интерфейса Kimi Code. |
| 7 | `sub-skill` | Анализирует каталог навыков и реорганизует его в иерархические наборы с дочерними навыками. |
| 8 | `sub-skill.review` | Только читает каталог навыков и предлагает группы для объединения; файлы не перемещает. |
| 9 | `sub-skill.consolidate` | После подтверждения перемещает навыки в родительский набор и сохраняет резервные копии изменённых каталогов. |

Источники: `packages/agent-core-v2/src/features/skill/catalog/builtin/` — `check-kimi-code-docs.md`, `update-config.md`, `write-goal.md`, `mcp-config.md`, `import-from-cc-codex.md`, `custom-theme.md`, `sub-skill/SKILL.md`, `sub-skill/review/SKILL.md`, `sub-skill/consolidate/SKILL.md`.

## QUESTIONS

### Q1. `check-kimi-code-docs`: ответы по официальной документации Kimi Code

Отвечает на вопросы о настройке, командах, возможностях, тарифах, API и ошибках Kimi Code, обращаясь к официальной документации.

<!-- archaeology: search "движков|навык|kimi|krini|остави|удали" → 37 hits · read: GOAL.md, STATUS.md, HOUSE_RULES.md, ideas/02_control_panel_skill_picker.md, interviews/interview_001_kimi_krinik_1_0_0_release.md · prior: unrelated — earlier hits contain no per-skill decision -->

- **A) (Рекомендовано) Оставить, гарантировать полностью английский текст**
  - Situation. Навык уже есть в движке и его исходник английский.
  - Action. Выбираешь A.
  - Result. Навык остаётся в KIMI KRINIK; проверяются его описание и материалы, весь текст остаётся английским.
  - Check. В итоговом списке есть `check-kimi-code-docs`.
- **B) Удалить из KIMI KRINIK**
  - Situation. Навык больше не нужен в продукте.
  - Action. Выбираешь B.
  - Result. Навык исключается из движка KIMI KRINIK и окна «Навык».
  - Check. В итоговом списке нет `check-kimi-code-docs`.
- **D) your own answer** — напиши свой вариант здесь

**Answer:** A) <!-- owner-review: by Mikalai Kryvusha · 25 ноября 2026, 22:01 (+03:00) -->

### Q2. `update-config`: настройка файлов конфигурации Kimi Code

Проверяет и изменяет модели, провайдеры, разрешения, хуки, тему, редактор, уведомления и автообновление в `config.toml` и `tui.toml`.

<!-- archaeology: search "движков|навык|kimi|krini|остави|удали" → 37 hits · read: GOAL.md, STATUS.md, HOUSE_RULES.md, ideas/02_control_panel_skill_picker.md, interviews/interview_001_kimi_krinik_1_0_0_release.md · prior: unrelated — earlier hits contain no per-skill decision -->

- **A) (Рекомендовано) Оставить, гарантировать полностью английский текст**
  - Situation. Навык уже есть в движке и его исходник английский.
  - Action. Выбираешь A.
  - Result. Навык остаётся в KIMI KRINIK; проверяются его описание и материалы, весь текст остаётся английским.
  - Check. В итоговом списке есть `update-config`.
- **B) Удалить из KIMI KRINIK**
  - Situation. Навык больше не нужен в продукте.
  - Action. Выбираешь B.
  - Result. Навык исключается из движка KIMI KRINIK и окна «Навык».
  - Check. В итоговом списке нет `update-config`.
- **D) your own answer** — напиши свой вариант здесь

**Answer:** A) <!-- owner-review: by Mikalai Kryvusha · 25 ноября 2026, 22:01 (+03:00) -->

### Q3. `write-goal`: помощь в формулировке цели для режима Goal

Помогает превратить намерение в цель с конечным результатом, проверяемыми доказательствами, границами работы и правилом остановки.

<!-- archaeology: search "движков|навык|kimi|krini|остави|удали" → 37 hits · read: GOAL.md, STATUS.md, HOUSE_RULES.md, ideas/02_control_panel_skill_picker.md, interviews/interview_001_kimi_krinik_1_0_0_release.md · prior: unrelated — earlier hits contain no per-skill decision -->

- **A) (Рекомендовано) Оставить, гарантировать полностью английский текст**
  - Situation. Навык уже есть в движке и связан с имеющимся режимом Goal.
  - Action. Выбираешь A.
  - Result. Навык остаётся в KIMI KRINIK; проверяются его описание и материалы, весь текст остаётся английским.
  - Check. В итоговом списке есть `write-goal`.
- **B) Удалить из KIMI KRINIK**
  - Situation. Помощь в составлении цели не нужна.
  - Action. Выбираешь B.
  - Result. Навык исключается из движка KIMI KRINIK и окна «Навык»; сам режим Goal этим решением не удаляется.
  - Check. В итоговом списке нет `write-goal`.
- **D) your own answer** — напиши свой вариант здесь

**Answer:** A) <!-- owner-review: by Mikalai Kryvusha · 25 ноября 2026, 22:01 (+03:00) -->

### Q4. `mcp-config`: MCP-серверы и OAuth-вход

Настраивает записи MCP-серверов в `mcp.json` и проводит OAuth-вход на сервер, который запросил авторизацию.

<!-- archaeology: search "движков|навык|kimi|krini|остави|удали" → 37 hits · read: GOAL.md, STATUS.md, HOUSE_RULES.md, ideas/02_control_panel_skill_picker.md, interviews/interview_001_kimi_krinik_1_0_0_release.md · prior: unrelated — earlier hits contain no per-skill decision -->

- **A) (Рекомендовано) Оставить, гарантировать полностью английский текст**
  - Situation. Навык уже есть в движке и связан с имеющимся экраном MCP.
  - Action. Выбираешь A.
  - Result. Навык остаётся в KIMI KRINIK; проверяются его описание и материалы, весь текст остаётся английским.
  - Check. В итоговом списке есть `mcp-config`.
- **B) Удалить из KIMI KRINIK**
  - Situation. Настройка MCP через этот навык не нужна.
  - Action. Выбираешь B.
  - Result. Навык исключается из движка KIMI KRINIK и окна «Навык»; экран MCP этим решением не удаляется.
  - Check. В итоговом списке нет `mcp-config`.
- **D) your own answer** — напиши свой вариант здесь

**Answer:** A) <!-- owner-review: by Mikalai Kryvusha · 25 ноября 2026, 22:01 (+03:00) -->

### Q5. `import-from-cc-codex`: перенос настроек из Claude Code и Codex

Показывает, какие инструкции, навыки и MCP-настройки можно перенести из Claude Code и Codex, и записывает их только после подтверждения.

<!-- archaeology: search "движков|навык|kimi|krini|остави|удали" → 37 hits · read: GOAL.md, STATUS.md, HOUSE_RULES.md, ideas/02_control_panel_skill_picker.md, interviews/interview_001_kimi_krinik_1_0_0_release.md · prior: unrelated — earlier hits contain no per-skill decision -->

- **A) (Рекомендовано) Оставить, гарантировать полностью английский текст**
  - Situation. Навык помогает новому пользователю перейти из Claude Code или Codex.
  - Action. Выбираешь A.
  - Result. Навык остаётся в KIMI KRINIK; проверяются его описание и материалы, весь текст остаётся английским.
  - Check. В итоговом списке есть `import-from-cc-codex`.
- **B) Удалить из KIMI KRINIK**
  - Situation. Перенос из Claude Code и Codex не нужен.
  - Action. Выбираешь B.
  - Result. Навык исключается из движка KIMI KRINIK и окна «Навык».
  - Check. В итоговом списке нет `import-from-cc-codex`.
- **D) your own answer** — напиши свой вариант здесь

**Answer:** A) <!-- owner-review: by Mikalai Kryvusha · 25 ноября 2026, 22:01 (+03:00) -->

### Q6. `custom-theme`: пользовательские цветовые темы терминала

Создаёт и изменяет JSON-файл пользовательской цветовой темы для терминального интерфейса Kimi Code.

<!-- archaeology: search "движков|навык|kimi|krini|остави|удали" → 37 hits · read: GOAL.md, STATUS.md, HOUSE_RULES.md, ideas/02_control_panel_skill_picker.md, interviews/interview_001_kimi_krinik_1_0_0_release.md · prior: unrelated — earlier hits contain no per-skill decision -->

- **A) (Рекомендовано) Удалить из KIMI KRINIK**
  - Situation. Навык настраивает терминальный интерфейс, а не окно расширения VS Code.
  - Action. Выбираешь A.
  - Result. Навык исключается из движка KIMI KRINIK и окна «Навык».
  - Check. В итоговом списке нет `custom-theme`.
- **B) Оставить, гарантировать полностью английский текст**
  - Situation. Настройка тем терминала нужна и в KIMI KRINIK.
  - Action. Выбираешь B.
  - Result. Навык остаётся; его описание и материалы проверяются как полностью английские.
  - Check. В итоговом списке есть `custom-theme`.
- **D) your own answer** — напиши свой вариант здесь

**Answer:** A) <!-- owner-review: by Mikalai Kryvusha · 25 ноября 2026, 22:01 (+03:00) -->

### Q7. `sub-skill`: контейнер для реорганизации каталога навыков

Анализирует навыки и объединяет их в иерархические наборы с дочерними элементами.

<!-- archaeology: search "движков|навык|kimi|krini|остави|удали" → 37 hits · read: GOAL.md, STATUS.md, HOUSE_RULES.md, ideas/02_control_panel_skill_picker.md, interviews/interview_001_kimi_krinik_1_0_0_release.md · prior: unrelated — earlier hits contain no per-skill decision -->

- **A) (Рекомендовано) Удалить из KIMI KRINIK**
  - Situation. KAIF уже имеет собственную организацию навыков.
  - Action. Выбираешь A.
  - Result. Контейнер `sub-skill` исключается из движка KIMI KRINIK и окна «Навык».
  - Check. В итоговом списке нет `sub-skill`.
- **B) Оставить, гарантировать полностью английский текст**
  - Situation. Реорганизация навыков в иерархию нужна в продукте.
  - Action. Выбираешь B.
  - Result. Контейнер остаётся; его описание и материалы проверяются как полностью английские.
  - Check. В итоговом списке есть `sub-skill`.
- **D) your own answer** — напиши свой вариант здесь

**Answer:** A) <!-- owner-review: by Mikalai Kryvusha · 25 ноября 2026, 22:01 (+03:00) -->

### Q8. `sub-skill.review`: предложение групп навыков без изменения файлов

Читает каталог и предлагает, какие навыки можно объединить в группы; ничего не перемещает.

<!-- archaeology: search "движков|навык|kimi|krini|остави|удали" → 37 hits · read: GOAL.md, STATUS.md, HOUSE_RULES.md, ideas/02_control_panel_skill_picker.md, interviews/interview_001_kimi_krinik_1_0_0_release.md · prior: unrelated — earlier hits contain no per-skill decision -->

- **A) (Рекомендовано) Удалить из KIMI KRINIK**
  - Situation. Это дочерняя часть движковой реорганизации навыков.
  - Action. Выбираешь A.
  - Result. `sub-skill.review` исключается из движка KIMI KRINIK и окна «Навык».
  - Check. В итоговом списке нет `sub-skill.review`.
- **B) Оставить, гарантировать полностью английский текст**
  - Situation. Read-only анализ групп навыков нужен в продукте.
  - Action. Выбираешь B.
  - Result. Дочерний навык остаётся; его описание и материалы проверяются как полностью английские.
  - Check. В итоговом списке есть `sub-skill.review`.
- **D) your own answer** — напиши свой вариант здесь

**Answer:** A) <!-- owner-review: by Mikalai Kryvusha · 25 ноября 2026, 22:01 (+03:00) -->

### Q9. `sub-skill.consolidate`: перемещение навыков в утверждённую группу

После подтверждения перемещает каталоги навыков в родительскую группу и создаёт резервные копии.

<!-- archaeology: search "движков|навык|kimi|krini|остави|удали" → 37 hits · read: GOAL.md, STATUS.md, HOUSE_RULES.md, ideas/02_control_panel_skill_picker.md, interviews/interview_001_kimi_krinik_1_0_0_release.md · prior: unrelated — earlier hits contain no per-skill decision -->

- **A) (Рекомендовано) Удалить из KIMI KRINIK**
  - Situation. Это дочерняя часть движковой реорганизации навыков.
  - Action. Выбираешь A.
  - Result. `sub-skill.consolidate` исключается из движка KIMI KRINIK и окна «Навык».
  - Check. В итоговом списке нет `sub-skill.consolidate`.
- **B) Оставить, гарантировать полностью английский текст**
  - Situation. Перемещение навыков по утверждённому плану нужно в продукте.
  - Action. Выбираешь B.
  - Result. Дочерний навык остаётся; его описание и материалы проверяются как полностью английские.
  - Check. В итоговом списке есть `sub-skill.consolidate`.
- **D) your own answer** — напиши свой вариант здесь

**Answer:** A) <!-- owner-review: by Mikalai Kryvusha · 25 ноября 2026, 22:01 (+03:00) -->

## Применение решений

1. `review-duplication` удаляется из `.agents/skills` независимо от ответов выше.
2. Каждый выбранный к сохранению движковый навык проверяется как полностью английский, включая описание и вложенные материалы.
3. Невыбранные движковые навыки исключаются из KIMI KRINIK; KAIF-навыки в `.kimi-code/skills` сохраняются.
