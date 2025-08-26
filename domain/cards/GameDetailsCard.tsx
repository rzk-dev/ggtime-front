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
import { VideogameDetail } from "@/domain/videogames/videogameDetail";
import { colors } from "@/constants/colors";
import { Companies } from "@/domain/videogames/involvedCompanies";
import { simplifyLanguages } from "@/domain/videogames/languages";

type Props = {
  videogameDetail: VideogameDetail;
  onClose: () => void;
};

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function GameDetailsCard({ videogameDetail, onClose }: Props) {
  const releaseDate = videogameDetail.firstReleaseDate
    ? new Date(videogameDetail.firstReleaseDate * 1000).toLocaleDateString()
    : "N/A";

  const getCompanyName = (c: any) => c?.company?.name ?? c?.string ?? "";

  const simplifiedLanguages = simplifyLanguages(videogameDetail.languageSupports || []);

  const renderCompanyList = (
    type: keyof Companies["companyContribution"],
    label: string
  ) => {
    const filtered = videogameDetail.involvedCompanies.filter(
      (c) => c.companyContribution[type] === true
    );

    if (filtered.length === 0) return null;

    return (
      <View style={styles.companySection}>
        <Text style={styles.sectionTitle}>{label}</Text>
        {filtered.map((c) => (
          <Text key={c.id ?? JSON.stringify(c)} style={styles.text}>
            {getCompanyName(c)}
          </Text>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.outerWrap}>
      <Pressable onPress={onClose} style={styles.close}>
          <Text style={styles.closeText}>✕</Text>
        </Pressable>
      <View style={[styles.card, { width: SCREEN_WIDTH * 1 }]}>
        {videogameDetail.cover?.url ? (
          <Image
            source={{ uri: videogameDetail.cover.url }}
            style={styles.cover}
            resizeMode="cover"
          />
        ) : null}

        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>{videogameDetail.name}</Text>

          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Publisher: </Text>
            <Text style={styles.metaValue}>
              {videogameDetail.involvedCompanies?.length
                ? videogameDetail.involvedCompanies
                    .map((c) => getCompanyName(c))
                    .filter(Boolean)
                    .join(", ")
                : "N/A"}
            </Text>
          </View>

          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Year: </Text>
            <Text style={styles.metaValue}>
              {videogameDetail.firstReleaseDate
                ? new Date(videogameDetail.firstReleaseDate * 1000).getFullYear()
                : "N/A"}
            </Text>

            <Text style={[styles.metaLabel, { marginLeft: 12 }]}>Average playtime: </Text>
            <Text style={styles.metaValue}>{"N/A"}</Text>
          </View>

          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Genres: </Text>
            <Text style={styles.metaValue}>
              {videogameDetail.genres?.map((g) => (g as any).name || g).join(", ") || "N/A"}
            </Text>
          </View>

          <View style={styles.metaRow}>
            <Text style={[styles.metaLabel]}>Platform: </Text>
            <Text style={styles.metaValue}>
              {videogameDetail.platforms?.map((p) => p.name).join(", ") || "N/A"}
            </Text>
          </View>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>Summary</Text>
          <Text style={styles.summaryText}>
            {videogameDetail.summary || "No summary available."}
          </Text>

          <Text style={[styles.sectionTitle, { marginTop: 12 }]}>Languages</Text>
          <Text style={styles.languageData}>
            {simplifiedLanguages.length > 0
              ? simplifiedLanguages
                  .map((lang) => `${lang.name}: ${lang.types.join(", ")}`)
                  .join("\n")
              : "N/A"}
          </Text>

          {/* bottom spacing */}
          <View style={{ height: 12 }} />
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    backgroundColor: "transparent",
  },
  card: {
    backgroundColor: colors.dark.card,
    borderRadius: 14,
    overflow: "hidden",
    // shadow (iOS)
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    // elevation (Android)
    elevation: 20,
    maxHeight: SCREEN_HEIGHT * 0.85,
  },
  close: {
    position: "absolute",
    top: 5,
    right: 5,
    zIndex: 5,
    padding: 8,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  closeText: {
    color: colors.dark.text,
    fontSize: 14,
    fontWeight: "500",
  },
  cover: {
    width: "100%",
    height: "50%",
    // top corners visually rounded
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
  },
  content: {
    backgroundColor: "transparent",
  },
  contentContainer: {
    padding: 16,
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
    marginBottom: 6,
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
