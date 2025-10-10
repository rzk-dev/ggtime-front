import { Preferences } from "@/domain/user/preferences";

const baseURL = `http://${process.env.EXPO_PUBLIC_HOST}`;

export async function getUserPreferences(auth_token: string): Promise<Preferences> {
  const res = await fetch(`${baseURL}/api/user`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${auth_token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Failed to fetch preferences (${res.status})`);
  }

  return res.json();
}


export async function updateUserPreferences(
  auth_token: string,
  preferences: {
    gamingHours: number;
    genres: string[];
    platforms: string[];
  }
): Promise<Preferences> {
  const res = await fetch(`${baseURL}/api/user`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${auth_token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(preferences),
  });
  console.log(preferences.toString());

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Failed to update preferences (${res.status})`);
  }

  return res.json();
}

export async function createUserPreferences(
  auth_token: string,
  preferences: {
    gamingHours: number;
    genres: string[];
    platforms: string[];
  }
): Promise<Preferences> {
  const res = await fetch(`${baseURL}/api/user`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${auth_token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(preferences),
  });
  console.log(preferences.toString());

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Failed to create preferences (${res.status})`);
  }

  return res.json();
}