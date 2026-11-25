# Research 55 — KIMI FORK working indicator and queue steering parity

> **Created:** 2026-11-24
> **Parent:** `bugs/19_tool_cards_hide_working_state.md`; `bugs/20_queue_steer_duplicate_submission.md`; `researches/54_chat_pipeline_reliability.md`
> **Status:** reference inventory complete; implementation and functional reproduction not complete
> **Outbound:** targeted fixes in `ChatArea`/working-state flow and `QueuedMessagesPanel`; no wholesale component port
> **Verification:** [TESTED: 2026-11-24 · installed KIMI FORK manifest and local reference source read; no functional comparison run yet]

## 1. Sources

- Installed reference manifest: `C:/Users/krinik/.vscode/extensions/gxgleo.kimicode-vscode-fork-0.9.23/package.json`, version 0.9.23.
- Read-only source snapshot already used by `researches/53`: `D:/work/ai_sandbox/KAIF/scratchpad/kimi-reference`, reference `gxgleo67/kimi-code-vscode-fork@4298cb7f0cbe25afc147bd7b2aaca8ae39b71390`.
- Owner requirements in `bugs/19` and `bugs/20` take precedence wherever the reference retains the same defect.

## 2. Working indicator inventory

| Reference behavior/component | Reference evidence | KIMI KRINIK current state | Required action |
|---|---|---|---|
| Pink face and breathing «Работаю…» label | `WorkingIndicator.tsx`; `styles/index.css` `.kimi-working-indicator`, `.kimi-wi-label` | Same CSS component and pink brand treatment already exist | Preserve the established component; do not invent a second indicator |
| Indicator belongs to the last assistant message while the turn is active | `ChatMessage.tsx:414-419` | Same conditional block at `ChatMessage.tsx:302-307` | Reproduce the state transition that makes it disappear instead of replacing the visual component |
| Only the last assistant message receives the active prop | `ChatArea.tsx:78` | `ChatArea.tsx:37` has the same role/index rule | Preserve last-message semantics; replay must not appear active |
| Scroller anchors live work at the bottom | `ChatArea.tsx:43-57,100-104`: session-keyed scroller, instant initial pin, tail-windowed messages | Current `ChatArea.tsx` lacks the session-keyed remount and tail-window anchoring | Treat sticky viewport behavior as a parity candidate only after a state-vs-viewport reproduction; do not port it blindly |
| `ToolResult` does not itself settle the turn | store event handlers | Current `ToolResult` also leaves `isStreaming` unchanged | Pin the actual false settlement or last-message transition before editing |

The reference does not use a separate working widget after every tool card. Its visible behavior comes from the last assistant message remaining active and anchored while the engine continues.

## 3. Queue lightning inventory

| Reference behavior/component | Reference evidence | Required action for the owner case |
|---|---|---|
| Lightning calls `bridge.steerChat(content)` | `QueuedMessagesPanel.tsx:46-50` | Keep the existing host/SDK path |
| Reference removes the row only after `result.ok` | `QueuedMessagesPanel.tsx:48-51` | Do not copy this delay: the owner requires an immediate optimistic response |
| Reference catches rejection and shows `queue.steerFailed` | `QueuedMessagesPanel.tsx:52-54` | Preserve failure feedback and restore the captured item at its original index |
| Reference has no duplicate in-flight guard | same function and button | Add an internal per-item guard; ten activations produce one call |
| Monorepo prior art restores rejected queue entries at their original index | `researches/54` §3, `packages/app-client/src/client/usePromptPipeline.ts` and `stores/prompt.ts` | Apply the proven optimistic remove/restore pattern without copying the app-client architecture |

## 4. Boundaries

- The working indicator bug is not declared a CSS defect: the reference and target components are materially the same.
- The queue defect is not declared an engine defect: the component alone can issue repeated calls.
- A false `isStreaming` settlement, a last-message mismatch and a sticky-viewport miss remain separate hypotheses until a store/DOM reproduction distinguishes them.
- No production code has been changed by this research document.
