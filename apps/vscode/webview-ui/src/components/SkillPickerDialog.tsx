import { useEffect, useRef, useState } from "react";
import { IconBulb, IconChevronDown, IconChevronUp } from "@tabler/icons-react";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useChatStore, useSettingsStore } from "@/stores";
import { useT } from "@/i18n";
import type { SlashCommandInfo } from "shared/legacy-sdk";
import type { InterfaceLanguage } from "shared/types";

const CLEAR_DESCRIPTION_LINES = 2;
const COLLAPSED_DESCRIPTION_HEIGHT = 60;
const FALLBACK_DESCRIPTION_LINE_HEIGHT = 20;
const MEASUREMENT_TOLERANCE = 1;

export function localizedSkillDescription(command: SlashCommandInfo, language: InterfaceLanguage): string {
  if (language === "ru") return command.description_ru ?? command.description;
  if (language === "zh") return command.description_zh ?? command.description;
  return command.description;
}

function SkillRow({ command, language, onSelect }: { command: SlashCommandInfo; language: InterfaceLanguage; onSelect: (name: string) => void }) {
  const [expanded, setExpanded] = useState(false);
  const [overflows, setOverflows] = useState(false);
  const [fullHeight, setFullHeight] = useState(COLLAPSED_DESCRIPTION_HEIGHT);
  const measurementRef = useRef<HTMLSpanElement>(null);
  const descriptionRef = useRef<HTMLSpanElement>(null);
  const description = localizedSkillDescription(command, language);
  const t = useT();

  useEffect(() => {
    const measurement = measurementRef.current;
    if (measurement === null) return;
    const update = () => {
      const lineHeight = Number.parseFloat(getComputedStyle(measurement).lineHeight) || FALLBACK_DESCRIPTION_LINE_HEIGHT;
      setOverflows(measurement.scrollHeight > lineHeight * CLEAR_DESCRIPTION_LINES + MEASUREMENT_TOLERANCE);
      setFullHeight(descriptionRef.current?.scrollHeight ?? measurement.scrollHeight);
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(measurement);
    return () => observer.disconnect();
  }, [description]);

  return (
    <div className="group rounded-md hover:bg-accent">
      <button type="button" onClick={() => onSelect(command.name)} className="block w-full px-3 py-2 text-left">
        <span data-testid="skill-picker-name" className="block text-xs font-semibold">{command.name.slice("skill:".length)}</span>
        <span
          data-testid="skill-description-animation"
          className="relative block overflow-hidden transition-[max-height] duration-300 ease-in-out motion-reduce:transition-none"
          style={{ maxHeight: expanded || !overflows ? fullHeight : COLLAPSED_DESCRIPTION_HEIGHT }}
        >
          <span
            ref={measurementRef}
            data-testid="skill-description-measurement"
            aria-hidden="true"
            className="invisible pointer-events-none absolute inset-x-0 top-0 line-clamp-2 text-xs leading-5"
          >
            {description}
          </span>
          <span
            ref={descriptionRef}
            data-testid="skill-picker-description"
            className="block text-xs font-normal leading-5 text-muted-foreground"
          >
            {description}
          </span>
          {overflows && !expanded && (
            <span data-testid="skill-description-fade" className="pointer-events-none absolute inset-x-0 bottom-0 h-5 bg-gradient-to-t from-background via-background/85 to-transparent group-hover:from-accent group-hover:via-accent/85" />
          )}
        </span>
      </button>
      {overflows && (
        <button
          type="button"
          data-testid="skill-description-toggle"
          aria-expanded={expanded}
          onClick={() => setExpanded((value) => !value)}
          className="mx-3 mb-2 flex w-[calc(100%-1.5rem)] items-center justify-center gap-1 rounded-md py-1 text-[11px] text-muted-foreground hover:bg-accent hover:text-foreground"
        >
          <span>{t(expanded ? "skills.collapseDescription" : "skills.expandDescription")}</span>
          {expanded ? <IconChevronUp className="size-3.5" /> : <IconChevronDown className="size-3.5" />}
        </button>
      )}
    </div>
  );
}

export function SkillPickerDialog({ className }: { className?: string }) {
  const commands = useSettingsStore((state) => state.slashCommands).filter((command) => command.name.startsWith("skill:"));
  const language = useSettingsStore((state) => state.extensionConfig.language);
  const controlPanelOrder = useSettingsStore((state) => state.extensionConfig.controlPanelOrder);
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
          <button
            type="button"
            data-testid="skill-picker"
            onClick={() => setOpen(true)}
            disabled={commands.length === 0}
            className={className}
            style={{ order: controlPanelOrder.indexOf("skills") }}
          >
            <IconBulb className="size-3.5" />
            <span className="leading-none @max-[480px]/composer:hidden">{t("skills.button")}</span>
          </button>
        </TooltipTrigger>
        <TooltipContent>{t("skills.tooltip")}</TooltipContent>
      </Tooltip>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          data-testid="skill-picker-dialog"
          className="h-[calc(100vh-6rem)] max-h-[calc(100vh-6rem)] max-w-[calc(100%-6rem)] grid-rows-[auto_minmax(0,1fr)] sm:max-w-[calc(100%-6rem)]"
        >
          <DialogHeader>
            <DialogTitle>{t("skills.button")}</DialogTitle>
          </DialogHeader>
          <div data-testid="skill-picker-list" className="min-h-0 space-y-1 overflow-y-auto pr-1">
            {commands.length === 0 && <div className="px-3 py-2 text-xs text-muted-foreground">{t("skills.empty")}</div>}
            {commands.map((command) => (
              <SkillRow key={command.name} command={command} language={language} onSelect={selectSkill} />
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
