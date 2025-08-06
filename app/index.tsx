import React from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
  Image,
} from "react-native";

import { Videogame } from "@/domain/videogames/videogame";
import { useGetVideogames } from "@/hooks/useGetVideogames";

export default function Index() {
  const { videogames, loading, error } = useGetVideogames();

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text>{error}</Text>
      </View>
    );
  }

  const renderItem = ({ item }: { item: Videogame }) => (
    <View style={styles.card}>
      <Image
        style={{width: 120, height: 120}}
        source={{ uri: item.cover.url }}
      />
      <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">{item.name}</Text>
      <Text style={styles.subtitle}>Plataformas:</Text>
      {item.platforms.map((platform) => (
        <Text key={platform.id} style={styles.text} numberOfLines={1} ellipsizeMode="tail">
          - {platform.name}
        </Text>
      ))}
    </View>
  );

  return (
    <FlatList
      contentContainerStyle={styles.container}
      data={videogames}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderItem}
      numColumns={2}
      columnWrapperStyle={{ justifyContent: "space-between" }}
    />
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    padding: 20,
  },
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
