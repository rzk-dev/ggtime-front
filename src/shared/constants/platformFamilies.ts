export type PlatformFamily =
  | "pc"
  | "console"
  | "smartphone"
  | "retro";

export function getPlatformFamily(platformName: string): PlatformFamily {
  const name = platformName.toLowerCase();

  if (
    name.includes("pc") ||
    name.includes("windows") ||
    name.includes("linux") ||
    name.includes("mac") ||
    name.includes("browser")
  ) {
    return "pc";
  }

  if (
    name.includes("playstation") ||
    name.includes("xbox") ||
    name.includes("nintendo") ||
    name.includes("sega") ||
    name.includes("psp") ||
    name.includes("game boy") ||
    name.includes("wii")
  ) {
    return "console";
  }

  if (
    name.includes("smartphone") ||
    name.includes("ios") ||
    name.includes("android") ||
    name.includes("mobile")
  ) {
    return "smartphone";
  }

  return "retro";
}
