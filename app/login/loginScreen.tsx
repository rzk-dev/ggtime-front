import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../routes/routes';
import FontAwesome from '@expo/vector-icons/FontAwesome';


type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

export default function LoginScreen() {
  const navigation = useNavigation<LoginScreenNavigationProp>();

  const handleLogin = () => {
    // Aquí validas el login y luego navegas
    navigation.navigate('Home');
  };

  return (
    <View style={styles.container}>
        <View style={{ marginBottom: 20 }}>
            <FontAwesome.Button name="google" backgroundColor="#aa2929ff" onPress={handleLogin}>
            Sign in with Google
            </FontAwesome.Button>
        </View>
        <View>
            <FontAwesome.Button name="apple" backgroundColor="#202020ff" onPress={handleLogin}>
            Sign in with Apple
            </FontAwesome.Button>
        </View>

    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});