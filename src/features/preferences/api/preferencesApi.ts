import { api } from "@/src/lib/fetchClient";
import { Preference } from "../domain/preferences";
import { CreatePreferences } from "./dto";


const preferencesEndpoints = {
  root: `/api/preferences`,
  byId: (id: number) => `/api/preferences/${id}`
};

export async function fetchPreferences(): Promise<Preference> {
  const endpoint = preferencesEndpoints.root
  return await api.get(endpoint)
}

export async function updatePreferences(preferences: Preference): Promise<void> {
  const { id, ...body } = preferences

  const endpoint = preferencesEndpoints.byId(id)
  await api.put(endpoint, body)
}

export async function createPreferences(preferences: CreatePreferences): Promise<void> {
  const endpoint = preferencesEndpoints.root
  await api.post(endpoint, preferences);
}
