import { IconCheck } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useSettingsStore } from "@/stores";
import { cn } from "@/lib/utils";
import type { InterfaceLanguage } from "shared/types";

const LANGUAGE_NAMES: ReadonlyArray<[InterfaceLanguage, string]> = [
  ["en", "English"],
  ["ru", "Русский"],
  ["zh", "中文"],
];

export function orderedLanguages(selectedLanguage: InterfaceLanguage): typeof LANGUAGE_NAMES {
  return [
    ...LANGUAGE_NAMES.filter(([language]) => language === selectedLanguage),
    ...LANGUAGE_NAMES.filter(([language]) => language !== selectedLanguage),
  ];
}

export function languageTitle(selectedLanguage: InterfaceLanguage): string {
  return orderedLanguages(selectedLanguage).map(([, name]) => name).join(" / ");
}

interface LanguageSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LanguageSelectionDialog({ open, onOpenChange }: LanguageSelectionDialogProps) {
  const extensionConfig = useSettingsStore((state) => state.extensionConfig);
  const changeLanguage = useSettingsStore((state) => state.changeLanguage);
  const languages = orderedLanguages(extensionConfig.language);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xs" data-testid="language-selection-dialog">
        <DialogHeader>
          <DialogTitle>{languageTitle(extensionConfig.language)}</DialogTitle>
        </DialogHeader>
        <div className="space-y-1">
          {languages.map(([language, name]) => {
            const selected = extensionConfig.language === language;
            return (
              <Button
                key={language}
                variant="ghost"
                className={cn("w-full justify-start gap-2", selected && "bg-accent")}
                aria-pressed={selected}
                onClick={() => void changeLanguage(language)}
              >
                <span className="flex-1 text-left">{name}</span>
                {selected && <IconCheck className="size-3.5 text-muted-foreground" />}
              </Button>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
