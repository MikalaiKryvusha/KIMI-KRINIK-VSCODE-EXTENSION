# KIMI KRINIK 1.0.0

2026-11-27

KIMI KRINIK 1.0.0 helps you keep long sessions under control, follow up without losing messages and use a three-language UI, while keeping the official Kimi Code 2.7.2 engine and the KIMI FORK interface.

## What's new

- Turn off automatic compaction, including an operation already in progress. Manual `/compact` remains available.

- Get an early warning before a conversation reaches its context limit and continue in a new chat without losing the discussion.

- Keep writing while the agent works: your follow-up and attachments appear immediately and arrive once, or wait in order when you prefer a queue. Rejected messages return to their original positions.

- Keep the last fully-scrolled-out prompt on top: a prompt still visible on screen never duplicates into the sticky bar. The bar animates smoothly on appearance, exit and replacement; expansion and collapse use one synchronized 200 ms motion for the bubble and outer container. The centered chevron expands full text and media in the existing viewer.

- Send images, video and media-only prompts with clickable thumbnails and the same viewer after replay. Preserve manual line breaks and blank lines, and read localized send times to the left of user bubbles.

- Use the Copy and Fork actions under every assistant text item: each Copy writes only its adjacent text.

- Find the right skill with a localized description, then use it immediately or let it wait in the queue.

- Read the «Subagents» label on the secondary-model button in its large form; the compact form keeps the bare robot icon.

- Read Control Panel state descriptions with ON/OFF in uppercase: ON tinted slightly green, OFF slightly red. General Settings shows the states on separate lines in all three languages.

- See a sound event's section dim when set to Off while its selector stays usable. Configure a sound and volume per event with prerecorded clips in all three languages.

- Choose models and reasoning effort through one picker with search and favorites. Explicit MAX/XHigh choices persist, while resumed sessions keep their own effort.

- Use English, Russian or Chinese with a selected-first language dialog and localized interface controls.

- Use responsive Control Panel actions, live status panels, the Working indicator and the pink KIMI KRINIK robot. The left Activity Bar now uses a thick-outlined robot with clipped top corners and the packaged logo's square eye positions. Read the version and build number in Action Menu.

- Keep history stable during replay and late request-setup errors. Internal instructions do not appear as assistant text during live work or history replay, and unrelated turns are not deleted.

- Keep every assistant response visible and in the right order after follow-ups. When the answer is complete, the chat stops showing Working, and reopening history preserves the same messages.

- See at a glance which chat controls are clickable: Add file or media, History, Settings gear, Send, Stop, Session, Create new chat and floating scroll-to-bottom all show the pointer cursor. All eight controls passed real mouse hover and click acceptance on the installed VSIX.

## Verification

The extension has 682 passing checks and 1 skipped check, green typecheck and lint. The isolated packaged install verified chat visibility, steering completion, replay, pointer controls, sound settings and dialogs with measured frames and screenshots. Six platform-specific VSIX packages and the platform-independent `kimi-code-universal.vsix` are packaged and statically audited. Both win32-x64 and universal packages passed a fresh Extension Host smoke.

## Known issues

Some reported issues remain open in [GitHub Issues](https://github.com/MikalaiKryvusha/KIMI-KRINIK-VSCODE-EXTENSION/issues). They are not represented as fixed and will be addressed in future releases.

## Install

The release includes `kimi-code-universal.vsix` and six platform-specific packages.

[Installation instructions and project details are in the README](https://github.com/MikalaiKryvusha/KIMI-KRINIK-VSCODE-EXTENSION#readme).
