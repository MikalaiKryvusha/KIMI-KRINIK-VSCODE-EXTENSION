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
      late-cancellation-masquerades-as-live-flip, self-host-reload, terminal-state-not-propagated,
      session-env-contamination -->
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
> | `self-host-reload` | a live acceptance reload restarts the Extension Host that is executing the agent itself |
| `terminal-state-not-propagated` | a periodic or queued trigger fires without knowing the session's terminal lifecycle state |
| `session-env-contamination` | an inherited agent-session variable redirects a test from its fixture to the live session |
>
> The `#tags` are **trigger-tags**: before a task, grep by the task's tags and QUOTE the relevant
> lessons in your report (id + one line) — or state "no relevant lessons". An unquoted recall is
> unverifiable; `/fable-judge` checks for this line.
>
> Skill: `/experience` (capture a lesson · recall relevant lessons).

## Entries

### EXP-0028 · 2026-11-26 · ❌→✅ · #testing #kimi #environment
class: session-env-contamination
mechanized: env -u KIMI_CODE_SESSION_ID node D:/work/ai_sandbox/KAIF/tools/sandbox/s14-refresh-hooks.mjs
**Context:** the KAIF core run failed `--measure` and `--alive` when launched from an active Kimi session.
**Tried / did:** read the failing output and the process environment instead of changing the hook; `KIMI_CODE_SESSION_ID` named the live session, so the fixture selected the real wire and config instead of its own.
**Result:** ❌→✅ — the complete affected s14 suite passed after only that variable was removed. The full core suite still has unrelated s01/s22 baseline failures and was not called green.
**Lesson:** when a sandbox result contradicts the change, print the inherited agent-session variables before assigning the red to the product; clear the proven contaminant and rerun the affected suite, never the other way around.   → link: testcases/reports/2026-11-26_refresh_after_closure.md (origin)
**Repro:** in `D:/work/ai_sandbox/KAIF`, run `env -u KIMI_CODE_SESSION_ID node tools/sandbox/s14-refresh-hooks.mjs`.
**Trigger:** running KAIF sandbox suites from a Kimi-controlled process, especially after an unexpected measurement or routing failure.
**Not for:** genuine product failures or stripping unrelated configuration; only the observed contaminant is removed.

### EXP-0027 · 2026-11-26 · ❌→✅ · #kaif #hooks #closure #refresh
class: terminal-state-not-propagated
mechanized: node .kaif/hooks/stop-farewell-capture.mjs --selftest
**Context:** a completed chat closure was followed by a 101-minute timer that re-read the canon and repeated the full creed/prayer.
**Tried / did:** the timer and pending SessionStart paths had no closed-session predicate. The real wire also showed that entering the closing skill and writing the farewell occur in different turns, with `content.part` rather than only appended assistant records.
**Result:** ❌→✅ — farewell-scoped `closedSessionIds` now suppress both automatic paths; 20/20 hook checks and 6/6 real-wire observations pass in the deployed copy and the KAIF source.   → link: bugs/KAIF/06 · origin bugs/160
**Lesson:** periodic and queued triggers must consume terminal lifecycle state; use actual farewell completion, not entry into a closing skill, and preserve that state across later owner turns and StopFailure.   → link: testcases/reports/2026-11-26_refresh_after_closure.md
**Repro:** run the mechanized selftest and the real-wire replay named in the report; new sessions and explicit `/resume` must remain active.
**Trigger:** adding a timer, pending-event injector or lifecycle observer → enumerate terminal states and prove same-session silence plus new-session behavior.
**Not for:** the unfinished-closure latch and soft→force escalation covered by origin bugs/150 and EXP-0222.

### EXP-0026 · 2026-11-26 · ❌ · #vscode #testing #action:reload-window
class: self-host-reload
none-cheap: the incident came from an ad hoc PowerShell UI command outside existing tool gates; the scripts created for that route are removed and `HOUSE_RULES.md` R7 carries the safe route
**Context:** final build-45 acceptance attempted `Developer: Reload Window` on the owner's main VS Code window while the active KIMI KRINIK session was executing there.
**Tried / did:** set the focused command-palette value to `>Developer: Reload Window` and sent Enter through UI Automation.
**Result:** ❌ — the Shell call was interrupted without a recorded result, the active chat restarted, and no running-build observation was produced.
**Lesson:** reloading a window that hosts the current agent terminates the observer as well as the observed extension; use the isolated CDP profile, or schedule the main-window restart after the active session ends / from a separate session.   → link: HOUSE_RULES.md R7
**Repro:** do not reproduce the interruption; before a reload, OBSERVE the target profile and session ownership and use `.tmp/k5-vscode-ui.mjs launch` for the isolated path.
**Trigger:** considering `Developer: Reload Window`, a process restart or a native command that reloads the current workbench → stop if it hosts the active agent and switch to the isolated profile.
**Not for:** restarting the disposable isolated VS Code process after killing its recorded PID tree; EXP-0024 covers that route.

### EXP-0025 · 2026-11-26 · ❌→✅ · #kaif #testing #forensics
class: claim-without-tool-call
mechanized: grep '"name":"Write"' <session agents/main/wire.jsonl for the marker and compare against the chat claim's time
**Context:** the hourly refresh timer kept reporting a stale `.kaif/refresh-marker.json` right after a claimed refresh (bugs/34).
**Tried / did:** suspected persistence/path/hook writers first, then read the session's `wire.jsonl`: the only Write calls for the marker were at 18:04, 18:56 and 21:15, while the chat at 21:09 claimed a rewrite. A filesystem search for the 21:09 content found zero files.
**Result:** ❌→✅ — the 21:09 write was claimed but never executed; the timer was right. A controlled Write-tool write persisted and was read back.   → link: bugs/34_DONE_refresh_marker_write_lost.md
**Lesson:** when a file write seems lost, check the session's wire log for the actual tool call before suspecting persistence, paths or other writers — the claim may have been made without the call. The wire log's tool calls are the decisive observation, not the agent's own report.
**Repro:** `grep '"name":"Write"' <session wire.jsonl` for the file, then a controlled Write-tool write + readback of content and mtime.
**Trigger:** a witness/marker/marker file that looks reverted or never-written → inspect the tool-call log first, then controlled reproduction.
**Not for:** blaming the timer or the hooks when the file is genuinely stale; they reported the actual state correctly.

### EXP-0024 · 2026-11-26 · ❌→✅ · #vscode #testing #windows
class: stale-stand-served-old-build
mechanized: read the running build from the action menu `v1.0.0 (NN)` before any isolated acceptance; kill the isolated VS Code by `taskkill //PID <code.pid> //T //F` before relaunching
**Context:** the isolated build-42 acceptance probed the webview and saw build-40 classes although build 42 was installed.
**Tried / did:** Playwright `browser.close()` over `chromium.connectOverCDP` was used to stop the isolated instance after build 40; the next launch then attached to the STILL-RUNNING old process, whose CDP port 9223 kept serving the old build.
**Result:** ❌→✅ — the action menu proved `v1.0.0 (40)`; killing the old PID tree and relaunching gave build 42 and all probes passed.   → link: testcases/reports/2026-11-26_build_42_sticky_animation_subagent_chevron.md
**Lesson:** `browser.close()` over a CDP connection closes the connection, not the VS Code process; a new launch then attaches to the stale instance. Kill the isolated instance by PID tree, and read the running build number from the action menu before trusting any isolated measurement.
**Repro:** install a new VSIX, `taskkill` the previous isolated PID from `.tmp/k5-vscode/code.pid`, relaunch, then check `v1.0.0 (NN)` in the action menu.
**Trigger:** any isolated VS Code acceptance or a DOM reading that contradicts the just-installed build → verify the running process before suspecting the code.
**Not for:** claiming the main profile's running build from its installed VSIX hash either; the same rule applies there.

### EXP-0023 · 2026-11-26 · ❌→✅ · #vscode #testing #windows
class: twins-missed
mechanized: pnpm exec vitest run --reporter=agent apps/vscode/test/webview/chat-message.test.tsx
**Context:** real packaged VS Code clipboard verification used nested webviews and userEvent-driven component coverage.
**Tried / did:** first instrumented the outer wrapper's `navigator`, then used the inner `window.navigator`; installed the product clipboard spy after `userEvent.setup()` replaced it.
**Result:** ❌→✅ — the outer capture was empty; the inner capture observed exactly `K35 second answer`, and the component suite passes.   → link: bugs/36 · testcases/reports/2026-11-26_build_36_assistant_text_actions.md
**Lesson:** instrument the API in the same execution world as the product, and install a clipboard spy after userEvent's setup stub.
**Repro:** run the mechanized chat-message suite; for the packaged path use the inner-window setup/read probes named in the build-36 report.
**Trigger:** observing a browser API in a nested VS Code webview or testing clipboard behavior → verify the execution world and the order of test-library setup.
**Not for:** claiming that an intercepted renderer write proves the OS clipboard stayed untouched.

### EXP-0022 · 2026-11-26 · ❌→✅ · #chat #steer #testing
class: field-dropped-in-rebuild
mechanized: pnpm exec vitest run --reporter=agent apps/vscode/test/event-adapter.test.ts apps/vscode/test/session-runtime.test.ts apps/vscode/test/webview/chat-store.test.ts
**Context:** a late original assistant response could arrive after the user had created an optimistic steering turn.
**Tried / did:** reproduced the race with turn 0 held until after steer, found the adapter dropping turnId and the store defaulting to the last assistant, then carried additive turnIndex metadata through text/thinking and completion.
**Result:** ❌→✅ — the original delta and completion were red on the broken route and green afterward; the final extension suite is 643/1.   → link: bugs/25
**Lesson:** turn-scoped identity must survive every adapter boundary; a late event cannot safely use the currently last UI record when a newer optimistic turn exists.
**Repro:** run the mechanized suites above; the late-original-response and prompt-only reconciliation cases must pass.
**Trigger:** adding optimistic turns or translating SDK events → preserve turn identity through the public consumer and test arrival after a newer turn.
**Not for:** claiming the owner's accumulated profile or a true held-response VSIX run before those observations exist.

### EXP-0021 · 2026-11-25 · ❌→✅ · #chat #steer #testing
class: text-in-agents-world
mechanized: pnpm exec vitest run --reporter=agent apps/vscode/test/webview/chat-area.test.tsx -t "steering presentation"
**Context:** the first steering presentation fix kept Working inside the original assistant, leaving the steering user message below the animation.
**Tried / did:** followed the owner's explicit visual order and asserted DOM position: steering user entry first, one trailing Working indicator second; normal post-steer assistant rendering is unchanged.
**Result:** ❌→✅ — the new order test was red before the change and green afterward; full extension is 621/1.   → link: bugs/32 · bugs/19
**Lesson:** stable identity is not enough for perceived stability; the live indicator must also follow the user's chronological position in the timeline.
**Repro:** `pnpm exec vitest run --reporter=agent apps/vscode/test/webview/chat-area.test.tsx -t "steering presentation"` — the steering text precedes trailing Working and post-content Working belongs to the real assistant.
**Trigger:** placing Working around optimistic user/assistant entries → assert actual DOM order, not only which record owns the indicator.
**Not for:** reverting to a second empty KIMI header or inferring packaged acceptance from jsdom alone.

### EXP-0020 · 2026-11-25 · ❌→✅ · #skills #i18n #testing
class: field-dropped-in-rebuild
mechanized: pnpm exec vitest run --reporter=agent packages/node-sdk/test/session-skills.test.ts apps/vscode/test/kimi-harness.integration.test.ts
**Context:** localized skill descriptions were lost between YAML frontmatter and the Control Panel inventory.
**Tried / did:** reused the existing parser through an additive SDK metadata reader, flattened the nested metadata block at that boundary and asserted real files through host inventory and UI fallbacks.
**Result:** ❌→✅ — parser and host checks were red before implementation; the final parser/inventory/UI checks and extension suite 621/1 pass.   → link: ideas/02 · packages/node-sdk/src/skill-metadata.ts
**Lesson:** when a summary drops source metadata, project the needed fields at one existing parser boundary instead of writing a second parser or widening every external protocol.
**Repro:** `pnpm exec vitest run --reporter=agent packages/node-sdk/test/session-skills.test.ts -t "reads localized descriptions"` and `pnpm exec vitest run --reporter=agent apps/vscode/test/kimi-harness.integration.test.ts -t "carries localized skill descriptions"` — both must pass.
**Trigger:** adding localized fields to an existing inventory → inspect nested metadata projection and test the real source file through the public consumer.
**Not for:** the unrelated old Windows path-separator failure recorded in bugs/33, or claiming packaged acceptance without a VSIX run.

### EXP-0019 · 2026-11-25 · ❌→✅ · #chat #steer #testing
class: guard-not-proven-against-threat
mechanized: pnpm exec vitest run --reporter=agent apps/vscode/test/webview/chat-area.test.tsx apps/vscode/test/webview/chat-store.test.ts
**Context:** a steering send moved the robot and Working indicator into a new empty assistant before real content arrived.
**Tried / did:** preserved the optimistic event target but deferred only its presentation; asserted robot/indicator ownership before and after content plus TurnBegin/idle reveal.
**Result:** ❌→✅ — three checks were red before the fix; targets are 42/42 and the full extension suite is 615/1.   → link: bugs/32 · bugs/16 · bugs/19
**Lesson:** an optimistic record needed for future events does not have to be visible immediately; separate event identity from presentation readiness and test ownership before and after real content.
**Repro:** `pnpm exec vitest run --reporter=agent apps/vscode/test/webview/chat-area.test.tsx apps/vscode/test/webview/chat-store.test.ts` — one pre-content robot and correct post-content ownership must pass.
**Trigger:** adding an optimistic assistant placeholder → define which assistant owns Working before content and test durable/fallback reveal paths.
**Not for:** claiming steering delivery or accumulated-profile visual acceptance from component evidence alone.
**Superseded:** the owner later required the steering user entry above one trailing Working indicator, rather than the original assistant retaining it; see EXP-0021.

### EXP-0018 · 2026-11-25 · ❌→✅ · #chat #viewport #testing
class: guard-not-proven-against-threat
mechanized: pnpm exec vitest run --reporter=agent apps/vscode/test/webview/chat-area.test.tsx
**Context:** a sticky prompt appeared at the conversation top and expanded sticky geometry fed scrolling oscillation.
**Tried / did:** read the selection and expansion owners instead of reproducing live; added top, wheel/touch and ownership-return boundaries with red-first component checks.
**Result:** ❌→✅ — all three checks failed before the fix and passed afterward; the full extension suite is 613/1.   → link: bugs/30 · bugs/31 · plans/03
**Lesson:** a viewport overlay needs explicit initial, boundary and ownership-reset states; testing only its steady selected state misses duplicate and feedback-loop defects.
**Repro:** `pnpm exec vitest run --reporter=agent apps/vscode/test/webview/chat-area.test.tsx` — top, collapse and ownership-return cases must pass.
**Trigger:** adding or changing a sticky/overlay viewport element → test initial render, both scroll boundaries and replacement/return ownership.
**Not for:** claiming packaged or accumulated-profile acceptance without a real VSIX observation.

### EXP-0017 · 2026-11-25 · ❌→✅ · #voice #windows #kaif
class: text-in-agents-world
mechanized: node .kaif/tools/contour/voice-soft.mjs --selftest
**Context:** a restart call used the generic review contour and produced its beep/system-voice route instead of the owner's standing Glass route.
**Tried / did:** compared `review.mjs` with `voice-soft.mjs` and the configured `contour.voiceFileTool`, then replayed the same phrase through the direct Silero + Glass command.
**Result:** ❌→✅ — `soft voice: F:\Temp\soft-voice-q4k7zv6y\soft.wav` and exit 0 were observed; R1 now explicitly routes owner calls through `voice-soft.mjs`, not `review.mjs --call`.   → link: HOUSE_RULES.md R1 · EXP-0003
**Lesson:** when a project has a configured file-based voice route, the generic review caller is not an equivalent shortcut; use the wrapper that actually reads that configuration.
**Repro:** `node .kaif/tools/contour/voice-soft.mjs --selftest`; for a real call write the phrase file, then `node .kaif/tools/contour/voice-soft.mjs --file <file> --play` and read `soft voice:` plus exit 0.
**Trigger:** any owner call → choose the R1 file-based Glass route before the generic review contour.
**Not for:** product notification sounds, dry runs, selftests, or claiming the owner heard the audio; those remain separate surfaces and observations.

### EXP-0016 · 2026-11-25 · ❌→✅ · #chat #markdown #hooks #testing
class: guard-not-proven-against-threat
mechanized: pnpm exec vitest run --reporter=agent apps/vscode/test/webview/chat-message.test.tsx apps/vscode/test/event-adapter.test.ts
**Context:** an assistant-container check stayed green while the owner saw text vanish, and the replay-only hook filter left the live hook path visible.
**Tried / did:** measured response-text frames instead of container counts, asserted DOM identity across finalization, and exercised the real main-agent/live-hook adapter plus packaged VSIX delivery.
**Result:** ❌→✅ — both finalization variants remounted before stable renderer identities; build 20 showed live hook text, builds 21/22 hid it while model input retained it. Full extension 610/1 is green.   → link: bugs/25 · bugs/15 · testcases/reports/2026-11-25_chat_rendering_build_22.md
**Lesson:** assert the exact perceptible thing that can disappear and cover the live adapter as well as replay; a surviving wrapper or a green replay path says nothing about live text.
**Repro:** `pnpm exec vitest run --reporter=agent apps/vscode/test/webview/chat-message.test.tsx apps/vscode/test/event-adapter.test.ts`; functional evidence is `testcases/reports/2026-11-25_chat_rendering_build_22.md`.
**Trigger:** verifying chat rendering or internal-event visibility → measure visible content through the live public event path, not only container counts or replay.
**Not for:** claiming the accumulated main-profile running build before its Extension Host is restarted and observed.

### EXP-0015 · 2026-11-25 · ❌→✅ · #context #compaction #testing
class: guard-not-proven-against-threat
mechanized: pnpm exec vitest run --reporter=agent apps/vscode/test/session-runtime.test.ts apps/vscode/test/kimi-harness.integration.test.ts -t "Context Window Control"
**Context:** Context Window Control's unit test mocked `promptWithSkills` and accepted an empty skill list that the real engine rejects.
**Tried / did:** inspected the overflowing wire, required red-before-fix assertions at the fake `steer()` boundary and the real SDK/provider boundary, then walked packaged builds 20 and 13 through large-context active turns.
**Result:** ❌→✅ — the pre-fix provider received no control message; both fixed VSIX paths delivered the 80% soft-closure line at 84%, and the accumulated main profile later delivered the 70% warning through `prompt.steered`.   → link: bugs/28_DONE_context_window_control_empty_skills_rejected.md
**Lesson:** an adapter mock can certify a call the production API rejects; every cross-layer delivery path needs one unmocked public-API/provider observation.
**Repro:** `pnpm exec vitest run --reporter=agent apps/vscode/test/session-runtime.test.ts apps/vscode/test/kimi-harness.integration.test.ts -t "Context Window Control"`; live evidence is `testcases/reports/2026-11-25_context_window_steer_delivery.md`.
**Trigger:** adding or changing an SDK/provider adapter call → pair the mocked contract with a real public-boundary request before trusting it.
**Not for:** claiming a full million-token soak; the accumulated main-profile observation is the 70% warning, not a complete soft→force sequence.

### EXP-0014 · 2026-11-25 · ❌→✅ · #windows #hooks #testing
class: shell-lied
mechanized: pnpm exec vitest run --reporter=agent packages/agent-core-v2/test/agent/fullCompaction/fullCompaction.test.ts
**Context:** compaction hooks fired but their JSONL evidence stayed empty on Windows.
**Tried / did:** observed both hook callbacks, then inspected the generated shell command and quoted the Node executable and script path.
**Result:** ❌→✅ — the unquoted `C:\Program Files\nodejs\node.exe` had been split by the shell; both real child payloads now land in order and the full file is 123/123.   → link: bugs/05_DONE_pre_post_compact_hook_log_empty.md
**Lesson:** a successful event callback does not prove a shell command ran correctly; quote executable and script paths and read process output/evidence before blaming registration.
**Repro:** `pnpm exec vitest run --reporter=agent packages/agent-core-v2/test/agent/fullCompaction/fullCompaction.test.ts -t "fires PreCompact and PostCompact"`.
**Trigger:** generating a shell command from host paths → quote every path and test it on a host whose executable directory contains spaces.
**Not for:** claiming every empty hook log is a quoting issue; invocation and evidence paths must still be observed separately.

### EXP-0013 · 2026-11-25 · ❌→✅ · #chat #replay #testing
class: guard-not-proven-against-threat
mechanized: pnpm exec vitest run --reporter=agent apps/vscode/test/webview/chat-store.test.ts
**Context:** session replay cleared messages and emitted each historical event as a separate store update.
**Tried / did:** observed a real zero-assistant frame, then guarded intermediate store publications and applied reset/replay/completion in one transaction.
**Result:** ❌→✅ — build 19 kept one assistant container through real history navigation; replay attention and live queue wrappers are no longer invoked.   → link: bugs/25_first_prompt_assistant_message_flicker.md
**Lesson:** multi-event restoration is a transaction boundary; publishing reset and every event separately creates user-visible intermediate states even when the final state is correct.
**Repro:** `pnpm exec vitest run --reporter=agent apps/vscode/test/webview/chat-store.test.ts -t "without publishing an empty"`; real frame evidence is in `testcases/reports/2026-11-25_atomic_replay_build_19.md`.
**Trigger:** replaying or rehydrating a UI state through multiple events → inspect intermediate renders, not only the final state.
**Not for:** a genuine new conversation, where an empty message list is the intended state.

### EXP-0012 · 2026-11-25 · ❌→✅ · #chat #lifecycle #testing
class: guard-not-proven-against-threat
mechanized: pnpm exec vitest run --reporter=agent apps/vscode/test/webview/status-pills.test.tsx apps/vscode/test/session-runtime.test.ts
**Context:** queue draining was triggered by a mocked `TurnBegin` after the next idle prompt.
**Tried / did:** compared real VSIX bridge logs with model requests, found no `TurnBegin` for that prompt, and moved the trigger to an explicit host-accepted `QueueBatchReady` event.
**Result:** ❌→✅ — build 17 delivered the selected item and both remaining items in order into one active request; the final UI had one response and no queue/error.   → link: bugs/20_queue_steer_duplicate_submission.md
**Lesson:** a lifecycle mock must be checked against the real event stream; use the host's actual acceptance boundary when the engine does not promise a later start event.
**Repro:** `pnpm exec vitest run --reporter=agent apps/vscode/test/webview/status-pills.test.tsx apps/vscode/test/session-runtime.test.ts`, then read `testcases/reports/2026-11-25_queue_batch_build_17.md` for the real VSIX observation.
**Trigger:** depending on a lifecycle event for queue or turn coordination → log the real event order and verify the model/UI outcome before trusting the mock.
**Not for:** claiming every SDK backend omits `TurnBegin`; the boundary here is that consumers must not require an event the observed path did not emit.

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
