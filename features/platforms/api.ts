import { Platform } from "@/domain/videogames/platform";

const baseURL = `http://${process.env.EXPO_PUBLIC_HOST}`;

export async function getPlatforms(auth_token: string,): Promise<Platform[]> {
  const res = await fetch(`${baseURL}/api/platforms`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${auth_token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText);
  }

  return res.json();
}