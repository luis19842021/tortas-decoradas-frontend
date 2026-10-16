"use client";

import { useAuthStore, getToken, type SesionUsuario } from "./authStore";

export type { SesionUsuario };
export { getToken };

export function getSesionUsuario(): SesionUsuario | null {
    return useAuthStore.getState().sesion;
}

export function guardarSesion(token: string) {
    useAuthStore.getState().guardar(token);
}

export function cerrarSesion() {
    useAuthStore.getState().cerrar();
}
