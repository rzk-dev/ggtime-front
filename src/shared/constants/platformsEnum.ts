export const platforms: Record<string, string> = {
    "PC": "win",
    "PlayStation": "playstation",
    "Xbox": "xbox",
    "Nintendo": "nintendo",
    "Mobile": "mobile",
    "Retro/Arcade": "retro",
};

export function platformBySlug(platforms: string){
    if(platforms === "win") return "PC";
    if(platforms === "playstation" || "ps4--1"||"ps5") return "PlayStation";
    if(platforms === "xbox") return "Xbox";
    if(platforms === "nintendo") return "Nintendo";
    if(platforms === "mobile") return "Mobile";
    if(platforms === "retro") return "Retro/Arcade";
    return platforms;
}