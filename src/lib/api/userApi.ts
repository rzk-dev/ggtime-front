import { BASE_URL } from "@/src/shared/constants/baseUrl";
import { UserPreference } from "@/src/shared/models/users/userPreferences";


const usersAPI = {
  userPreferencesEndpoint: () => `${BASE_URL}/api/user`,
};

export async function fetchUserPreferences(auth_token: string){
    const response = await fetch(usersAPI.userPreferencesEndpoint(),
    {
        method: 'GET',
        headers: {
        Authorization: `Bearer ${auth_token}`,
        },
    });

    if (!response.ok) {
        throw new Error("Failed to fetch user preferences");
    }

    return response.json();
}

export async function updateUserPreferences(
  auth_token: string,  
  id: number | null,
  gamingHours: number, 
  genres: UserPreference["genres"], 
  platforms: UserPreference["platforms"], 
  languages: UserPreference["languages"]
): Promise<void> {
  const response = await fetch(`${BASE_URL}/api/user`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${auth_token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id, gamingHours, genres, platforms, languages }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText);
  }
}

export async function createUserPreferences(
  auth_token: string,
  preferences: UserPreference
): Promise<void> {
  const response = await fetch(`${BASE_URL}/api/user`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${auth_token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(preferences),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText);
  }
}