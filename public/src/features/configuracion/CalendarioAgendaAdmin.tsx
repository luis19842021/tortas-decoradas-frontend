"use client"

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { BsChevronCompactLeft, BsChevronCompactRight } from "react-icons/bs";
import { Lock, LockOpen, NotebookPen, Phone, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { toast } from "react-toastify";
import FacturaPedidoAdmin from "@/features/factura/FacturaPedidoAdmin";
import NotaCreditoPedidoAdmin from "@/features/factura/NotaCreditoPedidoAdmin";
import { facturasExistentes, notasCreditoExistentes } from "@/features/factura/api";
import {
    CupoPorFecha,
    DiaBloqueado,
    PedidoManual,
    PedidoDeFecha,
    obtenerPedidosPorFecha,
    obtenerDiasBloqueados,
    obtenerPedidosManuales,
    crearPedidoManual,
    eliminarPedidoManual,
    obtenerPedidosDeFecha,
    bloquearDia,
    desbloquearDia,
    marcarPedidoEntregado,
} from "./api";

const clodinaryLoader = ({ src, width, quality }: { src: string; width: number; quality?: number }) => {
    return `https://res.cloudinary.com/dkdywvyce/image/upload/w_${width},q_${quality || 75}/${src}`;
}

interface Props {
    cupoMaximoPorDia: number
}

export default function CalendarioAgendaAdmin({ cupoMaximoPorDia }: Props) {

    const [pedidos, setPedidos] = useState<CupoPorFecha[]>([])
    const [diasBloqueados, setDiasBloqueados] = useState<DiaBloqueado[]>([])
    const [pedidosManuales, setPedidosManuales] = useState<PedidoManual[]>([])
    const [cargando, setCargando] = useState(true)
    const [procesando, setProcesando] = useState(false)
    const [diaElegido, setDiaElegido] = useState<string | null>(null)
    const [motivo, setMotivo] = useState("")
    const [cantidadManual, setCantidadManual] = useState(1)
    const [motivoManual, setMotivoManual] = useState("")
    const [agregandoManual, setAgregandoManual] = useState(false)
    const [pedidosDeFechaElegida, setPedidosDeFechaElegida] = useState<PedidoDeFecha[]>([])
    const [cargandoPedidosDeFecha, setCargandoPedidosDeFecha] = useState(false)
    const [pedidosConFactura, setPedidosConFactura] = useState<number[]>([])
    const [pedidosConNota, setPedidosConNota] = useState<number[]>([])
    const [pedidoDetalle, setPedidoDetalle] = useState<PedidoDeFecha | null>(null)
    const dialogRef = useRef<HTMLDialogElement>(null)
    const detalleDialogRef = useRef<HTMLDialogElement>(null)

    const cargar = async () => {
        try {
            const [nuevosPedidos, nuevosBloqueados] = await Promise.all([
                obtenerPedidosPorFecha(),
                obtenerDiasBloqueados(),
            ])
            setPedidos(nuevosPedidos)
            setDiasBloqueados(nuevosBloqueados)
        } catch (error) {
            console.error("Error al cargar el calendario de agenda:", error)
            toast.warning("No se pudo cargar el calendario de agenda")
        } finally {
            setCargando(false)
        }

        try {
            setPedidosManuales(await obtenerPedidosManuales())
        } catch (error) {
            console.error("Error al cargar los pedidos manuales:", error)
        }
    }

    useEffect(() => {
        cargar()
    }, [])

    useEffect(() => {
        if (!diaElegido) {
            setPedidosDeFechaElegida([])
            return
        }
        setCargandoPedidosDeFecha(true)
        obtenerPedidosDeFecha(diaElegido)
            .then(setPedidosDeFechaElegida)
            .catch((error) => {
                console.error("Error al cargar los pedidos online de la fecha:", error)
                setPedidosDeFechaElegida([])
            })
            .finally(() => setCargandoPedidosDeFecha(false))
    }, [diaElegido])

    const meses = [
        { mes: 'Enero', numMes: 1 }, { mes: 'Febrero', numMes: 2 }, { mes: 'Marzo', numMes: 3 },
        { mes: 'Abril', numMes: 4 }, { mes: 'Mayo', numMes: 5 }, { mes: 'Junio', numMes: 6 },
        { mes: 'Julio', numMes: 7 }, { mes: 'Agosto', numMes: 8 }, { mes: 'Septiembre', numMes: 9 },
        { mes: 'Octubre', numMes: 10 }, { mes: 'Noviembre', numMes: 11 }, { mes: 'Diciembre', numMes: 12 },
    ]
    const mes = new Date().getMonth()
    const anioActual = new Date().getFullYear()
    const [currenrIndex, setCurrentIndex] = useState(0)

    const formatearFecha = (fecha: Date) => {
        const y = fecha.getFullYear()
        const m = String(fecha.getMonth() + 1).padStart(2, "0")
        const d = String(fecha.getDate()).padStart(2, "0")
        return `${y}-${m}-${d}`
    }

    const construirGrillaMes = (anio: number, numMes: number) => {
        const primerDia = new Date(anio, numMes - 1, 1)
        const offsetInicial = primerDia.getDay()
        const diasDelMes = new Date(anio, numMes, 0).getDate()

        const celdas: { fecha: string; dia: number }[] = []

        for (let i = offsetInicial; i > 0; i--) {
            const fecha = new Date(anio, numMes - 1, 1 - i)
            celdas.push({ fecha: formatearFecha(fecha), dia: fecha.getDate() })
        }
        for (let dia = 1; dia <= diasDelMes; dia++) {
            const fecha = new Date(anio, numMes - 1, dia)
            celdas.push({ fecha: formatearFecha(fecha), dia })
        }
        let diaSiguiente = 1
        while (celdas.length < 35) {
            const fecha = new Date(anio, numMes, diaSiguiente)
            celdas.push({ fecha: formatearFecha(fecha), dia: fecha.getDate() })
            diaSiguiente++
        }
        return celdas
    }

    const tablas = [0, 1, 2].map((offset) => {
        let numMes = mes + 1 + offset
        let anio = anioActual
        while (numMes > 12) {
            numMes -= 12
            anio += 1
        }
        return construirGrillaMes(anio, numMes)
    })
    const tablaActual = tablas[currenrIndex]

    const nomMes = (num: number) => {
        let numMes = mes + num
        while (numMes > 12) numMes -= 12
        return meses.find((m) => m.numMes === numMes)?.mes ?? ""
    }

    const dentroDeAnticipacionMinima = (fe: string) => {
        const fechaCelda = new Date(fe + "T00:00:00")
        const hoy = new Date()
        hoy.setHours(0, 0, 0, 0)
        const diffDias = Math.round((fechaCelda.getTime() - hoy.getTime()) / (24 * 60 * 60 * 1000))
        return diffDias >= 0 && diffDias < 2
    }

    const cantidadEnFecha = (fe: string) => pedidos.find((p) => p.fecha_de_pedido === fe)?.total ?? 0

    const bloqueadoEnFecha = (fe: string) => diasBloqueados.find((d) => d.fecha === fe)

    const manualesEnFecha = (fe: string) => pedidosManuales.filter((p) => p.fecha === fe)

    const esDelMesMostrado = (fe: string) => {
        let mesMostrado = mes + 1 + currenrIndex
        while (mesMostrado > 12) mesMostrado -= 12
        return parseInt(fe.substring(5, 7)) === mesMostrado
    }

    const esPasado = (fe: string) => {
        const fechaCelda = new Date(fe + "T00:00:00")
        const hoy = new Date()
        hoy.setHours(0, 0, 0, 0)
        return fechaCelda < hoy
    }

    const colorDia = (fe: string) => {
        if (!esDelMesMostrado(fe)) return "bg-gray-600 text-transparent"
        if (esPasado(fe)) return "bg-gray-600"
        if (dentroDeAnticipacionMinima(fe)) return "bg-[#f03869]"

        const cant = cantidadEnFecha(fe)
        if (cant < cupoMaximoPorDia - 1) return "bg-[#02831e]"
        if (cant === cupoMaximoPorDia - 1) return "bg-[#deb71d]"
        return "bg-[#f03869]"
    }

    const prevSlide = () => currenrIndex > 0 && setCurrentIndex(currenrIndex - 1)
    const nextSlide = () => currenrIndex < 2 && setCurrentIndex(currenrIndex + 1)

    const abrirDialogo = (fecha: string) => {
        if (!esDelMesMostrado(fecha)) return
        setDiaElegido(fecha)
        setMotivo("")
        setCantidadManual(1)
        setMotivoManual("")
        dialogRef.current?.showModal()
    }

    const cerrarDialogo = () => {
        dialogRef.current?.close()
        setDiaElegido(null)
    }

    const confirmarBloqueo = async () => {
        if (!diaElegido) return
        setProcesando(true)
        try {
            await bloquearDia(diaElegido, motivo)
            toast.success("Día bloqueado correctamente")
            cerrarDialogo()
            await cargar()
        } catch (error) {
            console.error("Error al bloquear el día:", error)
            toast.warning("No se pudo bloquear el día")
        } finally {
            setProcesando(false)
        }
    }

    const confirmarAgregarManual = async () => {
        if (!diaElegido || cantidadManual < 1) return
        setAgregandoManual(true)
        try {
            await crearPedidoManual(diaElegido, cantidadManual, motivoManual)
            toast.success("Pedido manual cargado correctamente")
            setCantidadManual(1)
            setMotivoManual("")
            await cargar()
        } catch (error) {
            console.error("Error al cargar el pedido manual:", error)
            toast.warning("No se pudo cargar el pedido manual")
        } finally {
            setAgregandoManual(false)
        }
    }

    const confirmarEliminarManual = async (id: number) => {
        setAgregandoManual(true)
        try {
            await eliminarPedidoManual(id)
            toast.success("Pedido manual eliminado")
            await cargar()
        } catch (error) {
            console.error("Error al eliminar el pedido manual:", error)
            toast.warning("No se pudo eliminar el pedido manual")
        } finally {
            setAgregandoManual(false)
        }
    }

    const confirmarDesbloqueo = async () => {
        if (!diaElegido) return
        setProcesando(true)
        try {
            await desbloquearDia(diaElegido)
            toast.success("Día desbloqueado correctamente")
            cerrarDialogo()
            await cargar()
        } catch (error) {
            console.error("Error al desbloquear el día:", error)
            toast.warning("No se pudo desbloquear el día")
        } finally {
            setProcesando(false)
        }
    }

    const totalDePedido = (pedido: PedidoDeFecha) =>
        pedido.items.reduce((acc, item) => acc + item.precioUnitario * item.cantidad, 0)

    const [entregando, setEntregando] = useState(false)
    const entregarPedido = async (pedido: PedidoDeFecha) => {
        setEntregando(true)
        try {
            await marcarPedidoEntregado(pedido.idpedido)
            setPedidosDeFechaElegida((previos) => previos.map((p) =>
                p.idpedido === pedido.idpedido ? { ...p, estadoPreparacion: "ENTREGADO" } : p))
            toast.success(`Pedido #${pedido.idpedido} marcado como entregado`)
            cerrarDetallePedido()
        } catch (error) {
            console.error("Error al marcar el pedido como entregado:", error)
            toast.warning("No se pudo marcar el pedido como entregado")
        } finally {
            setEntregando(false)
        }
    }

    const abrirDetallePedido = (pedido: PedidoDeFecha) => {
        setPedidoDetalle(pedido)
        detalleDialogRef.current?.showModal()
    }

    const cerrarDetallePedido = () => {
        detalleDialogRef.current?.close()
        setPedidoDetalle(null)
    }

    const bloqueoElegido = diaElegido ? bloqueadoEnFecha(diaElegido) : undefined
    const manualesDelDiaElegido = diaElegido ? manualesEnFecha(diaElegido) : []
    const pedidosPendientesDelDia = pedidosDeFechaElegida.filter(
        (p) => p.estado === "INICIADO" || (p.estado === "CUMPLIDO" && p.estadoPreparacion !== "ENTREGADO")
    )

    const pedidosCanceladosConReembolso = pedidosDeFechaElegida.filter(
        (p) => p.estado === "CANCELADO" && (p.montoADevolver ?? 0) > 0
    )
    const idsCancelados = pedidosCanceladosConReembolso.map((p) => p.idpedido).join(",")

    useEffect(() => {
        const ids = idsCancelados ? idsCancelados.split(",").map(Number) : []
        if (ids.length === 0) {
            setPedidosConFactura([])
            setPedidosConNota([])
            return
        }
        facturasExistentes(ids).then(setPedidosConFactura).catch(() => setPedidosConFactura([]))
        notasCreditoExistentes(ids).then(setPedidosConNota).catch(() => setPedidosConNota([]))
    }, [idsCancelados, pedidoDetalle])

    return (
        <div className="w-full bg-white rounded-2xl shadow-md px-6 py-6">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <p className="text-gray-700 text-xl font-semibold">Calendario de agenda</p>
                    <p className="text-gray-500">
                        Mismo semáforo que ve el cliente. Tocá un día para bloquearlo o desbloquearlo a mano.
                    </p>
                </div>
            </div>

            <div className="bg-amber-50 rounded-2xl pt-2">
                <div className='flex justify-between px-6 items-center text-xl h-12'>
                    <div className={`${currenrIndex === 0 ? "invisible" : "visible"} rounded-full p-1 bg-black/20 text-white cursor-pointer`}>
                        <BsChevronCompactLeft onClick={prevSlide} size={22} />
                    </div>
                    <span className="text-gray-700 font-semibold">
                        {currenrIndex === 0 ? nomMes(1) : currenrIndex === 1 ? nomMes(2) : nomMes(3)}
                    </span>
                    <div className={`${currenrIndex === 2 ? "invisible" : "visible"} rounded-full p-1 bg-black/20 text-white cursor-pointer`}>
                        <BsChevronCompactRight onClick={nextSlide} size={22} />
                    </div>
                </div>

                <div className="grid grid-cols-7 h-8 place-items-center text-gray-600 text-sm">
                    <div>dom</div><div>lun</div><div>mar</div><div>mie</div><div>jue</div><div>vie</div><div>sab</div>
                </div>

                <div className="grid grid-cols-7 gap-2 px-4 pb-4">
                    {tablaActual.map((celda, i) => {
                        const bloqueo = bloqueadoEnFecha(celda.fecha)
                        const manuales = manualesEnFecha(celda.fecha)
                        const interactuable = esDelMesMostrado(celda.fecha)
                        const cant = cantidadEnFecha(celda.fecha)
                        return (
                            <div key={i} className="flex items-center justify-center">
                                <button type="button" disabled={cargando || !interactuable}
                                    onClick={() => abrirDialogo(celda.fecha)}
                                    className={`relative flex flex-col items-center justify-center rounded-xl h-14 w-14 text-amber-50 ${colorDia(celda.fecha)} ${interactuable ? "cursor-pointer hover:brightness-110" : "cursor-default"}`}>
                                    <span className="text-lg leading-none">{celda.dia}</span>
                                    {interactuable && !esPasado(celda.fecha) && cant > 0 && (
                                        <span className="text-[10px] leading-none opacity-90">{cant}/{cupoMaximoPorDia}</span>
                                    )}
                                    {bloqueo && (
                                        <span className="absolute -top-1.5 -right-1.5 flex items-center justify-center bg-gray-900 rounded-full w-6 h-6 shadow">
                                            <Lock size={13} className="text-white" />
                                        </span>
                                    )}
                                    {!bloqueo && manuales.length > 0 && (
                                        <span className="absolute -top-1.5 -right-1.5 flex items-center justify-center bg-sky-600 rounded-full w-6 h-6 shadow">
                                            <NotebookPen size={12} className="text-white" />
                                        </span>
                                    )}
                                </button>
                            </div>
                        )
                    })}
                </div>
            </div>

            <dialog ref={dialogRef} onClose={() => setDiaElegido(null)}
                className="m-auto rounded-2xl p-0 backdrop:bg-black/40 open:animate-in open:fade-in open:duration-200">
                {diaElegido && (
                    <div className="w-96 max-w-[calc(100vw-1.5rem)] p-4 sm:p-6 max-h-[85vh] overflow-y-auto">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="flex items-center justify-center bg-sky-100 rounded-full w-10 h-10 shrink-0">
                                <NotebookPen className="text-sky-600" size={18} />
                            </div>
                            <div>
                                <p className="text-gray-700 font-semibold">Pedidos manuales</p>
                                <p className="text-gray-400 text-xs">{diaElegido}</p>
                            </div>
                        </div>

                        {manualesDelDiaElegido.length > 0 && (
                            <div className="flex flex-col gap-1.5 mb-3">
                                {manualesDelDiaElegido.map((pedido) => (
                                    <div key={pedido.id} className="flex items-center justify-between gap-2 bg-sky-50 rounded-xl px-3 py-2">
                                        <div className="min-w-0">
                                            <p className="text-sky-900 text-sm font-semibold">
                                                {pedido.cantidad} {pedido.cantidad === 1 ? "pedido" : "pedidos"}
                                            </p>
                                            {pedido.motivo && (
                                                <p className="text-sky-700/80 text-xs truncate" title={pedido.motivo}>{pedido.motivo}</p>
                                            )}
                                        </div>
                                        <button type="button" disabled={agregandoManual} onClick={() => confirmarEliminarManual(pedido.id)}
                                            className="flex items-center justify-center rounded-full w-7 h-7 text-sky-700 hover:bg-sky-100 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shrink-0">
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="flex items-end gap-2 mb-6">
                            <div className="w-20">
                                <label className="text-gray-500 text-xs mb-1 block">Cantidad</label>
                                <input type="number" min={1} value={cantidadManual}
                                    onChange={(e) => setCantidadManual(Math.max(1, Number(e.target.value)))}
                                    className="w-full border-2 rounded-xl bg-cyan-50 border-cyan-700 p-2 text-sm" />
                            </div>
                            <div className="flex-1">
                                <label className="text-gray-500 text-xs mb-1 block">Motivo (opcional)</label>
                                <input type="text" value={motivoManual} onChange={(e) => setMotivoManual(e.target.value)}
                                    placeholder="Ej: pedido por WhatsApp"
                                    className="w-full border-2 rounded-xl bg-cyan-50 border-cyan-700 p-2 text-sm" />
                            </div>
                            <button type="button" disabled={agregandoManual} onClick={confirmarAgregarManual}
                                className="flex items-center justify-center rounded-xl h-[38px] w-[38px] text-white bg-sky-600 hover:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shrink-0">
                                <Plus size={18} />
                            </button>
                        </div>

                        <div className="border-t border-gray-200 mb-5" />

                        <div className="flex items-center gap-3 mb-3">
                            <div className="flex items-center justify-center bg-amber-100 rounded-full w-10 h-10 shrink-0">
                                <ShoppingBag className="text-amber-600" size={18} />
                            </div>
                            <div>
                                <p className="text-gray-700 font-semibold">Pedidos online pendientes</p>
                                <p className="text-gray-400 text-xs">{diaElegido}</p>
                            </div>
                        </div>

                        {cargandoPedidosDeFecha ? (
                            <p className="text-gray-400 text-sm mb-5">Cargando...</p>
                        ) : pedidosPendientesDelDia.length === 0 ? (
                            <p className="text-gray-400 text-sm mb-5">No hay pedidos online pendientes para este día.</p>
                        ) : (
                            <div className="flex flex-col gap-1.5 mb-5">
                                {pedidosPendientesDelDia.map((pedido) => (
                                    <button type="button" key={pedido.idpedido} onClick={() => abrirDetallePedido(pedido)}
                                        className={"flex items-center justify-between gap-2 rounded-xl px-3 py-2 text-left cursor-pointer " + (pedido.estado === "INICIADO" ? "bg-gray-100 hover:bg-gray-200 border border-dashed border-gray-400" : "bg-amber-50 hover:bg-amber-100")}>
                                        <div className="min-w-0">
                                            <p className="text-amber-900 text-sm font-semibold truncate">
                                                #{pedido.idpedido} · {pedido.clienteNombre || "Cliente"}
                                            </p>
                                            <p className="text-amber-700/80 text-xs truncate">
                                                {pedido.items.length} {pedido.items.length === 1 ? "producto" : "productos"} · ${totalDePedido(pedido).toLocaleString('es-AR')}
                                            </p>
                                        </div>
                                        {pedido.estado === "INICIADO" ? (
                                            <span className="text-gray-600 bg-gray-200 rounded-full px-2 py-0.5 text-xs font-semibold shrink-0">Pendiente de pago</span>
                                        ) : (
                                            <span className="text-emerald-700 bg-emerald-100 rounded-full px-2 py-0.5 text-xs font-semibold shrink-0">Pagado</span>
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}

                        {pedidosCanceladosConReembolso.length > 0 && (
                            <div className="mb-5">
                                <p className="text-gray-700 font-semibold mb-2">Cancelados con reembolso</p>
                                <div className="flex flex-col gap-1.5">
                                    {pedidosCanceladosConReembolso.map((pedido) => {
                                        const faltaNota = pedidosConFactura.includes(pedido.idpedido) && !pedidosConNota.includes(pedido.idpedido)
                                        return (
                                            <button type="button" key={pedido.idpedido} onClick={() => abrirDetallePedido(pedido)}
                                                className="flex items-center justify-between gap-2 rounded-xl px-3 py-2 text-left cursor-pointer bg-red-50 hover:bg-red-100">
                                                <div className="min-w-0">
                                                    <p className="text-red-900 text-sm font-semibold truncate">
                                                        #{pedido.idpedido} · {pedido.clienteNombre || "Cliente"}
                                                    </p>
                                                    <p className="text-red-700/80 text-xs truncate">
                                                        Devuelto ${(pedido.montoADevolver ?? 0).toLocaleString('es-AR')}
                                                    </p>
                                                </div>
                                                {faltaNota ? (
                                                    <span className="text-amber-800 bg-amber-100 rounded-full px-2 py-0.5 text-xs font-semibold shrink-0">Falta nota de crédito</span>
                                                ) : pedidosConNota.includes(pedido.idpedido) ? (
                                                    <span className="text-emerald-700 text-xs font-semibold shrink-0">Nota enviada</span>
                                                ) : (
                                                    <span className="text-red-600 text-xs font-semibold shrink-0">Ver</span>
                                                )}
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>
                        )}

                        <div className="border-t border-gray-200 mb-5" />

                        {bloqueoElegido ? (
                            <>
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="flex items-center justify-center bg-gray-100 rounded-full w-10 h-10 shrink-0">
                                        <Lock className="text-gray-600" size={18} />
                                    </div>
                                    <p className="text-gray-700 font-semibold">Día bloqueado</p>
                                </div>
                                <p className="text-gray-500 mb-1">{diaElegido}</p>
                                <p className="text-gray-600 mb-5">{bloqueoElegido.motivo}</p>
                                <div className="flex justify-between gap-6">
                                    <button type="button" onClick={cerrarDialogo}
                                        className="rounded-full px-4 py-2 font-semibold text-gray-500 hover:bg-gray-100 cursor-pointer">
                                        Cerrar
                                    </button>
                                    <button type="button" disabled={procesando} onClick={confirmarDesbloqueo}
                                        className="flex items-center gap-2 rounded-full px-4 py-2 font-bold text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                                        <LockOpen size={16} />
                                        {procesando ? "Desbloqueando..." : "Desbloquear"}
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="flex items-center justify-center bg-red-100 rounded-full w-10 h-10 shrink-0">
                                        <Lock className="text-red-600" size={18} />
                                    </div>
                                    <p className="text-gray-700 font-semibold">Bloquear día</p>
                                </div>
                                <p className="text-gray-500 mb-3">{diaElegido}</p>
                                <textarea value={motivo} onChange={(e) => setMotivo(e.target.value)}
                                    placeholder="Motivo (opcional): día libre, pedido externo, etc."
                                    className="w-full border-2 rounded-xl bg-cyan-50 border-cyan-700 p-3 text-sm mb-5 resize-none h-24" />
                                <div className="flex justify-between gap-6">
                                    <button type="button" onClick={cerrarDialogo}
                                        className="rounded-full px-4 py-2 font-semibold text-gray-500 hover:bg-gray-100 cursor-pointer">
                                        Cerrar
                                    </button>
                                    <button type="button" disabled={procesando} onClick={confirmarBloqueo}
                                        className="flex items-center gap-2 rounded-full px-4 py-2 font-bold text-white bg-red-700 hover:bg-red-800 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                                        <Lock size={16} />
                                        {procesando ? "Bloqueando..." : "Bloquear"}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                )}
            </dialog>

            <dialog ref={detalleDialogRef} onClose={() => setPedidoDetalle(null)}
                className="m-auto rounded-2xl p-0 backdrop:bg-black/40 open:animate-in open:fade-in open:duration-200">
                {pedidoDetalle && (
                    <div className="w-96 max-w-[calc(100vw-1.5rem)] p-4 sm:p-6 max-h-[85vh] overflow-y-auto">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <p className="text-gray-700 font-semibold">Pedido #{pedidoDetalle.idpedido}</p>
                                <p className="text-gray-400 text-xs">{pedidoDetalle.fecha_de_pedido}</p>
                                {pedidoDetalle.estado === "INICIADO" && (
                                    <span className="inline-block mt-1 text-gray-700 bg-gray-200 rounded-full px-2 py-0.5 text-xs font-semibold">Pendiente de pago</span>
                                )}
                                {pedidoDetalle.estado === "CUMPLIDO" && (
                                    <span className="inline-block mt-1 text-emerald-700 bg-emerald-100 rounded-full px-2 py-0.5 text-xs font-semibold">Pagado</span>
                                )}
                                {pedidoDetalle.estado === "CANCELADO" && (
                                    <span className="inline-block mt-1 text-red-700 bg-red-100 rounded-full px-2 py-0.5 text-xs font-semibold">Cancelado</span>
                                )}
                            </div>
                            <button type="button" onClick={cerrarDetallePedido}
                                className="flex items-center justify-center rounded-full w-7 h-7 text-gray-400 hover:bg-gray-100 cursor-pointer">
                                <X size={16} />
                            </button>
                        </div>

                        <div className="flex flex-col gap-1 mb-4 text-sm">
                            <p className="text-gray-700 font-semibold">{pedidoDetalle.clienteNombre || "Cliente sin nombre"}</p>
                            {pedidoDetalle.clienteEmail && (
                                <p className="text-gray-500">{pedidoDetalle.clienteEmail}</p>
                            )}
                            {pedidoDetalle.clienteTelefono && (
                                <p className="text-gray-500 flex items-center gap-1.5">
                                    <Phone size={13} className="text-gray-400 shrink-0" />
                                    {pedidoDetalle.clienteTelefono}
                                </p>
                            )}
                            <p className="text-gray-500">
                                {pedidoDetalle.direccionEnvio
                                    ? `Envío a ${pedidoDetalle.direccionEnvio}${pedidoDetalle.codigoPostalEnvio ? " (CP " + pedidoDetalle.codigoPostalEnvio + ")" : ""}`
                                    : "Retiro en el local"}
                            </p>
                        </div>

                        <div className="flex flex-col gap-3 mb-4">
                            {pedidoDetalle.items.map((item) => (
                                <div key={item.idItemPedido} className="bg-gray-50 rounded-xl p-3">
                                    {item.imagenUrl && (
                                        <div className="relative w-full h-40 rounded-lg overflow-hidden bg-gray-200 mb-2">
                                            <Image loader={clodinaryLoader} src={item.imagenUrl}
                                                className="object-cover" alt="" fill sizes="(max-width: 384px) 100vw, 350px" />
                                        </div>
                                    )}
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="min-w-0">
                                            <p className="text-gray-700 text-sm">{item.descripcion}</p>
                                            <p className="text-gray-400 text-xs">x{item.cantidad}</p>
                                        </div>
                                        <p className="text-gray-700 text-sm font-semibold shrink-0">
                                            ${(item.precioUnitario * item.cantidad).toLocaleString('es-AR')}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex items-center justify-between border-t border-gray-200 pt-3">
                            <p className="text-gray-700 font-semibold">Total</p>
                            <p className="text-gray-900 font-bold">${totalDePedido(pedidoDetalle).toLocaleString('es-AR')}</p>
                        </div>

                        {pedidoDetalle.estado === "CUMPLIDO" && <FacturaPedidoAdmin idPedido={pedidoDetalle.idpedido} />}
                        {pedidoDetalle.estado === "CANCELADO" && (pedidoDetalle.montoADevolver ?? 0) > 0 && (
                            <NotaCreditoPedidoAdmin idPedido={pedidoDetalle.idpedido} montoADevolver={pedidoDetalle.montoADevolver} />
                        )}

                        {pedidoDetalle.estado !== "CANCELADO" && (
                        <div className="mt-4">
                            {pedidoDetalle.estadoPreparacion === "COCINANDO" ? (
                                <button type="button" onClick={() => entregarPedido(pedidoDetalle)} disabled={entregando}
                                    className="w-full h-10 rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-semibold cursor-pointer">
                                    {entregando ? "Guardando..." : "Marcar como entregado"}
                                </button>
                            ) : (
                                <p className="text-gray-400 text-xs text-center">
                                    En diseño: se va a poder marcar como entregado cuando pase a cocción (48 hs antes de la entrega).
                                </p>
                            )}
                        </div>
                        )}
                    </div>
                )}
            </dialog>
        </div>
    )
}
