import { useState } from "react";
import { IconPlus, IconChevronDown, IconInfoCircle } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { StreamingConfirmDialog } from "./StreamingConfirmDialog";
import { KimiLogo } from "./KimiLogo";
import { SessionList } from "./SessionList";
import { useChatStore } from "@/stores";
import { ChatStatus, TokenInfo } from "./ChatStatus";
import { useT } from "@/i18n";

export function Header() {
  const [showSessionList, setShowSessionList] = useState(false);
  const [showSessionInfo, setShowSessionInfo] = useState(false);
  const [showConfirmNew, setShowConfirmNew] = useState(false);
  const { startNewConversation, sessionId, sessionTitle, messages, isStreaming } = useChatStore();
  const t = useT();

  const handleNewSession = async () => {
    if (isStreaming) {
      setShowConfirmNew(true);
      return;
    }

    await doStartNewSession();
  };

  const doStartNewSession = async () => {
    await startNewConversation();
    setShowSessionList(false);
    setShowConfirmNew(false);
  };

  return (
    <header className="flex items-center justify-between px-3 py-2 border-b border-border shrink-0 @container">
      <div className="flex items-center gap-3 min-w-0">
        <KimiLogo className="size-6 shrink-0" />
        <span className="text-sm font-semibold whitespace-nowrap shrink-0">KIMI KRINIK</span>
        {sessionTitle && (
          <span className="text-xs text-muted-foreground truncate min-w-0 @max-[430px]:hidden" title={sessionTitle}>
            · {sessionTitle}
          </span>
        )}
      </div>
      <div className="flex items-center gap-1">
        {sessionId && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="xs"
                data-testid="session-info-trigger"
                className="gap-1 h-6 rounded-lg! border-border! px-2! text-muted-foreground hover:text-foreground @max-[320px]:hidden"
                onClick={() => setShowSessionInfo(true)}
              >
                <span className="text-[11px] @max-[500px]:hidden">{t("header.session")}</span>
                <IconInfoCircle className="size-3.5 hidden @max-[500px]:block" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>{t("header.sessionTooltip")}</TooltipContent>
          </Tooltip>
        )}
        <ChatStatus />
        <Popover open={showSessionList} onOpenChange={setShowSessionList}>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="xs" data-testid="session-history-trigger" className="gap-1 h-6 rounded-lg! border-border!">
              <span className="text-xs @max-[280px]:hidden">{t("header.history")}</span>
              <IconChevronDown className="size-3.5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-[20rem] max-w-[calc(100vw-1rem)] p-0">
            <SessionList onClose={() => setShowSessionList(false)} />
          </PopoverContent>
        </Popover>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon-xs"
              data-testid="new-chat-trigger"
              className="rounded-lg! border-border!"
              onClick={() => {
                void handleNewSession();
              }}
            >
              <IconPlus className="size-3.5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>{t("header.newChatTooltip")}</TooltipContent>
        </Tooltip>
      </div>

      <Dialog open={showSessionInfo} onOpenChange={setShowSessionInfo}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-sm">{t("header.sessionDetails")}</DialogTitle>
            <DialogDescription className="text-xs">{t("header.sessionDetailsDesc")}</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">{t("header.sessionId")}</div>
              <code className="text-xs font-mono text-foreground break-all select-all">{sessionId}</code>
            </div>
            <div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">{t("header.messages")}</div>
              <span className="text-xs text-foreground">{messages.length}</span>
            </div>
            <TokenInfo />
          </div>
        </DialogContent>
      </Dialog>

      <StreamingConfirmDialog
        open={showConfirmNew}
        onOpenChange={(open) => !open && setShowConfirmNew(false)}
        title={t("header.newTitle")}
        description={t("header.newDesc")}
        confirmLabel={t("header.newConversation")}
        onConfirm={() => {
          void doStartNewSession();
        }}
      />
    </header>
  );
}
