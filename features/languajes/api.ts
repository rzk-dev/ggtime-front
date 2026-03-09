import { Languages } from "@/domain/videogames/languages";

const baseURL = `http://${process.env.EXPO_PUBLIC_HOST}`;

export async function getLanguages(auth_token: string): Promise<Languages[]> {
    const res = await fetch(`${baseURL}/api/languages`, {
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