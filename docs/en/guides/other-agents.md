# Using in Other Agents (Agent to Agent)

Kimi Code CLI and the Kimi Code desktop app include a built-in **Kimi Agent Protocol (KAP)** local server, allowing other AI agents — such as Claude Code, Codex, and Cursor — to interact directly with your local Kimi Code: handing off sessions in either direction, organizing session history across workspaces, or assembling an Agent Team for multi-round plan discussions.

## Choosing an integration method

| What you want to do | Protocol & usage | Characteristics |
| --- | --- | --- |
| Run one-shot tasks such as benchmarks or fire-and-collect prompts | `kimi -p` — see [Print mode](../reference/kimi-command.md#print-mode) | Executes a single unattended prompt and exits once finished. |
| Embed Kimi Code into another client such as an IDE or custom client | ACP via `kimi acp` — see [Kimi Code ACP](../reference/kimi-acp.md) | Connects to ACP-capable editors (Zed, JetBrains, etc.), bound to the host window with editor-delegated file and terminal operations. |
| Collaborate across agents or manage sessions | Kimi Agent Protocol (this guide) | Connects to your local Kimi Code for richer multi-turn workflows: bidirectional session handoff, cross-workspace session cleanup, and Agent-to-Agent discussions. |

## Prerequisites

- **Version requirements**: Kimi Code CLI >= v2.7.0; Kimi Code Desktop >= v1.4.0;
- **Logged in or model configured**: Complete login (`kimi login`) or configure a model provider beforehand — see [Getting Started](./getting-started.md).

## Usage scenarios

Tell your agent what you want in plain language.

Ask your agent to read the KAP guide from your running local Kimi Code service at `/api/v1/kap.md`. The guide describes the current connection flow and API usage without requiring a separately installed Skill.

### Example 1: Session Handoff

Hand off to Kimi Code:

> Organize our current goal, modified files, and next steps into a HandOff brief, hand it off to a new session in my local Kimi Code to continue, and give me the Session ID.

Pick up from Kimi Code:

> Read the session about `[topic or session ID]` in my local Kimi Code, understand its current progress and blockers, and wait for my next instructions.

### Example 2: Organize local session history

Review recent sessions across workspaces, replace vague titles, and batch-archive completed sessions:

> Organize my local Kimi Code session history across workspaces: rename vague titles with clear ones, archive completed sessions, and summarize the work still in progress.

### Example 3: Assemble an Agent Team to discuss a plan

A minimal example — combine and adapt freely for your workflow:

> Use the local Kimi Agent Protocol to discuss this plan with Kimi K3.1 Pro for up to 5 rounds, then bring me the conclusion.

## Related docs

- [Print mode](../reference/kimi-command.md#print-mode) — one-shot runs, structured JSONL output, and exit codes
- [Using in IDEs](./ides.md) — connect Zed and JetBrains IDEs via `kimi acp`
