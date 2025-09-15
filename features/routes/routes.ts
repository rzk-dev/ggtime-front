import { LoginScreen } from "@/app/login";
import { createStaticNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const RootStack = createNativeStackNavigator({
  screens: {
    Login: LoginScreen,
  },
});

const BaseNavigation = createStaticNavigation(RootStack);

export default BaseNavigation;
