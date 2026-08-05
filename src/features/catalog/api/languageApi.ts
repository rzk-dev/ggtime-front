import { Language } from "@/src/domain/catalog/language";
import { api } from "@/src/lib/fetchClient";

const languagesEndpoints = {
  root: `/api/languages`
}

export async function fetchLanguages(): Promise<Language[]> {
  return api.get(languagesEndpoints.root)
}
