import { BASE_URL } from "@/src/shared/constants/baseUrl";
import { GamePlatforms } from "@/src/shared/models/videogames/platform";

export async function fetchPlatforms(auth_token: string): Promise<GamePlatforms[]> {
  const response = await fetch(`${BASE_URL}/api/platforms`, {
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