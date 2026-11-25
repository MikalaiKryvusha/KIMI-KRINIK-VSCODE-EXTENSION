# Agent rules

This project is KAIF-wrapped. Before every task read `AGENT_GUIDE.md` (the canon) and `STATUS.md` (current state); think per `PHILOSOPHY.md`; write requirements per `REQUIREMENTS_FRAMEWORK.md`; test per `TESTING_FRAMEWORK.md`; debug per `BUG_FIXING_FRAMEWORK.md`; execute tasks per the fable loop (`/skill:fable-method`, `/skill:fable-judge`).

A message that opens with the word `resume` (or the resume alias of your language) is an ORDER to run /skill:resume in full before the rest of the message (`AGENT_GUIDE.md` → "A leading skill word is an order").

Kimi Code: run a KAIF skill as `/skill:<name>` — a bare `/resume` is Kimi's own session list, so the entry ritual is `/skill:resume`. A permission mode that runs tools without asking (Never Ask) covers tool calls only. A vision-level decision of the project is never decided alone: bring it to the owner as an interview in `interviews/` through the KAIF interactive contour (`AGENT_GUIDE.md` → "Decisions the agent must NOT make alone — interviews").

This repository also has its own root `AGENTS.md` with the monorepo's engineering rules (verification commands, no code comments, changesets, tests). Both apply; where KAIF and the root `AGENTS.md` disagree about this repository's code, commits or PRs, the root `AGENTS.md` wins.
