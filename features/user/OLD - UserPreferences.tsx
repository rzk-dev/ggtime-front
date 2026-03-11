import React, { useState } from "react";
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
import { createUserPreferences, updateUserPreferences } from "@/features/user/api";
import { useSupabase } from "@/lib/SupabaseProvider";
import { userPreferencesStore } from "@/hooks/usePreferencesStore";
import { platformIcons } from "@/constants/platformIcons"; // adjust path as needed

// ─── Types ────────────────────────────────────────────────────────────────────

type Genre = { id: number; name: string; slug: string };
type Platform = { id: number; name: string; slug: string };
type Language = { id: number; locale: string; name: string };

// ─── Genres ───────────────────────────────────────────────────────────────────

const AVAILABLE_GENRES: Genre[] = [
  { id: 2,  name: "Point-and-click",            slug: "point-and-click" },
  { id: 4,  name: "Fighting",                   slug: "fighting" },
  { id: 5,  name: "Shooter",                    slug: "shooter" },
  { id: 7,  name: "Music",                      slug: "music" },
  { id: 8,  name: "Platform",                   slug: "platform" },
  { id: 9,  name: "Puzzle",                     slug: "puzzle" },
  { id: 10, name: "Racing",                     slug: "racing" },
  { id: 11, name: "Real Time Strategy (RTS)",   slug: "real-time-strategy-rts" },
  { id: 12, name: "Role-playing (RPG)",         slug: "role-playing-rpg" },
  { id: 13, name: "Simulator",                  slug: "simulator" },
  { id: 14, name: "Sport",                      slug: "sport" },
  { id: 15, name: "Strategy",                   slug: "strategy" },
  { id: 16, name: "Turn-based strategy (TBS)",  slug: "turn-based-strategy-tbs" },
  { id: 24, name: "Tactical",                   slug: "tactical" },
  { id: 25, name: "Hack and slash/Beat 'em up", slug: "hack-and-slash-beat-em-up" },
  { id: 26, name: "Quiz/Trivia",                slug: "quiz-trivia" },
  { id: 30, name: "Pinball",                    slug: "pinball" },
  { id: 31, name: "Adventure",                  slug: "adventure" },
  { id: 32, name: "Indie",                      slug: "indie" },
  { id: 33, name: "Arcade",                     slug: "arcade" },
  { id: 34, name: "Visual Novel",               slug: "visual-novel" },
  { id: 35, name: "Card & Board Game",          slug: "card-and-board-game" },
  { id: 36, name: "MOBA",                       slug: "moba" },
];

// ─── Platform categories ──────────────────────────────────────────────────────
// Each category maps to a set of real platform IDs from the API.

type PlatformCategory = {
  label: string;
  icon: any;
  platforms: Platform[];
};

const PLATFORM_CATEGORIES: PlatformCategory[] = [
  {
    label: "PC",
    icon: platformIcons.PC,
    platforms: [
      { id: 6,   name: "PC (Microsoft Windows)", slug: "win" },
      { id: 3,   name: "Linux",                  slug: "linux" },
      { id: 14,  name: "Mac",                    slug: "mac" },
      { id: 13,  name: "DOS",                    slug: "dos" },
      { id: 82,  name: "Web browser",            slug: "browser" },
    ],
  },
  {
    label: "Console",
    icon: platformIcons.Console,
    platforms: [
      { id: 167, name: "PlayStation 5",     slug: "ps5" },
      { id: 48,  name: "PlayStation 4",     slug: "ps4--1" },
      { id: 9,   name: "PlayStation 3",     slug: "ps3" },
      { id: 8,   name: "PlayStation 2",     slug: "ps2" },
      { id: 7,   name: "PlayStation",       slug: "ps" },
      { id: 169, name: "Xbox Series X|S",   slug: "series-x-s" },
      { id: 49,  name: "Xbox One",          slug: "xboxone" },
      { id: 12,  name: "Xbox 360",          slug: "xbox360" },
      { id: 11,  name: "Xbox",              slug: "xbox" },
      { id: 130, name: "Nintendo Switch",   slug: "switch" },
      { id: 508, name: "Nintendo Switch 2", slug: "switch-2" },
      { id: 41,  name: "Wii U",             slug: "wiiu" },
      { id: 5,   name: "Wii",               slug: "wii" },
      { id: 4,   name: "Nintendo 64",       slug: "n64" },
      { id: 19,  name: "Super Nintendo",    slug: "snes" },
      { id: 18,  name: "NES",               slug: "nes" },
      { id: 21,  name: "Nintendo GameCube", slug: "ngc" },
      { id: 20,  name: "Nintendo DS",       slug: "nds" },
      { id: 37,  name: "Nintendo 3DS",      slug: "3ds" },
      { id: 24,  name: "Game Boy Advance",  slug: "gba" },
      { id: 22,  name: "Game Boy Color",    slug: "gbc" },
      { id: 33,  name: "Game Boy",          slug: "gb" },
      { id: 46,  name: "PlayStation Vita",  slug: "psvita" },
      { id: 38,  name: "PSP",               slug: "psp" },
      { id: 23,  name: "Dreamcast",         slug: "dc" },
    ],
  },
  {
    label: "Smartphone",
    icon: platformIcons.Smartphone,
    platforms: [
      { id: 39, name: "iOS",             slug: "ios" },
      { id: 34, name: "Android",         slug: "android" },
      { id: 55, name: "Legacy Mobile",   slug: "mobile" },
      { id: 74, name: "Windows Phone",   slug: "winphone" },
      { id: 73, name: "BlackBerry OS",   slug: "blackberry" },
    ],
  },
  {
    label: "Retro",
    icon: platformIcons.Retro,
    platforms: [
      { id: 32,  name: "Sega Saturn",            slug: "saturn" },
      { id: 29,  name: "Sega Mega Drive/Genesis", slug: "genesis-slash-megadrive" },
      { id: 30,  name: "Sega 32X",               slug: "sega32" },
      { id: 35,  name: "Sega Game Gear",         slug: "gamegear" },
      { id: 64,  name: "Sega Master System",     slug: "sms" },
      { id: 78,  name: "Sega CD",                slug: "sega-cd" },
      { id: 52,  name: "Arcade",                 slug: "arcade" },
      { id: 59,  name: "Atari 2600",             slug: "atari2600" },
      { id: 62,  name: "Atari Jaguar",           slug: "jaguar" },
      { id: 65,  name: "Atari 8-bit",            slug: "atari8bit" },
      { id: 67,  name: "Intellivision",          slug: "intellivision" },
      { id: 68,  name: "ColecoVision",           slug: "colecovision" },
      { id: 70,  name: "Vectrex",                slug: "vectrex" },
      { id: 15,  name: "Commodore C64",          slug: "c64" },
      { id: 16,  name: "Amiga",                  slug: "amiga" },
      { id: 26,  name: "ZX Spectrum",            slug: "zxs" },
      { id: 27,  name: "MSX",                    slug: "msx" },
      { id: 50,  name: "3DO",                    slug: "3do" },
      { id: 86,  name: "TurboGrafx-16",          slug: "turbografx16--1" },
    ],
  },
];

// ─── Languages ────────────────────────────────────────────────────────────────

const AVAILABLE_LANGUAGES: Language[] = [
  { id: 2,  locale: "zh-CN", name: "Chinese (Simplified)" },
  { id: 3,  locale: "zh-TW", name: "Chinese (Traditional)" },
  { id: 7,  locale: "en-US", name: "English" },
  { id: 8,  locale: "en-GB", name: "English (UK)" },
  { id: 9,  locale: "es-ES", name: "Spanish (Spain)" },
  { id: 10, locale: "es-MX", name: "Spanish (Mexico)" },
  { id: 12, locale: "fr-FR", name: "French" },
  { id: 15, locale: "it-IT", name: "Italian" },
  { id: 16, locale: "ja-JP", name: "Japanese" },
  { id: 17, locale: "ko-KR", name: "Korean" },
  { id: 22, locale: "ru-RU", name: "Russian" },
  { id: 27, locale: "de-DE", name: "German" },
];

// ─── Props ────────────────────────────────────────────────────────────────────

type Props = {
  visible: boolean;
  onClose: () => void;
  onApply: (preferences: {
    selectedPlatforms: string[];
    selectedGenres: string[];
    selectedLanguages: string[];
    weeklyPlayTime: string;
  }) => void;
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function UserPreferences({ visible, onClose, onApply }: Props) {
  const [selectedPlatformCategories, setSelectedPlatformCategories] = useState<string[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<Genre[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<Language[]>([]);
  const [weeklyPlayTime, setWeeklyPlayTime] = useState<string>("");

  const { session } = useSupabase();
  const { platforms, genres, gamingHours, setPlatforms, setGenres, setGamingHours, setLanguages } =
    userPreferencesStore();

  if (!visible) return null;

  // Toggle a platform category (PC, Console, Smartphone, Retro)
  const togglePlatformCategory = (label: string) => {
    setSelectedPlatformCategories((prev) =>
      prev.includes(label) ? prev.filter((c) => c !== label) : [...prev, label],
    );
  };

  // Toggle a genre object
  const toggleGenre = (genre: Genre) => {
    setSelectedGenres((prev) =>
      prev.some((g) => g.id === genre.id)
        ? prev.filter((g) => g.id !== genre.id)
        : [...prev, genre],
    );
  };

  // Toggle a language object
  const toggleLanguage = (language: Language) => {
    setSelectedLanguages((prev) =>
      prev.some((l) => l.id === language.id)
        ? prev.filter((l) => l.id !== language.id)
        : [...prev, language],
    );
  };

  // Expand selected categories into full platform list for the API
  const getSelectedPlatforms = (): Platform[] =>
    PLATFORM_CATEGORIES.filter((cat) =>
      selectedPlatformCategories.includes(cat.label),
    ).flatMap((cat) => cat.platforms);

  const handleApply = async () => {
    try {
      const preferencesExist = platforms.length > 0 || genres.length > 0 || gamingHours > 0;

      const selectedPlatforms = getSelectedPlatforms();

      const payload = {
        gamingHours: Number(weeklyPlayTime) || 0,
        genres: selectedGenres,
        platforms: selectedPlatforms,
        languages: selectedLanguages,
      };

      const response = preferencesExist
        ? await updateUserPreferences(session?.access_token ?? "", payload)
        : await createUserPreferences(session?.access_token ?? "", payload);

      console.log("Preferencias guardadas:", response);

      setPlatforms(selectedPlatforms.map((p) => p.name));
      setGenres(selectedGenres.map((g) => g.name));
      setGamingHours(Number(weeklyPlayTime) || 0);
      setLanguages(selectedLanguages.map((l) => l.name));

      onApply({
        selectedPlatforms: selectedPlatforms.map((p) => p.name),
        selectedGenres: selectedGenres.map((g) => g.name),
        selectedLanguages: selectedLanguages.map((l) => l.name),
        weeklyPlayTime,
      });
      onClose();
    } catch (error) {
      console.error("Error al guardar preferencias:", error);
    }
  };

  return (
    <View style={styles.overlay}>
      <View style={styles.panel}>
        {/* Header */}
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
            {AVAILABLE_GENRES.map((genre) => (
              <Pressable
                key={genre.id}
                style={styles.checkboxRow}
                onPress={() => toggleGenre(genre)}
              >
                <Checkbox
                  value={selectedGenres.some((g) => g.id === genre.id)}
                  onValueChange={() => toggleGenre(genre)}
                  color={
                    selectedGenres.some((g) => g.id === genre.id)
                      ? colors.dark.accent
                      : colors.dark.textPrimary
                  }
                />
                <Text style={styles.checkboxLabel}>{genre.name}</Text>
              </Pressable>
            ))}
          </View>

          <View style={styles.divider} />

          {/* ── Languages ── */}
          <Text style={styles.sectionTitle}>Languages</Text>
          <View style={styles.checkboxContainer}>
            {AVAILABLE_LANGUAGES.map((language) => (
              <Pressable
                key={language.id}
                style={styles.checkboxRow}
                onPress={() => toggleLanguage(language)}
              >
                <Checkbox
                  value={selectedLanguages.some((l) => l.id === language.id)}
                  onValueChange={() => toggleLanguage(language)}
                  color={
                    selectedLanguages.some((l) => l.id === language.id)
                      ? colors.dark.accent
                      : colors.dark.textPrimary
                  }
                />
                <Text style={styles.checkboxLabel}>{language.name}</Text>
              </Pressable>
            ))}
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
            <Pressable onPress={handleApply} style={[styles.button, styles.applyButton]}>
              <Text style={styles.buttonText}>Apply</Text>
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
  scrollContent: {
    paddingBottom: 16,
  },
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
  // Platform cards
  platformRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  platformCard: {
    flex: 1,
    marginHorizontal: 4,
    alignItems: "center",
    paddingVertical: 10,
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
});
