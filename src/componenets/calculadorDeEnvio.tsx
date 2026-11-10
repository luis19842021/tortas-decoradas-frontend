"use client"

import { useEffect, useRef, useState } from "react"
import { apiFetch } from "@/utils/apiFetch"

interface Cp {
    numero: number
    localidad: String
    precio: number
}

interface Props {
    onCalcular?: (precio: number) => void
    disabled?: boolean
}

export default function CalculadorDeEnvio({ onCalcular, disabled = false }: Props = {}) {
    const [listaCP, setListaCP] = useState<Cp[]>([])
    const [cargandoCP, setCargandoCP] = useState(true)

    useEffect(() => {
        apiFetch("/producto/listaCodigosPostales")
            .then((respuesta) => (respuesta.ok ? respuesta.json() : []))
            .then((datos: Cp[]) => setListaCP(datos))
            .catch(() => setListaCP([]))
            .finally(() => setCargandoCP(false))
    }, [])

    const [valor, setValor] = useState(0)
    const [cp, setCp] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)
    const calcularEnvio = () => {
        console.log(inputRef.current?.value)
        let precio = 0

            for (let index = 0; index < listaCP.length; index++) {
            if (listaCP[index].numero === parseInt(inputRef.current?.value || '0')) {
                precio = listaCP[index].precio

            }
        }

        setCp(true)
        setValor(precio)
        onCalcular?.(precio)
    }

    return (

        <div className={`flex items-center   mt-4 ${disabled ? "opacity-50" : ""}`}>

            <div>

            <button
                onClick={() => !disabled && !cargandoCP && calcularEnvio()}
                disabled={disabled || cargandoCP}
                className={`bg-[#09c99f] h-10 w-32 sm:w-40 rounded-l-2xl ${disabled || cargandoCP ? "cursor-not-allowed" : "hover:bg-[#07a88a] cursor-pointer"}`}
            >
                <div className="text-white font-medium  text-heading  text-base sm:text-xl mb-2.5 px-2 sm:px-4 py-1   ">{cargandoCP ? "Cargando..." : "Calcular Envío"} </div>
            </button>
            </div>
            <div>
                <  input ref={inputRef} disabled={disabled || cargandoCP} className="bg-cyan-50 border-2 border-gray-300 p-2 h-10 w-24 sm:w-30 disabled:cursor-not-allowed" type="text"   placeholder="Ingrese su CP"  />
            </div>
            <div  className="h-10 p-1.5 w-28 sm:w-40 truncate rounded-r-2xl bg-cyan-50  text-gray-500 border-t-2 border-b-2 border-r-2 pl-4 border-gray-300" >
                 {`${valor===0 && cp == false? "costo de envio" : valor === 0 && cp == true ? "CP no encontrado" : ` $  ${valor}`}`}
            </div>
        </div>

    )
}
