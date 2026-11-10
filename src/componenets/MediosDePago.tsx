import { FaCreditCard, FaLock, FaWallet } from "react-icons/fa";
import { oi } from "@/app/ui/fonts";

interface MediosDePagoProps {
    className: string
}

export default function MediosDePago({ className }: MediosDePagoProps) {
    return (
        <div className={className}>
            <h2 className={`font-bold text-2xl underline text-cyan-900 ${oi.className} pt-4 pl-4`}>Medios de Pago :</h2>
            <div className="pl-4 pt-2 pr-4">
                <p className="text-lg text-gray-700 font-semibold pt-2 underline">
                    -Mercado Pago
                </p>
                <p className="pl-2 text-lg text-gray-700">
                    Pagás online al finalizar la compra, de forma rápida y segura, con:
                </p>
                <div className="flex flex-wrap gap-2 pl-2 pt-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white text-cyan-900 text-sm font-medium px-3 py-1">
                        <FaCreditCard size={13} /> Tarjeta de crédito
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white text-cyan-900 text-sm font-medium px-3 py-1">
                        <FaCreditCard size={13} /> Tarjeta de débito
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white text-cyan-900 text-sm font-medium px-3 py-1">
                        <FaWallet size={13} /> Dinero en cuenta
                    </span>
                </div>
                <p className="flex items-start gap-2 pl-2 pt-3 text-base text-gray-600">
                    <FaLock size={14} className="mt-1 shrink-0" />
                    <span>
                        Al finalizar la compra te llevamos al sitio de Mercado Pago para completar el pago.
                        No se aceptan pagos en efectivo.
                    </span>
                </p>
            </div>
        </div>
    )
}
