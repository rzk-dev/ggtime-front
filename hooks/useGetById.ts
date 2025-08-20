import { VideogameDetail } from "@/domain/videogames/videogameDetail";
import { useEffect, useState } from "react";
import axios from "axios";

export function useGetById(id: number) {
  const [videogame, setVideogame] = useState<VideogameDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchVideogame = async () => {
      try {
        setLoading(true);
        setError(null);

        const host = process.env.EXPO_PUBLIC_HOST;

        // 🔹 Petición al endpoint de detalle
        const response = await axios.get(`http://${host}/api/videogames/${id}`);

        // 🔹 Suponemos que el backend devuelve un único objeto
        setVideogame(response.data as VideogameDetail);
      } catch (err) {
        console.error(err);
        setError("Error al cargar los datos del videojuego");
      } finally {
        setLoading(false);
      }
    };

    fetchVideogame();
  }, [id]);

  return { videogame, loading, error };
}