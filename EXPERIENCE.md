# EXPERIENCE — the agent's accumulated experience

> The agent's growing log of lessons. **Externalized memory of *what works and what doesn't*** — so a
> fresh, context-less session (or an autonomous loop) never repeats a dead end. Consult it BEFORE a task;
> append to it AFTER a meaningful attempt (success **or** failure). Grep, don't scroll.
>
> **Tags live inline on every entry** (not in a central list) — so one grep finds the experiences directly:
> `grep '#loop' EXPERIENCE.md` · `grep -i '#context\|#build' EXPERIENCE.md` · `grep '❌' -A4 EXPERIENCE.md`
> · `grep 'EXP-0007' EXPERIENCE.md`. Reuse an existing tag where one fits (grep to see what's in use).
>
> **Entry format (keep it short and grep-friendly).** Newest on top. Every entry starts with a stable id,
> an ISO date, an outcome marker (`✅` / `❌` / `❌→✅`), and inline `#tags`:
>
> ```
> ### EXP-0001 · 2026-01-01 · ✅ · #tag #area
> class: <slug from the class list below — the UNIT OF RECURRENCE>
> **Context:** one line — what was being done.
> **Tried / did:** the approach, briefly.
> **Result:** ✅/❌ — what happened.
> **Lesson:** the reusable takeaway (the reason this entry exists).   → link: bugs/NN · ideas/NN · plans/NN
> **Repro:** the ready-to-run command/check that verifies or applies the lesson — a weak session
>   executes a pasted command reliably, an essay it won't act on. REQUIRED since 2.1: a lesson
>   with no Repro line is not accepted (field-proven: lessons with a Repro command get executed,
>   essay-lessons get read and ignored). If the lesson genuinely has no command, say what to
>   OBSERVE instead — but say it as an action.
> **Trigger:** for class-level lessons — the decision point that must invoke this lesson, as
>   "writing X → run Y" (the lesson names WHERE it applies, instead of hoping to be remembered).
> **Not for:** the lesson's validity range — where it does NOT apply. A documented lesson is still a
>   hypothesis; applied outside its range it kills good ideas.
> ```
>
> **A lesson that repeats is a lesson that failed as text.** When the same class recurs in NEW code
> after its entry was recorded, the journal has proven insufficient — the lesson MUST become
> executable (a linter rule, a guard, a gate), and the entry gains the line
> `mechanized: <the tool>`. Two strikes → a mechanism, never a third reminder.
>
> **The deadline is RUN, not remembered** (2.7, epic EL; origin issue #69 — a field audit of one
> project's journal: 14 of 15 failure classes recurred AFTER their lesson was written, five lessons
> written 6–17 times in different words, 5.8 % mechanized): `node .kaif/tools/kaif-experience-lint.mjs
> check` reads the `class:` field as the UNIT of recurrence and reddens on the SECOND failure entry of
> one class with no `mechanized:`, naming the class and both entries by id. Two fates clear it, both
> WRITTEN: name the guard in the entry (`mechanized: <the tool>`), or re-check the price once for the
> WHOLE class and declare it — `<!-- class-ok: <slug> — <why it is not cheaply possible> -->` (an empty
> declaration is itself a finding; the declared classes are printed on the summary line and that list
> only shrinks). A third record is never a fate. It also warns when
> `mechanized:` names a command this project does not contain, and when a slug is outside the list
> below; `--shrink EXP-NNNN` collapses a MECHANIZED entry to one line pointing at its guard (shows by
> default, `--yes` writes — the text itself stays in the git history). The command belongs in the
> closing ritual (`/end-chat-soft`).
>
> **The class list of this journal** — a CONTROLLED list, not a closed one: pick a slug from it, and
> when a lesson genuinely brings a new class, add the slug here in the same write (the linter warns
> about an unlisted slug, it never refuses). The starter list below is what a field audit had already
> measured (origin issue #69) — replace and grow it with your project's own classes.
>
> <!-- classes: question-already-answered, guard-not-proven-against-threat, shown-as-link,
>      claim-before-evidence, owner-decision-not-applied, text-in-agents-world,
>      etalon-from-dirty-tree, shell-lied, escaping-layer, twins-missed,
>      field-dropped-in-rebuild, red-accepted-unread, defaults-overwrite-session-state,
      late-cancellation-masquerades-as-live-flip -->
>
> | Class slug | The failure it names |
> |---|---|
> | `question-already-answered` | the owner is asked what his own past word, the goal doc or a run already decided |
> | `guard-not-proven-against-threat` | a guard shipped without being seen red on the threat it claims to stop |
> | `shown-as-link` | showing replaced by a link or a path instead of the thing itself |
> | `claim-before-evidence` | a claim written wider than the observation behind it |
> | `owner-decision-not-applied` | a decision the owner gave is recorded and not carried into the artifact |
> | `text-in-agents-world` | text written for the agent's own world instead of the owner's |
> | `etalon-from-dirty-tree` | a reference/etalon captured from a tree that was not clean |
> | `shell-lied` | the shell or the tool swallowed/rewrote what was passed to it |
> | `escaping-layer` | one escaping level lost between the tool and the file |
> | `twins-missed` | one of two layers/copies moved and the twin stayed behind |
> | `field-dropped-in-rebuild` | a field or section silently lost when an artifact was regenerated |
> | `red-accepted-unread` | a failing test labelled "baseline" or "flaky" before its assertion diff was read |
> | `defaults-overwrite-session-state` | a global default is applied over a restored session's own persisted state |
> | `late-cancellation-masquerades-as-live-flip` | cleanup after the provider response is mistaken for immediate cancellation on a live config change |
>
> The `#tags` are **trigger-tags**: before a task, grep by the task's tags and QUOTE the relevant
> lessons in your report (id + one line) — or state "no relevant lessons". An unquoted recall is
> unverifiable; `/fable-judge` checks for this line.
>
> Skill: `/experience` (capture a lesson · recall relevant lessons).

## Entries

### EXP-0011 · 2026-11-24 · ❌→✅ · #vscode #testing #windows
class: claim-before-evidence
mechanized: node .tmp/k5-close.mjs
**Context:** several VSIX builds appeared to fail identically in an isolated VS Code window.
**Tried / did:** compared process start time, log-session path and installed/source hashes before changing product code again.
**Result:** ❌→✅ — Playwright `browser.close()` had only disconnected the CDP client; raw CDP `Browser.close` terminated the old process, and the next build passed its scoped queue check.   → link: bugs/20_queue_steer_duplicate_submission.md
**Lesson:** a package hash proves the installed bytes, never the running build; before a live verdict require a new main-process start and log session.
**Repro:** run `node .tmp/k5-close.mjs`, then verify the previous PID is absent before `node .tmp/k5-vscode-ui.mjs launch`.
**Trigger:** reinstalling a VSIX into a running CDP-controlled VS Code → prove process replacement before observing behavior.
**Not for:** claiming that unit or jsdom contracts alone prove the real running product.

### EXP-0008 · 2026-11-24 · ❌→✅ · #chat #lifecycle #testing
class: twins-missed
mechanized: pnpm exec vitest run --reporter=agent apps/vscode/test/webview/chat-store.test.ts apps/vscode/test/settings-store.test.ts
**Context:** immediate optimistic bubbles were added to the first-send and steering paths.
**Tried / did:** propagated a client-generated ID through store, bridge, runtime and events; preserved model and ID in preflight recovery and host-idle dequeue.
**Result:** ❌→✅ — the first optimistic version lost the model during error recovery; the existing settings-store regression caught it, and all 571 extension checks plus one skip now pass.   → link: bugs/22_first_send_stuck_in_steering_queue.md
**Lesson:** optimistic UI must carry identity from the first action through every later event, and every older error/retry path must preserve that identity and its accompanying model.
**Repro:** `pnpm exec vitest run --reporter=agent apps/vscode/test/webview/chat-store.test.ts apps/vscode/test/settings-store.test.ts` — immediate entries reconcile once and recovery keeps the model.
**Trigger:** adding an optimistic message, retry, queue or recovery path → prove identity and model preservation before shipping.
**Not for:** claiming that every `running | queued | blocked` SDK state or two-client replay case is already verified; those remain separate acceptance work.

### EXP-0009 · 2026-11-24 · ✅ · #i18n #vscode
class: text-in-agents-world
mechanized: pnpm exec vitest run --reporter=agent apps/vscode/test/webview/i18n.test.ts
**Context:** the conversation-history Delete action stayed English after the interface switched languages.
**Tried / did:** reused the existing `common.delete` dictionary entry and added assertions for EN/RU/ZH.
**Result:** ✅ — the action now follows the active interface language; a later live ZH review caught `Control Panel` and both ZH/RU failure toasts still English, so the same guard now pins those strings too.   → link: apps/vscode/webview-ui/src/components/SessionList.tsx · apps/vscode/webview-ui/src/i18n/zh.ts
**Lesson:** check action labels inside overflow menus, dialogs and failure toasts, not only the visible composer and main settings.
**Repro:** `pnpm exec vitest run --reporter=agent apps/vscode/test/webview/i18n.test.ts` — all dictionaries share one key set; `common.delete`, `controlPanel.title` and the ZH/RU Control Panel failure toasts are localized.
**Trigger:** adding or moving a user-facing action → reuse the existing dictionary and assert each language.
**Not for:** replacing visual acceptance of every dialog; this lesson covers the localization mechanism.

### EXP-0010 · 2026-11-24 · ❌→✅ · #voice #vscode #testing
class: text-in-agents-world
mechanized: pnpm exec vitest run --reporter=agent apps/vscode/test/webview/attention.test.ts
**Context:** attention speech could play without identifying the speaker/project or the addressee.
**Tried / did:** prefixed the phrase once at the shared attention boundary for Glass and browser speech, preserving idempotence and non-voice behavior.
**Result:** ❌→✅ — red tests became 20/20; installed VSIX delivered the full phrase to Glass and constructed the same browser utterance.   → link: bugs/17_DONE_attention_voice_missing_identity.md
**Lesson:** spoken owner-facing text needs the same identity rule at every delivery route, including fallbacks and previews.
**Repro:** `pnpm exec vitest run --reporter=agent apps/vscode/test/webview/attention.test.ts apps/vscode/test/attention-handler.test.ts apps/vscode/test/webview/sounds.test.ts` — both routes carry the prefix exactly once.
**Trigger:** adding a voice route or attention event → test the actual phrase before the transport, including the fallback.
**Not for:** claiming the owner heard and accepted the sound; audible verification is separate.
**Superseded:** dynamic attention speech and the owner-name prefix were later replaced by packaged event/language recordings with a localized project identity; see `GOAL.md` criterion 7 and `bugs/17_DONE_attention_voice_missing_identity.md`.

### EXP-0007 · 2026-11-24 · ❌→✅ · #vscode #testing #assets
class: guard-not-proven-against-threat
mechanized: pnpm exec vitest run --reporter=agent apps/vscode/test/webview/header.test.tsx
**Context:** the header robot was broken in the installed VSIX while its component test mocked the resource URL hook.
**Tried / did:** removed the mock, proved the original dist URL red, used the packaged resources path and inspected the rebuilt VSIX live.
**Result:** ❌→✅ — the real hook guard and live `naturalWidth`/WebP observations passed.   → link: bugs/07_DONE_header_robot_resource_path.md
**Lesson:** a resource test must use the production resolver and the packaged asset location; a mocked path can be green while the real image is absent.
**Repro:** `pnpm exec vitest run --reporter=agent apps/vscode/test/webview/header.test.tsx` — the real hook must resolve `resources/krinik-robot-logo.png`; inspect image load state in the installed VSIX.
**Trigger:** adding or moving a webview resource → run the unmocked resolver test and inspect the packaged image in the real Extension Host.
**Not for:** replacing live visual acceptance with the unit check; it covers the path defect only.

### EXP-0006 · 2026-11-24 · ✅ · #compaction #config #testing
class: late-cancellation-masquerades-as-live-flip
mechanized: pnpm exec vitest run --reporter=agent packages/agent-core-v2/test/agent/fullCompaction/fullCompaction.test.ts -t "autoCompact becomes false"
**Context:** Auto Compact OFF needed to cancel an active automatic operation immediately without touching manual compaction.
**Tried / did:** the first test asserted cancellation only after releasing the provider response; history-change cleanup made it pass without a live subscription. Strengthened it to require `full_compaction.cancel` before release.
**Result:** ✅ — the strengthened assertion was red before the `loopControl` subscription and green after it; the manual task still completed.   → link: testcases/reports/2026-11-24_inflight_auto_compact_off.md
**Lesson:** a mid-flight flip test must observe cancellation before the deferred response, or later history cleanup can masquerade as the intended live behavior.
**Repro:** `pnpm exec vitest run --reporter=agent packages/agent-core-v2/test/agent/fullCompaction/fullCompaction.test.ts -t "autoCompact becomes false"` — cancellation precedes release and manual completion follows the same flip.
**Trigger:** testing cancellation on a config change, cancellation, or other in-flight event → assert the event before releasing the deferred operation, not only after it.
**Not for:** verifying only that a late response is discarded; that is a separate guarantee and does not prove immediate cancellation.

### EXP-0005 · 2026-11-24 · ✅ · #vscode #config #sessions
class: defaults-overwrite-session-state
mechanized: pnpm exec vitest run --reporter=agent apps/vscode/test/kimi-runtime.test.ts apps/vscode/test/webview/chat-store.test.ts
**Context:** the last Auto / Manual / YOLO choice had to become the default for new chats and VS Code restarts without changing restored sessions.
**Tried / did:** kept the engine default out of per-session resume state; new conversations clear the old override, while runtime applies the canonical default only when creating a session.
**Result:** ✅ — red-to-green UI/runtime guards and a real SDK second-harness reload plus fresh Auto session passed.   → link: testcases/reports/2026-11-24_permission_defaults.md
**Lesson:** a global default belongs at new-session creation and initial display; never seed every request from it, because that silently overwrites a restored session's own state.
**Repro:** `pnpm exec vitest run --reporter=agent apps/vscode/test/kimi-harness.integration.test.ts apps/vscode/test/webview/chat-store.test.ts` — real default persistence and the new-conversation override boundary pass.
**Trigger:** adding or changing a persisted default for model, permission, effort, plan, or another session-scoped setting → separate new-session defaults from resume metadata before editing stores.
**Not for:** an explicit user command to change the current session; that command should update its live state and, when required, the future default through the canonical handler.

### EXP-0004 · 2026-11-24 · ❌→✅ · #hooks #kaif #testing
class: claim-before-evidence
mechanized: node .kaif/hooks/context-window.mjs --selftest
**Context:** Kimi `--alive` had no context-window state, and I generalized that to "no project hook ran" across two chats.
**Tried / did:** compared the session-start time with the independent `.kaif/kimi-refresh.json` marker and read the intentional dormant exits; added CLI-level Auto Compact ON and built-in-ownership cases.
**Result:** ✅ — SessionStart had run; the false total-failure diagnosis is fixed, and a fresh official Kimi session has green `--alive` plus a real wire measurement.   → link: bugs/KAIF/04 · upstream #204
**Lesson:** one subsystem's missing state never proves a whole pipeline failed; check an independent hook marker and every intentional early exit before naming a global outage or prescribing a reload.
**Repro:** `node .kaif/hooks/context-window.mjs --selftest` — both dormant cases must reject `NOT running`; on a live session also read `.kaif/kimi-refresh.json` before interpreting `--alive`.
**Trigger:** about to claim that hooks, hooks-of-one-event, or a whole agent integration did not run → check independent evidence and early exits first.
**Not for:** a direct process spawn failure with its own error output; that is already primary evidence about the failed process.

### EXP-0003 · 2026-11-23 · ❌→✅ · #voice #windows #kaif
class: text-in-agents-world
mechanized: node .kaif/hooks/kimi-permission-call.mjs --selftest
**Context:** a voice request used an English phrase, omitted the owner/project names and fell back to the generic KAIF beep path.
**Tried / did:** inspected the actual machine engine and KUMM's accepted voice rules, then wrote a Cyrillic-only phrase file with the owner and project names.
**Result:** ✅ — the local Silero + Glass route and `soft voice:` output were observed; the permanent route now lives in `HOUSE_RULES.md` R1.
**Lesson:** voice is an owner-facing surface with its own existing route: read `HOUSE_RULES.md` and the machine's voice rules before calling; never synthesize an English argv phrase or omit the calling identity.   → link: `D:/work/ai_sandbox/KUMM/HOUSE_RULES.md` §13
**Repro:** `node .kaif/hooks/kimi-permission-call.mjs --selftest` — then inspect the phrase file against `HOUSE_RULES.md` R1 and read the `soft voice:` line on every real call.
**Trigger:** any voice call or spoken narration → open `HOUSE_RULES.md` R1 and `D:/work/ai_sandbox/tools/silero_tts/VOICE_RULES.md` first.
**Not for:** text-only chat replies, dry runs and technical logs that are not played as sound.

### EXP-0002 · 2026-11-23 · ❌→✅ · #testing #windows #flaky #vscode
class: red-accepted-unread
**Context:** `apps/vscode/test` carried three "Windows baseline" failures and one "flaky" test across several sessions.
**Tried / did:** read each assertion diff instead of re-running: two expected native `\` paths where the engine reports `/`
(pathe), one called real `statSync` on a made-up UNC share, and the "flaky" one caught a real committed out-of-range selection.
**Result:** ✅ — fixed in `aaf2e75b7` and `02a18c159`; the suite is 0 failed on Windows, so a red test is a signal again.
**Lesson:** a "baseline" or "flaky" label is a hypothesis about the failure; the assertion diff decides it, and a standing red
list hides every new regression behind it.   → link: (none)
**Repro:** `pnpm exec vitest run --reporter=agent apps/vscode/test` — expect `0 failed`; on any red, read its `- Expected / + Received` block before labelling it.
**Trigger:** about to write "baseline", "known failure" or "flaky" about a test → open its failure diff first.
**Not for:** failures that need hardware or services this machine does not have — those are recorded with the missing piece named.
none-cheap: the label lives in chat and status prose, and a grep for "baseline" would also hit the ratchet baseline files; the zero-failure suite is what makes a new red visible.

### EXP-0001 · 2026-01-01 · ✅ · #example #meta
**Context:** first task after KAIF was deployed into this project (example entry — replace with real ones).
**Tried / did:** wrote the first real lesson here in the canonical format.
**Result:** ✅ — the experience log is live and greppable.
**Lesson:** capture lessons at the level of *approach* (what worked / what to avoid), not defect detail
(that lives in `bugs/`); one short entry beats a long story.   → link: (none)
