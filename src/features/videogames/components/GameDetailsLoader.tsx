import { View, ActivityIndicator } from "react-native";

export function GameDetailsLoader() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "rgba(25,25,25,0.5)",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ActivityIndicator size="large" color="white" />
    </View>
  );

}
