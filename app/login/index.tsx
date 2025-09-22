import { supabase } from "@/lib/supabase";
import React, { useState } from "react";
import { View, Text, Alert, Button, TextInput, StyleSheet } from "react-native";
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
    <View style={styles.container}>
      <Text>GGTime</Text>
      <TextInput style={styles.textfield}
        onChangeText={setEmail}
        value={email}
        keyboardType="email-address"
        placeholder="email"
      />
      <TextInput style={styles.textfield}
        onChangeText={setPassword}
        value={password}
        keyboardType="visible-password"
        placeholder="password"
      />

      <View>
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

    </View>
  );
}

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
