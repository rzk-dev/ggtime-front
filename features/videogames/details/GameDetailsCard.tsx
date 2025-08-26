import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  Pressable,
  Dimensions,
} from "react-native";
import { colors } from "@/constants/colors";
import { Companies } from "@/domain/videogames/involvedCompanies";
import { simplifyLanguages } from "@/domain/videogames/languages";
import { useQuery } from "@tanstack/react-query";
import { getById } from "../api";

type Props = {
  id: number;
  onClose: () => void;
};

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function GameDetailsCard({ id, onClose }: Props) {
  const getVideogameDetails = () => getById(id);

  const { isLoading, isError, error, data } = useQuery({
    queryKey: ["videogames", id],
    queryFn: getVideogameDetails,
  });

  const releaseDate = data?.firstReleaseDate
    ? new Date(data?.firstReleaseDate * 1000).toLocaleDateString()
    : "N/A";

  const getCompanyName = (c: any) => c?.company?.name ?? c?.string ?? "";

  const simplifiedLanguages = simplifyLanguages(data?.languageSupports || []);

  const renderCompanyList = (
    type: keyof Companies["companyContribution"],
    label: string,
  ) => {
    const filtered = data?.involvedCompanies.filter(
      (c) => c.companyContribution[type] === true,
    );

    if (filtered?.length === 0) return null;

    return (
      <View style={styles.companySection}>
        <Text style={styles.sectionTitle}>{label}</Text>
        {filtered?.map((c) => (
          <Text key={c.id ?? JSON.stringify(c)} style={styles.text}>
            {getCompanyName(c)}
          </Text>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.outerWrap}>
      <View style={[styles.card, { height: SCREEN_HEIGHT * 0.75 }]}>
        <Pressable onPress={onClose} style={styles.close}>
          <Text style={styles.closeText}>Close</Text>
        </Pressable>
        {data?.cover?.url ? (
          <Image
            source={{ uri: data?.cover.url }}
            style={styles.cover}
            resizeMode="cover"
          />
        ) : null}

        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
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

            <Text style={[styles.metaLabel]}>Average playtime: </Text>
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
    overflow: "hidden",
    padding: 16,
    // shadow (iOS)
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 20,

    // elevation (Android)
    elevation: 20,
  },
  close: {
    padding: 8,
    alignSelf: "flex-end",
  },
  closeText: {
    color: colors.dark.text,
    fontSize: 14,
    fontWeight: "500",
  },
  cover: {
    padding: 14,
    width: 300,
    aspectRatio: 1,
    resizeMode: "contain",
    // top corners visually rounded
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
  },
  content: {
    backgroundColor: "transparent",
  },
  contentContainer: {
    paddingBottom: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.dark.text,
    textAlign: "center",
    marginBottom: 8,
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
