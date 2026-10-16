import { oi } from "../../ui/fonts";
import MenuDetalleTorta from "@/features/productos/MenuDetalleTorta";
import ImagenesDeMenuProductos from "@/features/productos/ImagenesDeMenuProductos";
import { getListaDeBizcochuelos, getListaDeSabores, getListaDeTamaños, getProducto } from "@/features/productos/api";
import { Bizcochuelo, Producto, Sabor, TamañoCatalogo } from "@/app/interfaces/producto.interface";
import FormaDeEnvio from "@/componenets/FormaDeEnvio";
import ConsultaProducto from "@/componenets/ConsultaProducto";
import MenuDetalleGalletita from "@/features/productos/MenuDetalleGalletita";
import MenuDetalleCupcake from "@/features/productos/MenuDetalleCupcake";
import MenuDetalleVariado from "@/features/productos/MenuDetalleVariado";
import MenuDetalleCakePops from "@/features/productos/MenuDetalleCakePops";
import MenuDetalleMinidonas from "@/features/productos/MenuDetalleMinidonas";
import MenuDetalleOreos from "@/features/productos/MenuDetalleOreos";
import MenuDetallePaletas from "@/features/productos/MenuDetallePaletas";
import { JSX } from "react";
import { notFound } from "next/navigation";
import AlergenosFicha from "@/features/productos/AlergenosFicha";
import MediosDePago from "@/componenets/MediosDePago";

interface NivelUno {
    producto: Producto
    lista: Sabor[]
    listaBizcochuelos: Bizcochuelo[]
    listaTamaños: TamañoCatalogo[]
}

const COMPONENTES_DETALLE_POR_TIPO: Record<string, (dato: NivelUno) => JSX.Element> = {
    TORTA: MenuDetalleTorta,
    CUPCAKE: MenuDetalleCupcake,
    GALLETA: MenuDetalleGalletita,
    CAKEPOPS: MenuDetalleCakePops,
    MINIDONAS: MenuDetalleMinidonas,
    OREOS: MenuDetalleOreos,
    PALETAS: MenuDetallePaletas,
}

export default async function producto({
    searchParams,
}: {
    searchParams: Promise<{ id?: string }>;
}) {

    const { id } = await searchParams;

    if (!id || Number.isNaN(Number(id))) {
        notFound()
    }

    const [producto, lista, listaBizcochuelos, listaTamaños] = await Promise.all([
        getProducto(Number(id)),
        getListaDeSabores(),
        getListaDeBizcochuelos(),
        getListaDeTamaños(),
    ])

    if (producto.suspendido) {
        notFound()
    }

    const data: NivelUno = {
        producto: producto,
        lista: lista,
        listaBizcochuelos: listaBizcochuelos,
        listaTamaños: listaTamaños,
    }
    const ComponenteDetalle = COMPONENTES_DETALLE_POR_TIPO[String(producto.tipoDeProducto?.tipo ?? "")] ?? MenuDetalleVariado
    const tipo = String(producto.tipoDeProducto?.tipo ?? "")

    return (
        <div className="flex justify-center pt-4 mb-5">
            <div className="flex flex-col gap-4 w-full max-w-120 sm:max-w-160 px-3 lg:px-0 lg:max-w-none lg:w-264">

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch">
                    <ImagenesDeMenuProductos{...producto}></ImagenesDeMenuProductos>
                    <ComponenteDetalle {...data} />
                </div>

                {tipo == "TORTA" && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch">
                        <div className="bg-blue-100 rounded-xl px-6 py-4">
                            <h2 className={`font-bold text-2xl underline text-cyan-900 ${oi.className}`}>Descripcion :</h2>
                            <p className="pt-4 text-lg text-gray-700">{producto.descripcion ? producto.descripcion : "Este producto no tiene una descripción cargada."}</p>
                            <p className="pt-2 text-lg text-gray-700 font-semibold">Categoría: {producto.categoria}</p>
                        </div>
                        <FormaDeEnvio className="relative bg-blue-100 rounded-xl pb-4" />
                    </div>
                )}

                {(tipo == "GALLETA" || tipo == "CUPCAKE") && (
                    <FormaDeEnvio className="bg-blue-100 rounded-xl pb-4" />
                )}

                <AlergenosFicha producto={producto} />

                <MediosDePago className="bg-blue-100 rounded-xl pb-4" />

                <div className="bg-blue-100 rounded-xl pb-4">
                    <h2 className={`font-bold text-2xl underline text-cyan-900 ${oi.className} pt-4 pl-8`}>Consultas :</h2>
                    <ConsultaProducto nombreProducto={producto.nombre} />
                </div>

            </div>
        </div>
    )
}
