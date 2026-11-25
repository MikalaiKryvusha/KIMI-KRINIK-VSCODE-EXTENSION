import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useSettingsStore } from "@/stores";
import { useT, type TranslationKey } from "@/i18n";
import type { ContextWindowThresholds, EditorContext, GeneralBooleanSetting } from "shared/types";

const GENERAL_TOGGLES: ReadonlyArray<{ key: GeneralBooleanSetting; label: TranslationKey; description: TranslationKey }> = [
  { key: "autosave", label: "general.autosave", description: "general.autosaveDesc" },
  { key: "useCtrlEnterToSend", label: "general.ctrlEnter", description: "general.ctrlEnterDesc" },
  { key: "enableNewConversationShortcut", label: "general.newShortcut", description: "general.newShortcutDesc" },
  { key: "showThinkingContent", label: "general.thinkingContent", description: "general.thinkingContentDesc" },
  { key: "showThinkingExpanded", label: "general.thinkingExpanded", description: "general.thinkingExpandedDesc" },
];

const THRESHOLD_LABEL: Record<keyof ContextWindowThresholds, TranslationKey> = {
  warnPct: "controlWindow.warn",
  cutPct: "controlWindow.cut",
  closePct: "controlWindow.close",
  forcePct: "controlWindow.force",
};

const THRESHOLD_NAMES = Object.keys(THRESHOLD_LABEL) as Array<keyof ContextWindowThresholds>;
const EDITOR_CONTEXT_LABEL: Record<EditorContext, TranslationKey> = {
  never: "general.editorNever",
  onConversationStart: "general.editorOnStart",
  onFileChange: "general.editorOnChange",
};

export function GeneralSettingsDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const extensionConfig = useSettingsStore((state) => state.extensionConfig);
  const changeGeneralSetting = useSettingsStore((state) => state.changeGeneralSetting);
  const changeContextWindowControl = useSettingsStore((state) => state.changeContextWindowControl);
  const changeContextWindowThreshold = useSettingsStore((state) => state.changeContextWindowThreshold);
  const t = useT();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent data-testid="general-settings-dialog" className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{t("menu.generalConfig")}</DialogTitle>
          <DialogDescription className="text-xs">{t("general.description")}</DialogDescription>
        </DialogHeader>

        <div className="space-y-1">
          {GENERAL_TOGGLES.map((setting) => (
            <div key={setting.key} className="flex items-center justify-between gap-4 rounded-md px-2 py-2 hover:bg-muted/50">
              <label className="min-w-0 flex-1 cursor-pointer" htmlFor={`general-setting-${setting.key}`}>
                <span className="block text-xs font-medium">{t(setting.label)}</span>
                <span className="mt-0.5 block text-[11px] leading-snug text-muted-foreground">{t(setting.description)}</span>
              </label>
              <Switch
                id={`general-setting-${setting.key}`}
                data-testid={`general-setting-${setting.key}`}
                checked={extensionConfig[setting.key]}
                disabled={setting.key === "showThinkingExpanded" && !extensionConfig.showThinkingContent}
                onCheckedChange={(checked) => void changeGeneralSetting({ key: setting.key, value: checked })}
                aria-label={t(setting.label)}
              />
            </div>
          ))}
        </div>

        <Separator />
        <div className="space-y-2 px-2">
          <label htmlFor="general-editor-context" className="block text-xs font-medium">{t("general.editorContext")}</label>
          <p className="text-[11px] leading-snug text-muted-foreground">{t("general.editorContextDesc")}</p>
          <select
            id="general-editor-context"
            data-testid="general-editor-context"
            value={extensionConfig.editorContext}
            onChange={(event) => void changeGeneralSetting({ key: "editorContext", value: event.target.value as EditorContext })}
            className="w-full rounded-md border border-input bg-background px-2.5 py-2 text-xs text-foreground"
          >
            {(Object.keys(EDITOR_CONTEXT_LABEL) as EditorContext[]).map((value) => (
              <option key={value} value={value}>{t(EDITOR_CONTEXT_LABEL[value])}</option>
            ))}
          </select>
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
              checked={extensionConfig.contextWindowControl}
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
                  disabled={!extensionConfig.contextWindowControl}
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
