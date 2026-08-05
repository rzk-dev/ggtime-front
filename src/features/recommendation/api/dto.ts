import { Candidate } from "../domain/candidate";

export interface RecommendationResponse {
  candidate: Candidate
  score: number
}
