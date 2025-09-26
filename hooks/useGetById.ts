import { Videogame } from "@/domain/videogames/videogame";
import { useEffect, useState } from "react";
import axios from "axios";

export function useGetById(id: number) {
  const [videogame, setVideogame] = useState<Videogame | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideogame = async () => {
      try {
        const host = process.env.EXPO_PUBLIC_HOST;
        const response = await axios.get(`http://${host}/api/videogames/${id}`);
        setVideogame(response.data as Videogame);
      } catch (err) {
        console.error(err);
        setError("Error loading data");
      } finally {
        setLoading(false);
      }
    };

    fetchVideogame();
  }, [id]);

  return { videogame, loading, error };
}
