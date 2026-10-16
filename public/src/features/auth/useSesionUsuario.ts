"use client";
import { useAuthStore } from "./authStore";
import type { SesionUsuario } from "./authStore";

export function useSesionUsuario(): SesionUsuario | null {
    return useAuthStore((state) => state.sesion);
}
