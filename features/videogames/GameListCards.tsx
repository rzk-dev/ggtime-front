import React from "react";
import { View, Text, Image, StyleSheet, Dimensions } from "react-native";

import { colors } from "@/constants/colors";
import { getPlatformIcon } from "@/constants/platformIcons";
import { Videogame } from "@/domain/videogames/videogame";

type Props = {
  videogame: Videogame;
};

export default function GameListCards({ videogame }: Props) {
  const screenWidth = Dimensions.get("window").width;
  const columnsNumber = 3;
  const cardWidth = screenWidth / columnsNumber - 16;
  const cardHeight = 200;

  const uniqueIcons = Array.from(
    new Set(videogame.platforms.map((p) => getPlatformIcon(p.name))),
  );

  return (
    <View style={[styles.card, { width: cardWidth, height: cardHeight }]}>
      <Image
        source={{ uri: videogame.cover.url }}
        style={styles.coverImage}
        resizeMode="cover"
      />
      <View style={styles.titleContainer}>
        <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
          {videogame.name}
        </Text>
      </View>
      <View style={styles.iconsContainer}>
        {uniqueIcons.map((icon, index) => (
          <Image
            key={index}
            source={icon}
            style={styles.platformIcon}
            resizeMode="contain"
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.dark.card,
    borderRadius: 12,
    alignItems: "center",
    overflow: "hidden",
    justifyContent: "flex-start",
  },
  coverImage: {
    width: "100%",
    height: "60%",
  },
  titleContainer: {
    width: "100%",
    paddingHorizontal: 8,
    paddingVertical: 4,
    minHeight: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontWeight: "bold",
    textAlign: "center",
    color: colors.dark.textPrimary,
  },
  iconsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    paddingBottom: 8,
    marginTop: "auto",
  },
  platformIcon: {
    width: 24,
    height: 24,
  },
});
