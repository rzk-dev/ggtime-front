import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { useTheme } from "@/src/shared/ThemeProvider";
import HeaderUserIcon from "../user/HeaderUserIcon";
import { useSupabase } from "@/src/lib/SupabaseProvider";
interface AppHeaderProps {
  title?: string;
  onUserPress?: () => void;
}

export default function AppHeader({ title, onUserPress }: AppHeaderProps) {
  const { user } = useSupabase();
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const email = user?.email ? user.email.split("@")[0] : "Unknown";

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {email} {title}
      </Text>

      <View style={styles.buttons}>
        <HeaderUserIcon onPress={onUserPress} />
      </View>
    </View>
  );
}

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      width: "100%",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: theme.card,
      paddingHorizontal: 12,
      paddingTop: 14,
      paddingBottom: 10,
      elevation: 5,
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
      color: theme.text,
    },
    buttons: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
  });
