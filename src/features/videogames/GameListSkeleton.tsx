import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated, Dimensions } from "react-native";
import { useTheme } from "@/src/shared/ThemeProvider";

const { width } = Dimensions.get("window");
const COLUMN_COUNT = 3;
const CARD_MARGIN = 8;
const CARD_WIDTH = (width - CARD_MARGIN * (COLUMN_COUNT + 1)) / COLUMN_COUNT;

function SkeletonCard({ styles }: { styles: ReturnType<typeof createStyles> }) {
  const pulseAnim = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.4,
          duration: 700,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [pulseAnim]);

  return (
    <Animated.View style={[styles.card, { opacity: pulseAnim }]}>
      <View style={styles.image} />
      <View style={styles.titleLine} />
      <View style={styles.subtitleLine} />
    </Animated.View>
  );
}

interface GameListSkeletonProps {
  count?: number;
}

export default function GameListSkeleton({ count = 12 }: GameListSkeletonProps) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.grid}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} styles={styles} />
      ))}
    </View>
  );
}

const createStyles = (theme: any) =>
  StyleSheet.create({
    grid: {
      flexDirection: "row",
      flexWrap: "wrap",
      paddingHorizontal: CARD_MARGIN,
      paddingTop: CARD_MARGIN,
      backgroundColor: theme.background,
    },
    card: {
      width: CARD_WIDTH,
      marginBottom: CARD_MARGIN * 2,
      marginHorizontal: CARD_MARGIN / 2,
    },
    image: {
      width: "100%",
      aspectRatio: 3 / 4,
      borderRadius: 10,
      backgroundColor: theme.cardElevated,
      marginBottom: 6,
    },
    titleLine: {
      height: 10,
      borderRadius: 4,
      backgroundColor: theme.cardElevated,
      marginBottom: 4,
      width: "90%",
    },
    subtitleLine: {
      height: 8,
      borderRadius: 4,
      backgroundColor: theme.cardElevated,
      width: "60%",
    },
  });
