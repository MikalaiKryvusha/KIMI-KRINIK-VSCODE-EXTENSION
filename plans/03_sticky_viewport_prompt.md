# Plan 03 — Sticky user prompt for the visible conversation turn

> **Created:** 2026-11-24
> **Parent:** owner's sticky-message request and `researches/54_chat_pipeline_reliability.md`
> **Status:** revised scroll-preservation and max-height/fade animation implemented; full extension 643/1 green; build 33 installed, real accumulated acceptance pending
> **Outbound:** final main-profile acceptance and release
> **Verification:** [TESTED: 2026-11-26 00:15 +03:00 · component boundaries and build-32 packaged UI smoke — `testcases/reports/2026-11-26_build_33_release_polish.md`; build-33 sticky observation pending]

## 1. Goal vector

**Achieve.** While scrolling a long conversation, the user sees a one-line sticky summary of the user prompt that owns the assistant response currently being read. The prompt can be expanded to full text and media and collapsed back without losing the reading position.

**Maintain.** The latest sent message does not automatically take over the sticky area while the user reads an older turn. Steering messages remain separate user sections. Internal hook results never become sticky candidates.

**Avoid.** Sticky flicker at turn boundaries, jumps to the newest prompt during reading, duplicated expanded content and hidden assistant responses behind a tall sticky block.

## 2. Acceptance criteria

| # | Scenario and fit criterion | Target |
|---|---|---|
| AC1 | Scroll through two assistant turns and read the active prompt identity | sticky changes to the user prompt owning the visible assistant turn |
| AC2 | Send a new prompt while viewing an older turn | sticky stays on the older turn until the viewport reaches the new turn |
| AC3 | Scroll back to the bottom | sticky belongs to the current turn |
| AC4 | Click «Развернуть» | full prompt text and its image/video thumbnails are visible; clicking a thumbnail opens the existing media viewer |
| AC5 | Click «Свернуть» | prompt returns to one line; scroll position and active prompt do not change |
| AC6 | Repeatedly cross a turn boundary and send steering messages | no sticky flicker, duplicate section or assistant avatar above the corresponding user prompt |
| AC7 | Conversation contains KAIF hook output | hook text never becomes a sticky candidate and remains invisible in the conversation |
| AC8 | Reload the session and expand a prompt | replay selects the same prompt by ID; expanded state is per prompt, not global |
| AC9 | Read the sticky prompt beside an assistant response | sticky spans the chat width as a rounded user-message bubble; a prompt that already fits one line is fully visible with no expand/collapse control or fade |
| AC10 | Expand a prompt and read an ordinary user message | the existing chevron rotates with reduced-motion-safe animation; the ordinary user bubble shows localized `HH:MM` send time to the left of the bubble |
| AC11 | Expand a sticky prompt | the collapse chevron sits in its top-right corner without a separate full-width control row; prompt text starts at the top content row and does not overlap the chevron |
| AC12 | Read a collapsed sticky prompt | the summary is raised and optically centered vertically inside the bubble rather than sitting low |
| AC13 | Open or return to the very beginning of the conversation | no sticky prompt is rendered at `scrollTop = 0`; scrolling into an assistant turn can activate it again |
| AC14 | Scroll with an expanded sticky prompt, then pin another prompt and return | wheel/touch scrolling preserves the expansion; only manual collapse or a different prompt becoming sticky closes it, and a replaced prompt's expansion does not reappear on return; height grows downward with text fade-in and collapses upward with fade-out |
| AC15 | Read the sticky bubble inside its container | small top/left/right padding leaves visible space around the bubble |
| AC16 | Expand and collapse a prompt that overflows one line | only an overflowing prompt gets a collapsed preview with one clear line and part of the second under a bubble-colored fade; max-height animates smoothly in both directions with reduced-motion support |

## 3. Reference findings

Claude Code uses `position: sticky` for its pinned user message. Related reports show a sticky selector and the need for click-to-jump navigation, collapse support and tall-content handling:

- `https://github.com/anthropics/claude-code/issues/36146`
- `https://github.com/anthropics/claude-code/issues/50366`
- `https://github.com/anthropics/claude-code/issues/49114`
- `https://github.com/anthropics/claude-code/issues/88512`

KIMI KRINIK will keep its own React/Zustand structure. The implementation is limited to webview conversation state and rendering; it does not change the engine, bridge, session persistence or outbound delivery contract.

## 4. Implementation steps

- [x] Add a component test for sticky identity: two user prompts with assistant sections, scroll the second into view, verify the second prompt is sticky while the first is not active.
- [x] Add a stable prompt identity to the timeline: prefer `promptId`, then local `clientId`, then the old replay content/order fallback. Steering gets its own user section.
- [x] Compute the active prompt from the assistant section nearest the reading viewport. Use one boundary rule and a small threshold/hysteresis so tiny scroll deltas do not flip the selection.
- [x] Render one sticky row above the transcript. Use `position: sticky; top: 0` with a background derived from VS Code and a bounded one-line text ellipsis.
- [x] Add per-prompt `expanded` state. Expanded content reuses existing text and `MessageMedia`/`MediaPreviewModal` rendering; collapsed content keeps only the one-line summary.
- [ ] Add optional click-to-jump to the beginning of the active turn without changing the current expanded state.
- [x] On new input, preserve the active prompt unless the viewport is at the bottom or the user scrolls to the new turn. Do not use the newest message ID as the sticky selector.
- [x] Localize «Развернуть» and «Свернуть» in EN/RU/ZH and ensure keyboard access, focus behavior and no horizontal overflow at the narrow Second Side Bar width.
- [x] Add regression tests for boundary flicker, media-only prompts, multiple steering messages, replay without IDs and hidden hook text.
- [x] Run `pnpm lint`, typecheck and the affected suites, then package and exercise the real isolated VSIX with mouse scrolling, expand/collapse, media viewer and WebP screenshots.
- [x] Move the ordinary user-message timestamp to the left side of its bubble and cover narrow-width rendering.
- [x] Overlay the expanded sticky chevron in the top-right corner, remove the empty full-width control row and verify that the first text line starts at the top without overlapping the button.
- [x] Raise the collapsed summary and center it optically within the sticky bubble; verify with computed geometry and a WebP screenshot.
- [x] Hide the sticky prompt at the top of the conversation and suppress its initial-render flash.
- [x] Preserve expanded sticky state during user wheel/touch scrolling; clear it only on manual collapse or active-prompt replacement, animate height downward/upward with text fade, and add small top/side padding around the bubble.

## 5. Verification by observation

1. Build a session with three user prompts, assistant responses of different heights and one steering message.
2. Scroll slowly from the first response to the third and record the active prompt at each boundary.
3. Expand the second prompt, open an image in the viewer, close it and collapse the prompt; compare the scroll anchor before and after.
4. Send a new message while the first response is on screen and verify the sticky identity does not change.
5. Return to the bottom, verify the current prompt, reload and repeat the same steps.
6. Verify the sticky background matches VS Code, the assistant response remains readable and no hook text appears.

## 6. Risks and boundaries

- Use one active prompt definition everywhere; do not introduce separate newest-message and viewport selectors.
- Prevent sticky from covering the response: collapsed height is one line; expanded content participates in the normal scroll flow rather than a fixed-height overlay.
- Do not persist expanded state in engine history. It is local UI state only.
- Do not add a second media preview implementation or a new public RPC method.
- If scroll-event calculations and React keys disagree, fix timeline identity first rather than adding timers or debounce-only concealment.

## 7. Decisions made without the owner

[AI] by mandate — the owner approved this feature and explicitly asked to record it as a task plan.

- Sticky follows the prompt owning the visible assistant response, not the newest prompt globally.
- Expanded state is per prompt; no global expand-all toggle is introduced.
- Sticky has no automatic jump to a new prompt while the user reads an older turn.
- Steering is eligible as a separate user prompt; internal hook output is excluded.
- Implemented in build 18; optional click-to-jump remains deliberately unimplemented. Accumulated main-profile acceptance is a separate open step.
- [OWNER] «ну сообщения юзера А) справа, б) фон имеют другой» · 2026-11-25 (чат): the sticky prompt uses the user-message visual identity.
- [OWNER] «так что стики нужно делать по аналогии с тем, как он в чате выглядит, чтобы сохранялась у юзера ассоциация», «не нужна ему кнопка развернуть, если он в одну строку», «и всю верхнюю панель можешь в цвет сообщения юзера превращать, такого цвета - на всю ширину чата такой пузырь сообщени юзера вверху» · 2026-11-25 (чат): sticky spans the chat with the user-message background; expansion is available only for truncated, multiline or media prompts.
- [OWNER] «давай время сообщений пользователя писать слева от них, вот тут» · 2026-11-25 16:46 +03:00 (чат): ordinary user-message send time belongs to the left of the bubble.
- [OWNER] «а в стики сообщении вверху не делать пустое место на всю ширину пузыря только ради кнопки сворачинвания - её можно как-то аккуратно в уголке вверху справа поместить так, чтобы тексту не мешала, но текст поднять вверх пузыря» · 2026-11-25 16:46 +03:00 (чат): the expanded sticky chevron overlays the top-right corner and the text moves up into the former control-row space.
- [OWNER] «в стики пузыре нужно текст выше поднять, по оптическому центру тяжести чтобы вертикально текст был в пузыре выровнен» · 2026-11-25 16:55 +03:00 (чат): the collapsed summary is optically centered vertically rather than sitting low.
