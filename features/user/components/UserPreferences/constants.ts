import { platformIcons } from "@/constants/platformIcons";
import type { Genre, LanguageGroup, PlatformCategory } from "./types";

// ─── Genres ───────────────────────────────────────────────────────────────────

export const AVAILABLE_GENRES: Genre[] = [
  { id: 2,  name: "Point-and-click",            slug: "point-and-click" },
  { id: 4,  name: "Fighting",                   slug: "fighting" },
  { id: 5,  name: "Shooter",                    slug: "shooter" },
  { id: 7,  name: "Music",                      slug: "music" },
  { id: 8,  name: "Platform",                   slug: "platform" },
  { id: 9,  name: "Puzzle",                     slug: "puzzle" },
  { id: 10, name: "Racing",                     slug: "racing" },
  { id: 11, name: "Real Time Strategy (RTS)",   slug: "real-time-strategy-rts" },
  { id: 12, name: "Role-playing (RPG)",         slug: "role-playing-rpg" },
  { id: 13, name: "Simulator",                  slug: "simulator" },
  { id: 14, name: "Sport",                      slug: "sport" },
  { id: 15, name: "Strategy",                   slug: "strategy" },
  { id: 16, name: "Turn-based strategy (TBS)",  slug: "turn-based-strategy-tbs" },
  { id: 24, name: "Tactical",                   slug: "tactical" },
  { id: 25, name: "Hack and slash/Beat 'em up", slug: "hack-and-slash-beat-em-up" },
  { id: 26, name: "Quiz/Trivia",                slug: "quiz-trivia" },
  { id: 30, name: "Pinball",                    slug: "pinball" },
  { id: 31, name: "Adventure",                  slug: "adventure" },
  { id: 32, name: "Indie",                      slug: "indie" },
  { id: 33, name: "Arcade",                     slug: "arcade" },
  { id: 34, name: "Visual Novel",               slug: "visual-novel" },
  { id: 35, name: "Card & Board Game",          slug: "card-and-board-game" },
  { id: 36, name: "MOBA",                       slug: "moba" },
];

// ─── Platforms ────────────────────────────────────────────────────────────────

export const PLATFORM_CATEGORIES: PlatformCategory[] = [
  {
    label: "PC",
    icon: platformIcons.PC,
    platforms: [
      { id: 6,  name: "PC (Microsoft Windows)", slug: "win" },
      { id: 3,  name: "Linux",                  slug: "linux" },
      { id: 14, name: "Mac",                    slug: "mac" },
      { id: 13, name: "DOS",                    slug: "dos" },
      { id: 82, name: "Web browser",            slug: "browser" },
    ],
  },
  {
    label: "Console",
    icon: platformIcons.Console,
    platforms: [
      { id: 167, name: "PlayStation 5",     slug: "ps5" },
      { id: 48,  name: "PlayStation 4",     slug: "ps4--1" },
      { id: 9,   name: "PlayStation 3",     slug: "ps3" },
      { id: 8,   name: "PlayStation 2",     slug: "ps2" },
      { id: 7,   name: "PlayStation",       slug: "ps" },
      { id: 169, name: "Xbox Series X|S",   slug: "series-x-s" },
      { id: 49,  name: "Xbox One",          slug: "xboxone" },
      { id: 12,  name: "Xbox 360",          slug: "xbox360" },
      { id: 11,  name: "Xbox",              slug: "xbox" },
      { id: 130, name: "Nintendo Switch",   slug: "switch" },
      { id: 508, name: "Nintendo Switch 2", slug: "switch-2" },
      { id: 41,  name: "Wii U",             slug: "wiiu" },
      { id: 5,   name: "Wii",               slug: "wii" },
      { id: 4,   name: "Nintendo 64",       slug: "n64" },
      { id: 19,  name: "Super Nintendo",    slug: "snes" },
      { id: 18,  name: "NES",               slug: "nes" },
      { id: 21,  name: "Nintendo GameCube", slug: "ngc" },
      { id: 20,  name: "Nintendo DS",       slug: "nds" },
      { id: 37,  name: "Nintendo 3DS",      slug: "3ds" },
      { id: 24,  name: "Game Boy Advance",  slug: "gba" },
      { id: 22,  name: "Game Boy Color",    slug: "gbc" },
      { id: 33,  name: "Game Boy",          slug: "gb" },
      { id: 46,  name: "PlayStation Vita",  slug: "psvita" },
      { id: 38,  name: "PSP",               slug: "psp" },
      { id: 23,  name: "Dreamcast",         slug: "dc" },
    ],
  },
  {
    label: "Smartphone",
    icon: platformIcons.Smartphone,
    platforms: [
      { id: 39, name: "iOS",           slug: "ios" },
      { id: 34, name: "Android",       slug: "android" },
      { id: 55, name: "Legacy Mobile", slug: "mobile" },
      { id: 74, name: "Windows Phone", slug: "winphone" },
      { id: 73, name: "BlackBerry OS", slug: "blackberry" },
    ],
  },
  {
    label: "Retro",
    icon: platformIcons.Retro,
    platforms: [
      { id: 32, name: "Sega Saturn",             slug: "saturn" },
      { id: 29, name: "Sega Mega Drive/Genesis",  slug: "genesis-slash-megadrive" },
      { id: 30, name: "Sega 32X",                slug: "sega32" },
      { id: 35, name: "Sega Game Gear",          slug: "gamegear" },
      { id: 64, name: "Sega Master System",      slug: "sms" },
      { id: 78, name: "Sega CD",                 slug: "sega-cd" },
      { id: 52, name: "Arcade",                  slug: "arcade" },
      { id: 59, name: "Atari 2600",              slug: "atari2600" },
      { id: 62, name: "Atari Jaguar",            slug: "jaguar" },
      { id: 65, name: "Atari 8-bit",             slug: "atari8bit" },
      { id: 67, name: "Intellivision",           slug: "intellivision" },
      { id: 68, name: "ColecoVision",            slug: "colecovision" },
      { id: 70, name: "Vectrex",                 slug: "vectrex" },
      { id: 15, name: "Commodore C64",           slug: "c64" },
      { id: 16, name: "Amiga",                   slug: "amiga" },
      { id: 26, name: "ZX Spectrum",             slug: "zxs" },
      { id: 27, name: "MSX",                     slug: "msx" },
      { id: 50, name: "3DO",                     slug: "3do" },
      { id: 86, name: "TurboGrafx-16",           slug: "turbografx16--1" },
    ],
  },
];

// ─── Languages (grouped) ──────────────────────────────────────────────────────
// Each group shows as a single card; selecting it includes all its variants.

export const LANGUAGE_GROUPS: LanguageGroup[] = [
  {
    label: "Chinese",
    variants: [
      { id: 2, locale: "zh-CN", name: "Chinese (Simplified)" },
      { id: 3, locale: "zh-TW", name: "Chinese (Traditional)" },
    ],
  },
  {
    label: "English",
    variants: [
      { id: 7, locale: "en-US", name: "English" },
      { id: 8, locale: "en-GB", name: "English (UK)" },
    ],
  },
  {
    label: "Spanish",
    variants: [
      { id: 9,  locale: "es-ES", name: "Spanish (Spain)" },
      { id: 10, locale: "es-MX", name: "Spanish (Mexico)" },
    ],
  },
  {
    label: "French",
    variants: [{ id: 12, locale: "fr-FR", name: "French" }],
  },
  {
    label: "Italian",
    variants: [{ id: 15, locale: "it-IT", name: "Italian" }],
  },
  {
    label: "Japanese",
    variants: [{ id: 16, locale: "ja-JP", name: "Japanese" }],
  },
  {
    label: "Korean",
    variants: [{ id: 17, locale: "ko-KR", name: "Korean" }],
  },
  {
    label: "Russian",
    variants: [{ id: 22, locale: "ru-RU", name: "Russian" }],
  },
  {
    label: "German",
    variants: [{ id: 27, locale: "de-DE", name: "German" }],
  },
];
