import { supabase } from "@/src/lib/supabase";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  View,
  Text,
  Alert,
  TextInput,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { colors } from "@/src/shared/constants/colors";

export default function LoginScreen() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleLogin = async () => {
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      Alert.alert(error.message);
    } else {
      router.replace("/home");
    }

    setLoading(false);
  };

  const handleRegister = async () => {
    setLoading(true);
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({ email: email, password: password });

    if (error) {
      Alert.alert(error.message);
    }
    setLoading(false);

    router.replace("/");

    Toast.show({
      type: "success",
      text1: "Account created!",
      text2: session?.user.email,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.form}>
            <View style={styles.headerBlock}>
              <Text style={styles.title}>
                GG<Text style={styles.titleAccent}>Time</Text>
              </Text>
              <View style={styles.titleUnderline} />
              <Text style={styles.subtitle}>Welcome back. Time to play.</Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="you@example.com"
                placeholderTextColor={colors.dark.textMuted}
                onChangeText={setEmail}
                value={email}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <Text style={styles.label}>Password</Text>
              <View style={styles.passwordRow}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="••••••••"
                  placeholderTextColor={colors.dark.textMuted}
                  onChangeText={setPassword}
                  value={password}
                  secureTextEntry={!showPassword}
                />
                <Pressable onPress={() => setShowPassword((prev) => !prev)}>
                  <Text style={styles.showToggle}>
                    {showPassword ? "Hide" : "Show"}
                  </Text>
                </Pressable>
              </View>

              <Pressable
                style={({ pressed }) => [
                  styles.signInButton,
                  pressed && { opacity: 0.85 },
                  loading && { opacity: 0.5 },
                ]}
                onPress={handleLogin}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color={colors.dark.onPrimary} />
                ) : (
                  <Text style={styles.signInButtonText}>Sign in</Text>
                )}
              </Pressable>

              <Text style={styles.footerText}>
                New to GGTime?{" "}
                <Text style={styles.footerLink} onPress={handleRegister}>
                  Create an account
                </Text>
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  form: {
    width: "100%",
    maxWidth: 420,
  },
  headerBlock: {
    alignItems: "center",
    marginBottom: 28,
  },
  title: {
    fontSize: 34,
    fontWeight: "800",
    color: colors.dark.text,
  },
  titleAccent: {
    color: colors.dark.tint,
  },
  titleUnderline: {
    width: 48,
    height: 3,
    backgroundColor: colors.dark.tint,
    borderRadius: 2,
    marginTop: 10,
    marginBottom: 14,
  },
  subtitle: {
    fontSize: 14,
    color: colors.dark.textSecondary,
  },
  card: {
    backgroundColor: colors.dark.card,
    borderWidth: 1,
    borderColor: colors.dark.border,
    borderRadius: 16,
    padding: 20,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.dark.textSecondary,
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    backgroundColor: colors.dark.backgroundElevated,
    borderWidth: 1,
    borderColor: colors.dark.border,
    color: colors.dark.text,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
  },
  passwordRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.dark.backgroundElevated,
    borderWidth: 1,
    borderColor: colors.dark.border,
    borderRadius: 10,
    paddingHorizontal: 14,
  },
  passwordInput: {
    flex: 1,
    color: colors.dark.text,
    paddingVertical: 12,
    fontSize: 14,
  },
  showToggle: {
    color: colors.dark.tint,
    fontWeight: "700",
    fontSize: 13,
    paddingLeft: 10,
  },
  signInButton: {
    backgroundColor: colors.dark.tint,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 22,
  },
  signInButtonText: {
    color: colors.dark.onPrimary,
    fontWeight: "700",
    fontSize: 15,
  },
  footerText: {
    textAlign: "center",
    color: colors.dark.textSecondary,
    fontSize: 13,
    marginTop: 16,
  },
  footerLink: {
    color: colors.dark.tint,
    fontWeight: "700",
  },
});