import { api } from "@/src/lib/fetchClient";
import { Videogame, VideogamePreview } from "../domain/videogame";

const videogamesEndpoints = {
  root: `/api/videogames`,
  byId: (id: number) => `/api/videogames/${id}`
}

export function fetchVideogames(limit: number = 100, offset = 0): Promise<VideogamePreview[]> {
  const endpoint = videogamesEndpoints.root

  return api.get(endpoint, { limit, offset, });
}

export function fetchVideogame(id: number): Promise<Videogame> {
  const endpoint = videogamesEndpoints.byId(id)
  return api.get(endpoint)
}
