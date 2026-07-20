import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { colors } from "@/src/shared/constants/colors";

type ThemeMode = "dark" | "light";

type ThemeContextValue = {
  mode: ThemeMode;
  isDarkMode: boolean;
  theme: typeof colors.dark;
  setMode: (mode: ThemeMode) => void;
  toggleDarkMode: (value: boolean) => void;
};

const STORAGE_KEY = "ggtime:themeMode";

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const [mode, setModeState] = useState<ThemeMode>(systemScheme === "light" ? "light" : "dark");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((stored) => {
      if (stored === "dark" || stored === "light") {
        setModeState(stored);
      }
      setIsLoaded(true);
    });
  }, []);

  const setMode = (newMode: ThemeMode) => {
    setModeState(newMode);
    AsyncStorage.setItem(STORAGE_KEY, newMode).catch((error) => {
      console.error("Error persisting theme mode:", error);
    });
  };

  const toggleDarkMode = (value: boolean) => {
    setMode(value ? "dark" : "light");
  };

  const value = useMemo<ThemeContextValue>(
    () => ({
      mode,
      isDarkMode: mode === "dark",
      theme: colors[mode],
      setMode,
      toggleDarkMode,
    }),
    [mode]
  );

  if (!isLoaded) {
    return null;
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
