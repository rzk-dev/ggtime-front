import React from "react";
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  ScrollView,
  Pressable,
  Dimensions,
  ActivityIndicator,
  Platform,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { colors } from "@/src/shared/constants/colors";
import { Companies } from "@/src/shared/models/videogames/involvedCompanies";
import { simplifyLanguages } from "@/src/shared/models/videogames/languages";
import { useQuery } from "@tanstack/react-query";
import { getById } from "../../../lib/api/videogameApi";
import { useSupabase } from "@/src/lib/SupabaseProvider";

type Props = {
  id: number;
  onClose: () => void;
  //favorites: any[];
  //onToggleFavorite: (game: any) => void;
};

const SCREEN_HEIGHT = Dimensions.get("window").height;

export default function GameDetailsCard({
  id,
  onClose,
  //favorites,
  //onToggleFavorite,
}: Props) {
  const { session } = useSupabase();
  const getVideogameDetails = () => getById(id, session?.access_token ?? "");

  const { isLoading, data } = useQuery({
    queryKey: ["videogames", id],
    queryFn: getVideogameDetails,
  });

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(25,25,25,0.5)",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color="white" />
      </View>
    );
  }

  const getCompanyName = (c: any) => c?.company?.name ?? c?.string ?? "";
  const simplifiedLanguages = simplifyLanguages(data?.languageSupports || []);
  //const isFavorite = favorites.some((f) => f.id === data?.id);

  return (
    <View style={styles.outerWrap}>
      <View style={[styles.card, { height: SCREEN_HEIGHT * 0.75 }]}>
        <View style={styles.coverContainer}>
          {data?.cover?.url ? (
            <ImageBackground
              source={{ uri: data?.cover.url }}
              style={styles.cover}
              resizeMode="cover"
            >
              <Pressable onPress={onClose} style={styles.close}>
                <Text style={styles.closeText}>Close</Text>
              </Pressable>

              {/* <Pressable
                onPress={() => onToggleFavorite(data)}
                style={styles.favoriteButton}
              >
                <FontAwesome
                  name={isFavorite ? "heart" : "heart-o"}
                  size={22}
                  color="#fff"
                />
              </Pressable> */}
            </ImageBackground>
          ) : null}
        </View>

        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={true}
        >
          <Text style={styles.title}>{data?.name}</Text>

          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Publisher: </Text>
            <Text style={styles.metaValue}>
              {data?.involvedCompanies?.length
                ? data?.involvedCompanies
                    .map((c) => getCompanyName(c))
                    .filter(Boolean)
                    .join(", ")
                : "N/A"}
            </Text>
          </View>

          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Year: </Text>
            <Text style={styles.metaValue}>
              {data?.firstReleaseDate
                ? new Date(data?.firstReleaseDate * 1000).getFullYear()
                : "N/A"}
            </Text>

            <Text style={{ ...styles.metaLabel, marginLeft: 10 }}>
              Average playtime:{" "}
            </Text>
            <Text style={styles.metaValue}>{"N/A"}</Text>
          </View>

          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Genres: </Text>
            <Text style={styles.metaValue}>
              {data?.genres?.map((g) => (g as any).name || g).join(", ") ||
                "N/A"}
            </Text>
          </View>

          <View style={styles.metaRow}>
            <Text style={[styles.metaLabel]}>Platform: </Text>
            <Text style={styles.metaValue}>
              {data?.platforms?.map((p) => p.name).join(", ") || "N/A"}
            </Text>
          </View>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>Summary</Text>
          <Text style={styles.summaryText}>
            {data?.summary || "No summary available."}
          </Text>

          <View style={styles.divider} />

          <Text style={[styles.sectionTitle]}>Languages</Text>
          <Text style={styles.languageData}>
            {simplifiedLanguages.length > 0
              ? simplifiedLanguages
                  .map((lang) => `${lang.name}: ${lang.types.join(", ")}`)
                  .join("\n")
              : "N/A"}
          </Text>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerWrap: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "transparent",
  },
  card: {
    backgroundColor: colors.dark.card,
    borderRadius: 14,
    ...Platform.select({
      ios: {
        overflow: "hidden",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.35,
        shadowRadius: 20,
      },
      android: {
        elevation: 20,
        overflow: "hidden",
      },
    }),
  },
  coverContainer: {
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    overflow: "hidden",
  },
  cover: {
    width: "100%",
    aspectRatio: 1,
    justifyContent: "flex-start",
    alignItems: "flex-end",
  },
  close: {
    backgroundColor: "rgba(0,0,0,0.4)",
    paddingVertical: 4,
    paddingHorizontal: 8,
    margin: 8,
    borderRadius: 10,
  },
  closeText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  favoriteButton: {
    backgroundColor: "rgba(0,0,0,0.4)",
    padding: 8,
    margin: 8,
    borderRadius: 20,
    position: "absolute",
    bottom: 0,
    right: 0,
  },
  content: {
    backgroundColor: "transparent",
    paddingHorizontal: 14,
  },
  contentContainer: {
    paddingBottom: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.dark.text,
    textAlign: "center",
    marginBottom: 5,
    marginTop: 5,
  },
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
  },
  metaLabel: {
    color: colors.dark.text,
    fontSize: 12,
    opacity: 0.85,
    fontWeight: "700",
  },
  metaValue: {
    color: colors.dark.text,
    fontSize: 12,
    opacity: 0.9,
    fontWeight: "400",
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.06)",
    marginVertical: 12,
  },
  sectionTitle: {
    color: colors.dark.text,
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 6,
  },
  summaryText: {
    color: colors.dark.text,
    fontSize: 13,
    lineHeight: 20,
    opacity: 0.95,
  },
  languageData: {
    color: colors.dark.text,
    marginBottom: 8,
    fontSize: 14,
    lineHeight: 20,
    flexWrap: "wrap",
  },
  companySection: {
    marginBottom: 8,
  },
  text: {
    fontSize: 14,
    color: colors.dark.text,
    marginLeft: 8,
  },
});
