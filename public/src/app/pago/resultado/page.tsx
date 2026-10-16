"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { oi } from "../../ui/fonts";
import { getToken } from "@/features/auth/auth";
import { vaciarCarrito } from "@/features/carrito/carrito";
import { apiFetch } from "@/utils/apiFetch";

type Vista = "cargando" | "APROBADO" | "PENDIENTE" | "RECHAZADO" | "SIN_PAGO" | "CANCELADO" | "error";

const REINTENTOS_MAXIMOS = 5;
const ESPERA_REINTENTO_MS = 2500;

function ResultadoPago() {
    const params = useSearchParams();
    const referencia = params.get("external_reference") ?? "";
    const idPedido = /^\d{1,18}$/.test(referencia) ? Number(referencia) : null;
    const dijoAprobado = params.get("status") === "approved" || params.get("collection_status") === "approved";

    const [vista, setVista] = useState<Vista>("cargando");
    const [ocupado, setOcupado] = useState(false);
    const [mensaje, setMensaje] = useState<string | null>(null);
    const yaConsulto = useRef(false);

    const encabezados = useCallback(
        () => ({ "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` }),
        []
    );

    const consultar = useCallback(
        async (reintentosRestantes: number) => {
            if (idPedido === null) {
                setVista("error");
                return;
            }
            try {
                const res = await apiFetch("/pagos/confirmar", {
                    method: "POST",
                    headers: encabezados(),
                    body: JSON.stringify({ idPedido }),
                });
                if (!res.ok) throw new Error();
                const { estadoPedido, estadoPago } = await res.json();

                if (estadoPedido === "CANCELADO") {
                    setVista("CANCELADO");
                    return;
                }
                if (estadoPago === "APROBADO") {
                    vaciarCarrito();
                    setVista("APROBADO");
                    return;
                }
                if (dijoAprobado && reintentosRestantes > 0) {
                    setVista("cargando");
                    setTimeout(() => consultar(reintentosRestantes - 1), ESPERA_REINTENTO_MS);
                    return;
                }
                setVista(estadoPago);
            } catch {
                setVista("error");
            }
        },
        [idPedido, dijoAprobado, encabezados]
    );

    useEffect(() => {
        if (yaConsulto.current) return;
        yaConsulto.current = true;
        consultar(REINTENTOS_MAXIMOS);
    }, [consultar]);

    const volverAPagar = async () => {
        if (idPedido === null) return;
        setOcupado(true);
        setMensaje(null);
        try {
            const res = await apiFetch("/pagos/preferencia", {
                method: "POST",
                headers: encabezados(),
                body: JSON.stringify({ idPedido }),
            });
            if (!res.ok) throw new Error();
            const { urlPago } = await res.json();
            window.location.href = urlPago;
        } catch {
            setMensaje("No se pudo volver a iniciar el pago. Probá de nuevo en un momento.");
            setOcupado(false);
        }
    };

    const cancelarPedido = async () => {
        if (idPedido === null) return;
        setOcupado(true);
        setMensaje(null);
        try {
            const res = await apiFetch(`/pedidos/${idPedido}/estado`, {
                method: "PATCH",
                headers: encabezados(),
                body: JSON.stringify({ estado: "CANCELADO" }),
            });
            if (!res.ok) throw new Error();
            setVista("CANCELADO");
        } catch {
            setMensaje("No se pudo cancelar el pedido.");
        } finally {
            setOcupado(false);
        }
    };

    const verificarDeNuevo = () => {
        setVista("cargando");
        consultar(0);
    };

    const boton =
        "px-6 py-2 rounded-full font-semibold text-white cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed";

    const contenido: Record<Vista, { titulo: string; texto: string; color: string }> = {
        cargando: {
            titulo: "Confirmando tu pago...",
            texto: "Estamos verificando el pago con Mercado Pago. No cierres esta página.",
            color: "text-cyan-900",
        },
        APROBADO: {
            titulo: "¡Pago aprobado!",
            texto: `Tu pedido N° ${idPedido} quedó confirmado. Te enviamos un mail con los detalles. Podés seguirlo desde tu historial de compras.`,
            color: "text-green-700",
        },
        PENDIENTE: {
            titulo: "Tu pago está pendiente",
            texto: "Mercado Pago todavía no acreditó el pago. Cuando se acredite, el pedido se confirma solo. Podés volver a verificar en unos minutos.",
            color: "text-amber-600",
        },
        RECHAZADO: {
            titulo: "El pago no se completó",
            texto: "Mercado Pago rechazó o canceló el pago. Tu pedido sigue guardado: podés intentar pagar de nuevo o cancelarlo.",
            color: "text-red-600",
        },
        SIN_PAGO: {
            titulo: "Todavía no hay un pago registrado",
            texto: "No encontramos ningún pago para este pedido. Si ya pagaste, verificá de nuevo en unos segundos; si no, podés intentar pagar otra vez o cancelar el pedido.",
            color: "text-red-600",
        },
        CANCELADO: {
            titulo: "Pedido cancelado",
            texto: `El pedido N° ${idPedido} está cancelado.`,
            color: "text-gray-700",
        },
        error: {
            titulo: "No pudimos verificar el pago",
            texto: "Hubo un problema al consultar el estado del pedido. Si ya pagaste, no te preocupes: revisá tu historial de compras en unos minutos.",
            color: "text-red-600",
        },
    };

    const { titulo, texto, color } = contenido[vista];

    return (
        <div className="max-w-xl mx-auto px-4 py-16 flex flex-col items-center text-center gap-5">
            <h1 className={`text-3xl font-bold ${color} ${oi.className}`}>{titulo}</h1>
            <p className="text-gray-700">{texto}</p>

            {mensaje && <p className="text-red-600 text-sm">{mensaje}</p>}

            <div className="flex flex-wrap justify-center gap-3">
                {(vista === "PENDIENTE" || vista === "SIN_PAGO" || vista === "error") && (
                    <button type="button" onClick={verificarDeNuevo} className={`${boton} bg-cyan-600 hover:bg-cyan-700`}>
                        Verificar de nuevo
                    </button>
                )}
                {(vista === "RECHAZADO" || vista === "SIN_PAGO") && (
                    <>
                        <button
                            type="button"
                            disabled={ocupado}
                            onClick={volverAPagar}
                            className={`${boton} bg-[#09c99f] hover:bg-[#07a88a]`}
                        >
                            Intentar pagar de nuevo
                        </button>
                        <button
                            type="button"
                            disabled={ocupado}
                            onClick={cancelarPedido}
                            className={`${boton} bg-red-500 hover:bg-red-600`}
                        >
                            Cancelar pedido
                        </button>
                    </>
                )}
                {vista !== "cargando" && (
                    <Link
                        href={vista === "APROBADO" ? "/historial" : "/"}
                        className={`${boton} bg-[#09c99f] hover:bg-[#07a88a]`}
                    >
                        {vista === "APROBADO" ? "Ver mis pedidos" : "Volver al inicio"}
                    </Link>
                )}
            </div>
        </div>
    );
}

export default function PagoResultadoPage() {
    return (
        <Suspense fallback={<p className="text-center py-16">Cargando...</p>}>
            <ResultadoPago />
        </Suspense>
    );
}
