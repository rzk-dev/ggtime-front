import React from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
} from "react-native";

import { Videogame } from "@/domain/videogames/videogame";
import { useGetVideogames } from "@/hooks/useGetVideogames";
import { RenderVideogameItem } from "@/domain/videogames/gameCard";

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

  return (
    <SafeAreaView style={styles.area}>
      <FlatList
        contentContainerStyle={styles.container}
        data={videogames}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <RenderVideogameItem item={item} />}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between" }}
      />
    </SafeAreaView>
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
  area: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
