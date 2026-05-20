import { Genre } from "@/src/shared/models/videogames/genres";
import { BASE_URL } from "@/src/shared/constants/baseUrl";

export async function getAllGenres(auth_token: string): Promise<Genre[]> {
  const response = await fetch(`${BASE_URL}/api/genres`, {
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