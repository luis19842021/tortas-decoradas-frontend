"use client"

import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { descargarNotaCredito, notaCreditoExiste, subirNotaCredito } from "./api";

export default function NotaCreditoPedidoAdmin({ idPedido, montoADevolver }: { idPedido: number; montoADevolver: number | null }) {
    const [existe, setExiste] = useState<boolean | null>(null)
    const [subiendo, setSubiendo] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        setExiste(null)
        notaCreditoExiste(idPedido).then(setExiste).catch(() => setExiste(false))
    }, [idPedido])

    const elegirArchivo = async (archivo: File | undefined) => {
        if (!archivo) return
        if (archivo.type !== "application/pdf") {
            toast.warning("El archivo tiene que ser un PDF")
            return
        }
        if (archivo.size > 5 * 1024 * 1024) {
            toast.warning("El PDF no puede superar los 5 MB")
            return
        }
        setSubiendo(true)
        try {
            await subirNotaCredito(idPedido, archivo)
            setExiste(true)
            toast.success("Nota de crédito cargada y enviada al cliente")
        } catch (error) {
            toast.warning(error instanceof Error ? error.message : "No se pudo cargar la nota de crédito")
        } finally {
            setSubiendo(false)
            if (inputRef.current) inputRef.current.value = ""
        }
    }

    const verNota = async () => {
        try {
            await descargarNotaCredito(idPedido)
        } catch {
            toast.warning("No se pudo abrir la nota de crédito")
        }
    }

    return (
        <div className="mt-4 border-t border-gray-200 pt-3 flex flex-col gap-2">
            <p className="text-gray-700 font-semibold">Nota de crédito</p>
            {montoADevolver != null && montoADevolver > 0 && (
                <p className="text-gray-500 text-sm">Monto devuelto: ${montoADevolver.toLocaleString("es-AR")}. Emití la nota de crédito en ARCA por ese importe, asociada a la factura original.</p>
            )}
            {existe && (
                <p className="text-emerald-700 text-sm">
                    Ya cargada y enviada al cliente.{" "}
                    <button type="button" onClick={verNota} className="underline cursor-pointer">Ver PDF</button>
                </p>
            )}
            <input ref={inputRef} type="file" accept="application/pdf" className="hidden"
                onChange={(e) => elegirArchivo(e.target.files?.[0])} />
            <button type="button" disabled={subiendo || existe === null}
                onClick={() => inputRef.current?.click()}
                className="w-full h-10 rounded-xl bg-cyan-700 hover:bg-cyan-800 disabled:opacity-50 text-white font-semibold cursor-pointer">
                {subiendo ? "Enviando..." : existe ? "Reemplazar y reenviar nota de crédito (PDF)" : "Subir nota de crédito (PDF) y enviar al cliente"}
            </button>
        </div>
    )
}
