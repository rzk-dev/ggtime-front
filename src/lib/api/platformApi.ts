import { GamePlatforms } from "@/src/shared/models/videogames/platform";
import { api } from "../fetchClient";

export async function fetchPlatforms(): Promise<GamePlatforms[]> {
  const response = await api.get(`/api/platforms`)
  return response;
}
