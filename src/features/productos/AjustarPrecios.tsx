"use client"
import { useState } from "react";
import { Percent } from "lucide-react";
import { toast } from "react-toastify";
import { ajustarPrecios } from "@/features/productos/api";

interface Props {
    categorias: string[]
}

const REDONDEOS = [1, 10, 50, 100, 500, 1000]

function precioAjustado(precio: number, porcentaje: number, redondeo: number) {
    return Math.round((precio * (1 + porcentaje / 100)) / redondeo) * redondeo
}

function nombreLindo(categoria: string) {
    return categoria.charAt(0) + categoria.slice(1).toLowerCase()
}

const pesos = (n: number) => "$" + n.toLocaleString("es-AR")

export default function AjustarPrecios({ categorias }: Props) {

    const [porcentaje, setPorcentaje] = useState<number>(10)
    const [categoria, setCategoria] = useState<string>("")
    const [incluirAdicionales, setIncluirAdicionales] = useState(true)
    const [redondeo, setRedondeo] = useState(10)
    const [confirmando, setConfirmando] = useState(false)
    const [aplicando, setAplicando] = useState(false)

    const porcentajeValido = Number.isFinite(porcentaje) && porcentaje !== 0 && porcentaje >= -90 && porcentaje <= 300
    const verbo = porcentaje >= 0 ? "subir" : "bajar"
    const alcance = categoria ? `los productos de ${nombreLindo(categoria)}` : "todos los productos"

    function pedirConfirmacion(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        if (!porcentajeValido) {
            toast.warning("El porcentaje tiene que estar entre -90 y 300, y no puede ser 0")
            return
        }
        setConfirmando(true)
    }

    async function aplicar() {
        setAplicando(true)
        try {
            const resultado = await ajustarPrecios({
                porcentaje,
                categoria: categoria || null,
                incluirAdicionales,
                redondeo,
            })
            const partes = [`${resultado.productos} productos`]
            if (incluirAdicionales) {
                partes.push(`${resultado.tamaños} tamaños`, `${resultado.bizcochuelos} bizcochuelos`, `${resultado.categoriasSabor} categorías de sabor`)
            }
            toast.success(`Precios actualizados: ${partes.join(", ")}`)
            setConfirmando(false)
        } catch (error) {
            console.error("Error al ajustar precios:", error)
            toast.warning(error instanceof Error ? error.message : "No se pudieron ajustar los precios")
        } finally {
            setAplicando(false)
        }
    }

    return (
        <div className="w-full bg-white rounded-2xl shadow-md px-4 sm:px-8 py-5 sm:py-6">
            <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center justify-center bg-rose-100 rounded-full w-14 h-14 shrink-0">
                    <Percent className="text-rose-600" size={24} />
                </div>
                <div>
                    <p className="text-gray-700 text-xl font-semibold">Ajustar precios en bloque</p>
                    <p className="text-gray-500">Sube o baja un porcentaje a todos los productos (o a una categoría) de una sola vez. Los pedidos ya hechos no cambian.</p>
                </div>
            </div>

            <form onSubmit={pedirConfirmacion} className="flex flex-col gap-4">
                <div className="flex flex-wrap gap-6">
                    <label className="flex flex-col gap-1 text-gray-600">
                        Porcentaje
                        <div className="flex items-center gap-2">
                            <input type="number" step="0.5" min={-90} max={300} value={Number.isNaN(porcentaje) ? "" : porcentaje}
                                onChange={(e) => { setPorcentaje(e.target.valueAsNumber); setConfirmando(false) }}
                                className="border-2 rounded-xl bg-cyan-50 border-cyan-700 h-10 w-28 px-4 text-center" />
                            <span className="text-gray-500">%</span>
                        </div>
                        <span className="text-xs text-gray-400">Negativo para bajar (ej. -10)</span>
                    </label>

                    <label className="flex flex-col gap-1 text-gray-600">
                        Productos
                        <select value={categoria} onChange={(e) => { setCategoria(e.target.value); setConfirmando(false) }}
                            className="border-2 rounded-xl bg-cyan-50 border-cyan-700 h-10 px-3">
                            <option value="">Todas las categorías</option>
                            {categorias.map((c) => (
                                <option key={c} value={c}>{nombreLindo(c)}</option>
                            ))}
                        </select>
                    </label>

                    <label className="flex flex-col gap-1 text-gray-600">
                        Redondear a
                        <select value={redondeo} onChange={(e) => { setRedondeo(Number(e.target.value)); setConfirmando(false) }}
                            className="border-2 rounded-xl bg-cyan-50 border-cyan-700 h-10 px-3">
                            {REDONDEOS.map((r) => (
                                <option key={r} value={r}>{r === 1 ? "Al peso" : `Múltiplos de $${r}`}</option>
                            ))}
                        </select>
                    </label>
                </div>

                <label className="flex items-center gap-2 text-gray-600">
                    <input type="checkbox" checked={incluirAdicionales}
                        onChange={(e) => { setIncluirAdicionales(e.target.checked); setConfirmando(false) }}
                        className="w-4 h-4" />
                    También tamaños, bizcochuelos y categorías de sabor (lo que suma al armar una torta)
                </label>

                {porcentajeValido && (
                    <p className="text-gray-500 bg-gray-50 rounded-xl px-4 py-2">
                        Ejemplo: un producto de {pesos(10000)} pasaría a <span className="font-semibold text-gray-700">{pesos(precioAjustado(10000, porcentaje, redondeo))}</span>.
                    </p>
                )}

                {!confirmando ? (
                    <div className="flex justify-end">
                        <button type="submit" disabled={!porcentajeValido}
                            className="flex justify-center items-center bg-rose-400 hover:bg-rose-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-full h-10 px-6 font-bold text-white transition-all duration-500 cursor-pointer">
                            Revisar ajuste
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center justify-between gap-4 flex-wrap bg-rose-50 border border-rose-200 rounded-xl px-4 py-3">
                        <p className="text-rose-800">
                            Vas a {verbo} un <span className="font-semibold">{Math.abs(porcentaje)} %</span> {alcance}
                            {incluirAdicionales ? " y los adicionales de torta" : ""}. Conviene tener un backup de la base antes.
                        </p>
                        <div className="flex gap-2 shrink-0">
                            <button type="button" onClick={() => setConfirmando(false)} disabled={aplicando}
                                className="rounded-full h-10 px-5 font-semibold text-gray-600 bg-white border hover:bg-gray-100 cursor-pointer">
                                Cancelar
                            </button>
                            <button type="button" onClick={aplicar} disabled={aplicando}
                                className="rounded-full h-10 px-5 font-bold text-white bg-rose-500 hover:bg-rose-600 disabled:opacity-50 cursor-pointer">
                                {aplicando ? "Aplicando..." : "Confirmar"}
                            </button>
                        </div>
                    </div>
                )}
            </form>
        </div>
    )
}
