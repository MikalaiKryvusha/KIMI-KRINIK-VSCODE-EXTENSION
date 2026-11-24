import { useEffect, useRef, useState } from "react";
import {
  IconBrain,
  IconCircleCheck,
  IconCircleX,
  IconFileCode,
  IconListCheck,
  IconLoader2,
  IconStack2,
  IconSubtask,
  IconTerminal2,
} from "@tabler/icons-react";

import { bridge, Events } from "@/services";
import { useChatStore } from "@/stores";
import { useT } from "@/i18n";
import { cn } from "@/lib/utils";
import { getTodoBlock, TodoStatusIcon } from "./ToolRenderers";
import { FileChangesPanel } from "./FileChangesPanel";
import { QueuedMessagesPanel } from "./QueuedMessagesPanel";
import { ContextViewerDialog } from "./ContextViewerDialog";
import { ApprovalDialog } from "./ApprovalDialog";
import { QuestionDialog } from "./QuestionDialog";
import type { BackgroundTaskItem, TodoBlock } from "shared/legacy-sdk";
import type { FileChange } from "shared/types";
import type { ChatMessage } from "@/stores/chat.store";

type PanelId = "queue" | "changes" | "bash" | "agents" | "todos";

const TASKS_POLL_INTERVAL_MS = 2500;
const QUEUE_FLASH_DURATION_MS = 1000;
const MAX_PANEL_TASKS = 20;
const FAILED_STATUSES = new Set(["failed", "timed_out", "killed", "lost"]);

type TodoItems = TodoBlock["items"];

function findLastTodoItems(messages: ChatMessage[]): TodoItems | null {
  for (let messageIndex = messages.length - 1; messageIndex >= 0; messageIndex--) {
    const steps = messages[messageIndex].steps;
    if (!steps) continue;
    for (let stepIndex = steps.length - 1; stepIndex >= 0; stepIndex--) {
      const items = steps[stepIndex].items;
      for (let itemIndex = items.length - 1; itemIndex >= 0; itemIndex--) {
        const item = items[itemIndex];
        if (item.type === "tool_use" && item.call.name === "SetTodoList") {
          return getTodoBlock(item.result?.display)?.items ?? null;
        }
      }
    }
  }
  return null;
}

function taskDurationSeconds(task: BackgroundTaskItem): number {
  return Math.max(0, Math.round(((task.endedAt ?? Date.now()) - task.startedAt) / 1000));
}

function sortTasks(tasks: BackgroundTaskItem[]): BackgroundTaskItem[] {
  return tasks
    .toSorted((left, right) => {
      const leftRunning = left.status === "running";
      const rightRunning = right.status === "running";
      if (leftRunning !== rightRunning) return leftRunning ? -1 : 1;
      return (right.endedAt ?? right.startedAt) - (left.endedAt ?? left.startedAt)
        || left.taskId.localeCompare(right.taskId);
    })
    .slice(0, MAX_PANEL_TASKS);
}

function TaskStatusIcon({ status }: { status: string }) {
  if (status === "running") return <IconLoader2 className="size-3.5 animate-spin text-blue-500" />;
  if (status === "completed") return <IconCircleCheck className="size-3.5 text-emerald-500" />;
  return <IconCircleX className="size-3.5 text-destructive" />;
}

function TaskRow({ task }: { task: BackgroundTaskItem }) {
  const t = useT();
  const failed = FAILED_STATUSES.has(task.status);
  const seconds = taskDurationSeconds(task);
  const statusText = task.status === "running"
    ? t("pills.statusRunning", { seconds })
    : task.status === "completed"
      ? t("pills.statusDone", { seconds })
      : t("pills.statusFailed", { seconds });
  return (
    <div className="flex items-center gap-1.5 py-0.5">
      <TaskStatusIcon status={task.status} />
      <span className={cn("flex-1 min-w-0 truncate text-xs", failed && "text-destructive")}>{task.description}</span>
      <span className="shrink-0 rounded bg-muted px-1 py-px text-[9px] text-muted-foreground">
        {task.kind === "process" ? t("pills.badgeBash") : t("pills.badgeAgent")}
      </span>
      <span className={cn("shrink-0 text-[10px] tabular-nums", failed ? "text-destructive" : "text-muted-foreground")}>
        {statusText}
      </span>
    </div>
  );
}

export function StatusPills() {
  const t = useT();
  const sessionId = useChatStore((state) => state.sessionId);
  const queue = useChatStore((state) => state.queue);
  const todoItems = useChatStore((state) => findLastTodoItems(state.messages));
  const hasCompaction = useChatStore((state) => state.isCompacting
    || state.messages.some((message) => message.steps?.some((step) => step.items.some((item) => item.type === "compaction"))));
  const [openPanel, setOpenPanel] = useState<PanelId | null>(null);
  const [fileChanges, setFileChanges] = useState<FileChange[]>([]);
  const [contextOpen, setContextOpen] = useState(false);
  const [queueFlash, setQueueFlash] = useState(false);
  const [tasks, setTasks] = useState<BackgroundTaskItem[]>([]);
  const [tasksError, setTasksError] = useState<string | null>(null);
  const prevQueueLen = useRef(queue.length);

  useEffect(() => {
    const grew = queue.length > prevQueueLen.current;
    prevQueueLen.current = queue.length;
    if (!grew) return;
    setQueueFlash(true);
    const timer = setTimeout(() => setQueueFlash(false), QUEUE_FLASH_DURATION_MS);
    return () => clearTimeout(timer);
  }, [queue.length]);

  useEffect(() => {
    return bridge.on<FileChange[]>(Events.FileChangesUpdated, setFileChanges);
  }, []);

  useEffect(() => {
    let cancelled = false;
    setTasks([]);
    setTasksError(null);
    if (sessionId === null) return;

    const read = async () => {
      if (document.visibilityState === "hidden") return;
      try {
        const result = await bridge.getBackgroundTasks();
        if (!cancelled) {
          setTasks(result.tasks);
          setTasksError(null);
        }
      } catch (error) {
        if (!cancelled) {
          setTasks([]);
          setTasksError(error instanceof Error ? error.message : String(error));
        }
      }
    };

    void read();
    const interval = setInterval(() => void read(), TASKS_POLL_INTERVAL_MS);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [sessionId]);

  const bashTasks = tasks.filter((task) => task.kind === "process");
  const agentTasks = tasks.filter((task) => task.kind === "agent");
  const todoTotal = todoItems?.length ?? 0;
  const todoDone = todoItems?.filter((item) => item.status === "done").length ?? 0;
  const fileStats = fileChanges.reduce(
    (totals, change) => ({ additions: totals.additions + change.additions, deletions: totals.deletions + change.deletions }),
    { additions: 0, deletions: 0 },
  );

  useEffect(() => {
    if (openPanel === "queue" && queue.length === 0) setOpenPanel(null);
    if (openPanel === "changes" && fileChanges.length === 0) setOpenPanel(null);
    if (openPanel === "bash" && bashTasks.length === 0) setOpenPanel(null);
    if (openPanel === "agents" && agentTasks.length === 0) setOpenPanel(null);
    if (openPanel === "todos" && todoItems === null) setOpenPanel(null);
  }, [openPanel, queue.length, fileChanges.length, bashTasks.length, agentTasks.length, todoItems]);

  const hasQueue = queue.length > 0;
  const hasChanges = fileChanges.length > 0;
  const hasBash = bashTasks.length > 0;
  const hasAgents = agentTasks.length > 0;
  const hasTodos = todoItems !== null && todoTotal > 0;
  if (!hasQueue && !hasChanges && !hasBash && !hasAgents && !hasTodos && !hasCompaction && tasksError === null) {
    return (
      <>
        <ApprovalDialog />
        <QuestionDialog />
      </>
    );
  }

  const togglePanel = (panel: PanelId) => {
    setOpenPanel((previous) => (previous === panel ? null : panel));
  };

  const pillClass = (active: boolean) => cn(
    "flex items-center gap-1.5 px-2 py-0.5 rounded text-xs transition-colors cursor-pointer",
    active ? "bg-accent text-accent-foreground" : "hover:bg-muted/50 text-muted-foreground",
  );
  const queuePillClass = (active: boolean) => cn(
    "flex items-center gap-1.5 px-2 py-0.5 rounded text-xs transition-colors cursor-pointer",
    "bg-blue-500/15 text-blue-600 dark:text-blue-400 hover:bg-blue-500/25",
    active && "bg-blue-500/25",
  );
  const runningBash = bashTasks.filter((task) => task.status === "running").length;
  const runningAgents = agentTasks.filter((task) => task.status === "running").length;

  return (
    <div className="shrink-0 mb-0.5">
      <ApprovalDialog />
      <QuestionDialog />

      {openPanel !== null && (
        <div className="mb-0.5 max-h-40 overflow-y-auto border border-border/60 rounded-md bg-card">
          {(openPanel === "bash" || openPanel === "agents" || openPanel === "todos") && (
            <div className="border-b border-border/60 px-2 py-1 text-xs font-medium">
              {openPanel === "bash" && t("pills.bashTitle", { count: runningBash })}
              {openPanel === "agents" && t("pills.agentsTitle", { count: runningAgents })}
              {openPanel === "todos" && t("pills.todosTitle", { done: todoDone, total: todoTotal })}
            </div>
          )}
          {openPanel === "queue" && <QueuedMessagesPanel />}
          {openPanel === "changes" && <FileChangesPanel changes={fileChanges} />}
          {(openPanel === "bash" || openPanel === "agents" || openPanel === "todos") && (
            <div className="px-2 py-1">
              {openPanel === "bash" && sortTasks(bashTasks).map((task) => <TaskRow key={task.taskId} task={task} />)}
              {openPanel === "agents" && sortTasks(agentTasks).map((task) => <TaskRow key={task.taskId} task={task} />)}
              {openPanel === "todos" && todoItems?.map((item, index) => (
                <div key={`${item.title}-${index}`} className="flex items-start gap-1 py-0.5">
                  <div className="mt-0.5"><TodoStatusIcon status={item.status} /></div>
                  <span className={cn("text-xs leading-relaxed", item.status === "done" && "line-through text-muted-foreground")}>
                    {item.title}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="flex items-center justify-between gap-1 py-0.5 min-h-7">
        <div className="flex items-center gap-1 min-w-0">
          {hasQueue && (
            <button type="button" onClick={() => togglePanel("queue")} className={cn(queuePillClass(openPanel === "queue"), "relative")}>
              {queueFlash && <span aria-hidden className="absolute inset-0 rounded bg-blue-500/40 animate-ping [animation-iteration-count:1]" />}
              <IconStack2 className="size-3.5" />
              <span>{t("queue.queuedCount", { count: queue.length })}</span>
            </button>
          )}
          {hasChanges && (
            <button
              type="button"
              onClick={() => togglePanel("changes")}
              className={pillClass(openPanel === "changes")}
              title={t("changes.lineStats", { additions: fileStats.additions, deletions: fileStats.deletions })}
            >
              <IconFileCode className="size-3.5" />
              <span>{t("changes.changedCount", { count: fileChanges.length })}</span>
            </button>
          )}
          {tasksError !== null && (
            <span className="flex items-center gap-1 px-2 py-0.5 text-xs text-destructive" role="alert">
              <IconCircleX className="size-3.5" />
              <span>{t("pills.loadFailed", { error: tasksError })}</span>
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 shrink-0">
          {hasBash && (
            <button type="button" onClick={() => togglePanel("bash")} className={pillClass(openPanel === "bash")}>
              <IconTerminal2 className="size-3.5" />
              <span>{t("pills.bash", { count: bashTasks.length })}</span>
            </button>
          )}
          {hasAgents && (
            <button type="button" onClick={() => togglePanel("agents")} className={pillClass(openPanel === "agents")}>
              <IconSubtask className="size-3.5" />
              <span>{t("pills.agents", { count: agentTasks.length })}</span>
            </button>
          )}
          {hasTodos && (
            <button type="button" onClick={() => togglePanel("todos")} className={pillClass(openPanel === "todos")}>
              <IconListCheck className="size-3.5" />
              <span>{t("pills.todos", { done: todoDone, total: todoTotal })}</span>
            </button>
          )}
          {hasCompaction && (
            <button type="button" onClick={() => setContextOpen(true)} className={pillClass(false)} title={t("context.tooltip")}>
              <IconBrain className="size-3.5" />
              <span>{t("context.label")}</span>
            </button>
          )}
        </div>
      </div>

      <ContextViewerDialog open={contextOpen} onOpenChange={setContextOpen} />
    </div>
  );
}
