import React from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";
import { useGetVideogames } from "@/hooks/useGetVideogames";
import GameListCard from "@/domain/cards/gameListCard";
import { colors } from "@/constants/Colors";
import GameModalTrigger from "@/domain/cards/gameModalTrigger";

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
    <FlatList
      contentContainerStyle={styles.container}
      data={videogames}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => <GameModalTrigger videogame ={item} />}
      numColumns={3}
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
    justifyContent: "space-between",
    backgroundColor: colors.dark.background,
  },
});
