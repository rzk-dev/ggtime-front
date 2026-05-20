import { BASE_URL } from "@/src/shared/constants/baseUrl";
import { Languages } from "@/src/shared/models/videogames/languages";

export async function getAllLanguages(auth_token: string): Promise<Languages[]>{
    const response = await fetch(`${BASE_URL}/api/languages`, {
        headers: {
            Authorization: `Bearer ${auth_token}`,
        },
    });
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
    }
    return response.json();
}