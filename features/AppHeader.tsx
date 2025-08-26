import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { colors } from "@/constants/colors";
import HeaderUserIcon from "./HeaderUserIcon";
interface AppHeaderProps {
  title?: string;
  onUserPress?: () => void;
}

export default function AppHeader({ title, onUserPress }: AppHeaderProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>

      <View style={styles.buttons}>
        <HeaderUserIcon onPress={onUserPress} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.dark.card,
    paddingHorizontal: 12,
    paddingTop: 14, // separa del notch en iPhone
    paddingBottom: 10,
    elevation: 5, // sombra Android
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    position: "relative",
    zIndex: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.dark.text,
  },
  buttons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
});
