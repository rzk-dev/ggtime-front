import { useState } from "react";

export function useVideogameDetailsModal() {
  const [selectedId, setSelectedId] = useState<number>();
  const [visible, setVisible] = useState(false)

  const open = (id: number) => {
    setSelectedId(id)
    setVisible(true)
  }

  const close = () => {
    setVisible(false)
  }

  return { selectedId, visible, open, close }
}
