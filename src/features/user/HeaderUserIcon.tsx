import React, { useRef, useState } from "react";
import { Pressable, StyleSheet, Image, Modal, Alert, View } from "react-native";
import { colors } from "@/src/shared/constants/colors";
import UserPreferences from "./UserPreferences";
import AccountMenu from "./AccountMenu";
import SettingsModal from "./SettingsModal";
import defaultAvatar from "../../assets/images/default-avatar.png";
import { useSupabase } from "@/src/lib/SupabaseProvider";
import { queryClient } from "@/src/lib/queryClient";

interface Props {
  onPress?: () => void;
}

export default function HeaderUserIcon({ onPress }: Props) {
  const { signout } = useSupabase();
  const iconRef = useRef<View>(null);

  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [anchor, setAnchor] = useState({ x: 0, y: 0, width: 0, height: 0 });

  const handlePress = () => {
    if (onPress) {
      onPress();
    }
    iconRef.current?.measureInWindow((x, y, width, height) => {
      setAnchor({ x, y, width, height });
      setShowAccountMenu(true);
    });
  };

  const handleLogout = () => {
    Alert.alert(
      "Log out",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Log out",
          style: "destructive",
          onPress: () => {
            queryClient.clear();
            signout();
            // TODO: (limpiar AsyncStorage, resetear navigation stack, analytics, etc.)
          },
        },
      ]
    );
  };

  return (
    <>
      <Pressable
        ref={iconRef}
        onPress={handlePress}
        style={({ pressed }) => [styles.button, pressed && styles.pressed]}
      >
        <Image source={defaultAvatar} style={styles.avatar} />
      </Pressable>

      <AccountMenu
        visible={showAccountMenu}
        anchor={anchor}
        onClose={() => setShowAccountMenu(false)}
        onSelectPreferences={() => setShowPreferences(true)}
        onSelectSettings={() => setShowSettings(true)}
        onSelectLogout={handleLogout}
      />

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

      <SettingsModal
        visible={showSettings}
        onClose={() => setShowSettings(false)}
      />
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
