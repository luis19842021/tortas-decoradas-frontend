import { oi } from "@/app/ui/fonts";
import CalculadorDeEnvio from "@/componenets/calculadorDeEnvio";

interface FormaDeEnvioProps {
    className: string
}

export default function FormaDeEnvio({ className }: FormaDeEnvioProps) {
    return (
        <div className={className}>
            <div>
                <h2 className={`font-bold text-2xl underline text-cyan-900 ${oi.className} pt-4 pl-4`}>Forma de Envío :</h2>
            </div>
            <div className="pl-4 pt-2">

                <p className="text-lg text-gray-700 font-semibold pt-4 pr-4 underline" >
                    -Retiro en punto de entrega (Almagro CABA)
                </p>

                <p className="pl-2 text-lg text-gray-700 pr-6">
                    coordinaras con nosotros el horario de retiro en la fecha reservada
                    mediante whatsapp o correo electrónico.
                </p>
                <p className="text-lg text-gray-700 pt-4 pr-4 font-semibold underline" >
                    -Envío a domicilio
                </p>
                <p className="pl-2 text-lg text-gray-700 pr-6">
                    coordinaras con nosotros el horario de entrega en la fecha reservada
                    mediante whatsapp o correo electrónico.
                </p>

                <p className="text-lg text-gray-700 pt-4 pl-1 font-semibold underline">
                    El costo del envio se agrega finalizando la compra.</p>

                <CalculadorDeEnvio />
            </div>
        </div>
    )
}
