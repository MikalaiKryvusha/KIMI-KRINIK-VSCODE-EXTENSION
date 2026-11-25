import { IconBrandSpeedtest, IconLocationPlus, IconViewportShort } from "@tabler/icons-react";

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { SkillPickerDialog } from "./SkillPickerDialog";
import { useSettingsStore } from "@/stores";
import { useT } from "@/i18n";

function behaviorButtonClass(active: boolean): string {
  return `flex items-center gap-1 h-6 px-1.5 rounded-md transition-all text-xs cursor-pointer disabled:opacity-50 disabled:cursor-default ${
    active
      ? "bg-blue-500/15 text-blue-600 dark:text-blue-400 hover:bg-blue-500/25"
      : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
  }`;
}

export function BehaviorButtons() {
  const extensionConfig = useSettingsStore((state) => state.extensionConfig);
  const autoCompact = useSettingsStore((state) => state.autoCompact);
  const autoCompactPending = useSettingsStore((state) => state.autoCompactPending);
  const changeAutoCompact = useSettingsStore((state) => state.changeAutoCompact);
  const changeAutoSteer = useSettingsStore((state) => state.changeAutoSteer);
  const changeContextWindowControl = useSettingsStore((state) => state.changeContextWindowControl);
  const t = useT();
  const compactEnabled = autoCompact !== false;

  return (
    <>
      {extensionConfig.controlPanel.compact && (
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              data-testid="mode-compact"
              style={{ order: extensionConfig.controlPanelOrder.indexOf("compact") }}
              disabled={autoCompact === null || autoCompactPending}
              onClick={() => void changeAutoCompact(autoCompact === false)}
              className={behaviorButtonClass(compactEnabled)}
            >
              <IconViewportShort className="size-3.5" />
              <span className="leading-none @max-[480px]/composer:hidden">{t("menu.autoCompact")}</span>
            </button>
          </TooltipTrigger>
          <TooltipContent>{compactEnabled ? t("menu.autoCompactOn") : t("menu.autoCompactOff")}</TooltipContent>
        </Tooltip>
      )}

      {extensionConfig.controlPanel.steer && (
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              data-testid="mode-steer"
              style={{ order: extensionConfig.controlPanelOrder.indexOf("steer") }}
              onClick={() => void changeAutoSteer(!extensionConfig.autoSteer)}
              className={behaviorButtonClass(extensionConfig.autoSteer)}
            >
              <IconLocationPlus className="size-3.5" />
              <span className="leading-none @max-[480px]/composer:hidden">{t("menu.autoSteer")}</span>
            </button>
          </TooltipTrigger>
          <TooltipContent>{extensionConfig.autoSteer ? t("menu.autoSteerOn") : t("menu.autoSteerOff")}</TooltipContent>
        </Tooltip>
      )}

      {extensionConfig.controlPanel.control && (
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              data-testid="mode-control"
              style={{ order: extensionConfig.controlPanelOrder.indexOf("control") }}
              onClick={() => void changeContextWindowControl(!extensionConfig.contextWindowControl)}
              className={behaviorButtonClass(extensionConfig.contextWindowControl)}
            >
              <IconBrandSpeedtest className="size-3.5" />
              <span className="leading-none @max-[480px]/composer:hidden">{t("controlWindow.button")}</span>
            </button>
          </TooltipTrigger>
          <TooltipContent>{extensionConfig.contextWindowControl ? t("controlWindow.on") : t("controlWindow.off")}</TooltipContent>
        </Tooltip>
      )}

      {extensionConfig.controlPanel.skills && <SkillPickerDialog className={behaviorButtonClass(false)} />}
    </>
  );
}
