"use client"
import { RefObject } from "react"
import { TriangleAlert } from "lucide-react";
import SelectorRelleno from "./SelectorRelleno"
import { Producto, Sabor } from "@/app/interfaces/producto.interface"
import { ChevronDown } from "lucide-react";
import { useSelectoresAbiertos } from "./useSelectoresAbiertos"
import { prefijoForma, rellenoBloqueado, rellenoVisible } from "./formaTorta";

const CAMPOS = ["tamaño", "biscochuelo", "Relleno 1", "Relleno 2", "Relleno 3"] as const

interface Dato {
    producto: Producto
    titulo: String
    lista: Sabor[]
    relleno: String | undefined
    open: Boolean
    bloqueado?: Boolean
    ref: RefObject<HTMLDivElement | null>
    funcionUno: (t: String,f: String) => void
    funcionOpen: (t: String) => void
    funcionClose: (num: number, t: String) => void

}
interface NivelDos {
    producto: Producto
    lista: Sabor[]
    listaBizcochuelos: { sabor: String, precio: number }[]
    tamaño: String | undefined
     listaTamaño: Tam[]
    biscochuelo: String | undefined
    rellenoUno: String | undefined
    rellenoDos: String | undefined
    rellenoTres: String | undefined
    funcionTamaño: (t: String, n: String) => void
    funcionBiscochuelo: (b: String, n: String) => void
    funcionRelleno: (r: String, n: String) => void

}
interface Tam {
    medida: String
    precio: number
}
export default function MenuDetalleDeTortaUnPiso(dato: NivelDos) {
    const { abiertos, refs, alternar: abrir, cerrar: cerrarDropdown } = useSelectoresAbiertos(CAMPOS)

    const biscochuelos = dato.listaBizcochuelos

    const crearDato = (titulo: String, relleno: String | undefined, open: Boolean, ref: RefObject<HTMLDivElement | null>, f: (r: String, n: String) => void, funOpen: (r: String) => void, funClose: (num: number, r: String) => void, bloqueado: Boolean = false) => {
        const pre: Dato = {
            producto: dato.producto,
            titulo: titulo,
            lista: dato.lista,
            relleno: relleno,
            ref: ref,
            open: open,
            bloqueado: bloqueado,
            funcionUno: f,
            funcionOpen: funOpen,
            funcionClose: funClose

        }
        return pre
    }
    const cerrar = (num: number, tipo: String) => {
        if (tipo == "tamañoUno") {
            dato.funcionTamaño(dato.listaTamaño[num].medida, tipo)
            cerrarDropdown("tamaño")
        }
        if (tipo == "biscochueloUno") {
            dato.funcionBiscochuelo(biscochuelos[num].sabor,tipo)
            cerrarDropdown("biscochuelo")
        }
        if (tipo == "Relleno 1") {
            dato.funcionRelleno(dato.lista[num+1].sabor, tipo)
            cerrarDropdown("Relleno 1")
        }
        if (tipo == "Relleno 2") {
            dato.funcionRelleno(dato.lista[num].sabor, tipo)
            cerrarDropdown("Relleno 2")
        }
        if (tipo == "Relleno 3") {
            dato.funcionRelleno(dato.lista[num].sabor, tipo)
            cerrarDropdown("Relleno 3")
        }
    }

    return (
        <div>

            <div>
                <div className="font-bold text-2xl pl-2 pb-2 text-cyan-900 ">Piso : Uno</div>
                <div className="flex items-center mb-5">
                    <div className="bg-amber-50 w-12 rounded-l-lg h-10">
                        <TriangleAlert className="text-amber-400 size-10 pl-2 " />
                    </div>
                    <div className="flex-1 min-w-0 sm:flex-none sm:w-108 min-h-10 bg-amber-200 rounded-r-lg ">
                        <p className="pl-2 text-sm leading-[1.1] pt-1 ">Es posible modificar algunas características de la torta que podrían variar el precio. Verifique el precio final</p>
                    </div>
                </div>
                <div className="flex pt-5 ">
                    <div>
                        <div className="block  mb-3 px-3 sm:px-8 py-1 text-white text-base sm:text-xl w-28 sm:w-40 shrink-0 h-10 font-medium text-heading rounded-l-2xl  bg-[#0f98c5] z-10">Tamaño</div>
                    </div>

                    <div ref={refs["tamaño"]} className="relative group flex-1 min-w-0 sm:flex-none">

                        <button onClick={() => abrir("tamaño")} className={`${dato.producto.tipoDeProducto?.detalleDeTorta.estructura == true ? "" : "cursor-pointer"} flex  justify-center items-center bg-red-400  h-10 w-full sm:w-80 rounded-r-lg `}>
                            <div className="text-white text-xl  w-full sm:w-60 truncate  ">{dato.tamaño} </div>
                            <ChevronDown className= {`${abiertos["tamaño"]?"rotate-180":""} ${dato.producto.tipoDeProducto?.detalleDeTorta.estructura==true?"invisible":"visible"} text-white text-xl `} />
                        </button>

                        <div className={`absolute  z-10 bg-white border rounded shadow-lg w-full sm:w-80 ${dato.producto.tipoDeProducto?.detalleDeTorta.estructura == true ? "invisible" : "visible"} ${abiertos["tamaño"] == false ? "hidden" : ""}`}>
                            <ul>

                                {dato.listaTamaño.map((medida, slideIndex) => (
                                    <li key={slideIndex} onClick={() => cerrar(slideIndex, "tamañoUno")} className={`block px-4 py-2  hover:bg-red-100  ${dato.tamaño == medida.medida ? "bg-orange-200" : ""}`}  >
                                        {medida.medida}
                                    </li>
                                ))}

                            </ul>
                        </div>
                    </div>

                </div>

                <div className="flex z-10">
                    <div>
                        <div className="block  mb-3 px-3 sm:px-8  py-1 text-white text-base sm:text-xl w-28 sm:w-40 shrink-0 h-10 font-medium text-heading rounded-l-2xl   bg-[#0f98c5] z-10">bizcochuelo</div>
                    </div>
                    <div ref={refs["biscochuelo"]} className="relative group flex-1 min-w-0 sm:flex-none">

                        <button onClick={() => abrir("biscochuelo")} className=" flex  justify-center items-center bg-red-400  h-10 w-full sm:w-80 rounded-r-lg cursor-pointer">
                            <div className=" text-white text-xl w-full sm:w-60 truncate capitalize ">{dato.biscochuelo?.toLowerCase()}   </div>
                            <ChevronDown className={`${abiertos["biscochuelo"]?"rotate-180":""} text-white text-xl `} />
                        </button>

                        <div className={`absolute z-20  bg-white border rounded shadow-lg  w-full sm:w-80 ${abiertos["biscochuelo"] == false ? "hidden" : ""}`}>
                            <ul>

                                {biscochuelos.map((item, slideIndex) => (
                                    <li key={slideIndex} onClick={() => cerrar(slideIndex, "biscochueloUno")} className={`block px-4 py-2  hover:bg-red-100 capitalize  ${dato.biscochuelo == item.sabor ? "bg-orange-200" : ""}`}  >
                                        {item.sabor.toLowerCase()}
                                    </li>
                                ))}

                            </ul>
                        </div>
                    </div>

                </div>

                <div className={`${rellenoVisible(dato.producto.tipoDeProducto?.detalleDeTorta.estructura, dato.rellenoUno) ? "visible" : "invisible"}`}>
                    <SelectorRelleno {...crearDato("Relleno 1", dato.rellenoUno, abiertos["Relleno 1"], refs["Relleno 1"], dato.funcionRelleno, abrir, cerrar, rellenoBloqueado(dato.producto.tipoDeProducto?.detalleDeTorta.estructura, dato.rellenoUno))} />
                </div>
                <div className={`${rellenoVisible(dato.producto.tipoDeProducto?.detalleDeTorta.estructura, dato.rellenoDos) ? "visible" : "invisible"}`}>
                    <SelectorRelleno {...crearDato("Relleno 2", dato.rellenoDos, abiertos["Relleno 2"], refs["Relleno 2"], dato.funcionRelleno, abrir, cerrar, rellenoBloqueado(dato.producto.tipoDeProducto?.detalleDeTorta.estructura, dato.rellenoDos))} />
                </div>
                <div className={`${rellenoVisible(dato.producto.tipoDeProducto?.detalleDeTorta.estructura, dato.rellenoTres, prefijoForma(dato.producto.tipoDeProducto?.detalleDeTorta) == "TCI") ? "visible" : "invisible"}`}>
                    <SelectorRelleno  {...crearDato("Relleno 3", dato.rellenoTres, abiertos["Relleno 3"], refs["Relleno 3"], dato.funcionRelleno, abrir, cerrar, rellenoBloqueado(dato.producto.tipoDeProducto?.detalleDeTorta.estructura, dato.rellenoTres))} />
                </div>

            </div>

        </div>
    )
}
