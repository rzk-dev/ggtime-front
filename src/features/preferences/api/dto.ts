import { Preference } from "../domain/preferences"


export type CreatePreferences = Omit<Preference, "id">;
