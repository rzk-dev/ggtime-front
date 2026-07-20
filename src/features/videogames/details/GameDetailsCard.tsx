import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  ScrollView,
  Pressable,
  Dimensions,
  Platform,
  Animated,
  PanResponder,
} from "react-native";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "@/src/shared/ThemeProvider";
import { simplifyLanguages } from "@/src/shared/models/videogames/languages";
import { useQuery } from "@tanstack/react-query";
import { getById } from "../../../lib/api/videogameApi";
import { TimeToBeat } from "@/src/shared/models/videogames/timeToBeat";
import CardSkeleton from "./CardSkeleton";
import CardErrorState from "./CardErrorState";

type Props = {
  id: number;
  onClose: () => void;
  timeToBeat?: TimeToBeat;
  isRecommendation?: boolean;
};

const SCREEN_HEIGHT = Dimensions.get("window").height;

const ESRB_VALUES = ["E", "E10+", "T", "M", "AO", "RP"];
const PEGI_VALUES = ["3", "7", "12", "16", "18"];

export default function GameDetailsCard({
  id,
  onClose,
  timeToBeat,
  isRecommendation,
}: Props) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const [coverLoaded, setCoverLoaded] = useState(false);
  const [summaryExpanded, setSummaryExpanded] = useState(false);
  const [summaryTruncated, setSummaryTruncated] = useState(false);
  const [showScrollHint, setShowScrollHint] = useState(true);
  const [languagesExpanded, setLanguagesExpanded] = useState(false);

  useEffect(() => {
    setCoverLoaded(false);
    setSummaryExpanded(false);
    setSummaryTruncated(false);
    setShowScrollHint(true);
    setLanguagesExpanded(false);
  }, [id]);

  const getVideogameDetails = () => getById(id);

  const { isLoading, isError, data, refetch } = useQuery({
    queryKey: ["videogames", id],
    queryFn: getVideogameDetails,
  });

  const handleClose = () => {
    Haptics.selectionAsync();
    onClose();
  };

  const translateY = React.useRef(new Animated.Value(0)).current;
  const DISMISS_THRESHOLD = 120;

  const panResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponderCapture: () => false,
      onMoveShouldSetPanResponderCapture: (_, gesture) =>
        Math.abs(gesture.dy) > 4 && Math.abs(gesture.dy) > Math.abs(gesture.dx),
      onMoveShouldSetPanResponder: (_, gesture) =>
        Math.abs(gesture.dy) > 4 && Math.abs(gesture.dy) > Math.abs(gesture.dx),
      onPanResponderTerminationRequest: () => false,
      onPanResponderMove: (_, gesture) => {
        if (gesture.dy > 0) translateY.setValue(gesture.dy);
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dy > DISMISS_THRESHOLD) {
          Haptics.selectionAsync();
          Animated.timing(translateY, {
            toValue: SCREEN_HEIGHT,
            duration: 200,
            useNativeDriver: true,
          }).start(() => onClose());
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
            bounciness: 6,
          }).start();
        }
      },
    })
  ).current;

  if (isLoading) {
    return <CardSkeleton onClose={handleClose} />;
  }

  if (isError || !data) {
    return (
      <CardErrorState
        onRetry={() => {
          Haptics.selectionAsync();
          refetch();
        }}
        onClose={handleClose}
      />
    );
  }

  const getCompanyName = (c: any) => c?.company?.name ?? c?.string ?? "";

  const LANGUAGES_COLLAPSED_LIMIT = 8;
  const simplifiedLanguages = [...simplifyLanguages(data?.languageSupports || [])].sort(
    (a, b) => {
      if (b.types.length !== a.types.length) return b.types.length - a.types.length;
      return a.name.localeCompare(b.name);
    }
  );
  const visibleLanguages = languagesExpanded
    ? simplifiedLanguages
    : simplifiedLanguages.slice(0, LANGUAGES_COLLAPSED_LIMIT);
  const hiddenLanguagesCount = simplifiedLanguages.length - visibleLanguages.length;

  const formatPlaytime = (seconds?: number | null) => {
    if (!seconds) return "N/A";
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours === 0) return `${minutes}m`;
    if (minutes === 0) return `${hours}h`;
    return `${hours}h ${minutes}m`;
  };

  const year = data?.firstReleaseDate
    ? new Date(data.firstReleaseDate * 1000).getFullYear()
    : "N/A";

  const esrbRating = data?.ageRatings?.find((r) => ESRB_VALUES.includes(r));
  const pegiRating = data?.ageRatings?.find((r) => PEGI_VALUES.includes(r));

  const CoverPulse = () => (
    <View style={styles.coverDotsRow}>
      <View style={styles.coverDot} />
      <View style={[styles.coverDot, { opacity: 0.6 }]} />
      <View style={[styles.coverDot, { opacity: 0.3 }]} />
    </View>
  );

  return (
    <View style={styles.outerWrap}>
      <Animated.View
        style={[
          styles.card,
          { height: SCREEN_HEIGHT * 0.75, transform: [{ translateY }] },
        ]}
      >
        <View style={styles.dismissHandle} {...panResponder.panHandlers} />

        <View style={styles.coverContainer} {...panResponder.panHandlers}>
          {!coverLoaded && (
            <View style={styles.coverPlaceholder}>
              <View style={styles.coverPulseWrap}>
                <CoverPulse />
              </View>
            </View>
          )}

          {data?.cover?.url ? (
            <ImageBackground
              source={{ uri: data?.cover.url }}
              style={styles.cover}
              resizeMode="cover"
              onLoadEnd={() => setCoverLoaded(true)}
            >
              {isRecommendation && (
                <View style={styles.recommendedBadge}>
                  <Text style={styles.recommendedBadgeText}>Recommended for you</Text>
                </View>
              )}

              <Pressable
                onPress={handleClose}
                style={({ pressed }) => [
                  styles.closeButton,
                  pressed && { opacity: 0.6 },
                ]}
                hitSlop={10}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </Pressable>
            </ImageBackground>
          ) : null}

          <LinearGradient
            colors={["transparent", theme.card]}
            style={styles.coverFade}
            pointerEvents="none"
          />
        </View>

        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={true}
          scrollEventThrottle={16}
          onScroll={(e) => {
            const { contentOffset, contentSize, layoutMeasurement } = e.nativeEvent;
            const distanceToBottom =
              contentSize.height - layoutMeasurement.height - contentOffset.y;
            setShowScrollHint(distanceToBottom > 24);
          }}
          onContentSizeChange={(_, contentHeight) => {
            setShowScrollHint(contentHeight > SCREEN_HEIGHT * 0.75 * 0.6);
          }}
        >
          <Text style={styles.title}>{data?.name}</Text>

          {(esrbRating || pegiRating) ? (
            <View style={styles.ageBadgeRow}>
              {esrbRating && (
                <View style={styles.ageBadge}>
                  <Text style={styles.ageBadgeLabel}>ESRB</Text>
                  <Text style={styles.ageBadgeText}>{esrbRating}</Text>
                </View>
              )}
              {pegiRating && (
                <View style={styles.ageBadge}>
                  <Text style={styles.ageBadgeLabel}>PEGI</Text>
                  <Text style={styles.ageBadgeText}>{pegiRating}</Text>
                </View>
              )}
            </View>
          ) : (
            <View style={styles.titleSpacer} />
          )}

          <View style={styles.metaGrid}>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Year</Text>
              <Text style={styles.metaValue}>{year}</Text>
            </View>

            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Playtime</Text>
              <Text style={styles.metaValue}>{formatPlaytime(timeToBeat?.normally)}</Text>
            </View>

            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Genres</Text>
              <Text style={styles.metaValue}>
                {data?.genres?.map((g) => (g as any).name || g).join(", ") || "N/A"}
              </Text>
            </View>

            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Platform</Text>
              <Text style={styles.metaValue}>
                {data?.platforms?.map((p) => p.name).join(", ") || "N/A"}
              </Text>
            </View>
          </View>

          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Publisher: </Text>
            <Text style={styles.metaValue}>
              {data?.involvedCompanies?.length
                ? data?.involvedCompanies
                  .map((c) => getCompanyName(c))
                  .filter(Boolean)
                  .join(", ")
                : "N/A"}
            </Text>
          </View>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>Summary</Text>
          <Text
            style={styles.summaryText}
            numberOfLines={summaryExpanded ? undefined : 4}
            onTextLayout={(e) => {
              if (!summaryExpanded && e.nativeEvent.lines.length >= 4) {
                setSummaryTruncated(true);
              }
            }}
          >
            {data?.summary || "No summary available."}
          </Text>
          {summaryTruncated && (
            <Pressable
              onPress={() => {
                Haptics.selectionAsync();
                setSummaryExpanded((prev) => !prev);
              }}
              hitSlop={6}
              style={({ pressed }) => pressed && { opacity: 0.6 }}
            >
              <Text style={styles.showMoreText}>
                {summaryExpanded ? "Show less" : "Show more..."}
              </Text>
            </Pressable>
          )}

          <View style={styles.divider} />

          <Text style={[styles.sectionTitle]}>Languages</Text>
          <View style={styles.languageChipsWrap}>
            {visibleLanguages.length > 0 ? (
              visibleLanguages.map((lang) => (
                <View key={lang.name} style={styles.languageChip}>
                  <Text style={styles.languageChipName}>{lang.name}</Text>
                  <Text style={styles.languageChipTypes}>{lang.types.join(" · ")}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.languageData}>N/A</Text>
            )}
          </View>
          {hiddenLanguagesCount > 0 && (
            <Pressable
              onPress={() => {
                Haptics.selectionAsync();
                setLanguagesExpanded(true);
              }}
              hitSlop={6}
              style={({ pressed }) => pressed && { opacity: 0.6 }}
            >
              <Text style={styles.showMoreText}>+{hiddenLanguagesCount} more</Text>
            </Pressable>
          )}
        </ScrollView>

        {showScrollHint && (
          <LinearGradient
            colors={["transparent", theme.card]}
            style={styles.scrollHint}
            pointerEvents="none"
          />
        )}
      </Animated.View>
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
      ...Platform.select({
        ios: {
          overflow: "hidden",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.35,
          shadowRadius: 20,
        },
        android: {
          elevation: 20,
          overflow: "hidden",
        },
      }),
    },
    coverContainer: {
      borderTopLeftRadius: 14,
      borderTopRightRadius: 14,
      overflow: "hidden",
      height: SCREEN_HEIGHT * 0.32,
      position: "relative",
    },
    dismissHandle: {
      position: "absolute",
      top: 8,
      alignSelf: "center",
      width: 36,
      height: 4,
      borderRadius: 2,
      backgroundColor: "rgba(255,255,255,0.55)",
      zIndex: 10,
    },
    coverFade: {
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      height: 56,
    },
    scrollHint: {
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      height: 28,
    },
    coverPlaceholder: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: theme.cardElevated,
      justifyContent: "center",
      alignItems: "center",
    },
    coverPulseWrap: {
      justifyContent: "center",
      alignItems: "center",
    },
    coverDotsRow: {
      flexDirection: "row",
      gap: 6,
    },
    coverDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: "rgba(255,255,255,0.6)",
    },
    cover: {
      width: "100%",
      height: "100%",
      justifyContent: "flex-start",
      alignItems: "flex-end",
    },
    closeButton: {
      backgroundColor: "rgba(0,0,0,0.45)",
      width: 36,
      height: 36,
      borderRadius: 18,
      margin: 10,
      justifyContent: "center",
      alignItems: "center",
    },
    closeButtonText: {
      color: "#fff",
      fontSize: 17,
      fontWeight: "700",
      lineHeight: 17,
    },
    recommendedBadge: {
      position: "absolute",
      top: 10,
      left: 10,
      backgroundColor: theme.primary,
      paddingVertical: 4,
      paddingHorizontal: 10,
      borderRadius: 12,
    },
    recommendedBadgeText: {
      color: theme.onPrimary,
      fontSize: 11,
      fontWeight: "700",
    },
    favoriteButton: {
      backgroundColor: "rgba(0,0,0,0.4)",
      padding: 8,
      margin: 8,
      borderRadius: 20,
      position: "absolute",
      bottom: 0,
      right: 0,
    },
    content: {
      backgroundColor: "transparent",
      paddingHorizontal: 14,
      marginTop: -12,
    },
    contentContainer: {
      paddingBottom: 24,
    },
    title: {
      fontSize: 18,
      fontWeight: "800",
      color: theme.text,
      textAlign: "center",
      marginBottom: 2,
    },
    titleSpacer: {
      height: 8,
    },
    ageBadgeRow: {
      flexDirection: "row",
      justifyContent: "center",
      gap: 8,
      marginTop: 6,
      marginBottom: 12,
    },
    ageBadge: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      backgroundColor: theme.cardElevated,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6,
    },
    ageBadgeLabel: {
      color: theme.text,
      fontSize: 9,
      fontWeight: "700",
      opacity: 0.6,
    },
    ageBadgeText: {
      color: theme.text,
      fontSize: 12,
      fontWeight: "800",
    },
    metaGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      marginBottom: 4,
    },
    metaItem: {
      width: "50%",
      marginBottom: 10,
      paddingRight: 8,
    },
    metaRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      alignItems: "center",
      marginTop: 2,
      marginBottom: 6,
    },
    metaLabel: {
      color: theme.textSecondary,
      fontSize: 12,
      fontWeight: "700",
      textTransform: "uppercase",
      marginBottom: 2,
    },
    metaValue: {
      color: theme.text,
      fontSize: 13,
      opacity: 0.95,
      fontWeight: "500",
    },
    divider: {
      height: 1,
      backgroundColor: theme.border,
      marginVertical: 12,
    },
    sectionTitle: {
      color: theme.text,
      fontSize: 14,
      fontWeight: "700",
      marginBottom: 6,
    },
    summaryText: {
      color: theme.text,
      fontSize: 13,
      lineHeight: 20,
      opacity: 0.95,
    },
    showMoreText: {
      color: theme.primary,
      fontSize: 12,
      fontWeight: "700",
      marginTop: 4,
    },
    languageChipsWrap: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
    },
    languageChip: {
      backgroundColor: theme.cardElevated,
      borderRadius: 10,
      paddingVertical: 6,
      paddingHorizontal: 10,
      marginBottom: 8,
    },
    languageChipName: {
      color: theme.text,
      fontSize: 12,
      fontWeight: "700",
    },
    languageChipTypes: {
      color: theme.textSecondary,
      fontSize: 11,
      marginTop: 2,
    },
    languageData: {
      color: theme.text,
      marginBottom: 8,
      fontSize: 14,
      lineHeight: 20,
      flexWrap: "wrap",
    },
    companySection: {
      marginBottom: 8,
    },
    text: {
      fontSize: 14,
      color: theme.text,
      marginLeft: 8,
    },
  });
