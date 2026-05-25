import { Genre } from "@/src/shared/models/videogames/genres";
import { api } from "../fetchClient";

export async function fetchGenres(): Promise<Genre[]> {
  const response = await api.get(`/api/genres`)
  return response;
}
