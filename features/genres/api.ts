import { Genre } from "@/domain/videogames/genres";

const baseURL = `http://${process.env.EXPO_PUBLIC_HOST}`;

export async function getGenres(auth_token: string,): Promise<Genre[]> {
  const res = await fetch(`${baseURL}/api/genres`, {
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