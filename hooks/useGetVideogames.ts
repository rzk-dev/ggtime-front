import { Videogame } from "@/domain/videogames/videogame";
import { useEffect, useState } from "react";
import axios from 'axios';

export function useGetVideogames() {
  const [videogames, setVideogames] = useState<Videogame[]>([])
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideogames = async () => {
      try {
         const response = await axios.get('http://10.0.1.229:8080/api/videogames/'); //senka-mba
        // const response = await axios.get('http://192.168.1.34:8080/api/videogames/'); //senka-tp440
        // const response = await axios.get('http://192.168.1.16:8080/api/videogames/'); //senka-twr
        // const response = await axios.get('http://192.168.1.46:8080/api/videogames/');

        setVideogames(response.data as Videogame[]);
      } catch (err) {
        console.error(err);
        setError('Error al cargar los datos');
      } finally {
        setLoading(false);
      }
    };

    fetchVideogames();
  }, []);

  return { videogames, loading, error }
}
