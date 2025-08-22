// https://docs.expo.dev/guides/using-eslint/
const expoConfig = require("eslint-config-expo/flat");
import pluginQuery from "@tanstack/eslint-plugin-query";

const eslintPluginPrettierRecommended = require("eslint-plugin-prettier/recommended");

export default [
  expoConfig,
  eslintPluginPrettierRecommended,
  ...pluginQuery.configs["flat/recommended"],
  {
    ignores: ["dist/*"],
  },
];
