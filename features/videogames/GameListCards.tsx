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

  const uniqueIcons = Array.from(
    new Set(videogame.platforms.map((p) => getPlatformIcon(p.name))),
  );

  return (
    <View style={[{ width: screenWidth / columnsNumber - 10 }, styles.card]}>
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
    margin: 5,
    height: 200,
    backgroundColor: colors.dark.card,
  },
  coverImage: {
    height: 100,
  },
  titleContainer: {},
  title: {
    flexShrink: 1,
    padding: 10,
    fontWeight: "bold",
    textAlign: "center",
    color: colors.dark.text,
  },
  iconsContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  platformIcon: {
    width: 25,
    height: 25,
    resizeMode: "contain",
  },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
});
