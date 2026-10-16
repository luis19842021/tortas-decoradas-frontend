"use client"
import { Paquete, Producto } from "@/app/interfaces/producto.interface";
import { useEffect, useRef, useState } from "react";
import { buscarCategoriaSinEspecial, cambiaDosCategoriaEspecial, cambiarCategoriaEspecial } from "@/features/productos/api";
import { X } from "lucide-react";
import Image from "next/image";
import ModalInferior from "./ModalInferior";

const clodinaryLoader = ({ src, width, quality }: { src: string; width: number; quality?: number }) => {
    return `https://res.cloudinary.com/dkdywvyce/image/upload/w_${width},q_${quality || 75}/${src}`;
}

const DEMORA_BUSQUEDA_MS = 300

const LIMITE_RESULTADOS = 20

const MARCAS_SECCION: Record<string, { iniciales: string; nombre: string; clase: string }> = {
    ULTIMO: { iniciales: "UT", nombre: "Ultimas Tortas", clase: "bg-amber-500" },
    TENDENCIA: { iniciales: "TE", nombre: "Ultimas Tendencias", clase: "bg-violet-500" },
    DESTACADO: { iniciales: "TD", nombre: "Tortas Destacadas del Mes", clase: "bg-pink-500" },
}

export default function ModalProductos(recibido: Paquete) {

    const [resultados, setResultados] = useState<Producto[]>([])
    const [buscando, setBuscando] = useState(false)
    const [error, setError] = useState("")
    const modalRef = useRef<HTMLDialogElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const demoraRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const buscar = async (nombre: string) => {
        setBuscando(true)
        setError("")
        try {
            const productos = await buscarCategoriaSinEspecial(recibido.tipo, nombre)
            setResultados(productos)
        } catch (error) {
            console.error("Error al buscar productos:", error);
            setError("No se pudo buscar. Probá de nuevo.")
        } finally {
            setBuscando(false)
        }
    }

    useEffect(() => {
        return () => {
            if (demoraRef.current) clearTimeout(demoraRef.current)
        }
    }, [])

    async function cambio(pViejo: Producto, pNuevo: Producto) {
        setError("")
        try {
            if (pViejo.idProducto === 0) {
                await cambiarCategoriaEspecial(recibido.tipo, pNuevo.idProducto)
            } else {
                await cambiaDosCategoriaEspecial("NINGUNO", pViejo.idProducto, recibido.tipo, pNuevo.idProducto)
            }
            recibido.funcionDOS()
            modalRef.current?.close()
        } catch (error) {
            console.error("Error al asignar el producto:", error);
            setError("No se pudo asignar el producto. Probá de nuevo.")
        }
    }

    const busquedaDeProducto = (e: React.ChangeEvent<HTMLInputElement>) => {
        const term = e.target.value.trim()
        if (demoraRef.current) clearTimeout(demoraRef.current)
        demoraRef.current = setTimeout(() => buscar(term), DEMORA_BUSQUEDA_MS)
    }

    const cerrar = () => {
        modalRef.current?.close()
    }

    const abrir = () => {
        if (inputRef.current) inputRef.current.value = ""
        setError("")
        buscar("")
        modalRef.current?.showModal()
        setTimeout(() => inputRef.current?.focus(), 50)
    }

    const espacioOcupado = recibido.producto.idProducto !== 0

    return (
        <div>
            <button onClick={abrir} className="flex justify-center items-center bg-amber-300 hover:bg-amber-400 w-24 sm:w-32 shrink-0 rounded-full h-9 text-white font-bold shadow-cyan-500/50 transition-all duration-500 cursor-pointer">
                {espacioOcupado ? "Cambiar" : "Seleccionar"}
            </button>
            <dialog
                className="
                                  relative
                                  w-150 max-w-[calc(100vw-1.5rem)]
                                  max-h-[85vh]
                                  m-auto rounded-2xl scale-y-0 opacity-0
                                  overflow-hidden
                                  transition-all transition-discrete
                                  duration-300
                                  backdrop:bg-gray-800/0
                                  open:flex open:flex-col
                                  open:scale-y-100 open:opacity-100
                                  open:backdrop:bg-gray-800/50
                                  open:backdrop:backdrop-blur-xs
                                  open:backdrop:transition-all
                                  open:backdrop:transition-discrete
                                  open:backdrop:duration-300
                                  starting:open:scale-y-0 starting:open:opacity-0 starting:open:backdrop:bg-gray-800/0
                       "
                ref={modalRef}>

                <div className="flex items-center justify-between shrink-0 h-15 bg-blue-200 px-4 sm:px-6">
                    <h2 className="font-bold text-gray-600 text-xl">
                        {espacioOcupado ? "Cambiar producto" : "Elegir producto"}
                    </h2>
                    <button onClick={cerrar} type="button"
                        className="flex items-center justify-center bg-red-500 hover:bg-red-600 text-white w-9 h-9 rounded-full cursor-pointer shrink-0 transition-colors">
                        <X size={18} />
                    </button>
                </div>

                <div className="flex flex-col gap-3 p-4 sm:p-6 overflow-hidden">
                    <input type="text" ref={inputRef} onChange={(e) => (busquedaDeProducto(e))}
                        placeholder="Buscar por nombre..."
                        className="w-full border-2 rounded-xl bg-cyan-50 border-cyan-700 h-10 px-4 shrink-0" />

                    {error && (
                        <p className="text-red-600 text-sm shrink-0">{error}</p>
                    )}

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-600 shrink-0">
                        <span>Ya elegidos:</span>
                        {Object.values(MARCAS_SECCION).map((marca) => (
                            <span key={marca.iniciales} className="flex items-center gap-1">
                                <span className={`flex items-center justify-center w-5 h-5 rounded-full text-[9px] font-bold text-white ${marca.clase}`}>
                                    {marca.iniciales}
                                </span>
                                {marca.nombre}
                            </span>
                        ))}
                    </div>

                    <div className="border-cyan-700 border-2 rounded-xl bg-gray-100 min-h-[220px] max-h-[55vh] overflow-y-auto p-3">
                        {buscando ? (
                            <p className="text-center text-gray-500 py-10">Buscando...</p>
                        ) : resultados.length === 0 ? (
                            <p className="text-center text-gray-500 py-10">No hay productos disponibles</p>
                        ) : (
                            <ul className="flex flex-col gap-2">
                                {resultados.map((producto) => (
                                    <li key={producto.idProducto} className="flex items-center flex-wrap sm:flex-nowrap bg-white hover:bg-gray-50 rounded-xl px-3 py-2 gap-3 shadow-sm transition-colors">
                                        <div className="relative shrink-0 w-12 h-12">
                                            <div className="relative w-full h-full rounded-lg overflow-hidden bg-gray-200">
                                                <Image
                                                    loader={clodinaryLoader}
                                                    src={`${producto.url_image}`}
                                                    className="object-cover"
                                                    alt=""
                                                    fill
                                                    sizes="48px" />
                                            </div>
                                            <div className="absolute -top-2 -right-2 flex">
                                                {(recibido.asignaciones?.[producto.idProducto] ?? []).map((tipo, i) => {
                                                    const marca = MARCAS_SECCION[tipo]
                                                    if (!marca) return null
                                                    return (
                                                        <span
                                                            key={tipo}
                                                            title={`Ya está en: ${marca.nombre}`}
                                                            className={`flex items-center justify-center w-6 h-6 rounded-full text-[10px] font-bold text-white border-2 border-white shadow ${marca.clase} ${i > 0 ? "-ml-2" : ""}`}
                                                        >
                                                            {marca.iniciales}
                                                        </span>
                                                    )
                                                })}
                                            </div>
                                        </div>

                                        <span className="flex-1 min-w-0 truncate">{producto.nombre}</span>

                                        <div className="flex items-center justify-end gap-2 w-full sm:w-auto">
                                            <ModalInferior {...producto} />

                                            <button type="button" onClick={() => cambio(recibido.producto, producto)}
                                                className="bg-green-500 hover:bg-green-400 px-4 h-9 rounded-xl cursor-pointer shrink-0">
                                                <span className="text-cyan-50 font-bold">seleccionar</span>
                                            </button>
                                        </div>
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
        </div>
    )
}
