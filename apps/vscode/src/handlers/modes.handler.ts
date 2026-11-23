import { Methods } from "../../shared/bridge";
import type { GoalAction, PermissionModeName } from "../../shared/modes";
import type { Handler } from "./types";

const setPermissionMode: Handler<{ mode: PermissionModeName }, { ok: boolean; mode: PermissionModeName | null }> = async (params, ctx) => {
  const runtime = ctx.getSession();
  if (runtime === undefined) return { ok: true, mode: params.mode };
  await runtime.setPermissionMode(params.mode);
  await runtime.announceStatus(ctx.webviewId);
  return { ok: true, mode: runtime.permissionMode };
};

const setSwarmMode: Handler<{ enabled: boolean }, { ok: boolean; swarmMode: boolean }> = async (params, ctx) => {
  const runtime = ctx.getSession();
  if (runtime === undefined) return { ok: false, swarmMode: false };
  await runtime.session.setSwarmMode(params.enabled, "manual");
  await runtime.announceStatus(ctx.webviewId);
  return { ok: true, swarmMode: params.enabled };
};

const controlGoal: Handler<{ action: GoalAction }, { ok: boolean }> = async (params, ctx) => {
  const runtime = ctx.getSession();
  if (runtime === undefined) return { ok: false };
  try {
    if (params.action === "pause") await runtime.session.pauseGoal();
    else if (params.action === "resume") await runtime.session.resumeGoal();
    else await runtime.session.cancelGoal();
  } catch (error) {
    if (!isGoalNotFound(error)) throw error;
  } finally {
    await runtime.announceStatus(ctx.webviewId);
  }
  return { ok: true };
};

function isGoalNotFound(error: unknown): boolean {
  if (typeof error !== "object" || error === null) return false;
  const { code, message } = error as { code?: unknown; message?: unknown };
  return code === "goal.not_found" || message === "No current goal";
}

export const modesHandlers = {
  [Methods.SetPermissionMode]: setPermissionMode,
  [Methods.SetSwarmMode]: setSwarmMode,
  [Methods.ControlGoal]: controlGoal,
};
