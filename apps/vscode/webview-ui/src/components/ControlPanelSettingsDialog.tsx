import { IconChevronDown, IconChevronUp } from "@tabler/icons-react";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useSettingsStore } from "@/stores";
import { useT, type TranslationKey } from "@/i18n";
import type { ControlPanelButton } from "shared/types";

const BUTTON_LABEL: Record<ControlPanelButton, TranslationKey> = {
  permission: "controlPanel.permission",
  compact: "menu.autoCompact",
  steer: "menu.autoSteer",
  control: "controlWindow.button",
  skills: "skills.button",
  plan: "modes.plan",
  goal: "modes.goal",
  swarm: "modes.swarm",
  secondaryModel: "subagent.title",
};

interface ControlPanelSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ControlPanelSettingsDialog({ open, onOpenChange }: ControlPanelSettingsDialogProps) {
  const extensionConfig = useSettingsStore((state) => state.extensionConfig);
  const changeControlPanelVisibility = useSettingsStore((state) => state.changeControlPanelVisibility);
  const moveControlPanelButton = useSettingsStore((state) => state.moveControlPanelButton);
  const t = useT();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("controlPanel.title")}</DialogTitle>
          <DialogDescription className="text-xs">{t("controlPanel.description")}</DialogDescription>
        </DialogHeader>

        <div className="space-y-1">
          {extensionConfig.controlPanelOrder.map((button, index) => (
            <div key={button} className="flex items-center gap-1 rounded-md pr-1 hover:bg-muted/50">
              <label className="flex min-w-0 flex-1 items-center gap-2.5 px-2 py-2 text-xs cursor-pointer">
                <Checkbox
                  data-testid={`control-panel-option-${button}`}
                  checked={extensionConfig.controlPanel[button]}
                  onCheckedChange={(checked) => void changeControlPanelVisibility(button, checked === true)}
                  aria-label={t(BUTTON_LABEL[button])}
                />
                <span>{t(BUTTON_LABEL[button])}</span>
              </label>
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                data-testid={`control-panel-move-up-${button}`}
                aria-label={`${t("controlPanel.moveUp")}: ${t(BUTTON_LABEL[button])}`}
                disabled={index === 0}
                onClick={() => void moveControlPanelButton(button, -1)}
              >
                <IconChevronUp />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                data-testid={`control-panel-move-down-${button}`}
                aria-label={`${t("controlPanel.moveDown")}: ${t(BUTTON_LABEL[button])}`}
                disabled={index === extensionConfig.controlPanelOrder.length - 1}
                onClick={() => void moveControlPanelButton(button, 1)}
              >
                <IconChevronDown />
              </Button>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
