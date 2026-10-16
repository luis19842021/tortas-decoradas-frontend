"use client"
import { useState } from "react";
import { CakeSlice, Plus } from "lucide-react";
import { toast } from "react-toastify";
import { Bizcochuelo } from "@/app/interfaces/producto.interface";
import { guardarBizcochuelo } from "@/features/productos/api";
import SelectorAlergenos from "@/features/productos/SelectorAlergenos";
import { Alergeno } from "@/features/productos/alergenos";

interface Props {
    bizcochuelosIniciales: Bizcochuelo[]
}

export default function EditarBizcochuelos({ bizcochuelosIniciales }: Props) {

    const [bizcochuelos, setBizcochuelos] = useState<Bizcochuelo[]>(bizcochuelosIniciales)
    const [precios, setPrecios] = useState<Record<number, number>>(
        Object.fromEntries(bizcochuelosIniciales.map((b) => [b.idLista_bizcochuelo, b.precio]))
    )
    const [guardandoId, setGuardandoId] = useState<number | null>(null)
    const [alergenos, setAlergenos] = useState<Record<number, Alergeno[]>>(
        Object.fromEntries(bizcochuelosIniciales.map((b) => [b.idLista_bizcochuelo, b.alergenos ?? []]))
    )
    const [alergenosNuevo, setAlergenosNuevo] = useState<Alergeno[]>(["GLUTEN", "HUEVO", "LECHE"])

    const [nombreNuevo, setNombreNuevo] = useState("")
    const [precioNuevo, setPrecioNuevo] = useState(0)
    const [agregando, setAgregando] = useState(false)

    async function guardarPrecio(bizcochuelo: Bizcochuelo) {
        const nuevoPrecio = precios[bizcochuelo.idLista_bizcochuelo]
        if (nuevoPrecio == null || nuevoPrecio < 0) {
            toast.warning("El precio no puede ser negativo")
            return
        }

        setGuardandoId(bizcochuelo.idLista_bizcochuelo)
        try {
            const actualizado = await guardarBizcochuelo({
                idLista_bizcochuelo: bizcochuelo.idLista_bizcochuelo,
                bizcochuelo: bizcochuelo.bizcochuelo,
                precio: nuevoPrecio,
                alergenos: alergenos[bizcochuelo.idLista_bizcochuelo] ?? [],
            })
            setBizcochuelos((prev) => prev.map((b) => b.idLista_bizcochuelo === actualizado.idLista_bizcochuelo ? actualizado : b))
            toast.success(`"${bizcochuelo.bizcochuelo}" actualizado`)
        } catch (error) {
            console.error("Error al actualizar el precio del bizcochuelo:", error)
            toast.warning("No se pudo actualizar el precio")
        } finally {
            setGuardandoId(null)
        }
    }

    async function agregarBizcochuelo(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()

        const nombre = nombreNuevo.trim()
        if (!nombre) {
            toast.warning("Ponele un nombre al bizcochuelo")
            return
        }
        if (precioNuevo < 0) {
            toast.warning("El precio no puede ser negativo")
            return
        }

        setAgregando(true)
        try {
            const creado = await guardarBizcochuelo({ bizcochuelo: nombre, precio: precioNuevo, alergenos: alergenosNuevo })
            setBizcochuelos((prev) => [...prev, creado])
            setPrecios((prev) => ({ ...prev, [creado.idLista_bizcochuelo]: creado.precio }))
            setAlergenos((prev) => ({ ...prev, [creado.idLista_bizcochuelo]: creado.alergenos ?? [] }))
            setNombreNuevo("")
            setPrecioNuevo(0)
            toast.success(`"${creado.bizcochuelo}" agregado`)
        } catch (error) {
            console.error("Error al agregar el bizcochuelo:", error)
            toast.warning("No se pudo agregar el bizcochuelo")
        } finally {
            setAgregando(false)
        }
    }

    return (
        <div className="w-full bg-white rounded-2xl shadow-md px-4 sm:px-8 py-5 sm:py-6">
            <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center justify-center bg-pink-100 rounded-full w-14 h-14 shrink-0">
                    <CakeSlice className="text-pink-600" size={24} />
                </div>
                <div>
                    <p className="text-gray-700 text-xl font-semibold">Bizcochuelo</p>
                    <p className="text-gray-500">Agregá bizcochuelos nuevos y actualizá el precio de los que ya existen.</p>
                </div>
            </div>

            <form onSubmit={agregarBizcochuelo} className="flex items-end gap-3 flex-wrap mb-6 pb-6 border-b border-gray-200">
                <div className="flex flex-col gap-1">
                    <label className="text-sm text-gray-500">Bizcochuelo nuevo</label>
                    <input type="text" value={nombreNuevo}
                        onChange={(e) => setNombreNuevo(e.target.value)}
                        placeholder="Ej: Chocolate"
                        className="border-2 rounded-xl bg-cyan-50 border-cyan-700 h-10 w-56 px-4" />
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-sm text-gray-500">Precio</label>
                    <input type="number" min={0} value={precioNuevo}
                        onChange={(e) => setPrecioNuevo(Number(e.target.value))}
                        className="border-2 rounded-xl bg-cyan-50 border-cyan-700 h-10 w-32 px-4 text-center" />
                </div>
                <button type="submit" disabled={agregando}
                    className="flex justify-center items-center gap-2 bg-green-300 hover:bg-green-400 disabled:opacity-50 disabled:cursor-not-allowed rounded-full h-10 px-6 font-bold text-white shadow-cyan-500/50 transition-all duration-500 cursor-pointer shrink-0">
                    <Plus size={18} />
                    {agregando ? "Agregando..." : "Agregar bizcochuelo"}
                </button>
                <div className="w-full">
                    <SelectorAlergenos titulo="Alérgenos del bizcochuelo nuevo" seleccionados={alergenosNuevo} onChange={setAlergenosNuevo} />
                </div>
            </form>

            <div className="flex flex-col gap-2">
                {bizcochuelos.length === 0 && (
                    <p className="text-gray-400">Todavía no hay bizcochuelos cargados.</p>
                )}
                {bizcochuelos.map((bizcochuelo) => (
                    <div key={bizcochuelo.idLista_bizcochuelo}
                        className="flex flex-col gap-2 rounded-xl px-3 sm:px-4 py-3 hover:bg-gray-50 border-b border-gray-100">
                        <div className="flex items-center justify-between gap-x-4 gap-y-2 flex-wrap">
                        <span className="text-gray-700 font-medium w-full sm:w-auto">{bizcochuelo.bizcochuelo}</span>
                        <div className="flex items-center gap-2 sm:gap-3 ml-auto">
                            <input type="number" min={0} value={precios[bizcochuelo.idLista_bizcochuelo] ?? bizcochuelo.precio}
                                onChange={(e) => setPrecios((prev) => ({ ...prev, [bizcochuelo.idLista_bizcochuelo]: Number(e.target.value) }))}
                                className="border-2 rounded-xl bg-cyan-50 border-cyan-700 h-10 w-24 sm:w-32 px-2 sm:px-4 text-center" />
                            <button type="button" disabled={guardandoId === bizcochuelo.idLista_bizcochuelo}
                                onClick={() => guardarPrecio(bizcochuelo)}
                                className="flex justify-center items-center bg-amber-400 hover:bg-amber-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-full h-10 px-4 sm:px-6 font-bold text-white shadow-cyan-500/50 transition-all duration-500 cursor-pointer">
                                {guardandoId === bizcochuelo.idLista_bizcochuelo ? "Guardando..." : "Guardar"}
                            </button>
                        </div>
                        </div>
                        <SelectorAlergenos seleccionados={alergenos[bizcochuelo.idLista_bizcochuelo] ?? []}
                            onChange={(nuevos) => setAlergenos((prev) => ({ ...prev, [bizcochuelo.idLista_bizcochuelo]: nuevos }))} />
                    </div>
                ))}
            </div>
        </div>
    )
}
