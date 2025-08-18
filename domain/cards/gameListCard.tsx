import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { Videogame } from "@/domain/videogames/videogame";
import { getPlatformIcon } from "@/constants/platformIcons";
import { Colors } from "@/constants/colors";

type Props = {
  videogame: Videogame;
};

export default function GameListCard({ videogame }: Props) {
  // Array de iconos únicos
  const uniqueIcons = Array.from(
    new Set(videogame.platforms.map((p) => getPlatformIcon(p.name)))
  );

  return (
    <View style={styles.card}>
      <Image
        source={{ uri: videogame.cover.url }}
        style={styles.coverImage}
        resizeMode="cover"
      />

      <Text
        style={styles.title}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {videogame.name}
      </Text>

      <View style={styles.iconsContainer}>
        {uniqueIcons.map((icon, index) => (
          <Image
            key={index}
            source={icon} // imagen local importada
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
    backgroundColor: Colors.dark.card,
    padding: 5,
    margin: 6,
    borderRadius: 8,
    elevation: 2,
    flex: 1,
    alignItems: "center",
  },
  coverImage: {
    width: "100%",
    height: 100,
    borderRadius: 6,
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    width: "100%",
    textAlign: "center",
    marginBottom: 4,
    color: Colors.dark.text,
  },
  iconsContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  platformIcon: {
    width: 25,
    height: 25,
    marginHorizontal: 4,
    marginBottom: 4,
  },
});
