import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
  StatusBar,
  Pressable,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import { colors } from "@/constants/colors";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getAll } from "@/features/videogames/api";
import GameListCards from "@/features/videogames/GameListCards";
import GameDetailsCard from "@/features/videogames/details/GameDetailsCard";
import AppHeader from "@/features/header/AppHeader";
import { useSupabase } from "@/lib/SupabaseProvider";

const PAGE_SIZE = 50;

export default function HomeScreen() {
  const { session } = useSupabase();
  const [detailVisible, setDetailVisible] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<number>();
  const [activeTab, setActiveTab] = useState<"search" | "mygames">("search");
  const [favorites, setFavorites] = useState<any[]>([]);
  const insets = useSafeAreaInsets();

  const fetchVideogames = ({ pageParam = 0 }) =>
    getAll(PAGE_SIZE, pageParam, session?.access_token ?? "");

  const videogamesQuery = useInfiniteQuery({
    queryKey: ["videogames"],
    initialPageParam: 0,
    queryFn: fetchVideogames,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length < PAGE_SIZE ? undefined : allPages.length * PAGE_SIZE,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const games = videogamesQuery.data?.pages.flat();

  const handleToggleFavorite = (game: any) => {
    if (favorites.some((f) => f.id === game.id)) {
      setFavorites(favorites.filter((f) => f.id !== game.id));
    } else {
      setFavorites([...favorites, game]);
    }
  };

  if (videogamesQuery.isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (videogamesQuery.isError) {
    return (
      <View style={styles.center}>
        <Text>{videogamesQuery.error?.toString()}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        backgroundColor: colors.dark.background,
      }}
    >
      <StatusBar barStyle="default" backgroundColor={colors.dark.background} />
      <AppHeader title="" onUserPress={() => console.log("Perfil")} />

      {/* pestañas */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          backgroundColor: colors.dark.card,
          paddingVertical: 10,
        }}
      >
        <Pressable onPress={() => setActiveTab("search")}>
          <Text
            style={{
              color: activeTab === "search" ? colors.dark.text : "#888",
              fontWeight: activeTab === "search" ? "bold" : "normal",
            }}
          >
            All Games
          </Text>
        </Pressable>

        <Pressable onPress={() => setActiveTab("mygames")}>
          <Text
            style={{
              color: activeTab === "mygames" ? colors.dark.text : "#888",
              fontWeight: activeTab === "mygames" ? "bold" : "normal",
            }}
          >
            My Games
          </Text>
        </Pressable>
      </View>

      {/* cuerpo */}
      {activeTab === "search" ? (
        <FlatList
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.container}
          data={games}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => {
                setSelectedItem(item.id);
                setDetailVisible(true);
              }}
            >
              <GameListCards videogame={item} />
            </Pressable>
          )}
          numColumns={3}
          onEndReached={() =>
            !videogamesQuery.isFetching &&
            videogamesQuery.hasNextPage &&
            videogamesQuery.fetchNextPage()
          }
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            videogamesQuery.isFetchingNextPage ? <ActivityIndicator /> : null
          }
        />
      ) : (
        <FlatList
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.container}
          data={favorites}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => {
                setSelectedItem(item.id);
                setDetailVisible(true);
              }}
            >
              <GameListCards videogame={item} />
            </Pressable>
          )}
          numColumns={3}
        />
      )}

      {/* modal */}
      <Modal visible={detailVisible} animationType="fade" transparent>
        <TouchableWithoutFeedback onPress={() => setDetailVisible(false)}>
          <View style={styles.backdrop} />
        </TouchableWithoutFeedback>
        <GameDetailsCard
          id={selectedItem ?? 0}
          onClose={() => setDetailVisible(false)}
          favorites={favorites}
          onToggleFavorite={handleToggleFavorite}
        />
      </Modal>
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
    backgroundColor: colors.dark.background,
  },
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
});
