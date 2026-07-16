import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  View,
  StatusBar,
  Pressable,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import * as Haptics from "expo-haptics"; // npx expo install expo-haptics
import { colors } from "@/src/shared/constants/colors";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import { getAll, recommendGame } from "@/src/lib/api/videogameApi";
import GameListCards from "@/src/features/videogames/GameListCards";
import GameDetailsCard from "@/src/features/videogames/details/GameDetailsCard";
import AppHeader from "@/src/features/header/AppHeader";
import { fetchUserPreferences } from "@/src/lib/api/userApi";
import { UserPreference } from "@/src/shared/models/users/userPreferences";
import { TimeToBeat } from "@/src/shared/models/videogames/timeToBeat";
import GameListSkeleton from "@/src/features/videogames/GameListSkeleton";
import EmptyState from "@/src/shared/EmptyState";
import Toast from "@/src/shared/Toast";

const PAGE_SIZE = 50;

export default function HomeScreen() {
  const [detailVisible, setDetailVisible] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<number>();
  const [activeTab, setActiveTab] = useState<"search" | "mygames">("search");
  const [favorites, setFavorites] = useState<any[]>([]);
  const insets = useSafeAreaInsets();

  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (message: string) => {
    setToastMessage(message);
    setToastVisible(true);
  };

  const userPreferenesQuery = useQuery({
    queryKey: ["userPreferences"],
    queryFn: () => fetchUserPreferences(),
  });

  const [recommendationVisible, setRecommendationVisible] = useState<boolean>(false);
  const [recommendedItem, setRecommendedItem] = useState<number>();
  const [recommendedTimeToBeat, setRecommendedTimeToBeat] = useState<TimeToBeat>();

  const recommendation = useMutation({
    mutationFn: (preferences: UserPreference) => recommendGame(preferences),
    onSuccess: (data) => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setRecommendedItem(data.videogameDetails.Id);
      setRecommendedTimeToBeat(data.timeToBeat);
      setRecommendationVisible(true);
    },
    onError: (error) => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      console.error("Recommendation error:", error);
      Alert.alert("Error", "Failed to get recommendation. Please try again.");
    },
  });

  const fetchVideogames = ({ pageParam = 0 }) => getAll(PAGE_SIZE, pageParam);

  const videogamesQuery = useInfiniteQuery({
    queryKey: ["videogames"],
    initialPageParam: 0,
    queryFn: fetchVideogames,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length < PAGE_SIZE ? undefined : allPages.length * PAGE_SIZE,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const games = videogamesQuery.data?.pages.flat() ?? [];

  const handleCardPress = (id: number) => {
    Haptics.selectionAsync();
    setSelectedItem(id);
    setDetailVisible(true);
  };

  const handleRecommendPress = () => {
    if (!userPreferenesQuery.data) {
      showToast("Configura tus preferencias primero para recibir una recomendación");
      return;
    }
    Haptics.selectionAsync();
    recommendation.mutate(userPreferenesQuery.data);
  };

  // ---- Loading state con skeleton ----
  if (videogamesQuery.isLoading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.dark.background }}>
        <StatusBar barStyle="default" backgroundColor={colors.dark.background} />
        <AppHeader title="" onUserPress={() => console.log("Perfil")} />
        <GameListSkeleton count={15} />
      </SafeAreaView>
    );
  }

  // ---- Error state con reintentar ----
  if (videogamesQuery.isError) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.dark.background }}>
        <StatusBar barStyle="default" backgroundColor={colors.dark.background} />
        <AppHeader title="" onUserPress={() => console.log("Perfil")} />
        <EmptyState
          icon="⚠️"
          title="No pudimos cargar los juegos"
          subtitle="Revisa tu conexión a internet e inténtalo de nuevo."
          actionLabel="Reintentar"
          onAction={() => videogamesQuery.refetch()}
        />
      </SafeAreaView>
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
            games.length === 0 && { flex: 1 },
            { paddingBottom: 90 + insets.bottom },
          ]}
          data={games}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => handleCardPress(item.id)}
              style={({ pressed }) => [
                pressed && styles.cardPressed,
              ]}
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
          refreshing={videogamesQuery.isRefetching}
          onRefresh={() => videogamesQuery.refetch()}
          ListEmptyComponent={
            <EmptyState
              icon="🔍"
              title="No encontramos juegos"
              subtitle="Prueba ajustando los filtros o vuelve más tarde."
            />
          }
          ListFooterComponent={
            videogamesQuery.isFetchingNextPage ? (
              <GameListSkeleton count={3} />
            ) : null
          }
        />
      ) : (
        <FlatList
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.container,
            favorites.length === 0 && { flex: 1 },
            { paddingBottom: 90 + insets.bottom },
          ]}
          data={favorites}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => handleCardPress(item.id)}
              style={({ pressed }) => [
                pressed && styles.cardPressed,
              ]}
            >
              <GameListCards videogame={item} />
            </Pressable>
          )}
          numColumns={3}
          ListEmptyComponent={
            <EmptyState
              icon="⭐"
              title="Aún no tienes juegos guardados"
              subtitle="Los juegos que marques como favoritos aparecerán aquí."
            />
          }
        />
      )}

      <Modal
        visible={detailVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setDetailVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setDetailVisible(false)}>
          <View style={styles.backdrop} />
        </TouchableWithoutFeedback>
        <GameDetailsCard
          id={selectedItem ?? 0}
          onClose={() => setDetailVisible(false)}
        />
      </Modal>

      <Modal
        visible={recommendationVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setRecommendationVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setRecommendationVisible(false)}>
          <View style={styles.backdrop} />
        </TouchableWithoutFeedback>
        <GameDetailsCard
          id={recommendedItem ?? 0}
          timeToBeat={recommendedTimeToBeat}
          isRecommendation
          onClose={() => setRecommendationVisible(false)}
        />
      </Modal>

      <View style={styles.bottomBar}>
        <Pressable
          style={({ pressed }) => [
            styles.recommendButtonStyle,
            recommendation.isPending && { opacity: 0.7 },
            pressed && !recommendation.isPending && { opacity: 0.85, transform: [{ scale: 0.98 }] },
          ]}
          onPress={handleRecommendPress}
          disabled={recommendation.isPending}
        >
          <Text style={{ color: colors.dark.text, fontWeight: "bold" }}>
            {recommendation.isPending ? "LOADING..." : "RECOMMEND"}
          </Text>
        </Pressable>
      </View>

      <Toast
        visible={toastVisible}
        message={toastMessage}
        onHide={() => setToastVisible(false)}
        bottomOffset={100 + insets.bottom}
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
    backgroundColor: colors.dark.background,
  },
  cardPressed: {
    opacity: 0.6,
    transform: [{ scale: 0.97 }],
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
