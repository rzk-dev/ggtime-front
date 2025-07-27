import React from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
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
      <Text style={styles.title}>{item.name}</Text>
      <Text style={styles.subtitle}>Plataformas:</Text>
      {item.platforms.map((platform) => (
        <Text key={platform.id} style={styles.text}>
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
    padding: 15,
    marginBottom: 20,
    borderRadius: 8,
    elevation: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 16,
    marginTop: 10,
    fontWeight: "600",
  },
  text: {
    fontSize: 14,
  },
});
