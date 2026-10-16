"use client"
import { useState } from "react";
import { CalendarRange } from "lucide-react";
import { toast } from "react-toastify";
import { ConfiguracionAgenda, actualizarCupoMaximoPorDia } from "@/features/configuracion/api";

interface Props {
    configuracionInicial: ConfiguracionAgenda
}

export default function EditarCupoMaximo({ configuracionInicial }: Props) {

    const [cupo, setCupo] = useState(configuracionInicial.cupoMaximoPorDia)
    const [guardando, setGuardando] = useState(false)

    async function guardar(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()

        if (cupo < 1) {
            toast.warning("El cupo máximo por día tiene que ser como mínimo 1")
            return
        }

        setGuardando(true)
        try {
            await actualizarCupoMaximoPorDia(cupo)
            toast.success("Capacidad de turnos por día actualizada")
        } catch (error) {
            console.error("Error al actualizar el cupo máximo por día:", error);
            toast.warning("No se pudo actualizar la capacidad de turnos por día")
        } finally {
            setGuardando(false)
        }
    }

    return (
        <div className="w-full bg-white rounded-2xl shadow-md px-4 sm:px-8 py-5 sm:py-6">
            <form onSubmit={guardar} className="flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center bg-amber-100 rounded-full w-14 h-14 shrink-0">
                        <CalendarRange className="text-amber-600" size={24} />
                    </div>
                    <div>
                        <p className="text-gray-700 text-xl font-semibold">Capacidad de turnos por día</p>
                        <p className="text-gray-500">Cuántos pedidos como máximo se aceptan por día antes de que el calendario marque el día como completo.</p>
                    </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                    <input type="number" min={1} value={cupo}
                        onChange={(e) => setCupo(Number(e.target.value))}
                        className="border-2 rounded-xl bg-cyan-50 border-cyan-700 h-10 w-24 px-4 text-center" />
                    <button type="submit" disabled={guardando}
                        className="flex justify-center items-center bg-amber-400 hover:bg-amber-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-full h-10 px-6 font-bold text-white shadow-cyan-500/50 transition-all duration-500 cursor-pointer">
                        {guardando ? "Guardando..." : "Guardar"}
                    </button>
                </div>
            </form>
        </div>
    )
}
