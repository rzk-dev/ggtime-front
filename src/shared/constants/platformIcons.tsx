export const platformIcons: { [key: string]: any } = {
  PC: require("@/assets/images/generic-pc.png"),
  Console: require("@/assets/images/generic-console.png"),
  Retro: require("@/assets/images/generic-retro.png"),
  Smartphone: require("@/assets/images/generic-smartphone.png"),
};


export function getPlatformIcon(platformName: string) {
  const name = platformName.toLowerCase();

  if (name.includes("pc") || name.includes("windows") || name.includes("linux") || name.includes("mac") || name.includes("browser")) {
    return platformIcons.PC;
  }
  if (name.includes("playstation") || name.includes("xbox") || name.includes("nintendo") || name.includes("sega") || name.includes("psp") || name.includes("game boy") || name.includes("wii")) {
    return platformIcons.Console;
  }
  if (name.includes("smartphone") || name.includes("ios") || name.includes("android") || name.includes("mobile")) {
    return platformIcons.Smartphone;
  }
  return platformIcons.Retro;
}
