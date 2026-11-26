# KIMI KRINIK 1.0.0

2026-11-26

KIMI KRINIK 1.0.0 combines the official Kimi Code 2.7.2 engine with the KIMI FORK interface and adds independent context management, reliable follow-ups and a three-language UI.

## What's new

- Turn off automatic compaction, including an operation already in progress. Manual `/compact` remains available.

- Use Context Window Control with configurable thresholds, without requiring KAIF. Threshold messages hand work over to a new chat before the window overflows.

- Send follow-ups immediately with AUTO STEER or restore the ordinary queue. Ordered batches join once, and rejected messages return to their original positions.

- Keep the last fully-scrolled-out prompt on top: a prompt still visible on screen never duplicates into the sticky bar. The bar animates smoothly on appearance, exit and replacement, and the centered chevron expands full text and media in the existing viewer.

- Send images, video and media-only prompts with clickable thumbnails and the same viewer after replay. Preserve manual line breaks and blank lines, and read localized send times to the left of user bubbles.

- Use the Copy and Branch actions under every assistant text item: each Copy writes only its adjacent text.

- Open the Skill picker with 48px margins and localized descriptions, then send a skill immediately with Steer or queue it with Steer OFF.

- Read the «Subagents» label on the secondary-model button in its large form; the compact form keeps the bare robot icon.

- Read Control Panel state descriptions with ON/OFF in uppercase: ON tinted slightly green, OFF slightly red. General Settings shows the states on separate lines in all three languages.

- See a sound event's section dim when set to Off while its selector stays usable. Configure a sound and volume per event with prerecorded clips in all three languages.

- Choose models and reasoning effort through one picker with search and favorites. Explicit MAX/XHigh choices persist, while resumed sessions keep their own effort.

- Use English, Russian or Chinese with a selected-first language dialog and localized interface controls.

- Use responsive Control Panel actions, live status panels, the Working indicator and the pink KIMI KRINIK robot. Read the version and build number in Action Menu.

- Keep history stable during replay and late request-setup errors. Internal instructions do not appear as assistant text during live work or history replay, and unrelated turns are not deleted.

## Verification

The extension has 653 passing checks and 1 skipped check, green typecheck and lint. The isolated packaged install verified the chat, sticky prompt, sound settings, Control Panel and dialogs with measured geometry and screenshots. Six platform-specific VSIX packages and the platform-independent `kimi-code-universal.vsix` are packaged and statically audited.

## Install

The DOWNLOAD button in the README gets `kimi-code-universal.vsix`, which installs on Windows, macOS and Linux; platform-specific packages are attached to the release as well. Choose **Extensions → ⋯ → Install from VSIX…**. KIMI KRINIK installs beside the official Kimi Code and KIMI FORK extensions, preserving projects and sessions. Returning to the official extension does not remove them.

[README](https://github.com/MikalaiKryvusha/KIMI-KRINIK-VSCODE-EXTENSION#readme)
