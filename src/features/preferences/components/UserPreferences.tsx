import React from "react";
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput, } from "react-native";
import Checkbox from "expo-checkbox";
import { colors } from "@/src/shared/constants/colors";
import { useSupabase } from "@/src/lib/SupabaseProvider";
import { queryClient } from "@/src/lib/queryClient";
import { usePreferencesForm } from "../hooks/usePreferencesForm";

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
  const form = usePreferencesForm()


  const handleLogout = () => {
    queryClient.clear();
    signout();
  };

  const handleApply = async () => {
    await form.save()


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
            {form.platforms.map((platform) => (
              <View style={styles.checkboxRow} key={platform.id}>
                <Checkbox
                  value={form.selectedPlatforms.includes(platform.id)}
                  onValueChange={() => form.togglePlatform(platform.id)
                  }
                  color={
                    form.selectedPlatforms.includes(platform.id)
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
            {form.genres.map((genre) => (
              <View style={styles.checkboxRow} key={genre.id}>
                <Checkbox
                  value={form.selectedGenres.includes(genre.id)}
                  onValueChange={() =>
                    form.toggleGenre(genre.id)
                  }
                  color={
                    form.selectedGenres.includes(genre.id)
                      ? colors.dark.addButton
                      : colors.dark.text
                  }
                />
                <Text style={styles.checkboxLabel}>{genre.name}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.sectionTitle}>Weekly Gaming Hours</Text>
          <TextInput
            style={styles.input}
            value={form.weeklyGamingHours}
            onChangeText={form.setWeeklyGamingHours}
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
          <Pressable onPress={handleLogout} style={styles.logoutButton}>
            <Text style={styles.logoutText}>Logout</Text>
          </Pressable>
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
  logoutButton: {
    marginTop: 12,
    alignSelf: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e74c3c",
  },
  logoutText: {
    color: "#e74c3c",
    fontWeight: "700",
    fontSize: 14,
  },
});
