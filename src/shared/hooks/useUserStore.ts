import { create } from "zustand";
import { UserPreference } from "../models/users/userPreferences";
import { Genre } from "../models/videogames/genres";
import { Languages } from "../models/videogames/languages";
import { GamePlatforms } from "../models/videogames/platform";

type UserStore = {
  preferences: UserPreference | null;
  platforms: GamePlatforms[];
  genres: Genre[];
  languages: Languages[];

  setPreferences: (preferences: UserPreference) => void;
  setPlatforms: (platforms: GamePlatforms[]) => void;
  setGenres: (genres: Genre[]) => void;
  setLanguages: (languages: Languages[]) => void;
  clear: () => void;
};

export const useUserStore = create<UserStore>((set) => ({
  preferences: null,
  platforms: [],
  genres: [],
  languages: [],

  setPreferences: (preferences) => set({ preferences }),
  setPlatforms: (platforms) => set({ platforms }),
  setGenres: (genres) => set({ genres }),
  setLanguages: (languages) => set({ languages }),
  clear: () => set({ preferences: null, platforms: [], genres: [], languages: [] }),
}));