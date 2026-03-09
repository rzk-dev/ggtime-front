import { User } from "@/domain/user/user";

const baseURL = `http://${process.env.EXPO_PUBLIC_HOST}`;

// ─── Shared types ─────────────────────────────────────────────────────────────

export type Genre = { id: number; name: string; slug: string };
export type Platform = { id: number; name: string; slug: string };
export type Language = { id: number; locale: string; name: string };

export type UserPreferencesPayload = {
  gamingHours: number;
  genres: Genre[];
  platforms: Platform[];
  languages: Language[];
};

// ─── API calls ────────────────────────────────────────────────────────────────

export async function getUserPreferences(auth_token: string): Promise<User> {
  const res = await fetch(`${baseURL}/api/user`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${auth_token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    console.error("Error response body:", text);
    throw new Error(text || `Failed to fetch preferences (${res.status})`);
  }

  return res.json();
}

export async function updateUserPreferences(
  auth_token: string,
  preferences: UserPreferencesPayload,
): Promise<User> {
  const res = await fetch(`${baseURL}/api/user`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${auth_token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(preferences),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Failed to update preferences (${res.status})`);
  }

  console.log("Updated preferences:", preferences);

  return res.json();
}

export async function createUserPreferences(
  auth_token: string,
  preferences: UserPreferencesPayload,
): Promise<User> {
  const res = await fetch(`${baseURL}/api/user`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${auth_token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(preferences),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Failed to create preferences (${res.status})`);
  }

  return res.json();
}