import { IconBolt, IconCheck, IconRocket, IconShieldCheck } from "@tabler/icons-react";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "@/components/ui/sonner";
import { bridge } from "@/services";
import { useChatStore, useSettingsStore } from "@/stores";
import { useT, type TranslationKey } from "@/i18n";
import { cn } from "@/lib/utils";
import { PERMISSION_MODES, type PermissionModeName } from "shared/modes";

const MODE_LABEL: Record<PermissionModeName, TranslationKey> = {
  manual: "permMode.manual",
  yolo: "permMode.yolo",
  auto: "permMode.auto",
};

const MODE_TOOLTIP: Record<PermissionModeName, TranslationKey> = {
  manual: "permMode.tooltipManual",
  yolo: "permMode.tooltipYolo",
  auto: "permMode.tooltipAuto",
};

const MODE_DESCRIPTION: Record<PermissionModeName, TranslationKey> = {
  manual: "permMode.descManual",
  yolo: "permMode.descYolo",
  auto: "permMode.descAuto",
};

const MODE_ICON: Record<PermissionModeName, typeof IconShieldCheck> = {
  manual: IconShieldCheck,
  yolo: IconRocket,
  auto: IconBolt,
};

const MODE_TEXT: Record<PermissionModeName, string> = {
  manual: "text-muted-foreground",
  yolo: "text-amber-500",
  auto: "text-cyan-500",
};

export function PermissionModeButton() {
  const t = useT();
  const chosen = useChatStore((state) => state.permissionMode);
  const defaultPermissionMode = useSettingsStore((state) => state.defaultPermissionMode);
  const mode = chosen ?? defaultPermissionMode;
  const ModeIcon = MODE_ICON[mode];

  const select = (next: PermissionModeName) => {
    const previous = chosen;
    useChatStore.setState({ permissionMode: next });
    void bridge.setPermissionMode(next).then(
      (result) => {
        if (result.mode !== null) {
          useSettingsStore.setState({ defaultPermissionMode: result.mode });
          useChatStore.setState({ permissionMode: result.mode });
        }
      },
      (error: unknown) => {
        useChatStore.setState({ permissionMode: previous });
        toast.error(t("permMode.switchFailed", { error: error instanceof Error ? error.message : String(error) }));
      },
    );
  };

  return (
    <DropdownMenu>
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              data-testid="permission-mode"
              className={cn(
                "flex items-center gap-1 justify-center h-6 px-1.5 rounded-md transition-all text-xs cursor-pointer",
                mode === "auto" && "bg-cyan-500/15 text-cyan-500 hover:bg-cyan-500/25",
                mode === "yolo" && "bg-amber-500/15 text-amber-500 hover:bg-amber-500/25",
                mode === "manual" && "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <ModeIcon className="size-3.5" />
              <span className="leading-none @max-[420px]/composer:hidden">{t(MODE_LABEL[mode])}</span>
            </button>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent>{t(MODE_TOOLTIP[mode])}</TooltipContent>
      </Tooltip>
      <DropdownMenuContent align="start" className="w-60">
        {PERMISSION_MODES.map((option) => {
          const OptionIcon = MODE_ICON[option];
          return (
            <DropdownMenuItem key={option} onClick={() => select(option)} className="items-start gap-2 px-2 py-1.5 cursor-pointer">
              <OptionIcon className={cn("size-3.5 mt-0.5", MODE_TEXT[option])} />
              <span className="flex-1 min-w-0">
                <span className={cn("block text-xs leading-tight", MODE_TEXT[option])}>{t(MODE_LABEL[option])}</span>
                <span className="block text-[10px] leading-snug whitespace-normal text-muted-foreground">{t(MODE_DESCRIPTION[option])}</span>
              </span>
              <IconCheck className={cn("size-3.5 mt-0.5", option !== mode && "opacity-0")} />
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
