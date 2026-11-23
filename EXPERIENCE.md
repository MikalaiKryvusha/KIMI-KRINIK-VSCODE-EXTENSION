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
