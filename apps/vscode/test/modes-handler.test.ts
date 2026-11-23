import { describe, expect, it, vi } from "vitest";

import { modesHandlers } from "../src/handlers/modes.handler";
import { Methods, validateRpcMessage } from "../shared/bridge";

const setPermissionMode = modesHandlers[Methods.SetPermissionMode];
const setSwarmMode = modesHandlers[Methods.SetSwarmMode];
const controlGoal = modesHandlers[Methods.ControlGoal];

function runtime(mode: "manual" | "yolo" | "auto" = "manual") {
  const state = { mode };
  return {
    get permissionMode() {
      return state.mode;
    },
    setPermissionMode: vi.fn(async (next: typeof mode) => {
      state.mode = next;
    }),
    announceStatus: vi.fn(async () => undefined),
    session: {
      setSwarmMode: vi.fn(async () => undefined),
      pauseGoal: vi.fn(async () => undefined),
      resumeGoal: vi.fn(async () => undefined),
      cancelGoal: vi.fn(async () => {
        throw Object.assign(new Error("No current goal"), { code: "goal.not_found" });
      }),
    },
  };
}

function context(session: ReturnType<typeof runtime> | undefined) {
  return {
    webviewId: "view-1",
    getSession: () => session,
    harness: { setConfig: vi.fn(async () => undefined) },
  } as unknown as import("../src/handlers/types").HandlerContext;
}

describe("composer mode handlers", () => {
  it("persists the default and applies the permission mode to the live session", async () => {
    const live = runtime("manual");
    const ctx = context(live);

    await expect(setPermissionMode({ mode: "auto" }, ctx)).resolves.toEqual({ ok: true, mode: "auto" });
    expect(live.setPermissionMode).toHaveBeenCalledWith("auto");
    expect(ctx.harness.setConfig).toHaveBeenCalledWith({ defaultPermissionMode: "auto" });
    expect(live.announceStatus).toHaveBeenCalledWith("view-1");
  });

  it("persists the chosen permission mode before the first session exists", async () => {
    const ctx = context(undefined);

    await expect(setPermissionMode({ mode: "yolo" }, ctx)).resolves.toEqual({ ok: true, mode: "yolo" });
    expect(ctx.harness.setConfig).toHaveBeenCalledWith({ defaultPermissionMode: "yolo" });
  });

  it("restores the live mode when persisting the default fails", async () => {
    const live = runtime("manual");
    const ctx = context(live);
    vi.mocked(ctx.harness.setConfig).mockRejectedValueOnce(new Error("config.toml is read-only"));

    await expect(setPermissionMode({ mode: "auto" }, ctx)).rejects.toThrow("config.toml is read-only");
    expect(live.setPermissionMode).toHaveBeenNthCalledWith(1, "auto");
    expect(live.setPermissionMode).toHaveBeenNthCalledWith(2, "manual");
    expect(live.announceStatus).not.toHaveBeenCalled();
  });

  it("refuses swarm mode without a session and toggles it on a live one", async () => {
    await expect(setSwarmMode({ enabled: true }, context(undefined))).resolves.toEqual({ ok: false, swarmMode: false });
    const live = runtime();
    await expect(setSwarmMode({ enabled: true }, context(live))).resolves.toEqual({ ok: true, swarmMode: true });
    expect(live.session.setSwarmMode).toHaveBeenCalledWith(true, "manual");
  });

  it("treats a goal that already ended as handled and still refreshes the status", async () => {
    const live = runtime();

    await expect(controlGoal({ action: "cancel" }, context(live))).resolves.toEqual({ ok: true });
    expect(live.announceStatus).toHaveBeenCalledWith("view-1");
  });

  it("validates the new bridge parameters", () => {
    const message = (method: string, params: unknown) => validateRpcMessage({ id: "1", method, params });
    expect(message(Methods.SetPermissionMode, { mode: "auto" }).ok).toBe(true);
    expect(message(Methods.SetPermissionMode, { mode: "root" }).ok).toBe(false);
    expect(message(Methods.ControlGoal, { action: "pause" }).ok).toBe(true);
    expect(message(Methods.ControlGoal, { action: "delete" }).ok).toBe(false);
    expect(message(Methods.StreamChat, { content: "hi", model: "m", permissionMode: "yolo", goalObjective: "Ship it" }).ok).toBe(true);
    expect(message(Methods.StreamChat, { content: "hi", model: "m", permissionMode: "root" }).ok).toBe(false);
    expect(message(Methods.StreamChat, { content: "hi", model: "m", goalObjective: "" }).ok).toBe(false);
  });
});
