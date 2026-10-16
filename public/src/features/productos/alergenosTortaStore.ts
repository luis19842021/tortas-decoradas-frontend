import { create } from "zustand";
import { Alergeno } from "./alergenos";

interface AlergenosTortaState {
    idProducto: number | null
    alergenos: Alergeno[]
    establecer: (idProducto: number, alergenos: Alergeno[]) => void
}

export const useAlergenosTorta = create<AlergenosTortaState>((set) => ({
    idProducto: null,
    alergenos: [],
    establecer: (idProducto, alergenos) => set({ idProducto, alergenos }),
}))
