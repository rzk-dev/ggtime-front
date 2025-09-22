import { queryClient } from "@/lib/queryClient";
import { SupabaseProvider, useSupabase } from "@/lib/supabase-context";
import { QueryClientProvider } from "@tanstack/react-query";
import { Stack, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";

function AuthenticatedStack() {
  const { session } = useSupabase();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted) return;

    if (session === null) router.replace("/login");
    else {
      router.replace("/");
    }
  }, [mounted, session]);

  if (!mounted || session === undefined) return null;

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <SupabaseProvider>
        <AuthenticatedStack />
      </SupabaseProvider>
    </QueryClientProvider>
  );
}
