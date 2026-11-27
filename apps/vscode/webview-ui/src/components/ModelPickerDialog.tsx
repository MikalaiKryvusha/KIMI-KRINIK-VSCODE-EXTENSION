import { useEffect, useMemo, useRef, useState } from "react";
import { IconCheck, IconStar, IconStarFilled } from "@tabler/icons-react";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { providerDisplayName, useSettingsStore } from "@/stores";
import { useT, type TranslationKey } from "@/i18n";
import { cn } from "@/lib/utils";
import { useFavoriteModels } from "./inputarea/hooks/useFavoriteModels";
import type { ModelConfig } from "shared/legacy-sdk";

interface ModelPickerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  models: ModelConfig[];
}

const CAPABILITY_LABEL_KEYS: { match: string; key: TranslationKey }[] = [
  { match: "thinking", key: "modelPicker.capThinking" },
  { match: "image", key: "modelPicker.capImage" },
  { match: "video", key: "modelPicker.capVideo" },
  { match: "tool", key: "modelPicker.capTools" },
];

function capabilityLabelKeys(capabilities: string[]): TranslationKey[] {
  return CAPABILITY_LABEL_KEYS.filter(({ match }) => capabilities.some((capability) => capability.includes(match))).map(({ key }) => key);
}

function formatContextTokens(tokens: number | undefined): string | undefined {
  if (tokens === undefined || tokens <= 0) return undefined;
  if (tokens >= 1_000_000) return `${Number((tokens / 1_000_000).toFixed(1))}M ctx`;
  if (tokens >= 1_000) return `${Math.round(tokens / 1_000)}k ctx`;
  return `${tokens} ctx`;
}

export function ModelPickerDialog({ open, onOpenChange, models }: ModelPickerDialogProps) {
  const t = useT();
  const currentModel = useSettingsStore((state) => state.currentModel);
  const updateModel = useSettingsStore((state) => state.updateModel);
  const { favorites, toggleFavorite } = useFavoriteModels();
  const [query, setQuery] = useState("");
  const [providerFilter, setProviderFilter] = useState("all");
  const [activeIndex, setActiveIndex] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      setQuery("");
      setProviderFilter("all");
      setActiveIndex(0);
    }
  }, [open]);

  const providers = useMemo(() => {
    const seen = new Set<string>();
    for (const model of models) seen.add(model.provider);
    return [...seen].toSorted((left, right) => providerDisplayName(left).localeCompare(providerDisplayName(right)));
  }, [models]);
  const favoriteSet = useMemo(() => new Set(favorites), [favorites]);
  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return models
      .filter((model) => {
        if (providerFilter !== "all" && model.provider !== providerFilter) return false;
        if (!normalized) return true;
        return model.name.toLowerCase().includes(normalized)
          || model.provider.toLowerCase().includes(normalized)
          || providerDisplayName(model.provider).toLowerCase().includes(normalized);
      })
      .toSorted((left, right) => Number(favoriteSet.has(right.id)) - Number(favoriteSet.has(left.id))
        || left.name.localeCompare(right.name)
        || left.id.localeCompare(right.id));
  }, [models, query, providerFilter, favoriteSet]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query, providerFilter]);

  useEffect(() => {
    listRef.current?.querySelector(`[data-index="${activeIndex}"]`)?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  const choose = (modelId: string) => {
    updateModel(modelId);
    onOpenChange(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((previous) => Math.max(0, Math.min(previous + 1, filtered.length - 1)));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((previous) => Math.max(previous - 1, 0));
    } else if (event.key === "Enter") {
      if ((event.target as HTMLElement).closest("button")) return;
      const model = filtered[activeIndex];
      if (model) choose(model.id);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" onKeyDown={handleKeyDown}>
        <DialogHeader>
          <DialogTitle>{t("modelPicker.title")}</DialogTitle>
        </DialogHeader>

        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={t("modelPicker.searchPlaceholder")}
          autoFocus
          autoComplete="off"
          spellCheck={false}
        />

        {providers.length > 1 && (
          <div className="flex flex-wrap gap-1">
            {["all", ...providers].map((provider) => (
              <button
                key={provider}
                type="button"
                onClick={() => setProviderFilter(provider)}
                className={cn(
                  "rounded-full px-2 py-0.5 text-xs transition-colors cursor-pointer",
                  providerFilter === provider ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-muted/50",
                )}
              >
                {provider === "all" ? t("modelPicker.all") : providerDisplayName(provider)}
              </button>
            ))}
          </div>
        )}

        <div ref={listRef} role="listbox" className="max-h-[50vh] overflow-y-auto -mx-1 px-1">
          {filtered.map((model, index) => {
            const isCurrent = model.id === currentModel;
            const isFavorite = favoriteSet.has(model.id);
            const description = [
              providerDisplayName(model.provider),
              formatContextTokens(model.max_context_tokens),
              ...capabilityLabelKeys(model.capabilities).map((key) => t(key)),
            ].filter((segment) => segment !== undefined).join(" · ");
            return (
              <div
                key={model.id}
                data-index={index}
                role="option"
                aria-selected={isCurrent}
                onClick={() => choose(model.id)}
                onMouseEnter={() => setActiveIndex(index)}
                className={cn(
                  "flex items-center gap-2 rounded-md px-2 py-1.5 cursor-pointer",
                  index === activeIndex && "bg-accent/50",
                  isCurrent && "bg-accent",
                )}
              >
                <span className="flex-1 min-w-0">
                  <span className="block truncate text-sm font-medium">{model.name}</span>
                  <span className="block truncate text-xs text-muted-foreground">{description}</span>
                </span>
                <button
                  type="button"
                  aria-label={`${isFavorite ? t("modelPicker.unstar") : t("modelPicker.star")} ${model.name}`}
                  onClick={(event) => {
                    event.stopPropagation();
                    toggleFavorite(model.id);
                  }}
                  className="shrink-0 cursor-pointer p-0.5"
                >
                  {isFavorite ? (
                    <IconStarFilled className="size-3.5 text-amber-500" />
                  ) : (
                    <IconStar className="size-3.5 text-muted-foreground" />
                  )}
                </button>
                {isCurrent && <IconCheck className="size-3.5 shrink-0" />}
              </div>
            );
          })}
          {filtered.length === 0 && <div className="px-2 py-4 text-xs text-muted-foreground">{t("modelPicker.empty")}</div>}
        </div>

        <div className="border-t pt-2 text-[10px] text-muted-foreground">{t("modelPicker.footerHint")}</div>
      </DialogContent>
    </Dialog>
  );
}
