"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { oi } from "../ui/fonts";
import { useCarrito } from "@/features/carrito/useCarrito";
import { totalCarrito } from "@/features/carrito/carrito";
import { getToken } from "@/features/auth/auth";
import Fechas from "@/componenets/Fechas";
import DireccionDeEnvio, { EnvioResuelto } from "@/componenets/DireccionDeEnvio";
import { Bounce, toast, ToastContainer } from "react-toastify";
import { FaCalendarCheck, FaCalendarAlt, FaShoppingBag, FaCheck, FaCreditCard, FaLock, FaWallet } from "react-icons/fa";
import { apiFetch } from "@/utils/apiFetch";
import { VERSION_TERMINOS } from "@/utils/datosLegales";

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

const LOGO_MERCADO_PAGO: string | null = null;

function IndicadorSeleccion({ activo }: { activo: boolean }) {
    return (
        <span
            className={`flex items-center justify-center h-6 w-6 shrink-0 rounded-full border-2 ${activo
                    ? "border-cyan-500 bg-cyan-500 text-white"
                    : "border-gray-400 bg-white text-transparent"
                }`}
        >
            <FaCheck size={12} />
        </span>
    );
}

export default function CheckoutPage() {
    const items = useCarrito();
    const subtotal = totalCarrito(items);

    const [fechaSeleccionada, setFechaSeleccionada] = useState<string | null>(null);
    const [tipoEntrega, setTipoEntrega] = useState<"RETIRO" | "ENVIO" | null>(null);
    const tipoEntregaActual = useRef<"RETIRO" | "ENVIO" | null>(null);
    tipoEntregaActual.current = tipoEntrega;
    const [envio, setEnvio] = useState<number | null>(null);
    const [metodoPago, setMetodoPago] = useState<string | null>(null);
    const [aceptaTerminos, setAceptaTerminos] = useState(false);

    const [direccionEnvio, setDireccionEnvio] = useState<string | null>(null);
    const [codigoPostalEnvio, setCodigoPostalEnvio] = useState<number | null>(null);

    const [idPedidoCreado, setIdPedidoCreado] = useState<number | null>(null);
    const [enviando, setEnviando] = useState(false);
    const [pendiente, setPendiente] = useState<{ id: number; fecha: string; productos: number } | null>(null);

    const elegirTipoEntrega = (tipo: "RETIRO" | "ENVIO") => {
        setTipoEntrega(tipo);
        setEnvio(tipo === "RETIRO" ? 0 : null);
        setDireccionEnvio(null);
        setCodigoPostalEnvio(null);
    };

    const onResultadoEnvio = ({ precio, direccionEnvio, codigoPostalEnvio }: EnvioResuelto) => {
        if (tipoEntregaActual.current !== "ENVIO") {
            return;
        }
        setEnvio(precio);
        setDireccionEnvio(direccionEnvio);
        setCodigoPostalEnvio(codigoPostalEnvio);
    };

    const total = subtotal + (envio ?? 0);
    const listoParaFinalizar =
        fechaSeleccionada !== null && tipoEntrega !== null && envio !== null && metodoPago !== null && aceptaTerminos;

    const avisarError = (mensaje: string) =>
        toast.error(mensaje, {
            position: "top-center",
            autoClose: 4000,
            theme: "colored",
            transition: Bounce,
        });

    const crearYPagar = async (idExistente: number | null = idPedidoCreado) => {
        setEnviando(true);
        try {
            let idPedido = idExistente;

            if (idPedido === null) {
                const res = await apiFetch("/pedidos", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${getToken()}`,
                    },
                    body: JSON.stringify({
                        fechaDeEntrega: fechaSeleccionada,
                        items: items.map((item) => ({
                            idProducto: item.idProducto,
                            descripcion: item.descripcion,
                            precioUnitario: item.precioUnitario,
                            cantidad: item.cantidad,
                        })),
                        direccionEnvio: tipoEntrega === "ENVIO" ? direccionEnvio : null,
                        codigoPostalEnvio: tipoEntrega === "ENVIO" ? codigoPostalEnvio : null,
                        aceptaTerminos,
                        versionTerminos: VERSION_TERMINOS,
                    }),
                });

                if (!res.ok) {
                    throw new Error("No se pudo crear el pedido.");
                }

                const pedidoCreado = await res.json();
                idPedido = pedidoCreado.idpedido as number;
                setIdPedidoCreado(idPedido);
            }

            const resPago = await apiFetch("/pagos/preferencia", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${getToken()}`,
                },
                body: JSON.stringify({ idPedido }),
            });

            if (!resPago.ok) {
                throw new Error("No se pudo iniciar el pago.");
            }

            const { urlPago } = await resPago.json();
            window.location.href = urlPago;
        } catch {
            avisarError("No se pudo iniciar el pago. Probá de nuevo en un momento.");
            setEnviando(false);
        }
    };

    const finalizar = async () => {
        if (idPedidoCreado === null) {
            setEnviando(true);
            try {
                const res = await apiFetch("/pedidos/mios", {
                    method: "GET",
                    headers: { Authorization: `Bearer ${getToken()}` },
                });
                if (res.ok) {
                    const mios: { idpedido: number; fecha_de_pedido: string; estado: string; items?: unknown[] }[] =
                        await res.json();
                    const sinPagar = mios.find((p) => p.estado === "INICIADO");
                    if (sinPagar) {
                        setPendiente({
                            id: sinPagar.idpedido,
                            fecha: sinPagar.fecha_de_pedido,
                            productos: sinPagar.items?.length ?? 0,
                        });
                        setEnviando(false);
                        return;
                    }
                }
            } catch {
            }
        }
        await crearYPagar();
    };

    const cancelarPendienteYContinuar = async () => {
        if (!pendiente) return;
        setEnviando(true);
        try {
            const res = await apiFetch(`/pedidos/${pendiente.id}/estado`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${getToken()}`,
                },
                body: JSON.stringify({ estado: "CANCELADO" }),
            });
            if (!res.ok) throw new Error();
            setPendiente(null);
            await crearYPagar(null);
        } catch {
            avisarError("No se pudo cancelar el pedido pendiente. Probá de nuevo.");
            setEnviando(false);
        }
    };

    const pagarPendiente = async () => {
        if (!pendiente) return;
        const id = pendiente.id;
        setPendiente(null);
        setIdPedidoCreado(id);
        await crearYPagar(id);
    };

    const fechaLegible = (iso: string) => {
        const [a, m, d] = iso.split("-");
        return a && m && d ? `${d}/${m}/${a}` : iso;
    };

    if (items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
                <h1 className={`text-3xl font-bold text-cyan-900 mb-4 ${oi.className}`}>
                    Tu carrito está vacío
                </h1>
                <Link
                    href="/productos?categoria=TORTAS&tipo=TORTA"
                    className="bg-[#09c99f] hover:bg-[#07a88a] text-white font-semibold px-6 py-2 rounded-full"
                >
                    Ver productos
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto px-3 sm:px-4 py-6 sm:py-8 flex flex-col gap-5 sm:gap-6">
            <h1 className={`text-3xl font-bold text-cyan-900 ${oi.className}`}>Finalizar compra</h1>

            <div className="bg-blue-100 rounded-2xl p-3 sm:p-4">
                <h2 className={`text-xl font-bold text-cyan-900 mb-3 ${oi.className}`}>Tu pedido</h2>
                <div className="flex flex-col gap-3">
                    {items.map((item) => (
                        <div
                            key={item.id}
                            className="flex items-center gap-3 bg-white border-2 border-cyan-200 rounded-2xl p-3 sm:p-4 shadow-sm"
                        >
                            <div className="hidden sm:flex items-center justify-center h-12 w-12 rounded-full bg-cyan-500 text-white shrink-0">
                                <FaShoppingBag size={18} />
                            </div>
                            <div className="flex-1 min-w-0 break-words">
                                <p className="text-xs uppercase tracking-wide text-cyan-700 font-semibold">
                                    {item.tipo}
                                </p>
                                <p className="text-lg font-bold text-cyan-900 capitalize leading-tight">
                                    {item.nombre}
                                </p>
                                <p className="text-xs text-gray-600">{item.descripcion}</p>
                                <p className="text-xs text-gray-500">Cantidad: {item.cantidad}</p>
                            </div>
                            <span className="font-semibold whitespace-nowrap">
                                {item.precioUnitario * item.cantidad} $
                            </span>
                        </div>
                    ))}
                </div>
                <div className="flex justify-between mt-3 font-semibold text-lg">
                    <span>Subtotal</span>
                    <span>{subtotal} $</span>
                </div>
            </div>

            <div className="bg-[#bddbe8] rounded-2xl p-3 sm:p-4">
                <h2 className={`text-xl font-bold text-cyan-900 mb-3 ${oi.className}`}>
                    1. Elegí la fecha de entrega
                </h2>
                <div className="h-90 sm:h-105">
                    <Fechas
                        seleccionable
                        fechaSeleccionada={fechaSeleccionada}
                        onSeleccionarFecha={setFechaSeleccionada}
                    />
                </div>

                <div className="mt-2 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm font-medium text-cyan-900">
                    <span className="flex items-center gap-2">
                        <span className="h-4 w-4 rounded-full bg-[#02831e] inline-block" />
                        Disponible
                    </span>
                    <span className="flex items-center gap-2">
                        <span className="h-4 w-4 rounded-full bg-[#deb71d] inline-block" />
                        Poca disponibilidad
                    </span>
                    <span className="flex items-center gap-2">
                        <span className="h-4 w-4 rounded-full bg-[#f03869] inline-block" />
                        Sin cupo
                    </span>
                </div>

                {fechaSeleccionada ? (
                    <div className="mt-3 flex items-center gap-3 bg-white border-2 border-cyan-500 rounded-2xl p-3 sm:p-4 shadow-sm">
                        <div className="flex items-center justify-center h-12 w-12 rounded-full bg-cyan-500 text-white shrink-0">
                            <FaCalendarCheck size={22} />
                        </div>
                        <div>
                            <p className="text-xs uppercase tracking-wide text-cyan-700 font-semibold">
                                Fecha de entrega elegida
                            </p>
                            <p className="text-lg font-bold text-cyan-900 leading-tight">
                                {formatearFechaLegible(fechaSeleccionada)}
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="mt-3 flex items-center gap-3 bg-white/60 border-2 border-dashed border-cyan-400 rounded-2xl p-3 sm:p-4">
                        <div className="flex items-center justify-center h-12 w-12 rounded-full bg-cyan-200 text-cyan-700 shrink-0">
                            <FaCalendarAlt size={20} />
                        </div>
                        <div>
                            <p className="text-xs uppercase tracking-wide text-cyan-700 font-semibold">
                                Sin fecha seleccionada
                            </p>
                            <p className="text-sm text-cyan-900 leading-tight">
                                Todavía no elegiste una fecha. Todo lo que hay en el carrito se entrega ese mismo día.
                            </p>
                        </div>
                    </div>
                )}
            </div>

            <div className="bg-blue-100 rounded-2xl p-3 sm:p-4">
                <h2 className={`text-xl font-bold text-cyan-900 mb-3 ${oi.className}`}>
                    2. ¿Retirás en el local o lo enviamos?
                </h2>

                <div className="flex gap-3">
                    <button
                        type="button"
                        role="radio"
                        aria-checked={tipoEntrega === "RETIRO"}
                        onClick={() => elegirTipoEntrega("RETIRO")}
                        className={`flex-1 flex items-center gap-3 border-2 rounded-xl p-3 cursor-pointer text-left transition-colors ${tipoEntrega === "RETIRO"
                                ? "border-cyan-500 bg-cyan-50 shadow-md"
                                : "border-gray-300 bg-white hover:border-cyan-300"
                            }`}
                    >
                        <IndicadorSeleccion activo={tipoEntrega === "RETIRO"} />
                        <span className="flex flex-col leading-tight">
                            <span className="font-semibold">Retirar en el local</span>
                            <span className="text-xs text-gray-500">Sin costo de envío</span>
                        </span>
                    </button>

                    <button
                        type="button"
                        role="radio"
                        aria-checked={tipoEntrega === "ENVIO"}
                        onClick={() => elegirTipoEntrega("ENVIO")}
                        className={`flex-1 flex items-center gap-3 border-2 rounded-xl p-3 cursor-pointer text-left transition-colors ${tipoEntrega === "ENVIO"
                                ? "border-cyan-500 bg-cyan-50 shadow-md"
                                : "border-gray-300 bg-white hover:border-cyan-300"
                            }`}
                    >
                        <IndicadorSeleccion activo={tipoEntrega === "ENVIO"} />
                        <span className="flex flex-col leading-tight">
                            <span className="font-semibold">Envío a domicilio</span>
                            <span className="text-xs text-gray-500">Calculá el costo por tu código postal</span>
                        </span>
                    </button>
                </div>

                <div className="mt-4">
                    <DireccionDeEnvio
                        onResultado={onResultadoEnvio}
                        disabled={tipoEntrega !== "ENVIO"}
                    />
                </div>

                {tipoEntrega === "RETIRO" && (
                    <p className="mt-2 text-sm text-cyan-900">Retirás en el local, sin costo de envío.</p>
                )}
                {tipoEntrega === null && (
                    <p className="mt-2 text-sm text-gray-500">Elegí una opción para continuar.</p>
                )}
            </div>

            <div className="bg-blue-100 rounded-2xl p-3 sm:p-4">
                <h2 className={`text-xl font-bold text-cyan-900 mb-3 ${oi.className}`}>
                    3. Método de pago
                </h2>
                <button
                    type="button"
                    role="radio"
                    aria-checked={metodoPago === "MERCADO_PAGO"}
                    onClick={() => setMetodoPago("MERCADO_PAGO")}
                    className={`w-full border-2 rounded-xl p-3 sm:p-4 cursor-pointer text-left transition-colors flex flex-col gap-3 ${metodoPago === "MERCADO_PAGO"
                            ? "border-cyan-500 bg-cyan-50 shadow-md"
                            : "border-gray-300 bg-white hover:border-cyan-300"
                        }`}
                >
                    <span className="flex items-center gap-3">
                        <IndicadorSeleccion activo={metodoPago === "MERCADO_PAGO"} />
                        {LOGO_MERCADO_PAGO ? (
                            <Image
                                src={LOGO_MERCADO_PAGO}
                                alt="Mercado Pago"
                                width={140}
                                height={40}
                                className="h-10 w-auto object-contain"
                            />
                        ) : (
                            <span className="flex items-center justify-center h-10 w-10 shrink-0 rounded-xl bg-[#0f98c5] text-white">
                                <FaCreditCard size={20} />
                            </span>
                        )}
                        <span className="flex flex-col leading-tight">
                            <span className="font-bold text-cyan-900 text-lg">Mercado Pago</span>
                            <span className="text-xs text-gray-500">Pagá de forma rápida y segura</span>
                        </span>
                    </span>

                    <span className="flex flex-wrap gap-2">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 text-cyan-900 text-xs font-medium px-3 py-1">
                            <FaCreditCard size={12} /> Tarjeta de crédito
                        </span>
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 text-cyan-900 text-xs font-medium px-3 py-1">
                            <FaCreditCard size={12} /> Tarjeta de débito
                        </span>
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 text-cyan-900 text-xs font-medium px-3 py-1">
                            <FaWallet size={12} /> Dinero en cuenta
                        </span>
                    </span>

                    <span className="flex items-start gap-2 text-xs text-gray-500">
                        <FaLock size={12} className="mt-0.5 shrink-0" />
                        <span>
                            Al finalizar te llevamos al sitio de Mercado Pago para completar el pago de forma segura.
                            No se aceptan pagos en efectivo.
                        </span>
                    </span>
                </button>
            </div>

            <div className="bg-[#0f98c5] rounded-2xl p-3 sm:p-4 text-white">
                <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{subtotal} $</span>
                </div>
                <div className="flex justify-between">
                    <span>Envío</span>
                    <span>{envio !== null ? `${envio} $` : "-"}</span>
                </div>
                <div className="flex justify-between text-xl font-bold mt-2 border-t border-white/30 pt-2">
                    <span>Total</span>
                    <span>{total} $</span>
                </div>
            </div>

            <label className="flex items-start gap-3 text-sm text-gray-700 cursor-pointer">
                <input
                    type="checkbox"
                    checked={aceptaTerminos}
                    onChange={(e) => setAceptaTerminos(e.target.checked)}
                    className="mt-1 h-5 w-5 shrink-0 accent-[#09c99f] cursor-pointer"
                />
                <span>
                    Leí y acepto los{" "}
                    <Link href="/terminos" target="_blank" className="underline text-cyan-800">
                        términos y condiciones
                    </Link>
                    , la{" "}
                    <Link href="/privacidad" target="_blank" className="underline text-cyan-800">
                        política de privacidad
                    </Link>{" "}
                    y las condiciones de{" "}
                    <Link href="/cambios-y-devoluciones" target="_blank" className="underline text-cyan-800">
                        cambios y devoluciones
                    </Link>
                    .
                </span>
            </label>

            <button
                type="button"
                disabled={!listoParaFinalizar || enviando}
                onClick={finalizar}
                className={`w-full h-12 rounded-2xl text-white font-semibold text-xl ${listoParaFinalizar && !enviando
                        ? "bg-[#09c99f] hover:bg-[#07a88a] cursor-pointer"
                        : "bg-gray-400 cursor-not-allowed"
                    }`}
            >
                {enviando ? "Redirigiendo a Mercado Pago..." : "Pagar con Mercado Pago"}
            </button>

            {pendiente && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
                    <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
                        <h2 className={`text-2xl font-bold text-cyan-900 mb-2 ${oi.className}`}>
                            Tenés un pedido sin pagar
                        </h2>
                        <p className="text-gray-600 mb-1">
                            El pedido #{pendiente.id} para el {fechaLegible(pendiente.fecha)}
                            {pendiente.productos > 0 ? ` (${pendiente.productos} ${pendiente.productos === 1 ? "producto" : "productos"})` : ""} todavía
                            no se pagó y está reservando esa fecha.
                        </p>
                        <p className="text-gray-600 mb-5">
                            Solo podés tener un pedido sin pagar a la vez. ¿Qué querés hacer?
                        </p>
                        <div className="flex flex-col gap-2">
                            <button
                                type="button"
                                onClick={pagarPendiente}
                                disabled={enviando}
                                className="w-full h-11 rounded-full text-white font-semibold bg-[#09c99f] hover:bg-[#07a88a] cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                Pagar ese pedido
                            </button>
                            <button
                                type="button"
                                onClick={cancelarPendienteYContinuar}
                                disabled={enviando}
                                className="w-full h-11 rounded-full font-semibold text-red-600 border border-red-300 hover:bg-red-50 cursor-pointer disabled:text-gray-400 disabled:border-gray-300 disabled:cursor-not-allowed"
                            >
                                Cancelarlo y hacer este pedido nuevo
                            </button>
                            <button
                                type="button"
                                onClick={() => setPendiente(null)}
                                disabled={enviando}
                                className="w-full h-11 rounded-full font-semibold text-gray-500 hover:bg-gray-100 cursor-pointer disabled:cursor-not-allowed"
                            >
                                Volver
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <ToastContainer
                position="top-center"
                autoClose={4000}
                theme="colored"
                transition={Bounce}
            />
        </div>
    );
}
