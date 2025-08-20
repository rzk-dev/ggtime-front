/*
import React from "react";
import { View, Text, Image, StyleSheet, Pressable } from "react-native";
import { VideogameDetail } from "@/videogames/videogameDetail";

type Props = {
    videogameDetail: VideogameDetail;
    onClose: () => void;
};
export default function GameDetailCard({ videogameDetail, onClose }: Props) {
    return (
        <View>
            <Image
                    source={{ uri: videogameDetail.cover.url }}
                    style={styles.gamePortrait}
                    resizeMode="cover"
                  />
            <Text>Name: {videogameDetail.name}</Text>
            <Text>Story Line: {videogameDetail.storyline}</Text>
            <Text>Release Date: {new Date(videogameDetail.firstReleaseDate * 1000).toLocaleDateString()}</Text>
            <Text>Rating: {videogameDetail.totalRatingCount}</Text>
            <Text>Platforms: {videogameDetail.platforms.map(p => p.name).join(", ")}</Text>
            <Text>Genres: {videogameDetail.genres.join(", ")}</Text>
            <Text>Age Ratings: {videogameDetail.ageRatings.join(", ")}</Text>
            <Text>Languages: {videogameDetail.languageSupports.join(", ")}</Text>
            <Text>Player Perspective: {videogameDetail.playerPerspectives}</Text>
            <Text>Involved Companies: {videogameDetail.involvedCompanies.map(c => c.company.name).join(", ")}</Text>
            <Text>Cover URL: {videogameDetail.cover.url}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
         gamePortrait: {
        width: "100%",
        height: 200,
        borderRadius: 6,
    },
    title: {
        fontSize: 16,
        fontWeight: "bold",
    },
}) */

    // ChatGPT recommended code for GameDetailCard component:
import React from "react";
import {View, Text, Image, StyleSheet, Pressable, ScrollView,} from "react-native";
import { VideogameDetail } from "@/domain/videogames/videogameDetail";
import { colors } from "@/constants/Colors";
import { Companies } from "@/domain/videogames/involvedCompanies";
import { useGetById } from "@/hooks/useGetById";

type Props = {
  videogameDetail: VideogameDetail;
  onClose: () => void;
};

export default function GameDetailCard({ videogameDetail, onClose }: Props) {
  const { videogame, loading, error } = useGetById(videogameDetail.id);
  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Loading...</Text>
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
    <View style={styles.container}>
      <Pressable onPress={onClose} style={styles.closeButton}>
        <Text style={styles.closeButtonText}>✕</Text>
      </Pressable>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Image
          source={{ uri: videogameDetail.cover.url }}
          style={styles.gamePortrait}
          resizeMode="cover"
        />

        <Text style={styles.title}>Title: {videogameDetail.name}</Text>

        <Text style={styles.storyline}>Summary: {videogameDetail.storyline || "N/A"}</Text>

        <View style={styles.infoContainer}>
          <Text style={styles.label}>
            Release Date:{" "}
            <Text style={styles.value}>
              {new Date(
                videogameDetail.firstReleaseDate * 1000
              ).toLocaleDateString()}
            </Text>
          </Text>

          <Text style={styles.label}>
            Rating:{" "}
            <Text style={styles.value}>
              {videogameDetail.totalRatingCount ?? "N/A"}
            </Text>
          </Text>

          <Text style={styles.label}>
            Platforms:{" "}
            <Text style={styles.value}>
              {videogameDetail.platforms.map((p) => p.name).join(", ")}
            </Text>
          </Text>

          <Text style={styles.label}>
            Genres:{" "}
            <Text style={styles.value}>
              {videogameDetail.genres.join(", ") || "N/A"}
            </Text>
          </Text>

          <Text style={styles.label}>
            Age Ratings:{" "}
            <Text style={styles.value}>
              {videogameDetail.ageRatings.join(", ") || "N/A"}
            </Text>
          </Text>

          <Text style={styles.label}>
            Languages:{" "}
            <Text style={styles.value}>
              {videogameDetail.languageSupports.join(", ") || "N/A"}
            </Text>
          </Text>

          <Text style={styles.label}>
            Player Perspective:{" "}
            <Text style={styles.value}>
              {videogameDetail.playerPerspectives || "N/A"}
            </Text>
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 10,
    backgroundColor: colors.dark.background,
  },
  closeButton: {
    alignSelf: "flex-end",
    padding: 8,
    borderRadius: 50,
    backgroundColor: colors.dark.card,
    marginBottom: 8,
  },
  closeButtonText: {
    fontSize: 18,
    color: colors.dark.text,
  },
  gamePortrait: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.dark.text,
    marginBottom: 8,
  },
  storyline: {
    fontSize: 16,
    color: colors.dark.text,
    marginBottom: 16,
  },
  infoContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    color: colors.dark.text,
    marginBottom: 6,
  },
  value: {
    fontWeight: "normal",
    color: colors.dark.text,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
