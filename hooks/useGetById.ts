/*import { VideogameDetail } from "@/domain/videogames/videogameDetail";
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
}*/

// Solución GTP

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
        setVideogame(response.data as Videogame); // ahora es un solo objeto
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