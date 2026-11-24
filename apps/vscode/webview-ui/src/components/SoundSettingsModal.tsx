import { IconPlayerPlay } from "@tabler/icons-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useSettingsStore } from "@/stores";
import { useT, type TranslationKey } from "@/i18n";
import { previewSound } from "@/lib/attention";
import { SOUND_CHOICES, SOUND_EVENTS, type SoundChoice, type SoundEvent, type SoundEventSetting } from "shared/sounds";

const EVENT_TEXT: Record<SoundEvent, { label: TranslationKey; when: TranslationKey }> = {
  approval: { label: "sound.event.approval", when: "sound.event.approvalWhen" },
  question: { label: "sound.event.question", when: "sound.event.questionWhen" },
  error: { label: "sound.event.error", when: "sound.event.errorWhen" },
  turnComplete: { label: "sound.event.turnComplete", when: "sound.event.turnCompleteWhen" },
};

const CHOICE_TEXT: Record<SoundChoice, TranslationKey> = {
  voice: "sound.choice.voice",
  chime: "sound.choice.chime",
  bell: "sound.choice.bell",
  pop: "sound.choice.pop",
  alert: "sound.choice.alert",
  triple: "sound.choice.triple",
  glass: "sound.choice.glass",
  off: "sound.choice.off",
};

function isSoundChoice(value: string): value is SoundChoice {
  return (SOUND_CHOICES as readonly string[]).includes(value);
}

export function SoundSettingsModal() {
  const { soundModalOpen, setSoundModalOpen, extensionConfig, changeSounds, changeSoundEnabled } = useSettingsStore();
  const t = useT();
  const sounds = extensionConfig.sounds;
  const soundEnabled = extensionConfig.soundEnabled;

  const update = (event: SoundEvent, setting: SoundEventSetting) => {
    void changeSounds({ ...sounds, [event]: setting });
  };

  return (
    <Dialog open={soundModalOpen} onOpenChange={setSoundModalOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-sm">{t("sound.title")}</DialogTitle>
          <DialogDescription className="text-xs">{t("sound.description")}</DialogDescription>
        </DialogHeader>
        <div className="flex items-center justify-between gap-3 rounded-md border border-border p-3">
          <div className="space-y-0.5">
            <div className="text-xs font-medium">{t("sound.enabled")}</div>
            <div className="text-[10px] text-muted-foreground">{t("sound.enabledDescription")}</div>
          </div>
          <Switch
            data-testid="sound-enabled-toggle"
            checked={soundEnabled}
            onCheckedChange={(enabled) => void changeSoundEnabled(enabled)}
            aria-label={t("sound.enabled")}
          />
        </div>
        <div className="space-y-3 py-1">
          {SOUND_EVENTS.map((event) => {
            const setting = sounds[event];
            const disabled = !soundEnabled || setting.sound === "off";
            return (
              <div key={event} className="rounded-md border border-border p-2 space-y-1.5" data-testid={`sound-row-${event}`}>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-medium">{t(EVENT_TEXT[event].label)}</span>
                    <span className="text-[10px] text-muted-foreground">{t(EVENT_TEXT[event].when)}</span>
                  </div>
                  <Select
                    value={setting.sound}
                    disabled={disabled}
                    onValueChange={(value) => {
                      if (isSoundChoice(value)) update(event, { ...setting, sound: value });
                    }}
                  >
                    <SelectTrigger size="sm" className="w-28 text-xs" aria-label={t(EVENT_TEXT[event].label)}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SOUND_CHOICES.map((choice) => (
                        <SelectItem key={choice} value={choice} className="text-xs">
                          {t(CHOICE_TEXT[choice])}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min={0}
                    max={100}
                    step={5}
                    value={setting.volume}
                    disabled={disabled}
                    aria-label={t("sound.volume", { volume: setting.volume })}
                    onChange={(changeEvent) => update(event, { ...setting, volume: Number(changeEvent.target.value) })}
                    className="flex-1 rounded accent-current outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
                  />
                  <span className="text-[10px] text-muted-foreground w-24 text-right">{t("sound.volume", { volume: setting.volume })}</span>
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    disabled={disabled}
                    title={t("sound.preview")}
                    onClick={() => previewSound(t(EVENT_TEXT[event].label), setting)}
                  >
                    <IconPlayerPlay className="size-3.5" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
