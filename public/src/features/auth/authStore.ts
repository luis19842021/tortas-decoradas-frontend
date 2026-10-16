"use client";

import { create } from "zustand";
import { useCarritoStore } from "@/features/carrito/carritoStore";

const TOKEN_KEY = "token";

export interface SesionUsuario {
    email: string;
    nombre: string;
    esAdmin: boolean;
    nombreMostrado: string;
}

function capitalizarNombre(nombre: string): string {
    return nombre
        .split(" ")
        .map((palabra) => (palabra ? palabra.charAt(0).toUpperCase() + palabra.slice(1).toLowerCase() : palabra))
        .join(" ");
}

function decodeJwtPayload(token: string): Record<string, unknown> | null {
    try {
        const base64Url = token.split(".")[1];
        if (!base64Url) return null;

        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split("")
                .map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0"))
                .join("")
        );

        return JSON.parse(jsonPayload);
    } catch {
        return null;
    }
}

function leerDeStorage(): SesionUsuario | null {
    if (typeof window === "undefined") return null;

    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return null;

    const payload = decodeJwtPayload(token);
    if (!payload) return null;

    const exp = payload.exp as number | undefined;
    if (exp && Date.now() >= exp * 1000) {
        localStorage.removeItem(TOKEN_KEY);
        useCarritoStore.getState().vaciar();
        return null;
    }

    const email = payload.sub as string | undefined;
    if (!email) return null;

    const nombre = (payload.nombre as string | undefined) || email;
    const esAdmin = payload.esAdmin === true;
    const nombreMostrado = esAdmin ? `Admin ${capitalizarNombre(nombre)}` : capitalizarNombre(nombre);

    return { email, nombre, esAdmin, nombreMostrado };
}

interface AuthState {
    sesion: SesionUsuario | null;
    cargar: () => void;
    guardar: (token: string) => void;
    cerrar: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    sesion: null,

    cargar: () => set({ sesion: leerDeStorage() }),

    guardar: (token: string) => {
        localStorage.setItem(TOKEN_KEY, token);
        set({ sesion: leerDeStorage() });
    },

    cerrar: () => {
        localStorage.removeItem(TOKEN_KEY);
        useCarritoStore.getState().vaciar();
        set({ sesion: null });
    },
}));

if (typeof window !== "undefined") {
    useAuthStore.getState().cargar();

    window.addEventListener("storage", (e) => {
        if (e.key === null || e.key === TOKEN_KEY) {
            useAuthStore.getState().cargar();
        }
    });
}

export function getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(TOKEN_KEY);
}
