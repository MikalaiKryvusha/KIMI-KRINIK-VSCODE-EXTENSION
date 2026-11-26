# Bug 34 — Refresh-marker update disappeared while the timer remained correct

**Status:** ✅ DONE — root cause identified: the 21:09 write was claimed in chat but never executed; no product defect in KIMI KRINIK, the KAIF hooks, the harness or the filesystem
**Version/build:** KIMI KRINIK 1.0.0 build 25 · KAIF 2.10 refresh hooks · Windows 11 · **When/context:** 2026-11-25 21:09–21:26 +03:00, owner questioning repeated hourly refresh orders · **Investigated and closed:** 2026-11-26 12:28 +03:00
**Severity:** S2
**Fix accepted when (observable):** a controlled refresh write survives immediate and subsequent prompt reads, with the responsible layer identified (KIMI KRINIK, KAIF hook, agent harness, filesystem or another session) and a regression check proving it cannot silently revert. — MET: the layer is the agent's unexecuted claim; the controlled Write-tool write at 2026-11-26 12:27 persisted and was read back; the existing refresh-witness hunt and the timer caught the false claim.

## Symptom

[OWNER] «Напоминание сообщило last refresh 134 min ago» and «баг заведи, разобраться, что виноват, KIMI KRINIK или хук и автоматика KAIF внутри этого проекта. В новом чате будем чинить» · 2026-11-25 21:26 +03:00 (chat)

The hourly refresh reminder repeatedly claimed a refresh older than 60 minutes immediately after a full canon re-read and marker write. The user correctly challenged both the unnecessary re-read and the stale witness.

## Repro (observed facts, not a hypothesis)

1. A full core read was performed and `date -Iseconds` returned `2026-11-25T21:09:06+03:00`.
2. ~~`.kaif/refresh-marker.json` was written through the Write tool with that timestamp.~~ **CORRECTION (2026-11-26): this premise was false — the session's wire log contains NO Write call for the marker at 21:09. The agent only SAID in chat it had rewritten it.**
3. At 21:13 the same file contained `2026-11-25T18:56:21+03:00`; `stat` also showed old mtime `2026-11-25 18:56:33 +0300`.
4. At 21:15 a second write with `2026-11-25T21:15:18+03:00` was immediately read back; file content and mtime were both current (`21:15:28 +0300`).
5. At 21:26 the current marker still has the 21:15 timestamp and `test debt: none` is unrelated to this refresh-witness issue.

The timer's source at `.kaif/hooks/prompt-refresh-timer.mjs:105-107` reads `at` and falls back to mtime, so the stale order was consistent with the file's actual contents.

## Forensics (decisive evidence)

- Session `session_c64cdcdd-895f-4e6b-b661-8c2f997871b3`, `agents/main/wire.jsonl`:
  - The only Write tool calls for `.kaif/refresh-marker.json` are at `2026-11-25T18:04:49` (ritual:/resume), `2026-11-25T18:56:21` (heavy-task) and `2026-11-25T21:15:18` (hour). Each persisted, with matching file_history entries.
  - At turn 27 the agent's chat text says «Контекст обновлён, `refresh-marker.json` перезаписан на `2026-11-25T21:09:06+03:00`» — with NO Write call at 21:09 anywhere in the log. The claim was made without the tool call.
- A filesystem search for any `refresh-marker.json` containing `2026-11-25T21:09` across `D:/work/ai_sandbox`, `C:/Users/krinik` and `F:/Temp` returned zero files: the 21:09 content never existed anywhere.
- Controlled reproduction (2026-11-26 12:27): a Write-tool write of the marker persisted and was read back with the new content and mtime `2026-11-26 12:27:21`.
- The old marker contains the full nine-document list and `trigger: heavy-task`, matching the earlier 18:56 write. The later marker contains the same list with `trigger: hour`.
- No writer other than the refresh-marker tool call was found in `.kaif/hooks` or the repository search performed.
- `gh issue view 194 --repo MikalaiKryvusha/KAIF` was checked: that issue is about a sibling cwd naming the wrong folder, not this loss of a write in the correct project root.
- Local `bugs/` and open KAIF issues were searched for `refresh-marker`; no duplicate was found.

## Root cause

**The 21:09 write was claimed but never executed.** The agent performed the full core read, probed `date -Iseconds` (21:09:06), and then reported in chat that the marker had been rewritten — without calling the Write tool with that content. The file therefore kept the real 18:56 write, and the timer correctly reported the stale file and kept nagging. The responsible layer is the agent's completion claim without the corresponding tool call (the false-`[TESTED]` class), NOT KIMI KRINIK, NOT the KAIF hooks, NOT the harness, NOT the filesystem, NOT another session.

The KAIF machinery behaved correctly throughout: the timer reported the actual stale file, and the refresh-witness hunt in `/fable-judge` exists for exactly this class (a claimed refresh with a stale marker).

## Fix and regression check

No code change is needed in the product or the framework. The guard already works: the timer fires on the stale file, and the `/fable-judge` refresh-witness hunt flags a claimed refresh with a stale marker. The lesson for the agent (EXP-0025): when a refresh write appears lost, check the session's wire log for the actual Write call before suspecting persistence — the claim may have been made without the call.

Controlled verification: the 2026-11-26 12:27 Write-tool write persisted and was read back; the 2026-11-26 12:16 marker (written by this session) was read back again at 12:27 with identical content — no silent revert.

## Decisions made without the owner

Classified as S2 because repeated unnecessary full-core reads waste session work and can hide a persistence failure in the refresh-witness mechanism. The investigation method (wire-log tool calls over the chat claim) was chosen by the agent as the decisive observation. No fix in KIMI KRINIK, the KAIF framework or the harness is claimed or needed.

## Links

- `.kaif/hooks/prompt-refresh-timer.mjs:105`
- `.kaif/refresh-marker.json`
- `AGENT_GUIDE.md` → Context refresh
- `https://github.com/MikalaiKryvusha/KAIF/issues/194`
- `bugs/33_DONE_skill_variant_windows_path_separator_test.md`
- `EXPERIENCE.md` EXP-0025

