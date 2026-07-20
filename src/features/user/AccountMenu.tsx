import React from "react";
import { View, Text, StyleSheet, Modal, Pressable, TouchableWithoutFeedback, Dimensions } from "react-native";
import { useTheme } from "@/src/shared/ThemeProvider";

type Anchor = { x: number; y: number; width: number; height: number };

type Props = {
  visible: boolean;
  anchor: Anchor;
  onClose: () => void;
  onSelectPreferences: () => void;
  onSelectSettings: () => void;
  onSelectLogout: () => void;
};

const MENU_WIDTH = 200;
const MENU_MARGIN = 12;
const ARROW_SIZE = 8;

export default function AccountMenu({
  visible,
  anchor,
  onClose,
  onSelectPreferences,
  onSelectSettings,
  onSelectLogout,
}: Props) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const handlePress = (action: () => void) => {
    onClose();
    setTimeout(action, 150);
  };

  const screenWidth = Dimensions.get("window").width;

  const iconCenterX = anchor.x + anchor.width / 2;
  const distanceFromRightEdge = screenWidth - iconCenterX;

  let menuRight = Math.max(MENU_MARGIN, distanceFromRightEdge - MENU_WIDTH / 2);
  if (menuRight + MENU_WIDTH > screenWidth - MENU_MARGIN) {
    menuRight = screenWidth - MENU_WIDTH - MENU_MARGIN;
  }

  const menuTop = anchor.y + anchor.height + ARROW_SIZE + 4;
  const arrowRightPosition = distanceFromRightEdge - ARROW_SIZE;

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop} />
      </TouchableWithoutFeedback>

      <View
        style={[
          styles.arrow,
          { top: anchor.y + anchor.height - 2, right: arrowRightPosition },
        ]}
        pointerEvents="none"
      />

      <View style={[styles.menu, { top: menuTop, right: menuRight, width: MENU_WIDTH }]}>
        <Pressable
          style={({ pressed }) => [styles.option, pressed && styles.optionPressed]}
          onPress={() => handlePress(onSelectPreferences)}
        >
          <Text style={styles.optionText}>User Preferences</Text>
        </Pressable>

        <View style={styles.divider} />

        <Pressable
          style={({ pressed }) => [styles.option, pressed && styles.optionPressed]}
          onPress={() => handlePress(onSelectSettings)}
        >
          <Text style={styles.optionText}>Settings</Text>
        </Pressable>

        <View style={styles.divider} />

        <Pressable
          style={({ pressed }) => [styles.option, pressed && styles.optionPressed]}
          onPress={() => handlePress(onSelectLogout)}
        >
          <Text style={[styles.optionText, styles.logoutText]}>Log Out</Text>
        </Pressable>
      </View>
    </Modal>
  );
}

const createStyles = (theme: any) =>
  StyleSheet.create({
    backdrop: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    arrow: {
      position: "absolute",
      width: 0,
      height: 0,
      borderLeftWidth: ARROW_SIZE,
      borderRightWidth: ARROW_SIZE,
      borderBottomWidth: ARROW_SIZE,
      borderLeftColor: "transparent",
      borderRightColor: "transparent",
      borderBottomColor: theme.card,
    },
    menu: {
      position: "absolute",
      backgroundColor: theme.card,
      borderRadius: 12,
      overflow: "hidden",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
    },
    option: {
      paddingVertical: 13,
      paddingHorizontal: 16,
    },
    optionPressed: {
      backgroundColor: theme.cardElevated,
    },
    optionText: {
      color: theme.text,
      fontSize: 15,
      fontWeight: "600",
    },
    logoutText: {
      color: theme.danger,
    },
    divider: {
      height: 1,
      backgroundColor: theme.border,
    },
  });
