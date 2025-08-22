import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
} from "react-native";
import { VideogameDetail } from "@/domain/videogames/videogameDetail";
import { colors } from "@/constants/colors";
import { Companies } from "@/domain/videogames/involvedCompanies";
import { simplifyLanguages } from "@/domain/videogames/languages";

type Props = {
  videogameDetail: VideogameDetail;
  onClose: () => void;
};

export default function GameDetailCard({ videogameDetail, onClose }: Props) {
  const simplifiedLanguages = simplifyLanguages(
    videogameDetail.languageSupports,
  );
  const renderCompanyList = (
    type: keyof Companies["companyContribution"],
    label: string,
  ) => {
    const filtered = videogameDetail.involvedCompanies.filter(
      (c) => c.companyContribution[type] === true,
    );

    if (filtered.length === 0) return null;

    return (
      <View style={styles.companySection}>
        <Text style={styles.sectionTitle}>{label}</Text>
        {filtered.map((c) => (
          <Text key={c.id} style={styles.text}>
            {c.string}
          </Text>
        ))}
      </View>
    );
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <Pressable onPress={onClose} style={styles.closeButton}>
        <Text style={styles.closeText}>Close</Text>
      </Pressable>

      <Image
        source={{ uri: videogameDetail.cover.url }}
        style={styles.coverImage}
        resizeMode="contain"
      />
      <Text style={styles.title}>{videogameDetail.name}</Text>

      <Text style={styles.subtitle}>Summary:</Text>
      <Text style={styles.apiText}>{videogameDetail.summary || "N/A"}</Text>

      <Text style={styles.subtitle}>Platforms:</Text>
      <Text style={styles.apiText}>
        {videogameDetail.platforms.map((p) => p.name).join(", ")}
      </Text>

      <Text style={styles.subtitle}>Genres:</Text>
      <Text style={styles.apiText}>
        {videogameDetail.genres.map((g) => g.name).join(", ")}
      </Text>

      <Text style={styles.subtitle}>Release Date:</Text>
      <Text style={styles.apiText}>
        {new Date(videogameDetail.firstReleaseDate * 1000).toLocaleDateString()}
      </Text>

      <Text style={styles.subtitle}>Languages:</Text>
      <Text style={styles.apiText}>
        {simplifiedLanguages
          .map((lang) => `${lang.name} (${lang.types.join(", ")}`)
          .join("; ")}
      </Text>

      {renderCompanyList("publisher", "Publisher")}
      {renderCompanyList("supporter", "Supporter")}
      {renderCompanyList("porting", "Porting")}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: colors.dark.background,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  closeButton: {
    alignSelf: "flex-end",
    marginBottom: 10,
    padding: 5,
    backgroundColor: colors.dark.tint,
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
    fontSize: 16,
    fontWeight: "bold",
    color: colors.dark.text,
    marginBottom: 4,
  },
  storyline: {
    fontSize: 14,
    color: colors.dark.text,
    marginTop: 10,
    lineHeight: 20,
  },
  coverImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 10,
    color: colors.dark.text,
  },
  text: {
    fontSize: 14,
    color: colors.dark.text,
    marginLeft: 8,
  },
  companySection: {
    marginBottom: 8,
  },
  apiText: {
    color: colors.dark.text,
  },
  languagesContainer: {
    marginTop: 12,
    paddingHorizontal: 10,
  },
  languagesTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 6,
  },
  languageItem: {
    fontSize: 14,
    marginBottom: 4,
    color: "#555",
  },
});
