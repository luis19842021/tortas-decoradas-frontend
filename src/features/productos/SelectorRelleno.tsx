import { Producto, Sabor } from "@/app/interfaces/producto.interface"

import { ChevronDown } from "lucide-react";
import { RefObject } from "react";
interface Dato {
    producto: Producto
    titulo: String
    lista: Sabor[]
    relleno: String | undefined
    open: Boolean
    bloqueado?: Boolean
    ref: RefObject<HTMLDivElement | null>
    funcionUno: (t: String, f: String) => void
    funcionOpen: (t: String) => void
    funcionClose: (num: number, t: String) => void

}

export default function SelectorRelleno(dato: Dato) {

    const listaRelleno = () => {

        let lista: Sabor[] = []
        if (dato.titulo == "Relleno 1") {

            for (let i = 0; i < dato.lista.length; i++) {
                if (dato.lista[i].sabor != "Ninguno") {
                    lista.push(dato.lista[i])
                }
            }
        }else if (dato.titulo == "Relleno 4") {
           for (let i = 0; i < dato.lista.length; i++) {
                if (dato.lista[i].sabor != "Ninguno") {
                    lista.push(dato.lista[i])
                }
            }
        }else if (dato.titulo == "Relleno 7") {
              for (let i = 0; i < dato.lista.length; i++) {
                if (dato.lista[i].sabor != "Ninguno") {
                    lista.push(dato.lista[i])
                }
            }

        }else{lista = dato.lista}

        return lista
    }
    const lista = listaRelleno()

    const etiquetaCategoria = (nombreCategoria: String | undefined) => {
        if (nombreCategoria == "Premium") {
            return "bg-amber-400 text-white"
        }
        if (nombreCategoria == "Super Premium") {
            return "bg-red-500 text-white"
        }
        return null
    }

    const Insignia = ({ sabor }: { sabor: Sabor | undefined }) => {
        const clase = etiquetaCategoria(sabor?.categoria?.nombre)
        if (!clase || !sabor) {
            return null
        }
        return (
            <span className={`inline-flex items-center ${clase} text-[10px] font-bold leading-none px-1.5 py-0.5 rounded-full shrink-0 whitespace-nowrap`}>
                {sabor.categoria.nombre}
            </span>
        )
    }

    const saborSeleccionado = lista.find((s) => s.sabor == dato.relleno)

    const categoriasConRecargo = Array.from(
        new Map(
            lista
                .filter((s) => etiquetaCategoria(s.categoria?.nombre))
                .map((s) => [s.categoria.nombre, s.categoria.precio])
        ).entries()
    )

    return (

        <div>
            <div className={`${dato.producto.tipoDeProducto?.detalleDeTorta.pisos==3?"pt-1":"flex z-10"}`}>

                <div>
                    <div className={`flex items-center  px-3 sm:px-8  text-white font-medium text-heading  bg-[#0f98c5] z-15 ${dato.producto.tipoDeProducto?.detalleDeTorta.pisos == 1 ? "h-10 mb-3 text-base sm:text-xl rounded-l-2xl w-28 sm:w-40 shrink-0 "
                        : dato.producto.tipoDeProducto?.detalleDeTorta.pisos==2?"h-6 mb-1.5 text-sm sm:text-lg rounded-l-2xl w-28 sm:w-40 shrink-0  ":"justify-center h-5 mb-0 text-lg rounded-tl-2xl rounded-tr-2xl w-full sm:w-60 truncate "}`}>

                            {`${dato.titulo=="Relleno 1"||dato.titulo=="Relleno 4"||dato.titulo=="Relleno 7" ? "Relleno 1": dato.titulo=="Relleno 2"||dato.titulo=="Relleno 5"||dato.titulo=="Relleno 8" ? " Relleno 2":" Relleno 3"}`}
                            </div>
                </div>

                <div ref={dato.ref} className="relative group flex-1 min-w-0 sm:flex-none">

                    <button onClick={() => { if (!dato.bloqueado) dato.funcionOpen(dato.titulo) }} className={`${dato.producto.tipoDeProducto?.detalleDeTorta.pisos == 1 ? "h-10 text-xl w-full sm:w-80 bg-red-400 rounded-r-lg " :dato.producto.tipoDeProducto?.detalleDeTorta.pisos == 2 ?  "h-6 text-lg w-full sm:w-80 bg-red-400 rounded-r-lg ":"h-5 w-full sm:w-60 truncate bg-green-600  z-20"} flex  justify-center items-center  ${dato.bloqueado ? "" : "cursor-pointer"} ${dato.producto.tipoDeProducto?.detalleDeTorta.pisos==3 &&dato.open==false ?"rounded-bl-xl rounded-br-xl":""}`} >
                        <div className={`${dato.producto.tipoDeProducto?.detalleDeTorta.pisos==3?"text-[#9d08b1] font-semibold ml-5 ":"text-white "} flex items-center justify-center gap-1.5 w-full sm:w-60 truncate `}>
                            <span className="truncate" title={String(dato.relleno ?? "")}>{dato.relleno} </span>
                            <Insignia sabor={saborSeleccionado} />
                        </div>
                        {!dato.bloqueado && (
                            <ChevronDown className={`${dato.open ? "rotate-180" : ""} ${dato.producto.tipoDeProducto?.detalleDeTorta.pisos == 3 ?"mr-2":""} text-white text-lg `} />
                        )}
                    </button>

                    <div className={`absolute z-15  bg-white  rounded shadow-lg  flex flex-col  ${dato.producto.tipoDeProducto?.detalleDeTorta.pisos == 3 ?"w-full sm:w-72":"w-full sm:w-80"}  ${(dato.open == false || dato.bloqueado) ? "hidden" : ""}`}>

                        <ul className="max-h-64 overflow-y-auto">

                            {lista.map((item, slideIndex) => (
                                <li key={slideIndex} onClick={() => dato.funcionClose(slideIndex, dato.titulo)} className={`${dato.producto.tipoDeProducto?.detalleDeTorta.estructura == true && item.sabor == "Ninguno" ? "hidden" : "flex"} items-center justify-between gap-2 px-4 py-2 text-left hover:bg-red-100  ${dato.relleno == lista[slideIndex].sabor ? "bg-orange-200" : ""}`}  >
                                    <span className="min-w-0 whitespace-normal break-words leading-snug">{lista[slideIndex].sabor}</span>
                                    <Insignia sabor={lista[slideIndex]} />
                                </li>
                            ))}

                        </ul>
                        {categoriasConRecargo.length > 0 && (
                            <div className="flex flex-col gap-0.5 px-3 py-2 border-t border-gray-200 bg-gray-50 text-[10px] text-gray-500 shrink-0">
                                {categoriasConRecargo.map(([nombre, precio]) => (
                                    <span key={String(nombre)}>{nombre}: +${precio}</span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    )
}
