"use client"
import { Paquete, Producto } from "@/app/interfaces/producto.interface";
import { oi } from "@/app/ui/fonts";
import EditarEspeciales from "./EditarEspeciales";

const CANTIDAD_DE_ESPACIOS = 4

const productoEspia: Producto = {
    idProducto: 0,
    nombre: "Elegir producto",
    precio: 0,
    url_image: "v1776224771/uploadTarjeta_dxdtwg.jpg",
    url_image2: "",
    url_image3: "",
    url_image4: "",
    descripcion: "",
    categoria: "",
    subcategoria: "",
    categoesp: "",
    tipoDeProducto: null,
    suspendido: false
}

export default function EditarCategoriasEspeciales(pase: Paquete) {

    const prepararPaquete = (p: Producto): Paquete => ({ ...pase, producto: p })

    const espacios = Array.from(
        { length: CANTIDAD_DE_ESPACIOS },
        (_, i) => pase.productosPorTipo[i] ?? productoEspia
    )

    const idAncla = `categoria-${pase.tipo.toLowerCase()}`

    return (
        <div id={idAncla}>
            <div className="flex justify-start items-center mt-5 md:mt-12 pl-4 w-full h-25 bg-blue-200">
                <h2 className={`${oi.className} flex text-gray-600 items-center relative text-2xl md:text-4xl `}>
                    Editar {pase.seccion}
                </h2>
            </div>

            <div className="flex justify-center py-5">
                <div className="flex flex-col gap-3 w-full max-w-210 px-3 xl:px-0">
                    {espacios.map((producto, i) => (
                        <EditarEspeciales key={producto.idProducto || `vacio-${i}`} {...prepararPaquete(producto)} />
                    ))}
                </div>
            </div>
        </div>
    )
}
