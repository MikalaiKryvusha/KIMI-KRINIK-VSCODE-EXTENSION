# Plan 03 — Sticky user prompt for the visible conversation turn

> **Created:** 2026-11-24
> **Parent:** owner's sticky-message request and `researches/54_chat_pipeline_reliability.md`
> **Status:** approved by the owner; research accepted, implementation not started
> **Outbound:** implementation and isolated VS Code acceptance in a new chat; no production code changed in this closing chat
> **Verification:** [TESTED: 2026-11-24 · owner requirement and reference review; requirements/attribution lint green — implementation not run]

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

## 3. Reference findings

Claude Code uses `position: sticky` for its pinned user message. Related reports show a sticky selector and the need for click-to-jump navigation, collapse support and tall-content handling:

- `https://github.com/anthropics/claude-code/issues/36146`
- `https://github.com/anthropics/claude-code/issues/50366`
- `https://github.com/anthropics/claude-code/issues/49114`
- `https://github.com/anthropics/claude-code/issues/88512`

KIMI KRINIK will keep its own React/Zustand structure. The implementation is limited to webview conversation state and rendering; it does not change the engine, bridge, session persistence or outbound delivery contract.

## 4. Implementation steps

- [ ] Add a component test for sticky identity: two user prompts with assistant sections, scroll the second into view, verify the second prompt is sticky while the first is not active.
- [ ] Add a stable prompt identity to the timeline: prefer `promptId`, then local `clientId`, then the old replay content/order fallback. Steering gets its own user section.
- [ ] Compute the active prompt from the assistant section nearest the reading viewport. Use one boundary rule and a small threshold/hysteresis so tiny scroll deltas do not flip the selection.
- [ ] Render one sticky row above the transcript. Use `position: sticky; top: 0` with a background derived from VS Code and a bounded one-line text ellipsis.
- [ ] Add per-prompt `expanded` state. Expanded content reuses existing text and `MessageMedia`/`MediaPreviewModal` rendering; collapsed content keeps only the one-line summary.
- [ ] Add optional click-to-jump to the beginning of the active turn without changing the current expanded state.
- [ ] On new input, preserve the active prompt unless the viewport is at the bottom or the user scrolls to the new turn. Do not use the newest message ID as the sticky selector.
- [ ] Localize «Развернуть» and «Свернуть» in EN/RU/ZH and ensure keyboard access, focus behavior and no horizontal overflow at the narrow Second Side Bar width.
- [ ] Add regression tests for boundary flicker, media-only prompts, multiple steering messages, replay without IDs and hidden hook text.
- [ ] Run `pnpm lint`, typecheck and the affected suites, then package and exercise the real isolated VSIX with mouse scrolling, expand/collapse, media viewer and WebP screenshots.

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
- The work is planned for a new chat and remains unimplemented in this closing chat.
