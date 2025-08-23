import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  Modal,
  TouchableWithoutFeedback,
  Animated,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { colors } from "@/constants/colors";
import GameDetailCard from "@/domain/cards/gameDetailCard";
import { getPlatformIcon } from "@/constants/platformIcons";
import { useQuery } from "@tanstack/react-query";
import { getById } from "@/features/videogames/api";

const screenHeight = Dimensions.get("window").height;

type Props = {
  id: number;
};

export default function GameModalTrigger({ id }: Props) {
  const [modalVisible, setModalVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(screenHeight)).current;

  const [details, setDetails] = useState<any>(null);

  const { isLoading, data } = useQuery({
    queryKey: ["videogames", modalVisible, id],
    queryFn: () => getById(id),
  });

  const uniqueIcons =
    !isLoading && data
      ? Array.from(new Set(data.platforms.map((p) => getPlatformIcon(p.name))))
      : [];

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

    setDetails(data);
  }, [modalVisible]);

  return (
    <>
      <Pressable onPress={openModal} style={styles.card}>
        <Image
          source={{ uri: data?.cover.url }}
          style={styles.coverImage}
          resizeMode="cover"
        />
        <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
          {data?.name}
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
          {isLoading ? (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ActivityIndicator size="large" color="#fff" />
            </View>
          ) : details ? (
            <GameDetailCard videogameDetail={details} onClose={closeModal} />
          ) : (
            <Text style={{ color: "#fff", padding: 20 }}>
              Error loading details
            </Text>
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
