"use client";

import { create } from "zustand";

export interface ItemCarrito {
    id: string;
    idProducto: number;
    nombre: string;
    imagen: string;
    tipo: string;
    categoria: string;
    descripcion: string;
    precioUnitario: number;
    cantidad: number;
}

const CARRITO_KEY = "carrito";

function leerDeStorage(): ItemCarrito[] {
    if (typeof window === "undefined") return [];

    try {
        const guardado = localStorage.getItem(CARRITO_KEY);
        return guardado ? JSON.parse(guardado) : [];
    } catch {
        return [];
    }
}

function guardarEnStorage(items: ItemCarrito[]) {
    if (typeof window !== "undefined") {
        localStorage.setItem(CARRITO_KEY, JSON.stringify(items));
    }
}

interface CarritoState {
    items: ItemCarrito[];
    cargar: () => void;
    agregar: (item: Omit<ItemCarrito, "id" | "cantidad">, cantidad?: number) => void;
    quitar: (id: string) => void;
    actualizarCantidad: (id: string, cantidad: number) => void;
    vaciar: () => void;
}

export const useCarritoStore = create<CarritoState>((set, get) => ({
    items: [],

    cargar: () => set({ items: leerDeStorage() }),

    agregar: (item, cantidad = 1) => {
        const nuevoItem: ItemCarrito = {
            ...item,
            id: `${item.idProducto}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            cantidad,
        };
        const items = [...get().items, nuevoItem];
        guardarEnStorage(items);
        set({ items });
    },

    quitar: (id) => {
        const items = get().items.filter((item) => item.id !== id);
        guardarEnStorage(items);
        set({ items });
    },

    actualizarCantidad: (id, cantidad) => {
        if (cantidad < 1) return;

        const items = get().items.map((item) =>
            item.id === id ? { ...item, cantidad } : item
        );
        guardarEnStorage(items);
        set({ items });
    },

    vaciar: () => {
        guardarEnStorage([]);
        set({ items: [] });
    },
}));

if (typeof window !== "undefined") {
    useCarritoStore.getState().cargar();

    window.addEventListener("storage", (e) => {
        if (e.key === null || e.key === CARRITO_KEY) {
            useCarritoStore.getState().cargar();
        }
    });
}
