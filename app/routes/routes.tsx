import { createStackNavigator } from '@react-navigation/stack';
//import LoginScreen from '../login';
import HomeScreen from '../home/homeScreen';

export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
};
const RootStack = createStackNavigator<RootStackParamList>();
export function RootNavigator() {
  return (
    <RootStack.Navigator initialRouteName="Login">
      {/*<RootStack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />*/}
      <RootStack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
    </RootStack.Navigator>
  );
}