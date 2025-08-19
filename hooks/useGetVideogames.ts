import { Videogame } from "@/domain/videogames/videogame";
import { useEffect, useState } from "react";
import axios from "axios";

export function useGetVideogames(id: string) {
  const [videogames, setVideogames] = useState<Videogame[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideogames = async () => {
      try {
        const host = process.env.EXPO_PUBLIC_HOST;

        const response = await axios.get(`http://${host}/api/videogames/${id}`);
        //const response = await axios.get(`http://${host}/api/videogames/95069`);

        setVideogames(response.data as Videogame[]);
      } catch (err) {
        console.error(err);
        setError("Error loading data");
      } finally {
        setLoading(false);
      }
    };

    fetchVideogames();
  }, []);

  return { videogames, loading, error };
}
