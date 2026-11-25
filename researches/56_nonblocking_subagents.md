# Research 56 — Nonblocking subagents in Kimi Code

> **Created:** 2026-11-25
> **Parent:** `STATUS.md` → next-session item 8
> **Status:** ✅ complete — official documentation and local contracts/tests reviewed; no live subagent launched
> **Outbound:** conclusion and usage boundary in `STATUS.md`
> **Verification:** [TESTED: 2026-11-25 · official docs and repository test review; no live subagent run]

## Question

Does Kimi Code let subagents run in parallel without blocking the main agent flow? The answer must distinguish a supported nonblocking mode from a merely parallel-but-blocking swarm call.

## Conclusion

**Supported nonblocking mode: `Agent` with `run_in_background=true`.** The tool returns a task ID immediately, so the main agent can keep working and can launch other background subagents. Completion is delivered automatically; manual polling is not required.

**Parallel but blocking mode: `AgentSwarm`.** It launches subagents concurrently, but the swarm call itself waits for all work and returns one aggregated report. It is not a nonblocking alternative to background `Agent`.

A background subagent is not detached from every dependency: when it ends its own turn with unfinished background tasks, completion is reported only after those nested tasks settle. Also, `TaskList`, `TaskOutput` and `TaskStop` must be enabled for background execution; otherwise the call fails before launch.

## Evidence

### Official current documentation

- [Agents and Sub-Agents](https://www.kimi.com/code/docs/en/kimi-code-cli/customization/agents.html): background subagents return results automatically, contexts are isolated, and multiple subagents can run in parallel. The same page says nested background tasks must settle before completion is reported.
- [Built-in Tools — Agent](https://moonshotai.github.io/kimi-code/en/reference/tools.html): foreground `Agent` waits; background `Agent` returns a task ID immediately and delivers the result via a synthetic user message. `AgentSwarm` supports up to 128 subagents and waits for all of them before returning its aggregated report. `TaskOutput` is a nonblocking snapshot, while `WaitFor` is an intentional block with a timeout.
- The same tools page requires `TaskList`, `TaskOutput` and `TaskStop` for background tasks and documents automatic terminal-state delivery.

### Local contracts and tests

- `packages/agent-core-v2/test/tool/tool.test.ts:3096` registers a background subagent with the task manager and returns `status: running` plus IDs.
- `packages/agent-core-v2/test/tool/tool.test.ts:3123` proves background execution fails clearly when task-management tools are disabled.
- `packages/agent-core-v2/test/tool/tool.test.ts:3223` proves two concurrent background subagents launch successfully.
- `packages/kap-server/test/conversationContract.e2e.test.ts:631` observes a detached running subagent, its completion and a task-origin notification turn. This confirms that delivery is an actual notification/turn, not merely an invisible state mutation.
- `packages/agent-core-v2/src/agent/task/taskService.ts:104` tells subagents not to finish while their own needed background work is still running.

## Usage boundary

- Use background `Agent` for independent evidence gathering, read-only exploration or separate implementation work while the main flow continues.
- Use `AgentSwarm` only when the main flow intentionally wants one aggregated result after all concurrent work finishes. It does not itself provide a nonblocking result stream.
- Expect the result as a new notification/steered turn rather than guaranteed continuation inside the current model request.
- Budget tokens per subagent. Parallel execution is not free and is unnecessary for small tasks.
- Do not end a subagent's own turn while its needed nested background work is unfinished.
- No live subagent was launched for this research because project instructions prohibit launching one without explicit owner authorization. The conclusion is based on official docs and observed repository tests, not a new runtime demonstration.
