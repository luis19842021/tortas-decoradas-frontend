"use client"
import { Producto } from "@/app/interfaces/producto.interface";
import BloqueAlergenos from "./BloqueAlergenos";
import { useAlergenosTorta } from "./alergenosTortaStore";

interface Props {
    producto: Producto
    className?: string
}

export default function AlergenosFicha({ producto, className }: Props) {
    const { idProducto, alergenos } = useAlergenosTorta()
    const esTorta = producto.tipoDeProducto?.tipo == "TORTA"
    const lista = esTorta && idProducto === producto.idProducto ? alergenos : producto.alergenos

    const hayDatos = (lista ?? []).length > 0 || (producto.trazas ?? []).length > 0
        || (producto.ingredientes ? String(producto.ingredientes).trim() !== "" : false)

    return (
        <BloqueAlergenos ingredientes={producto.ingredientes} alergenos={lista} trazas={producto.trazas}
            className={className}
            nota={esTorta && hayDatos ? "Se actualiza según los rellenos y bizcochuelos que elijas." : undefined} />
    )
}
