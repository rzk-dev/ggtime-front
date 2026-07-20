import React, { useState } from "react";
import { View, Text, StyleSheet, Modal, Pressable, TouchableWithoutFeedback, Switch } from "react-native";
import { useTheme } from "@/src/shared/ThemeProvider";

type Language = "en" | "es";

type Props = {
  visible: boolean;
  onClose: () => void;
  language?: Language;
  onChangeLanguage?: (lang: Language) => void;
};

const LANGUAGES: { code: Language; label: string }[] = [
  { code: "en", label: "English" },
  { code: "es", label: "Español" },
];

export default function SettingsModal({
  visible,
  onClose,
  language = "en",
  onChangeLanguage,
}: Props) {
  const { theme, isDarkMode, toggleDarkMode } = useTheme();
  const styles = createStyles(theme);

  const [localLanguage, setLocalLanguage] = useState<Language>(language);
  const currentLanguage = onChangeLanguage ? language : localLanguage;

  const handleSelectLanguage = (lang: Language) => {
    if (onChangeLanguage) {
      onChangeLanguage(lang);
    } else {
      setLocalLanguage(lang);
    }
  };

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop} />
      </TouchableWithoutFeedback>

      <View style={styles.centerWrap} pointerEvents="box-none">
        <View style={styles.panel}>
          <View style={styles.headerRow}>
            <Text style={styles.title}>Settings</Text>
            <Pressable
              onPress={onClose}
              style={({ pressed }) => [styles.closeIconButton, pressed && { opacity: 0.6 }]}
              hitSlop={10}
            >
              <Text style={styles.closeIconText}>✕</Text>
            </Pressable>
          </View>
          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>Language</Text>
          <View style={styles.languageOptions}>
            {LANGUAGES.map((lang) => {
              const selected = currentLanguage === lang.code;
              return (
                <Pressable
                  key={lang.code}
                  style={[styles.languageOption, selected && styles.languageOptionSelected]}
                  onPress={() => handleSelectLanguage(lang.code)}
                >
                  <Text
                    style={[
                      styles.languageOptionText,
                      selected && styles.languageOptionTextSelected,
                    ]}
                  >
                    {lang.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <View style={styles.divider} />

          <View style={styles.themeRow}>
            <Text style={styles.sectionTitle}>Dark Mode</Text>
            <Switch
              value={isDarkMode}
              onValueChange={toggleDarkMode}
              trackColor={{ false: "#767577", true: theme.primary }}
              thumbColor="#fff"
            />
          </View>

          <Pressable style={styles.doneButton} onPress={onClose}>
            <Text style={styles.doneButtonText}>Done</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const createStyles = (theme: any) =>
  StyleSheet.create({
    backdrop: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: theme.overlay,
    },
    centerWrap: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 24,
    },
    panel: {
      backgroundColor: theme.card,
      borderRadius: 16,
      padding: 20,
      width: "100%",
    },
    headerRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 12,
    },
    title: {
      flex: 1,
      fontSize: 18,
      fontWeight: "700",
      color: theme.text,
      textAlign: "center",
      marginLeft: 28,
    },
    closeIconButton: {
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: theme.cardElevated,
      alignItems: "center",
      justifyContent: "center",
    },
    closeIconText: {
      color: theme.text,
      fontSize: 14,
      fontWeight: "700",
      lineHeight: 14,
    },
    divider: {
      height: 1,
      backgroundColor: theme.border,
      marginVertical: 14,
    },
    sectionTitle: {
      fontSize: 14,
      fontWeight: "700",
      color: theme.text,
    },
    languageOptions: {
      flexDirection: "row",
      gap: 10,
      marginTop: 12,
    },
    languageOption: {
      flex: 1,
      paddingVertical: 10,
      borderRadius: 10,
      alignItems: "center",
      backgroundColor: theme.cardElevated,
      borderWidth: 1,
      borderColor: "transparent",
    },
    languageOptionSelected: {
      backgroundColor: theme.primaryMuted,
      borderColor: theme.primary,
    },
    languageOptionText: {
      color: theme.text,
      fontSize: 14,
      fontWeight: "600",
      opacity: 0.7,
    },
    languageOptionTextSelected: {
      opacity: 1,
      color: theme.primary,
    },
    themeRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    doneButton: {
      marginTop: 20,
      backgroundColor: theme.primary,
      paddingVertical: 12,
      borderRadius: 10,
      alignItems: "center",
    },
    doneButtonText: {
      color: theme.onPrimary,
      fontWeight: "700",
      fontSize: 15,
    },
  });
