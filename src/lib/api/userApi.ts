import { UserPreference } from "@/src/shared/models/users/userPreferences";
import { api } from "../fetchClient";


const usersAPI = {
  userPreferencesEndpoint: () => `/api/user`,
};

export async function fetchUserPreferences() {
  const url = usersAPI.userPreferencesEndpoint()
  const response = await api.get(url)
  return response
}

export async function updateUserPreferences(preferences: UserPreference): Promise<void> {
  const url = usersAPI.userPreferencesEndpoint()
  await api.put(url, preferences)
}

export async function createUserPreferences(preferences: UserPreference): Promise<void> {
  const url = usersAPI.userPreferencesEndpoint()
  await api.post(url, preferences);
}
