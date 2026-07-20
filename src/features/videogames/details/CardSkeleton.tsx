import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated, Dimensions, Platform } from "react-native";
import { useTheme } from "@/src/shared/ThemeProvider";

const SCREEN_HEIGHT = Dimensions.get("window").height;

function Bone({ style, boneColor }: { style?: any; boneColor: string }) {
  const pulseAnim = useRef(new Animated.Value(0.35)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.85,
          duration: 650,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.35,
          duration: 650,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [pulseAnim]);

  return (
    <Animated.View
      style={[
        { backgroundColor: boneColor, borderRadius: 6 },
        style,
        { opacity: pulseAnim },
      ]}
    />
  );
}

interface CardSkeletonProps {
  onClose: () => void;
}

export default function CardSkeleton({ onClose }: CardSkeletonProps) {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const boneColor = theme.border;

  return (
    <View style={styles.outerWrap}>
      <View style={[styles.card, { height: SCREEN_HEIGHT * 0.75 }]}>
        <View style={styles.coverPlaceholder} />

        <View style={styles.content}>
          <Bone style={styles.title} boneColor={boneColor} />

          <View style={styles.badgeRow}>
            <Bone style={styles.badge} boneColor={boneColor} />
            <Bone style={styles.badge} boneColor={boneColor} />
          </View>

          <View style={styles.metaGrid}>
            <Bone style={styles.metaItem} boneColor={boneColor} />
            <Bone style={styles.metaItem} boneColor={boneColor} />
            <Bone style={styles.metaItem} boneColor={boneColor} />
            <Bone style={styles.metaItem} boneColor={boneColor} />
          </View>

          <Bone style={styles.line} boneColor={boneColor} />
          <Bone style={[styles.line, { width: "90%" }]} boneColor={boneColor} />
          <Bone style={[styles.line, { width: "70%" }]} boneColor={boneColor} />
        </View>
      </View>
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
    coverPlaceholder: {
      height: SCREEN_HEIGHT * 0.32,
      backgroundColor: theme.cardElevated,
    },
    content: {
      paddingHorizontal: 14,
      paddingTop: 16,
    },
    title: {
      height: 16,
      width: "60%",
      alignSelf: "center",
      marginBottom: 14,
    },
    badgeRow: {
      flexDirection: "row",
      justifyContent: "center",
      gap: 8,
      marginBottom: 16,
    },
    badge: {
      height: 22,
      width: 50,
      borderRadius: 6,
    },
    metaGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      marginBottom: 16,
    },
    metaItem: {
      width: "45%",
      height: 28,
      margin: "2.5%",
    },
    line: {
      height: 12,
      width: "100%",
      marginBottom: 8,
    },
  });
