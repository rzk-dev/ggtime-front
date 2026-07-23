import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  ActivityIndicator,
} from "react-native";
import Checkbox from "expo-checkbox";
import { colors } from "@/src/shared/constants/colors";
import { fetchPlatforms } from "@/src/lib/api/platformApi";
import { useQuery } from "@tanstack/react-query";
import { fetchGenres } from "@/src/lib/api/genreApi";
import { UserPreference } from "@/src/shared/models/users/userPreferences";
import { createUserPreferences, fetchUserPreferences, updateUserPreferences } from "@/src/lib/api/userApi";
import { queryClient } from "@/src/lib/queryClient";
import { GamePlatforms } from "@/src/shared/models/videogames/platform";
import { Genre } from "@/src/shared/models/videogames/genres";

type Props = {
  visible: boolean;
  onClose: () => void;
  onApply: (preferences: {
    selectedPlatforms: number[];
    selectedGenres: number[];
    weeklyPlayTime: string;
  }) => void;
};

// ---- Agrupación de plataformas por compañía --------------------------------

type PlatformCompany = "SONY" | "MICROSOFT" | "NINTENDO" | "PC" | "MOBILE";

const COMPANY_ORDER: PlatformCompany[] = ["SONY", "MICROSOFT", "NINTENDO", "PC", "MOBILE"];

const COMPANY_LABELS: Record<PlatformCompany, string> = {
  SONY: "PlayStation",
  MICROSOFT: "Xbox",
  NINTENDO: "Nintendo",
  PC: "PC",
  MOBILE: "Mobile",
};

// Reglas de matching por nombre. Se evalúan en orden; la primera que matchea gana.
// Se usa .toLowerCase() + regex de palabra completa para evitar falsos positivos
// (ej. que "One" de "Xbox One" no choque con otra cosa).
const COMPANY_RULES: { company: PlatformCompany; patterns: RegExp[] }[] = [
  {
    company: "SONY",
    patterns: [/playstation/i, /\bps\s?[1-5]\b/i, /\bpsp\b/i, /\bps\s?vita\b/i, /\bvita\b/i],
  },
  {
    company: "MICROSOFT",
    patterns: [/xbox/i],
  },
  {
    company: "NINTENDO",
    patterns: [
      /nintendo/i,
      /\bwii\b/i,
      /\bwii\s?u\b/i,
      /\bswitch\b/i,
      /\b3ds\b/i,
      /\bnds\b/i,
      /\bds\b/i,
      /\bgame\s?boy\b/i,
      /\bgamecube\b/i,
      /\bsnes\b/i,
      /\bnes\b/i,
    ],
  },
  {
    company: "MOBILE",
    patterns: [
      /\bios\b/i,
      /\bandroid\b/i,
      /\bmobile\b/i,
      /iphone/i,
      /ipad/i,
      /\bwindows\s?phone\b/i,
    ],
  },
  {
    company: "PC",
    patterns: [/\bpc\b/i, /windows/i, /mac\b/i, /linux/i, /steam/i],
  },
];

function getPlatformCompany(platformName: string): PlatformCompany {
  for (const rule of COMPANY_RULES) {
    if (rule.patterns.some((pattern) => pattern.test(platformName))) {
      return rule.company;
    }
  }
  // Fallback: cualquier plataforma no reconocida cae en PC para no perderla del listado.
  return "PC";
}

function groupPlatformsByCompany(
  platforms: GamePlatforms[] | undefined
): Record<PlatformCompany, GamePlatforms[]> {
  const grouped: Record<PlatformCompany, GamePlatforms[]> = {
    SONY: [],
    MICROSOFT: [],
    NINTENDO: [],
    PC: [],
    MOBILE: [],
  };

  if (!platforms) return grouped;

  for (const platform of platforms) {
    const company = getPlatformCompany(platform.name);
    grouped[company].push(platform);
  }

  return grouped;
}

// -----------------------------------------------------------------------------

export default function UserPreferences({ onClose, onApply }: Props) {
  const availablePlatforms = useQuery({ queryKey: ["platforms"], queryFn: () => fetchPlatforms() });
  const availableGenres = useQuery({ queryKey: ["genres"], queryFn: () => fetchGenres() });
  const userPreferencesQuery = useQuery({ queryKey: ["userPreferences"], queryFn: () => fetchUserPreferences() });

  const [selectedPlatforms, setSelectedPlatforms] = useState<number[]>(
    userPreferencesQuery.data?.platforms.map((p: GamePlatforms) => p.id) ?? []
  );
  const [selectedGenres, setSelectedGenres] = useState<number[]>(
    userPreferencesQuery.data?.genres.map((g: Genre) => g.id) ?? []
  );
  const [weeklyPlayTime, setWeeklyPlayTime] = useState<string>(
    userPreferencesQuery.data?.gamingHours.toString() ?? ""
  );

  const [playTimeError, setPlayTimeError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const [collapsedCompanies, setCollapsedCompanies] = useState<Record<PlatformCompany, boolean>>(
    {} as Record<PlatformCompany, boolean>
  );

  const toggleCompanyCollapsed = (company: PlatformCompany) => {
    setCollapsedCompanies((prev) => ({ ...prev, [company]: !prev[company] }));
  };

  useEffect(() => {
    if (userPreferencesQuery.data) {
      setSelectedPlatforms(userPreferencesQuery.data.platforms.map((p: GamePlatforms) => p.id));
      setSelectedGenres(userPreferencesQuery.data.genres.map((g: Genre) => g.id));
      setWeeklyPlayTime(userPreferencesQuery.data.gamingHours.toString());
    }
  }, [userPreferencesQuery.data]);

  const groupedPlatforms = useMemo(
    () => groupPlatformsByCompany(availablePlatforms.data),
    [availablePlatforms.data]
  );

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

  const handleApply = async () => {
    setSaveError(null);

    const trimmedPlayTime = weeklyPlayTime.trim();
    const parsedPlayTime = Number(trimmedPlayTime);

    if (trimmedPlayTime.length === 0 || isNaN(parsedPlayTime) || parsedPlayTime <= 0) {
      setPlayTimeError("Enter a valid number greater than 0");
      return;
    }
    setPlayTimeError(null);

    const payload: UserPreference = {
      id: userPreferencesQuery.data?.id ?? null,
      gamingHours: parsedPlayTime,
      genres: selectedGenres.map((id) => availableGenres.data?.find((g: Genre) => g.id === id)!),
      platforms: selectedPlatforms.map((id) => availablePlatforms.data?.find((p: GamePlatforms) => p.id === id)!),
      languages: [],
    };

    setIsSaving(true);
    try {
      if (userPreferencesQuery.data?.id != null) {
        await updateUserPreferences(payload);
      } else {
        await createUserPreferences(payload);
      }

      await queryClient.invalidateQueries({ queryKey: ["userPreferences"] });
      onApply({ selectedPlatforms, selectedGenres, weeklyPlayTime: trimmedPlayTime });
      onClose();
    } catch (error) {
      console.error("Error saving user preferences:", error);
      setSaveError("Couldn't save your preferences. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <View style={styles.overlay}>
      <View style={styles.panel}>

        <View style={styles.headerRow}>
          <Text style={styles.title}>User Preferences</Text>
          <Pressable
            onPress={onClose}
            style={({ pressed }) => [styles.closeButton, pressed && { opacity: 0.6 }]}
            hitSlop={10}
          >
            <Text style={styles.closeButtonText}>✕</Text>
          </Pressable>
        </View>
        <View style={styles.divider} />

        <ScrollView contentContainerStyle={styles.scrollContent}>

          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Platforms</Text>
            {selectedPlatforms.length > 0 && (
              <Text style={styles.selectionCount}>{selectedPlatforms.length} selected</Text>
            )}
          </View>

          {availablePlatforms.isLoading ? (
            <ActivityIndicator color={colors.dark.text} style={styles.sectionLoading} />
          ) : (
            COMPANY_ORDER.map((company) => {
              const platformsForCompany = groupedPlatforms[company];
              if (platformsForCompany.length === 0) return null;

              const selectedInCompany = platformsForCompany.filter((p) =>
                selectedPlatforms.includes(p.id)
              ).length;

              const isCollapsed = collapsedCompanies[company] ?? false;

              return (
                <View key={company} style={styles.companyGroup}>
                  <Pressable
                    style={({ pressed }) => [
                      styles.companyHeaderRow,
                      pressed && { opacity: 0.6 },
                    ]}
                    onPress={() => toggleCompanyCollapsed(company)}
                    hitSlop={4}
                  >
                    <View style={styles.companyTitleRow}>
                      <Text style={styles.companyChevron}>{isCollapsed ? "▸" : "▾"}</Text>
                      <Text style={styles.companyTitle}>{COMPANY_LABELS[company]}</Text>
                    </View>
                    {selectedInCompany > 0 && (
                      <Text style={styles.companySelectionCount}>
                        {selectedInCompany}/{platformsForCompany.length}
                      </Text>
                    )}
                  </Pressable>

                  {!isCollapsed && (
                    <View style={styles.checkboxContainer}>
                      {platformsForCompany.map((platform) => (
                        <Pressable
                          key={platform.id}
                          style={styles.checkboxRow}
                          onPress={() =>
                            toggleSelection(platform.id, selectedPlatforms, setSelectedPlatforms)
                          }
                        >
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
                        </Pressable>
                      ))}
                    </View>
                  )}
                </View>
              );
            })
          )}

          <View style={styles.divider} />

          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Genres</Text>
            {selectedGenres.length > 0 && (
              <Text style={styles.selectionCount}>{selectedGenres.length} selected</Text>
            )}
          </View>

          {availableGenres.isLoading ? (
            <ActivityIndicator color={colors.dark.text} style={styles.sectionLoading} />
          ) : (
            <View style={styles.checkboxContainer}>
              {availableGenres.data?.map((genre) => (
                <Pressable
                  key={genre.id}
                  style={styles.checkboxRow}
                  onPress={() =>
                    toggleSelection(genre.id, selectedGenres, setSelectedGenres)
                  }
                >
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
                </Pressable>
              ))}
            </View>
          )}

          <Text style={styles.sectionTitle}>Weekly Play Time (hours)</Text>
          <TextInput
            style={[styles.input, playTimeError && styles.inputError]}
            value={weeklyPlayTime}
            onChangeText={(text) => {
              setWeeklyPlayTime(text);
              if (playTimeError) setPlayTimeError(null);
            }}
            keyboardType="numeric"
            placeholder="e.g. 10"
            placeholderTextColor="#888"
          />
          {playTimeError && <Text style={styles.errorText}>{playTimeError}</Text>}

          {saveError && (
            <View style={styles.saveErrorBox}>
              <Text style={styles.saveErrorText}>{saveError}</Text>
            </View>
          )}

          <View style={styles.buttonRow}>
            <Pressable
              onPress={onClose}
              style={[styles.button, styles.cancelButton]}
              disabled={isSaving}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </Pressable>
            <Pressable
              onPress={handleApply}
              style={[styles.button, styles.applyButton, isSaving && { opacity: 0.7 }]}
              disabled={isSaving}
            >
              {isSaving ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.buttonText}>Apply</Text>
              )}
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
    color: colors.dark.text,
    textAlign: "center",
    marginLeft: 28,
  },
  closeButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  closeButtonText: {
    color: colors.dark.text,
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 14,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.dark.text,
    marginTop: 16,
    marginBottom: 8,
    textAlign: "left",
  },
  selectionCount: {
    fontSize: 12,
    color: colors.dark.addButton,
    fontWeight: "600",
  },
  sectionLoading: {
    marginVertical: 16,
  },
  companyGroup: {
    marginBottom: 4,
  },
  companyHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 6,
  },
  companyTitleRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  companyChevron: {
    fontSize: 11,
    color: colors.dark.text,
    opacity: 0.6,
    marginRight: 6,
    width: 10,
  },
  companyTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.dark.text,
    opacity: 0.6,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  companySelectionCount: {
    fontSize: 11,
    color: colors.dark.addButton,
    fontWeight: "600",
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
    paddingVertical: 4,
  },
  checkboxLabel: {
    marginLeft: 8,
    fontSize: 13,
    color: colors.dark.text,
  },
  input: {
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    marginTop: 6,
    marginBottom: 4,
    color: colors.dark.text,
    borderWidth: 1,
    borderColor: "transparent",
  },
  inputError: {
    borderColor: "#e74c3c",
  },
  errorText: {
    color: "#e74c3c",
    fontSize: 12,
    marginBottom: 12,
  },
  saveErrorBox: {
    backgroundColor: "rgba(231,76,60,0.12)",
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  saveErrorText: {
    color: "#e74c3c",
    fontSize: 13,
    textAlign: "center",
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
    minWidth: 72,
    alignItems: "center",
    justifyContent: "center",
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
