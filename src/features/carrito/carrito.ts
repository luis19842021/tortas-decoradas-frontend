"use client";

import { useCarritoStore, type ItemCarrito } from "./carritoStore";

export type { ItemCarrito };

export const CARRITO_ABRIR_EVENT = "carritoAbrir";
export const CARRITO_TOGGLE_EVENT = "carritoToggle";

export function obtenerCarrito(): ItemCarrito[] {
    return useCarritoStore.getState().items;
}

export function agregarAlCarrito(
    item: Omit<ItemCarrito, "id" | "cantidad">,
    cantidad: number = 1
) {
    useCarritoStore.getState().agregar(item, cantidad);

    if (typeof window !== "undefined") {
        window.dispatchEvent(new Event(CARRITO_ABRIR_EVENT));
    }
}

export function quitarDelCarrito(id: string) {
    useCarritoStore.getState().quitar(id);
}

export function actualizarCantidad(id: string, cantidad: number) {
    useCarritoStore.getState().actualizarCantidad(id, cantidad);
}

export function vaciarCarrito() {
    useCarritoStore.getState().vaciar();
}

export function totalCarrito(items: ItemCarrito[]): number {
    return items.reduce((acc, item) => acc + item.precioUnitario * item.cantidad, 0);
}
