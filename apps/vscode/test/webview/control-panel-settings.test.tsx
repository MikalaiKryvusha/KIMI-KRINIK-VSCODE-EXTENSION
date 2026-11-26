import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const boundary = vi.hoisted(() => ({
  updateExtensionSetting: vi.fn(),
  saveConfig: vi.fn(),
  setAutoCompact: vi.fn(),
  setPermissionMode: vi.fn(),
  setSwarmMode: vi.fn(),
  controlGoal: vi.fn(),
  openProjectPage: vi.fn(),
  steerChat: vi.fn(),
  getSessionBusy: vi.fn(),
  openSettings: vi.fn(),
}));

vi.mock("@/services", () => ({
  bridge: {
    updateExtensionSetting: boundary.updateExtensionSetting,
    saveConfig: boundary.saveConfig,
    setAutoCompact: boundary.setAutoCompact,
    setPermissionMode: boundary.setPermissionMode,
    setSwarmMode: boundary.setSwarmMode,
    controlGoal: boundary.controlGoal,
    openProjectPage: boundary.openProjectPage,
    steerChat: boundary.steerChat,
    getSessionBusy: boundary.getSessionBusy,
    openSettings: boundary.openSettings,
  },
}));
vi.mock("@/components/ui/sonner", () => ({
  toast: { error: vi.fn(), warning: vi.fn(), info: vi.fn(), success: vi.fn() },
}));

import { BehaviorButtons, StateDescription } from "../../webview-ui/src/components/BehaviorButtons";
import { ActionMenu } from "../../webview-ui/src/components/ActionMenu";
import { ControlPanelSettingsDialog } from "../../webview-ui/src/components/ControlPanelSettingsDialog";
import { GeneralSettingsDialog } from "../../webview-ui/src/components/GeneralSettingsDialog";
import { ModeButtons } from "../../webview-ui/src/components/ModeButtons";
import { PermissionModeButton } from "../../webview-ui/src/components/PermissionModeButton";
import { SkillPickerDialog, localizedSkillDescription } from "../../webview-ui/src/components/SkillPickerDialog";
import { SubagentModelDialog } from "../../webview-ui/src/components/SubagentModelDialog";
import { useChatStore } from "../../webview-ui/src/stores/chat.store";
import { DEFAULT_EXTENSION_CONFIG, useSettingsStore } from "../../webview-ui/src/stores/settings.store";
import { CONTROL_PANEL_BUTTONS } from "../../shared/types";

beforeEach(() => {
  vi.stubGlobal("ResizeObserver", class {
    observe() {}
    unobserve() {}
    disconnect() {}
  });
  for (const mock of Object.values(boundary)) mock.mockReset();
  boundary.updateExtensionSetting.mockResolvedValue({ ok: true });
  boundary.steerChat.mockResolvedValue({ ok: true, submission: { promptId: "skill-steer", createdAt: "2026-11-25T00:00:00.000Z", state: "running", turnId: 1, steered: true } });
  boundary.getSessionBusy.mockResolvedValue({ busy: true });
  useSettingsStore.setState({
    extensionConfig: { ...DEFAULT_EXTENSION_CONFIG, controlPanel: { ...DEFAULT_EXTENSION_CONFIG.controlPanel } },
    autoCompact: true,
    autoCompactPending: false,
    currentModel: "main",
    slashCommands: [],
  });
  useChatStore.setState({ permissionMode: "auto", goal: null, goalArmed: false, swarmMode: false, sessionId: null, messages: [], isStreaming: false, queue: [], draftMedia: [], pendingInput: null });
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("Control Panel settings", () => {
  it("keeps context-window controls out of Control Panel settings", () => {
    render(<ControlPanelSettingsDialog open onOpenChange={vi.fn()} />);

    expect(screen.queryByTestId("context-window-control-toggle")).toBeNull();
    expect(screen.queryByTestId("context-window-threshold-warnPct")).toBeNull();
    expect(screen.getAllByRole("checkbox")).toHaveLength(9);
  });

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

  it("moves hidden and visible buttons with chevrons and persists their top-to-bottom order", async () => {
    const user = userEvent.setup();
    useSettingsStore.setState({
      extensionConfig: {
        ...DEFAULT_EXTENSION_CONFIG,
        controlPanel: { ...DEFAULT_EXTENSION_CONFIG.controlPanel, skills: false },
        controlPanelOrder: ["permission", "skills", "compact", "steer", "control", "plan", "goal", "swarm", "secondaryModel"],
      },
    });
    render(<ControlPanelSettingsDialog open onOpenChange={vi.fn()} />);

    expect(screen.getByTestId("control-panel-move-up-permission")).toHaveProperty("disabled", true);
    expect(screen.getByTestId("control-panel-move-down-secondaryModel")).toHaveProperty("disabled", true);
    await user.click(screen.getByTestId("control-panel-move-down-skills"));

    expect(useSettingsStore.getState().extensionConfig.controlPanel.skills).toBe(false);
    expect(useSettingsStore.getState().extensionConfig.controlPanelOrder).toEqual(["permission", "compact", "skills", "steer", "control", "plan", "goal", "swarm", "secondaryModel"]);
    expect(boundary.updateExtensionSetting).toHaveBeenCalledWith({
      key: "controlPanelOrder",
      value: ["permission", "compact", "skills", "steer", "control", "plan", "goal", "swarm", "secondaryModel"],
    });
  });

  it("applies a saved order to every Control Panel button", () => {
    const controlPanelOrder = CONTROL_PANEL_BUTTONS.toReversed();
    useSettingsStore.setState({
      extensionConfig: { ...DEFAULT_EXTENSION_CONFIG, controlPanelOrder },
      slashCommands: [{ name: "skill:review", aliases: [], description: "Review" }],
      models: [{ id: "main", name: "Main", provider: "managed:kimi-code", capabilities: [] }],
    });
    render(
      <>
        <PermissionModeButton />
        <BehaviorButtons />
        <ModeButtons planMode={false} onTogglePlanMode={vi.fn()} />
        <SubagentModelDialog />
      </>,
    );
    const testId = {
      permission: "permission-mode",
      skills: "skill-picker",
      compact: "mode-compact",
      steer: "mode-steer",
      control: "mode-control",
      plan: "mode-plan",
      goal: "mode-goal",
      swarm: "mode-swarm",
      secondaryModel: "secondary-model",
    };

    for (const [index, button] of controlPanelOrder.entries()) {
      expect(screen.getByTestId(testId[button]).style.order, button).toBe(String(index));
    }
  });

  it("keeps a normal cursor while Compact persists its state", () => {
    render(<BehaviorButtons />);

    const compact = screen.getByTestId("mode-compact");
    expect(compact.className).toContain("disabled:cursor-default");
    expect(compact.className).not.toContain("disabled:cursor-not-allowed");
  });

  it("tints the state word green for ON and red for OFF in all three languages", () => {
    const { rerender } = render(<StateDescription text="ON: automatic compaction is enabled." on={true} />);
    expect(screen.getByText("ON:").className).toContain("text-green-600");
    expect(screen.getByText("ON:").className).toContain("dark:text-green-400");

    rerender(<StateDescription text="OFF: automatic compaction is disabled." on={false} />);
    expect(screen.getByText("OFF:").className).toContain("text-red-600");
    expect(screen.getByText("OFF:").className).toContain("dark:text-red-400");

    rerender(<StateDescription text="ВЫКЛ: сжатие отключено." on={false} />);
    expect(screen.getByText("ВЫКЛ:").className).toContain("text-red-600");

    rerender(<StateDescription text="ВКЛ: сжатие включено." on={true} />);
    expect(screen.getByText("ВКЛ:").className).toContain("text-green-600");

    const { container } = render(<StateDescription text="关闭：聊天上下文自动压缩已禁用。" on={false} />);
    expect(screen.getByText("关闭：").className).toContain("text-red-600");
    expect(container.textContent).toBe("关闭：聊天上下文自动压缩已禁用。");
  });

  it("hides only the unchecked behavior and mode buttons", () => {
    useSettingsStore.setState({
      extensionConfig: {
        ...DEFAULT_EXTENSION_CONFIG,
        controlPanel: { permission: true, compact: false, steer: false, control: false, skills: false, plan: false, goal: false, swarm: false, secondaryModel: false },
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
    expect(screen.queryByTestId("skill-picker")).toBeNull();
    expect(screen.queryByTestId("mode-plan")).toBeNull();
    expect(screen.queryByTestId("mode-goal")).toBeNull();
    expect(screen.queryByTestId("mode-swarm")).toBeNull();
    expect(useSettingsStore.getState().autoCompact).toBe(true);
    expect(useSettingsStore.getState().extensionConfig.autoSteer).toBe(true);
  });

  it("uses the same blue as the other active buttons for Auto mode", () => {
    render(<PermissionModeButton />);
    const button = screen.getByTestId("permission-mode");
    expect(button.className).toContain("bg-blue-500/15");
    expect(button.className).toContain("text-blue-600");
    expect(button.className).toContain("dark:text-blue-400");
    expect(button.className).not.toContain("cyan");
    expect(button.className).not.toContain("bg-destructive");
  });

  it("opens the checkbox screen from the settings menu", async () => {
    const user = userEvent.setup();
    render(<ActionMenu />);

    await user.click(screen.getByRole("button"));
    await user.click(await screen.findByText("Control Panel"));

    expect(await screen.findByText("Choose visible buttons and use chevrons to set their order. Higher rows appear farther left; hidden features keep working in General settings.")).not.toBeNull();
    expect(screen.getAllByRole("checkbox")).toHaveLength(9);
  });

  it("opens localized General Settings in the extension instead of VS Code", async () => {
    const user = userEvent.setup();
    render(<ActionMenu />);

    await user.click(screen.getByRole("button"));
    await user.click(await screen.findByText("General Settings"));

    expect(await screen.findByTestId("general-settings-dialog")).not.toBeNull();
    expect(screen.getByTestId("general-setting-autosave")).not.toBeNull();
    expect(boundary.openSettings).not.toHaveBeenCalled();
  });

  it.each([
    ["ru", "Общие настройки"],
    ["zh", "通用设置"],
  ] as const)("renders General Settings in %s", (language, title) => {
    useSettingsStore.setState({ extensionConfig: { ...DEFAULT_EXTENSION_CONFIG, language } });
    render(<GeneralSettingsDialog open onOpenChange={vi.fn()} />);

    expect(screen.getByText(title)).not.toBeNull();
    expect(screen.getByTestId("general-settings-dialog")).not.toBeNull();
  });

  it.each([
    ["en", "On: files are saved before the agent reads or edits them.", "Off: unsaved files remain only in the editor."],
    ["ru", "Вкл: файлы сохраняются перед чтением или изменением агентом.", "Выкл: несохранённые файлы остаются только в редакторе."],
    ["zh", "开启：代理读取或修改文件前先保存。", "关闭：未保存的文件仅保留在编辑器中。"],
  ] as const)("renders General Settings On/Off descriptions on separate lines in %s", (language, on, off) => {
    useSettingsStore.setState({ extensionConfig: { ...DEFAULT_EXTENSION_CONFIG, language } });
    render(<GeneralSettingsDialog open onOpenChange={vi.fn()} />);

    const description = screen.getByTestId("general-description-autosave");
    expect(Array.from(description.children).map((line) => line.textContent)).toEqual([on, off]);
    for (const line of description.children) expect(line.className).toContain("block");
  });

  it("persists general booleans and editor context without duplicating dedicated screens", async () => {
    const user = userEvent.setup();
    render(<GeneralSettingsDialog open onOpenChange={vi.fn()} />);

    await user.click(screen.getByTestId("general-setting-autosave"));

    expect(useSettingsStore.getState().extensionConfig.autosave).toBe(false);
    expect(boundary.updateExtensionSetting).toHaveBeenCalledWith({ key: "autosave", value: false });
    await user.selectOptions(screen.getByTestId("general-editor-context"), "onFileChange");
    expect(useSettingsStore.getState().extensionConfig.editorContext).toBe("onFileChange");
    expect(boundary.updateExtensionSetting).toHaveBeenLastCalledWith({ key: "editorContext", value: "onFileChange" });
    expect(screen.queryByTestId("language-selection-dialog")).toBeNull();
    expect(screen.queryByTestId("sound-settings-dialog")).toBeNull();
    expect(screen.queryByTestId("control-panel-option-plan")).toBeNull();
  });

  it("disables thresholds while Control is off and edits them while Control is on", async () => {
    const user = userEvent.setup();
    render(<GeneralSettingsDialog open onOpenChange={vi.fn()} />);
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

  it("keeps actions in a scrollable menu without duplicated behavior switches", async () => {
    const user = userEvent.setup();
    render(<ActionMenu />);

    await user.click(screen.getByRole("button"));
    expect(await screen.findByText("Control Panel")).not.toBeNull();
    expect(screen.queryByText("Behavior")).toBeNull();
    expect(screen.queryByRole("switch", { name: "Compact" })).toBeNull();
    expect(screen.queryByRole("switch", { name: "Steer" })).toBeNull();
    const content = document.querySelector('[data-slot="popover-content"]');
    expect(content?.className).toContain("overflow-y-auto");
    expect(content?.className).toContain("max-h-");
    const text = content?.textContent ?? "";
    expect(text).toContain("Language");
    expect(screen.queryByRole("button", { name: "English" })).toBeNull();
    expect(screen.queryByRole("button", { name: "Русский" })).toBeNull();
    expect(screen.queryByRole("button", { name: "中文" })).toBeNull();
  });

  it("moves language selection into one dialog with ordered persistent choices", async () => {
    const user = userEvent.setup();
    render(<ActionMenu />);

    await user.click(screen.getByRole("button"));
    await user.click(await screen.findByText("Language / Язык / 语言"));

    const dialog = await screen.findByTestId("language-selection-dialog");
    expect(document.querySelector('[data-slot="popover-content"]')).toBeNull();
    const english = within(dialog).getByRole("button", { name: "English" });
    const russian = within(dialog).getByRole("button", { name: "Русский" });
    const chinese = within(dialog).getByRole("button", { name: "中文" });
    const currentText = () => dialog.textContent ?? "";
    expect(currentText().indexOf("English")).toBeLessThan(currentText().indexOf("Русский"));
    expect(currentText().indexOf("Русский")).toBeLessThan(currentText().indexOf("中文"));
    expect(english.getAttribute("aria-pressed")).toBe("true");
    expect(russian.getAttribute("aria-pressed")).toBe("false");
    expect(chinese.getAttribute("aria-pressed")).toBe("false");

    await user.click(russian);
    expect(useSettingsStore.getState().extensionConfig.language).toBe("ru");
    expect(boundary.updateExtensionSetting).toHaveBeenCalledWith({ key: "language", value: "ru" });
    expect(russian.getAttribute("aria-pressed")).toBe("true");
    expect(within(dialog).getByText("Русский / English / 中文")).not.toBeNull();
    expect(currentText().indexOf("Русский")).toBeLessThan(currentText().indexOf("English"));
    expect(currentText().indexOf("English")).toBeLessThan(currentText().indexOf("中文"));

    await user.click(chinese);
    expect(within(dialog).getByText("中文 / English / Русский")).not.toBeNull();
    expect(currentText().indexOf("中文")).toBeLessThan(currentText().indexOf("English"));
    expect(currentText().indexOf("English")).toBeLessThan(currentText().indexOf("Русский"));

    await user.click(english);
    expect(useSettingsStore.getState().extensionConfig.language).toBe("en");
    expect(boundary.updateExtensionSetting).toHaveBeenLastCalledWith({ key: "language", value: "en" });

    await user.click(within(dialog).getByRole("button", { name: "Close" }));
    expect(screen.queryByTestId("language-selection-dialog")).toBeNull();
    expect(document.querySelector('[data-slot="popover-content"]')).toBeNull();
    expect(useSettingsStore.getState().extensionConfig.language).toBe("en");
  });

  it("shows all language action labels with the current language first", async () => {
    const user = userEvent.setup();
    render(<ActionMenu />);

    await user.click(screen.getByRole("button"));

    for (const [language, label] of [
      ["en", "Language / Язык / 语言"],
      ["ru", "Язык / Language / 语言"],
      ["zh", "语言 / Language / Язык"],
    ] as const) {
      useSettingsStore.setState({ extensionConfig: { ...DEFAULT_EXTENSION_CONFIG, language } });
      expect(await screen.findByText(label)).not.toBeNull();
    }
  });

  it("shows the extension version and build number in Support", async () => {
    useSettingsStore.setState({
      extensionConfig: { ...DEFAULT_EXTENSION_CONFIG, version: "1.0.0", buildNumber: 37 },
    });
    const user = userEvent.setup();
    render(<ActionMenu />);

    await user.click(screen.getByRole("button"));

    expect(await screen.findByText("v1.0.0 (37)")).not.toBeNull();
  });

  it("opens the project page from Support", async () => {
    const user = userEvent.setup();
    render(<ActionMenu />);

    await user.click(screen.getByRole("button"));
    await user.click(await screen.findByText("About KIMI KRINIK"));

    expect(boundary.openProjectPage).toHaveBeenCalledTimes(1);
  });

  it("uses the brand pink for checked switches and checkboxes", () => {
    const { rerender } = render(<ControlPanelSettingsDialog open onOpenChange={vi.fn()} />);

    expect(screen.getByTestId("control-panel-option-plan").className).toContain("data-checked:bg-[#FF1A8C]");
    expect(screen.getByTestId("control-panel-option-plan").className).toContain("data-checked:border-[#FF1A8C]");
    rerender(<GeneralSettingsDialog open onOpenChange={vi.fn()} />);
    expect(screen.getByTestId("context-window-control-toggle").className).toContain("data-checked:bg-[#FF1A8C]");
  });

  it("resolves localized skill descriptions and their fallbacks", () => {
    const localized = { name: "skill:review", aliases: [], description: "English description", description_ru: "Русское описание", description_zh: "中文说明" };
    expect(localizedSkillDescription(localized, "en")).toBe("English description");
    expect(localizedSkillDescription(localized, "ru")).toBe("Русское описание");
    expect(localizedSkillDescription(localized, "zh")).toBe("中文说明");
    expect(localizedSkillDescription({ name: "skill:plain", aliases: [], description: "Fallback" }, "ru")).toBe("Fallback");
    expect(localizedSkillDescription({ name: "skill:plain", aliases: [], description: "Fallback" }, "zh")).toBe("Fallback");
  });

  it("shows a two-line skill row and sends it through immediate Steer", async () => {
    const user = userEvent.setup();
    useSettingsStore.setState({
      slashCommands: [{ name: "skill:review", aliases: [], description: "English description", description_ru: "Русское описание", description_zh: "中文说明" }],
    });
    useChatStore.setState({ isStreaming: true });
    render(<SkillPickerDialog />);

    await user.click(screen.getByTestId("skill-picker"));
    const dialog = await screen.findByTestId("skill-picker-dialog");
    expect(dialog.className).toContain("h-[calc(100vh-6rem)]");
    expect(dialog.className).toContain("max-w-[calc(100%-6rem)]");
    const row = within(dialog).getByRole("button", { name: /review/ });
    expect(within(row).getByTestId("skill-picker-name").textContent).toBe("review");
    expect(within(row).getByTestId("skill-picker-name").className).toContain("font-semibold");
    expect(within(row).getByTestId("skill-picker-description").textContent).toBe("English description");
    expect(within(row).getByTestId("skill-picker-description").className).toContain("font-normal");
    expect(within(dialog).queryByTestId("skill-description-toggle")).toBeNull();

    await user.click(row);
    expect(boundary.steerChat).toHaveBeenCalledWith("/skill:review", expect.any(String));
    expect(useChatStore.getState().queue).toHaveLength(0);
    expect(screen.queryByTestId("skill-picker-dialog")).toBeNull();
  });

  it("keeps the skill window large without a compact-view toggle", async () => {
    const user = userEvent.setup();
    useSettingsStore.setState({
      slashCommands: [{ name: "skill:review", aliases: [], description: "Review" }],
    });
    render(<SkillPickerDialog />);

    await user.click(screen.getByTestId("skill-picker"));
    const dialog = await screen.findByTestId("skill-picker-dialog");
    expect(dialog.className).toContain("h-[calc(100vh-6rem)]");
    expect(screen.queryByTestId("skill-view-toggle")).toBeNull();
    expect(screen.getByTestId("skill-picker-list").className).not.toContain("max-h-64");
  });

  it("does not show a chevron when the description fits exactly two lines", async () => {
    vi.spyOn(HTMLElement.prototype, "scrollHeight", "get").mockReturnValue(40);
    const user = userEvent.setup();
    useSettingsStore.setState({
      slashCommands: [{ name: "skill:three-lines", aliases: [], description: "Three rendered lines" }],
    });
    render(<SkillPickerDialog />);

    await user.click(screen.getByTestId("skill-picker"));
    const dialog = await screen.findByTestId("skill-picker-dialog");
    expect(within(dialog).queryByTestId("skill-description-toggle")).toBeNull();
    expect(within(dialog).queryByTestId("skill-description-fade")).toBeNull();
    expect(within(dialog).getByTestId("skill-picker-description").className).not.toContain("line-clamp-4");
  });

  it("shows two clear lines and a faded third with animated expansion", async () => {
    vi.spyOn(HTMLElement.prototype, "scrollHeight", "get").mockReturnValue(100);
    const user = userEvent.setup();
    useSettingsStore.setState({
      slashCommands: [{ name: "skill:long", aliases: [], description: "A long description that needs more than two rendered lines to read in full." }],
    });
    render(<SkillPickerDialog />);

    await user.click(screen.getByTestId("skill-picker"));
    const dialog = await screen.findByTestId("skill-picker-dialog");
    const animation = within(dialog).getByTestId("skill-description-animation");
    expect(animation.style.maxHeight).toBe("60px");
    expect(animation.className).toContain("transition-[max-height]");
    expect(within(dialog).getByTestId("skill-description-measurement").className).toContain("line-clamp-2");
    const fade = within(dialog).getByTestId("skill-description-fade");
    expect(fade.className).toContain("bg-gradient-to-t");
    expect(fade.className).toContain("group-hover:from-accent");

    await user.click(within(dialog).getByTestId("skill-description-toggle"));
    expect(animation.style.maxHeight).toBe("100px");
    expect(within(dialog).queryByTestId("skill-description-fade")).toBeNull();
    expect(boundary.steerChat).not.toHaveBeenCalled();
    expect(useChatStore.getState().queue).toHaveLength(0);

    await user.click(within(dialog).getByTestId("skill-description-toggle"));
    expect(animation.style.maxHeight).toBe("60px");
  });

  it("queues a selected skill as one message while Steer is off", async () => {
    const user = userEvent.setup();
    useSettingsStore.setState({
      extensionConfig: { ...DEFAULT_EXTENSION_CONFIG, autoSteer: false, controlPanel: { ...DEFAULT_EXTENSION_CONFIG.controlPanel } },
      slashCommands: [{ name: "skill:review", aliases: [], description: "English description" }],
    });
    useChatStore.setState({ isStreaming: true });
    render(<SkillPickerDialog />);

    await user.click(screen.getByTestId("skill-picker"));
    await user.click(await screen.findByRole("button", { name: /review/ }));

    expect(boundary.steerChat).not.toHaveBeenCalled();
    expect(useChatStore.getState().queue).toHaveLength(1);
    expect(useChatStore.getState().queue[0]?.content).toBe("/skill:review");
  });
});
