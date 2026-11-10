"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { oi } from "../ui/fonts";
import { getToken } from "@/features/auth/auth";
import { FaArrowLeft, FaUserCircle } from "react-icons/fa";
import { apiFetch } from "@/utils/apiFetch";

interface Perfil {
    nombre: string;
    apellido: string;
    email: string;
    telefono: string;
}

export default function PerfilPage() {
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [email, setEmail] = useState("");

    const [nombre, setNombre] = useState("");
    const [apellido, setApellido] = useState("");
    const [telefono, setTelefono] = useState("");
    const [guardandoDatos, setGuardandoDatos] = useState(false);
    const [mensajeDatos, setMensajeDatos] = useState<{ tipo: "ok" | "error"; texto: string } | null>(null);

    const [contraseniaActual, setContraseniaActual] = useState("");
    const [contraseniaNueva, setContraseniaNueva] = useState("");
    const [contraseniaConfirmar, setContraseniaConfirmar] = useState("");
    const [guardandoContrasenia, setGuardandoContrasenia] = useState(false);
    const [mensajeContrasenia, setMensajeContrasenia] = useState<{ tipo: "ok" | "error"; texto: string } | null>(
        null
    );

    useEffect(() => {
        const token = getToken();
        if (!token) {
            setError("Tenés que iniciar sesión para ver tu perfil.");
            setCargando(false);
            return;
        }

        apiFetch("/usuarios/mi-perfil", {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => {
                if (!res.ok) throw new Error("No se pudo obtener el perfil.");
                return res.json();
            })
            .then((data: Perfil) => {
                setEmail(data.email);
                setNombre(data.nombre || "");
                setApellido(data.apellido || "");
                setTelefono(data.telefono || "");
            })
            .catch(() => setError("No se pudo cargar tu perfil. Intentá de nuevo más tarde."))
            .finally(() => setCargando(false));
    }, []);

    async function handleGuardarDatos(e: React.FormEvent) {
        e.preventDefault();
        setMensajeDatos(null);

        const token = getToken();
        if (!token) return;

        setGuardandoDatos(true);
        try {
            const res = await apiFetch("/usuarios/mi-perfil", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ nombre, apellido, telefono }),
            });

            if (!res.ok) {
                const texto = await res.text();
                throw new Error(texto || "No se pudieron guardar los cambios.");
            }

            setMensajeDatos({ tipo: "ok", texto: "Datos actualizados correctamente." });
        } catch (err) {
            setMensajeDatos({
                tipo: "error",
                texto: err instanceof Error && err.message ? err.message : "No se pudieron guardar los cambios.",
            });
        } finally {
            setGuardandoDatos(false);
        }
    }

    async function handleCambiarContrasenia(e: React.FormEvent) {
        e.preventDefault();
        setMensajeContrasenia(null);

        if (contraseniaNueva !== contraseniaConfirmar) {
            setMensajeContrasenia({ tipo: "error", texto: "Las contraseñas nuevas no coinciden." });
            return;
        }

        const token = getToken();
        if (!token) return;

        setGuardandoContrasenia(true);
        try {
            const res = await apiFetch("/usuarios/mi-perfil/contrasenia", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    contraseniaActual,
                    contraseniaNueva,
                }),
            });

            if (!res.ok) {
                const texto = await res.text();
                throw new Error(texto || "No se pudo cambiar la contraseña.");
            }

            setMensajeContrasenia({ tipo: "ok", texto: "Contraseña actualizada correctamente." });
            setContraseniaActual("");
            setContraseniaNueva("");
            setContraseniaConfirmar("");
        } catch (err) {
            setMensajeContrasenia({
                tipo: "error",
                texto: err instanceof Error && err.message ? err.message : "No se pudo cambiar la contraseña.",
            });
        } finally {
            setGuardandoContrasenia(false);
        }
    }

    return (
        <div className="max-w-2xl mx-auto px-4 py-8">
            <div className="flex items-center gap-3 mb-6">
                <Link href="/" className="text-cyan-900 hover:text-cyan-700">
                    <FaArrowLeft size={18} />
                </Link>
                <h1 className={`text-3xl font-bold text-cyan-900 ${oi.className}`}>Mi perfil</h1>
            </div>

            {cargando && <p className="text-gray-500">Cargando tu perfil...</p>}

            {!cargando && error && (
                <div className="bg-red-100 border-2 border-red-300 text-red-800 rounded-2xl p-4">{error}</div>
            )}

            {!cargando && !error && (
                <div className="flex flex-col gap-6">
                    <div className="bg-blue-100 rounded-2xl p-5">
                        <div className="flex items-center gap-2 mb-4">
                            <FaUserCircle className="text-cyan-700" size={22} />
                            <h2 className="text-lg font-semibold text-cyan-900">Datos personales</h2>
                        </div>

                        <form onSubmit={handleGuardarDatos} className="flex flex-col gap-3">
                            <div>
                                <label className="text-sm text-cyan-800 font-medium">Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    disabled
                                    className="w-full mt-1 rounded-xl border-2 border-cyan-200 bg-gray-100 text-gray-500 px-3 py-2"
                                />
                            </div>

                            <div>
                                <label className="text-sm text-cyan-800 font-medium">Nombre</label>
                                <input
                                    type="text"
                                    value={nombre}
                                    onChange={(e) => setNombre(e.target.value)}
                                    required
                                    className="w-full mt-1 rounded-xl border-2 border-cyan-200 bg-white text-cyan-900 px-3 py-2 focus:outline-none focus:border-cyan-500"
                                />
                            </div>

                            <div>
                                <label className="text-sm text-cyan-800 font-medium">Apellido</label>
                                <input
                                    type="text"
                                    value={apellido}
                                    onChange={(e) => setApellido(e.target.value)}
                                    required
                                    className="w-full mt-1 rounded-xl border-2 border-cyan-200 bg-white text-cyan-900 px-3 py-2 focus:outline-none focus:border-cyan-500"
                                />
                            </div>

                            <div>
                                <label className="text-sm text-cyan-800 font-medium">Teléfono</label>
                                <input
                                    type="tel"
                                    value={telefono}
                                    onChange={(e) => setTelefono(e.target.value)}
                                    className="w-full mt-1 rounded-xl border-2 border-cyan-200 bg-white text-cyan-900 px-3 py-2 focus:outline-none focus:border-cyan-500"
                                />
                            </div>

                            {mensajeDatos && (
                                <p
                                    className={`text-sm font-semibold ${
                                        mensajeDatos.tipo === "ok" ? "text-green-700" : "text-red-700"
                                    }`}
                                >
                                    {mensajeDatos.texto}
                                </p>
                            )}

                            <button
                                type="submit"
                                disabled={guardandoDatos}
                                className="self-start bg-mio2 hover:bg-mio text-white font-semibold px-5 py-2 rounded-full cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {guardandoDatos ? "Guardando..." : "Guardar cambios"}
                            </button>
                        </form>
                    </div>

                    <div className="bg-blue-100 rounded-2xl p-5">
                        <h2 className="text-lg font-semibold text-cyan-900 mb-4">Cambiar contraseña</h2>

                        <form onSubmit={handleCambiarContrasenia} className="flex flex-col gap-3">
                            <div>
                                <label className="text-sm text-cyan-800 font-medium">Contraseña actual</label>
                                <input
                                    type="password"
                                    value={contraseniaActual}
                                    onChange={(e) => setContraseniaActual(e.target.value)}
                                    required
                                    className="w-full mt-1 rounded-xl border-2 border-cyan-200 bg-white text-cyan-900 px-3 py-2 focus:outline-none focus:border-cyan-500"
                                />
                            </div>

                            <div>
                                <label className="text-sm text-cyan-800 font-medium">Contraseña nueva</label>
                                <input
                                    type="password"
                                    value={contraseniaNueva}
                                    onChange={(e) => setContraseniaNueva(e.target.value)}
                                    required
                                    minLength={8}
                                    className="w-full mt-1 rounded-xl border-2 border-cyan-200 bg-white text-cyan-900 px-3 py-2 focus:outline-none focus:border-cyan-500"
                                />
                            </div>

                            <div>
                                <label className="text-sm text-cyan-800 font-medium">Confirmar contraseña nueva</label>
                                <input
                                    type="password"
                                    value={contraseniaConfirmar}
                                    onChange={(e) => setContraseniaConfirmar(e.target.value)}
                                    required
                                    minLength={8}
                                    className="w-full mt-1 rounded-xl border-2 border-cyan-200 bg-white text-cyan-900 px-3 py-2 focus:outline-none focus:border-cyan-500"
                                />
                            </div>

                            {mensajeContrasenia && (
                                <p
                                    className={`text-sm font-semibold ${
                                        mensajeContrasenia.tipo === "ok" ? "text-green-700" : "text-red-700"
                                    }`}
                                >
                                    {mensajeContrasenia.texto}
                                </p>
                            )}

                            <button
                                type="submit"
                                disabled={guardandoContrasenia}
                                className="self-start bg-mio2 hover:bg-mio text-white font-semibold px-5 py-2 rounded-full cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {guardandoContrasenia ? "Guardando..." : "Cambiar contraseña"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
