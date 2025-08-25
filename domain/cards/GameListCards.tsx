import React, { useState, useEffect, useRef } from "react";
import { 
  View, Text, Image, StyleSheet, Pressable, Modal, 
  TouchableWithoutFeedback, Animated, Dimensions, ActivityIndicator 
} from "react-native";
import { Videogame } from "@/domain/videogames/videogame";
import { colors } from "@/constants/Colors";
import GameDetailsCard from "@/domain/cards/GameDetailsCard";
import { getPlatformIcon } from "@/constants/platformIcons";

const screenHeight = Dimensions.get("window").height;

type Props = {
  videogame: Videogame;
};

export default function GameListCards({ videogame }: Props) {
  const [modalVisible, setModalVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(screenHeight)).current;

  const [details, setDetails] = useState<any>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const uniqueIcons = Array.from(
    new Set(videogame.platforms.map((p) => getPlatformIcon(p.name)))
  );

  const openModal = () => setModalVisible(true);
  const closeModal = () => {
    Animated.timing(slideAnim, {
      toValue: screenHeight,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setModalVisible(false));
  };

  useEffect(() => {
    if (!modalVisible) return;

    slideAnim.setValue(screenHeight);

    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();

    const fetchDetails = async () => {
      setLoadingDetails(true);
      try {
        const host = process.env.EXPO_PUBLIC_HOST;
        const response = await fetch(`http://${host}/api/videogames/${videogame.id}`);
        const data = await response.json();
        setDetails(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingDetails(false);
      }
    };

    fetchDetails();
  }, [modalVisible]);

  return (
    <>
      <Pressable onPress={openModal} style={styles.card}>
        <Image
          source={{ uri: videogame.cover.url }}
          style={styles.coverImage}
          resizeMode="cover"
        />
        <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
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
        transparent
        animationType="fade"
        onRequestClose={closeModal}
      >
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={styles.backdrop} />
        </TouchableWithoutFeedback>

        <Animated.View
          style={[
            styles.modalContainer,
            { transform: [{ translateY: slideAnim }] },
          ]}
        >
          {loadingDetails ? (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
              <ActivityIndicator size="large" color="#fff" />
            </View>
          ) : details ? (
            <GameDetailsCard videogameDetail={details} onClose={closeModal} />
          ) : (
            <Text style={{ color: "#fff", padding: 20 }}>Error loading details</Text>
          )}
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
    marginTop: 4,
    alignItems: "center",
    maxWidth: "100%",

  },
  platformIcon: {
    width: 25,
    height: 25,
    marginHorizontal: 2,
    marginBottom: 2,
    resizeMode: "contain",
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
