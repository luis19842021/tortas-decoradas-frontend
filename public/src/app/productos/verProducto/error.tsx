"use client"

import { oi } from "../../ui/fonts";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <div className="flex justify-center pt-16 pb-16">
            <div className="bg-blue-100 w-130 rounded-xl px-6 py-10 text-center">
                <h2 className={`font-bold text-2xl text-cyan-900 ${oi.className}`}>No pudimos cargar este producto</h2>
                <p className="pt-4 text-lg text-gray-700">
                    Ocurrió un problema de conexión. Intentá de nuevo en unos minutos.
                </p>
                <button
                    onClick={() => reset()}
                    className="mt-6 bg-[#0f98c5] hover:bg-[#0d7fbf] text-white font-medium px-6 py-2 rounded-2xl cursor-pointer"
                >
                    Reintentar
                </button>
            </div>
        </div>
    );
}
