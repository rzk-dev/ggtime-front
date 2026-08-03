export function formatNamedList<T extends { name: string }>(
  items: T[] = []
): string {
  if (items.length === 0) {
    return "N/A"
  }

  return items.map(item => item.name).join(", ")
}
