import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  Image,
} from "react-native";
import Checkbox from "expo-checkbox";
import { colors } from "@/constants/colors";
import { AVAILABLE_GENRES, LANGUAGE_GROUPS, PLATFORM_CATEGORIES } from "./constants";
import { useUserPreferences } from "./useUserPreferences";
import type { OnApplyPayload } from "./types";

// --- Props -------------------------------------------------------------------
type Props = {
  visible: boolean;
  onClose: () => void;
  onApply: (preferences: OnApplyPayload) => void;
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function UserPreferences({ visible, onClose, onApply }: Props) {
  const {
    selectedPlatformCategories,
    selectedGenres,
    selectedLanguageGroups,
    weeklyPlayTime,
    isLoading,
    setWeeklyPlayTime,
    togglePlatformCategory,
    toggleGenre,
    toggleLanguageGroup,
    handleApply,
  } = useUserPreferences(onApply, onClose);

  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <View style={styles.panel}>

        {/* ── Header ── */}
        <View style={styles.header}>
          <Text style={styles.title}>User Preferences</Text>
          <Pressable onPress={onClose} style={styles.close}>
            <Text style={styles.closeText}>Close</Text>
          </Pressable>
        </View>

        <View style={styles.divider} />

        <ScrollView contentContainerStyle={styles.scrollContent}>

          {/* ── Platforms ── */}
          <Text style={styles.sectionTitle}>Platforms</Text>
          <View style={styles.platformRow}>
            {PLATFORM_CATEGORIES.map((cat) => {
              const isSelected = selectedPlatformCategories.includes(cat.label);
              return (
                <Pressable
                  key={cat.label}
                  style={[styles.platformCard, isSelected && styles.platformCardSelected]}
                  onPress={() => togglePlatformCategory(cat.label)}
                >
                  <Image source={cat.icon} style={styles.platformIcon} />
                  <Text style={[styles.platformLabel, isSelected && styles.platformLabelSelected]}>
                    {cat.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <View style={styles.divider} />

          {/* ── Genres ── */}
          <Text style={styles.sectionTitle}>Genres</Text>
          <View style={styles.checkboxContainer}>
            {AVAILABLE_GENRES.map((genre) => {
              const checked = selectedGenres.some((g) => g.id === genre.id);
              return (
                <Pressable
                  key={genre.id}
                  style={styles.checkboxRow}
                  onPress={() => toggleGenre(genre)}
                >
                  <Checkbox
                    value={checked}
                    onValueChange={() => toggleGenre(genre)}
                    color={checked ? colors.dark.accent : colors.dark.textPrimary}
                  />
                  <Text style={styles.checkboxLabel}>{genre.name}</Text>
                </Pressable>
              );
            })}
          </View>

          <View style={styles.divider} />

          {/* ── Languages (grouped) ── */}
          <Text style={styles.sectionTitle}>Languages</Text>
          <View style={styles.platformRow}>
            {LANGUAGE_GROUPS.map((group) => {
              const isSelected = selectedLanguageGroups.includes(group.label);
              return (
                <Pressable
                  key={group.label}
                  style={[styles.langCard, isSelected && styles.platformCardSelected]}
                  onPress={() => toggleLanguageGroup(group.label)}
                >
                  <Text style={[styles.platformLabel, isSelected && styles.platformLabelSelected]}>
                    {group.label}
                  </Text>
                  {group.variants.length > 1 && (
                    <Text style={styles.variantHint}>{group.variants.length} variants</Text>
                  )}
                </Pressable>
              );
            })}
          </View>

          <View style={styles.divider} />

          {/* ── Weekly play time ── */}
          <Text style={styles.sectionTitle}>Weekly Play Time (hours)</Text>
          <TextInput
            style={styles.input}
            value={weeklyPlayTime}
            onChangeText={setWeeklyPlayTime}
            keyboardType="numeric"
            placeholder="e.g. 10"
            placeholderTextColor={colors.dark.textSecondary}
          />

          {/* ── Actions ── */}
          <View style={styles.buttonRow}>
            <Pressable onPress={onClose} style={[styles.button, styles.cancelButton]}>
              <Text style={styles.buttonText}>Cancel</Text>
            </Pressable>
            <Pressable
              onPress={handleApply}
              disabled={isLoading}
              style={[styles.button, styles.applyButton, isLoading && styles.buttonDisabled]}
            >
              <Text style={styles.buttonText}>{isLoading ? "Loading…" : "Apply"}</Text>
            </Pressable>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
  panel: {
    backgroundColor: colors.dark.card,
    borderRadius: 16,
    padding: 16,
    width: "85%",
    maxHeight: "80%",
    elevation: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  scrollContent: { paddingBottom: 16 },
  close: {
    padding: 8,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 15,
  },
  closeText: {
    color: colors.dark.textPrimary,
    fontSize: 14,
    fontWeight: "500",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.dark.textPrimary,
    marginBottom: 12,
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.dark.textPrimary,
    marginTop: 16,
    marginBottom: 8,
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.06)",
    marginVertical: 5,
  },
  // Platform / Language cards
  platformRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 8,
  },
  platformCard: {
    flex: 1,
    minWidth: 70,
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "transparent",
  },
  langCard: {
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "transparent",
  },
  platformCardSelected: {
    borderColor: colors.dark.accent,
    backgroundColor: "rgba(255,255,255,0.10)",
  },
  platformIcon: {
    width: 32,
    height: 32,
    resizeMode: "contain",
    marginBottom: 4,
  },
  platformLabel: {
    fontSize: 11,
    color: colors.dark.textSecondary,
    fontWeight: "500",
  },
  platformLabelSelected: {
    color: colors.dark.accent,
    fontWeight: "700",
  },
  variantHint: {
    fontSize: 9,
    color: colors.dark.textSecondary,
    marginTop: 2,
  },
  // Checkboxes
  checkboxContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 12,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "45%",
    marginVertical: 4,
    marginRight: "5%",
  },
  checkboxLabel: {
    marginLeft: 8,
    fontSize: 13,
    color: colors.dark.textPrimary,
  },
  // Input
  input: {
    backgroundColor: colors.dark.surface,
    borderRadius: 8,
    padding: 8,
    fontSize: 14,
    marginTop: 6,
    marginBottom: 12,
    color: colors.dark.textPrimary,
  },
  // Buttons
  buttonRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 8,
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginLeft: 8,
  },
  cancelButton: { backgroundColor: colors.dark.border },
  applyButton:  { backgroundColor: colors.dark.accent },
  buttonDisabled: { opacity: 0.4 },
  buttonText: {
    color: colors.dark.textPrimary,
    fontWeight: "700",
  },
});
