"use client"
import { Producto, Sabor } from "@/app/interfaces/producto.interface";
import MenuDetalleGenerico from "./MenuDetalleGenerico";
import { CONFIG_MINIDONAS } from "./menuDetalleConfig";

interface NivelUno {
    producto: Producto
    lista: Sabor[]
}

export default function MenuDetalleMinidonas(dato: NivelUno) {
    return <MenuDetalleGenerico producto={dato.producto} config={CONFIG_MINIDONAS} />;
}
