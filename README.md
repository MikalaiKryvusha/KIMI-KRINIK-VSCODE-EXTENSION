<a name="english"></a>

<p align="center"><img src="apps/vscode/resources/krinik-robot-logo.png?v=20261125" width="240" alt="KIMI KRINIK extension icon"></p>

<h2 align="center">KIMI KRINIK</h2>

<p align="center"><b>Kimi Krinik — an improved and advanced Kimi Code extension for VS Code based on <a href="https://github.com/MoonshotAI/kimi-code">vanilla Kimi Code</a> and <a href="https://github.com/gxgleo67/kimi-code-vscode-fork">Kimi Fork</a></b></p>

<p align="center">
  <a href="#english"><img src="https://img.shields.io/badge/English-2C7BE5?style=for-the-badge" alt="English"></a>
  &nbsp;
  <a href="#russian"><img src="https://img.shields.io/badge/Русский-C0392B?style=for-the-badge" alt="Русский"></a>
  &nbsp;
  <a href="#chinese"><img src="https://img.shields.io/badge/中文-E67E22?style=for-the-badge" alt="中文"></a>
</p>

<p align="center">
  <a href="https://github.com/MikalaiKryvusha/KIMI-KRINIK-VSCODE-EXTENSION/releases/latest/download/kimi-code-universal.vsix">
    <img src="docs/media/download-en.svg" width="360" alt="Download KIMI KRINIK VSIX">
  </a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/version-1.0.0_in_progress-1E1E1E.svg" alt="Version: 1.0.0 in progress">
  <a href="https://github.com/MoonshotAI/kimi-code"><img src="https://img.shields.io/badge/engine-Kimi_Code_2.7.2-2C7BE5.svg" alt="Engine: Kimi Code 2.7.2"></a>
  <a href="https://github.com/gxgleo67/kimi-code-vscode-fork"><img src="https://img.shields.io/badge/UI-KIMI_FORK-8E44AD.svg" alt="UI: KIMI FORK"></a>
  <a href="apps/vscode/LICENSE"><img src="https://img.shields.io/badge/license-Apache--2.0-yellow.svg" alt="License: Apache-2.0"></a>
</p>

[Читать по-русски →](#russian) · [中文 →](#chinese)

**KIMI KRINIK** is a VS Code extension for the Kimi agent. The engine and the agent runtime (harness) are the
[official Kimi Code](https://github.com/MoonshotAI/kimi-code) at its current version; the interface comes from
[KIMI FORK](https://github.com/gxgleo67/kimi-code-vscode-fork). The build adds what neither project has: automatic
context compaction (compaction) can be switched off, a follow-up joins the running turn with its attachments, and the agent alerts you with a tone or a prerecorded voice notification when it waits for you.

### 1. What it brings

✅ is in the extension now.

| | Kimi Code | KIMI FORK | **KIMI KRINIK** |
|---|---|---|---|
| Engine | official 2.7.2 | older 2.2.0 | ✅ official 2.7.2, kept current with upstream |
| Automatic compaction and overflow recovery can be turned off, including an automatic compaction already in progress; manual `/compact` stays and is not cancelled | — | — | ✅ `[loop_control] auto_compact = false` and a switch in the settings menu |
| Context Window Control with configurable thresholds | — | — | ✅ with one active control path and a handover to a new chat |
| A follow-up sent during a running turn | waits in the queue | joins the turn, can lose attachments | ✅ immediate AUTO STEER; OFF restores the ordinary queue |
| Follow-up visible in chat | — | — | ✅ one visible entry per message |
| Follow-up engine submission | — | — | ✅ one engine submission per message |
| Queue actions and failures | ordinary queue | forced steering can repeat or skip items | ✅ the whole batch joins once in order; rejected items return to their original positions |
| Assistant Copy/Fork scope | one action row per response; Copy combines the last step's text | one action row per response; Copy combines the last step's text | ✅ every assistant text item has its own Copy and Fork; Copy writes only its adjacent text |
| Attachments in chat and steering | — | can lose attachments | ✅ image, video and media-only prompts, clickable thumbnails, the same viewer after replay |
| Multiline prompts | standard Markdown whitespace | standard Markdown whitespace | ✅ manual line breaks and blank lines reach the model unchanged |
| Sticky user prompt while reading a long conversation | — | — | ✅ no extra strip at chat start; one-line prompts have no fade or expand control; an expanded prompt stays open while scrolling and collapses manually or when another prompt becomes sticky; the chevron opens full text and media in the existing viewer; appearance, exit, replacement, expansion and collapse animations keep the bubble and outer container synchronized; a prompt still visible on screen never duplicates into the sticky |
| User message send time | — | — | ✅ localized `HH:MM` send time to the left of the user bubble |
| Managed quota: 5-hour ring with a reset countdown | — | ✅ | ✅ |
| Managed quota: 7-day ring with a reset countdown | — | ✅ | ✅ |
| Managed quota: monthly ring with a reset countdown | — | ✅ | ✅ |
| Sound and voice for approval requests, questions and errors | — | — | ✅ a sound and a volume for each event, prerecorded clips in three languages; Off never locks the selector; an Off event's section dims while its selector stays usable |
| Interface languages | English | English, 中文 | ✅ English, 中文, Русский, with a language dialog that puts the selected language first |
| Composer panel: permission mode, Plan, Goal, Swarm, secondary model, context ring and viewer | — | ✅ | ✅ combined model + effort picker, search, favorites and secondary-model selection; the secondary-model button carries a «Subagents» label in the large form |
| Model and reasoning effort between sessions | — | — | ✅ explicit MAX/XHigh choices persist; a resumed session keeps its own effort |
| Live status and session header | — | ✅ | ✅ queued/changed panels, background tasks, todos, compaction viewer, session title, Working indicator and KIMI KRINIK robot |
| History replay and internal events | — | — | ✅ atomic replay without blank frames; internal hook results never become assistant text |
| Context ring and queue feedback | — | ✅ | ✅ blue → yellow → red-orange ring interpolation and one pulse when an item joins the queue |
| Control Panel at narrow widths | — | ✅ | ✅ horizontal scrolling only on real overflow, with fading edges and one-click actions |
| Control Panel composition and order | fixed panel | fixed panel | ✅ checkboxes hide buttons without disabling their features; Up/Down actions persist the left-to-right order |
| General Settings | VS Code settings | VS Code settings | ✅ one localized dialog for editor behavior, context sharing and all four context thresholds, with separate ON/OFF explanations |
| Control Panel skill picker | — | — | ✅ a scrollable list with bold skill names and plain localized descriptions; the selected skill joins the running turn with Steer ON or waits in the queue with Steer OFF |
| Control Panel state descriptions | — | — | ✅ ON/OFF in uppercase with a slight green/red tint in all three languages |
| Action Menu build identity | — | — | ✅ version and build number; for example, build 55 is shown as `v1.0.0 (55)` |
| Late preflight errors | can surface a generic internal error | can surface a generic internal error | ✅ unrelated and newer chat turns stay intact; only the send that actually failed is rolled back |
| Activity Bar identity | KIMI icon | KIMI FORK icon | ✅ a thick-outlined KIMI KRINIK robot with clipped top corners and square sideways eyes, using the VS Code foreground color |
| Background, tooltips and menus follow the VS Code theme | — | — | ✅ |

### 2. Install

Version 1.0.0 is being built and tested; its `.vsix` will be attached to the
[releases](https://github.com/MikalaiKryvusha/KIMI-KRINIK-VSCODE-EXTENSION/releases). The DOWNLOAD button above gets
`kimi-code-universal.vsix`, which installs on Windows, macOS and Linux; platform-specific packages (for example
`kimi-code-win32-x64.vsix` or `kimi-code-darwin-arm64.vsix`) are attached there too. Install the file with
**Extensions → ⋯ → Install from VSIX…**. KIMI KRINIK has its own extension ID: it installs next to the official
Kimi Code and KIMI FORK, and your projects and sessions stay in place.

### 3. Based on, with thanks

- **[Kimi Code](https://github.com/MoonshotAI/kimi-code)** by Moonshot AI: the engine, the harness and this monorepo (MIT; the
  extension in `apps/vscode` is Apache-2.0). Our base is upstream `56145f849`. We rebase onto every new official release and
  keep our changes on top.
- **[KIMI FORK](https://github.com/gxgleo67/kimi-code-vscode-fork)** by gxgleo67: the interface and the quota rings, ported by hand
  (Apache-2.0, reference commit `4298cb7f`, details in [THIRD_PARTY_NOTICES](apps/vscode/THIRD_PARTY_NOTICES.md)).

---

<a name="russian"></a>

<p align="center"><img src="apps/vscode/resources/krinik-robot-logo.png?v=20261125" width="240" alt="Иконка расширения KIMI KRINIK"></p>

<h2 align="center">KIMI KRINIK</h2>

<p align="center"><b>Kimi Krinik — улучшенное и продвинутое расширение Kimi Code для VS Code на основе <a href="https://github.com/MoonshotAI/kimi-code">ванильного Kimi Code</a> и <a href="https://github.com/gxgleo67/kimi-code-vscode-fork">Kimi Fork</a></b></p>

<p align="center">
  <a href="#english"><img src="https://img.shields.io/badge/English-2C7BE5?style=for-the-badge" alt="English"></a>
  &nbsp;
  <a href="#russian"><img src="https://img.shields.io/badge/Русский-C0392B?style=for-the-badge" alt="Русский"></a>
  &nbsp;
  <a href="#chinese"><img src="https://img.shields.io/badge/中文-E67E22?style=for-the-badge" alt="中文"></a>
</p>

<p align="center">
  <a href="https://github.com/MikalaiKryvusha/KIMI-KRINIK-VSCODE-EXTENSION/releases/latest/download/kimi-code-universal.vsix">
    <img src="docs/media/download-ru.svg" width="360" alt="Скачать KIMI KRINIK VSIX">
  </a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/версия-1.0.0_в_работе-1E1E1E.svg" alt="Версия: 1.0.0 в работе">
  <a href="https://github.com/MoonshotAI/kimi-code"><img src="https://img.shields.io/badge/движок-Kimi_Code_2.7.2-2C7BE5.svg" alt="Движок: Kimi Code 2.7.2"></a>
  <a href="https://github.com/gxgleo67/kimi-code-vscode-fork"><img src="https://img.shields.io/badge/интерфейс-KIMI_FORK-8E44AD.svg" alt="Интерфейс: KIMI FORK"></a>
  <a href="apps/vscode/LICENSE"><img src="https://img.shields.io/badge/лицензия-Apache--2.0-yellow.svg" alt="Лицензия: Apache-2.0"></a>
</p>

[Read in English →](#english) · [中文 →](#chinese)

**KIMI KRINIK** — расширение VS Code для агента Kimi. Движок и среда выполнения агента (harness) — это
[официальный Kimi Code](https://github.com/MoonshotAI/kimi-code) текущей версии, интерфейс перенесён из
[KIMI FORK](https://github.com/gxgleo67/kimi-code-vscode-fork). Сборка добавляет то, чего нет ни в одном из них:
автоматическое сжатие контекста (compaction) выключается, сообщение, отправленное во время работы агента, сразу обрабатывается в текущем ходе вместе с вложениями, агент предупреждает вас звуковым сигналом
или готовой голосовой записью, когда ждёт ответа.

### 1. Что нового

✅ — уже в расширении.

| | Kimi Code | KIMI FORK | **KIMI KRINIK** |
|---|---|---|---|
| Движок | официальный 2.7.2 | старый 2.2.0 | ✅ официальный 2.7.2, обновляется вслед за официальным Kimi Code |
| Автоматический compaction выключается вместе с восстановлением при переполнении и уже идущим автоматическим сжатием; ручной `/compact` работает и не отменяется | — | — | ✅ `[loop_control] auto_compact = false` и переключатель в меню настроек |
| Контроль контекстного окна с настраиваемыми порогами | — | — | ✅ использует один активный механизм контроля и передаёт работу в новый чат |
| Сообщение, отправленное во время работы агента | ждёт в очереди | обрабатывается в текущем ходе, вложения могут теряться | ✅ сразу попадает в текущий ход; OFF возвращает обычную очередь |
| Досланное сообщение в чате | — | — | ✅ одна видимая запись на сообщение |
| Досланное сообщение в движке | — | — | ✅ одна отправка на сообщение |
| Действия с очередью и ошибки отправки | обычная очередь | принудительный steering может повторить или пропустить сообщения | ✅ вся пачка отправляется один раз по порядку; отклонённые сообщения возвращаются на исходные места |
| Область действий Copy/Fork в ответе | одна панель на ответ; Copy объединяет текст последнего шага | одна панель на ответ; Copy объединяет текст последнего шага | ✅ у каждого текстового блока агента свои Copy и Fork; Copy записывает только соседний текст |
| Вложения в чате и steering | — | вложения могут теряться | ✅ изображения, видео и сообщения без текста, кликабельные миниатюры и существующий просмотрщик после восстановления истории |
| Многострочные сообщения | обычное Markdown-разбиение строк | обычное Markdown-разбиение строк | ✅ ручные переносы строк и пустые строки доходят до модели без изменений |
| Закреплённое сообщение пользователя в длинном чате | — | — | ✅ в начале чата лишней полосы нет; у однострочного запроса нет затухания текста и кнопки раскрытия; развёрнутый запрос остаётся раскрытым при прокрутке и сворачивается вручную или при закреплении другого запроса; шеврон открывает полный текст и медиа в существующем просмотрщике; при появлении, исчезновении, смене, раскрытии и сворачивании пузырь и внешний контейнер движутся синхронно; видимое на экране сообщение не дублируется в закреплённую полосу |
| Время отправки сообщения пользователя | — | — | ✅ локализованное время `HH:MM` слева от пузыря сообщения |
| Квота на 5 часов: кольцо с отсчётом до сброса | — | ✅ | ✅ |
| Квота на 7 дней: кольцо с отсчётом до сброса | — | ✅ | ✅ |
| Месячная квота: кольцо с отсчётом до сброса | — | ✅ | ✅ |
| Звук и голос для запросов одобрения, вопросов и ошибок | — | — | ✅ свой звук и громкость для каждого события, готовые записи на трёх языках; «Выкл» не блокирует выбор; при «Выкл» секция события затемняется, а выбор звука остаётся доступным |
| Языки интерфейса | English | English, 中文 | ✅ English, 中文, Русский, диалог выбора языка, где активный язык стоит первым |
| Панель ввода: режим разрешений, Plan, Goal, Swarm, дополнительная модель, кольцо контекста и просмотр контекста | — | ✅ | ✅ общий выбор модели и уровня рассуждений, поиск, избранное и дополнительная модель; кнопка дополнительной модели в крупном виде подписана «Субагенты» |
| Модель и уровень рассуждений между сессиями | — | — | ✅ явный выбор MAX/XHigh сохраняется; восстановленная сессия хранит собственный уровень |
| Текущий статус и заголовок сессии | — | ✅ | ✅ очередь и изменения, фоновые задачи, список задач, просмотр контекста, название сессии, индикатор «Работаю…» и робот KIMI KRINIK |
| История и внутренние события | — | — | ✅ восстановление истории без пустых кадров; внутренние служебные инструкции не отображаются как ответ агента |
| Кольцо контекста и отклик очереди | — | ✅ | ✅ плавный переход синего в жёлтый и красно-оранжевый, один импульс при добавлении сообщения |
| Панель управления на узком экране | — | ✅ | ✅ горизонтальная прокрутка только при реальном переполнении, затухание краёв и действия одним кликом |
| Состав и порядок кнопок Control Panel | фиксированная панель | фиксированная панель | ✅ галочки скрывают кнопки без отключения самих функций; стрелки вверх и вниз сохраняют порядок кнопок слева направо |
| Общие настройки | настройки VS Code | настройки VS Code | ✅ одно локализованное окно для поведения редактора, передачи контекста и всех четырёх порогов контекстного окна, с отдельными пояснениями для ВКЛ и ВЫКЛ |
| Кнопка «Навык» в Control Panel | — | — | ✅ открывает прокручиваемый список с именем навыка жирным шрифтом и описанием обычным; при включённом Стиринге выбранный навык сразу идёт в текущий ход, при выключенном — в очередь |
| Состояния в подсказках Панели Управления | — | — | ✅ «ВКЛ»/«ВЫКЛ» в верхнем регистре с чуть зелёным и чуть красным оттенком на всех трёх языках |
| Версия в Action Menu | — | — | ✅ версия и номер билда; например, билд 55 отображается как `v1.0.0 (55)` |
| Запоздавшие ошибки подготовки запроса | общая ошибка без подробностей | общая ошибка без подробностей | ✅ не связанные с ошибкой и более новые ходы чата сохраняются; откатывается только текущая неудачная отправка |
| Значок на основной левой панели | значок KIMI | значок KIMI FORK | ✅ контурный робот KIMI KRINIK с толстой линией, срезанными верхними уголками и квадратными глазами на позициях из фирменного логотипа; цвет следует теме VS Code |
| Фон, подсказки и меню следуют теме VS Code | — | — | ✅ |

### 2. Установка

Версия 1.0.0 собирается и проходит проверку; её `.vsix` выйдет в
[релизах](https://github.com/MikalaiKryvusha/KIMI-KRINIK-VSCODE-EXTENSION/releases). Кнопка СКАЧАТЬ выше забирает
`kimi-code-universal.vsix` — он ставится на Windows, macOS и Linux; там же лежат пакеты для конкретных платформ
(например `kimi-code-win32-x64.vsix` и `kimi-code-darwin-arm64.vsix`). Установите файл через
**Extensions → ⋯ → Install from VSIX…**. У KIMI KRINIK свой ID расширения: оно встаёт рядом с официальным Kimi Code и
KIMI FORK, ваши проекты и сессии остаются на месте.

### 3. Основа и благодарности

- **[Kimi Code](https://github.com/MoonshotAI/kimi-code)** от Moonshot AI: движок, harness и само монорепо (MIT; расширение
  в `apps/vscode` — Apache-2.0). Наша основа — upstream `56145f849`. На каждый новый официальный релиз мы делаем rebase и
  держим свои изменения сверху.
- **[KIMI FORK](https://github.com/gxgleo67/kimi-code-vscode-fork)** от gxgleo67: интерфейс и кольца квот, перенесённые вручную
  (Apache-2.0, опорный коммит `4298cb7f`, подробности в [THIRD_PARTY_NOTICES](apps/vscode/THIRD_PARTY_NOTICES.md)).

---

<a name="chinese"></a>

<p align="center"><img src="apps/vscode/resources/krinik-robot-logo.png?v=20261125" width="240" alt="KIMI KRINIK 扩展图标"></p>

<h2 align="center">KIMI KRINIK</h2>

<p align="center"><b>Kimi Krinik —— 改进增强版 Kimi Code VS Code 扩展，基于 <a href="https://github.com/MoonshotAI/kimi-code">原版 Kimi Code</a> 与 <a href="https://github.com/gxgleo67/kimi-code-vscode-fork">Kimi Fork</a></b></p>

<p align="center">
  <a href="#english"><img src="https://img.shields.io/badge/English-2C7BE5?style=for-the-badge" alt="English"></a>
  &nbsp;
  <a href="#russian"><img src="https://img.shields.io/badge/Русский-C0392B?style=for-the-badge" alt="Русский"></a>
  &nbsp;
  <a href="#chinese"><img src="https://img.shields.io/badge/中文-E67E22?style=for-the-badge" alt="中文"></a>
</p>

<p align="center">
  <a href="https://github.com/MikalaiKryvusha/KIMI-KRINIK-VSCODE-EXTENSION/releases/latest/download/kimi-code-universal.vsix">
    <img src="docs/media/download-zh.svg" width="360" alt="下载 KIMI KRINIK VSIX">
  </a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/版本-1.0.0_开发中-1E1E1E.svg" alt="版本：1.0.0 开发中">
  <a href="https://github.com/MoonshotAI/kimi-code"><img src="https://img.shields.io/badge/引擎-Kimi_Code_2.7.2-2C7BE5.svg" alt="引擎：Kimi Code 2.7.2"></a>
  <a href="https://github.com/gxgleo67/kimi-code-vscode-fork"><img src="https://img.shields.io/badge/界面-KIMI_FORK-8E44AD.svg" alt="界面：KIMI FORK"></a>
  <a href="apps/vscode/LICENSE"><img src="https://img.shields.io/badge/许可证-Apache--2.0-yellow.svg" alt="许可证：Apache-2.0"></a>
</p>

[Read in English →](#english) · [Читать по-русски →](#russian)

**KIMI KRINIK** 是用于 Kimi 智能体的 VS Code 扩展。引擎与 agent 运行环境（harness）来自当前版本的
[官方 Kimi Code](https://github.com/MoonshotAI/kimi-code)，界面移植自
[KIMI FORK](https://github.com/gxgleo67/kimi-code-vscode-fork)。在此之上，它加入了两者都没有的功能：可以关闭自动上下文压缩（compaction）；
轮次运行中发送的消息连同附件立即并入当前轮次；智能体等待你时用提示音或预录语音提醒。

### 1. 新增内容

✅ 表示扩展中已有。

| | Kimi Code | KIMI FORK | **KIMI KRINIK** |
|---|---|---|---|
| 引擎 | 官方 2.7.2 | 较旧的 2.2.0 | ✅ 官方 2.7.2，跟随上游 |
| 自动上下文压缩（compaction）可以关闭，包括上下文溢出恢复和已在进行的自动压缩；手动 `/compact` 照常可用且不会被取消 | — | — | ✅ `[loop_control] auto_compact = false` 及设置菜单中的开关 |
| 上下文窗口控制与可配置阈值 | — | — | ✅ 仅运行一个活动控制路径，并将工作交接到新聊天 |
| 轮次运行中发送的追加消息 | 排队等待 | 并入当前轮次，可能丢失附件 | ✅ 立即并入当前轮次；OFF 恢复普通队列 |
| 追加消息在聊天中的记录 | — | — | ✅ 每条消息仅一条可见记录 |
| 追加消息在引擎中的提交 | — | — | ✅ 每条消息仅一次提交 |
| 队列操作与发送失败 | 普通队列 | 强制 steering 可能重复或跳过消息 | ✅ 整批消息按顺序仅发送一次；被拒绝的消息回到原位置 |
| 助手回复中的 Copy/Fork 范围 | 每条回复一组操作；Copy 合并最后一步的文本 | 每条回复一组操作；Copy 合并最后一步的文本 | ✅ 每个助手文本块都有独立的 Copy 和 Fork；Copy 仅复制相邻文本 |
| 聊天和 steering 中的附件 | — | 可能丢失附件 | ✅ 图片、视频及纯媒体消息，可点击缩略图，replay 后使用同一查看器 |
| 多行消息 | 标准 Markdown 空白处理 | 标准 Markdown 空白处理 | ✅ 手动换行和空行原样传递给模型 |
| 长聊天中置顶的用户消息 | — | — | ✅ 聊天开始时不显示多余横条；单行消息不显示淡出效果或展开按钮；展开的消息在滚动时保持展开，可手动折叠或在另一条消息置顶时折叠；chevron 在现有查看器中打开全文与媒体；出现、消失、替换、展开与折叠时，消息气泡和外部容器保持同步；仍在屏幕上的消息不会重复进入置顶栏 |
| 用户消息发送时间 | — | — | ✅ 用户气泡左侧显示本地化的 `HH:MM` 发送时间 |
| 5 小时配额：带重置倒计时的圆环 | — | ✅ | ✅ |
| 7 天配额：带重置倒计时的圆环 | — | ✅ | ✅ |
| 月度配额：带重置倒计时的圆环 | — | ✅ | ✅ |
| 需要审批、收到问题或发生错误时，用提示音和语音提醒 | — | — | ✅ 为每个事件设置声音与音量，提供三种语言的预录语音；Off 不会锁住选择器；事件设为 Off 时其区域变暗，但选择器仍可用 |
| 界面语言 | English | English、中文 | ✅ English、中文、Русский，语言对话框将当前语言放在首位 |
| 输入框面板：权限模式、Plan、Goal、Swarm、次级模型、上下文圆环及查看器 | — | ✅ | ✅ 模型与推理强度合并选择器、搜索、收藏及次级模型选择；次级模型按钮在大尺寸下显示「子智能体」文字 |
| 会话之间的模型与推理强度 | — | — | ✅ 明确选择的 MAX/XHigh 会持久保存；恢复的会话保留自己的推理强度 |
| 实时状态与会话标题栏 | — | ✅ | ✅ 排队与更改、后台任务、待办、上下文查看器、会话标题、Working 指示器及 KIMI KRINIK 机器人 |
| 历史 replay 与内部事件 | — | — | ✅ 原子 replay 不出现空白帧；内部 hook 结果不会成为助手文本 |
| 上下文圆环与队列反馈 | — | ✅ | ✅ 蓝色 → 黄色 → 红橙色平滑渐变，消息入队时仅脉冲一次 |
| 窄宽度下的 Control Panel | — | ✅ | ✅ 仅在实际溢出时横向滚动，边缘渐隐，单击执行操作 |
| Control Panel 的按钮组成与顺序 | 固定面板 | 固定面板 | ✅ 复选框隐藏按钮但保留对应功能；上移和下移操作会保存从左到右的按钮顺序 |
| 通用设置 | VS Code 设置 | VS Code 设置 | ✅ 一个本地化对话框集中管理编辑器行为、上下文共享和全部四个上下文阈值，ON/OFF 说明分行显示 |
| Control Panel Skill 选择器 | — | — | ✅ 可滚动列表以粗体显示技能名称，以常规字体显示本地化描述；Steer 开启时立即发送，关闭时进入普通队列 |
| Control Panel 状态提示 | — | — | ✅ ON/OFF 全大写并带轻微绿色/红色着色，支持全部三种语言 |
| Action Menu 中的构建标识 | — | — | ✅ 版本与构建号，例如构建 55 显示为 `v1.0.0 (55)` |
| 延迟到达的 preflight 错误 | 可能出现通用 internal error | 可能出现通用 internal error | ✅ 无关及更新的聊天消息保持不变，仅回滚当前失败的发送 |
| 左侧 Activity Bar 标识 | KIMI 图标 | KIMI FORK 图标 | ✅ KIMI KRINIK 机器人采用粗轮廓、顶部切角和位于两侧的方形眼睛，颜色跟随 VS Code 前景色 |
| 背景、提示框与菜单跟随 VS Code 主题 | — | — | ✅ |

### 2. 安装

1.0.0 版本正在构建与测试，其 `.vsix` 将发布在
[Releases](https://github.com/MikalaiKryvusha/KIMI-KRINIK-VSCODE-EXTENSION/releases)。上方下载按钮获取
`kimi-code-universal.vsix`，可安装于 Windows、macOS 和 Linux；同时也提供各平台专用包（例如
`kimi-code-win32-x64.vsix`、`kimi-code-darwin-arm64.vsix`）。通过 **Extensions → ⋯ → Install from VSIX…** 安装。KIMI KRINIK
拥有独立的扩展 ID，可与官方 Kimi Code 和 KIMI FORK 并存，项目与会话保持原样。

### 3. 基础与致谢

- **[Kimi Code](https://github.com/MoonshotAI/kimi-code)**（Moonshot AI）：引擎、harness 与本 monorepo（MIT；`apps/vscode`
  中的扩展为 Apache-2.0）。我们的基线是上游 `56145f849`。每当官方发布新版本，我们都会 rebase，并把自己的改动保留在新版本之上。
- **[KIMI FORK](https://github.com/gxgleo67/kimi-code-vscode-fork)**（gxgleo67）：手工移植的界面与配额圆环
  （Apache-2.0，参考提交 `4298cb7f`，详见 [THIRD_PARTY_NOTICES](apps/vscode/THIRD_PARTY_NOTICES.md)）。
