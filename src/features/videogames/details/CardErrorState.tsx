import React from "react";
import { View, Text, Pressable, StyleSheet, Dimensions } from "react-native";
import { useTheme } from "@/src/shared/ThemeProvider";

const SCREEN_HEIGHT = Dimensions.get("window").height;

interface CardErrorStateProps {
  onRetry: () => void;
  onClose: () => void;
}

export default function CardErrorState({ onRetry, onClose }: CardErrorStateProps) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.outerWrap}>
      <View style={[styles.card, { height: SCREEN_HEIGHT * 0.4 }]}>
        <Pressable onPress={onClose} style={styles.closeButton} hitSlop={10}>
          <Text style={styles.closeButtonText}>✕</Text>
        </Pressable>

        <Text style={styles.icon}>⚠️</Text>
        <Text style={styles.title}>No pudimos cargar este juego</Text>
        <Text style={styles.subtitle}>Revisa tu conexión e inténtalo de nuevo.</Text>

        <Pressable
          style={({ pressed }) => [styles.retryButton, pressed && { opacity: 0.75 }]}
          onPress={onRetry}
        >
          <Text style={styles.retryText}>Reintentar</Text>
        </Pressable>
      </View>
    </View>
  );
}

const createStyles = (theme: any) =>
  StyleSheet.create({
    outerWrap: {
      flex: 1,
      justifyContent: "center",
      padding: 24,
      backgroundColor: "transparent",
    },
    card: {
      backgroundColor: theme.card,
      borderRadius: 14,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 24,
    },
    closeButton: {
      position: "absolute",
      top: 10,
      right: 10,
      backgroundColor: theme.cardElevated,
      width: 32,
      height: 32,
      borderRadius: 16,
      justifyContent: "center",
      alignItems: "center",
    },
    closeButtonText: {
      color: theme.text,
      fontSize: 16,
      fontWeight: "700",
      lineHeight: 16,
    },
    icon: {
      fontSize: 36,
      marginBottom: 12,
    },
    title: {
      color: theme.text,
      fontSize: 15,
      fontWeight: "700",
      textAlign: "center",
      marginBottom: 6,
    },
    subtitle: {
      color: theme.textSecondary,
      fontSize: 12,
      textAlign: "center",
      marginBottom: 18,
      lineHeight: 17,
    },
    retryButton: {
      backgroundColor: theme.primary,
      paddingVertical: 10,
      paddingHorizontal: 22,
      borderRadius: 16,
    },
    retryText: {
      color: theme.onPrimary,
      fontWeight: "700",
      fontSize: 13,
    },
  });
