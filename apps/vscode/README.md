# KIMI KRINIK

<p align="center"><img src="https://raw.githubusercontent.com/MikalaiKryvusha/KIMI-KRINIK-VSCODE-EXTENSION/main/apps/vscode/resources/krinik-robot-logo.png" width="240" alt="KIMI KRINIK robot"></p>

KIMI KRINIK gives you control over long agent work, prevents follow-ups from being lost, and tells you when attention is needed. Its customizable Control Panel, independent context management and three-language interface build on the official Kimi Code engine.

This application is available in English, Russian and Chinese.

[English](#english) · [Русский](#russian) · [中文](#chinese)

<a name="english"></a>

## Features

- **Context control.** When a conversation approaches its limit, KIMI KRINIK warns you early and helps you continue in a new chat without losing the thread. Turn automatic compaction off and keep manual `/compact`.
- **Immediate or queued follow-ups.** Keep writing while the agent works: your message and attachments appear immediately and arrive once, or wait in order when you prefer a queue.
- **Reliable conversation history.** Reopen earlier conversations with text, attachments and order intact, without blank frames or unrelated deletions.
- **Sticky prompts.** Keep the prompt that owns the visible response at the top. Expand full text and media with synchronized bubble/container animation and without losing the reading position.
- **Per-text actions.** Copy one adjacent assistant text item or fork the conversation from that point.
- **Customizable Control Panel.** Hide buttons without disabling their features, change their order, and use real Plan, Goal, Swarm, Skill and secondary-model controls.
- **Pointer controls.** See the pointer cursor on eight chat controls: Add file or media, History, Settings gear, Send, Stop, Session, Create new chat and floating scroll-to-bottom.
- **Models and effort.** Use one picker for model and reasoning effort, with search, favorites and session-specific restored values.
- **Sounds and voice.** Configure a sound and volume for approvals, questions, errors and turn completion. Use packaged clips in English, Russian and Chinese; replay stays silent.
- **KIMI KRINIK identity.** Use the pink robot in responses and its thick-outlined, clipped-corner shape in the VS Code Activity Bar. Read the version and build number in Action Menu.

## Install

KIMI KRINIK requires VS Code 1.100.0 or later and a Kimi Code account or a provider already configured in the shared `config.toml`.

Install the extension from its Visual Studio Marketplace page or download a package from [GitHub Releases](https://github.com/MikalaiKryvusha/KIMI-KRINIK-VSCODE-EXTENSION/releases) and choose **Extensions → ⋯ → Install from VSIX…**.

Open a folder, select the KIMI KRINIK robot in the Activity Bar and sign in. The extension installs beside the official Kimi Code and KIMI FORK extensions with its own extension ID. Projects and sessions stay in place.

## Sessions and configuration

When VS Code and the Kimi Code terminal app resolve to the same `KIMI_CODE_HOME`, they share configuration, login state and sessions. Do not run the same session in both applications at the same time: cross-process session locking is not guaranteed.

The `KIMI_CODE_HOME` system environment variable selects a different data home. Migrating legacy data from `~/.kimi` to `~/.kimi-code` requires fresh authorization for legacy Kimi Code OAuth and MCP OAuth credentials.

## Known issues

Some reported issues remain open in [GitHub Issues](https://github.com/MikalaiKryvusha/KIMI-KRINIK-VSCODE-EXTENSION/issues). They are not represented as fixed and will be addressed in future releases.

## Support, credits and license

Kimi account and provider data processing is governed by the [Kimi Privacy Policy](https://www.kimi.com/user/agreement/userPrivacy?version=v2).

Use [GitHub Issues](https://github.com/MikalaiKryvusha/KIMI-KRINIK-VSCODE-EXTENSION/issues) for defects and questions. Read [the changelog](CHANGELOG.md) for KIMI KRINIK releases.

KIMI KRINIK uses the [official Kimi Code engine and monorepo](https://github.com/MoonshotAI/kimi-code) and adapts interface ideas from [KIMI FORK](https://github.com/gxgleo67/kimi-code-vscode-fork). See [THIRD_PARTY_NOTICES](THIRD_PARTY_NOTICES.md) for attribution.

The extension is licensed under [Apache-2.0](LICENSE.txt).

---

<a name="russian"></a>

# KIMI KRINIK

KIMI KRINIK помогает не потерять управление над длинной работой агента, продолжать разговор без пропавших сообщений и вовремя узнавать, что нужен ответ. В нём официальный движок Kimi Code соединён с настраиваемой Панелью Управления, собственным управлением контекстом и интерфейсом на трёх языках.

[English](#english) · [Русский](#russian) · [中文](#chinese)

## Возможности

- **Контроль контекста.** Когда разговор приближается к пределу, KIMI KRINIK заранее предупреждает и помогает продолжить обсуждение в новом чате без потери нити. Автоматическое сжатие выключается, ручной `/compact` остаётся доступным.
- **Дополнения сразу или через очередь.** Продолжайте писать, пока агент работает: сообщение с вложениями сразу появляется и доходит один раз. Если нужна очередь, сообщения ждут своей очереди и отправляются по порядку.
- **Сохранность истории.** Ранние разговоры открываются с текстом, вложениями и порядком сообщений без пустых кадров и удаления не связанных с ошибкой записей.
- **Закреплённый запрос.** Запрос, которому принадлежит видимый ответ, остаётся вверху. Полный текст и медиа раскрываются с синхронной анимацией пузыря и контейнера, позиция чтения сохраняется.
- **Действия с каждым блоком.** Copy копирует только соседний текстовый блок агента, а Fork создаёт новый разговор с этой точки.
- **Настраиваемая Control Panel.** Галочки скрывают кнопки без отключения функций. Порядок кнопок меняется, а Plan, Goal, Swarm, Skill и дополнительная модель выполняют реальные действия.
- **Курсор-указатель.** При наведении на восемь кнопок чата — «Добавить файл или медиа», «История», «Шестерёнка настроек», «Отправить сообщение», «Остановить агента», «Сессия», «Создать новый чат» и плавающую кнопку прокрутки вниз — появляется курсор-указатель.
- **Модель и рассуждения.** Одно меню объединяет выбор модели и уровня рассуждений, поиск и избранное. Восстановленная сессия сохраняет собственный уровень.
- **Звуки и голос.** Для одобрений, вопросов, ошибок и завершения задачи настраиваются звук и громкость. Готовые записи есть на английском, русском и китайском; восстановление истории не озвучивается.
- **Идентичность KIMI KRINIK.** В ответах показывается розовый робот, а на Activity Bar — его контурный силуэт со срезанными уголками. В Action Menu видны версия и номер билда.

## Установка

Нужны VS Code 1.100.0 или новее и учётная запись Kimi Code либо провайдер, уже настроенный в общем `config.toml`.

Установите расширение со страницы Visual Studio Marketplace или скачайте пакет из [GitHub Releases](https://github.com/MikalaiKryvusha/KIMI-KRINIK-VSCODE-EXTENSION/releases) и выберите **Extensions → ⋯ → Install from VSIX…**.

Откройте папку, выберите робота KIMI KRINIK на Activity Bar и войдите в аккаунт. Расширение имеет собственный ID и устанавливается рядом с официальным Kimi Code и KIMI FORK. Проекты и сессии сохраняются.

## Сессии и конфигурация

Если VS Code и терминальное приложение Kimi Code используют один `KIMI_CODE_HOME`, они делят конфигурацию, вход и сессии. Не работайте с одной сессией в обоих приложениях одновременно: блокировки между процессами не гарантируются.

Системная переменная `KIMI_CODE_HOME` выбирает другой каталог данных. При переносе данных из `~/.kimi` в `~/.kimi-code` старые Kimi Code OAuth и MCP OAuth требуют новой авторизации.

## Известные проблемы

Часть сообщённых проблем остаётся открытой в [GitHub Issues](https://github.com/MikalaiKryvusha/KIMI-KRINIK-VSCODE-EXTENSION/issues). Мы не заявляем их как исправленные и продолжим работу над ними в следующих версиях.

## Поддержка, основа и лицензия

Обработка данных аккаунта Kimi и провайдера регулируется [политикой конфиденциальности Kimi](https://www.kimi.com/user/agreement/userPrivacy?version=v2).

Для дефектов и вопросов используйте [GitHub Issues](https://github.com/MikalaiKryvusha/KIMI-KRINIK-VSCODE-EXTENSION/issues). Релизы KIMI KRINIK записаны в [журнал изменений](CHANGELOG.md).

KIMI KRINIK использует [официальный движок и монорепо Kimi Code](https://github.com/MoonshotAI/kimi-code) и адаптирует идеи интерфейса из [KIMI FORK](https://github.com/gxgleo67/kimi-code-vscode-fork). Атрибуция находится в [THIRD_PARTY_NOTICES](THIRD_PARTY_NOTICES.md).

Расширение распространяется по лицензии [Apache-2.0](LICENSE.txt).

---

<a name="chinese"></a>

# KIMI KRINIK

KIMI KRINIK 帮助你掌控长时间的智能体工作、继续对话而不丢失消息，并在需要回应时及时收到提醒。它将官方 Kimi Code 引擎、可定制的 Control Panel、独立上下文管理和三语言界面结合在一起。

[English](#english) · [Русский](#russian) · [中文](#chinese)

## 功能

- **上下文控制。** 当对话接近上限时，KIMI KRINIK 会提前提醒，并帮助你在新聊天中继续讨论而不丢失脉络。可关闭自动压缩，同时保留手动 `/compact`。
- **立即或排队追加消息。** 在智能体工作时继续输入：消息及附件立即显示并只送达一次；需要排队时，消息按顺序等待发送。
- **可靠的会话历史。** 重新打开早期对话时，文本、附件和消息顺序保持完整，不会出现空白帧或无关记录被删除。
- **置顶用户消息。** 当前可见回复所属的用户消息保持在顶部。展开全文与媒体时，气泡和外部容器同步运动，并保留阅读位置。
- **逐文本块操作。** Copy 仅复制相邻的助手文本块，Fork 从该位置创建新会话。
- **可定制的 Control Panel。** 隐藏按钮时保留对应功能，并可调整按钮顺序。Plan、Goal、Swarm、Skill 和次级模型均执行真实操作。
- **指针光标。** 鼠标悬停在八个聊天按钮（添加文件或媒体、历史记录、设置齿轮、发送消息、停止 AI 智能体、会话、创建新聊天和浮动滚动到底部按钮）上时显示指针光标。
- **模型与推理强度。** 在同一个选择器中搜索和收藏模型、选择推理强度；恢复的会话保留自己的设置。
- **声音与语音。** 为审批、问题、错误和任务完成设置声音与音量。提供英语、俄语和中文的内置录音；恢复历史时保持静音。
- **KIMI KRINIK 标识。** 回复中使用粉色机器人，Activity Bar 使用带切角的粗轮廓机器人。Action Menu 显示版本与构建号。

## 安装

需要 VS Code 1.100.0 或更高版本，以及 Kimi Code 账户或在共享 `config.toml` 中配置的供应商。

从 Visual Studio Marketplace 页面安装扩展，或从 [GitHub Releases](https://github.com/MikalaiKryvusha/KIMI-KRINIK-VSCODE-EXTENSION/releases) 下载软件包并选择 **Extensions → ⋯ → Install from VSIX…**。

打开文件夹，选择 Activity Bar 中的 KIMI KRINIK 机器人并登录。扩展使用独立的扩展 ID，可与官方 Kimi Code 和 KIMI FORK 并存，项目与会话保持不变。

## 会话与配置

当 VS Code 和 Kimi Code 终端应用使用同一个 `KIMI_CODE_HOME` 时，它们共享配置、登录状态和会话。请勿在两个应用中同时运行同一会话：无法保证跨进程会话锁定。

系统环境变量 `KIMI_CODE_HOME` 用于选择其他数据目录。从 `~/.kimi` 向 `~/.kimi-code` 迁移旧数据后，旧的 Kimi Code OAuth 和 MCP OAuth 凭据需要重新授权。

## 已知问题

部分已报告的问题仍在 [GitHub Issues](https://github.com/MikalaiKryvusha/KIMI-KRINIK-VSCODE-EXTENSION/issues) 中保持开放。我们不会将这些问题视为已修复，并将在后续版本中继续处理。

## 支持、基础与许可证

Kimi 账户和供应商的数据处理受 [Kimi 隐私政策](https://www.kimi.com/user/agreement/userPrivacy?version=v2) 约束。

通过 [GitHub Issues](https://github.com/MikalaiKryvusha/KIMI-KRINIK-VSCODE-EXTENSION/issues) 报告问题或提问。KIMI KRINIK 的发布记录见[更新日志](CHANGELOG.md)。

KIMI KRINIK 使用[官方 Kimi Code 引擎与 monorepo](https://github.com/MoonshotAI/kimi-code)，并借鉴 [KIMI FORK](https://github.com/gxgleo67/kimi-code-vscode-fork) 的界面设计。署名信息见 [THIRD_PARTY_NOTICES](THIRD_PARTY_NOTICES.md)。

扩展采用 [Apache-2.0](LICENSE.txt) 许可证。
