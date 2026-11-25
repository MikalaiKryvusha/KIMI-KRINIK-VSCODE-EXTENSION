export const PERMISSION_MODES = ["manual", "yolo", "auto"] as const;
export type PermissionModeName = (typeof PERMISSION_MODES)[number];

export type GoalStatusName = "active" | "paused" | "blocked" | "complete";

export interface GoalStateInfo {
  readonly objective: string;
  readonly status: GoalStatusName;
  readonly turnsUsed: number;
  readonly tokensUsed: number;
  readonly wallClockMs: number;
  readonly terminalReason?: string;
}

export const GOAL_ACTIONS = ["pause", "resume", "cancel"] as const;
export type GoalAction = (typeof GOAL_ACTIONS)[number];

export function isPermissionModeName(value: unknown): value is PermissionModeName {
  return (PERMISSION_MODES as readonly unknown[]).includes(value);
}

export function toGoalStateInfo(goal: {
  readonly objective: string;
  readonly status: GoalStatusName;
  readonly turnsUsed: number;
  readonly tokensUsed: number;
  readonly wallClockMs: number;
  readonly terminalReason?: string;
} | null): GoalStateInfo | null {
  if (goal === null) return null;
  return {
    objective: goal.objective,
    status: goal.status,
    turnsUsed: goal.turnsUsed,
    tokensUsed: goal.tokensUsed,
    wallClockMs: goal.wallClockMs,
    ...(goal.terminalReason === undefined ? {} : { terminalReason: goal.terminalReason }),
  };
}
