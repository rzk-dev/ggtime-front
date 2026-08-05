import { Modal, StyleSheet, TouchableWithoutFeedback, View } from "react-native";
import GameDetailCard from "@/src/features/videogames/components/GameDetailCard";
import { Candidate } from "../domain/candidate";

type Props = {
  visible: boolean;
  candidate?: Candidate;
  onClose: () => void;
};

export function RecommendationModal({
  visible,
  candidate,
  onClose,
}: Props) {
  if (!candidate) {
    return null;
  }

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop} />
      </TouchableWithoutFeedback>

      <GameDetailCard
        id={candidate.id}
        onClose={onClose}
      />
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
