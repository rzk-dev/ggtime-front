import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ImageBackground,
  Modal,
  StyleSheet,
  ScrollView,
  Pressable,
  useWindowDimensions,
  BackHandler,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "@/src/shared/constants/colors";
import { useVideogameDetails } from "../hooks/useVideogameDetails";
import { GameDetailsLoader } from "./GameDetailsLoader";
import { formatLanguages } from "../utils/formatLanguages";
import { formatPlaytime } from "../utils/formatPlaytime";
import { formatReleaseYear } from "../utils/formatReleaseYear";
import { formatPublishers } from "../utils/formatPublishers";

type Props = {
  id: number;
  onClose: () => void;
};

const SUMMARY_COLLAPSED_LINES = 5;
const SUMMARY_MIN_LENGTH_TO_COLLAPSE = 220;
const EMPTY = "—";

function CloseButton({
  onPress,
  style,
}: {
  onPress: () => void;
  style?: object;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.close, style]}
      hitSlop={10}
      accessibilityRole="button"
      accessibilityLabel="Close"
    >
      <Text style={styles.closeText}>✕</Text>
    </Pressable>
  );
}

function ChipList({ label, items }: { label: string; items: string[] }) {
  return (
    <View style={styles.chipBlock}>
      <Text style={styles.metaLabel}>{label}</Text>
      {items.length > 0 ? (
        <View style={styles.chipRow}>
          {items.map((item) => (
            <View key={item} style={styles.chip}>
              <Text style={styles.chipText}>{item}</Text>
            </View>
          ))}
        </View>
      ) : (
        <Text style={styles.metaValue}>{EMPTY}</Text>
      )}
    </View>
  );
}

export default function GameDetailsCard({ id, onClose }: Props) {
  const { data: details, isError, refetch } = useVideogameDetails(id);
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const [summaryExpanded, setSummaryExpanded] = useState(false);
  const [coverOpen, setCoverOpen] = useState(false);

  useEffect(() => {
    if (Platform.OS !== "android") return;
    const sub = BackHandler.addEventListener("hardwareBackPress", () => {
      if (coverOpen) {
        setCoverOpen(false);
      } else {
        onClose();
      }
      return true;
    });
    return () => sub.remove();
  }, [onClose, coverOpen]);

  const cardWidth = Math.min(width - 48, 480);
  const coverHeight = Math.min(cardWidth * 0.75, height * 0.3);
  const cardHeight = height * 0.75;

  if (isError) {
    return (
      <View style={styles.outerWrap}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <View style={[styles.card, styles.stateCard, { width: cardWidth }]}>
          <CloseButton onPress={onClose} />
          <Text style={styles.stateTitle}>Couldn't load game details</Text>
          <Text style={styles.stateText}>
            Check your connection and try again.
          </Text>
          <Pressable
            onPress={() => refetch()}
            style={styles.retryButton}
            accessibilityRole="button"
          >
            <Text style={styles.retryText}>Retry</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  if (!details) {
    return <GameDetailsLoader />;
  }

  const languages = formatLanguages(details.languageSupports) || EMPTY;
  const releaseYear = formatReleaseYear(details.firstReleaseDate) || EMPTY;
  const publishers = formatPublishers(details.involvedCompanies) || EMPTY;
  const gameHoursToBeat =
    details.timeToBeat?.normally != null
      ? formatPlaytime(details.timeToBeat.normally)
      : EMPTY;

  const genres: string[] = (details.genres ?? []).map((g: { name: string }) => g.name);
  const platforms: string[] = (details.platforms ?? []).map((p: { name: string }) => p.name);

  const summary: string = details.summary ?? "";
  const summaryCollapsible = summary.length > SUMMARY_MIN_LENGTH_TO_COLLAPSE;

  return (
    <View style={styles.outerWrap}>
      <Pressable
        style={StyleSheet.absoluteFill}
        onPress={onClose}
        accessibilityLabel="Close details"
      />

      <View style={[styles.card, { width: cardWidth, height: cardHeight }]}>
        <View style={styles.clip}>
          <ScrollView
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
          >
            {details.coverUrl ? (
              <Pressable
                onPress={() => setCoverOpen(true)}
                accessibilityRole="imagebutton"
                accessibilityLabel={`View full cover of ${details.name}`}
              >
                <ImageBackground
                  source={{ uri: details.coverUrl }}
                  style={[styles.cover, { height: coverHeight }]}
                  resizeMode="cover"
                >
                  <View style={styles.expandHint} pointerEvents="none">
                    <Text style={styles.expandHintText}>⤢</Text>
                  </View>
                </ImageBackground>
              </Pressable>
            ) : (
              <View style={[styles.cover, { height: coverHeight * 0.5 }]} />
            )}

            <View style={styles.content}>
              <Text style={styles.title} accessibilityRole="header">
                {details.name}
              </Text>

              <View style={styles.statsRow}>
                <View style={styles.stat}>
                  <Text style={styles.statValue}>{releaseYear}</Text>
                  <Text style={styles.statLabel}>Year</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.stat}>
                  <Text style={styles.statValue}>{gameHoursToBeat}</Text>
                  <Text style={styles.statLabel}>Average playtime</Text>
                </View>
              </View>

              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>Publisher: </Text>
                <Text style={styles.metaValue}>{publishers}</Text>
              </View>

              <ChipList label="Genres" items={genres} />
              <ChipList label="Platforms" items={platforms} />

              <View style={styles.divider} />

              <Text style={styles.sectionTitle}>Summary</Text>
              {summary ? (
                <>
                  <Text
                    style={styles.bodyText}
                    numberOfLines={
                      summaryCollapsible && !summaryExpanded
                        ? SUMMARY_COLLAPSED_LINES
                        : undefined
                    }
                  >
                    {summary}
                  </Text>
                  {summaryCollapsible && (
                    <Pressable
                      onPress={() => setSummaryExpanded((v) => !v)}
                      hitSlop={8}
                      accessibilityRole="button"
                    >
                      <Text style={styles.toggleText}>
                        {summaryExpanded ? "Show less" : "Read more"}
                      </Text>
                    </Pressable>
                  )}
                </>
              ) : (
                <Text style={styles.metaValue}>{EMPTY}</Text>
              )}

              <View style={styles.divider} />

              <Text style={styles.sectionTitle}>Languages</Text>
              <Text style={styles.languageData}>{languages}</Text>
            </View>
          </ScrollView>
        </View>

        <CloseButton onPress={onClose} />
      </View>

      {details.coverUrl ? (
        <Modal
          visible={coverOpen}
          transparent
          animationType="fade"
          statusBarTranslucent
          onRequestClose={() => setCoverOpen(false)}
        >
          <View style={styles.lightbox}>
            <Pressable
              style={StyleSheet.absoluteFill}
              onPress={() => setCoverOpen(false)}
              accessibilityLabel="Close full cover"
            >
              <Image
                source={{ uri: details.coverUrl }}
                style={styles.lightboxImage}
                resizeMode="contain"
                accessibilityLabel={`${details.name} cover`}
              />
            </Pressable>
            <CloseButton
              onPress={() => setCoverOpen(false)}
              style={{ top: insets.top + 10 }}
            />
          </View>
        </Modal>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  outerWrap: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "transparent",
  },
  card: {
    backgroundColor: colors.dark.card,
    borderWidth: 1,
    borderColor: colors.dark.border,
    borderRadius: 14,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.35,
        shadowRadius: 20,
      },
      android: {
        elevation: 20,
      },
    }),
  },
  clip: {
    flex: 1,
    borderRadius: 13,
    overflow: "hidden",
  },
  close: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.dark.overlay,
  },
  closeText: {
    color: colors.dark.text,
    fontSize: 16,
    fontWeight: "700",
  },
  cover: {
    width: "100%",
    backgroundColor: colors.dark.backgroundElevated,
  },
  expandHint: {
    position: "absolute",
    bottom: 10,
    right: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.dark.overlay,
  },
  expandHintText: {
    color: colors.dark.text,
    fontSize: 16,
    fontWeight: "700",
  },
  contentContainer: {
    paddingBottom: 24,
  },
  content: {
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
    color: colors.dark.text,
    textAlign: "center",
    marginTop: 14,
    marginBottom: 12,
  },
  lightbox: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.92)",
  },
  lightboxImage: {
    width: "100%",
    height: "100%",
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.dark.backgroundElevated,
    borderWidth: 1,
    borderColor: colors.dark.border,
    borderRadius: 12,
    paddingVertical: 10,
    marginBottom: 12,
  },
  stat: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    color: colors.dark.text,
    fontSize: 16,
    fontWeight: "700",
  },
  statLabel: {
    color: colors.dark.textMuted,
    fontSize: 12,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    alignSelf: "stretch",
    backgroundColor: colors.dark.border,
  },
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    marginBottom: 10,
  },
  metaLabel: {
    color: colors.dark.tint,
    fontSize: 13,
    fontWeight: "700",
  },
  metaValue: {
    color: colors.dark.textSecondary,
    fontSize: 13,
    fontWeight: "400",
  },
  chipBlock: {
    marginBottom: 10,
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 6,
  },
  chip: {
    backgroundColor: colors.dark.cardElevated,
    borderWidth: 1,
    borderColor: colors.dark.border,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  chipText: {
    color: colors.dark.textSecondary,
    fontSize: 12,
    fontWeight: "500",
  },
  divider: {
    height: 1,
    backgroundColor: colors.dark.border,
    marginVertical: 12,
  },
  sectionTitle: {
    color: colors.dark.text,
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 6,
  },
  bodyText: {
    color: colors.dark.textSecondary,
    fontSize: 13,
    lineHeight: 20,
  },
  languageData: {
    color: colors.dark.textSecondary,
    marginBottom: 8,
    fontSize: 14,
    lineHeight: 20,
    flexWrap: "wrap",
  },
  toggleText: {
    color: colors.dark.tint,
    fontSize: 13,
    fontWeight: "700",
    marginTop: 6,
  },
  stateCard: {
    alignItems: "center",
    padding: 24,
    paddingTop: 32,
  },
  stateTitle: {
    color: colors.dark.text,
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
  },
  stateText: {
    color: colors.dark.textSecondary,
    fontSize: 13,
    textAlign: "center",
    marginTop: 6,
    marginBottom: 16,
  },
  retryButton: {
    minHeight: 44,
    minWidth: 120,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.dark.addButton,
  },
  retryText: {
    color: colors.dark.onPrimary,
    fontWeight: "700",
    fontSize: 14,
  },
});