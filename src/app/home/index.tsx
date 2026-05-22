import React, { useEffect, useState } from "react";
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
import { colors } from "@/src/shared/constants/colors";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { getAll } from "@/src/lib/api/videogameApi";
import GameListCards from "@/src/features/videogames/GameListCards";
import GameDetailsCard from "@/src/features/videogames/details/GameDetailsCard";
import AppHeader from "@/src/features/header/AppHeader";
import { useSupabase } from "@/src/lib/SupabaseProvider";
import { fetchUserPreferences } from "@/src/lib/api/userApi";
import { fetchPlatforms } from "@/src/lib/api/platformApi";
import { fetchLanguages } from "@/src/lib/api/languageApi";
import { fetchGenres } from "@/src/lib/api/genreApi";

const PAGE_SIZE = 50;

export default function HomeScreen() {
  const { session } = useSupabase();
  const [detailVisible, setDetailVisible] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<number>();
  const [activeTab, setActiveTab] = useState<"search" | "mygames">("search");
  const [favorites, setFavorites] = useState<any[]>([]);
  const insets = useSafeAreaInsets();
  const userPreferenesQuery = useQuery({queryKey: ["userPreferences"], queryFn: () => fetchUserPreferences(session?.access_token ?? "")});
  console.log("User preferences query data:", userPreferenesQuery.data);

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
        backgroundColor: colors.dark.background,
      }}
    >
      <StatusBar barStyle="default" backgroundColor={colors.dark.background} />
      <AppHeader title="" onUserPress={() => console.log("Perfil")} />

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

      {activeTab === "search" ? (
        <FlatList
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.container,
            { paddingBottom: 90 + insets.bottom },
          ]}
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
          contentContainerStyle={[
            styles.container,
            { paddingBottom: 90 + insets.bottom },
          ]}
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

      <View
        style={[
          styles.bottomBar,
        ]}
      >
        <Pressable
          style={styles.recommendButtonStyle}
          onPress={() => console.log("Recommend Pressed")}
        >
          <Text style={{ color: colors.dark.background, fontWeight: "bold" }}>
            RECOMMEND A GAME
          </Text>
        </Pressable>
      </View>
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

  bottomBar: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 10,
  },

  recommendButtonStyle: {
    flex: 0,
    alignSelf: "center",
    backgroundColor: colors.dark.tint,
    paddingVertical: 15,
    paddingHorizontal: 24,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
});
