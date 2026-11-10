"use client";
import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaBoxOpen, FaCog, FaSignOutAlt, FaUserCircle } from "react-icons/fa";
import { useOutsideClick } from "@/utils/useOutsideClick";
import { cerrarSesion } from "./auth";

interface Props {
    nombre: string;
    esAdmin?: boolean;
}

export default function AvatarUsuario({ nombre, esAdmin = false }: Props) {
    const [abierto, setAbierto] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const router = useRouter();

    useOutsideClick(ref, () => setAbierto(false));

    const handleCerrarSesion = () => {
        cerrarSesion();
        setAbierto(false);
        router.push("/");
    };

    const inicial = nombre.trim().charAt(0).toUpperCase() || "?";

    return (
        <div ref={ref} className="relative flex items-center">
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
                <Image
                    src="/cabeza.png"
                    alt=""
                    width={40}
                    height={40}
                    className="w-8 h-8 object-contain drop-shadow"
                />
            </div>

            <button
                type="button"
                onClick={() => setAbierto((v) => !v)}
                className="bg-mio2 hover:bg-mio text-white font-semibold h-8 w-24 rounded-full flex items-center justify-center cursor-pointer border-2 border-white shadow px-2 transition-colors"
                title={nombre}
            >
                <span className="font-bold text-sm truncate">{nombre}</span>
            </button>

            <div
                title="Configuración"
                className="absolute -bottom-1 -right-1 bg-white text-mio2 rounded-full w-[18px] h-[18px] flex items-center justify-center border border-mio2 shadow pointer-events-none"
            >
                <FaCog size={10} />
            </div>

            {abierto && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-cyan-100 overflow-hidden z-50 animate-[fadeIn_0.15s_ease-out]">
                    <div className="bg-gradient-to-br from-mio2 to-mio px-4 py-4 flex items-center gap-3">
                        <div className="w-11 h-11 shrink-0 rounded-full bg-white/20 border-2 border-white/70 flex items-center justify-center text-white font-bold text-lg">
                            {inicial}
                        </div>
                        <div className="min-w-0">
                            <p className="text-white font-semibold truncate">{nombre}</p>

                        </div>
                    </div>

                    <div className="py-2">
                        {esAdmin ? (
                            <Link
                                href="/configuracionesAdmi"
                                onClick={() => setAbierto(false)}
                                className="flex items-center gap-3 w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-cyan-50 hover:text-cyan-900 cursor-pointer transition-colors"
                            >
                                <FaCog className="text-mio2" size={15} />
                                Configuraciones
                            </Link>
                        ) : (
                            <Link
                                href="/historial"
                                onClick={() => setAbierto(false)}
                                className="flex items-center gap-3 w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-cyan-50 hover:text-cyan-900 cursor-pointer transition-colors"
                            >
                                <FaBoxOpen className="text-mio2" size={15} />
                                Ver historial de compras
                            </Link>
                        )}
                        <Link
                            href="/perfil"
                            onClick={() => setAbierto(false)}
                            className="flex items-center gap-3 w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-cyan-50 hover:text-cyan-900 cursor-pointer transition-colors"
                        >
                            <FaUserCircle className="text-mio2" size={15} />
                            Mi perfil
                        </Link>
                    </div>

                    <div className="border-t border-gray-100 py-2">
                        <button
                            type="button"
                            onClick={handleCerrarSesion}
                            className="flex items-center gap-3 w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 cursor-pointer transition-colors"
                        >
                            <FaSignOutAlt size={15} />
                            Cerrar sesión
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
