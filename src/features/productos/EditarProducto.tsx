"use client"
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Pencil, Search, X } from "lucide-react";
import { toast } from "react-toastify";
import { Producto } from "@/app/interfaces/producto.interface";
import { actualizarProducto, buscarProductosPorNombre, subirImagenProducto } from "@/features/productos/api";
import SelectorAlergenos from "@/features/productos/SelectorAlergenos";
import { Alergeno } from "@/features/productos/alergenos";

const clodinaryLoader = ({ src, width, quality }: { src: string; width: number; quality?: number }) => {
    return `https://res.cloudinary.com/dkdywvyce/image/upload/w_${width},q_${quality || 75}/${src}`;
}

const DEMORA_BUSQUEDA_MS = 300
const LIMITE_RESULTADOS = 20

const categorias = [
    { nombre: "Tortas" }, { nombre: "Cookies" }, { nombre: "Cupcakes" },
    { nombre: "Cakepops" }, { nombre: "Minidonas" }, { nombre: "Paletas" },
    { nombre: "Oreos Bañadas" }, { nombre: "Mesas Dulces" }, { nombre: "Catering Salado" },
    { nombre: "Desayunos" }
]
const subCategorias = [
    { nombre: "Ninguno" }, { nombre: "Infantiles" }, { nombre: "Casamientos" },
    { nombre: "Aniversarios" }, { nombre: "Cumpleaños" }, { nombre: "Baby Shower" },
    { nombre: "Graduaciones" }, { nombre: "Halloween" }, { nombre: "Navidad" },
    { nombre: "San Valentín" }, { nombre: "Deportes" }, { nombre: "Series/Anime" },
    { nombre: "Videojuegos" }, { nombre: "Despedida de Soltero" }, { nombre: "Comunion" },
    { nombre: "Confirmacion" }, { nombre: "Bautismo" }, { nombre: "Profesiones" },
    { nombre: "Fiesta De 15 Años" }, { nombre: "Día de la Madre" }, { nombre: "Día del Padre" },
    { nombre: "Día de la Mujer" }, { nombre: "Día del Amigo" }, { nombre: "Día del Niño" },
    { nombre: "Eróticos" }, { nombre: "Adultos" }, { nombre: "Numeros/Chocotortas" },
    { nombre: "Golosineras" }
]

const normalizar = (s: string) => s.toUpperCase().replace(/[\s/]/g, "")

export default function EditarProducto() {

    const modalBuscarRef = useRef<HTMLDialogElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const demoraRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const tarjetaRef = useRef<HTMLDivElement>(null);

    const [resultados, setResultados] = useState<Producto[]>([])
    const [buscando, setBuscando] = useState(false)
    const [errorBusqueda, setErrorBusqueda] = useState("")

    const [seleccionado, setSeleccionado] = useState<Producto | null>(null)
    const [nombre, setNombre] = useState("")
    const [precio, setPrecio] = useState(0)
    const [descripcion, setDescripcion] = useState("")
    const [ingredientes, setIngredientes] = useState("")
    const [alergenos, setAlergenos] = useState<Alergeno[]>([])
    const [trazas, setTrazas] = useState<Alergeno[]>([])
    const [categoria, setCategoria] = useState("")
    const [subcategoria, setSubcategoria] = useState("")
    const [file, setFile] = useState<File | null>(null)
    const [filedos, setFiledos] = useState<File | null>(null)
    const [filetres, setFiletres] = useState<File | null>(null)
    const [filecuatro, setFilecuatro] = useState<File | null>(null)
    const [guardando, setGuardando] = useState(false)

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
        setNombre(producto.nombre.toString())
        setPrecio(producto.precio)
        setDescripcion(producto.descripcion.toString())
        setIngredientes(producto.ingredientes ? producto.ingredientes.toString() : "")
        setAlergenos(producto.alergenos ?? [])
        setTrazas(producto.trazas ?? [])
        setCategoria(producto.categoria.toString())
        setSubcategoria(producto.subcategoria.toString())
        setFile(null)
        setFiledos(null)
        setFiletres(null)
        setFilecuatro(null)
        cerrarBuscador()
    }

    const cancelarEdicion = () => setSeleccionado(null)

    async function guardar(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        if (!seleccionado) return

        if (nombre.trim() === "" || precio <= 0 || descripcion.trim() === "") {
            toast.warning("Completá nombre, precio y descripción")
            return
        }

        setGuardando(true)
        try {
            const [url_image, url_image2, url_image3, url_image4] = await Promise.all([
                file ? subirImagenProducto(file) : Promise.resolve(seleccionado.url_image),
                filedos ? subirImagenProducto(filedos) : Promise.resolve(seleccionado.url_image2),
                filetres ? subirImagenProducto(filetres) : Promise.resolve(seleccionado.url_image3),
                filecuatro ? subirImagenProducto(filecuatro) : Promise.resolve(seleccionado.url_image4),
            ])

            const actualizado = await actualizarProducto(seleccionado.idProducto, {
                nombre,
                precio,
                descripcion: descripcion,
                categoria,
                subcategoria,
                url_image,
                url_image2,
                url_image3,
                url_image4,
                ingredientes,
                alergenos,
                trazas,
            })

            toast.success("Producto actualizado correctamente")
            setSeleccionado(actualizado)
            setFile(null)
            setFiledos(null)
            setFiletres(null)
            setFilecuatro(null)
        } catch (error) {
            console.error("Error al actualizar el producto:", error);
            if (error instanceof Error && error.message === "NOMBRE_DUPLICADO") {
                toast.warning("Ya existe otro producto con ese nombre")
            } else {
                toast.warning("No se pudo actualizar el producto")
            }
        } finally {
            setGuardando(false)
        }
    }

    const elegirArchivo = (setter: (f: File | null) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setter(e.target.files?.[0] ?? null)
    }

    return (
        <>
            <div ref={tarjetaRef} className="w-full scroll-mt-4 bg-white rounded-2xl shadow-md px-4 sm:px-8 py-5 sm:py-6">
                {!seleccionado ? (
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center justify-center bg-blue-100 rounded-full w-14 h-14 shrink-0">
                                <Pencil className="text-blue-600" size={24} />
                            </div>
                            <div>
                                <p className="text-gray-700 text-xl font-semibold">Editar producto</p>
                                <p className="text-gray-500">Buscá un producto existente para editarlo.</p>
                            </div>
                        </div>
                        <button onClick={abrirBuscador} type="button"
                            className="flex justify-center items-center gap-2 bg-blue-300 hover:bg-blue-400 rounded-full h-10 px-6 font-bold text-white shadow-cyan-500/50 transition-all duration-500 cursor-pointer shrink-0">
                            <Search size={18} />
                            Buscar producto
                        </button>
                    </div>
                ) : (
                    <form onSubmit={guardar} className="flex flex-col gap-5">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <p className="text-gray-700 text-xl font-semibold truncate min-w-0">Editando: {seleccionado.nombre}</p>
                            <div className="flex gap-3 shrink-0">
                                <button type="button" onClick={abrirBuscador}
                                    className="bg-amber-300 hover:bg-amber-400 px-4 h-9 rounded-xl cursor-pointer font-bold text-white transition-colors">
                                    Cambiar producto
                                </button>
                                <button type="button" onClick={cancelarEdicion}
                                    className="flex items-center justify-center bg-red-500 hover:bg-red-600 text-white w-9 h-9 rounded-full cursor-pointer transition-colors">
                                    <X size={18} />
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-bold text-gray-600">Nombre</label>
                                <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)}
                                    className="border-2 rounded-xl bg-cyan-50 border-cyan-700 h-10 px-4" />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-bold text-gray-600">Precio</label>
                                <input type="number" value={precio} onChange={(e) => setPrecio(Number(e.target.value))}
                                    className="border-2 rounded-xl bg-cyan-50 border-cyan-700 h-10 px-4" />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-bold text-gray-600">Categoría</label>
                                <select value={categoria} onChange={(e) => setCategoria(e.target.value)}
                                    className="border-2 rounded-xl bg-cyan-50 border-cyan-700 h-10 px-4">
                                    {categorias.map((c) => (
                                        <option key={c.nombre} value={normalizar(c.nombre)}>{c.nombre}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-bold text-gray-600">Subcategoría</label>
                                <select value={subcategoria} onChange={(e) => setSubcategoria(e.target.value)}
                                    className="border-2 rounded-xl bg-cyan-50 border-cyan-700 h-10 px-4">
                                    {subCategorias.map((s) => (
                                        <option key={s.nombre} value={normalizar(s.nombre)}>{s.nombre}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-bold text-gray-600">Descripción</label>
                            <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)}
                                rows={3}
                                className="border-2 rounded-xl bg-cyan-50 border-cyan-700 p-3" />
                        </div>

                        <div className="flex flex-col gap-3 rounded-xl border border-gray-200 p-4">
                            <p className="text-sm font-bold text-gray-600">Ingredientes y alérgenos</p>
                            <textarea value={ingredientes} onChange={(e) => setIngredientes(e.target.value)}
                                rows={2} placeholder="Ej: harina de trigo, huevo, manteca, azúcar, dulce de leche"
                                className="border-2 rounded-xl bg-cyan-50 border-cyan-700 p-3" />
                            <SelectorAlergenos titulo="Contiene" seleccionados={alergenos} onChange={setAlergenos} />
                            <SelectorAlergenos titulo="Puede contener trazas de" seleccionados={trazas} onChange={setTrazas} variante="trazas" />
                        </div>

                        <div className="grid grid-cols-4 gap-4">
                            {[
                                { file: file, set: setFile, actual: seleccionado.url_image, etiqueta: "Imagen 1" },
                                { file: filedos, set: setFiledos, actual: seleccionado.url_image2, etiqueta: "Imagen 2" },
                                { file: filetres, set: setFiletres, actual: seleccionado.url_image3, etiqueta: "Imagen 3" },
                                { file: filecuatro, set: setFilecuatro, actual: seleccionado.url_image4, etiqueta: "Imagen 4" },
                            ].map((espacio, i) => (
                                <div key={i} className="flex flex-col gap-2 items-center">
                                    <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-gray-100 border-2 border-cyan-700">
                                        {espacio.actual ? (
                                            <Image loader={clodinaryLoader} src={`${espacio.actual}`} className="object-cover" alt="" fill sizes="120px" />
                                        ) : null}
                                    </div>
                                    <label className="text-xs text-center text-gray-500 truncate w-full cursor-pointer hover:text-cyan-700">
                                        {espacio.file ? espacio.file.name : `Cambiar ${espacio.etiqueta.toLowerCase()}`}
                                        <input type="file" accept="image/*" className="hidden" onChange={elegirArchivo(espacio.set)} />
                                    </label>
                                </div>
                            ))}
                        </div>

                        <button type="submit" disabled={guardando}
                            className="self-end flex justify-center items-center bg-green-400 hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-full h-10 px-8 font-bold text-white shadow-cyan-500/50 transition-all duration-500 cursor-pointer">
                            {guardando ? "Guardando..." : "Guardar cambios"}
                        </button>
                    </form>
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
                <div className="flex items-center justify-between shrink-0 h-15 bg-blue-200 px-4 sm:px-6">
                    <h2 className="font-bold text-gray-600 text-xl">Buscar producto a editar</h2>
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
                                        <span className="flex-1 truncate">{producto.nombre}</span>
                                        <button type="button" onClick={() => elegirProducto(producto)}
                                            className="bg-blue-500 hover:bg-blue-400 px-4 h-9 rounded-xl cursor-pointer shrink-0">
                                            <span className="text-cyan-50 font-bold">editar</span>
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
