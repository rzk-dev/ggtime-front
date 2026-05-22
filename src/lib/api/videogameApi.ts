import { BASE_URL } from "@/src/shared/constants/baseUrl";
import { Videogame } from "@/src/shared/models/videogames/videogame";
import { VideogameDetail } from "@/src/shared/models/videogames/videogameDetail";

const videogamesAPI = {
  getById: (id: number) => `${BASE_URL}/api/videogames/${id}`,
  getAll: (limit: number = 100, offset: number = 0) =>
    `${BASE_URL}/api/videogames?limit=${limit}&offset=${offset}`,
};

export async function getById(
  id: number,
  auth_token: string,
): Promise<VideogameDetail> {
  const response = await fetch(videogamesAPI.getById(id), {
    headers: {
      Authorization: `Bearer ${auth_token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch game details");
  }

  return response.json();
}

export async function getAll(
  limit: number,
  offset: number,
  auth_token: string,
): Promise<Videogame[]> {
  const response = await fetch(videogamesAPI.getAll(limit, offset), {
    headers: {
      Authorization: `Bearer ${auth_token}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText);
  }

  return response.json();
}
