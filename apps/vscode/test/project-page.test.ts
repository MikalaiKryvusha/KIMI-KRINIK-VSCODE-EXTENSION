import { describe, expect, it, vi } from "vitest";

const boundary = vi.hoisted(() => ({ openExternal: vi.fn() }));

vi.mock("vscode", () => ({
  env: { openExternal: boundary.openExternal },
  Uri: { parse: (value: string) => ({ value }) },
}));

import { configHandlers } from "../src/handlers/config.handler";
import { Methods, validateRpcMessage } from "../shared/bridge";

const PROJECT_URL = "https://github.com/MikalaiKryvusha/KIMI-KRINIK-VSCODE-EXTENSION";

describe("project page", () => {
  it("opens only the canonical GitHub repository", async () => {
    const handler = configHandlers[Methods.OpenProjectPage]!;

    await expect(handler(undefined, {} as never)).resolves.toEqual({ ok: true });
    expect(boundary.openExternal).toHaveBeenCalledWith({ value: PROJECT_URL });
  });

  it("validates the no-params bridge contract", () => {
    expect(validateRpcMessage({ id: "about", method: Methods.OpenProjectPage })).toEqual({
      ok: true,
      message: { id: "about", method: Methods.OpenProjectPage, params: undefined },
    });
    expect(validateRpcMessage({ id: "about", method: Methods.OpenProjectPage, params: {} }).ok).toBe(false);
  });
});
