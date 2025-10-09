import { colors } from "@/constants/colors";
import { getUserPreferences } from "@/features/user/api";
import { supabase } from "@/lib/supabase";
import { usePreferencesStore } from "@/hooks/usePreferencesStore";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Alert,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";


export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState<any>(null);
  const router = useRouter();

  const { hydrate } = usePreferencesStore();

  const userPref = async () => {
    if (!session?.access_token) throw new Error("No auth token");
    return getUserPreferences(session.access_token);
  };

  const { data } = useQuery({
    queryKey: ["user-preferences"],
    queryFn: userPref,
    enabled: !!session?.access_token,
  });

  useEffect(() => {
    if (data) {
      hydrate({
        platforms: data.platforms ?? [],
        genres: data.genres ?? [],
        gamingHours: data.gamingHours ?? 0,
      });
    }
  }, [data]);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        Alert.alert(error.message);
      } else {
        setSession(data.session);
        router.replace("/home");
      }
    } catch (err: any) {
      Alert.alert(err?.message ?? "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    setLoading(true);
    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.signUp({ email, password });

      if (error) {
        Alert.alert(error.message);
      } else {
        Toast.show({
          type: "success",
          text1: "Account created!",
          text2: session?.user.email ?? "",
        });
        router.replace("/");
      }
    } catch (err: any) {
      Alert.alert(err?.message ?? "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.dark.background }]}>
      <View style={[styles.form, { backgroundColor: colors.dark.card }]}>
        <Text style={[styles.title, { color: colors.dark.textPrimary }]}>GGTime</Text>

        <TextInput
          style={[styles.input, { backgroundColor: colors.dark.surface, borderColor: colors.dark.border, color: colors.dark.textPrimary }]}
          placeholder="Email"
          placeholderTextColor={colors.dark.textSecondary}
          onChangeText={setEmail}
          value={email}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
        />

        <TextInput
          style={[styles.input, { backgroundColor: colors.dark.surface, borderColor: colors.dark.border, color: colors.dark.textPrimary }]}
          placeholder="Password"
          placeholderTextColor={colors.dark.textSecondary}
          onChangeText={setPassword}
          value={password}
          secureTextEntry
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled, { backgroundColor: colors.dark.accent }]}
          disabled={loading}
          onPress={handleLogin}
        >
          {loading ? (
            <ActivityIndicator color={colors.dark.textPrimary} />
          ) : (
            <Text style={[styles.buttonText, { color: colors.dark.textPrimary }]}>Sign In</Text>
          )}
        </TouchableOpacity>

        <Text style={[styles.centered, { color: colors.dark.textSecondary }]}>OR</Text>

        <TouchableOpacity
          style={[styles.button, styles.secondaryButton, { borderColor: colors.dark.accent }]}
          onPress={handleRegister}
          disabled={loading}
        >
          <Text style={[styles.buttonText, styles.secondaryButtonText, { color: colors.dark.accent }]}>
            Create a new account
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  form: {
    width: "100%",
    padding: 24,
    borderRadius: 16,
    shadowColor: colors.dark.background,
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 6,
  },
  title: {
    fontSize: 34,
    fontWeight: "800",
    marginBottom: 22,
    textAlign: "center",
    letterSpacing: 1,
  },
  input: {
    borderWidth: 1,
    padding: 14,
    marginBottom: 16,
    borderRadius: 10,
    fontSize: 16,
  },
  button: {
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 6,
  },
  buttonDisabled: {
    opacity: 0.75,
  },
  buttonText: {
    fontWeight: "600",
    fontSize: 16,
  },
  secondaryButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    marginTop: 12,
  },
  secondaryButtonText: {
    fontWeight: "700",
  },
  centered: {
    textAlign: "center",
    paddingVertical: 12,
    fontSize: 14,
  },
});
