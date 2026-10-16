"use client"
import { Paquete, Producto } from "@/app/interfaces/producto.interface";
import EditarCategoriasEspeciales from "./EditarCategoriasEspeciales";
import { getCategoriasEspecial } from "@/features/productos/api";
import { useState } from "react";

interface Dato {
  especialUltimo: Producto[]
  especialTendencia: Producto[]
  especialDestacado: Producto[]
}

export default function SeccionCategoriaEspeciales(dato: Dato) {

    const [ultimos, setUltimos] = useState<Producto[]>(dato.especialUltimo)
    const [tendencia, setTendencia] = useState<Producto[]>(dato.especialTendencia)
    const [destacado, setDestacado] = useState<Producto[]>(dato.especialDestacado)

    const resetear = async () => {
        const [nuevoUltimos, nuevaTendencia, nuevoDestacado] = await Promise.all([
            getCategoriasEspecial("ULTIMO"),
            getCategoriasEspecial("TENDENCIA"),
            getCategoriasEspecial("DESTACADO"),
        ])
        setUltimos(nuevoUltimos)
        setTendencia(nuevaTendencia)
        setDestacado(nuevoDestacado)
    }

    const asignaciones: Record<number, string[]> = {}
    const registrar = (tipo: string, lista: Producto[]) => {
        lista.forEach((p) => {
            if (!p || !p.idProducto) return
            asignaciones[p.idProducto] = [...(asignaciones[p.idProducto] ?? []), tipo]
        })
    }
    registrar("ULTIMO", ultimos)
    registrar("TENDENCIA", tendencia)
    registrar("DESTACADO", destacado)

    const crearPaquete = (tipo: String, seccion: String, con: Producto[]): Paquete => ({
        producto: con[0],
        tipo: tipo,
        seccion: seccion,
        productosPorTipo: con,
        funcionDOS: resetear,
        asignaciones,
    })

    return (
        <div className="flex flex-col gap-6">
            <EditarCategoriasEspeciales {...crearPaquete("ULTIMO", "Ultimas Tortas", ultimos)}></EditarCategoriasEspeciales>
            <EditarCategoriasEspeciales {...crearPaquete("TENDENCIA", "Ultimas Tendencias", tendencia)}></EditarCategoriasEspeciales>
            <EditarCategoriasEspeciales {...crearPaquete("DESTACADO", "Tortas Destacadas del Mes", destacado)}></EditarCategoriasEspeciales>
        </div>
    )
}
