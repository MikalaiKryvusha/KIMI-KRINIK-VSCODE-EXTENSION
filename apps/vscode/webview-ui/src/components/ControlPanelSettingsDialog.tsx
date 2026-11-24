import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useSettingsStore } from "@/stores";
import { useT, type TranslationKey } from "@/i18n";
import { CONTROL_PANEL_BUTTONS, type ContextWindowThresholds, type ControlPanelButton } from "shared/types";

const BUTTON_LABEL: Record<ControlPanelButton, TranslationKey> = {
  permission: "controlPanel.permission",
  compact: "menu.autoCompact",
  steer: "menu.autoSteer",
  control: "controlWindow.button",
  plan: "modes.plan",
  goal: "modes.goal",
  swarm: "modes.swarm",
  secondaryModel: "subagent.title",
};

const THRESHOLD_LABEL: Record<keyof ContextWindowThresholds, TranslationKey> = {
  warnPct: "controlWindow.warn",
  cutPct: "controlWindow.cut",
  closePct: "controlWindow.close",
  forcePct: "controlWindow.force",
};

const THRESHOLD_NAMES = Object.keys(THRESHOLD_LABEL) as Array<keyof ContextWindowThresholds>;

interface ControlPanelSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ControlPanelSettingsDialog({ open, onOpenChange }: ControlPanelSettingsDialogProps) {
  const extensionConfig = useSettingsStore((state) => state.extensionConfig);
  const changeControlPanelVisibility = useSettingsStore((state) => state.changeControlPanelVisibility);
  const changeContextWindowControl = useSettingsStore((state) => state.changeContextWindowControl);
  const changeContextWindowThreshold = useSettingsStore((state) => state.changeContextWindowThreshold);
  const t = useT();
  const controlEnabled = extensionConfig.contextWindowControl;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("controlPanel.title")}</DialogTitle>
          <DialogDescription className="text-xs">{t("controlPanel.description")}</DialogDescription>
        </DialogHeader>

        <div className="space-y-1">
          {CONTROL_PANEL_BUTTONS.map((button) => (
            <label key={button} className="flex items-center gap-2.5 rounded-md px-2 py-2 text-xs hover:bg-muted/50 cursor-pointer">
              <Checkbox
                data-testid={`control-panel-option-${button}`}
                checked={extensionConfig.controlPanel[button]}
                onCheckedChange={(checked) => void changeControlPanelVisibility(button, checked === true)}
                aria-label={t(BUTTON_LABEL[button])}
              />
              <span>{t(BUTTON_LABEL[button])}</span>
            </label>
          ))}
        </div>

        <Separator />
        <div className="rounded-md border border-border p-3 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div className="space-y-0.5">
              <div className="text-xs font-medium">{t("controlWindow.title")}</div>
              <div className="text-[10px] text-muted-foreground">{t("controlWindow.description")}</div>
            </div>
            <Switch
              data-testid="context-window-control-toggle"
              checked={controlEnabled}
              onCheckedChange={(checked) => void changeContextWindowControl(checked)}
              aria-label={t("controlWindow.title")}
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            {THRESHOLD_NAMES.map((name) => (
              <label key={name} className="space-y-1 text-[10px] text-muted-foreground">
                <span>{t(THRESHOLD_LABEL[name])}</span>
                <Input
                  type="number"
                  min={0}
                  max={100}
                  step={1}
                  value={extensionConfig.contextWindowThresholds[name]}
                  disabled={!controlEnabled}
                  data-testid={`context-window-threshold-${name}`}
                  aria-label={t(THRESHOLD_LABEL[name])}
                  onChange={(event) => {
                    const value = Number(event.target.value);
                    if (Number.isFinite(value) && value >= 0 && value <= 100) {
                      void changeContextWindowThreshold(name, value);
                    }
                  }}
                />
              </label>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
