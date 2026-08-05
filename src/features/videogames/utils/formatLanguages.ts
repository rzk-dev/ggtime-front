import { Language } from "@/src/domain/catalog/language";

export const formatLanguages = (languages: Language[]): string => {
  if (languages.length === 0) {
    return "N/A"
  }

  return languages.map(languages => languages.name).join(", ")
}
