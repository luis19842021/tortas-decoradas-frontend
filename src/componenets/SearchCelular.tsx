"use client"

import { Producto } from "@/app/interfaces/producto.interface"
import { getListaDeProductos, getPorNombreProducto } from "@/features/productos/api"
import { useEffect, useRef, useState } from "react"
import useSWR from "swr"

export default function SearchCelular() {

    const divRef = useRef<HTMLDivElement>(null)
    const [open, setOpen] = useState(false)
    const [search, setSearch] = useState("")
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

            setSearch("")
            setDatosFiltrados([])
            setOpen(false)

            window.location.href = '/productos/verProducto/?id=' + producto.idProducto
        } catch (error) {
            setOpen(false)
            alert("No se pudo abrir el producto. Probá de nuevo en unos segundos.")
        }
    }

    const handleSearchCelular = (e: React.ChangeEvent<HTMLInputElement>) => {
        const valor = e.target.value
        setSearch(valor)
        setOpen(true)

        const term = valor.trim().toLowerCase()
        if (term === "") {
            setDatosFiltrados([])
        } else {
            const resultado = (lista ?? []).filter((dato) => dato.toLowerCase().includes(term))
            setDatosFiltrados(resultado)
        }
    }

    return (

        <form className="flex flex-col " onSubmit={(e) => e.preventDefault()}>

            <div className="flex  ">

                <div ref={divRef} className="relative">

                    <input value={search} onChange={handleSearchCelular} type="text" alt="pipu" className=" w-60 min-[380px]:w-68 sm:w-132   h-12 p-4  pl-10 bg-gray-100/50 tracking-wider font-serif  border-3 border-white rounded-l-full focus:outline-none placeholder-regal-gris  " placeholder="Buscar" />
                    <div className={`overflow-y-auto absolute right-0 shadow-2xl bg-amber-50 w-full max-h-80 rounded-b-lg ${open && (datosFiltrados.length > 0 || search.trim().length > 0) ? "visible" : "invisible"} `}>
                        <ul>
                            {datosFiltrados.length < 1 && search.trim().length > 0 ? (
                                <li className="pl-5 pb-1 text-sm text-gray-500">No existen resultados</li>
                            ) : (
                                datosFiltrados.map((nombre, indice) => (
                                    <li key={indice} onClick={() => buscarRedirigir(nombre)} className="font-semibold pl-5 pb-1 hover:bg-[#62ccf0] cursor-pointer"> {nombre}</li>
                                ))
                            )}
                        </ul>
                    </div>
                </div>

                <div className=" flex items-center pl-5 h-12 bg-mio2 w-20 rounded-none border-y-3 border-r-3 border-white rounded-r-full">
                    <button type="button">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="  stroke-black size-7 stroke-3   ">
                            <path d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                        </svg>
                    </button>
                </div>

            </div>

        </form>

    )
}
