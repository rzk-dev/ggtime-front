import { Platform } from "@/src/domain/catalog/platform"
import { api } from "@/src/lib/fetchClient"

const platformsEndpoints = {
  root: `/api/platforms`
}

export async function fetchPlatforms(): Promise<Platform[]> {
  return api.get(platformsEndpoints.root)
}
