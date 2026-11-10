"use client"
import { useState } from "react";
import { Candy, Plus, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import { CategoriaSabor, Sabor } from "@/app/interfaces/producto.interface";
import { eliminarSabor, guardarCategoriaSabor, guardarSabor } from "@/features/productos/api";
import SelectorAlergenos from "@/features/productos/SelectorAlergenos";
import { ALERGENOS, Alergeno } from "@/features/productos/alergenos";

interface Props {
    saboresIniciales: Sabor[]
    categoriasIniciales: CategoriaSabor[]
}

export default function EditarSabores({ saboresIniciales, categoriasIniciales }: Props) {

    const [sabores, setSabores] = useState<Sabor[]>(saboresIniciales)
    const [categorias, setCategorias] = useState<CategoriaSabor[]>(categoriasIniciales)
    const [preciosCategoria, setPreciosCategoria] = useState<Record<number, number>>(
        Object.fromEntries(categoriasIniciales.map((c) => [c.idCategoriaSabor, c.precio]))
    )
    const [guardandoCategoriaId, setGuardandoCategoriaId] = useState<number | null>(null)

    const [nombreNuevo, setNombreNuevo] = useState("")
    const [categoriaNueva, setCategoriaNueva] = useState<number | "">(categoriasIniciales[0]?.idCategoriaSabor ?? "")
    const [agregando, setAgregando] = useState(false)
    const [alergenosNuevo, setAlergenosNuevo] = useState<Alergeno[]>(["LECHE"])

    const [saborEditando, setSaborEditando] = useState<Sabor | null>(null)
    const [alergenosEditando, setAlergenosEditando] = useState<Alergeno[]>([])
    const [categoriaEditando, setCategoriaEditando] = useState<number>(0)
    const [nombreEditando, setNombreEditando] = useState("")
    const [guardandoAlergenos, setGuardandoAlergenos] = useState(false)

    function abrirEdicion(sabor: Sabor) {
        setSaborEditando(sabor)
        setAlergenosEditando(sabor.alergenos ?? [])
        setCategoriaEditando(sabor.categoria.idCategoriaSabor)
        setNombreEditando(String(sabor.sabor))
    }

    async function guardarAlergenosSabor() {
        if (!saborEditando) return
        const nombre = nombreEditando.trim()
        if (!nombre) {
            toast.warning("El sabor necesita un nombre")
            return
        }
        if (nombre.toLowerCase() === "ninguno") {
            toast.warning("Ese nombre está reservado")
            return
        }
        if (sabores.some((s) => s.idLista_sabor !== saborEditando.idLista_sabor && String(s.sabor).trim().toLowerCase() === nombre.toLowerCase())) {
            toast.warning(`Ya existe un sabor llamado "${nombre}"`)
            return
        }
        setGuardandoAlergenos(true)
        try {
            const actualizado = await guardarSabor({
                idLista_sabor: saborEditando.idLista_sabor,
                sabor: nombre,
                idCategoriaSabor: categoriaEditando,
                alergenos: alergenosEditando,
            })
            setSabores((prev) => prev.map((s) => s.idLista_sabor === actualizado.idLista_sabor ? actualizado : s))
            toast.success(`"${actualizado.sabor}" guardado`)
            setSaborEditando(null)
        } catch (error) {
            console.error("Error al guardar los alérgenos del sabor:", error)
            toast.warning("No se pudieron guardar los alérgenos")
        } finally {
            setGuardandoAlergenos(false)
        }
    }

    const [eliminandoSabor, setEliminandoSabor] = useState(false)

    async function borrarSabor() {
        if (!saborEditando) return
        if (!window.confirm(`¿Eliminar el sabor "${saborEditando.sabor}"? Esta acción no se puede deshacer.`)) return
        setEliminandoSabor(true)
        try {
            await eliminarSabor(saborEditando.idLista_sabor)
            setSabores((prev) => prev.filter((s) => s.idLista_sabor !== saborEditando.idLista_sabor))
            toast.success(`"${saborEditando.sabor}" eliminado`)
            setSaborEditando(null)
        } catch (error) {
            console.error("Error al eliminar el sabor:", error)
            toast.warning(error instanceof Error ? error.message : "No se pudo eliminar el sabor")
        } finally {
            setEliminandoSabor(false)
        }
    }

    const resumenAlergenos = (sabor: Sabor) => {
        const lista = sabor.alergenos ?? []
        if (lista.length === 0) return "sin alérgenos cargados"
        return ALERGENOS.filter((a) => lista.includes(a.valor)).map((a) => a.corta).join(", ")
    }

    async function guardarPrecioCategoria(categoria: CategoriaSabor) {
        const nuevoPrecio = preciosCategoria[categoria.idCategoriaSabor]
        if (nuevoPrecio == null || nuevoPrecio < 0) {
            toast.warning("El precio no puede ser negativo")
            return
        }

        setGuardandoCategoriaId(categoria.idCategoriaSabor)
        try {
            const actualizada = await guardarCategoriaSabor({
                idCategoriaSabor: categoria.idCategoriaSabor,
                nombre: categoria.nombre,
                precio: nuevoPrecio,
            })
            setCategorias((prev) => prev.map((c) => c.idCategoriaSabor === actualizada.idCategoriaSabor ? actualizada : c))
            setSabores((prev) => prev.map((s) => s.categoria.idCategoriaSabor === actualizada.idCategoriaSabor
                ? { ...s, categoria: actualizada }
                : s))
            toast.success(`Precio de "${categoria.nombre}" actualizado`)
        } catch (error) {
            console.error("Error al actualizar el precio de la categoría:", error)
            toast.warning("No se pudo actualizar el precio")
        } finally {
            setGuardandoCategoriaId(null)
        }
    }

    async function agregarSabor(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()

        const nombre = nombreNuevo.trim()
        if (!nombre) {
            toast.warning("Ponele un nombre al sabor")
            return
        }
        if (categoriaNueva === "") {
            toast.warning("Elegí una categoría para el sabor")
            return
        }

        setAgregando(true)
        try {
            const creado = await guardarSabor({ sabor: nombre, idCategoriaSabor: categoriaNueva, alergenos: alergenosNuevo })
            setSabores((prev) => [...prev, creado])
            setNombreNuevo("")
            toast.success(`"${creado.sabor}" agregado`)
        } catch (error) {
            console.error("Error al agregar el sabor:", error)
            toast.warning("No se pudo agregar el sabor")
        } finally {
            setAgregando(false)
        }
    }

    return (
        <div className="w-full bg-white rounded-2xl shadow-md px-4 sm:px-8 py-5 sm:py-6">
            <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center justify-center bg-pink-100 rounded-full w-14 h-14 shrink-0">
                    <Candy className="text-pink-600" size={24} />
                </div>
                <div>
                    <p className="text-gray-700 text-xl font-semibold">Sabores / Rellenos</p>
                    <p className="text-gray-500">Los sabores se agrupan en 3 categorías con un precio cada una. Agregá sabores nuevos eligiendo su categoría, o subí el precio de una categoría entera acá abajo. Tocá un sabor para cambiarle el nombre, la categoría, cargar sus alérgenos o eliminarlo (solo si ninguna torta lo usa).</p>
                </div>
            </div>

            <div className="flex flex-col gap-2 mb-6 pb-6 border-b border-gray-200">
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Precio por categoría</p>
                {categorias.map((categoria) => (
                    <div key={categoria.idCategoriaSabor}
                        className="flex items-center justify-between gap-x-4 gap-y-2 flex-wrap rounded-xl px-3 sm:px-4 py-2 bg-gray-50">
                        <span className="text-gray-700 font-medium w-full sm:w-auto">{categoria.nombre}</span>
                        <div className="flex items-center gap-2 sm:gap-3 ml-auto">
                            <input type="number" min={0} value={preciosCategoria[categoria.idCategoriaSabor] ?? categoria.precio}
                                onChange={(e) => setPreciosCategoria((prev) => ({ ...prev, [categoria.idCategoriaSabor]: Number(e.target.value) }))}
                                className="border-2 rounded-xl bg-cyan-50 border-cyan-700 h-10 w-24 sm:w-32 px-2 sm:px-4 text-center" />
                            <button type="button" disabled={guardandoCategoriaId === categoria.idCategoriaSabor}
                                onClick={() => guardarPrecioCategoria(categoria)}
                                className="flex justify-center items-center bg-amber-400 hover:bg-amber-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-full h-10 px-4 sm:px-6 font-bold text-white shadow-cyan-500/50 transition-all duration-500 cursor-pointer">
                                {guardandoCategoriaId === categoria.idCategoriaSabor ? "Guardando..." : "Guardar"}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <form onSubmit={agregarSabor} className="flex items-end gap-3 flex-wrap mb-6 pb-6 border-b border-gray-200">
                <div className="flex flex-col gap-1">
                    <label className="text-sm text-gray-500">Sabor nuevo</label>
                    <input type="text" value={nombreNuevo}
                        onChange={(e) => setNombreNuevo(e.target.value)}
                        placeholder="Ej: Dulce de leche"
                        className="border-2 rounded-xl bg-cyan-50 border-cyan-700 h-10 w-56 px-4" />
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-sm text-gray-500">Categoría</label>
                    <select value={categoriaNueva}
                        onChange={(e) => setCategoriaNueva(Number(e.target.value))}
                        className="border-2 rounded-xl bg-cyan-50 border-cyan-700 h-10 w-48 px-4">
                        {categorias.map((categoria) => (
                            <option key={categoria.idCategoriaSabor} value={categoria.idCategoriaSabor}>
                                {categoria.nombre}
                            </option>
                        ))}
                    </select>
                </div>
                <button type="submit" disabled={agregando}
                    className="flex justify-center items-center gap-2 bg-green-300 hover:bg-green-400 disabled:opacity-50 disabled:cursor-not-allowed rounded-full h-10 px-6 font-bold text-white shadow-cyan-500/50 transition-all duration-500 cursor-pointer shrink-0">
                    <Plus size={18} />
                    {agregando ? "Agregando..." : "Agregar sabor"}
                </button>
                <div className="w-full">
                    <SelectorAlergenos titulo="Alérgenos del sabor nuevo" seleccionados={alergenosNuevo} onChange={setAlergenosNuevo} />
                </div>
            </form>

            <div className="flex flex-col gap-4">
                {sabores.filter((s) => s.sabor != "Ninguno").length === 0 && (
                    <p className="text-gray-400">Todavía no hay sabores cargados.</p>
                )}
                {categorias.map((categoria) => {
                    const saboresDeCategoria = sabores.filter((s) => s.categoria?.idCategoriaSabor === categoria.idCategoriaSabor && s.sabor != "Ninguno")
                    if (saboresDeCategoria.length === 0) return null
                    return (
                        <div key={categoria.idCategoriaSabor}>
                            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">{categoria.nombre} <span className="text-gray-400 font-normal">({saboresDeCategoria.length})</span></p>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1.5">
                                {saboresDeCategoria.map((sabor) => (
                                    <button key={sabor.idLista_sabor} type="button" onClick={() => abrirEdicion(sabor)}
                                        className={`text-left rounded-lg px-3 py-1.5 text-sm cursor-pointer ${saborEditando?.idLista_sabor === sabor.idLista_sabor ? "bg-cyan-100 ring-2 ring-cyan-600" : "bg-gray-50 hover:bg-gray-100"}`}
                                        title={`${sabor.sabor}: ${resumenAlergenos(sabor)} (tocá para editar)`}>
                                        <span className="block text-gray-700 truncate">{sabor.sabor}</span>
                                        <span className={`block text-xs truncate ${(sabor.alergenos ?? []).length === 0 ? "text-amber-600" : "text-gray-400"}`}>{resumenAlergenos(sabor)}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )
                })}
            </div>

            {saborEditando && (
                <div className="mt-6 rounded-xl border-2 border-cyan-600 bg-cyan-50 px-4 py-4 flex flex-col gap-3">
                    <div className="flex flex-col gap-1">
                        <label className="text-sm text-gray-500">Nombre del sabor</label>
                        <input type="text" value={nombreEditando}
                            onChange={(e) => setNombreEditando(e.target.value)}
                            disabled={guardandoAlergenos}
                            className="border-2 rounded-xl bg-white border-cyan-700 h-10 w-full sm:w-64 px-4" />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-sm text-gray-500">Categoría</label>
                        <select value={categoriaEditando}
                            onChange={(e) => setCategoriaEditando(Number(e.target.value))}
                            disabled={guardandoAlergenos}
                            className="border-2 rounded-xl bg-white border-cyan-700 h-10 w-full sm:w-64 px-4">
                            {categorias.map((categoria) => (
                                <option key={categoria.idCategoriaSabor} value={categoria.idCategoriaSabor}>
                                    {categoria.nombre}
                                </option>
                            ))}
                        </select>
                        {categoriaEditando !== saborEditando.categoria.idCategoriaSabor && (
                            <p className="text-xs text-amber-600">Al cambiar de categoría, el sabor pasa a costar el precio de la nueva categoría en todas las tortas que lo usen.</p>
                        )}
                    </div>
                    <SelectorAlergenos seleccionados={alergenosEditando} onChange={setAlergenosEditando} deshabilitado={guardandoAlergenos} />
                    <div className="flex justify-end gap-2 flex-wrap">
                        <button type="button" onClick={borrarSabor} disabled={guardandoAlergenos || eliminandoSabor}
                            className="mr-auto flex items-center gap-2 rounded-full h-10 px-5 font-semibold text-red-600 bg-white border border-red-300 hover:bg-red-50 disabled:opacity-50 cursor-pointer">
                            <Trash2 size={16} />
                            {eliminandoSabor ? "Eliminando..." : "Eliminar sabor"}
                        </button>
                        <button type="button" onClick={() => setSaborEditando(null)} disabled={guardandoAlergenos}
                            className="rounded-full h-10 px-5 font-semibold text-gray-600 bg-white border hover:bg-gray-100 cursor-pointer">
                            Cancelar
                        </button>
                        <button type="button" onClick={guardarAlergenosSabor} disabled={guardandoAlergenos}
                            className="rounded-full h-10 px-6 font-bold text-white bg-amber-400 hover:bg-amber-500 disabled:opacity-50 cursor-pointer">
                            {guardandoAlergenos ? "Guardando..." : "Guardar"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
