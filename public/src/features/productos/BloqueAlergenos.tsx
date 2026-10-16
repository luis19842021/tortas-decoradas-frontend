import { oi } from "@/app/ui/fonts";
import { Alergeno, etiquetaAlergeno, unirAlergenos } from "./alergenos";

interface Props {
    ingredientes?: String | null
    alergenos?: Alergeno[] | null
    trazas?: Alergeno[] | null
    nota?: string
    className?: string
}

export default function BloqueAlergenos({ ingredientes, alergenos, trazas, nota, className = "" }: Props) {
    const contiene = unirAlergenos(alergenos)
    const soloTrazas = unirAlergenos(trazas).filter((a) => !contiene.includes(a))
    const textoIngredientes = ingredientes ? String(ingredientes).trim() : ""
    const sinDatos = contiene.length === 0 && soloTrazas.length === 0 && textoIngredientes === ""

    return (
        <div className={`bg-blue-100 rounded-xl px-6 py-4 ${className}`}>
            <h2 className={`font-bold text-2xl underline text-cyan-900 ${oi.className} mb-3`}>Ingredientes y alérgenos :</h2>

            {sinDatos ? (
                <p className="text-gray-700">Este producto todavía no tiene alérgenos informados. Consultanos por WhatsApp antes de comprar si tenés alguna alergia.</p>
            ) : (
                <div className="flex flex-col gap-3">
                    {textoIngredientes !== "" && (
                        <p className="text-gray-700"><span className="font-semibold">Ingredientes: </span>{textoIngredientes}</p>
                    )}
                    {contiene.length > 0 && (
                        <div>
                            <p className="text-sm font-semibold text-gray-600 mb-1">Contiene</p>
                            <div className="flex flex-wrap gap-1.5">
                                {contiene.map((a) => (
                                    <span key={a} className="rounded-full border border-orange-500 bg-orange-100 text-orange-900 px-3 py-0.5 text-sm">{etiquetaAlergeno(a)}</span>
                                ))}
                            </div>
                        </div>
                    )}
                    {soloTrazas.length > 0 && (
                        <div>
                            <p className="text-sm font-semibold text-gray-600 mb-1">Puede contener trazas de</p>
                            <div className="flex flex-wrap gap-1.5">
                                {soloTrazas.map((a) => (
                                    <span key={a} className="rounded-full border border-gray-400 bg-gray-100 text-gray-700 px-3 py-0.5 text-sm">{etiquetaAlergeno(a)}</span>
                                ))}
                            </div>
                        </div>
                    )}
                    {nota && <p className="text-sm text-gray-600 italic">{nota}</p>}
                </div>
            )}
        </div>
    )
}
