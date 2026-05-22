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

/* TanStack Query
    TODO: cambiar upsert por POST y PUT 
        POST /api/user -> Crear
        PUT /api/user -> Actualizar
*/
export async function upsertUserPreferences(
    auth_token: string, 
    userPreferences:UserPreference
){
    const response = await fetch(usersAPI.userPreferencesEndpoint(),
    {
        method: 'POST',
        headers: {
        Authorization: `Bearer ${auth_token}`,
        },
        body: JSON.stringify({userPreferences}),
    });
    
    if (!response.ok) {
        throw new Error("Failed to fetch user preferences");
    }

    return response.json();
}