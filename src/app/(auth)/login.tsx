import { supabase } from "@/src/lib/supabase";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  Pressable,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { useTheme } from "@/src/shared/ThemeProvider";

type Mode = "sign-in" | "sign-up";
type Theme = ReturnType<typeof useTheme>["theme"];

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginScreen() {
  const { theme, isDarkMode, toggleDarkMode } = useTheme();
  const styles = useMemo(() => getStyles(theme), [theme]);

  const [mode, setMode] = useState<Mode>("sign-in");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [emailTouched, setEmailTouched] = useState<boolean>(false);
  const [passwordTouched, setPasswordTouched] = useState<boolean>(false);

  const router = useRouter();

  const isSignUp = mode === "sign-up";

  const emailError =
    emailTouched && email.trim().length === 0
      ? "Enter your email"
      : emailTouched && !EMAIL_PATTERN.test(email.trim())
      ? "Enter a valid email address"
      : null;

  const passwordError =
    passwordTouched && password.length === 0
      ? "Enter your password"
      : passwordTouched && isSignUp && password.length < 6
      ? "Use at least 6 characters"
      : null;

  const canSubmit =
    email.trim().length > 0 &&
    EMAIL_PATTERN.test(email.trim()) &&
    password.length > 0 &&
    (!isSignUp || password.length >= 6);

  const handleSubmit = async () => {
    setEmailTouched(true);
    setPasswordTouched(true);
    setFormError(null);

    if (!canSubmit) return;

    setLoading(true);

    if (isSignUp) {
      const {
        data: { session },
        error,
      } = await supabase.auth.signUp({ email: email.trim(), password });

      setLoading(false);

      if (error) {
        setFormError(error.message);
        return;
      }

      Toast.show({
        type: "success",
        text1: "Account created!",
        text2: session?.user.email ?? undefined,
      });
      router.replace("/");
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    setLoading(false);

    if (error) {
      setFormError(error.message);
      return;
    }

    router.replace("/home");
  };

  const toggleMode = () => {
    setMode(isSignUp ? "sign-in" : "sign-up");
    setFormError(null);
    setEmailTouched(false);
    setPasswordTouched(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <Pressable
            onPress={() => toggleDarkMode(!isDarkMode)}
            style={styles.themeToggle}
            hitSlop={8}
          >
            <Text style={styles.themeToggleText}>{isDarkMode ? "Light mode" : "Dark mode"}</Text>
          </Pressable>

          <View style={styles.brandBlock}>
            <Text style={styles.wordmark}>
              GG<Text style={styles.wordmarkAccent}>Time</Text>
            </Text>
            <View style={styles.accentBar} />
            <Text style={styles.tagline}>
              {isSignUp ? "Create an account to start tracking your play." : "Welcome back. Time to play."}
            </Text>
          </View>

          <View style={styles.card}>
            <View style={styles.field}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={[styles.input, emailError && styles.inputError]}
                placeholder="you@example.com"
                placeholderTextColor={theme.textMuted}
                onChangeText={setEmail}
                onBlur={() => setEmailTouched(true)}
                value={email}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!loading}
              />
              {emailError && <Text style={styles.fieldError}>{emailError}</Text>}
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.passwordRow}>
                <TextInput
                  style={[styles.input, styles.passwordInput, passwordError && styles.inputError]}
                  placeholder={isSignUp ? "At least 6 characters" : "Your password"}
                  placeholderTextColor={theme.textMuted}
                  onChangeText={setPassword}
                  onBlur={() => setPasswordTouched(true)}
                  value={password}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  editable={!loading}
                />
                <Pressable
                  onPress={() => setShowPassword((prev) => !prev)}
                  style={styles.showButton}
                  hitSlop={8}
                >
                  <Text style={styles.showButtonText}>{showPassword ? "Hide" : "Show"}</Text>
                </Pressable>
              </View>
              {passwordError && <Text style={styles.fieldError}>{passwordError}</Text>}
            </View>

            {formError && (
              <View style={styles.formErrorBox}>
                <Text style={styles.formErrorText}>{formError}</Text>
              </View>
            )}

            <Pressable
              onPress={handleSubmit}
              disabled={loading}
              style={({ pressed }) => [
                styles.primaryButton,
                pressed && !loading && styles.primaryButtonPressed,
                loading && styles.primaryButtonDisabled,
              ]}
            >
              {loading ? (
                <ActivityIndicator color={theme.onPrimary} size="small" />
              ) : (
                <Text style={styles.primaryButtonText}>
                  {isSignUp ? "Create account" : "Sign in"}
                </Text>
              )}
            </Pressable>

            <View style={styles.switchRow}>
              <Text style={styles.switchText}>
                {isSignUp ? "Already have an account?" : "New to GGTime?"}
              </Text>
              <Pressable onPress={toggleMode} disabled={loading} hitSlop={8}>
                <Text style={styles.switchLink}>
                  {isSignUp ? "Sign in" : "Create an account"}
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const getStyles = (theme: Theme) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.background,
  },
  themeToggle: {
    alignSelf: "flex-end",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: theme.backgroundElevated,
    borderWidth: 1,
    borderColor: theme.border,
    marginBottom: 12,
  },
  themeToggleText: {
    fontSize: 12,
    fontWeight: "600",
    color: theme.textSecondary,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
  },
  brandBlock: {
    alignItems: "center",
    marginBottom: 32,
  },
  wordmark: {
    fontSize: 40,
    fontWeight: "800",
    color: theme.text,
    letterSpacing: 0.5,
  },
  wordmarkAccent: {
    color: theme.primary,
  },
  accentBar: {
    width: 48,
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.primary,
    marginTop: 12,
    marginBottom: 14,
  },
  tagline: {
    fontSize: 14,
    color: theme.textSecondary,
    textAlign: "center",
  },
  card: {
    backgroundColor: theme.card,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: theme.border,
  },
  field: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: theme.textSecondary,
    marginBottom: 6,
  },
  input: {
    backgroundColor: theme.backgroundElevated,
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: theme.text,
  },
  inputError: {
    borderColor: theme.danger,
  },
  passwordRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  passwordInput: {
    flex: 1,
    marginRight: 8,
  },
  showButton: {
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  showButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: theme.primary,
  },
  fieldError: {
    fontSize: 12,
    color: theme.danger,
    marginTop: 6,
  },
  formErrorBox: {
    backgroundColor: theme.backgroundElevated,
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: theme.danger,
  },
  formErrorText: {
    fontSize: 13,
    color: theme.danger,
    textAlign: "center",
  },
  primaryButton: {
    backgroundColor: theme.primary,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonPressed: {
    opacity: 0.85,
  },
  primaryButtonDisabled: {
    opacity: 0.7,
  },
  primaryButtonText: {
    color: theme.onPrimary,
    fontSize: 15,
    fontWeight: "700",
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 18,
  },
  switchText: {
    fontSize: 13,
    color: theme.textSecondary,
    marginRight: 6,
  },
  switchLink: {
    fontSize: 13,
    fontWeight: "700",
    color: theme.primary,
  },
});
