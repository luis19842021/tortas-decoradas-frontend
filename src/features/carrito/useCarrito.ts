"use client";
import { useCarritoStore } from "./carritoStore";
import type { ItemCarrito } from "./carritoStore";

export function useCarrito(): ItemCarrito[] {
    return useCarritoStore((state) => state.items);
}
