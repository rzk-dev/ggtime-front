import { api } from "@/src/lib/fetchClient";
import { Preference } from "../../preferences/domain/preferences";
import { RecommendationResponse } from "./dto";


const recommendationEndpoints = {
  root: `/api/recommendations`,
}

export async function recommendVideogame(preferences: Preference): Promise<RecommendationResponse> {

  const endpoint = recommendationEndpoints.root
  return await api.post(endpoint, preferences)
}
