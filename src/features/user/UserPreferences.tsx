import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput, } from "react-native";
import Checkbox from "expo-checkbox";
import { colors } from "@/src/shared/constants/colors";
import { fetchPlatforms } from "@/src/lib/api/platformApi";
import { useQuery } from "@tanstack/react-query";
import { useSupabase } from "@/src/lib/SupabaseProvider";
import { fetchGenres } from "@/src/lib/api/genreApi";
import { fetchLanguages } from "@/src/lib/api/languageApi";
import { UserPreference } from "@/src/shared/models/users/userPreferences";
import { createUserPreferences, fetchUserPreferences, updateUserPreferences } from "@/src/lib/api/userApi";
import { useUserStore } from "@/src/shared/hooks/useUserStore";

type Props = {
  visible: boolean;
  onClose: () => void;
  onApply: (preferences: {
    selectedPlatforms: number[];
    selectedGenres: number[];
    weeklyPlayTime: string;
  }) => void;
};

export default function UserPreferences({ visible, onClose, onApply }: Props) {
  const [selectedPlatforms, setSelectedPlatforms] = useState<number[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
  const [weeklyPlayTime, setWeeklyPlayTime] = useState<string>("");
  const { session } = useSupabase();
  const token = session?.access_token ?? "";
  const availablePlatforms = useQuery({queryKey: ["platforms"],  queryFn: () => fetchPlatforms(token)});
  const availableGenres = useQuery({queryKey: ["genres"],  queryFn: () => fetchGenres(token)});
  const availableLanguages = useQuery({queryKey: ["languages"],  queryFn: () => fetchLanguages(token)});
  const userPreferencesId = useUserStore.getState().preferences?.id ?? null;


  const toggleSelection = (
    value: number,
    list: number[],
    setter: React.Dispatch<React.SetStateAction<number[]>>
  ) => {
    if (list.includes(value)) {
      setter(list.filter((item) => item !== value));
    } else {
      setter([...list, value]);
    }
  };

  const handleApply = () => {
    const payload: UserPreference = {
        id: userPreferencesId,
        gamingHours: Number(weeklyPlayTime),
        genres: selectedGenres.map((id) => availableGenres.data?.find((g) => g.id === id)!),
        platforms: selectedPlatforms.map((id) => availablePlatforms.data?.find((p) => p.id === id)!),
        languages: [],
      };

    if(userPreferencesId != null){
      updateUserPreferences(token, payload.id, payload.gamingHours, payload.genres, payload.platforms, payload.languages);
      console.log("Updating preferences with payload:", payload);
    } else {
      createUserPreferences(token, payload.gamingHours, payload.genres, payload.platforms, payload.languages);
      console.log("Creating preferences with payload:", payload);
    }

    onApply({ selectedPlatforms, selectedGenres, weeklyPlayTime });
    onClose();
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
            {availablePlatforms.data?.map((platform) => (
              <View style={styles.checkboxRow} key={platform.id}>
                <Checkbox
                  value={selectedPlatforms.includes(platform.id)}
                  onValueChange={() =>
                    toggleSelection(platform.id, selectedPlatforms, setSelectedPlatforms)
                  }
                  color={
                    selectedPlatforms.includes(platform.id)
                      ? colors.dark.addButton
                      : colors.dark.text
                  }
                />
                <Text style={styles.checkboxLabel}>{platform.name}</Text>
              </View>
            ))}
          </View>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>Genres</Text>
          <View style={styles.checkboxContainer}>
            {availableGenres.data?.map((genre) => (
              <View style={styles.checkboxRow} key={genre.id}>
                <Checkbox
                  value={selectedGenres.includes(genre.id)}
                  onValueChange={() =>
                    toggleSelection(genre.id, selectedGenres, setSelectedGenres)
                  }
                  color={
                    selectedGenres.includes(genre.id)
                      ? colors.dark.addButton
                      : colors.dark.text
                  }
                />
                <Text style={styles.checkboxLabel}>{genre.name}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.sectionTitle}>Weekly Play Time (hours)</Text>
          <TextInput
            style={styles.input}
            value={weeklyPlayTime}
            onChangeText={setWeeklyPlayTime}
            keyboardType="numeric"
            placeholder="e.g. 10"
            placeholderTextColor="#888"
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
    backgroundColor: "rgba(0,0,0,0.15)",
    borderRadius: 15,
    
  },
  closeText: {
    color: colors.dark.text,
    fontSize: 14,
    fontWeight: "500",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.dark.text,
    marginBottom: 12,
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.dark.text,
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
    color: colors.dark.text,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 8,
    fontSize: 14,
    marginTop: 6,
    marginBottom: 12,
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
    backgroundColor: "#666",
  },
  applyButton: {
    backgroundColor: colors.dark.addButton,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.06)",
    marginVertical: 5,
  },
});
