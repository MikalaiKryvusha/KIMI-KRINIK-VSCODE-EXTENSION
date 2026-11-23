import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const boundary = vi.hoisted(() => ({
  updateExtensionSetting: vi.fn(),
  saveConfig: vi.fn(),
  setAutoCompact: vi.fn(),
  setPermissionMode: vi.fn(),
  setSwarmMode: vi.fn(),
  controlGoal: vi.fn(),
}));

vi.mock("@/services", () => ({
  bridge: {
    updateExtensionSetting: boundary.updateExtensionSetting,
    saveConfig: boundary.saveConfig,
    setAutoCompact: boundary.setAutoCompact,
    setPermissionMode: boundary.setPermissionMode,
    setSwarmMode: boundary.setSwarmMode,
    controlGoal: boundary.controlGoal,
  },
}));
vi.mock("@/components/ui/sonner", () => ({
  toast: { error: vi.fn(), warning: vi.fn(), info: vi.fn(), success: vi.fn() },
}));

import { BehaviorButtons } from "../../webview-ui/src/components/BehaviorButtons";
import { ActionMenu } from "../../webview-ui/src/components/ActionMenu";
import { ControlPanelSettingsDialog } from "../../webview-ui/src/components/ControlPanelSettingsDialog";
import { ModeButtons } from "../../webview-ui/src/components/ModeButtons";
import { PermissionModeButton } from "../../webview-ui/src/components/PermissionModeButton";
import { SubagentModelDialog } from "../../webview-ui/src/components/SubagentModelDialog";
import { useChatStore } from "../../webview-ui/src/stores/chat.store";
import { DEFAULT_EXTENSION_CONFIG, useSettingsStore } from "../../webview-ui/src/stores/settings.store";

beforeEach(() => {
  vi.stubGlobal("ResizeObserver", class {
    observe() {}
    unobserve() {}
    disconnect() {}
  });
  for (const mock of Object.values(boundary)) mock.mockReset();
  boundary.updateExtensionSetting.mockResolvedValue({ ok: true });
  useSettingsStore.setState({
    extensionConfig: { ...DEFAULT_EXTENSION_CONFIG, controlPanel: { ...DEFAULT_EXTENSION_CONFIG.controlPanel } },
    autoCompact: true,
    autoCompactPending: false,
  });
  useChatStore.setState({ permissionMode: "auto", goal: null, goalArmed: false, swarmMode: false, sessionId: null });
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("Control Panel settings", () => {
  it("persists a checkbox without closing the dialog or changing feature values", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(<ControlPanelSettingsDialog open onOpenChange={onOpenChange} />);

    await user.click(screen.getByRole("checkbox", { name: "Plan" }));

    expect(useSettingsStore.getState().extensionConfig.controlPanel.plan).toBe(false);
    expect(useSettingsStore.getState().extensionConfig.autoSteer).toBe(true);
    expect(boundary.updateExtensionSetting).toHaveBeenCalledWith({ key: "controlPanel.plan", value: false });
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it("hides only the unchecked behavior and mode buttons", () => {
    useSettingsStore.setState({
      extensionConfig: {
        ...DEFAULT_EXTENSION_CONFIG,
        controlPanel: { permission: true, compact: false, steer: false, control: false, plan: false, goal: false, swarm: false, secondaryModel: false },
      },
    });
    render(
      <>
        <BehaviorButtons />
        <ModeButtons planMode={false} onTogglePlanMode={vi.fn()} />
      </>,
    );

    expect(screen.queryByTestId("mode-compact")).toBeNull();
    expect(screen.queryByTestId("mode-steer")).toBeNull();
    expect(screen.queryByTestId("mode-control")).toBeNull();
    expect(screen.queryByTestId("mode-plan")).toBeNull();
    expect(screen.queryByTestId("mode-goal")).toBeNull();
    expect(screen.queryByTestId("mode-swarm")).toBeNull();
    expect(useSettingsStore.getState().autoCompact).toBe(true);
    expect(useSettingsStore.getState().extensionConfig.autoSteer).toBe(true);
  });

  it("uses cyan rather than destructive red for Auto mode", () => {
    render(<PermissionModeButton />);
    const button = screen.getByTestId("permission-mode");
    expect(button.className).toContain("bg-cyan-500/15");
    expect(button.className).toContain("text-cyan-500");
    expect(button.className).not.toContain("bg-destructive");
  });

  it("opens the checkbox screen from the settings menu", async () => {
    const user = userEvent.setup();
    render(<ActionMenu />);

    await user.click(screen.getByRole("button"));
    await user.click(await screen.findByText("Control Panel"));

    expect(await screen.findByText("Choose which buttons are visible. Hidden features keep working and remain available in General settings.")).not.toBeNull();
    expect(screen.getAllByRole("checkbox")).toHaveLength(8);
  });

  it("disables thresholds while Control is off and edits them while Control is on", async () => {
    const user = userEvent.setup();
    render(<ControlPanelSettingsDialog open onOpenChange={vi.fn()} />);
    const threshold = screen.getByTestId("context-window-threshold-warnPct") as HTMLInputElement;
    expect(threshold.disabled).toBe(true);

    await user.click(screen.getByTestId("context-window-control-toggle"));
    expect(threshold.disabled).toBe(false);
    expect(boundary.updateExtensionSetting).toHaveBeenCalledWith({ key: "contextWindowControl", value: true });

    await user.clear(threshold);
    await user.type(threshold, "72");
    expect(useSettingsStore.getState().extensionConfig.contextWindowThresholds.warnPct).toBe(72);
    expect(boundary.updateExtensionSetting).toHaveBeenLastCalledWith({ key: "kaif.warnPercent", value: 72 });
  });

  it("selects and clears the secondary model through the robot without changing effort", async () => {
    const user = userEvent.setup();
    boundary.saveConfig.mockResolvedValue({ ok: true });
    useSettingsStore.setState({
      models: [
        { id: "main", name: "Main", provider: "managed:kimi-code", capabilities: ["thinking"], support_efforts: ["low", "high"] },
        { id: "reasoning", name: "Reasoning", provider: "managed:kimi-code", capabilities: ["thinking"], support_efforts: ["low", "high"] },
      ],
      currentModel: "main",
      thinkingEffort: "high",
      secondaryModel: null,
    });
    render(<SubagentModelDialog />);

    await user.click(screen.getByTestId("secondary-model"));
    await user.click(await screen.findByRole("button", { name: "Reasoning" }));

    expect(boundary.saveConfig).toHaveBeenLastCalledWith({
      model: "main",
      thinking: true,
      effort: "high",
      effortChanged: false,
      secondaryModel: { model: "reasoning" },
    });
    expect(useSettingsStore.getState().secondaryModel).toEqual({ model: "reasoning" });
    expect(useSettingsStore.getState().thinkingEffort).toBe("high");

    await user.click(screen.getByTestId("secondary-model"));
    await user.click(await screen.findByRole("button", { name: /Follow main model/ }));

    expect(boundary.saveConfig).toHaveBeenLastCalledWith({
      model: "main",
      thinking: true,
      effort: "high",
      effortChanged: false,
      secondaryModel: null,
    });
    expect(useSettingsStore.getState().secondaryModel).toBeNull();
    expect(useSettingsStore.getState().currentModel).toBe("main");
    expect(useSettingsStore.getState().thinkingEffort).toBe("high");
  });

  it("shows the persisted default permission before a session starts", () => {
    useSettingsStore.setState({ defaultPermissionMode: "auto" });
    useChatStore.setState({ permissionMode: null });

    render(<PermissionModeButton />);

    expect(screen.getByTestId("permission-mode").textContent).toBe("Auto");
  });
});
