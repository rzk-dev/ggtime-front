interface PlatformGroup {
  keywords: readonly string[],
  icon: number
}
export const platformIcons = {
  pc: require("@/src/assets/images/generic-pc.png"),
  console: require("@/src/assets/images/generic-console.png"),
  smartphone: require("@/src/assets/images/generic-smartphone.png"),
  retro: require("@/src/assets/images/generic-retro.png"),
} as const;

const PLATFORM_GROUPS: readonly PlatformGroup[] = [
  {
    keywords: ["pc", "windows", "linux", "mac", "browser"],
    icon: platformIcons.pc,
  },
  {
    keywords: [
      "playstation",
      "xbox",
      "nintendo",
      "sega",
      "psp",
      "game boy",
      "wii",
    ],
    icon: platformIcons.console,
  },
  {
    keywords: ["ios", "android", "mobile", "smartphone"],
    icon: platformIcons.smartphone,
  },
]

export const getPlatformIcons = (platformName: string) => {
  const name = platformName.toLowerCase()

  return (
    PLATFORM_GROUPS.find(group =>
      group.keywords.some(keyword => name.includes(keyword))
    )?.icon ?? platformIcons.retro
  );
}
