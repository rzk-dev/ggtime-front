import React, { useState } from "react";
import { Pressable, StyleSheet, Image, Modal } from "react-native";
import { colors } from "@/src/shared/constants/colors";
import defaultAvatar from "../../assets/images/user-icon-v1.png";
import UserPreferences from "@/features/user/UserPreferences";

interface Props {
  onPress?: () => void;
}

export default function HeaderUserIcon({ onPress }: Props) {
  const [showPreferences, setShowPreferences] = useState(false);

  const handlePress = () => {
    if (onPress) {
      onPress();
    }
    setShowPreferences(true);
  };

  return (
    <>
      <Pressable
        onPress={handlePress}
        style={({ pressed }) => [styles.button, pressed && styles.pressed]}
      >
        <Image source={defaultAvatar} style={styles.avatar} />
      </Pressable>
      <Modal
        visible={showPreferences}
        transparent
        animationType="fade"
        onRequestClose={() => setShowPreferences(false)}
      >
        <UserPreferences
          visible={showPreferences}
          onClose={() => setShowPreferences(false)}
          onApply={() => setShowPreferences(false)}
        />
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    marginRight: 12,
    borderRadius: 20,
    overflow: "hidden",
  },
  pressed: {
    opacity: 0.7,
  },
  avatar: {
    width: 35,
    height: 35,
    backgroundColor: colors.dark.background,
  },
});
