# Bug 34 — Refresh-marker update disappeared while the timer remained correct

**Status:** 🔴 OPEN — investigation required; culprit not yet assigned
**Version/build:** KIMI KRINIK 1.0.0 build 25 · KAIF 2.10 refresh hooks · Windows 11 · **When/context:** 2026-11-25 21:09–21:26 +03:00, owner questioning repeated hourly refresh orders
**Severity:** S2
**Fixing:** next chat, before release acceptance; owner explicitly ordered this investigation
**Fix accepted when (observable):** a controlled refresh write survives immediate and subsequent prompt reads, with the responsible layer identified (KIMI KRINIK, KAIF hook, agent harness, filesystem or another session) and a regression check proving it cannot silently revert.

## Symptom

[OWNER] «Напоминание сообщило last refresh 134 min ago» and «баг заведи, разобраться, что виноват, KIMI KRINIK или хук и автоматика KAIF внутри этого проекта. В новом чате будем чинить» · 2026-11-25 21:26 +03:00 (chat)

The hourly refresh reminder repeatedly claimed a refresh older than 60 minutes immediately after a full canon re-read and marker write. The user correctly challenged both the unnecessary re-read and the stale witness.

## Repro (observed facts, not a hypothesis)

1. A full core read was performed and `date -Iseconds` returned `2026-11-25T21:09:06+03:00`.
2. `.kaif/refresh-marker.json` was written through the Write tool with that timestamp.
3. At 21:13 the same file contained `2026-11-25T18:56:21+03:00`; `stat` also showed old mtime `2026-11-25 18:56:33 +0300`.
4. At 21:15 a second write with `2026-11-25T21:15:18+03:00` was immediately read back; file content and mtime were both current (`21:15:28 +0300`).
5. At 21:26 the current marker still has the 21:15 timestamp and `test debt: none` is unrelated to this refresh-witness issue.

The timer's source at `.kaif/hooks/prompt-refresh-timer.mjs:105-107` reads `at` and falls back to mtime, so the stale order was consistent with the file's actual contents.

## Forensics

- The old marker contains the full nine-document list and `trigger: heavy-task`, matching the earlier 18:56 write.
- The later marker contains the same list with `trigger: hour`.
- No writer other than the refresh-marker tool call was found in `.kaif/hooks` or the repository search performed.
- `gh issue view 194 --repo MikalaiKryvusha/KAIF` was checked: that issue is about a sibling cwd naming the wrong folder, not this loss of a write in the correct project root.
- Local `bugs/` and open KAIF issues were searched for `refresh-marker`; no duplicate was found.

## Root cause / Hypotheses (ranked, unproven)

1. **The Write tool or agent harness acknowledged a write without persisting it.** mtime shows no later update, so an old-file overwrite is less likely than a lost write.
2. **A second session/process rewrote the marker with old content and restored its mtime.** This requires identifying a writer outside the current hook.
3. **A path/root mismatch sent the write to a different file or workspace.** The project path itself was correct in this observation, unlike origin #194.
4. **A git/filesystem restore or background process reverted the ignored marker.** No matching git operation or hook writer has been established.

The KAIF timer itself is currently not the suspected culprit: it reported the actual stale file correctly.

## Investigation plan for the next chat

1. Re-run a controlled write at time T with immediate readback of content and mtime, then repeat after each prompt and after a controlled second session. Record tool path, cwd, PID and session ID.
2. Watch the exact file for changes and compare against another ignored file to separate marker-specific behavior from general Write behavior.
3. Search running processes and all writer references for `.kaif/refresh-marker.json`, including harness hooks and git/stash/restore operations.
4. Reproduce once with `CLAUDE_PROJECT_DIR` unset and once with it set to the project root, keeping cwd at the project root.
5. Assign the layer by observed evidence, then apply the smallest fix and a mutation-proved guard. If the cause is in KAIF, fix locally and deliver an origin ticket through `node .kaif/kaif-core.mjs report`; if in KIMI KRINIK, fix the extension; if in the harness, fix the tool integration instead.
6. Confirm a fresh timer remains silent after one refresh and only fires after the interval, then return to build-25 accumulated-profile acceptance.

## Decisions made without the owner

Classified as S2 because repeated unnecessary full-core reads waste session work and can hide a persistence failure in the refresh-witness mechanism. No culprit or fix is claimed yet.

## Links

- `.kaif/hooks/prompt-refresh-timer.mjs:105`
- `.kaif/refresh-marker.json`
- `AGENT_GUIDE.md` → Context refresh
- `https://github.com/MikalaiKryvusha/KAIF/issues/194`
- `bugs/33_DONE_skill_variant_windows_path_separator_test.md`
