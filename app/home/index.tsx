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

const PAGE_SIZE = 50;

export default function HomeScreen() {
    const [detailVisible, setDetailVisible] = useState<boolean>(false);
    const [selectedItem, setSelectedItem] = useState<number>();
    const insets = useSafeAreaInsets();
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

  const games = videogamesQuery.data?.pages.flat();

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

      <Modal visible={detailVisible} animationType="fade" transparent>
        <TouchableWithoutFeedback onPress={() => setDetailVisible(false)}>
          <View style={styles.backdrop} />
        </TouchableWithoutFeedback>
        <GameDetailsCard
          id={selectedItem ?? 0}
          onClose={() => setDetailVisible(false)}
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
