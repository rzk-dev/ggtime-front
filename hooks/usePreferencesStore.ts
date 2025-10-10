import { create } from "zustand";

type State = {
  platforms: string[];
  genres: string[];
  gamingHours: number;
};

type Action = {
  setPlatforms: (platforms: string[]) => void;
  setGenres: (genres: string[]) => void;
  setGamingHours: (hours: number) => void;
  reset: () => void;
};

type UserPreferencesStore = State & Action;

const initialState: State = {
  platforms: [],
  genres: [],
  gamingHours: 0,
};
export const userPreferencesStore = create<UserPreferencesStore>((set) => ({
  platforms: [],
  genres: [],
  gamingHours: 0,
  setPlatforms: (platforms) => set(() => ({ platforms: platforms })),
  setGenres: (genres) => set(() => ({ genres: genres })),
  setGamingHours: (hours) => set(() => ({ gamingHours: hours })),
  reset: () => set(() => initialState),
}));
