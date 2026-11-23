import { create } from "zustand";

const STORAGE_KEY = "kimi-krinik-favorite-models";

interface FavoriteModelsState {
  favorites: string[];
  toggleFavorite: (modelId: string) => void;
}

function readFavorites(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === "string") : [];
  } catch {
    return [];
  }
}

export const useFavoriteModels = create<FavoriteModelsState>((set) => ({
  favorites: readFavorites(),
  toggleFavorite: (modelId) => set((state) => {
    const favorites = state.favorites.includes(modelId)
      ? state.favorites.filter((id) => id !== modelId)
      : [...state.favorites, modelId];
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    } catch {
      return { favorites };
    }
    return { favorites };
  }),
}));
