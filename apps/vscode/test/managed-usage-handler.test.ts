import { describe, expect, it, vi } from "vitest";

vi.mock("vscode", () => ({ window: {}, env: {} }));

import { authHandlers } from "../src/handlers/auth.handler";
import { Methods } from "../shared/bridge";

function context(overrides = {}) {
  return {
    harness: {
      auth: {
        getManagedUsage: vi.fn(async () => ({
          kind: "ok",
          quota: { usages: { limit5h: { usedRatio: 0.25 }, monthCode: { usedRatio: 0.5 } } },
        })),
        getManagedUserInfo: vi.fn(async () => ({ kind: "ok", userInfo: { userLevelName: "Pro" } })),
        ...overrides,
      },
    },
    logError: vi.fn(),
  } as never;
}

const handler = authHandlers[Methods.GetManagedUsage]!;

describe("managed usage handler", () => {
  it("maps quota windows", async () => {
    const ctx = context();
    const result = await handler({ provider: "managed:kimi-code" }, ctx);
    expect(result).toEqual({
      ok: true,
      usage: {
        fiveHour: { usedRatio: 0.25 },
        monthCode: { usedRatio: 0.5 },
      },
    });
  });

  it("returns request failure without a synthetic zero", async () => {
    const ctx = context({
      getManagedUsage: vi.fn(async () => ({ kind: "error", message: "unauthorized" })),
      getManagedUserInfo: vi.fn(),
    });
    await expect(handler(undefined, ctx)).resolves.toEqual({ ok: false, error: "unauthorized" });
  });
});
