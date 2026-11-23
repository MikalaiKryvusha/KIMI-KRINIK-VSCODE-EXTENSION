import type { SoundSettings } from "./sounds";
import type { RunResult, SecondaryModelSelection, StreamEvent } from "./legacy-sdk";

export interface SessionConfig {
  model: string;
  thinking?: boolean;
  effort?: string;
  effortChanged?: boolean;
  secondaryModel?: SecondaryModelSelection | null;
}

export interface ProjectFile {
  path: string;
  name: string;
  isDirectory: boolean;
  matchPositions?: number[];
}

export interface FileChange {
  path: string;
  status: "Modified" | "Added" | "Deleted";
  additions: number;
  deletions: number;
}

export const CONTROL_PANEL_BUTTONS = ["permission", "compact", "steer", "control", "plan", "goal", "swarm", "secondaryModel"] as const;

export type ControlPanelButton = (typeof CONTROL_PANEL_BUTTONS)[number];
export type ControlPanelVisibility = Record<ControlPanelButton, boolean>;
export type ControlPanelSettingKey = `controlPanel.${ControlPanelButton}`;

export interface ContextWindowThresholds {
  warnPct: number;
  cutPct: number;
  closePct: number;
  forcePct: number;
}

export type KaifThresholds = ContextWindowThresholds;

export const CONTEXT_WINDOW_THRESHOLD_SETTINGS = {
  warnPct: "kaif.warnPercent",
  cutPct: "kaif.cutPercent",
  closePct: "kaif.closePercent",
  forcePct: "kaif.forcePercent",
} as const;

export type ContextWindowThresholdSettingKey = (typeof CONTEXT_WINDOW_THRESHOLD_SETTINGS)[keyof ContextWindowThresholds];

export interface ExtensionConfig {
  yoloMode: boolean;
  autosave: boolean;
  useCtrlEnterToSend: boolean;
  enableNewConversationShortcut: boolean;
  showThinkingContent: boolean;
  showThinkingExpanded: boolean;
  autoSteer: boolean;
  contextWindowControl: boolean;
  contextWindowThresholds: ContextWindowThresholds;
  controlPanel: ControlPanelVisibility;
  language: InterfaceLanguage;
  sounds: SoundSettings;
  version: string;
}

export const INTERFACE_LANGUAGES = ["en", "zh", "ru"] as const;

export type InterfaceLanguage = (typeof INTERFACE_LANGUAGES)[number];

export type ExtensionSettingUpdate =
  | { key: "autoSteer"; value: boolean }
  | { key: "contextWindowControl"; value: boolean }
  | { key: ContextWindowThresholdSettingKey; value: number }
  | { key: ControlPanelSettingKey; value: boolean }
  | { key: "language"; value: InterfaceLanguage }
  | { key: "sounds"; value: SoundSettings };

export type KaifProjection = "projected" | "absent";

export type AutoCompactResult =
  | { ok: true; enabled: boolean; kaif?: KaifProjection }
  | { ok: false; enabled: boolean; error: string };

export interface WorkspaceStatus {
  hasWorkspace: boolean;
  path?: string;
  workspaceRoot?: string;
}

export type ErrorPhase = "preflight" | "runtime";

export interface StreamError {
  type: "error";
  code: string;
  message: string;
  detail?: string;
  phase: ErrorPhase;
  terminal?: boolean;
}

export type UIStreamEvent =
  | { type: "session_start"; sessionId: string; model?: string; _sessionId?: string }
  | { type: "stream_complete"; result: RunResult; _sessionId?: string }
  | (StreamError & { _sessionId?: string })
  | (StreamEvent & { _sessionId?: string });

export interface LoginStatus {
  loggedIn: boolean;
  siteBase: string;
}

export type { QuestionRequest, QuestionItem, QuestionOption, QuestionResponse } from "./legacy-sdk";
