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
import { SafeAreaView } from "react-native-safe-area-context";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { getAll } from "@/features/videogames/api";
import GameListCards from "@/features/videogames/GameListCards";
import GameDetailsCard from "@/features/videogames/details/GameDetailsCard";
import AppHeader from "@/features/header/AppHeader";
import { useSupabase } from "@/lib/SupabaseProvider";
import { colors } from "@/constants/colors";
import { useUserPreferences } from "@/hooks/useUserPreferences";

const PAGE_SIZE = 50;

export default function HomeScreen() {
  const { session } = useSupabase();
  const theme = colors.dark;

  const [detailVisible, setDetailVisible] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<number>();
  const [activeTab, setActiveTab] = useState<"search" | "mygames">("search");
  const [favorites, setFavorites] = useState<any[]>([]);

  const { isLoading, isError } = useUserPreferences();
  if (isError) {
    console.log("UseUserPreferencesError");
  }

  if (isLoading) {
    console.log("UseUserPreferencesLoading");
  }

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
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.accent} />
      </View>
    );
  }

  if (videogamesQuery.isError) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <Text style={{ color: theme.textPrimary }}>
          {videogamesQuery.error?.toString()}
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.background }]}
    >
      <StatusBar barStyle="light-content" backgroundColor={theme.background} />
      <AppHeader title="" onUserPress={() => console.log("Perfil")} />

      <View
        style={[
          styles.tabBar,
          { backgroundColor: theme.card, borderColor: theme.border },
        ]}
      >
        <Pressable
          onPress={() => setActiveTab("search")}
          style={({ pressed }) => [styles.tab, pressed && { opacity: 0.8 }]}
        >
          <Text
            style={{
              color:
                activeTab === "search"
                  ? theme.textPrimary
                  : theme.textSecondary,
              fontWeight: activeTab === "search" ? "700" : "500",
            }}
          >
            All Games
          </Text>
          {activeTab === "search" && (
            <View
              style={[styles.tabIndicator, { backgroundColor: theme.accent }]}
            />
          )}
        </Pressable>

        <Pressable
          onPress={() => setActiveTab("mygames")}
          style={({ pressed }) => [styles.tab, pressed && { opacity: 0.8 }]}
        >
          <Text
            style={{
              color:
                activeTab === "mygames"
                  ? theme.textPrimary
                  : theme.textSecondary,
              fontWeight: activeTab === "mygames" ? "700" : "500",
            }}
          >
            My Games
          </Text>
          {activeTab === "mygames" && (
            <View
              style={[styles.tabIndicator, { backgroundColor: theme.accent }]}
            />
          )}
        </Pressable>
      </View>

      {activeTab === "search" ? (
        <FlatList
          style={{ flex: 1, backgroundColor: theme.surface }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.container}
          data={games}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.itemWrapper}>
              <Pressable
                onPress={() => {
                  setSelectedItem(item.id);
                  setDetailVisible(true);
                }}
                style={({ pressed }) => pressed && { opacity: 0.85 }}
              >
                <GameListCards videogame={item} />
              </Pressable>
            </View>
          )}
          numColumns={3}
          columnWrapperStyle={styles.columnWrapper}
          onEndReached={() =>
            !videogamesQuery.isFetching &&
            videogamesQuery.hasNextPage &&
            videogamesQuery.fetchNextPage()
          }
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            videogamesQuery.isFetchingNextPage ? (
              <View style={styles.footer}>
                <ActivityIndicator size="small" color={theme.accent} />
              </View>
            ) : null
          }
        />
      ) : (
        <FlatList
          style={{ flex: 1, backgroundColor: theme.surface }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.container}
          data={favorites}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.itemWrapper}>
              <Pressable
                onPress={() => {
                  setSelectedItem(item.id);
                  setDetailVisible(true);
                }}
                style={({ pressed }) => pressed && { opacity: 0.85 }}
              >
                <GameListCards videogame={item} />
              </Pressable>
            </View>
          )}
          numColumns={3}
          columnWrapperStyle={styles.columnWrapper}
          ListEmptyComponent={() => (
            <View style={styles.empty}>
              <Text style={{ color: theme.textSecondary }}>
                No favorites yet.
              </Text>
            </View>
          )}
        />
      )}

      <Modal visible={detailVisible} animationType="fade" transparent>
        <TouchableWithoutFeedback onPress={() => setDetailVisible(false)}>
          <View
            style={[styles.backdrop, { backgroundColor: "rgba(0,0,0,0.5)" }]}
          />
        </TouchableWithoutFeedback>
        <GameDetailsCard
          id={selectedItem ?? 0}
          onClose={() => setDetailVisible(false)}
          favorites={favorites}
          onToggleFavorite={handleToggleFavorite}
        />
      </Modal>
      <View style={[styles.bottomBar]}>
        <Pressable
          style={styles.recommendButtonStyle}
          onPress={() => console.log("Recommend Pressed")}
        >
          <Text style={{ color: colors.dark.background, fontWeight: "bold" }}>
            RECOMMEND GAME
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  tabBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  tab: {
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    minWidth: 100,
  },
  tabIndicator: {
    marginTop: 8,
    height: 3,
    width: 36,
    borderRadius: 2,
  },
  container: {
    paddingVertical: 10,
  },
  itemWrapper: {
    flex: 1,
    maxWidth: "33%",
    paddingHorizontal: 6,
    paddingVertical: 8,
    alignItems: "center",
  },
  columnWrapper: {
    justifyContent: "space-between",
    paddingHorizontal: 5,
  },
  footer: {
    paddingVertical: 16,
    alignItems: "center",
  },
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  empty: {
    padding: 24,
    alignItems: "center",
  },
  bottomBar: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 12,
  },

  recommendButtonStyle: {
    flex: 0,
    alignSelf: "center",
    backgroundColor: colors.dark.accent,
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
