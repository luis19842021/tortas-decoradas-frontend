"use client";
import Link from "next/link";
import { useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from "react";
import { apiFetch } from "@/utils/apiFetch";

type Estado = "verificando" | "exito" | "vencido" | "invalido" | "error";

interface VerificarEmailResponse {
    status: string;
    message: string;
    email: string | null;
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

const ESTILOS: Record<Exclude<Estado, "verificando">, { bg: string; fg: string }> = {
    exito: { bg: "bg-green-50 dark:bg-green-900", fg: "text-green-700 dark:text-green-200" },
    vencido: { bg: "bg-amber-50 dark:bg-amber-900", fg: "text-amber-700 dark:text-amber-200" },
    invalido: { bg: "bg-red-50 dark:bg-red-900", fg: "text-red-700 dark:text-red-200" },
    error: { bg: "bg-red-50 dark:bg-red-900", fg: "text-red-700 dark:text-red-200" },
};

function ConfirmarVerificacionContent() {
    const searchParams = useSearchParams();
    const [estado, setEstado] = useState<Estado>("verificando");
    const [mensaje, setMensaje] = useState<string>("Estamos verificando tu correo...");
    const [email, setEmail] = useState<string | null>(null);

    useEffect(() => {
        const token = searchParams.get("token");

        if (!token) {
            setEstado("invalido");
            setMensaje("Falta el token de verificación. Revisá que hayas copiado el link completo del mail.");
            return;
        }

        let cancelado = false;

        apiFetch(`/auth/verifyEmail?token=${encodeURIComponent(token)}`)
            .then(async (res) => {
                const body: VerificarEmailResponse = await res.json().catch(() => ({
                    status: "EMAIL_VERIFICATION_INVALID",
                    message: "No pudimos leer la respuesta del servidor.",
                    email: null,
                }));

                if (cancelado) return;

                setMensaje(body.message);
                setEmail(body.email);

                switch (body.status) {
                    case "EMAIL_VERIFIED":
                        setEstado("exito");
                        break;
                    case "EMAIL_VERIFICATION_EXPIRED":
                        setEstado("vencido");
                        break;
                    default:
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
    }, [searchParams]);

    return (
        <div className="flex justify-center pt-10 pb-10 ">
            <div className="flex justify-center w-120 min-h-100 bg-stone-50 rounded-2xl shadow-lg shadow-mio2">
                <div className="flex flex-col items-center justify-center w-100 py-10">
                    {estado === "verificando" ? (
                        <>
                            <div
                                aria-hidden="true"
                                className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-200"
                            >
                                <span className="h-8 w-8 animate-spin rounded-full border-2 border-current border-r-transparent motion-reduce:[animation-duration:2.4s]" />
                            </div>
                            <h1 className="mb-1.5 text-xl font-medium">Verificando tu correo</h1>
                            <p className="text-sm text-stone-600 dark:text-stone-400">{mensaje}</p>
                        </>
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
                                    ? "¡Cuenta verificada!"
                                    : estado === "vencido"
                                        ? "El link venció"
                                        : "No pudimos verificar tu correo"}
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
                                    href={email ? `/registro/verificar-correo?email=${encodeURIComponent(email)}` : "/registro"}
                                    className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-amber-600 px-5 text-sm font-medium text-white hover:bg-amber-700"
                                >
                                    Reenviar verificación
                                </Link>
                            )}

                            {(estado === "invalido" || estado === "error") && (
                                <Link
                                    href="/registro"
                                    className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-black/15 px-5 text-sm font-medium text-stone-900 hover:bg-black/5 dark:border-white/20 dark:text-stone-100 dark:hover:bg-white/10"
                                >
                                    Volver a registrarme
                                </Link>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function ConfirmarVerificacion() {
    return (
        <Suspense fallback={null}>
            <ConfirmarVerificacionContent />
        </Suspense>
    );
}
