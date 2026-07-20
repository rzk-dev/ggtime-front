import { queryClient } from "@/src/lib/queryClient"; import Toast from "react-native-toast-message";
import { SupabaseProvider } from "@/src/lib/SupabaseProvider";
import { QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import React from "react";
import { ThemeProvider } from "../shared/ThemeProvider";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
      <SupabaseProvider>
        <Stack screenOptions={{ headerShown: false }} />
        <Toast />
      </SupabaseProvider>
    </QueryClientProvider>
    </ThemeProvider>
  );
}
