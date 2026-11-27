# KIMI KRINIK Changelog

## 1.0.0

2026-11-27

The first independent KIMI KRINIK release helps you manage long agent sessions, continue conversations without losing messages and get notified when attention is needed, using the official Kimi Code 2.7.2 engine and the KIMI FORK interface.

### Added

- Turn off automatic compaction, including an active automatic operation, while keeping manual `/compact` available.
- Get an early warning before a conversation reaches its context limit and continue in a new chat without losing the discussion.
- Send follow-ups and attachments immediately with Steer ON or restore the ordinary queue with Steer OFF.
- Reorder Control Panel buttons and hide them without disabling their features. Use the localized General Settings dialog for editor, context and threshold controls.
- Choose models and reasoning effort through one picker with search and favorites; resumed sessions retain their own effort.
- Use English, Russian and Chinese with a selected-first language dialog.
- Configure approval, question, error and turn-complete sounds with per-event volume and packaged voice clips in all three languages.
- Keep the prompt that owns the visible response in a sticky bubble. Expand full text and media with synchronized 200 ms bubble/container motion and reduced-motion support.
- Use Copy and Fork under each assistant text item; Copy includes only the adjacent text.
- Send image, video and media-only prompts, preserve multiline input and open the same media viewer after replay.
- Read live session status, background tasks, todos, queue state and the version/build identity.
- Use the pink KIMI KRINIK robot in responses and its thick-outlined, clipped-corner shape in the VS Code Activity Bar.
- Install one universal VSIX on Windows, macOS and Linux, or choose one of six platform-specific packages.
- See the pointer cursor on eight chat controls: Add file or media, History, Settings gear, Send, Stop, Session, Create new chat and floating scroll-to-bottom.

### Fixed

- Keep messages, attachments, drafts and unrelated history intact when you follow up, reopen a conversation or a send fails.
- Return rejected queue items to their original positions and avoid duplicate submissions.
- Keep internal instructions out of your conversation and let sticky prompts show only your actual messages.
- Keep sticky appearance, exit, replacement, expansion and collapse synchronized without moving the reading anchor.
- Keep sound selectors usable when an event is Off and prevent replayed events from producing attention sounds.
- Keep each assistant response separate and remove Working as soon as answering finishes, including after follow-ups.

### Distribution

The universal package has no target-platform marker. Platform-specific packages cover darwin-x64, darwin-arm64, linux-x64, linux-arm64, win32-x64 and win32-arm64. The win32-x64 and universal packages passed a fresh Extension Host smoke on Windows; every package passed static and entry-import verification.

### Known issues

Some reported issues remain open in [GitHub Issues](https://github.com/MikalaiKryvusha/KIMI-KRINIK-VSCODE-EXTENSION/issues). They are not represented as fixed and will be addressed in future releases.
