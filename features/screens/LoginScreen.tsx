import { colors } from "@/constants/colors";
import React from "react";
import { View, Text, Image, StyleSheet, Pressable } from "react-native";

export default function LoginScreen() {
    return (
        <View style={styles.container}>
            <Image 
                source={require('@/assets/images/applogo.png')}
                style={styles.logo}
            />
            <Text style={styles.title}>[TEST] Login Screen</Text>
            <View>
                <Pressable style={styles.loginbuton}>
                    <Text style={styles.buttontext}>Login</Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.dark.background
    },
    logo: {
        width: 400,
        height: 400,
        marginBottom: 20
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: colors.dark.text
    },
    loginbuton: {
        marginTop: 20,
        backgroundColor: colors.dark.addButton,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    buttontext: {
        color: colors.dark.text,
        fontSize: 18,
        fontWeight: "bold",
    }
});
