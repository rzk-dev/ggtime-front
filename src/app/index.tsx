import { Redirect } from "expo-router";
import { useSupabase } from "@/src/lib/SupabaseProvider";
import { ActivityIndicator, View } from "react-native";

export default function Index() {
  const { session, isReady } = useSupabase();

  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }


  if (session) {
    return <Redirect href="/(app)/home" />;
  }

  return <Redirect href="/(auth)/login" />;
}
