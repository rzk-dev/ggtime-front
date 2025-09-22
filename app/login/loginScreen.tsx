import React from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../routes/routes';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import * as AppleAuthentication from 'expo-apple-authentication';



type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

export default function LoginScreenTEST() {
  const navigation = useNavigation<LoginScreenNavigationProp>();

  const handleLoginWithGoogle = async () => {
    // Aquí validas el login y luego navegas
    navigation.navigate('Home');
  };

  const handleLoginWithApple = async () => {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });
      // signed in
      console.log(credential);
      // sample response provided below
    } catch (e) {
      if (typeof e === 'object' && e !== null && 'code' in e && (e as { code?: string }).code === 'ERR_REQUEST_CANCELED') {
        // handle that the user canceled the sign-in flow
      } else {
        // handle other errors
      }
    }
    navigation.navigate('Home');
  };

  return (
    <View style={styles.container}>
        <View style={{ marginBottom: 20 }}>
            <FontAwesome.Button name="google" backgroundColor="#aa2929ff" onPress={handleLoginWithGoogle}>
            Sign in with Google
            </FontAwesome.Button>
        </View>
        <View>
            <FontAwesome.Button name="apple" backgroundColor="#202020ff" onPress={handleLoginWithApple}>
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