import { supabase } from "@/lib/supabase";
import React, { useState } from "react";
import { View, Text, Alert, Button, TextInput, StyleSheet, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../routes/routes';
import FontAwesome from '@expo/vector-icons/FontAwesome';

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

export default function LoginScreen() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const navigation = useNavigation<LoginScreenNavigationProp>();


  const handleLogin = async () => {
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    //navigation.navigate('Home');

    if (error) {
      Alert.alert(error.message);
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container} style={styles.form}>
        <Text style={styles.title}>GGTime</Text>

        <TextInput style={styles.textfield}
          style={styles.input}
          placeholder="Email"
          onChangeText={setEmail}
          value={email}
          keyboardType="email-address"
        placeholder="email"
          autoCapitalize="none"
        />

        <TextInput style={styles.textfield}
          style={styles.input}
          placeholder="Password"
          onChangeText={setPassword}
          value={password}
          secureTextEntry
        placeholder="password"
        />

        <Button title="Sign In" disabled={loading} onPress={handleLogin} />
      </View>

      {/*<View style={{ marginBottom: 20 }}>
        <FontAwesome.Button name="google" backgroundColor="#aa2929ff" onPress={handleLogin}>
          Sign in with Google
        </FontAwesome.Button>
      </View>

      <View>
        <FontAwesome.Button name="apple" backgroundColor="#202020ff" onPress={handleLogin}>
          Sign in with Apple
        </FontAwesome.Button>
      </View>*/}

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // fill the screen
    justifyContent: "center", // center vertically
    padding: 20,
    backgroundColor: "#fff",
  },
  form: {
    width: "100%",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    marginBottom: 16,
    borderRadius: 8,
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textfield: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    width: 200,
    paddingHorizontal: 10,
  },
});
