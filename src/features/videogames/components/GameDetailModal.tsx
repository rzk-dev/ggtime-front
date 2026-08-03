import { Modal, StyleSheet, TouchableWithoutFeedback, View } from "react-native";
import GameDetailCard from "./GameDetailCard";

type Props = {
  visible: boolean;
  id?: number;
  onClose: () => void;
};

export default function GameDetailModal({
  visible,
  id,
  onClose,
}: Props) {
  return (
    <Modal visible={visible} animationType="fade" transparent>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop} />
      </TouchableWithoutFeedback>

      {id !== undefined && (
        <GameDetailCard
          id={id}
          onClose={onClose}
        />
      )}
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
})
