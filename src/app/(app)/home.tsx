import React, { useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  StatusBar,
  Pressable,
} from "react-native";
import { colors } from "@/src/shared/constants/colors";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import AppHeader from "@/src/features/header/AppHeader";
import { fetchUserPreferences } from "@/src/lib/api/userApi";
import { useVideogames } from "@/src/features/videogames/hooks/useVideogames";
import GameDetailModal from "@/src/features/videogames/components/GameDetailModal";
import { GamesGrid } from "@/src/features/videogames/components/GamesGrid";
import { RecommendationModal } from "@/src/features/recommendation/components/RecommendationModal";
import { Candidate } from "@/src/features/recommendation/domain/candidate";
import { useRecommendVideogame } from "@/src/features/recommendation/hooks/useRecommendVideogame";
import { useVideogameDetailsModal } from "@/src/features/videogames/hooks/useVideogameDetailsModal";


export default function HomeScreen() {

  const gameDetails = useVideogameDetailsModal()
  const insets = useSafeAreaInsets();
  const { games,
    isLoading,
    isError,
    error,
    isFetching,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage
  } = useVideogames();


  const userPreferenesQuery = useQuery({ queryKey: ["userPreferences"], queryFn: () => fetchUserPreferences() });
  const [recommendedCandidate, setRecommendedCandidate] = useState<Candidate>();

  const recommendation = useRecommendVideogame()

  const handleLoadMore = () => {
    if (!isFetching && hasNextPage) {
      fetchNextPage();
    }
  };


  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.center}>
        <Text>{error?.toString()}</Text>
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
      <AppHeader />

      <GamesGrid
        games={games}
        bottomPadding={90 + insets.bottom}
        onSelect={gameDetails.open}
        onEndReached={handleLoadMore}
        isFetchingNextPage={isFetchingNextPage}
      />

      <GameDetailModal id={gameDetails.selectedId}
        visible={gameDetails.visible}
        onClose={gameDetails.close} />

      <RecommendationModal
        visible={!!recommendedCandidate}
        candidate={recommendedCandidate}
        onClose={() => setRecommendedCandidate(undefined)}
      />

      <View
        style={[
          styles.bottomBar,
        ]}
      >
        <Pressable
          style={[
            styles.recommendButtonStyle,
            (!userPreferenesQuery.data || recommendation.isPending) && { opacity: 0.5 }
          ]}
          onPress={() => recommendation.mutate()}
          disabled={recommendation.isPending}
        >
          <Text style={{ color: colors.dark.text, fontWeight: "bold" }}>
            {recommendation.isPending ? "LOADING..." : "RECOMMEND"}
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
