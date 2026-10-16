"use client"
import { Producto, Sabor } from "@/app/interfaces/producto.interface";
import MenuDetalleGenerico from "./MenuDetalleGenerico";
import { CONFIG_CAKEPOPS } from "./menuDetalleConfig";

interface NivelUno {
    producto: Producto
    lista: Sabor[]
}

export default function MenuDetalleCakePops(dato: NivelUno) {
    return <MenuDetalleGenerico producto={dato.producto} config={CONFIG_CAKEPOPS} />;
}
