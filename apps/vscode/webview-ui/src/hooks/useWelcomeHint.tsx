import { useState, useEffect, useMemo } from "react";
import { bridge } from "@/services";
import { useT, type TranslationKey } from "@/i18n";

export interface WelcomeHint {
  title: string;
  description: string;
  slashCommand?: string;
  component?: React.ReactNode;
}

interface HintSource {
  title: TranslationKey;
  description?: TranslationKey;
  slashCommand?: string;
  guide?: true;
}

function ShortcutRow({ kbd, children }: { kbd: string; children: React.ReactNode }) {
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

const HINT_FIRST_TIME: HintSource = { title: "welcome.quickStart", guide: true };

const HINT_AGENT_MD: HintSource = {
  title: "welcome.mapCodebase.title",
  description: "welcome.mapCodebase.desc",
  slashCommand: "/init",
};

const HINTS_POOL: HintSource[] = [
  HINT_FIRST_TIME,
  HINT_AGENT_MD,
  { title: "welcome.refCode.title", description: "welcome.refCode.desc" },
  { title: "welcome.seeWhatICanDo.title", description: "welcome.seeWhatICanDo.desc" },
  { title: "welcome.deeperAnalysis.title", description: "welcome.deeperAnalysis.desc" },
  { title: "welcome.moreThanCode.title", description: "welcome.moreThanCode.desc" },
  { title: "welcome.addMoreTools.title", description: "welcome.addMoreTools.desc" },
  { title: "welcome.fewerInterruptions.title", description: "welcome.fewerInterruptions.desc" },
  { title: "welcome.longContext.title", description: "welcome.longContext.desc", slashCommand: "/compact" },
];

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function withProbability(p: number): boolean {
  return Math.random() < p;
}

export function useWelcomeHint(): WelcomeHint {
  const [hasAgentMd, setHasAgentMd] = useState<boolean | null>(null);
  const [hasHistory, setHasHistory] = useState<boolean | null>(null);
  const t = useT();

  useEffect(() => {
    bridge
      .checkFileExists("AGENT.md")
      .then(setHasAgentMd)
      .catch(() => setHasAgentMd(false));
    bridge
      .getKimiSessions()
      .then((s) => setHasHistory(s.length > 0))
      .catch(() => setHasHistory(false));
  }, []);

  const source = useMemo(() => {
    if (hasHistory === false) {
      return HINT_FIRST_TIME;
    }
    if (hasAgentMd === false && withProbability(0.3)) {
      return HINT_AGENT_MD;
    }
    return pickRandom(HINTS_POOL);
  }, [hasAgentMd, hasHistory]);

  return useMemo(() => ({
    title: t(source.title),
    description: source.description === undefined ? "" : t(source.description),
    ...(source.slashCommand === undefined ? {} : { slashCommand: source.slashCommand }),
    ...(source.guide ? { component: <ShortcutGuide /> } : {}),
  }), [source, t]);
}
