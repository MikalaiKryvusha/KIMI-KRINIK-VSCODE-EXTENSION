<a name="english"></a>

<p align="center"><img src="apps/vscode/resources/kimi-icon-storefront.png" width="112" alt="KIMI KRINIK extension icon"></p>

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
  <img src="https://img.shields.io/badge/version-1.0.0_in_progress-1E1E1E.svg" alt="Version: 1.0.0 in progress">
  <a href="https://github.com/MoonshotAI/kimi-code"><img src="https://img.shields.io/badge/engine-Kimi_Code_2.7.2-2C7BE5.svg" alt="Engine: Kimi Code 2.7.2"></a>
  <a href="https://github.com/gxgleo67/kimi-code-vscode-fork"><img src="https://img.shields.io/badge/UI-KIMI_FORK-8E44AD.svg" alt="UI: KIMI FORK"></a>
  <a href="https://github.com/MikalaiKryvusha/KAIF"><img src="https://img.shields.io/badge/framework-KAIF-7F52FF.svg" alt="Framework: KAIF"></a>
  <a href="apps/vscode/LICENSE"><img src="https://img.shields.io/badge/license-Apache--2.0-yellow.svg" alt="License: Apache-2.0"></a>
</p>

[Читать по-русски →](#russian) · [中文 →](#chinese)

**KIMI KRINIK** is an improved and advanced Kimi Code extension for VS Code. The engine and the harness are the
[official Kimi Code](https://github.com/MoonshotAI/kimi-code) at its current version; the interface comes from
[KIMI FORK](https://github.com/gxgleo67/kimi-code-vscode-fork). The build adds what neither of them has: automatic
compaction can be switched off, a follow-up joins the running turn with its attachments, and the agent calls you by sound
and voice when it waits for you. The table shows what works now and what comes in 1.0.0.

### 1. What it brings

✅ is in the extension now, 🚧 is coming in 1.0.0.

| | Kimi Code | KIMI FORK | **KIMI KRINIK** |
|---|---|---|---|
| Engine | official 2.7.2 | older 2.2.0 | ✅ official 2.7.2, follows upstream |
| Automatic compaction can be turned off, overflow recovery included; manual `/compact` stays | — | — | ✅ `[loop_control] auto_compact = false` · 🚧 switch in the composer |
| A follow-up sent during a running turn | waits in the queue | joins the turn, can lose attachments | ✅ joins the turn at once with its attachments; on a failure the text returns to the input · 🚧 AUTO STEER on/off |
| Managed quota: 5-hour and 7-day / monthly rings with a reset countdown | — | ✅ | ✅ |
| Sound and voice when an approval, a question or an error waits for you | — | — | ✅ · 🚧 a sound and a volume for each event |
| The session closes by the KAIF context-window thresholds | — | — | ✅ with the KAIF hooks · 🚧 thresholds 70 / 75 / 80 / 90 % in the settings |
| Interface languages | English | English, 中文 | 🚧 English, 中文, Русский |
| Composer panel: permission mode, Plan, Goal, Swarm, secondary model, context ring, model with effort | — | ✅ | 🚧 on the official engine |
| Background, tooltips and menus follow the VS Code theme | — | — | ✅ background · 🚧 tooltips and menus |

### 2. Install

Version 1.0.0 is being built and tested; its `.vsix` will be attached to the
[releases](https://github.com/MikalaiKryvusha/KIMI-KRINIK-VSCODE-EXTENSION/releases). Download the `.vsix` and install it
with **Extensions → ⋯ → Install from VSIX…**. KIMI KRINIK has its own extension ID: it installs next to the official
Kimi Code and KIMI FORK, and your projects and sessions stay in place.

### 3. Based on, with thanks

- **[Kimi Code](https://github.com/MoonshotAI/kimi-code)** by Moonshot AI: the engine, the harness and this monorepo (MIT; the
  extension in `apps/vscode` is Apache-2.0). Our base is upstream `56145f849`. We rebase onto every new official release and
  keep our changes on top.
- **[KIMI FORK](https://github.com/gxgleo67/kimi-code-vscode-fork)** by gxgleo67: the interface and the quota rings, ported by hand
  (Apache-2.0, reference commit `4298cb7f`, details in [THIRD_PARTY_NOTICES](apps/vscode/THIRD_PARTY_NOTICES.md)).
- **[KAIF](https://github.com/MikalaiKryvusha/KAIF)**: the framework the extension is built in and built for.

---

<a name="russian"></a>

<h2 align="center">KIMI KRINIK</h2>

<p align="center"><b>Kimi Krinik — улучшенное и продвинутое расширение Kimi Code для VS Code на основе <a href="https://github.com/MoonshotAI/kimi-code">ванильного Kimi Code</a> и <a href="https://github.com/gxgleo67/kimi-code-vscode-fork">Kimi Fork</a></b></p>

[Read in English →](#english) · [中文 →](#chinese)

**KIMI KRINIK** — улучшенное и продвинутое расширение Kimi Code для VS Code. Движок и harness — это
[официальный Kimi Code](https://github.com/MoonshotAI/kimi-code) текущей версии, интерфейс перенесён из
[KIMI FORK](https://github.com/gxgleo67/kimi-code-vscode-fork). Сборка добавляет то, чего нет ни в одном из них:
автоматический compaction выключается, сообщение во время хода вливается в ход вместе с вложениями, агент зовёт вас звуком
и голосом, когда ждёт ответа. Таблица показывает, что уже работает и что появится в 1.0.0.

### 1. Что нового

✅ — уже в расширении, 🚧 — появится в 1.0.0.

| | Kimi Code | KIMI FORK | **KIMI KRINIK** |
|---|---|---|---|
| Движок | официальный 2.7.2 | старый 2.2.0 | ✅ официальный 2.7.2, идёт за upstream |
| Автоматический compaction выключается вместе с восстановлением при переполнении; ручной `/compact` работает | — | — | ✅ `[loop_control] auto_compact = false` · 🚧 переключатель в композере |
| Сообщение, отправленное во время хода | ждёт в очереди | вливается в ход, может потерять вложения | ✅ сразу вливается в ход вместе с вложениями; при ошибке текст возвращается в поле ввода · 🚧 AUTO STEER вкл/выкл |
| Квоты: кольца 5 часов и 7 дней / месяц с отсчётом до сброса | — | ✅ | ✅ |
| Звук и голос, когда вас ждут одобрение, вопрос или ошибка | — | — | ✅ · 🚧 свой звук и громкость для каждого события |
| Сессия закрывается по порогам контекстного окна KAIF | — | — | ✅ с хуками KAIF · 🚧 пороги 70 / 75 / 80 / 90 % в настройках |
| Языки интерфейса | English | English, 中文 | 🚧 English, 中文, Русский |
| Панель композера: режим разрешений, Plan, Goal, Swarm, вторичная модель, кольцо контекста, модель с усилием | — | ✅ | 🚧 на официальном движке |
| Фон, подсказки и меню следуют теме VS Code | — | — | ✅ фон · 🚧 подсказки и меню |

### 2. Установка

Версия 1.0.0 собирается и проходит проверку; её `.vsix` выйдет в
[релизах](https://github.com/MikalaiKryvusha/KIMI-KRINIK-VSCODE-EXTENSION/releases). Скачайте `.vsix` и установите его через
**Extensions → ⋯ → Install from VSIX…**. У KIMI KRINIK свой ID расширения: оно встаёт рядом с официальным Kimi Code и
KIMI FORK, ваши проекты и сессии остаются на месте.

### 3. Основа и благодарности

- **[Kimi Code](https://github.com/MoonshotAI/kimi-code)** от Moonshot AI: движок, harness и само монорепо (MIT; расширение
  в `apps/vscode` — Apache-2.0). Наша основа — upstream `56145f849`. На каждый новый официальный релиз мы делаем rebase и
  держим свои изменения сверху.
- **[KIMI FORK](https://github.com/gxgleo67/kimi-code-vscode-fork)** от gxgleo67: интерфейс и кольца квот, перенесённые вручную
  (Apache-2.0, опорный коммит `4298cb7f`, подробности в [THIRD_PARTY_NOTICES](apps/vscode/THIRD_PARTY_NOTICES.md)).
- **[KAIF](https://github.com/MikalaiKryvusha/KAIF)**: фреймворк, в котором расширение создаётся и для которого работает.

---

<a name="chinese"></a>

<h2 align="center">KIMI KRINIK</h2>

<p align="center"><b>Kimi Krinik —— 改进增强版 Kimi Code VS Code 扩展，基于 <a href="https://github.com/MoonshotAI/kimi-code">原版 Kimi Code</a> 与 <a href="https://github.com/gxgleo67/kimi-code-vscode-fork">Kimi Fork</a></b></p>

[Read in English →](#english) · [Читать по-русски →](#russian)

**KIMI KRINIK** 是改进增强版 Kimi Code VS Code 扩展。引擎与 harness 来自当前版本的
[官方 Kimi Code](https://github.com/MoonshotAI/kimi-code)，界面移植自
[KIMI FORK](https://github.com/gxgleo67/kimi-code-vscode-fork)。在此之上，它加入了两者都没有的功能：可以关闭自动压缩；
轮次运行中发送的消息连同附件立即并入当前轮次；智能体等待你时用提示音和语音提醒。下表列出已有功能和 1.0.0 将提供的功能。

### 1. 新增内容

✅ 表示扩展中已有，🚧 表示将在 1.0.0 中提供。

| | Kimi Code | KIMI FORK | **KIMI KRINIK** |
|---|---|---|---|
| 引擎 | 官方 2.7.2 | 较旧的 2.2.0 | ✅ 官方 2.7.2，跟随上游 |
| 自动压缩可以关闭，包括上下文溢出恢复；手动 `/compact` 照常可用 | — | — | ✅ `[loop_control] auto_compact = false` · 🚧 输入框中的开关 |
| 轮次运行中发送的追加消息 | 排队等待 | 并入当前轮次，可能丢失附件 | ✅ 立即连同附件并入当前轮次；失败时文本回到输入框 · 🚧 AUTO STEER 开关 |
| 托管配额：5 小时与 7 天 / 月度圆环及重置倒计时 | — | ✅ | ✅ |
| 等待审批、问题或出现错误时的提示音与语音 | — | — | ✅ · 🚧 为每个事件设置声音与音量 |
| 会话按 KAIF 上下文窗口阈值收尾 | — | — | ✅ 配合 KAIF 钩子 · 🚧 设置中的 70 / 75 / 80 / 90 % 阈值 |
| 界面语言 | English | English、中文 | 🚧 English、中文、Русский |
| 输入框面板：权限模式、Plan、Goal、Swarm、次级模型、上下文圆环、模型与推理强度 | — | ✅ | 🚧 基于官方引擎 |
| 背景、提示框与菜单跟随 VS Code 主题 | — | — | ✅ 背景 · 🚧 提示框与菜单 |

### 2. 安装

1.0.0 版本正在构建与测试，其 `.vsix` 将发布在
[Releases](https://github.com/MikalaiKryvusha/KIMI-KRINIK-VSCODE-EXTENSION/releases)。下载 `.vsix`，通过
**Extensions → ⋯ → Install from VSIX…** 安装。KIMI KRINIK 拥有独立的扩展 ID，可与官方 Kimi Code 和 KIMI FORK
并存，项目与会话保持原样。

### 3. 基础与致谢

- **[Kimi Code](https://github.com/MoonshotAI/kimi-code)**（Moonshot AI）：引擎、harness 与本 monorepo（MIT；`apps/vscode`
  中的扩展为 Apache-2.0）。我们的基线是上游 `56145f849`。每当官方发布新版本，我们执行 rebase，并将自己的改动保持在其之上。
- **[KIMI FORK](https://github.com/gxgleo67/kimi-code-vscode-fork)**（gxgleo67）：手工移植的界面与配额圆环
  （Apache-2.0，参考提交 `4298cb7f`，详见 [THIRD_PARTY_NOTICES](apps/vscode/THIRD_PARTY_NOTICES.md)）。
- **[KAIF](https://github.com/MikalaiKryvusha/KAIF)**：本扩展的开发框架，也是它所服务的框架。
