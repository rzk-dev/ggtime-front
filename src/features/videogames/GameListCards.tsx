import React from "react";
import { View, Text, Image, StyleSheet, Dimensions } from "react-native";

import { useTheme } from "@/src/shared/ThemeProvider";
import { getPlatformIcon } from "@/src/shared/constants/platformIcons";
import { Videogame } from "@/src/shared/models/videogames/videogame";

type Props = {
  videogame: Videogame;
};

export default function GameListCards({ videogame }: Props) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;
  const columnsNumber = 3;

  const uniqueIcons = Array.from(
    new Set(videogame.platforms.map((p) => getPlatformIcon(p.name))),
  );

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

const createStyles = (theme: any) =>
  StyleSheet.create({
    card: {
      margin: 5,
      backgroundColor: theme.card,
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
      color: theme.text,
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
      backgroundColor: theme.overlay,
    },
  });
