import { Videogame } from "@/domain/videogames/videogame";
import { VideogameDetail } from "@/domain/videogames/videogameDetail";

const baseURL = `http://${process.env.EXPO_PUBLIC_HOST}`;

const videogamesAPI = {
  getById: (id: number) => `${baseURL}/api/videogames/${id}`,
  getAll: (limit: number = 100, offset: number = 0) =>
    `${baseURL}/api/videogames?limit=${limit}&offset=${offset}`,
};

export async function getById(id: number): Promise<VideogameDetail> {
  const response = await fetch(videogamesAPI.getById(id));

  if (!response.ok) {
    throw new Error("Failed to fetch game details");
  }

  return response.json();
}

export async function getAll(
  limit: number,
  offset: number,
): Promise<Videogame[]> {
  console.log("Fetching Page", offset);
  const response = await fetch(videogamesAPI.getAll(limit, offset));

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText);
  }

  return response.json();
}
