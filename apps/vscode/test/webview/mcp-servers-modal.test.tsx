import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@tanstack/react-query", () => ({
  useQuery: () => ({ data: [], isError: false, error: null }),
  useQueryClient: () => ({ setQueryData: vi.fn() }),
}));
vi.mock("@/services", () => ({
  bridge: {
    addMCPServer: vi.fn(),
    updateMCPServer: vi.fn(),
    removeMCPServer: vi.fn(),
    testMCP: vi.fn(),
    authMCP: vi.fn(),
    resetAuthMCP: vi.fn(),
  },
}));

import { MCPServersModal } from "../../webview-ui/src/components/MCPServersModal";
import { DEFAULT_EXTENSION_CONFIG, useSettingsStore } from "../../webview-ui/src/stores/settings.store";

beforeEach(() => {
  useSettingsStore.setState({
    extensionConfig: { ...DEFAULT_EXTENSION_CONFIG, language: "ru" },
    mcpModalOpen: true,
  });
});

afterEach(() => cleanup());

describe("MCP server localization", () => {
  it("localizes every Add and Cancel action in the Russian form", async () => {
    const user = userEvent.setup();
    render(<MCPServersModal />);

    expect(screen.queryByRole("button", { name: "Add" })).toBeNull();
    expect(screen.getAllByRole("button", { name: "Добавить" }).length).toBeGreaterThan(0);
    await user.click(screen.getAllByRole("button", { name: "Добавить" })[0]!);

    expect(screen.getAllByRole("button", { name: "+ Добавить" })).toHaveLength(2);
    expect(screen.getByRole("button", { name: "Отмена" })).not.toBeNull();
    expect(screen.queryByRole("button", { name: "Cancel" })).toBeNull();
  });
});
