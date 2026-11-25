import type { ReactNode } from "react";
import { useT } from "@/i18n";

export interface WelcomeHint {
  title: string;
  description: string;
  slashCommand?: string;
  component?: ReactNode;
}

function ShortcutRow({ kbd, children }: { kbd: string; children: ReactNode }) {
  return (
    <div className="flex justify-between items-start gap-3">
      <kbd className="kbd shrink-0">{kbd}</kbd>
      <span className="text-right">{children}</span>
    </div>
  );
}

function ShortcutGuide() {
  const t = useT();
  return (
    <div className="text-left text-xs mt-2 space-y-5 w-full max-w-96">
      <div>
        <div className="font-medium text-foreground mb-1.5">{t("welcome.commands")}</div>
        <div className="text-muted-foreground space-y-1">
          <ShortcutRow kbd="/">{t("welcome.viewAllCommands")}</ShortcutRow>
          <ShortcutRow kbd="/init">{t("welcome.initDesc")}</ShortcutRow>
          <ShortcutRow kbd="/compact">{t("welcome.compactDesc")}</ShortcutRow>
        </div>
      </div>
      <div>
        <div className="font-medium text-foreground mb-1.5">{t("welcome.tips")}</div>
        <div className="text-muted-foreground space-y-1">
          <ShortcutRow kbd="↑">{t("welcome.browseHistory")}</ShortcutRow>
          <ShortcutRow kbd="@">{t("welcome.addFiles")}</ShortcutRow>
          <ShortcutRow kbd="Alt+K">{t("welcome.altK")}</ShortcutRow>
        </div>
      </div>
      <div>
        <div className="font-medium text-foreground mb-1.5">{t("welcome.proTips")}</div>
        <div className="text-muted-foreground space-y-1">
          <div>{t("welcome.proYolo")}</div>
          <div>{t("welcome.proAgentsMd")}</div>
          <div>{t("welcome.proThinking")}</div>
        </div>
      </div>
    </div>
  );
}

export function useWelcomeHint(): WelcomeHint {
  const t = useT();
  return {
    title: t("welcome.quickStart"),
    description: "",
    component: <ShortcutGuide />,
  };
}
