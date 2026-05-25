import { Languages } from "@/src/shared/models/videogames/languages";
import { api } from "../fetchClient";

export async function fetchLanguages(): Promise<Languages[]> {
  const response = await api.get(`/api/languages`)
  return response;
}
