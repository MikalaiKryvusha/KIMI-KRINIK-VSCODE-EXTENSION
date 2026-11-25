import { useState } from "react";
import { IconBulb } from "@tabler/icons-react";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useChatStore, useSettingsStore } from "@/stores";
import { useT } from "@/i18n";
import type { SlashCommandInfo } from "shared/legacy-sdk";
import type { InterfaceLanguage } from "shared/types";

export function localizedSkillDescription(command: SlashCommandInfo, language: InterfaceLanguage): string {
  if (language === "ru") return command.description_ru ?? command.description;
  if (language === "zh") return command.description_zh ?? command.description;
  return command.description;
}

export function SkillPickerDialog({ className }: { className?: string }) {
  const commands = useSettingsStore((state) => state.slashCommands).filter((command) => command.name.startsWith("skill:"));
  const language = useSettingsStore((state) => state.extensionConfig.language);
  const sendMessage = useChatStore((state) => state.sendMessage);
  const [open, setOpen] = useState(false);
  const t = useT();

  const selectSkill = (name: string) => {
    sendMessage(`/${name}`);
    setOpen(false);
  };

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <button type="button" data-testid="skill-picker" onClick={() => setOpen(true)} disabled={commands.length === 0} className={className}>
            <IconBulb className="size-3.5" />
            <span className="leading-none @max-[480px]/composer:hidden">{t("skills.button")}</span>
          </button>
        </TooltipTrigger>
        <TooltipContent>{t("skills.tooltip")}</TooltipContent>
      </Tooltip>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent data-testid="skill-picker-dialog" className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t("skills.button")}</DialogTitle>
          </DialogHeader>
          <div className="max-h-64 space-y-1 overflow-y-auto">
            {commands.length === 0 && <div className="px-3 py-2 text-xs text-muted-foreground">{t("skills.empty")}</div>}
            {commands.map((command) => (
              <button
                type="button"
                key={command.name}
                onClick={() => selectSkill(command.name)}
                className="block w-full rounded-md px-3 py-2 text-left hover:bg-accent/50"
              >
                <span data-testid="skill-picker-name" className="block text-xs font-semibold">{command.name.slice("skill:".length)}</span>
                <span data-testid="skill-picker-description" className="block text-xs font-normal text-muted-foreground">{localizedSkillDescription(command, language)}</span>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
