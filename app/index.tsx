import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { GameDTO } from './Components/gameDTO';

export default function Index() {
  const axios = require("axios");
  const [games, setGames] = useState<GameDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await axios.get('http://10.0.1.229:8080/api/videogames/'); //Usar ip local para conectar con la api
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

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {games.map((game) => (
        <View key={game.id} style={styles.card}>
          <Text style={styles.title}>{game.name}</Text>
          <Text style={styles.text}>{game.summary}</Text>
          <Text style={styles.subtitle}>Géneros:</Text>
          {game.genres.map((genre) => (
            <Text key={genre.id} style={styles.text}>- {genre.name}</Text>
          ))}
          <Text style={styles.subtitle}>Plataformas:</Text>
          {game.platforms.map((platform) => (
            <Text key={platform.id} style={styles.text}>- {platform.name}</Text>
          ))}
          <Text style={styles.subtitle}>Rating de usuarios: {game.usersRating}</Text>
          <Text style={styles.subtitle}>Rating de críticos: {game.criticsRating}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

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
    backgroundColor: '#f5f5f5',
    padding: 15,
    marginBottom: 20,
    borderRadius: 8,
    elevation: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    marginTop: 10,
    fontWeight: '600',
  },
  text: {
    fontSize: 14,
  },
});
