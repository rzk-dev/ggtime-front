import React from "react";
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput } from "react-native";
import Checkbox from "expo-checkbox";
import { colors } from "@/src/shared/constants/colors";
import { useSupabase } from "@/src/lib/SupabaseProvider";
import { queryClient } from "@/src/lib/queryClient";
import { usePreferencesForm } from "../hooks/usePreferencesForm";
import LogoutButton from "@/src/shared/components/LogoutButton";

type Props = {
  onClose: () => void;
  onApply: (preferences: {
    selectedPlatforms: number[];
    selectedGenres: number[];
    weeklyPlayTime: string;
  }) => void;
};

export default function UserPreferences({ onClose, onApply }: Props) {
  const { signout } = useSupabase();
  const form = usePreferencesForm();

  const handleLogout = async () => {
    queryClient.clear();
    await signout();
  };

  const handleApply = async () => {
    await form.save();

    onApply({
      selectedPlatforms: form.selectedPlatforms,
      selectedGenres: form.selectedGenres,
      weeklyPlayTime: form.weeklyGamingHours,
    });

    onClose();
  };

  return (
    <View style={styles.overlay}>
      <View style={styles.panel}>
        {/* Cabecera */}
        <Text style={styles.title}>User Preferences</Text>
        <View style={styles.divider} />

        {/* Contenido */}
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.sectionTitle}>Platforms</Text>
          <View style={styles.checkboxContainer}>
            {form.platforms.map((platform) => {
              const checked = form.selectedPlatforms.includes(platform.id);
              return (
                <Pressable
                  key={platform.id}
                  style={styles.checkboxRow}
                  onPress={() => form.togglePlatform(platform.id)}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked }}
                  accessibilityLabel={platform.name}
                >
                  <Checkbox
                    value={checked}
                    onValueChange={() => form.togglePlatform(platform.id)}
                    color={checked ? colors.dark.addButton : colors.dark.textMuted}
                  />
                  <Text style={styles.checkboxLabel}>{platform.name}</Text>
                </Pressable>
              );
            })}
          </View>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>Genres</Text>
          <View style={styles.checkboxContainer}>
            {form.genres.map((genre) => {
              const checked = form.selectedGenres.includes(genre.id);
              return (
                <Pressable
                  key={genre.id}
                  style={styles.checkboxRow}
                  onPress={() => form.toggleGenre(genre.id)}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked }}
                  accessibilityLabel={genre.name}
                >
                  <Checkbox
                    value={checked}
                    onValueChange={() => form.toggleGenre(genre.id)}
                    color={checked ? colors.dark.addButton : colors.dark.textMuted}
                  />
                  <Text style={styles.checkboxLabel}>{genre.name}</Text>
                </Pressable>
              );
            })}
          </View>

          <Text style={styles.sectionTitle}>Weekly Gaming Hours</Text>
          <TextInput
            style={styles.input}
            value={form.weeklyGamingHours}
            onChangeText={form.setWeeklyGamingHours}
            keyboardType="numeric"
            placeholder="e.g. 10"
            placeholderTextColor={colors.dark.textMuted}
          />

          {/* Zona de cuenta, separada de las preferencias */}
          <View style={styles.accountSection}>
            <View style={styles.divider} />
            <LogoutButton onLogout={handleLogout} style={styles.logout} />
          </View>
        </ScrollView>

        {/* Footer fijo con las acciones principales */}
        <View style={styles.footer}>
          <Pressable onPress={onClose} style={[styles.button, styles.cancelButton]}>
            <Text style={styles.buttonText}>Cancel</Text>
          </Pressable>
          <Pressable onPress={handleApply} style={[styles.button, styles.applyButton]}>
            <Text style={[styles.buttonText, styles.applyButtonText]}>Apply</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.dark.overlay,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
  panel: {
    backgroundColor: colors.dark.card,
    borderWidth: 1,
    borderColor: colors.dark.border,
    borderRadius: 16,
    padding: 16,
    width: "85%",
    maxWidth: 480,
    maxHeight: "80%",
    elevation: 10,
  },

  // Cabecera
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.dark.text,
    marginBottom: 8,
  },

  // Contenido
  scroll: {
    flexShrink: 1,
  },
  scrollContent: {
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.dark.text,
    marginTop: 16,
    marginBottom: 8,
  },
  checkboxContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 12,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "45%",
    marginVertical: 2,
    marginRight: "5%",
    paddingVertical: 6,
  },
  checkboxLabel: {
    marginLeft: 8,
    fontSize: 13,
    color: colors.dark.textSecondary,
  },
  input: {
    backgroundColor: colors.dark.backgroundElevated,
    borderWidth: 1,
    borderColor: colors.dark.border,
    color: colors.dark.text,
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    marginTop: 6,
    marginBottom: 12,
  },
  divider: {
    height: 1,
    backgroundColor: colors.dark.border,
    marginVertical: 5,
  },

  // Cuenta
  accountSection: {
    marginTop: 20,
  },
  logout: {
    marginTop: 16,
  },

  // Footer
  footer: {
    flexDirection: "row",
    gap: 12,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.dark.border,
  },
  button: {
    flex: 1,
    minHeight: 44,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: {
    backgroundColor: colors.dark.cardElevated,
    borderWidth: 1,
    borderColor: colors.dark.border,
  },
  applyButton: {
    backgroundColor: colors.dark.addButton,
  },
  buttonText: {
    color: colors.dark.text,
    fontWeight: "700",
    fontSize: 14,
  },
  applyButtonText: {
    color: colors.dark.onPrimary,
  },
});