import React from "react";
import { View, Text, StyleSheet, ScrollView, Pressable, Image } from "react-native";
import { VideogameDetail } from "@/domain/videogames/videogameDetail";
import { colors } from "@/constants/Colors";
import { Companies } from "@/domain/videogames/involvedCompanies";

type Props = {
  videogameDetail: VideogameDetail;
  onClose: () => void;
};

export default function GameDetailCard({ videogameDetail, onClose }: Props) {
  const renderCompanyList = (type: keyof Companies["companyContribution"], label: string) => {
    const filtered = videogameDetail.involvedCompanies.filter(
      (c) => c.companyContribution[type] === true
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
      <Text style={styles.subtitle}>
        Summary: {videogameDetail.storyline || "N/A"}
      </Text>
      <Text style={styles.subtitle}>
        Platforms: {videogameDetail.platforms.map((p) => p.name).join(", ")}
      </Text>
      <Text style={styles.subtitle}>
        Genres: {videogameDetail.genres.map((g) => g.name).join(", ")}
      </Text>
      <Text style={styles.subtitle}>
        Release Date: {new Date(videogameDetail.firstReleaseDate * 1000).toLocaleDateString()}
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
});
