const primaryColorDark = "#FF9A44";
const primaryColorLight = "#D9711A";

const successColorDark = "#4DDBA0";
const successColorLight = "#1A9A6A";

const dangerColorDark = "#FF6B6B";
const dangerColorLight = "#D9362E";

const warningColorDark = "#FFD24D";
const warningColorLight = "#B8860F";

export const colors = {
  dark: {
    text: "#FFFFFF",
    textSecondary: "#C9C2B8",
    textMuted: "#8F887D",

    background: "#1A1714",
    backgroundElevated: "#221E19",
    card: "#2B2620",
    cardElevated: "#352F27",
    border: "#3F382E",

    tint: primaryColorDark,
    primary: primaryColorDark,
    primaryMuted: "#4A2E0F",
    onPrimary: "#3A1F00",

    addButton: primaryColorDark,
    success: successColorDark,
    onSuccess: "#0A3D26",

    danger: dangerColorDark,
    onDanger: "#3D0F0F",

    warning: warningColorDark,
    onWarning: "#3D2E05",

    tabIconDefault: "#8F887D",
    tabIconSelected: primaryColorDark,

    overlay: "rgba(0,0,0,0.6)",
  },

  light: {
    text: "#1E1A16",
    textSecondary: "#5A5248",
    textMuted: "#8F8778",

    background: "#FAF6F2",
    backgroundElevated: "#FFFFFF",
    card: "#FFFFFF",
    cardElevated: "#F5EEE6",
    border: "#E8DED2",

    tint: primaryColorLight,
    primary: primaryColorLight,
    primaryMuted: "#FCE4CC",
    onPrimary: "#FFFFFF",

    addButton: primaryColorLight,
    success: successColorLight,
    onSuccess: "#FFFFFF",

    danger: dangerColorLight,
    onDanger: "#FFFFFF",

    warning: warningColorLight,
    onWarning: "#FFFFFF",

    tabIconDefault: "#8F8778",
    tabIconSelected: primaryColorLight,

    overlay: "rgba(0,0,0,0.4)",
  },
};
