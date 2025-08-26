import React from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, View, SafeAreaView, StatusBar } from "react-native";
import { useGetVideogames } from "@/hooks/useGetVideogames";
import { colors } from "@/constants/colors";
import GameListCards from "@/domain/cards/GameListCards";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppHeader from "@/features/AppHeader";

export default function Index() {
  const insets = useSafeAreaInsets();
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
    <SafeAreaView style={{flex: 1, paddingTop: insets.top, paddingBottom: insets.bottom, backgroundColor: colors.dark.background,}}>
      <StatusBar barStyle="default" backgroundColor={colors.dark.background }/>
      <AppHeader
        title="Games Repository"
        onUserPress={() => console.log("Perfil")}
      />
      <FlatList
        contentContainerStyle={styles.container}
        data={videogames}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <GameListCards videogame ={item} />}
        numColumns={3}
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
    padding: 5,
    justifyContent: "space-between",
    backgroundColor: colors.dark.background,
  },
});
