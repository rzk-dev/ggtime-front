import React from "react";
import {
  FlatList,
  Pressable,
  ActivityIndicator,
} from "react-native";
import GameListCard from "./GameListCard";
import { VideogamePreview } from "../domain/videogame";

type Props = {
  games: VideogamePreview[];
  bottomPadding: number;
  onSelect: (id: number) => void;

  onEndReached?: () => void;
  isFetchingNextPage?: boolean;
};

export function GamesGrid({
  games,
  bottomPadding,
  onSelect,
  onEndReached,
  isFetchingNextPage = false,
}: Props) {
  return (
    <FlatList
      style={{ flex: 1 }}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingBottom: bottomPadding,
      }}
      data={games}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <Pressable onPress={() => onSelect(item.id)}>
          <GameListCard videogame={item} />
        </Pressable>
      )}
      numColumns={3}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.5}
      ListFooterComponent={
        isFetchingNextPage ? <ActivityIndicator /> : null
      }
    />
  );
}
