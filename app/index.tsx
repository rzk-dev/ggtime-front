import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { GameDTO } from './Components/gameDTO';

export default function Index() {
  const axios = require("axios");
  const [games, setGames] = useState<GameDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await axios.get('http://10.0.1.229:8080/api/videogames/');
        setGames(response.data as GameDTO[]);
      } catch (err) {
        console.error(err);
        setError('Error al cargar los datos');
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0000ff" />
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
/*
  const renderItem = ({ item }: { item: GameDTO }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.name}</Text>
      <Text style={styles.text}>{item.summary}</Text>
      <Text style={styles.subtitle}>Géneros:</Text>
      {item.genres.map((genre) => (
        <Text key={genre.id} style={styles.text}>- {genre.name}</Text>
      ))}
      <Text style={styles.subtitle}>Plataformas:</Text>
      {item.platforms.map((platform) => (
        <Text key={platform.id} style={styles.text}>- {platform.name}</Text>
      ))}
      <Text style={styles.subtitle}>Rating de usuarios: {item.usersRating}</Text>
      <Text style={styles.subtitle}>Rating de críticos: {item.criticsRating}</Text>
    </View>
  );
*/
  const renderItem = ({ item }: { item: GameDTO }) => (
    <View style={styles.card}>
      <Text style={styles.title} numberOfLines={2}>{item.name}</Text>
       <Text style={styles.subtitle}>Géneros:</Text>
      {item.genres.map((genre) => (
        <Text key={genre.id} style={styles.text}>- {genre.name}</Text>
      ))}
      <Text style={styles.subtitle}>Plataformas:</Text>
      {item.platforms.map((platform) => (
        <Text key={platform.id} style={styles.text}>- {platform.name}</Text>
      ))}
      <Text style={styles.subtitle}>Rating usuarios: {formatRating(item.usersRating)}</Text>
      <Text style={styles.subtitle}>Rating prensa: {formatRating(item.criticsRating)}</Text>
    </View>
  );
  return (
    <FlatList
      contentContainerStyle={styles.container}
      data={games}
      numColumns={2}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderItem}
    />
  );
}

const formatRating = (rating: number) => {
  return parseFloat(rating.toFixed(1)).toString();
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    padding: 20,
  },
  card: {
    width: '45%',
    height: 220,
    backgroundColor: '#f5f5f5',
    padding: 10,
    margin: 10,
    borderRadius: 8,
    elevation: 2,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    marginTop: 5,
    fontWeight: '600',
  },
  text: {
    fontSize: 12,
  },
});
