# KIMI KRINIK Changelog

## 1.0.0

2026-11-26

The first independent KIMI KRINIK release combines the official Kimi Code 2.7.2 engine with the KIMI FORK interface and the KIMI KRINIK product changes.

### Added

- Turn off automatic compaction, including an active automatic operation, while keeping manual `/compact` available.
- Configure independent Context Window Control thresholds without requiring KAIF.
- Send follow-ups and attachments immediately with Steer ON or restore the ordinary queue with Steer OFF.
- Reorder Control Panel buttons and hide them without disabling their features. Use the localized General Settings dialog for editor, context and threshold controls.
- Choose models and reasoning effort through one picker with search and favorites; resumed sessions retain their own effort.
- Use English, Russian and Chinese with a selected-first language dialog.
- Configure approval, question, error and turn-complete sounds with per-event volume and packaged voice clips in all three languages.
- Keep the prompt that owns the visible response in a sticky bubble. Expand full text and media with synchronized 200ms bubble/container motion and reduced-motion support.
- Use Copy and Fork under each assistant text item; Copy includes only the adjacent text.
- Send image, video and media-only prompts, preserve multiline input and open the same media viewer after replay.
- Read live session status, background tasks, todos, queue state and the version/build identity.
- Use the pink KIMI KRINIK robot in responses and its thick-outlined, clipped-corner shape in the VS Code Activity Bar.
- Install one universal VSIX on Windows, macOS and Linux, or choose one of six platform-specific packages.

### Fixed

- Preserve turn identity, attachments, composer state and unrelated history across steering, queue batches, replay and late request-setup errors.
- Return rejected queue items to their original positions and avoid duplicate submissions.
- Keep internal hook output out of assistant messages and sticky prompt selection.
- Keep sticky appearance, exit, replacement, expansion and collapse synchronized without moving the reading anchor.
- Keep sound selectors usable when an event is Off and prevent replayed events from producing attention sounds.

### Distribution

The universal package has no target-platform marker. Platform-specific packages cover darwin-x64, darwin-arm64, linux-x64, linux-arm64, win32-x64 and win32-arm64. Package verification does not claim a real run on an operating system that was not available for testing.
