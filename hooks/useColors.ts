import { useColorScheme } from "react-native";
import { colors } from "@/constants/colors";

export function useColors() {
  const colorScheme = useColorScheme();
  return colorScheme === "light" ? colors.light : colors.dark;
}
