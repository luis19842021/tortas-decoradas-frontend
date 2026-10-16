"use client";
import Link from "next/link";
import { useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from "react";
import { apiFetch } from "@/utils/apiFetch";

type Estado = "validando" | "formulario" | "enviando" | "exito" | "vencido" | "invalido" | "error";

interface AuthResponse {
    token: string | null;
    authStatus: string;
    message: string;
}

const ICON_PROPS = {
    width: 34,
    height: 34,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.75,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
};

function CheckIcon() {
    return (
        <svg {...ICON_PROPS}>
            <path d="M20 6 9 17l-5-5" />
        </svg>
    );
}
function ClockIcon() {
    return (
        <svg {...ICON_PROPS}>
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7v5l3 2" />
        </svg>
    );
}
function XIcon() {
    return (
        <svg {...ICON_PROPS}>
            <circle cx="12" cy="12" r="9" />
            <path d="m9 9 6 6m0-6-6 6" />
        </svg>
    );
}

const ESTILOS: Record<Exclude<Estado, "validando" | "formulario" | "enviando">, { bg: string; fg: string }> = {
    exito: { bg: "bg-green-50 dark:bg-green-900", fg: "text-green-700 dark:text-green-200" },
    vencido: { bg: "bg-amber-50 dark:bg-amber-900", fg: "text-amber-700 dark:text-amber-200" },
    invalido: { bg: "bg-red-50 dark:bg-red-900", fg: "text-red-700 dark:text-red-200" },
    error: { bg: "bg-red-50 dark:bg-red-900", fg: "text-red-700 dark:text-red-200" },
};

function ConfirmarRecuperacionContent() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const [estado, setEstado] = useState<Estado>("validando");
    const [mensaje, setMensaje] = useState<string>("Estamos validando tu link...");

    const [nuevaContrasenia, setNuevaContrasenia] = useState<string>("");
    const [confirmarContrasenia, setConfirmarContrasenia] = useState<string>("");
    const [errorFormulario, setErrorFormulario] = useState<string>("");

    useEffect(() => {
        if (!token) {
            setEstado("invalido");
            setMensaje("Falta el token de recuperación. Revisá que hayas copiado el link completo del mail.");
            return;
        }

        let cancelado = false;

        apiFetch(`/auth/validarTokenRecuperacion?token=${encodeURIComponent(token)}`)
            .then(async (res) => {
                const body: AuthResponse = await res.json().catch(() => ({
                    token: null,
                    authStatus: "TOKEN_RECUPERACION_INVALIDO",
                    message: "No pudimos leer la respuesta del servidor.",
                }));

                if (cancelado) return;

                switch (body.authStatus) {
                    case "TOKEN_RECUPERACION_VALIDO":
                        setEstado("formulario");
                        break;
                    case "TOKEN_RECUPERACION_EXPIRADO":
                        setMensaje(body.message);
                        setEstado("vencido");
                        break;
                    default:
                        setMensaje(body.message);
                        setEstado("invalido");
                }
            })
            .catch(() => {
                if (cancelado) return;
                setEstado("error");
                setMensaje("No pudimos conectarnos con el servidor. Intentá de nuevo en unos minutos.");
            });

        return () => {
            cancelado = true;
        };
    }, [token]);

    const enviarNuevaContrasenia = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorFormulario("");

        if (nuevaContrasenia.length < 6) {
            setErrorFormulario("La contraseña debe tener al menos 6 caracteres.");
            return;
        }
        if (nuevaContrasenia !== confirmarContrasenia) {
            setErrorFormulario("Las contraseñas no coinciden.");
            return;
        }

        setEstado("enviando");

        try {
            const res = await apiFetch("/auth/restablecerContrasenia", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, nuevaContrasenia }),
            });

            const body: AuthResponse = await res.json().catch(() => ({
                token: null,
                authStatus: "TOKEN_RECUPERACION_INVALIDO",
                message: "No pudimos leer la respuesta del servidor.",
            }));

            if (res.ok && body.authStatus === "CONTRASENIA_RESTABLECIDA") {
                setMensaje(body.message);
                setEstado("exito");
            } else {
                setMensaje(body.message);
                setEstado("invalido");
            }
        } catch {
            setMensaje("No pudimos conectarnos con el servidor. Intentá de nuevo en unos minutos.");
            setEstado("error");
        }
    }

    return (
        <div className="flex justify-center pt-10 pb-10 ">
            <div className="flex justify-center w-120 min-h-100 bg-stone-50 rounded-2xl shadow-lg shadow-mio2">
                <div className="flex flex-col items-center justify-center w-100 py-10">
                    {estado === "validando" ? (
                        <>
                            <div
                                aria-hidden="true"
                                className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-200"
                            >
                                <span className="h-8 w-8 animate-spin rounded-full border-2 border-current border-r-transparent motion-reduce:[animation-duration:2.4s]" />
                            </div>
                            <h1 className="mb-1.5 text-xl font-medium">Validando tu link</h1>
                            <p className="text-sm text-stone-600 dark:text-stone-400">{mensaje}</p>
                        </>
                    ) : estado === "formulario" || estado === "enviando" ? (
                        <div className="w-100 px-6">
                            <h1 className="mb-1.5 text-xl font-medium text-center">Elegí tu nueva contraseña</h1>
                            <form noValidate onSubmit={enviarNuevaContrasenia} className="pt-4">

                                <div className="pb-2 pl-4"><span className="">Nueva contraseña</span></div>
                                <input
                                    onChange={(e) => setNuevaContrasenia(e.target.value)}
                                    value={nuevaContrasenia}
                                    type="password"
                                    maxLength={50}
                                    required
                                    className="border-2 border-mio2 h-11 w-full pl-5 font-serif focus:border-naja focus:outline-none rounded-full "
                                    placeholder="nueva contraseña"
                                />

                                <div className="pb-2 pl-4 pt-3"><span className="">Confirmar contraseña</span></div>
                                <input
                                    onChange={(e) => setConfirmarContrasenia(e.target.value)}
                                    value={confirmarContrasenia}
                                    type="password"
                                    maxLength={50}
                                    required
                                    className="border-2 border-mio2 h-11 w-full pl-5 font-serif focus:border-naja focus:outline-none rounded-full "
                                    placeholder="repetí la contraseña"
                                />

                                {errorFormulario !== "" && (
                                    <p className="pt-2 text-center text-sm text-red-600">{errorFormulario}</p>
                                )}

                                <div className="pt-4">
                                    <button
                                        disabled={estado === "enviando"}
                                        className="bg-green-700 w-full h-11 rounded-full text-white font-semibold hover:bg-green-800 disabled:opacity-60"
                                    >
                                        {estado === "enviando" ? "Guardando..." : "Restablecer contraseña"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    ) : (
                        <>
                            <div
                                aria-hidden="true"
                                className={`mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full ${ESTILOS[estado].bg} ${ESTILOS[estado].fg}`}
                            >
                                {estado === "exito" ? <CheckIcon /> : estado === "vencido" ? <ClockIcon /> : <XIcon />}
                            </div>

                            <h1 className="mb-1.5 text-xl font-medium text-center px-6">
                                {estado === "exito"
                                    ? "¡Contraseña actualizada!"
                                    : estado === "vencido"
                                        ? "El link venció"
                                        : "No pudimos restablecer tu contraseña"}
                            </h1>

                            <p className="mb-6 mt-0.5 max-w-80 text-center text-sm text-stone-600 dark:text-stone-400">
                                {mensaje}
                            </p>

                            {estado === "exito" && (
                                <Link
                                    href="/login"
                                    className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-green-700 px-5 text-sm font-medium text-white hover:bg-green-800"
                                >
                                    Ir a iniciar sesión
                                </Link>
                            )}

                            {estado === "vencido" && (
                                <Link
                                    href="/registro/recuperarCuenta"
                                    className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-amber-600 px-5 text-sm font-medium text-white hover:bg-amber-700"
                                >
                                    Solicitar un nuevo link
                                </Link>
                            )}

                            {(estado === "invalido" || estado === "error") && (
                                <Link
                                    href="/registro/recuperarCuenta"
                                    className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-black/15 px-5 text-sm font-medium text-stone-900 hover:bg-black/5 dark:border-white/20 dark:text-stone-100 dark:hover:bg-white/10"
                                >
                                    Volver a intentar
                                </Link>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function ConfirmarRecuperacion() {
    return (
        <Suspense fallback={null}>
            <ConfirmarRecuperacionContent />
        </Suspense>
    );
}
