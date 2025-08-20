/*import React from "react";
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
*/

// Solución GTP
import React from "react";
import { View, Text, StyleSheet, ScrollView, Pressable, Image } from "react-native";
import { VideogameDetail } from "@/domain/videogames/videogameDetail";
import { colors } from "@/constants/Colors";

type Props = {
  videogameDetail: VideogameDetail;
  onClose: () => void;
};

export default function GameDetailCard({ videogameDetail, onClose }: Props) {
  return (
    <ScrollView style={styles.container}>
      <Pressable onPress={onClose} style={styles.closeButton}>
        <Text style={styles.closeText}>Cerrar</Text>
      </Pressable>
      <Image
        source={{ uri: videogameDetail.cover.url }}
        style={styles.coverImage}
        resizeMode="cover"
      />
      <Text style={styles.title}>{videogameDetail.name}</Text>
      <Text style={styles.subtitle}>Summary: {videogameDetail.storyline || "N/A"}</Text>
      <Text style={styles.subtitle}>Platforms: {videogameDetail.platforms.map(p => p.name).join(", ")}</Text>
      <Text style={styles.subtitle}>Genres: {videogameDetail.genres.map(p => p.name).join(", ")}</Text>
      {/* <Text style={styles.subtitle}>Company: {videogameDetail.involvedCompanies.map(c => c.id).join(", ")}</Text> */}
      <Text style={styles.subtitle}>Release Date: {new Date(videogameDetail.firstReleaseDate * 1000).toLocaleDateString()}</Text>
      <Text style={styles.storyline}>{videogameDetail.storyline}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  closeButton: {
    alignSelf: "flex-end",
    marginBottom: 10,
    padding: 5,
    backgroundColor: colors.dark.card,
    borderRadius: 6,
  },
  closeText: {
    color: colors.dark.text,
    fontWeight: "bold",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: colors.dark.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: colors.dark.text,
    marginBottom: 4,
  },
  storyline: {
    fontSize: 14,
    color: colors.dark.text,
    marginTop: 10,
  },
  coverImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
  },
});
