"use client"
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Search, Trash2, X, Ban, RotateCcw } from "lucide-react";
import { toast } from "react-toastify";
import { Producto } from "@/app/interfaces/producto.interface";
import { buscarProductosPorNombre, cambiarEstadoProducto, eliminarProducto } from "@/features/productos/api";

const clodinaryLoader = ({ src, width, quality }: { src: string; width: number; quality?: number }) => {
    return `https://res.cloudinary.com/dkdywvyce/image/upload/w_${width},q_${quality || 75}/${src}`;
}

const DEMORA_BUSQUEDA_MS = 300
const LIMITE_RESULTADOS = 20

export default function EliminarProducto() {

    const modalBuscarRef = useRef<HTMLDialogElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const demoraRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const tarjetaRef = useRef<HTMLDivElement>(null);

    const [resultados, setResultados] = useState<Producto[]>([])
    const [buscando, setBuscando] = useState(false)
    const [errorBusqueda, setErrorBusqueda] = useState("")

    const [seleccionado, setSeleccionado] = useState<Producto | null>(null)
    const [eliminando, setEliminando] = useState(false)
    const [suspendiendo, setSuspendiendo] = useState(false)

    useEffect(() => {
        return () => { if (demoraRef.current) clearTimeout(demoraRef.current) }
    }, [])

    const idSeleccionado = seleccionado?.idProducto
    useEffect(() => {
        if (idSeleccionado === undefined) return
        const t = setTimeout(() => {
            tarjetaRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
        }, 120)
        return () => clearTimeout(t)
    }, [idSeleccionado])

    const buscar = async (nombreBuscado: string) => {
        setBuscando(true)
        setErrorBusqueda("")
        try {
            const productos = await buscarProductosPorNombre(nombreBuscado)
            setResultados(productos)
        } catch (error) {
            console.error("Error al buscar productos:", error);
            setErrorBusqueda("No se pudo buscar. Probá de nuevo.")
        } finally {
            setBuscando(false)
        }
    }

    const busquedaDeProducto = (e: React.ChangeEvent<HTMLInputElement>) => {
        const term = e.target.value.trim()
        if (demoraRef.current) clearTimeout(demoraRef.current)
        demoraRef.current = setTimeout(() => buscar(term), DEMORA_BUSQUEDA_MS)
    }

    const abrirBuscador = () => {
        if (inputRef.current) inputRef.current.value = ""
        setErrorBusqueda("")
        buscar("")
        modalBuscarRef.current?.showModal()
        setTimeout(() => inputRef.current?.focus(), 50)
    }

    const cerrarBuscador = () => {
        const scrollY = window.scrollY
        modalBuscarRef.current?.close()
        requestAnimationFrame(() => window.scrollTo(0, scrollY))
    }

    const elegirProducto = (producto: Producto) => {
        setSeleccionado(producto)
        cerrarBuscador()
    }

    const cancelarSeleccion = () => setSeleccionado(null)

    async function eliminar() {
        if (!seleccionado) return
        setEliminando(true)
        try {
            await eliminarProducto(seleccionado.idProducto)
            toast.success("Producto eliminado correctamente")
            setSeleccionado(null)
        } catch (error) {
            console.error("Error al eliminar el producto:", error);
            if (error instanceof Error && error.message === "CONFLICTO") {
                toast.warning("No se puede eliminar: el producto tiene pedidos asociados. Podés suspenderlo para sacarlo de la tienda mientras tanto.")
            } else {
                toast.warning("No se pudo eliminar el producto")
            }
        } finally {
            setEliminando(false)
        }
    }

    async function alternarSuspension() {
        if (!seleccionado) return
        const nuevoEstado = !seleccionado.suspendido
        setSuspendiendo(true)
        try {
            const actualizado = await cambiarEstadoProducto(seleccionado.idProducto, nuevoEstado)
            setSeleccionado(actualizado)
            toast.success(nuevoEstado
                ? "Producto suspendido: ya no se muestra en la tienda."
                : "Producto reactivado: vuelve a mostrarse en la tienda.")
        } catch (error) {
            console.error("Error al cambiar el estado del producto:", error);
            toast.warning("No se pudo cambiar el estado del producto")
        } finally {
            setSuspendiendo(false)
        }
    }

    return (
        <>
            <div ref={tarjetaRef} className="w-full scroll-mt-4 bg-white rounded-2xl shadow-md px-4 sm:px-8 py-5 sm:py-6">
                {!seleccionado ? (
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center justify-center bg-red-100 rounded-full w-14 h-14 shrink-0">
                                <Trash2 className="text-red-600" size={24} />
                            </div>
                            <div>
                                <p className="text-gray-700 text-xl font-semibold">Eliminar producto</p>
                                <p className="text-gray-500">Buscá un producto existente para eliminarlo del catálogo.</p>
                            </div>
                        </div>
                        <button onClick={abrirBuscador} type="button"
                            className="flex justify-center items-center gap-2 bg-red-300 hover:bg-red-400 rounded-full h-10 px-6 font-bold text-white shadow-cyan-500/50 transition-all duration-500 cursor-pointer shrink-0">
                            <Search size={18} />
                            Buscar producto
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col gap-5">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <p className="flex items-center gap-2 text-gray-700 text-xl font-semibold truncate min-w-0">
                                Eliminar: {seleccionado.nombre}
                                {seleccionado.suspendido && (
                                    <span className="text-xs font-bold text-rose-700 bg-rose-100 rounded-full px-2 py-0.5 shrink-0">SUSPENDIDO</span>
                                )}
                            </p>
                            <div className="flex gap-3 shrink-0">
                                <button type="button" onClick={abrirBuscador}
                                    className="bg-amber-300 hover:bg-amber-400 px-4 h-9 rounded-xl cursor-pointer font-bold text-white transition-colors">
                                    Cambiar producto
                                </button>
                                <button type="button" onClick={cancelarSeleccion}
                                    className="flex items-center justify-center bg-gray-400 hover:bg-gray-500 text-white w-9 h-9 rounded-full cursor-pointer transition-colors">
                                    <X size={18} />
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="relative shrink-0 w-20 h-20 rounded-xl overflow-hidden bg-gray-100 border-2 border-red-300">
                                <Image loader={clodinaryLoader} src={`${seleccionado.url_image}`} className="object-cover" alt="" fill sizes="80px" />
                            </div>
                            <p className="text-gray-600">
                                Esta acción no se puede deshacer. Si el producto tiene pedidos asociados, no va a poder eliminarse: en ese caso podés suspenderlo para sacarlo de la tienda mientras tanto.
                            </p>
                        </div>

                        <div className="self-end flex flex-wrap justify-end gap-3">
                            <button type="button" onClick={alternarSuspension} disabled={suspendiendo || eliminando}
                                className={`flex items-center gap-2 justify-center disabled:opacity-50 disabled:cursor-not-allowed rounded-full min-h-10 py-2 px-5 sm:px-6 font-bold text-white shadow-cyan-500/50 transition-all duration-500 cursor-pointer ${
                                    seleccionado.suspendido ? "bg-emerald-400 hover:bg-emerald-500" : "bg-amber-400 hover:bg-amber-500"
                                }`}>
                                {seleccionado.suspendido ? <RotateCcw size={16} /> : <Ban size={16} />}
                                {suspendiendo ? "Guardando..." : seleccionado.suspendido ? "Reactivar producto" : "Suspender producto"}
                            </button>
                            <button type="button" onClick={eliminar} disabled={eliminando || suspendiendo}
                                className="flex justify-center items-center bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-full min-h-10 py-2 px-5 sm:px-8 font-bold text-white shadow-cyan-500/50 transition-all duration-500 cursor-pointer">
                                {eliminando ? "Eliminando..." : "Eliminar producto"}
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <dialog
                className="
                    relative w-150 max-w-[calc(100vw-1.5rem)] max-h-[85vh]
                    m-auto rounded-2xl scale-y-0 opacity-0
                    overflow-hidden
                    transition-all transition-discrete duration-300
                    backdrop:bg-gray-800/0
                    open:flex open:flex-col
                    open:scale-y-100 open:opacity-100
                    open:backdrop:bg-gray-800/50
                    open:backdrop:backdrop-blur-xs
                    open:backdrop:transition-all open:backdrop:transition-discrete open:backdrop:duration-300
                    starting:open:scale-y-0 starting:open:opacity-0 starting:open:backdrop:bg-gray-800/0
                "
                ref={modalBuscarRef}>
                <div className="flex items-center justify-between shrink-0 h-15 bg-red-200 px-6">
                    <h2 className="font-bold text-gray-600 text-xl">Buscar producto a eliminar</h2>
                    <button onClick={cerrarBuscador} type="button"
                        className="flex items-center justify-center bg-red-500 hover:bg-red-600 text-white w-9 h-9 rounded-full cursor-pointer shrink-0 transition-colors">
                        <X size={18} />
                    </button>
                </div>

                <div className="flex flex-col gap-3 p-4 sm:p-6 overflow-hidden">
                    <input type="text" ref={inputRef} onChange={(e) => busquedaDeProducto(e)}
                        placeholder="Buscar por nombre..."
                        className="w-full border-2 rounded-xl bg-cyan-50 border-cyan-700 h-10 px-4 shrink-0" />

                    {errorBusqueda && (
                        <p className="text-red-600 text-sm shrink-0">{errorBusqueda}</p>
                    )}

                    <div className="border-cyan-700 border-2 rounded-xl bg-gray-100 min-h-[220px] max-h-[55vh] overflow-y-auto p-3">
                        {buscando ? (
                            <p className="text-center text-gray-500 py-10">Buscando...</p>
                        ) : resultados.length === 0 ? (
                            <p className="text-center text-gray-500 py-10">No hay productos disponibles</p>
                        ) : (
                            <ul className="flex flex-col gap-2">
                                {resultados.map((producto) => (
                                    <li key={producto.idProducto} className="flex items-center bg-white hover:bg-gray-50 rounded-xl px-3 py-2 gap-3 shadow-sm transition-colors">
                                        <div className="relative shrink-0 w-12 h-12 rounded-lg overflow-hidden bg-gray-200">
                                            <Image loader={clodinaryLoader} src={`${producto.url_image}`} className="object-cover" alt="" fill sizes="48px" />
                                        </div>
                                        <span className="flex-1 truncate flex items-center gap-2">
                                            {producto.nombre}
                                            {producto.suspendido && (
                                                <span className="text-xs font-bold text-rose-700 bg-rose-100 rounded-full px-2 py-0.5 shrink-0">SUSPENDIDO</span>
                                            )}
                                        </span>
                                        <button type="button" onClick={() => elegirProducto(producto)}
                                            className="bg-red-500 hover:bg-red-400 px-4 h-9 rounded-xl cursor-pointer shrink-0">
                                            <span className="text-cyan-50 font-bold">eliminar</span>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {resultados.length === LIMITE_RESULTADOS && (
                        <p className="text-xs text-gray-500 text-center shrink-0">
                            Mostrando los primeros {LIMITE_RESULTADOS} resultados. Escribí más letras para afinar la búsqueda.
                        </p>
                    )}
                </div>
            </dialog>
        </>
    )
}
