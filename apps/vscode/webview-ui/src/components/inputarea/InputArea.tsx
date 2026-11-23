import { useRef, useMemo, useState, useEffect } from "react";
import { IconSend, IconPlus } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ActionMenu } from "../ActionMenu";
import { UsageStatusBar } from "../UsageStatusBar";
import { SlashCommandMenu } from "../SlashCommandMenu";
import { FilePickerMenu } from "../FilePickerMenu";
import { MediaThumbnail } from "../MediaThumbnail";
import { MediaPreviewModal } from "../MediaPreviewModal";
import { StatusPills } from "../StatusPills";
import { StreamingConfirmDialog } from "../StreamingConfirmDialog";
import {
  getModelById,
  getMediaFallbackModel,
  getModelsForMedia,
  useChatStore,
  useSettingsStore,
} from "@/stores";
import { bridge, Events } from "@/services";
import { Content } from "@/lib/content";
import { cn } from "@/lib/utils";
import { useSlashMenu, findActiveToken } from "./hooks/useSlashMenu";
import { useFilePicker } from "./hooks/useFilePicker";
import { useMediaUpload } from "./hooks/useMediaUpload";
import { useClickOutside } from "./hooks/useClickOutside";
import { useInputHistory } from "./hooks/useInputHistory";
import { computeMentionInsert } from "./utils";
import { useT } from "@/i18n";
import { ModeButtons } from "../ModeButtons";
import { PermissionModeButton } from "../PermissionModeButton";
import { BehaviorButtons } from "../BehaviorButtons";
import { SubagentModelDialog } from "../SubagentModelDialog";
import { ModelPicker } from "../ModelPicker";

interface InputAreaProps {
  onAuthAction?: () => void;
}

function adjustHeight(textarea: HTMLTextAreaElement | null) {
  if (!textarea) return;
  textarea.style.height = "auto";
  textarea.style.height = `${Math.min(textarea.scrollHeight, 140)}px`;
}

export function InputArea({ onAuthAction }: InputAreaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const addButtonRef = useRef<HTMLButtonElement>(null);
  const [text, setText] = useState("");
  const [cursorPos, setCursorPos] = useState(0);
  const [previewMedia, setPreviewMedia] = useState<string | null>(null);

  const { isStreaming, sendMessage, abort, draftMedia, removeDraftMedia, hasProcessingMedia, getMediaInConversation, pendingInput, composerRestore, planMode, messages } = useChatStore();
  const { currentModel, updateModel, models, extensionConfig } = useSettingsStore();

  const t = useT();
  const isProcessing = hasProcessingMedia();
  const hasConversationHistory = messages.some((message) => message.role === "user");

  const [showPlanModeConfirm, setShowPlanModeConfirm] = useState(false);

  const handleTogglePlanMode = () => {
    if (planMode && isStreaming) {
      setShowPlanModeConfirm(true);
      return;
    }
    const newState = !planMode;
    useChatStore.setState({ planMode: newState });
    void bridge.setPlanMode(newState);
  };

  const handleConfirmExitPlanMode = () => {
    useChatStore.setState({ planMode: false });
    void bridge.setPlanMode(false);
    setShowPlanModeConfirm(false);
  };

  const mediaReq = useMemo(() => {
    const media = getMediaInConversation();
    return { image: media.hasImage, video: media.hasVideo };
  }, [getMediaInConversation, draftMedia]);

  const availableModels = useMemo(() => getModelsForMedia(models, mediaReq), [models, mediaReq]);
  const currentModelConfig = getModelById(models, currentModel);

  useEffect(() => {
    if (!mediaReq.image && !mediaReq.video) {
      return;
    }
    const isCurrentModelValid = availableModels.some((m) => m.id === currentModel);
    if (isCurrentModelValid) {
      return;
    }
    const fallbackModel = getMediaFallbackModel(availableModels, currentModelConfig);
    if (fallbackModel !== undefined) {
      updateModel(fallbackModel.id);
    }
  }, [mediaReq.image, mediaReq.video, currentModel, currentModelConfig, availableModels, updateModel]);

  useEffect(() => {
    if (!pendingInput || isStreaming) {
      return;
    }

    if (text.trim()) {
      return;
    }

    const textContent = Content.getText(pendingInput.content);
    if (textContent) {
      setText(textContent);
      setTimeout(() => {
        textareaRef.current?.focus();
        adjustHeight(textareaRef.current);
      }, 0);
    }
  }, [pendingInput, isStreaming]);

  useEffect(() => {
    if (composerRestore === null) {
      return;
    }
    useChatStore.setState({ composerRestore: null });
    if (!composerRestore) {
      return;
    }
    setText((current) => (current.trim() ? `${composerRestore}\n${current}` : composerRestore));
    setTimeout(() => {
      textareaRef.current?.focus();
      adjustHeight(textareaRef.current);
    }, 0);
  }, [composerRestore]);

  const activeToken = useMemo(() => findActiveToken(text, cursorPos), [text, cursorPos]);

  const { handlePaste, handlePickMedia } = useMediaUpload();

  const {
    handleKey: handleHistoryKey,
    add: addToHistory,
    reset: resetHistoryIndex,
  } = useInputHistory({
    text,
    setText,
    onHeightChange: () => setTimeout(() => { adjustHeight(textareaRef.current); }, 0),
  });

  function clearInput() {
    setText("");
    setCursorPos(0);
    setTimeout(() => { adjustHeight(textareaRef.current); }, 0);
  }

  function removeActiveToken() {
    if (!activeToken) return;
    const newText = text.slice(0, activeToken.start) + text.slice(cursorPos);
    const newCursorPos = activeToken.start;
    setText(newText);
    setCursorPos(newCursorPos);
    setTimeout(() => {
      textareaRef.current?.setSelectionRange(newCursorPos, newCursorPos);
      adjustHeight(textareaRef.current);
    }, 0);
  }

  function handleSend() {
    if (isProcessing || (!text.trim() && draftMedia.length === 0)) {
      return;
    }

    addToHistory(text);
    sendMessage(text);
    clearInput();
  }

  function handleSlashCommand(name: string) {
    sendMessage(`/${name}`);
    clearInput();
  }

  function applyMention(filePath: string) {
    const { newText, newCursorPos } = computeMentionInsert({
      text,
      cursorPos,
      filePath,
      activeToken,
      isAppend: false,
    });

    setText(newText);
    setCursorPos(newCursorPos);
    setTimeout(() => {
      textareaRef.current?.setSelectionRange(newCursorPos, newCursorPos);
      textareaRef.current?.focus();
      adjustHeight(textareaRef.current);
    }, 0);
  }

  const {
    showSlashMenu,
    filteredCommands,
    selectedIndex: slashSelectedIndex,
    setSelectedIndex: setSlashSelectedIndex,
    handleSlashMenuKey,
    resetSlashMenu,
  } = useSlashMenu(activeToken, handleSlashCommand, removeActiveToken);

  const {
    showFileMenu,
    fileItems,
    selectedIndex: fileSelectedIndex,
    isLoading: isFileLoading,
    isStale: isFileStale,
    showMediaOption,
    setSelectedIndex: setFileSelectedIndex,
    handleSelectItem: handleSelectFileItem,
    handleFileMenuKey,
    resetFilePicker,
  } = useFilePicker(
    activeToken,
    applyMention,
    () => {
      void handlePickMedia();
    },
    removeActiveToken,
  );

  const closeMenus = () => {
    if (showSlashMenu || showFileMenu) {
      removeActiveToken();
    }
  };

  useClickOutside([textareaRef, menuRef, addButtonRef], showSlashMenu || showFileMenu, closeMenus);

  useEffect(() => {
    resetSlashMenu();
  }, [showSlashMenu, resetSlashMenu]);

  useEffect(() => {
    if (!showFileMenu) {
      resetFilePicker();
    }
  }, [showFileMenu, resetFilePicker]);

  useEffect(() => {
    const unsub = bridge.on<{ mention: string }>(Events.InsertMention, ({ mention }) => {
      setText((prev) => prev + mention + " ");

      setTimeout(() => {
        textareaRef.current?.focus();
        adjustHeight(textareaRef.current);
      }, 0);
    });

    return unsub;
  }, []);

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.nativeEvent.isComposing) {
      return;
    }

    if (handleSlashMenuKey(e)) {
      return;
    }

    if (handleFileMenuKey(e)) {
      return;
    }

    if (handleHistoryKey(e)) {
      return;
    }

    if (extensionConfig.useCtrlEnterToSend) {
      if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        handleSend();
      }
    } else {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    setCursorPos(e.target.selectionStart);
    resetHistoryIndex();
    setTimeout(() => { adjustHeight(textareaRef.current); }, 0);
  };

  const handleSelect = () => {
    setCursorPos(textareaRef.current?.selectionStart ?? 0);
  };

  function handleAddButtonClick() {
    if (showFileMenu) {
      removeActiveToken();
      return;
    }
    const newText = text + "@";
    setText(newText);
    setCursorPos(newText.length);
    setTimeout(() => {
      textareaRef.current?.focus();
      textareaRef.current?.setSelectionRange(newText.length, newText.length);
      adjustHeight(textareaRef.current);
    }, 0);
  }

  const hasModels = availableModels.length > 0;
  const canSend = (text.trim() || draftMedia.length > 0) && !isProcessing;

  return (
    <div className="p-2 pt-0! flex flex-col min-h-0">
      <StatusPills />
      <div className="relative shrink-0">
        {showSlashMenu && filteredCommands.length > 0 && (
          <div ref={menuRef} className="absolute bottom-full left-0 right-0 mb-2 z-10">
            <SlashCommandMenu
              commands={filteredCommands}
              query={activeToken?.query || ""}
              selectedIndex={slashSelectedIndex}
              onSelect={handleSlashCommand}
              onHover={setSlashSelectedIndex}
            />
          </div>
        )}

        {showFileMenu && (
          <div ref={menuRef} className="absolute bottom-full left-0 right-0 mb-2 z-10">
            <FilePickerMenu
              items={fileItems}
              selectedIndex={fileSelectedIndex}
              isLoading={isFileLoading}
              isStale={isFileStale}
              showMediaOption={showMediaOption}
              onSelectMedia={() => {
                void handlePickMedia();
              }}
              onSelectItem={handleSelectFileItem}
              onHover={setFileSelectedIndex}
            />
          </div>
        )}

        <div className="border border-input rounded-md overflow-hidden">
          {draftMedia.length > 0 && (
            <div className="flex gap-2 p-2 overflow-x-auto">
              {draftMedia.map((item) => (
                <MediaThumbnail
                  key={item.id}
                  src={item.dataUri}
                  size="sm"
                  onClick={item.dataUri ? () => setPreviewMedia(item.dataUri!) : undefined}
                  onRemove={() => removeDraftMedia(item.id)}
                />
              ))}
            </div>
          )}

          <textarea
            ref={textareaRef}
            value={text}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onSelect={handleSelect}
            onPaste={handlePaste}
            placeholder={isStreaming ? t("input.placeholderStreaming") : t("input.placeholder")}
            className={cn(
              "w-full min-h-12 max-h-35 px-2.5 py-1.5 text-xs leading-relaxed",
              "bg-transparent resize-none outline-none border-none overflow-y-auto",
              "placeholder:text-muted-foreground",
            )}
          />

          <div className="@container/composer flex items-center justify-between gap-1 px-1.5 pb-1.5">
            <div className="flex items-center gap-1.5 min-w-0 flex-1">
              <ModelPicker
                availableModels={availableModels}
                hasConversationHistory={hasConversationHistory}
                disabled={isStreaming || !hasModels}
              />
              {extensionConfig.controlPanel.permission && <PermissionModeButton />}
              <BehaviorButtons />
              <ModeButtons planMode={planMode} onTogglePlanMode={handleTogglePlanMode} />
              {extensionConfig.controlPanel.secondaryModel && <SubagentModelDialog disabled={isStreaming} />}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    ref={addButtonRef}
                    data-testid="attachment-picker-toggle"
                    aria-label={t("input.addFilesOrMedia")}
                    variant="ghost"
                    size="icon-xs"
                    onClick={handleAddButtonClick}
                    className="text-muted-foreground"
                  >
                    <IconPlus className="size-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{t("input.addFilesOrMedia")}</TooltipContent>
              </Tooltip>

              <UsageStatusBar />
              <ActionMenu onAuthAction={onAuthAction} />

              {isStreaming ? (
                <Button variant="destructive" size="icon-xs" onClick={abort}>
                  <span aria-hidden="true" data-testid="stop-indicator" className="block size-2.5 bg-current" />
                </Button>
              ) : (
                <Button variant="default" size="icon-xs" onClick={handleSend} disabled={!canSend}>
                  <IconSend className="size-3.5" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
      <MediaPreviewModal src={previewMedia} onClose={() => setPreviewMedia(null)} />
      <StreamingConfirmDialog
        open={showPlanModeConfirm}
        onOpenChange={setShowPlanModeConfirm}
        title={t("input.exitPlanMode.title")}
        description={t("input.exitPlanMode.description")}
        confirmLabel={t("input.exitPlanMode.confirm")}
        onConfirm={handleConfirmExitPlanMode}
      />
    </div>
  );
}
