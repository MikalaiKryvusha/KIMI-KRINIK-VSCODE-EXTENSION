import { describe, expect, it, vi } from "vitest";

import { contextHandlers } from "../src/handlers/context.handler";
import { Methods, validateRpcMessage } from "../shared/bridge";

const getSessionContext = contextHandlers[Methods.GetSessionContext];

function context(runtime: unknown) {
  return { getSession: () => runtime } as never;
}

describe("session context handler", () => {
  it("reports that no live session is available", async () => {
    await expect(getSessionContext(undefined, context(undefined))).resolves.toEqual({ ok: false, snapshot: null });
  });

  it("maps the exact SDK context into a read-only snapshot", async () => {
    const getContext = vi.fn(async () => ({
      tokenCount: 640,
      history: [
        { role: "user", content: [{ type: "text", text: "hello" }] },
        {
          role: "assistant",
          content: [
            { type: "think", think: "plan" },
            { type: "image_url", image_url: { url: "data:image/png;base64,AA==" } },
          ],
          toolCalls: [{ type: "function", id: "call-1", name: "Bash", arguments: "x".repeat(600) }],
          origin: { kind: "compaction_summary" },
          isError: true,
        },
      ],
    }));

    await expect(getSessionContext(undefined, context({ session: { getContext } }))).resolves.toEqual({
      ok: true,
      snapshot: {
        tokenCount: 640,
        messages: [
          { role: "user", text: "hello" },
          {
            role: "assistant",
            text: `[thinking]\nplan\n\n[image_url]\n\n[tool_call: Bash] ${"x".repeat(500)}…`,
            isError: true,
            kind: "compaction_summary",
          },
        ],
      },
    });
    expect(getContext).toHaveBeenCalledOnce();
  });

  it("validates the no-parameter bridge contract", () => {
    expect(validateRpcMessage({ id: "1", method: Methods.GetSessionContext }).ok).toBe(true);
    expect(validateRpcMessage({ id: "1", method: Methods.GetSessionContext, params: null }).ok).toBe(false);
  });
});
