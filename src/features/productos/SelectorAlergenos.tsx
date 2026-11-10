"use client"
import { Check } from "lucide-react";
import { ALERGENOS, Alergeno } from "./alergenos";

interface Props {
    titulo?: string
    seleccionados: Alergeno[]
    onChange: (nuevos: Alergeno[]) => void
    variante?: "contiene" | "trazas"
    deshabilitado?: boolean
}

export default function SelectorAlergenos({ titulo, seleccionados, onChange, variante = "contiene", deshabilitado = false }: Props) {

    const alternar = (valor: Alergeno) => {
        if (deshabilitado) return
        onChange(seleccionados.includes(valor)
            ? seleccionados.filter((a) => a !== valor)
            : [...seleccionados, valor])
    }

    const activo = variante === "contiene"
        ? "bg-orange-100 border-orange-500 text-orange-900"
        : "bg-gray-200 border-gray-500 text-gray-800"

    return (
        <div className="flex flex-col gap-1">
            {titulo && <span className="text-sm text-gray-500">{titulo}</span>}
            <div className="flex flex-wrap gap-1.5">
                {ALERGENOS.map((a) => {
                    const marcado = seleccionados.includes(a.valor)
                    return (
                        <button key={a.valor} type="button" onClick={() => alternar(a.valor)} disabled={deshabilitado}
                            aria-pressed={marcado}
                            className={`flex items-center gap-1 rounded-full border px-3 py-1 text-sm transition-colors cursor-pointer disabled:cursor-not-allowed ${marcado ? activo : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"}`}>
                            {marcado && <Check size={14} />}
                            {a.etiqueta}
                        </button>
                    )
                })}
            </div>
        </div>
    )
}
