import { configHandlers } from "./config.handler";
import { mcpHandlers } from "./mcp.handler";
import { sessionHandlers } from "./session.handler";
import { chatHandlers } from "./chat.handler";
import { fileHandlers } from "./file.handler";
import { workspaceHandlers } from "./workspace.handler";
import { authHandlers } from "./auth.handler";
import { attentionHandlers } from "./attention.handler";
import { behaviorHandlers } from "./behavior.handler";
import { modesHandlers } from "./modes.handler";
import { contextHandlers } from "./context.handler";
import type { Handler } from "./types";

export type { Handler, HandlerContext, BroadcastFn, ReloadWebviewFn, ShowLogsFn } from "./types";

export const handlers: Record<string, Handler<any, any>> = {
  ...workspaceHandlers,
  ...configHandlers,
  ...mcpHandlers,
  ...sessionHandlers,
  ...chatHandlers,
  ...fileHandlers,
  ...authHandlers,
  ...attentionHandlers,
  ...behaviorHandlers,
  ...modesHandlers,
  ...contextHandlers,
};
