import { supabase } from "@/lib/supabase";
import React, { useState } from "react";
import { View, Text, Alert, Button, TextInput } from "react-native";

export default function LoginScreen() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleLogin = async () => {
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      Alert.alert(error.message);
      setLoading(false);
    }
  };

  return (
    <View>
      <Text>GGTime</Text>
      <TextInput
        onChangeText={setEmail}
        value={email}
        keyboardType="email-address"
      />
      <TextInput
        onChangeText={setPassword}
        value={password}
        keyboardType="visible-password"
      />

      <View>
        <Button title="Sign In" disabled={loading} onPress={handleLogin} />
      </View>
    </View>
  );
}
