import { queryClient } from "@/lib/queryClient";
import { SupabaseProvider, useSupabase } from "@/lib/supabase-context";
import { QueryClientProvider } from "@tanstack/react-query";
import { Redirect, Stack } from "expo-router";
import React from "react";

function AuthenticatedStack() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
}

function GuestStack() {
  return (
    <>
      <Redirect href="/login" />
      <Stack>
        <Stack.Screen name="login/index" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}

function AppNavigator() {
  const { isAuthenticated } = useSupabase();

  return isAuthenticated ? <AuthenticatedStack /> : <GuestStack />;
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <SupabaseProvider>
        <AppNavigator />
      </SupabaseProvider>
    </QueryClientProvider>
  );
}
