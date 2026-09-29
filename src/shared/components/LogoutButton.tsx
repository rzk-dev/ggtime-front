import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  ViewStyle,
} from "react-native";
import Toast from "react-native-toast-message";
import { colors } from "@/src/shared/constants/colors";

type Props = {
  onLogout: () => void | Promise<void>;
  style?: StyleProp<ViewStyle>;
};

export default function LogoutButton({ onLogout, style }: Props) {
  const [loading, setLoading] = useState<boolean>(false);

  const doLogout = async () => {
    if (loading) return;
    setLoading(true);
    try {
      await onLogout();
    } catch (e: any) {
      Toast.show({
        type: "error",
        text1: "Error, please contact with developers.",
        text2: e?.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const confirmLogout = () => {
    Alert.alert(
      "Log out",
      "Are you sure you want to log out?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Cerrar sesión", style: "destructive", onPress: doLogout },
      ],
      { cancelable: true }
    );
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        pressed && styles.pressed,
        loading && styles.disabled,
        style,
      ]}
      onPress={confirmLogout}
      disabled={loading}
      hitSlop={8}
      accessibilityRole="button"
      accessibilityLabel="Log out"
      accessibilityState={{ disabled: loading, busy: loading }}
    >
      {loading ? (
        <ActivityIndicator size="small" color={colors.dark.danger} />
      ) : (
        <Text style={styles.text}>Log out</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignSelf: "center",
    minHeight: 44,
    minWidth: 160,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.dark.danger,
    alignItems: "center",
    justifyContent: "center",
  },
  pressed: {
    backgroundColor: "rgba(255,107,107,0.12)",
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    color: colors.dark.danger,
    fontWeight: "700",
    fontSize: 14,
  },
});