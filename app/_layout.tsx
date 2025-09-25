import { queryClient } from "@/lib/queryClient";
import Toast from "react-native-toast-message";
import { SupabaseProvider, useSupabase } from "@/lib/SupabaseProvider";
import { QueryClientProvider } from "@tanstack/react-query";
import { Redirect, Stack, usePathname } from "expo-router";
import React from "react";

function AppNavigator() {
  const { isAuthenticated } = useSupabase();
  const pathname = usePathname();

  if (!isAuthenticated && pathname !== "/login") {
    return <Redirect href="/login" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="home/index" />
      <Stack.Screen name="login/index" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <SupabaseProvider>
        <AppNavigator />
        <Toast />
      </SupabaseProvider>
    </QueryClientProvider>
  );
}
