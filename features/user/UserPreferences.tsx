import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput } from "react-native";
import Checkbox from "expo-checkbox";
import { colors } from "@/constants/colors";
import { usePreferencesStore } from "@/hooks/usePreferencesStore";
import { createUserPreferences, updateUserPreferences } from "@/features/user/api";
import { useSupabase } from "@/lib/SupabaseProvider";


type Props = {
  visible: boolean;
  onClose: () => void;
  onApply: (preferences: {
    selectedPlatforms: string[];
    selectedGenres: string[];
    weeklyPlayTime: string;
  }) => void;
};

const AVAILABLE_PLATFORMS = ["PC", "PlayStation", "Xbox", "Nintendo", "Mobile", "Retro/Arcade"];
const AVAILABLE_GENRES = ["Pinball","Adventure","Indie","Arcade","Visual Novel","Card & Board","MOBA","Point-and-click",
  "Fighting","Shooter","Music","Platform","Puzzle","Racing","RTS","RPG","Simulator",
  "Sport","Strategy","Turn-based","Tactical","Hack and slash","Beat 'em up","Quiz/Trivia"];

export default function UserPreferences({ visible, onClose, onApply }: Props) {
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [weeklyPlayTime, setWeeklyPlayTime] = useState<string>("");
  const { session } = useSupabase();

  const { platforms, genres, gamingHours, setPlatforms, setGenres, setGamingHours } = usePreferencesStore();

  if (!visible) return null;

  const toggleSelection = (
    value: string,
    list: string[],
    setter: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    if (list.includes(value)) {
      setter(list.filter((item) => item !== value));
    } else {
      setter([...list, value]);
    }
  };

  const handleApply = async () => {
    try {
      const preferencesExist =
        platforms.length > 0 || genres.length > 0 || gamingHours > 0;

      const payload = {
        gamingHours: Number(weeklyPlayTime) || 0,
        genres: selectedGenres,
        platforms: selectedPlatforms,
      };

      const response = preferencesExist
        ? await updateUserPreferences(session?.access_token ?? "", payload)
        : await createUserPreferences(session?.access_token ?? "", payload);

      console.log("Preferencias guardadas:", response);

      setPlatforms(selectedPlatforms);
      setGenres(selectedGenres);
      setGamingHours(Number(weeklyPlayTime) || 0);

      onApply({ selectedPlatforms, selectedGenres, weeklyPlayTime });
      onClose();
    } catch (error) {
      console.error("Error al guardar preferencias:", error);
    }
  };

  return (
    <View style={styles.overlay}>
      <View style={styles.panel}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <Text style={styles.title}>User Preferences</Text>
          <Pressable onPress={onClose} style={styles.close}>
            <Text style={styles.closeText}>Close</Text>
          </Pressable>
        </View>

        <View style={styles.divider} />
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.sectionTitle}>Platforms</Text>
          <View style={styles.checkboxContainer}>
            {AVAILABLE_PLATFORMS.map((platform) => (
              <Pressable
                key={platform}
                style={styles.checkboxRow}
                onPress={() => toggleSelection(platform, selectedPlatforms, setSelectedPlatforms)}
              >
                <Checkbox
                  value={selectedPlatforms.includes(platform)}
                  onValueChange={() => toggleSelection(platform, selectedPlatforms, setSelectedPlatforms)}
                  color={
                    selectedPlatforms.includes(platform)
                      ? colors.dark.accent
                      : colors.dark.textPrimary
                  }
                />
                <Text style={styles.checkboxLabel}>{platform}</Text>
              </Pressable>
            ))}
          </View>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>Genres</Text>
          <View style={styles.checkboxContainer}>
            {AVAILABLE_GENRES.map((genre) => (
              <Pressable
                key={genre}
                style={styles.checkboxRow}
                onPress={() => toggleSelection(genre, selectedGenres, setSelectedGenres)}
              >
                <Checkbox
                  value={selectedGenres.includes(genre)}
                  onValueChange={() => toggleSelection(genre, selectedGenres, setSelectedGenres)}
                  color={
                    selectedGenres.includes(genre)
                      ? colors.dark.accent
                      : colors.dark.textPrimary
                  }
                />
                <Text style={styles.checkboxLabel}>{genre}</Text>
              </Pressable>
            ))}
          </View>

          <Text style={styles.sectionTitle}>Weekly Play Time (hours)</Text>
          <TextInput
            style={styles.input}
            value={weeklyPlayTime}
            onChangeText={setWeeklyPlayTime}
            keyboardType="numeric"
            placeholder="e.g. 10"
            placeholderTextColor={colors.dark.textSecondary}
          />

          <View style={styles.buttonRow}>
            <Pressable onPress={onClose} style={[styles.button, styles.cancelButton]}>
              <Text style={styles.buttonText}>Cancel</Text>
            </Pressable>
            <Pressable onPress={handleApply} style={[styles.button, styles.applyButton]}>
              <Text style={styles.buttonText}>Apply</Text>
            </Pressable>
          </View>
        </ScrollView>
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
  scrollContent: {
    paddingBottom: 16,
  },
  close: {
    alignSelf: "flex-start",
    padding: 8,
    marginBottom: 8,
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
    textAlign: "left",
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
    marginVertical: 4,
    marginRight: "5%",
  },
  checkboxLabel: {
    marginLeft: 8,
    fontSize: 13,
    color: colors.dark.textPrimary,
  },
  input: {
    backgroundColor: colors.dark.surface,
    borderRadius: 8,
    padding: 8,
    fontSize: 14,
    marginTop: 6,
    marginBottom: 12,
    color: colors.dark.textPrimary,
  },
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
  cancelButton: {
    backgroundColor: colors.dark.border,
  },
  applyButton: {
    backgroundColor: colors.dark.accent,
  },
  buttonText: {
    color: colors.dark.textPrimary,
    fontWeight: "700",
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.06)",
    marginVertical: 5,
  },
});
