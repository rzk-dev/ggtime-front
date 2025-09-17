// src/screens/LoginScreen.tsx
import React from 'react';
import { View, Text, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../routes/routes';

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

export default function LoginScreen() {
  const navigation = useNavigation<LoginScreenNavigationProp>();

  const handleLogin = () => {
    // Aquí validas el login y luego navegas:
    navigation.navigate('Home');
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Pantalla de Login</Text>
      <Button title="Entrar" onPress={handleLogin} />
    </View>
  );
}
