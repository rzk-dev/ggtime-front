import React, { useState } from "react";
import { Pressable, StyleSheet, Image, Modal } from "react-native";
import { colors } from "@/src/shared/constants/colors";
import defaultAvatar from "@/src/assets/images/default-avatar.png";
import UserPreferences from "./UserPreferences";

interface Props {
  onPress?: () => void;
}

export default function HeaderUserIcon({ onPress }: Props) {
  const [showPreferences, setShowPreferences] = useState(false);

  const closePreferences = () => setShowPreferences(false)

  const handlePress = () => {
    onPress?.()
    setShowPreferences(true)
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
        onRequestClose={closePreferences}
      >
        <UserPreferences
          onClose={closePreferences}
          onApply={closePreferences}
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
