import { Videogame } from "@/src/shared/models/videogames/videogame";
import { VideogameDetail } from "@/src/shared/models/videogames/videogameDetail";
import { api } from "../fetchClient";

const videogamesAPI = {
  getById: (id: number) => `/api/videogames/${id}`,
  getAll: (limit: number = 100, offset: number = 0) =>
    `/api/videogames?limit=${limit}&offset=${offset}`,
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
