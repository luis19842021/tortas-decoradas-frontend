import { apiFetch } from "@/utils/apiFetch";
import { getToken } from "@/features/auth/auth";

export interface ImagenCarrusel {
    espacio: number;
    url: string;
    enlace?: string | null;
}

export function esEnlaceInterno(valor: string | null | undefined): valor is string {
    return !!valor && valor.startsWith("/") && !valor.startsWith("//") && !valor.includes("\\") && !/\s/.test(valor);
}

export async function getCarrusel(): Promise<ImagenCarrusel[]> {
    const response = await apiFetch("/carrusel", { method: "GET" });

    if (!response.ok) {
        return [];
    }

    return await response.json();
}

export async function actualizarImagenCarrusel(espacio: number, archivo: File): Promise<ImagenCarrusel> {
    const formData = new FormData();
    formData.append("imagen", archivo);

    const response = await apiFetch(`/carrusel/${espacio}`, {
        method: "PUT",
        headers: {
            Authorization: `Bearer ${getToken()}`,
        },
        body: formData,
    });

    if (!response.ok) {
        const mensaje = await response.text().catch(() => "");
        throw new Error(mensaje || "Error al subir la imagen");
    }

    return await response.json();
}

export async function eliminarImagenCarrusel(espacio: number): Promise<void> {
    const response = await apiFetch(`/carrusel/${espacio}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${getToken()}`,
        },
    });

    if (!response.ok) {
        throw new Error("Error al eliminar la imagen");
    }
}

export async function actualizarEnlaceCarrusel(espacio: number, enlace: string): Promise<ImagenCarrusel> {
    const response = await apiFetch(`/carrusel/${espacio}/enlace`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ enlace }),
    });

    if (!response.ok) {
        const mensaje = await response.text().catch(() => "");
        throw new Error(mensaje || "Error al guardar el enlace");
    }

    return await response.json();
}
