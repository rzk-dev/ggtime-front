import { queryClient } from "@/lib/queryClient";
import { SupabaseProvider, useSupabase } from "@/lib/supabase-context";
import { QueryClientProvider } from "@tanstack/react-query";
import { Redirect, Stack } from "expo-router";
import React from "react";
import { View } from "react-native";

function AuthenticatedStack() {
  return (
    <>
      <Redirect href="/" />
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
      </Stack>
      );
    </>
  );
}

function GuestStack() {
  return (
    <View style={{ flex: 1 }}>
      <Redirect href="/login" />
      <Stack>
        <Stack.Screen name="login/index" options={{ headerShown: false }} />
      </Stack>
    </View>
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
