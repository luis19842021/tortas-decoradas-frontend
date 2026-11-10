"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { oi } from "../ui/fonts";
import { getToken } from "@/features/auth/auth";
import {
    FaBoxOpen,
    FaArrowLeft,
    FaCheck,
    FaCalendarAlt,
    FaCalendarCheck,
    FaExclamationTriangle,
    FaTimesCircle,
} from "react-icons/fa";
import Fechas from "@/componenets/Fechas";
import { apiFetch } from "@/utils/apiFetch";
import { descargarFactura, descargarNotaCredito, facturaExiste, notaCreditoExiste } from "@/features/factura/api";

const formatearFechaLegible = (fecha: string) => {
    const [y, m, d] = fecha.split("-").map(Number);
    const fechaLocal = new Date(y, m - 1, d);
    const texto = fechaLocal.toLocaleDateString("es-AR", {
        weekday: "long",
        day: "numeric",
        month: "long",
    });
    return texto.charAt(0).toUpperCase() + texto.slice(1);
};

interface ItemPedido {
    idItemPedido: number;
    idProducto: number;
    descripcion: string;
    precioUnitario: number;
    cantidad: number;
}

type EstadoPreparacion = "DISENANDO" | "COCINANDO" | "ENTREGADO";

interface Pedido {
    idpedido: number;
    fecha_de_pedido: string;
    estado: "INICIADO" | "CUMPLIDO" | "CANCELADO";
    estadoPreparacion: EstadoPreparacion | null;
    reprogramado: boolean;
    montoADevolver: number | null;
    porcentajeDevuelto: number | null;
    costoEnvio: number | null;
    items: ItemPedido[];
}

function puedeReprogramarse(pedido: Pedido): boolean {
    if (pedido.estado === "CANCELADO") return false;
    if (pedido.reprogramado) return false;
    if (pedido.estadoPreparacion && pedido.estadoPreparacion !== "DISENANDO") return false;
    return true;
}

function puedeCancelarse(pedido: Pedido): boolean {
    if (pedido.estado !== "CUMPLIDO") return false;
    if (pedido.estadoPreparacion === "ENTREGADO") return false;
    return true;
}

function calcularPorcentajeDevuelto(fecha: string): number {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const [y, m, d] = fecha.split("-").map(Number);
    const fechaEntrega = new Date(y, m - 1, d);
    const msPorDia = 24 * 60 * 60 * 1000;
    const diasRestantes = Math.round((fechaEntrega.getTime() - hoy.getTime()) / msPorDia);

    if (diasRestantes < 2) return 0;
    if (diasRestantes < 7) return 50;
    return 90;
}

const estadoInfo: Record<Pedido["estado"], { texto: string; clase: string }> = {
    INICIADO: { texto: "Pendiente de pago", clase: "bg-yellow-100 text-yellow-800 border-yellow-300" },
    CUMPLIDO: { texto: "Pago confirmado", clase: "bg-green-100 text-green-800 border-green-300" },
    CANCELADO: { texto: "Pago cancelado", clase: "bg-red-100 text-red-800 border-red-300" },
};

const pasosPreparacion: { key: EstadoPreparacion; label: string }[] = [
    { key: "DISENANDO", label: "Diseñando" },
    { key: "COCINANDO", label: "Cocinando" },
    { key: "ENTREGADO", label: "Entregado" },
];

function PasosPreparacion({ actual }: { actual: EstadoPreparacion }) {
    const indiceActual = pasosPreparacion.findIndex((p) => p.key === actual);

    return (
        <div className="flex items-start">
            {pasosPreparacion.map((paso, i) => {
                const completado = i < indiceActual || actual === "ENTREGADO";
                const activo = i === indiceActual && !completado;

                return (
                    <div key={paso.key} className="flex items-start">
                        <div className="flex flex-col items-center gap-1 w-14">
                            <div
                                className={`h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold border-2 ${
                                    completado
                                        ? "bg-[#02831e] border-[#02831e] text-white"
                                        : activo
                                        ? "bg-[#deb71d] border-[#deb71d] text-white ring-2 ring-offset-1 ring-[#deb71d]"
                                        : "bg-white border-gray-300 text-gray-300"
                                }`}
                            >
                                {completado ? <FaCheck size={10} /> : i + 1}
                            </div>
                            <span
                                className={`text-[9px] font-semibold text-center leading-tight ${
                                    completado ? "text-[#02831e]" : activo ? "text-[#deb71d]" : "text-gray-400"
                                }`}
                            >
                                {paso.label}
                            </span>
                        </div>
                        {i < pasosPreparacion.length - 1 && (
                            <div
                                className={`h-0.5 w-4 mt-3 ${
                                    i < indiceActual || actual === "ENTREGADO" ? "bg-[#02831e]" : "bg-gray-300"
                                }`}
                            />
                        )}
                    </div>
                );
            })}
        </div>
    );
}

function totalPedido(pedido: Pedido): number {
    return pedido.items.reduce((acc, item) => acc + item.precioUnitario * item.cantidad, 0) + (pedido.costoEnvio ?? 0);
}

function CancelarPedido({
    idpedido,
    fechaEntrega,
    total,
    onCancelado,
}: {
    idpedido: number;
    fechaEntrega: string;
    total: number;
    onCancelado: (montoADevolver: number, porcentajeDevuelto: number) => void;
}) {
    const [abierto, setAbierto] = useState(false);
    const [enviando, setEnviando] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const porcentajePrevisto = calcularPorcentajeDevuelto(fechaEntrega);
    const montoPrevisto = Math.round((total * porcentajePrevisto) / 100);

    const confirmar = async () => {
        setError(null);
        const token = getToken();
        if (!token) return;

        setEnviando(true);
        try {
            const res = await apiFetch(`/pedidos/${idpedido}/cancelar`, {
                method: "PATCH",
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!res.ok) {
                const texto = await res.text();
                throw new Error(texto || "No se pudo cancelar el pedido.");
            }

            const pedidoActualizado = await res.json();
            onCancelado(
                pedidoActualizado.montoADevolver ?? montoPrevisto,
                pedidoActualizado.porcentajeDevuelto ?? porcentajePrevisto
            );
            setAbierto(false);
        } catch (err) {
            setError(err instanceof Error && err.message ? err.message : "No se pudo cancelar el pedido.");
        } finally {
            setEnviando(false);
        }
    };

    if (!abierto) {
        return (
            <button
                type="button"
                onClick={() => setAbierto(true)}
                className="w-full flex items-center justify-center gap-2 text-sm font-semibold text-red-700 bg-white hover:bg-red-50 border-2 border-red-200 hover:border-red-300 px-4 py-2.5 rounded-full cursor-pointer transition-colors"
            >
                <FaTimesCircle size={14} className="text-red-600" />
                Cancelar pedido
            </button>
        );
    }

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-gray-600/50 backdrop-blur-sm"
                onClick={() => !enviando && setAbierto(false)}
            ></div>

            <div className="relative bg-white rounded-2xl shadow-lg w-full max-w-sm p-5 z-10 flex flex-col gap-3">
                <div className="flex items-center gap-2 text-red-700">
                    <FaExclamationTriangle size={16} />
                    <span className="text-sm font-bold uppercase tracking-wide">Cancelar pedido</span>
                </div>

                <p className="text-sm text-gray-700">
                    Según nuestra política de cancelación, te corresponde un reembolso del{" "}
                    <span className="font-semibold">{porcentajePrevisto}%</span>:
                </p>

                <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-3 text-center">
                    <p className="text-2xl font-bold text-red-700">${montoPrevisto.toLocaleString("es-AR")}</p>
                    <p className="text-xs text-gray-500">de ${total.toLocaleString("es-AR")} pagados</p>
                </div>

                <p className="text-xs text-gray-500">
                    Esta acción no se puede deshacer. Nos vamos a poner en contacto para gestionar el reembolso.
                </p>

                <div className="flex justify-end gap-2 mt-1">
                    <button
                        type="button"
                        onClick={() => setAbierto(false)}
                        disabled={enviando}
                        className="text-xs font-semibold text-gray-500 hover:text-gray-700 px-3 py-1.5 rounded-full cursor-pointer transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        Volver
                    </button>
                    <button
                        type="button"
                        onClick={confirmar}
                        disabled={enviando}
                        className="text-xs font-semibold bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded-full cursor-pointer transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {enviando ? "Cancelando..." : "Sí, cancelar pedido"}
                    </button>
                </div>

                {error && (
                    <p className="text-xs font-semibold text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-1.5">
                        {error}
                    </p>
                )}
            </div>
        </div>
    );
}

function ReprogramarPedido({
    idpedido,
    onReprogramado,
}: {
    idpedido: number;
    onReprogramado: (nuevaFecha: string) => void;
}) {
    const [abierto, setAbierto] = useState(false);
    const [confirmando, setConfirmando] = useState(false);
    const [nuevaFecha, setNuevaFecha] = useState<string | null>(null);
    const [enviando, setEnviando] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const confirmar = async () => {
        if (!nuevaFecha) return;
        setError(null);
        const token = getToken();
        if (!token) return;

        setEnviando(true);
        try {
            const res = await apiFetch(`/pedidos/${idpedido}/reprogramar`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ nuevaFecha }),
            });

            if (!res.ok) {
                const texto = await res.text();
                throw new Error(texto || "No se pudo reprogramar el pedido.");
            }

            onReprogramado(nuevaFecha);
            setAbierto(false);
            setConfirmando(false);
        } catch (err) {
            setError(err instanceof Error && err.message ? err.message : "No se pudo reprogramar el pedido.");
            setConfirmando(false);
        } finally {
            setEnviando(false);
        }
    };

    if (!abierto) {
        return (
            <button
                type="button"
                onClick={() => setAbierto(true)}
                className="flex items-center gap-2 text-xs font-semibold text-cyan-800 bg-white hover:bg-cyan-50 border-2 border-cyan-200 hover:border-cyan-300 px-3 py-1.5 rounded-full cursor-pointer transition-colors"
            >
                <FaCalendarAlt size={12} className="text-cyan-600" />
                Reprogramar entrega
            </button>
        );
    }

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-gray-600/50 backdrop-blur-sm"
                onClick={() => {
                    setAbierto(false);
                    setError(null);
                }}
            ></div>

            <div className="relative bg-white rounded-2xl shadow-lg w-full max-w-2xl p-4 sm:p-6 z-10 flex flex-col gap-3 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center gap-2 text-cyan-800">
                    <FaCalendarAlt size={15} className="text-cyan-600" />
                    <span className="text-sm font-semibold uppercase tracking-wide">
                        Elegí la nueva fecha de entrega
                    </span>
                </div>

                <div className="bg-[#bddbe8] rounded-xl overflow-hidden">
                    <div className="h-90 sm:h-120">
                        <Fechas seleccionable fechaSeleccionada={nuevaFecha} onSeleccionarFecha={setNuevaFecha} />
                    </div>

                    <div className="bg-amber-50 py-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 px-4 text-sm font-medium text-cyan-900">
                        <span className="flex items-center gap-2">
                            <span className="h-4 w-4 rounded-full bg-[#02831e] inline-block"></span>
                            Disponible
                        </span>
                        <span className="flex items-center gap-2">
                            <span className="h-4 w-4 rounded-full bg-[#deb71d] inline-block"></span>
                            Poca disponibilidad
                        </span>
                        <span className="flex items-center gap-2">
                            <span className="h-4 w-4 rounded-full bg-[#f03869] inline-block"></span>
                            Sin cupo
                        </span>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    {nuevaFecha && (
                        <span className="text-sm font-semibold text-cyan-900">
                            Nueva fecha: {new Date(nuevaFecha + "T00:00:00").toLocaleDateString("es-AR")}
                        </span>
                    )}
                </div>

                <div className="flex justify-between gap-6 mt-1">
                    <button
                        type="button"
                        onClick={() => {
                            setAbierto(false);
                            setError(null);
                        }}
                        className="text-xs font-semibold text-gray-500 hover:text-gray-700 px-3 py-1.5 rounded-full cursor-pointer transition-colors"
                    >
                        Cerrar
                    </button>
                    <button
                        type="button"
                        onClick={() => setConfirmando(true)}
                        disabled={enviando || !nuevaFecha}
                        className="text-xs font-semibold bg-cyan-700 hover:bg-cyan-800 text-white px-4 py-1.5 rounded-full cursor-pointer transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {enviando ? "Guardando..." : "Confirmar"}
                    </button>
                </div>

                {error && (
                    <p className="text-xs font-semibold text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-1.5">
                        {error}
                    </p>
                )}
            </div>

            {confirmando && (
                <div className="fixed inset-0 z-110 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-gray-600/50 backdrop-blur-sm"
                        onClick={() => !enviando && setConfirmando(false)}
                    ></div>

                    <div className="relative bg-white rounded-2xl shadow-lg w-full max-w-sm p-5 z-10 flex flex-col gap-3">
                        <div className="flex items-center gap-2 text-amber-700">
                            <FaExclamationTriangle size={16} />
                            <span className="text-sm font-bold uppercase tracking-wide">Atención</span>
                        </div>
                        <p className="text-sm text-gray-700">
                            Este pedido solo se puede reprogramar <span className="font-semibold">una vez</span>.
                            Una vez confirmada la nueva fecha no vas a poder volver a cambiarla. ¿Querés continuar?
                        </p>

                        <div className="flex justify-between gap-6 mt-1">
                            <button
                                type="button"
                                onClick={() => setConfirmando(false)}
                                disabled={enviando}
                                className="text-xs font-semibold text-gray-500 hover:text-gray-700 px-3 py-1.5 rounded-full cursor-pointer transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                Volver
                            </button>
                            <button
                                type="button"
                                onClick={confirmar}
                                disabled={enviando}
                                className="text-xs font-semibold bg-cyan-700 hover:bg-cyan-800 text-white px-4 py-1.5 rounded-full cursor-pointer transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {enviando ? "Guardando..." : "Sí, reprogramar"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function BotonFactura({ idpedido }: { idpedido: number }) {
    const [tiene, setTiene] = useState(false);
    const [descargando, setDescargando] = useState(false);
    const [errorFactura, setErrorFactura] = useState(false);

    useEffect(() => {
        facturaExiste(idpedido).then(setTiene).catch(() => setTiene(false));
    }, [idpedido]);

    const descargar = async () => {
        setDescargando(true);
        setErrorFactura(false);
        try {
            await descargarFactura(idpedido);
        } catch {
            setErrorFactura(true);
        } finally {
            setDescargando(false);
        }
    };

    if (!tiene) {
        return (
            <p className="text-xs text-gray-500 text-center">
                Tu factura te llega por correo en el transcurso del día y la vas a poder descargar acá.
            </p>
        );
    }

    return (
        <div>
            <button
                type="button"
                onClick={descargar}
                disabled={descargando}
                className="w-full flex items-center justify-center gap-2 text-sm font-semibold text-cyan-800 bg-white hover:bg-cyan-50 border-2 border-cyan-600 px-4 py-2.5 rounded-full cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {descargando ? "Descargando..." : "Descargar factura"}
            </button>
            {errorFactura && <p className="mt-1 text-xs text-red-700 text-center">No se pudo descargar la factura. Intentá de nuevo.</p>}
        </div>
    );
}

function BotonNotaCredito({ idpedido }: { idpedido: number }) {
    const [tiene, setTiene] = useState(false);
    const [descargando, setDescargando] = useState(false);
    const [errorNota, setErrorNota] = useState(false);

    useEffect(() => {
        notaCreditoExiste(idpedido).then(setTiene).catch(() => setTiene(false));
    }, [idpedido]);

    const descargar = async () => {
        setDescargando(true);
        setErrorNota(false);
        try {
            await descargarNotaCredito(idpedido);
        } catch {
            setErrorNota(true);
        } finally {
            setDescargando(false);
        }
    };

    if (!tiene) return null;

    return (
        <div>
            <button
                type="button"
                onClick={descargar}
                disabled={descargando}
                className="w-full flex items-center justify-center gap-2 text-sm font-semibold text-cyan-800 bg-white hover:bg-cyan-50 border-2 border-cyan-600 px-4 py-2.5 rounded-full cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {descargando ? "Descargando..." : "Descargar nota de crédito"}
            </button>
            {errorNota && <p className="mt-1 text-xs text-red-700 text-center">No se pudo descargar la nota de crédito. Intentá de nuevo.</p>}
        </div>
    );
}

function TarjetaPedido({
    pedido,
    onCancelado,
}: {
    pedido: Pedido;
    onCancelado: (idpedido: number, montoADevolver: number, porcentajeDevuelto: number) => void;
}) {
    const [estadoPrepDemo, setEstadoPrepDemo] = useState<EstadoPreparacion | null>(pedido.estadoPreparacion);
    const [fechaEntrega, setFechaEntrega] = useState(pedido.fecha_de_pedido);
    const [reprogramado, setReprogramado] = useState(pedido.reprogramado);
    const [estadoLocal, setEstadoLocal] = useState(pedido.estado);
    const [montoADevolver, setMontoADevolver] = useState(pedido.montoADevolver);
    const [porcentajeDevuelto, setPorcentajeDevuelto] = useState(pedido.porcentajeDevuelto);

    return (
        <div className="bg-blue-100 rounded-2xl p-3 sm:p-4">
            <div className="flex items-start justify-between flex-wrap gap-2 mb-3">
                <p className="text-cyan-900 font-semibold">Pedido #{pedido.idpedido}</p>
                {estadoPrepDemo && <PasosPreparacion actual={estadoPrepDemo} />}
            </div>

            <div className="mb-3 flex items-center gap-3 bg-white border-2 border-cyan-500 rounded-2xl p-3 shadow-sm flex-wrap">
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-cyan-500 text-white shrink-0">
                    <FaCalendarCheck size={18} />
                </div>
                <div className="flex-1 min-w-40">
                    <p className="text-[10px] uppercase tracking-wide text-cyan-700 font-semibold">
                        Fecha de entrega
                    </p>
                    <p className="text-base font-bold text-cyan-900 leading-tight">
                        {formatearFechaLegible(fechaEntrega)}
                    </p>
                </div>
                {reprogramado ? (
                    <span className="flex items-center gap-2 text-xs font-semibold text-gray-500 bg-gray-100 border-2 border-gray-200 px-3 py-1.5 rounded-full">
                        <FaCalendarAlt size={12} className="text-gray-400" />
                        Reprogramado
                    </span>
                ) : (
                    puedeReprogramarse({ ...pedido, estado: estadoLocal, fecha_de_pedido: fechaEntrega, reprogramado }) && (
                        <ReprogramarPedido
                            idpedido={pedido.idpedido}
                            onReprogramado={(nuevaFecha) => {
                                setFechaEntrega(nuevaFecha);
                                setReprogramado(true);
                            }}
                        />
                    )
                )}
            </div>

            <div className="flex flex-col gap-2">
                {pedido.items.map((item) => (
                    <div
                        key={item.idItemPedido}
                        className="flex items-center justify-between gap-3 bg-white border-2 border-cyan-200 rounded-2xl p-3"
                    >
                        <div className="min-w-0 break-words">
                            <p className="text-cyan-900 font-medium">{item.descripcion}</p>
                            <p className="text-sm text-gray-500">Cantidad: {item.cantidad}</p>
                        </div>
                        <p className="text-cyan-900 font-semibold whitespace-nowrap shrink-0">
                            ${(item.precioUnitario * item.cantidad).toLocaleString("es-AR")}
                        </p>
                    </div>
                ))}
            </div>

            <div className="flex items-center justify-between flex-wrap gap-2 mt-3">
                <span className={`text-sm font-semibold px-3 py-1 rounded-full border-2 ${estadoInfo[estadoLocal].clase}`}>
                    {estadoInfo[estadoLocal].texto}
                </span>
                <p className="text-cyan-900 font-bold">Total: ${totalPedido(pedido).toLocaleString("es-AR")}</p>
            </div>

            {estadoLocal === "CANCELADO" && porcentajeDevuelto != null && (
                <div className="mt-2 bg-red-50 border-2 border-red-200 rounded-2xl p-3 flex items-center justify-between flex-wrap gap-2">
                    <span className="text-sm text-red-800">Reembolso ({porcentajeDevuelto}%)</span>
                    <span className="text-sm font-bold text-red-800">
                        ${(montoADevolver ?? 0).toLocaleString("es-AR")}
                    </span>
                </div>
            )}

            <div className="mt-3 flex flex-col gap-2 w-full sm:max-w-xs sm:ml-auto">
            {estadoLocal === "CUMPLIDO" && <BotonFactura idpedido={pedido.idpedido} />}
            {estadoLocal === "CANCELADO" && (montoADevolver ?? 0) > 0 && <BotonNotaCredito idpedido={pedido.idpedido} />}

            {puedeCancelarse({ ...pedido, estado: estadoLocal, estadoPreparacion: estadoPrepDemo }) && (
                <div>
                    <CancelarPedido
                        idpedido={pedido.idpedido}
                        fechaEntrega={fechaEntrega}
                        total={totalPedido(pedido)}
                        onCancelado={(monto, porcentaje) => {
                            setEstadoLocal("CANCELADO");
                            setMontoADevolver(monto);
                            setPorcentajeDevuelto(porcentaje);
                            setEstadoPrepDemo(null);
                            onCancelado(pedido.idpedido, monto, porcentaje);
                        }}
                    />
                </div>
            )}
            </div>
        </div>
    );
}

type Pestania = "pendientes" | "entregadas" | "canceladas";

function esEntregada(pedido: Pedido): boolean {
    return pedido.estadoPreparacion === "ENTREGADO";
}

function esCancelada(pedido: Pedido): boolean {
    return pedido.estado === "CANCELADO";
}

export default function HistorialPage() {
    const [pedidos, setPedidos] = useState<Pedido[]>([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [pestania, setPestania] = useState<Pestania>("pendientes");

    useEffect(() => {
        const token = getToken();
        if (!token) {
            setError("Tenés que iniciar sesión para ver tu historial de compras.");
            setCargando(false);
            return;
        }

        apiFetch("/pedidos/mios", {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => {
                if (!res.ok) throw new Error("No se pudo obtener el historial.");
                return res.json();
            })
            .then((data: Pedido[]) => setPedidos(data))
            .catch(() => setError("No se pudo cargar tu historial de compras. Intentá de nuevo más tarde."))
            .finally(() => setCargando(false));
    }, []);

    const pedidosCancelados = pedidos.filter(esCancelada);
    const pedidosPendientes = pedidos.filter((p) => !esEntregada(p) && !esCancelada(p));
    const pedidosEntregados = pedidos.filter((p) => esEntregada(p) && !esCancelada(p));
    const pedidosMostrados =
        pestania === "pendientes"
            ? pedidosPendientes
            : pestania === "entregadas"
                ? pedidosEntregados
                : pedidosCancelados;

    const marcarPedidoCancelado = (idpedido: number, montoADevolver: number, porcentajeDevuelto: number) => {
        setPedidos((actuales) =>
            actuales.map((p) =>
                p.idpedido === idpedido
                    ? { ...p, estado: "CANCELADO", estadoPreparacion: null, montoADevolver, porcentajeDevuelto }
                    : p
            )
        );
    };

    return (
        <div className="max-w-3xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
            <div className="flex items-center gap-3 mb-5 sm:mb-6">
                <Link href="/" className="text-cyan-900 hover:text-cyan-700">
                    <FaArrowLeft size={18} />
                </Link>
                <h1 className={`text-2xl sm:text-3xl font-bold text-cyan-900 ${oi.className}`}>Historial de compras</h1>
            </div>

            {cargando && <p className="text-gray-500">Cargando tu historial...</p>}

            {!cargando && error && (
                <div className="bg-red-100 border-2 border-red-300 text-red-800 rounded-2xl p-4">{error}</div>
            )}

            {!cargando && !error && pedidos.length === 0 && (
                <div className="bg-blue-100 rounded-2xl p-8 flex flex-col items-center text-center gap-2">
                    <FaBoxOpen size={32} className="text-cyan-700" />
                    <p className="text-cyan-900 font-semibold">Todavía no hiciste ningún pedido.</p>
                    <Link href="/productos" className="text-cyan-700 underline">
                        Ver productos
                    </Link>
                </div>
            )}

            {!cargando && !error && pedidos.length > 0 && (
                <>
                    <div className="flex gap-1 sm:gap-2 mb-5 border-b-2 border-cyan-100">
                        <button
                            type="button"
                            onClick={() => setPestania("pendientes")}
                            className={`flex-1 min-w-0 sm:flex-none px-1.5 sm:px-4 py-2 text-xs sm:text-sm font-semibold rounded-t-xl cursor-pointer transition-colors ${
                                pestania === "pendientes"
                                    ? "bg-cyan-900 text-white"
                                    : "text-cyan-800 hover:bg-cyan-50"
                            }`}
                        >
                            <span className="hidden sm:inline">Ver compras </span><span className="sm:hidden capitalize">pendientes</span><span className="hidden sm:inline">pendientes</span>
                            <span
                                className={`ml-1 sm:ml-2 text-xs rounded-full px-1.5 sm:px-2 py-0.5 ${
                                    pestania === "pendientes" ? "bg-white/20" : "bg-cyan-100"
                                }`}
                            >
                                {pedidosPendientes.length}
                            </span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setPestania("entregadas")}
                            className={`flex-1 min-w-0 sm:flex-none px-1.5 sm:px-4 py-2 text-xs sm:text-sm font-semibold rounded-t-xl cursor-pointer transition-colors ${
                                pestania === "entregadas"
                                    ? "bg-cyan-900 text-white"
                                    : "text-cyan-800 hover:bg-cyan-50"
                            }`}
                        >
                            <span className="hidden sm:inline">Ver compras </span><span className="sm:hidden capitalize">finalizadas</span><span className="hidden sm:inline">finalizadas</span>
                            <span
                                className={`ml-1 sm:ml-2 text-xs rounded-full px-1.5 sm:px-2 py-0.5 ${
                                    pestania === "entregadas" ? "bg-white/20" : "bg-cyan-100"
                                }`}
                            >
                                {pedidosEntregados.length}
                            </span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setPestania("canceladas")}
                            className={`flex-1 min-w-0 sm:flex-none px-1.5 sm:px-4 py-2 text-xs sm:text-sm font-semibold rounded-t-xl cursor-pointer transition-colors ${
                                pestania === "canceladas"
                                    ? "bg-cyan-900 text-white"
                                    : "text-cyan-800 hover:bg-cyan-50"
                            }`}
                        >
                            <span className="hidden sm:inline">Ver compras </span><span className="sm:hidden capitalize">canceladas</span><span className="hidden sm:inline">canceladas</span>
                            <span
                                className={`ml-1 sm:ml-2 text-xs rounded-full px-1.5 sm:px-2 py-0.5 ${
                                    pestania === "canceladas" ? "bg-white/20" : "bg-cyan-100"
                                }`}
                            >
                                {pedidosCancelados.length}
                            </span>
                        </button>
                    </div>

                    {pedidosMostrados.length === 0 ? (
                        <div className="bg-blue-100 rounded-2xl p-8 flex flex-col items-center text-center gap-2">
                            <FaBoxOpen size={32} className="text-cyan-700" />
                            <p className="text-cyan-900 font-semibold">
                                {pestania === "pendientes"
                                    ? "No tenés compras pendientes."
                                    : pestania === "entregadas"
                                        ? "Todavía no tenés compras finalizadas."
                                        : "No tenés compras canceladas."}
                            </p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-4">
                            {pedidosMostrados.map((pedido) => (
                                <TarjetaPedido
                                    key={pedido.idpedido}
                                    pedido={pedido}
                                    onCancelado={marcarPedidoCancelado}
                                />
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
