import { Fragment, useMemo, useState } from "react";
import { IconRobot } from "@tabler/icons-react";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { getModelById, groupModelsByProvider, useSettingsStore } from "@/stores";
import { useT } from "@/i18n";
import { cn } from "@/lib/utils";
import type { SecondaryModelSelection } from "shared/legacy-sdk";

function RadioRow({ selected, label, suffix, onSelect }: { selected: boolean; label: string; suffix?: string; onSelect: () => void }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "w-full flex items-center gap-2 px-3 py-2 rounded-md text-left text-xs transition-colors cursor-pointer",
        selected ? "bg-accent" : "hover:bg-accent/50",
      )}
    >
      <span className={cn(
        "flex size-3.5 shrink-0 items-center justify-center rounded-full border",
        selected ? "border-blue-500" : "border-muted-foreground/40",
      )}>
        {selected && <span className="size-1.5 rounded-full bg-blue-500" />}
      </span>
      <span className="flex-1 truncate">{label}</span>
      {suffix !== undefined && <span className="text-[10px] text-muted-foreground shrink-0">{suffix}</span>}
    </button>
  );
}

export function SubagentModelDialog({ disabled }: { disabled?: boolean }) {
  const models = useSettingsStore((state) => state.models);
  const secondaryModel = useSettingsStore((state) => state.secondaryModel);
  const updateSecondaryModel = useSettingsStore((state) => state.updateSecondaryModel);
  const controlPanelOrder = useSettingsStore((state) => state.extensionConfig.controlPanelOrder);
  const [open, setOpen] = useState(false);
  const t = useT();
  const modelGroups = useMemo(() => groupModelsByProvider(models), [models]);
  const showProviderGroups = modelGroups.length > 1;
  const selectedModel = secondaryModel === null ? undefined : getModelById(models, secondaryModel.model);
  const label = selectedModel?.name ?? secondaryModel?.model;

  const handleSelect = (selection: SecondaryModelSelection | null) => {
    updateSecondaryModel(selection);
    setOpen(false);
  };

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            data-testid="secondary-model"
            style={{ order: controlPanelOrder.indexOf("secondaryModel") }}
            onClick={() => setOpen(true)}
            disabled={disabled || models.length === 0}
            className={cn(
              "relative flex items-center justify-center size-6 rounded-md transition-all text-xs",
              "@min-[480px]/composer:w-auto @min-[480px]/composer:px-1.5 @min-[480px]/composer:gap-1",
              "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground",
              !disabled && models.length > 0 ? "cursor-pointer" : "cursor-default",
            )}
          >
            <IconRobot className="size-4" />
            <span className="leading-none @max-[480px]/composer:hidden">{t("subagent.button")}</span>
            {secondaryModel !== null && <span className="absolute top-0.5 right-0.5 size-1.5 rounded-full bg-blue-500" />}
          </button>
        </TooltipTrigger>
        <TooltipContent>{t("subagent.tooltip", { label: label ?? t("subagent.followsMain") })}</TooltipContent>
      </Tooltip>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t("subagent.title")}</DialogTitle>
            <DialogDescription className="text-xs">{t("subagent.description")}</DialogDescription>
          </DialogHeader>
          <div className="space-y-1 max-h-64 overflow-y-auto -mx-1 px-1">
            <RadioRow
              selected={secondaryModel === null}
              label={t("subagent.followMain")}
              suffix={t("subagent.defaultSuffix")}
              onSelect={() => handleSelect(null)}
            />
            {modelGroups.map((group) => (
              <Fragment key={group.provider}>
                {showProviderGroups && (
                  <div className="px-3 pt-2 pb-1 text-[10px] text-muted-foreground uppercase tracking-wider">{group.label}</div>
                )}
                {group.models.map((model) => (
                  <RadioRow
                    key={model.id}
                    selected={secondaryModel?.model === model.id}
                    label={model.name}
                    onSelect={() => handleSelect({ model: model.id })}
                  />
                ))}
              </Fragment>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
