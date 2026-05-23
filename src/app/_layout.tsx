import { queryClient } from "@/src/lib/queryClient"; import Toast from "react-native-toast-message";
import { SupabaseProvider, useSupabase } from "@/src/lib/SupabaseProvider";
import { QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import React from "react";

function AppNavigator() {
  const { session } = useSupabase();

  if (session === undefined) {
    return null
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {session
        ? (<Stack.Screen name="(app)/home" />)
        : (<Stack.Screen name="(auth)/login" />)
      }
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
