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
  return { webviewId: "view-1", getSession: () => session } as never;
}

describe("composer mode handlers", () => {
  it("applies the permission mode to the live session and announces the status", async () => {
    const live = runtime("manual");

    await expect(setPermissionMode({ mode: "auto" }, context(live))).resolves.toEqual({ ok: true, mode: "auto" });
    expect(live.setPermissionMode).toHaveBeenCalledWith("auto");
    expect(live.announceStatus).toHaveBeenCalledWith("view-1");
  });

  it("keeps the chosen permission mode for the first message when no session exists yet", async () => {
    await expect(setPermissionMode({ mode: "yolo" }, context(undefined))).resolves.toEqual({ ok: true, mode: "yolo" });
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
