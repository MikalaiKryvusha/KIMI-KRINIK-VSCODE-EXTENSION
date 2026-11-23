import { useState } from "react";
import { IconClipboardList, IconPlayerPause, IconPlayerPlay, IconSparkles, IconTarget, IconX } from "@tabler/icons-react";

import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "@/components/ui/sonner";
import { bridge } from "@/services";
import { useChatStore, useSettingsStore } from "@/stores";
import { useT, type TranslationKey } from "@/i18n";
import { cn } from "@/lib/utils";
import type { GoalAction, GoalStateInfo, GoalStatusName } from "shared/modes";

const GOAL_STATUS: Record<GoalStatusName, TranslationKey> = {
  active: "modes.goalStatus.active",
  paused: "modes.goalStatus.paused",
  blocked: "modes.goalStatus.blocked",
  complete: "modes.goalStatus.complete",
};

function isGoalOpen(goal: GoalStateInfo | null): goal is GoalStateInfo {
  return goal !== null && goal.status !== "complete";
}

function modeButtonClass(active: boolean): string {
  return cn(
    "flex items-center gap-1 h-6 px-1.5 rounded-md transition-all text-xs cursor-pointer",
    active
      ? "bg-blue-500/15 text-blue-600 dark:text-blue-400 hover:bg-blue-500/25"
      : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground",
  );
}

interface ModeButtonsProps {
  planMode: boolean;
  onTogglePlanMode: () => void;
}

export function ModeButtons({ planMode, onTogglePlanMode }: ModeButtonsProps) {
  const t = useT();
  const sessionId = useChatStore((state) => state.sessionId);
  const swarmMode = useChatStore((state) => state.swarmMode);
  const goal = useChatStore((state) => state.goal);
  const goalArmed = useChatStore((state) => state.goalArmed);
  const controlPanel = useSettingsStore((state) => state.extensionConfig.controlPanel);
  const [goalMenuOpen, setGoalMenuOpen] = useState(false);

  const toggleSwarm = () => {
    if (sessionId === null) {
      toast.info(t("modes.needSession"));
      return;
    }
    const next = !swarmMode;
    useChatStore.setState({ swarmMode: next });
    void bridge.setSwarmMode(next).then(
      (result) => {
        if (!result.ok) useChatStore.setState({ swarmMode: result.swarmMode });
      },
      () => useChatStore.setState({ swarmMode: !next }),
    );
  };

  const controlGoal = (action: GoalAction) => {
    setGoalMenuOpen(false);
    void bridge.controlGoal(action).catch((error: unknown) => {
      toast.error(error instanceof Error ? error.message : String(error));
    });
  };

  return (
    <>
      {controlPanel.plan && (
        <Tooltip>
          <TooltipTrigger asChild>
            <button type="button" onClick={onTogglePlanMode} className={modeButtonClass(planMode)} data-testid="mode-plan">
              <IconClipboardList className="size-3.5" />
              <span className="leading-none @max-[480px]/composer:hidden">{t("modes.plan")}</span>
            </button>
          </TooltipTrigger>
          <TooltipContent>{planMode ? t("planMode.active") : t("modes.planDesc")}</TooltipContent>
        </Tooltip>
      )}

      {controlPanel.goal && (isGoalOpen(goal) ? (
        <DropdownMenu open={goalMenuOpen} onOpenChange={setGoalMenuOpen}>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <button type="button" className={modeButtonClass(true)} data-testid="mode-goal">
                  <IconTarget className="size-3.5" />
                  <span className="leading-none @max-[480px]/composer:hidden">{t("modes.goal")}</span>
                </button>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent>{`${goal.objective} · ${t(GOAL_STATUS[goal.status])}`}</TooltipContent>
          </Tooltip>
          <DropdownMenuContent align="start" className="w-64">
            <div className="px-2 py-1.5">
              <div className="flex items-center gap-2">
                <IconTarget className="size-4 shrink-0 text-muted-foreground" />
                <span className="flex-1 min-w-0">
                  <span className="block truncate text-xs leading-tight">{goal.objective}</span>
                  <span className="block text-[10px] leading-snug text-muted-foreground">{t(GOAL_STATUS[goal.status])}</span>
                </span>
              </div>
              <div className="mt-1 flex gap-1 pl-6">
                {goal.status === "active" && (
                  <Button variant="outline" size="xs" onClick={() => controlGoal("pause")}>
                    <IconPlayerPause />
                    {t("modes.goalPause")}
                  </Button>
                )}
                {(goal.status === "paused" || goal.status === "blocked") && (
                  <Button variant="outline" size="xs" onClick={() => controlGoal("resume")}>
                    <IconPlayerPlay />
                    {t("modes.goalResume")}
                  </Button>
                )}
                <Button variant="outline" size="xs" onClick={() => controlGoal("cancel")}>
                  <IconX />
                  {t("modes.goalCancel")}
                </Button>
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              onClick={() => useChatStore.setState({ goalArmed: !goalArmed })}
              className={modeButtonClass(goalArmed)}
              data-testid="mode-goal"
            >
              <IconTarget className="size-3.5" />
              <span className="leading-none @max-[480px]/composer:hidden">{t("modes.goal")}</span>
            </button>
          </TooltipTrigger>
          <TooltipContent>{goalArmed ? t("modes.goalArmed") : t("modes.goalDesc")}</TooltipContent>
        </Tooltip>
      ))}

      {controlPanel.swarm && (
        <Tooltip>
          <TooltipTrigger asChild>
            <button type="button" onClick={toggleSwarm} className={modeButtonClass(swarmMode)} data-testid="mode-swarm">
              <IconSparkles className="size-3.5" />
              <span className="leading-none @max-[480px]/composer:hidden">{t("modes.swarm")}</span>
            </button>
          </TooltipTrigger>
          <TooltipContent>{t("modes.swarmDesc")}</TooltipContent>
        </Tooltip>
      )}
    </>
  );
}
