import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const boundary = vi.hoisted(() => ({
  saveConfig: vi.fn(),
}));

vi.mock("@/services", () => ({
  bridge: { saveConfig: boundary.saveConfig },
}));
vi.mock("@/components/ui/sonner", () => ({
  toast: { error: vi.fn(), warning: vi.fn(), info: vi.fn(), success: vi.fn() },
}));

import { ModelPicker } from "../../webview-ui/src/components/ModelPicker";
import { useFavoriteModels } from "../../webview-ui/src/components/inputarea/hooks/useFavoriteModels";
import { DEFAULT_EXTENSION_CONFIG, useSettingsStore } from "../../webview-ui/src/stores/settings.store";

const MODELS = [
  {
    id: "reasoning",
    name: "Reasoning",
    provider: "managed:kimi-code",
    capabilities: ["thinking"],
    support_efforts: ["low", "high"],
    default_effort: "high",
    max_context_tokens: 128_000,
  },
  { id: "plain", name: "Plain", provider: "managed:kimi-code", capabilities: [], max_context_tokens: 128_000 },
  { id: "other", name: "Other", provider: "other", capabilities: ["image_in"], max_context_tokens: 1_000_000 },
];

const SWITCH_MODEL = { id: "switch", name: "Switch", provider: "managed:kimi-code", capabilities: ["thinking"] };
const ALWAYS_MODEL = {
  id: "always",
  name: "Always",
  provider: "managed:kimi-code",
  capabilities: ["always_thinking"],
  support_efforts: ["low", "high"],
  default_effort: "high",
};

beforeEach(() => {
  boundary.saveConfig.mockReset();
  boundary.saveConfig.mockResolvedValue({ ok: true });
  localStorage.clear();
  useFavoriteModels.setState({ favorites: [] });
  useSettingsStore.setState({ extensionConfig: { ...DEFAULT_EXTENSION_CONFIG } });
  useSettingsStore.getState().initModels(MODELS, "reasoning", true, "high");
  vi.stubGlobal("ResizeObserver", class {
    observe() {}
    unobserve() {}
    disconnect() {}
  });
  Object.defineProperty(HTMLElement.prototype, "scrollIntoView", { value: vi.fn(), configurable: true });
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  localStorage.clear();
});

describe("combined model and effort picker", () => {
  it("keeps model and effort readable and changes effort in the same dropdown", async () => {
    const user = userEvent.setup();
    render(<ModelPicker availableModels={MODELS} hasConversationHistory />);
    const trigger = screen.getByTestId("model-picker");

    expect(trigger.textContent).toBe("Reasoning · High");
    expect(trigger.className).toContain("shrink-0");
    expect(trigger.querySelector(".whitespace-nowrap")).not.toBeNull();

    await user.click(trigger);
    expect(screen.getByText(/Switching models or thinking effort invalidates/)).not.toBeNull();
    await user.click(screen.getByRole("button", { name: "Low" }));

    expect(boundary.saveConfig).toHaveBeenLastCalledWith({ model: "reasoning", thinking: true, effort: "low" });
    expect(useSettingsStore.getState().thinkingEffort).toBe("low");
  });

  it("uses On and Off for a switch-thinking model", async () => {
    const user = userEvent.setup();
    useSettingsStore.getState().initModels([SWITCH_MODEL], "switch", false);
    render(<ModelPicker availableModels={[SWITCH_MODEL]} hasConversationHistory={false} />);

    await user.click(screen.getByTestId("model-picker"));
    await user.click(screen.getByRole("button", { name: "On" }));

    expect(boundary.saveConfig).toHaveBeenLastCalledWith({ model: "switch", thinking: true, effort: "on" });
    expect(useSettingsStore.getState().thinkingEffort).toBe("on");
  });

  it("keeps effort tiers available without Off for an always-thinking model", async () => {
    const user = userEvent.setup();
    useSettingsStore.getState().initModels([ALWAYS_MODEL], "always", true, "high");
    render(<ModelPicker availableModels={[ALWAYS_MODEL]} hasConversationHistory={false} />);

    await user.click(screen.getByTestId("model-picker"));

    expect(screen.getByRole("button", { name: "Low" })).not.toBeNull();
    expect(screen.getByRole("button", { name: "High" })).not.toBeNull();
    expect(screen.queryByRole("button", { name: "Off" })).toBeNull();
  });

  it("shares favorites with the quick list and selects a searched model with Enter", async () => {
    const user = userEvent.setup();
    render(<ModelPicker availableModels={MODELS} hasConversationHistory={false} />);

    await user.click(screen.getByTestId("model-picker"));
    await user.click(screen.getByText("More models..."));
    await user.type(screen.getByPlaceholderText("Search models..."), "Other");
    await user.click(screen.getByRole("button", { name: "Star Other" }));

    expect(useFavoriteModels.getState().favorites).toEqual(["other"]);
    expect(JSON.parse(localStorage.getItem("kimi-krinik-favorite-models") ?? "[]")).toEqual(["other"]);

    await user.keyboard("{Escape}");
    await user.click(screen.getByTestId("model-picker"));
    expect(screen.getByRole("menuitem", { name: "Other" })).not.toBeNull();

    await user.click(screen.getByText("More models..."));
    await user.type(screen.getByPlaceholderText("Search models..."), "Other");
    await user.keyboard("{Enter}");

    expect(useSettingsStore.getState().currentModel).toBe("other");
    expect(boundary.saveConfig).toHaveBeenLastCalledWith({ model: "other", thinking: false, effort: "off", effortChanged: true });
  });

  it("filters providers and resets the full picker on reopen", async () => {
    const user = userEvent.setup();
    render(<ModelPicker availableModels={MODELS} hasConversationHistory={false} />);

    await user.click(screen.getByTestId("model-picker"));
    await user.click(screen.getByText("More models..."));
    await user.click(screen.getByRole("button", { name: "other" }));

    expect(screen.getByRole("option", { name: /Other/ })).not.toBeNull();
    expect(screen.queryByRole("option", { name: /Reasoning/ })).toBeNull();

    await user.keyboard("{Escape}");
    await user.click(screen.getByTestId("model-picker"));
    await user.click(screen.getByText("More models..."));

    expect(screen.getByPlaceholderText("Search models...")).toHaveProperty("value", "");
    expect(screen.getByRole("option", { name: /Reasoning/ })).not.toBeNull();
    expect(screen.getByRole("option", { name: /Other/ })).not.toBeNull();
  });

  it.each([
    ["en", "Max", "High", "Low", "High", "Max"],
    ["ru", "МАКС", "Выс.", "Низкий", "Высокий", "МАКС"],
    ["zh", "最大", "高", "低", "高", "最大"],
  ] as const)("localizes compact and full effort labels for %s", async (language, compactMax, compactHigh, fullLow, fullHigh, fullMax) => {
    const models = [{
      id: "reasoning",
      name: "Reasoning",
      provider: "managed:kimi-code",
      capabilities: ["thinking"],
      support_efforts: ["low", "high", "max"],
      default_effort: "high",
      max_context_tokens: 128_000,
    }];
    useSettingsStore.setState({ extensionConfig: { ...DEFAULT_EXTENSION_CONFIG, language } });
    useSettingsStore.getState().initModels(models, "reasoning", true, "max");
    const user = userEvent.setup();
    render(<ModelPicker availableModels={models} hasConversationHistory={false} />);
    const trigger = screen.getByTestId("model-picker");

    expect(trigger.textContent).toBe(`Reasoning · ${compactMax}`);
    await user.click(trigger);
    expect(screen.getByRole("button", { name: fullLow })).not.toBeNull();
    expect(screen.getByRole("button", { name: fullHigh })).not.toBeNull();
    expect(screen.getByRole("button", { name: fullMax })).not.toBeNull();

    await user.click(screen.getByRole("button", { name: fullHigh }));
    expect(trigger.textContent).toBe(`Reasoning · ${compactHigh}`);
  });
});
