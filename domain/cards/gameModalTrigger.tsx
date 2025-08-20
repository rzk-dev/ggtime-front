import React, {useState} from "react";
import {View, Text, Image, StyleSheet, Pressable, Modal, TouchableWithoutFeedback, Animated, Dimensions} from "react-native";
import { Videogame } from "@/domain/videogames/videogame";
import  { colors }  from "@/constants/Colors";
import GameDetailCard from "@/domain/cards/gameDetailCard";
import { getPlatformIcon } from "@/constants/platformIcons";
import { useGetById } from "@/hooks/useGetById";

const screenHeight = Dimensions.get("window").height;

type Props = {
  videogame: Videogame;
};
export default function GameModalTrigger({ videogame }: Props) {
  const [modalVisible, setModalVisible] = useState(false);
  const slideAnim = new Animated.Value(screenHeight);
  const uniqueIcons = Array.from(new Set(videogame.platforms.map((p) => getPlatformIcon(p.name))));

  const openModal = () => {
    setModalVisible(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };
    const closeModal = () => {
        Animated.timing(slideAnim, {
        toValue: screenHeight,
        duration: 300,
        useNativeDriver: true,
        }).start(() => setModalVisible(false));
    };

    return (
    <>
        <Pressable onPress={openModal} style={styles.card}>
            <Image
                source={{ uri: videogame.cover.url }}
                style={styles.coverImage}
                resizeMode="cover"
            />
            <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
                {videogame.name}
            </Text>
            <View style={styles.iconsContainer}>
                {uniqueIcons.map((icon, index) => (
                    <Image
                        key={index}
                        source={icon}
                        style={styles.platformIcon}
                        resizeMode="contain"
                    />
                ))}
            </View>
        </Pressable>

    <Modal
      visible={modalVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={closeModal}>
        <TouchableWithoutFeedback onPress={closeModal}>
            <View style={styles.backdrop} />
        </TouchableWithoutFeedback>

        <Animated.View
          style={[styles.modalContainer,
            { transform: [{ translateY: slideAnim }] },
          ]}
        >
            <GameDetailCard videogameDetail={videogame} onClose={closeModal} />
        </Animated.View>
      </Modal>
    </>
    );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.dark.card,
    padding: 5,
    margin: 6,
    borderRadius: 8,
    elevation: 2,
    flex: 1,
    alignItems: "center",
  },
  coverImage: {
    width: "100%",
    height: 100,
    borderRadius: 6,
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    width: "100%",
    textAlign: "center",
    marginBottom: 4,
    color: colors.dark.text,
  },
  iconsContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  platformIcon: {
    width: 25,
    height: 25,
    marginHorizontal: 4,
    marginBottom: 4,
  },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "80%",
    backgroundColor: colors.dark.background,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: "hidden",
    elevation: 10,
  },
});