import { Methods } from "../../shared/bridge";
import type { SessionContextMessageView, SessionContextSnapshot } from "../../shared/legacy-sdk";
import type { SessionRuntime } from "../runtime/session-runtime";
import type { Handler } from "./types";

type ContextData = Awaited<ReturnType<SessionRuntime["session"]["getContext"]>>;
type ContextMessage = ContextData["history"][number];

const getSessionContext: Handler<void, { ok: boolean; snapshot: SessionContextSnapshot | null }> = async (_, ctx) => {
  const runtime = ctx.getSession();
  if (runtime === undefined) return { ok: false, snapshot: null };
  const data = await runtime.session.getContext();
  return {
    ok: true,
    snapshot: {
      tokenCount: data.tokenCount,
      messages: data.history.map(toContextMessageView),
    },
  };
};

function toContextMessageView(message: ContextMessage): SessionContextMessageView {
  const parts: string[] = [];
  for (const part of message.content) {
    if (part.type === "text") parts.push(part.text);
    else if (part.type === "think") parts.push(`[thinking]\n${part.think}`);
    else parts.push(`[${part.type}]`);
  }
  if (message.role === "assistant") {
    for (const call of message.toolCalls) {
      const args = call.arguments ?? "";
      parts.push(`[tool_call: ${call.name}] ${args.length > 500 ? `${args.slice(0, 500)}…` : args}`);
    }
  }
  return {
    role: message.role,
    text: parts.join("\n\n"),
    ...(message.isError === true ? { isError: true } : {}),
    ...(message.origin?.kind === "compaction_summary" ? { kind: "compaction_summary" } : {}),
  };
}

export const contextHandlers = {
  [Methods.GetSessionContext]: getSessionContext,
};
