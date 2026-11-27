# KIMI KRINIK 1.0.0

2026-11-27

KIMI KRINIK 1.0.0 gives you control over long agent sessions, reliable follow-ups and timely attention alerts while keeping the official Kimi Code 2.7.2 engine.

## What's new

✅ — already in the extension.

| Capability | Kimi Code | KIMI FORK | KIMI KRINIK |
|---|---|---|---|
| Engine | Official 2.7.2 | Older 2.2.0 | ✅ Official 2.7.2, kept current with upstream |
| Automatic compaction control | — | — | ✅ Turn it off, including during an active operation; manual `/compact` remains available |
| Context Window Control | — | — | ✅ Configure thresholds, get an early warning and continue in a new chat without losing the discussion |
| Follow-ups during a running turn | Wait in the queue | Join the turn; attachments can be lost | ✅ Steer ON joins the turn immediately; Steer OFF restores the ordered queue |
| Message and queue reliability | Ordinary queue | Forced steering can repeat or skip messages | ✅ One visible entry and exactly-once delivery per message; rejected items return to their original positions |
| Conversation history and failed sends | Generic internal errors are possible | Generic internal errors are possible | ✅ Reopen text, attachments and message order without blank frames; only the failed action rolls back; internal instructions stay out of the chat |
| Attachments and multiline prompts | — | Attachments can be lost | ✅ Send images, video and media-only prompts; preserve manual line breaks and blank lines; reopen the same media viewer after replay |
| Sticky user prompt | — | — | ✅ Keep the prompt that owns the visible response on top and expand its full text and media without losing the reading position |
| Per-text Copy and Fork | One action row per response; Copy combines the last step's text | One action row per response; Copy combines the last step's text | ✅ Every assistant text item has its own actions; Copy includes only the adjacent text |
| Models and reasoning effort | — | — | ✅ Use one picker with search and favorites; keep explicit choices and restore each resumed session's own effort |
| Control Panel and General Settings | Fixed panel and VS Code settings | Fixed panel and VS Code settings | ✅ Hide buttons without disabling features, reorder them and use one localized settings dialog |
| Agent controls and skills | — | Interface controls | ✅ Use working permission, Plan, Goal, Swarm, secondary-model and skill controls; selected skills follow the Steer or queue setting |
| Managed quota | — | ✅ | ✅ See 5-hour, 7-day and monthly rings with reset countdowns |
| Sounds and voice | — | — | ✅ Set a sound and volume for approvals, questions, errors and completion; use packaged clips in three languages and keep replay silent |
| Interface languages | English | English, 中文 | ✅ English, Русский and 中文 with a selected-first language dialog |
| Live session status | — | ✅ | ✅ Read queue and changes, background tasks, todos, compaction state and the session title in one interface |

## Verification

The extension has 682 passing checks and 1 skipped check, green typecheck and lint. The isolated packaged install verified chat visibility, steering completion, replay, sound settings and dialogs with measured frames and screenshots. Six platform-specific VSIX packages and the platform-independent `kimi-code-universal.vsix` are packaged and statically audited. Both win32-x64 and universal packages passed a fresh Extension Host smoke.

## Known issues

Some reported issues remain open in [GitHub Issues](https://github.com/MikalaiKryvusha/KIMI-KRINIK-VSCODE-EXTENSION/issues). They are not represented as fixed and will be addressed in future releases.

## Install

The release includes `kimi-code-universal.vsix` and six platform-specific packages.

[Installation instructions and project details are in the README](https://github.com/MikalaiKryvusha/KIMI-KRINIK-VSCODE-EXTENSION#readme).
