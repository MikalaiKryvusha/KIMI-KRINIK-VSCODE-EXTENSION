import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const boundary = vi.hoisted(() => ({ updateExtensionSetting: vi.fn(), previewSound: vi.fn() }));

vi.mock("@/services", () => ({ bridge: { updateExtensionSetting: boundary.updateExtensionSetting } }));
vi.mock("@/lib/attention", () => ({ previewSound: boundary.previewSound }));

import { SoundSettingsModal } from "../../webview-ui/src/components/SoundSettingsModal";
import { DEFAULT_EXTENSION_CONFIG, useSettingsStore } from "../../webview-ui/src/stores/settings.store";
import { DEFAULT_SOUND_SETTINGS } from "../../shared/sounds";

beforeEach(() => {
  boundary.updateExtensionSetting.mockReset();
  boundary.updateExtensionSetting.mockResolvedValue({ ok: true });
  boundary.previewSound.mockReset();
  useSettingsStore.setState({
    soundModalOpen: true,
    extensionConfig: { ...DEFAULT_EXTENSION_CONFIG, soundEnabled: true, sounds: DEFAULT_SOUND_SETTINGS },
  });
  vi.stubGlobal("ResizeObserver", class {
    observe() {}
    unobserve() {}
    disconnect() {}
  });
  Object.defineProperties(HTMLElement.prototype, {
    hasPointerCapture: { value: () => false, configurable: true },
    releasePointerCapture: { value: () => undefined, configurable: true },
    scrollIntoView: { value: () => undefined, configurable: true },
  });
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("Sound Settings", () => {
  it("offers triple and Glass choices and mutes every event from one global switch", async () => {
    const user = userEvent.setup();
    render(<SoundSettingsModal />);

    await user.click(screen.getAllByRole("combobox")[0]!);
    expect(await screen.findByText("Triple beep")).not.toBeNull();
    expect(document.querySelector('[data-slot="select-content"]')?.textContent).toContain("Glass");
    await user.keyboard("{Escape}");
    const enabled = screen.getByTestId("sound-enabled-toggle");
    expect(enabled.getAttribute("data-state")).toBe("checked");

    await user.click(enabled);

    expect(boundary.updateExtensionSetting).toHaveBeenCalledWith({ key: "soundEnabled", value: false });
    const volume = document.querySelector('input[type="range"]') as HTMLInputElement;
    expect(volume.disabled).toBe(true);
    expect(volume.className).toContain("accent-current");
    expect(volume.className).toContain("outline-none");
    const preview = screen.getAllByTitle("Preview")[0] as HTMLButtonElement;
    expect(preview.disabled).toBe(true);
    await user.click(preview);
    expect(boundary.previewSound).not.toHaveBeenCalled();
  });
});
