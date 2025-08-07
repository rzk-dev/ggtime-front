import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { Videogame } from "@/domain/videogames/videogame";

type Props = {
  item: Videogame;
};

export const RenderVideogameItem = ({ item }: Props) => (
  <View style={styles.card}>
    <Image
      style={{ width: 120, height: 120 }}
      source={{ uri: item.cover.url }}
    />
    <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
      {item.name}
    </Text>
    <Text style={styles.subtitle}>Plataformas:</Text>
    {item.platforms.map((platform) => (
      <Text
        key={platform.id}
        style={styles.text}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        - {platform.name}
      </Text>
    ))}
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#f5f5f5",
    padding: 10,
    marginBottom: 5,
    borderRadius: 8,
    elevation: 2,
    width: "45%",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    marginTop: 10,
    fontWeight: "600",
  },
  text: {
    fontSize: 14,
    textAlign: "center",
  },
});
