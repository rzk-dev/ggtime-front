export type Languages = {
  id: number;
  name: string;
  locale: string;
};

export const simplifyLanguages = (languages: Languages[]) => {
  const map = new Map<string, Set<string>>();

  languages.forEach(lang => {
    if (!map.has(lang.name)) {
      map.set(lang.name, new Set());
    }
    map.get(lang.name)!.add(lang.type);
  });

  return Array.from(map.entries()).map(([name, types]) => ({
    name,
    types: Array.from(types),
  }));
};
