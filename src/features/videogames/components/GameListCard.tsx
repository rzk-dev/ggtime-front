import React from "react";
import { View, Text, Image, StyleSheet, Dimensions } from "react-native";

import { colors } from "@/src/shared/constants/colors";
import { getPlatformIcon, platformIcons } from "@/src/shared/constants/platformIcons";
import { VideogamePreview } from "../domain/videogame";
import { getPlatformFamily } from "@/src/shared/constants/platformFamilies";

type Props = {
  videogame: VideogamePreview;
};

export default function GameListCards({ videogame }: Props) {
  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;
  const columnsNumber = 3;


  const platformFamilies = [
    ...new Set(
      videogame.platforms.map(platform => getPlatformFamily(platform.name))
    ),
  ];

  return (
    <View
      style={[
        {
          width: screenWidth / columnsNumber - 10,
          height: screenHeight * 0.25,
        },
        styles.card,
      ]}
    >
      <Image
        source={{ uri: videogame.coverUrl }}
        style={styles.coverImage}
        resizeMode="cover"
      />
      <View style={styles.titleContainer}>
        <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
          {videogame.name}
        </Text>
      </View>
      <View style={styles.iconsContainer}>
        {platformFamilies.map(family => (
          <Image
            key={family}
            source={platformIcons[family]}
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
    backgroundColor: colors.dark.card,
    paddingBottom: 10,
    borderRadius: 5,
  },
  coverImage: {
    height: 100,
    borderTopRightRadius: 5,
    borderTopLeftRadius: 5,
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
    gap: 5,
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
