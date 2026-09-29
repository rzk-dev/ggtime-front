import { View, ActivityIndicator } from "react-native";
import { colors } from "@/src/shared/constants/colors";

export function GameDetailsLoader() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.dark.overlay,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ActivityIndicator size="large" color={colors.dark.tint} />
    </View>
  );

}
