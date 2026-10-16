"use client"
import { Producto, Sabor } from "@/app/interfaces/producto.interface";
import MenuDetalleGenerico from "./MenuDetalleGenerico";
import { CONFIG_CUPCAKE } from "./menuDetalleConfig";

interface NivelUno {
    producto: Producto
    lista: Sabor[]
}

export default function MenuDetalleCupcake(dato: NivelUno) {
    return <MenuDetalleGenerico producto={dato.producto} config={CONFIG_CUPCAKE} />;
}
