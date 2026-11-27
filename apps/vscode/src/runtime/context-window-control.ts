import type { KaifThresholds } from "../../shared/types";

export const DEFAULT_CONTEXT_WINDOW_THRESHOLDS: KaifThresholds = {
  warnPct: 70,
  cutPct: 75,
  closePct: 80,
  forcePct: 90,
};

export interface ContextWindowLoopControl {
  readonly autoCompact?: boolean;
  readonly compactionTriggerRatio?: number;
  readonly reservedContextSize?: number;
}

export interface ContextWindowDecisionOptions extends ContextWindowLoopControl {
  readonly enabled?: boolean;
}

export type ContextWindowStage = "warn" | "cut" | "close" | "force";

export interface ContextWindowDecision {
  readonly said: number[];
  readonly kind?: ContextWindowStage;
  readonly level?: number;
  readonly line?: string;
}

interface ContextWindowLevel {
  readonly kind: ContextWindowStage;
  readonly at: number;
}

export function contextWindowCompactionPoint(maxContextTokens: number, loopControl: ContextWindowLoopControl): number {
  const ratio = loopControl.compactionTriggerRatio !== undefined
    && loopControl.compactionTriggerRatio >= 0.5
    && loopControl.compactionTriggerRatio <= 0.99
    ? loopControl.compactionTriggerRatio
    : 0.85;
  const reserved = loopControl.reservedContextSize !== undefined && loopControl.reservedContextSize >= 0
    ? loopControl.reservedContextSize
    : 50_000;
  let point = Math.floor(maxContextTokens * ratio);
  if (reserved > 0 && reserved < maxContextTokens) point = Math.min(point, maxContextTokens - reserved);
  return point;
}

export function decideContextWindow(
  used: number,
  maxContextTokens: number,
  thresholds: KaifThresholds,
  said: readonly number[],
  options: ContextWindowDecisionOptions,
): ContextWindowDecision {
  if (options.enabled === false || used <= 0 || maxContextTokens <= 0) return { said: [...said] };
  const point = contextWindowCompactionPoint(maxContextTokens, options);
  if (point <= 0) return { said: [...said] };
  const pct = Math.floor((used / point) * 100);
  const levels = contextWindowLevels(thresholds);
  const kept = said.filter((level) => level <= pct);
  const top = Math.max(-1, ...kept);
  const due = levels.filter((level) => level.at <= pct && level.at > top);
  if (due.length === 0) return { said: kept };
  const highest = due[due.length - 1]!;
  return {
    said: [...new Set([...kept, ...due.map((level) => level.at)])].toSorted((left, right) => left - right),
    kind: highest.kind,
    level: highest.at,
    line: contextWindowLine(highest, pct, used, point, maxContextTokens, levels),
  };
}

function contextWindowLevels(thresholds: KaifThresholds): ContextWindowLevel[] {
  const levels: ContextWindowLevel[] = [
    { kind: "warn", at: thresholds.warnPct },
    { kind: "cut", at: thresholds.cutPct },
    { kind: "close", at: thresholds.closePct },
    { kind: "force", at: thresholds.forcePct },
  ];
  for (const level of levels) {
    if (!Number.isFinite(level.at) || level.at < 0 || level.at > 100) {
      throw new Error(`Context Window Control thresholds must be numbers from 0 to 100; ${level.kind} is ${String(level.at)}.`);
    }
  }
  return levels.filter((level) => level.at > 0).toSorted((left, right) => left.at - right.at);
}

function contextWindowLine(
  level: ContextWindowLevel,
  pct: number,
  used: number,
  point: number,
  maxContextTokens: number,
  levels: readonly ContextWindowLevel[],
): string {
  const prefix = `KIMI KRINIK context: the room before Kimi's own compaction (it compacts at ${point} of ${maxContextTokens} tokens) is ${pct}% full (${used} of ${point} tokens).`;
  if (level.kind === "warn") {
    return `${prefix} A WARNING only — the end of the window is near: keep working at your normal pace and keep STATUS.md fresh if this project has one; tell the owner once that the window is at ${pct}%.`;
  }
  if (level.kind === "cut") {
    const close = levels.find((candidate) => candidate.kind === "close");
    return `${prefix} The ${level.at}% step: bring the work in hand to a logical cut — finish the current step, run its checks and commit it green if version control is available; take no new heavy task.${close === undefined ? "" : ` The soft closure comes at ${close.at}%.`}`;
  }
  if (level.kind === "close") {
    return `${prefix} The ${level.at}% step: start a soft closure now — first finish the current work to its logical cut, then write the current status and a handover in the project's existing status documents, commit and push only when authorized, and take no new task. Never use a forced closure at this step.`;
  }
  return `${prefix} The ${level.at}% step: finish the closure immediately, essentials only — current status, handover, and authorized commit and push; take no new task.`;
}

export interface ContextWindowRuntimeConfig extends ContextWindowLoopControl {
  readonly enabled: boolean;
  readonly thresholds: KaifThresholds;
}

export type ContextWindowConfigProvider = () => Promise<ContextWindowRuntimeConfig>;

export interface ContextWindowDeliveryResult {
  readonly state: "running" | "queued" | "blocked";
}

export class ContextWindowController {
  private said: number[] = [];
  private generation = 0;
  private queue: Promise<void> = Promise.resolve();

  constructor(
    private readonly config: ContextWindowConfigProvider,
    private readonly deliver: (line: string) => Promise<ContextWindowDeliveryResult>,
    private readonly log: (message: string, error: unknown) => void,
  ) {}

  observe(used: number, maxContextTokens: number): Promise<void> {
    const generation = this.generation;
    this.queue = this.queue.then(async () => {
      if (generation !== this.generation) return;
      const config = await this.config();
      if (generation !== this.generation) return;
      const decision = decideContextWindow(used, maxContextTokens, config.thresholds, this.said, config);
      if (decision.line === undefined) {
        this.said = decision.said;
        return;
      }
      if (generation !== this.generation) return;
      const result = await this.deliver(`<system>${decision.line}</system>`);
      if (generation === this.generation && result.state !== "blocked") this.said = decision.said;
    }).catch((error: unknown) => {
      this.log("Context Window Control observation failed", error);
    });
    return this.queue;
  }

  reset(): void {
    this.generation += 1;
    this.said = [];
  }
}
