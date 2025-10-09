import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

type PreferencesState = {
  platforms: string[];
  genres: string[];
  gamingHours: number;
};

type PreferencesActions = {
  setPlatforms: (p: string[]) => void;
  togglePlatform: (p: string) => void;
  setGenres: (g: string[]) => void;
  toggleGenre: (g: string) => void;
  setGamingHours: (h: number) => void;
  reset: () => void;
  hydrate: (payload: Partial<PreferencesState>) => void;
};

type PrefStore = PreferencesState & PreferencesActions;

const initialState: PreferencesState = {
  platforms: [],
  genres: [],
  gamingHours: 0,
};

export const usePreferencesStore = create<PrefStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      setPlatforms: (p: string[]) => set({ platforms: p }),

      togglePlatform: (p: string) =>
        set((state) => ({
          platforms: state.platforms.includes(p)
            ? state.platforms.filter((x) => x !== p)
            : [...state.platforms, p],
        })),

      setGenres: (g: string[]) => set({ genres: g }),

      toggleGenre: (g: string) =>
        set((state) => ({
          genres: state.genres.includes(g) ? state.genres.filter((x) => x !== g) : [...state.genres, g],
        })),

      setGamingHours: (h: number) => set({ gamingHours: h }),

      reset: () => set({ ...initialState }),

      hydrate: (payload: Partial<PreferencesState>) =>
        set((state) => ({
          platforms: payload.platforms ?? state.platforms,
          genres: payload.genres ?? state.genres,
          gamingHours: payload.gamingHours ?? state.gamingHours,
        })),
    }),
    {
      name: "preferences-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
