import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  StatusBar,
  Pressable,
} from "react-native";
import { colors } from "@/constants/colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getAll } from "@/features/videogames/api";
import GameListCard from "@/features/videogames/gameListCard";
import GameDetailCard from "@/features/videogames/details/gameDetailCard";

const PAGE_SIZE = 50;

export default function Index() {
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
      <Text
        style={{
          color: colors.dark.text,
          fontSize: 20,
          textAlign: "center",
          marginVertical: 10,
        }}
      >
        Videogames Repository
      </Text>
      <FlatList
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
            <GameListCard videogame={item} />
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

      {detailVisible && selectedItem && (
        <GameDetailCard
          id={selectedItem}
          onClose={() => setDetailVisible(false)}
        />
      )}
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
