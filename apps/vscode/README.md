# KIMI KRINIK

<p align="center"><img src="https://raw.githubusercontent.com/MikalaiKryvusha/KIMI-KRINIK-VSCODE-EXTENSION/main/apps/vscode/resources/krinik-robot-logo.png" width="240" alt="KIMI KRINIK robot"></p>

KIMI KRINIK is an independent VS Code extension for the Kimi agent. It combines the official Kimi Code engine with a customizable control panel, independent context management and a three-language interface.

This application is available in English, Russian and Chinese.

[English](#english) · [Русский](#russian) · [中文](#chinese)

<a name="english"></a>

## Features

- **Context control.** Turn automatic compaction off, including an operation already in progress, and keep manual `/compact`. Configure four Context Window Control thresholds without requiring KAIF.
- **Immediate or queued follow-ups.** With Steer ON, a message and its attachments join the running turn. With Steer OFF, messages wait in the ordinary queue and drain in order.
- **Reliable conversation history.** Preserve multiline prompts, attachments, turn identity and unrelated history during steering, replay and request-setup failures.
- **Sticky prompts.** Keep the prompt that owns the visible response at the top. Expand full text and media with synchronized bubble/container animation and without losing the reading position.
- **Per-text actions.** Copy one adjacent assistant text item or fork the conversation from that point.
- **Customizable Control Panel.** Hide buttons without disabling their features, change their order, and use real Plan, Goal, Swarm, Skill and secondary-model controls.
- **Models and effort.** Use one picker for model and reasoning effort, with search, favorites and session-specific restored values.
- **Sounds and voice.** Configure a sound and volume for approvals, questions, errors and turn completion. Use packaged clips in English, Russian and Chinese; replay stays silent.
- **KIMI KRINIK identity.** Use the pink robot in responses and its thick-outlined, clipped-corner shape in the VS Code Activity Bar. Read the version and build number in Action Menu.

## Install

KIMI KRINIK requires VS Code 1.100.0 or later and a Kimi Code account or a provider already configured in the shared `config.toml`.

Install the extension from its Visual Studio Marketplace page or download a package from [GitHub Releases](https://github.com/MikalaiKryvusha/KIMI-KRINIK-VSCODE-EXTENSION/releases) and choose **Extensions → ⋯ → Install from VSIX…**.

Open a folder, select the KIMI KRINIK robot in the Activity Bar and sign in. The extension installs beside the official Kimi Code and KIMI FORK extensions with its own extension ID. Projects and sessions stay in place.

## Sessions and configuration

When VS Code and the Kimi Code terminal app resolve to the same `KIMI_CODE_HOME`, they share configuration, login state and sessions. Do not run the same session in both applications at the same time: cross-process session locking is not guaranteed.

The `KIMI_CODE_HOME` system environment variable selects a different data home. Legacy Kimi Code OAuth and MCP OAuth credentials require fresh authorization after migration.

## Support, credits and license

Use [GitHub Issues](https://github.com/MikalaiKryvusha/KIMI-KRINIK-VSCODE-EXTENSION/issues) for defects and questions. Read [the changelog](CHANGELOG.md) for KIMI KRINIK releases.

KIMI KRINIK uses the [official Kimi Code engine and monorepo](https://github.com/MoonshotAI/kimi-code) and adapts interface ideas from [KIMI FORK](https://github.com/gxgleo67/kimi-code-vscode-fork). See [THIRD_PARTY_NOTICES](THIRD_PARTY_NOTICES.md) for attribution.

The extension is licensed under [Apache-2.0](LICENSE.txt).

---

<a name="russian"></a>

# KIMI KRINIK

KIMI KRINIK — самостоятельное расширение VS Code для агента Kimi. В нём официальный движок Kimi Code соединён с настраиваемой Панелью Управления, собственным управлением контекстом и интерфейсом на трёх языках.

[English](#english) · [Русский](#russian) · [中文](#chinese)

## Возможности

- **Контроль контекста.** Автоматическое сжатие выключается, включая уже идущую операцию; ручной `/compact` остаётся доступным. Четыре порога Контроля Контекстного Окна настраиваются без обязательного KAIF.
- **Дополнения сразу или через очередь.** При включённом Стиринге сообщение с вложениями сразу попадает в текущий ход. При выключенном сообщения ждут в обычной очереди и отправляются по порядку.
- **Сохранность истории.** Ручные переносы строк, вложения, идентичность хода и не связанные с ошибкой сообщения сохраняются при стиринге, восстановлении истории и ошибках подготовки запроса.
- **Закреплённый запрос.** Запрос, которому принадлежит видимый ответ, остаётся вверху. Полный текст и медиа раскрываются с синхронной анимацией пузыря и контейнера, позиция чтения сохраняется.
- **Действия с каждым блоком.** Copy копирует только соседний текстовый блок агента, а Fork создаёт новый разговор с этой точки.
- **Настраиваемая Control Panel.** Галочки скрывают кнопки без отключения функций. Порядок кнопок меняется, а Plan, Goal, Swarm, Skill и дополнительная модель выполняют реальные действия.
- **Модель и рассуждения.** Одно меню объединяет выбор модели и уровня рассуждений, поиск и избранное. Восстановленная сессия сохраняет собственный уровень.
- **Звуки и голос.** Для одобрений, вопросов, ошибок и завершения задачи настраиваются звук и громкость. Готовые записи есть на английском, русском и китайском; восстановление истории не озвучивается.
- **Идентичность KIMI KRINIK.** В ответах показывается розовый робот, а на Activity Bar — его контурный силуэт со срезанными уголками. В Action Menu видны версия и номер билда.

## Установка

Нужны VS Code 1.100.0 или новее и учётная запись Kimi Code либо провайдер, уже настроенный в общем `config.toml`.

Установите расширение со страницы Visual Studio Marketplace или скачайте пакет из [GitHub Releases](https://github.com/MikalaiKryvusha/KIMI-KRINIK-VSCODE-EXTENSION/releases) и выберите **Extensions → ⋯ → Install from VSIX…**.

Откройте папку, выберите робота KIMI KRINIK на Activity Bar и войдите в аккаунт. Расширение имеет собственный ID и устанавливается рядом с официальным Kimi Code и KIMI FORK. Проекты и сессии сохраняются.

## Сессии и конфигурация

Если VS Code и терминальное приложение Kimi Code используют один `KIMI_CODE_HOME`, они делят конфигурацию, вход и сессии. Не работайте с одной сессией в обоих приложениях одновременно: блокировки между процессами не гарантируются.

Системная переменная `KIMI_CODE_HOME` выбирает другой каталог данных. После миграции старые Kimi Code OAuth и MCP OAuth требуют новой авторизации.

## Поддержка, основа и лицензия

Для дефектов и вопросов используйте [GitHub Issues](https://github.com/MikalaiKryvusha/KIMI-KRINIK-VSCODE-EXTENSION/issues). Релизы KIMI KRINIK записаны в [журнал изменений](CHANGELOG.md).

KIMI KRINIK использует [официальный движок и монорепо Kimi Code](https://github.com/MoonshotAI/kimi-code) и адаптирует идеи интерфейса из [KIMI FORK](https://github.com/gxgleo67/kimi-code-vscode-fork). Атрибуция находится в [THIRD_PARTY_NOTICES](THIRD_PARTY_NOTICES.md).

Расширение распространяется по лицензии [Apache-2.0](LICENSE.txt).

---

<a name="chinese"></a>

# KIMI KRINIK

KIMI KRINIK 是用于 Kimi 智能体的独立 VS Code 扩展，将官方 Kimi Code 引擎、可定制的 Control Panel、独立上下文管理和三语言界面结合在一起。

[English](#english) · [Русский](#russian) · [中文](#chinese)

## 功能

- **上下文控制。** 可关闭自动压缩，包括正在进行的操作，同时保留手动 `/compact`。无需 KAIF 即可配置四个上下文窗口控制阈值。
- **立即或排队追加消息。** Steer 开启时，消息及附件立即加入当前轮次；关闭时，消息进入普通队列并按顺序发送。
- **可靠的会话历史。** 在 steering、历史恢复和请求准备失败时，保留多行消息、附件、轮次身份及无关历史。
- **置顶用户消息。** 当前可见回复所属的用户消息保持在顶部。展开全文与媒体时，气泡和外部容器同步运动，并保留阅读位置。
- **逐文本块操作。** Copy 仅复制相邻的助手文本块，Fork 从该位置创建新会话。
- **可定制的 Control Panel。** 隐藏按钮时保留对应功能，并可调整按钮顺序。Plan、Goal、Swarm、Skill 和次级模型均执行真实操作。
- **模型与推理强度。** 在同一个选择器中搜索和收藏模型、选择推理强度；恢复的会话保留自己的设置。
- **声音与语音。** 为审批、问题、错误和任务完成设置声音与音量。提供英语、俄语和中文的内置录音；恢复历史时保持静音。
- **KIMI KRINIK 标识。** 回复中使用粉色机器人，Activity Bar 使用带切角的粗轮廓机器人。Action Menu 显示版本与构建号。

## 安装

需要 VS Code 1.100.0 或更高版本，以及 Kimi Code 账户或在共享 `config.toml` 中配置的供应商。

从 Visual Studio Marketplace 页面安装扩展，或从 [GitHub Releases](https://github.com/MikalaiKryvusha/KIMI-KRINIK-VSCODE-EXTENSION/releases) 下载软件包并选择 **Extensions → ⋯ → Install from VSIX…**。

打开文件夹，选择 Activity Bar 中的 KIMI KRINIK 机器人并登录。扩展使用独立的扩展 ID，可与官方 Kimi Code 和 KIMI FORK 并存，项目与会话保持不变。

## 会话与配置

当 VS Code 和 Kimi Code 终端应用使用同一个 `KIMI_CODE_HOME` 时，它们共享配置、登录状态和会话。请勿在两个应用中同时运行同一会话：无法保证跨进程会话锁定。

系统环境变量 `KIMI_CODE_HOME` 用于选择其他数据目录。迁移后，旧的 Kimi Code OAuth 和 MCP OAuth 凭据需要重新授权。

## 支持、基础与许可证

通过 [GitHub Issues](https://github.com/MikalaiKryvusha/KIMI-KRINIK-VSCODE-EXTENSION/issues) 报告问题或提问。KIMI KRINIK 的发布记录见[更新日志](CHANGELOG.md)。

KIMI KRINIK 使用[官方 Kimi Code 引擎与 monorepo](https://github.com/MoonshotAI/kimi-code)，并借鉴 [KIMI FORK](https://github.com/gxgleo67/kimi-code-vscode-fork) 的界面设计。署名信息见 [THIRD_PARTY_NOTICES](THIRD_PARTY_NOTICES.md)。

扩展采用 [Apache-2.0](LICENSE.txt) 许可证。
