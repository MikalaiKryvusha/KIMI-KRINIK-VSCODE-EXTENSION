import { useState } from "react";
import { IconSettings, IconServer, IconLogout, IconLogin, IconLoader2, IconRefresh, IconFileText, IconFolder, IconVolume, IconAdjustmentsHorizontal, IconExternalLink, IconLanguage } from "@tabler/icons-react";
import { ControlPanelSettingsDialog } from "./ControlPanelSettingsDialog";
import { GeneralSettingsDialog } from "./GeneralSettingsDialog";
import { LanguageSelectionDialog, orderedLanguages } from "./LanguageSelectionDialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useSettingsStore } from "@/stores";
import { bridge } from "@/services";
import { toast } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import { useT } from "@/i18n";
import { translate } from "@/i18n/translate";

interface ActionMenuProps {
  className?: string;
  onAuthAction?: () => void;
}

function MenuSection({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="py-1">
      <div className="px-2.5 py-1 text-[10px] font-medium text-muted-foreground uppercase tracking-wider flex items-center justify-between">
        <span>{title}</span>
        {subtitle && <span className="normal-case tracking-normal">{subtitle}</span>}
      </div>
      {children}
    </div>
  );
}

function MenuItem({ onClick, disabled, danger, children }: { onClick: () => void; disabled?: boolean; danger?: boolean; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "w-full flex items-center gap-2 px-2.5 py-1.5 text-xs hover:bg-accent transition-colors text-left cursor-pointer",
        disabled && "opacity-50 cursor-not-allowed",
        danger && "text-red-500 hover:text-red-600",
      )}
    >
      {children}
    </button>
  );
}

export function ActionMenu({ className, onAuthAction }: ActionMenuProps) {
  const [open, setOpen] = useState(false);
  const [controlPanelOpen, setControlPanelOpen] = useState(false);
  const [generalSettingsOpen, setGeneralSettingsOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setMCPModalOpen, isLoggedIn, setIsLoggedIn, extensionConfig, setSoundModalOpen } = useSettingsStore();
  const t = useT();
  const languageAction = orderedLanguages(extensionConfig.language)
    .map(([language]) => translate(language, "menu.languageAction"))
    .join(" / ");

  const handleOpenProjectPage = () => {
    void bridge.openProjectPage();
    setOpen(false);
  };

  const handleOpenMCPServers = () => {
    setMCPModalOpen(true);
    setOpen(false);
  };

  const handleChangeWorkDir = () => {
    useSettingsStore.getState().setWorkDirModalOpen(true);
    setOpen(false);
  };

  const handleReset = () => {
    setOpen(false);
    void bridge.reloadWebview();
  };

  const handleShowLogs = () => {
    void bridge.showLogs();
    setOpen(false);
  };

  const handleAuthAction = async () => {
    setLoading(true);
    try {
      if (isLoggedIn) {
        await bridge.logout();
        setIsLoggedIn(false);
      } else {
        const result = await bridge.login();
        if (result.success) {
          setIsLoggedIn(true);
        } else {
          toast.error(result.error ?? t("menu.signInFailed"));
        }
      }
    } finally {
      setLoading(false);
      setOpen(false);
    }
    onAuthAction?.();
  };

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon-xs" className={cn("text-muted-foreground cursor-pointer disabled:cursor-default", className)}>
          <IconSettings className="size-3.5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[calc(100vw-1rem)] max-w-72 max-h-(--radix-popover-content-available-height) overflow-y-auto overscroll-contain p-1.5 gap-0!" align="end" side="top">
        <MenuSection title={t("menu.settings")}>
          <MenuItem onClick={handleChangeWorkDir}>
            <IconFolder className="size-4 text-muted-foreground" />
            <span className="flex-1">{t("menu.workingDirectory")}</span>
          </MenuItem>
          <MenuItem onClick={handleOpenMCPServers}>
            <IconServer className="size-4 text-muted-foreground" />
            <span className="flex-1">{t("menu.mcpServers")}</span>
          </MenuItem>
          <MenuItem onClick={() => { setSoundModalOpen(true); setOpen(false); }}>
            <IconVolume className="size-4 text-muted-foreground" />
            <span className="flex-1">{t("menu.soundSettings")}</span>
          </MenuItem>
          <MenuItem onClick={() => { setControlPanelOpen(true); setOpen(false); }}>
            <IconAdjustmentsHorizontal className="size-4 text-muted-foreground" />
            <span className="flex-1">{t("controlPanel.title")}</span>
          </MenuItem>
          <MenuItem onClick={() => { setLanguageOpen(true); setOpen(false); }}>
            <IconLanguage className="size-4 text-muted-foreground" />
            <span className="flex-1">{languageAction}</span>
          </MenuItem>
          <MenuItem onClick={() => { setGeneralSettingsOpen(true); setOpen(false); }}>
            <IconSettings className="size-4 text-muted-foreground" />
            <span className="flex-1">{t("menu.generalConfig")}</span>
          </MenuItem>
        </MenuSection>

        <Separator className="my-px" />

        <MenuSection title={t("menu.support")} subtitle={extensionConfig.version ? `v${extensionConfig.version} (${extensionConfig.buildNumber})` : undefined}>
          <MenuItem onClick={handleOpenProjectPage}>
            <IconExternalLink className="size-4 text-muted-foreground" />
            <span className="flex-1">{t("menu.aboutProject")}</span>
          </MenuItem>
          <MenuItem onClick={handleShowLogs}>
            <IconFileText className="size-4 text-muted-foreground" />
            <span className="flex-1">{t("menu.showLogs")}</span>
          </MenuItem>
          <MenuItem onClick={handleReset}>
            <IconRefresh className="size-4 text-muted-foreground" />
            <span className="flex-1">{t("menu.resetKimi")}</span>
          </MenuItem>
        </MenuSection>

        <Separator className="my-px" />

        <MenuSection title={t("menu.account")}>
          <MenuItem
            onClick={() => {
              void handleAuthAction();
            }}
            disabled={loading}
            danger={isLoggedIn}
          >
            {loading ? <IconLoader2 className="size-4 animate-spin" /> : isLoggedIn ? <IconLogout className="size-4" /> : <IconLogin className="size-4 text-muted-foreground" />}
            <span className="flex-1">{loading ? t("menu.processing") : isLoggedIn ? t("menu.signOut") : t("menu.signIn")}</span>
          </MenuItem>
        </MenuSection>
      </PopoverContent>
      </Popover>
      <ControlPanelSettingsDialog open={controlPanelOpen} onOpenChange={setControlPanelOpen} />
      <GeneralSettingsDialog open={generalSettingsOpen} onOpenChange={setGeneralSettingsOpen} />
      <LanguageSelectionDialog open={languageOpen} onOpenChange={setLanguageOpen} />
    </>
  );
}
