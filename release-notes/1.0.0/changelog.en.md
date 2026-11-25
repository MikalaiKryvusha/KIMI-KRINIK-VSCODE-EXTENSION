# KIMI KRINIK 1.0.0

2026-11-25

KIMI KRINIK 1.0.0 combines the official Kimi Code 2.7.2 engine with the KIMI FORK interface and adds independent context management, reliable follow-ups and a three-language UI.

## What's new

- Turn off automatic compaction, including an operation already in progress. Manual `/compact` remains available.

- Use Context Window Control with configurable thresholds, without requiring KAIF. Threshold messages hand work over to a new chat before the window overflows.

- Send follow-ups immediately with AUTO STEER or restore the ordinary queue. Ordered batches join once, and rejected messages return to their original positions.

- Send images, video and media-only prompts with clickable thumbnails and the same viewer after replay. Preserve manual line breaks and blank lines.

- Keep the prompt that owns the visible response on top. Expand and collapse it with an animated chevron in the corner, and see localized send times to the left of user bubbles.

- Always start an empty chat with the full localized shortcut guide and the pink robot centered beside KIMI without clipping on narrow sidebars.

- Open the Skill picker in Control Panel: browse a scrollable two-line list with localized descriptions, then send a skill immediately with Steer or queue it with Steer OFF.

- Hide sticky prompts at the top of the chat and collapse them on user scrolling or when another prompt becomes sticky. Steering messages sit above one trailing Working indicator until real content arrives.

- Choose models and reasoning effort through one picker with search and favorites. Explicit MAX/XHigh choices persist, while resumed sessions keep their own effort.

- Use English, Russian or Chinese with a selected-first language dialog and localized interface controls.

- Configure a sound and volume per event with prerecorded clips in all three languages. Sound selectors remain editable after choosing Off.

- Use responsive Control Panel actions, live status panels, the Working indicator and the pink KIMI KRINIK robot. Read the version and build number in Action Menu.

- Keep history stable during replay and late request-setup errors. Visible responses remain in the conversation through streaming finalization, internal instructions do not appear as assistant text during live work or history replay, and unrelated turns are not deleted.

## Verification

Build 25 has 621 passing checks and 1 skipped check, green typecheck and lint, and successful packaging and static checks. Isolated packaged build 25 passed the fixed welcome layout, localized skill picker, immediate Steer, queued skill selection, sticky top/collapse boundaries and ON/OFF tooltip scenarios. Build 25 is installed on the main profile with matching extension and webview hashes; acceptance there requires the running Extension Host to be restarted.

## Install

Download `kimi-code-win32-x64.vsix` and choose **Extensions → ⋯ → Install from VSIX…**. KIMI KRINIK installs beside the official Kimi Code and KIMI FORK extensions, preserving projects and sessions. Returning to the official extension does not remove them.

[README](https://github.com/MikalaiKryvusha/KIMI-KRINIK-VSCODE-EXTENSION#readme)
