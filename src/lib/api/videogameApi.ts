import { Videogame } from "@/src/shared/models/videogames/videogame";
import { VideogameDetail } from "@/src/shared/models/videogames/videogameDetail";
import { api } from "../fetchClient";
import { UserPreference } from "@/src/shared/models/users/userPreferences";

const videogamesAPI = {
  getById: (id: number) => `/api/videogames/${id}`,
  getAll: (limit: number = 100, offset: number = 0) =>
    `/api/videogames?limit=${limit}&offset=${offset}`,
  recommendation: `/api/videogames/recommend`
};

export async function getById(
  id: number,
): Promise<VideogameDetail> {
  const response = await api.get(videogamesAPI.getById(id));

  return response;
}

export async function getAll(
  limit: number,
  offset: number,
): Promise<Videogame[]> {
  const url = videogamesAPI.getAll(limit, offset)
  const response = await api.get(url)

  return response;
}

export async function recommendGame(
  preferences: UserPreference
): Promise<VideogameDetail> {
  const response = await api.post(videogamesAPI.recommendation, preferences);
  console.log("recommendGame response:", JSON.stringify(response));
  return response;
}