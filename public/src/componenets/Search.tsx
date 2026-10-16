"use client"

import { Producto } from "@/app/interfaces/producto.interface"
import { getListaDeProductos, getPorNombreProducto } from "@/features/productos/api"
import { useEffect, useRef, useState } from "react"
import useSWR from "swr"

export default function Search() {

    const inputRef = useRef<HTMLInputElement>(null);
    const divRef = useRef<HTMLDivElement>(null)
    const [open, setOpen] = useState(false)
    const [datosFiltrados, setDatosFiltrados] = useState<string[]>([])

    const { data: lista } = useSWR<string[]>("lista-productos", getListaDeProductos)

    useEffect(() => {
        const listener = (event: MouseEvent) => {
            if (!divRef.current || !divRef.current.contains(event.target as Node)) {
                setOpen(false)
            }
        };

        document.addEventListener('mousedown', listener);

        return () => document.removeEventListener('mousedown', listener);
    }, []);

    async function buscarRedirigir(nombre: string) {

        try {
            const producto: Producto = await getPorNombreProducto(nombre);
            if (inputRef.current) {
                inputRef.current.value = ""
            }

            setDatosFiltrados([])
            setOpen(false)

            window.location.href = '/productos/verProducto/?id=' + producto.idProducto
        } catch (error) {
            setOpen(false)
            alert("No se pudo abrir el producto. Probá de nuevo en unos segundos.")
        }
    }

    const busquedaDeProducto = (e: React.ChangeEvent<HTMLInputElement>) => {
        setOpen(true)
        const term = e.target.value.trim().toLowerCase()

        if (term === "") {
            setDatosFiltrados([])
        } else {
            const resultado = (lista ?? []).filter((dato) => dato.toLowerCase().includes(term))
            setDatosFiltrados(resultado)
        }
    }

    return (

        <div className="flex  items-center ">

            <div ref={divRef} className="relative  ">

                <input ref={inputRef} type="text" onChange={(e) => busquedaDeProducto(e)} className=" w-120 h-12 pl-3 bg-gray-100/50 font-serif  border-3 border-white rounded-l-full focus:outline-none placeholder-regal-gris  " placeholder="Buscar" />
                <div className={`overflow-y-auto absolute right-0 shadow-2xl bg-amber-50 w-110 max-h-80 rounded-b-lg ${open && datosFiltrados.length > 0 ? "visible  " : "invisible"}`}>
                    <ul>
                        {datosFiltrados.map((nombre, indice) => (
                            <li key={indice} onClick={() => buscarRedirigir(nombre)} className="font-semibold pl-5 pb-1 hover:bg-[#62ccf0] cursor-pointer"> {nombre}</li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className=" h-12 pl-5 pt-1 bg-mio2 w-20 border-white border-y-3 border-r-3 rounded-r-full">
                <button type="button">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="  stroke-black size-8 stroke-3   ">
                        <path d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                    </svg>
                </button>

            </div>

        </div>

    )
}
