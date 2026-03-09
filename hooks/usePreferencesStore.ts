import { create } from "zustand";

type State = {
  platforms: string[];
  genres: string[];
  gamingHours: number;
  languages: string[];
};

type Action = {
  setPlatforms: (platforms: string[]) => void;
  setGenres: (genres: string[]) => void;
  setGamingHours: (hours: number) => void;
  setLanguages: (languages: string[]) => void;
  reset: () => void;
};

type UserPreferencesStore = State & Action;

const initialState: State = {
  platforms: [],
  genres: [],
  gamingHours: 0,
  languages: [],
};
export const userPreferencesStore = create<UserPreferencesStore>((set) => ({
  platforms: [],
  genres: [],
  languages: [],
  gamingHours: 0,
  setPlatforms: (platforms) => set(() => ({ platforms: platforms })),
  setGenres: (genres) => set(() => ({ genres: genres })),
  setLanguages: (languages) => set(() => ({ languages: languages })),
  setGamingHours: (hours) => set(() => ({ gamingHours: hours })),
  reset: () => set(() => initialState),
}));
