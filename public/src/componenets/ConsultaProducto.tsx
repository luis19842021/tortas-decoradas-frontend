"use client"

import { useState } from "react"
import { Mail } from "lucide-react"
import { EMAIL_CONTACTO } from "@/utils/datosLegales"

const WHATSAPP_NUMERO = "5491121804172"

const EMAIL_DESTINO = EMAIL_CONTACTO

interface Props {
    nombreProducto?: String
}

export default function ConsultaProducto({ nombreProducto }: Props) {
    const [mensaje, setMensaje] = useState("")

    const armarTexto = () => {
        const base = nombreProducto
            ? `Hola! Quería consultar sobre "${nombreProducto}".`
            : "Hola! Quería hacer una consulta."
        return mensaje.trim() ? `${base}\n\n${mensaje.trim()}` : base
    }

    const consultarPorWhatsapp = () => {
        const texto = armarTexto()
        const url = `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(texto)}`
        window.open(url, "_blank")
    }

    const consultarPorEmail = () => {
        const asunto = nombreProducto ? `Consulta sobre "${nombreProducto}"` : "Consulta"
        const cuerpo = armarTexto()
        // mailto abre la app de correo del dispositivo (Gmail en el celular) con asunto y cuerpo
        const url = `mailto:${EMAIL_DESTINO}?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(cuerpo)}`
        window.location.href = url
    }

    return (
        <div className="flex flex-col lg:flex-row px-4 lg:pr-0">

            <div className="w-full lg:w-auto">
                <textarea
                    value={mensaje}
                    onChange={(e) => setMensaje(e.target.value)}
                    className="block pl-2 pt-2 bg-white lg:ml-4 mt-4 w-full lg:w-180 h-28 rounded-md resize-none border-gray-300 shadow-sm focus:border-black  sm:text-sm"
                    placeholder="Escribe tu consulta aquí...">
                </textarea>
            </div>

            <div className="flex gap-3 lg:block lg:pl-10">
                <div className="pt-4 lg:pt-6 flex-1 min-w-0">
                    <button
                        onClick={consultarPorEmail}
                        className=" bg-[#0f98c5] h-10 w-full lg:w-50 rounded-2xl hover:bg-[#0d7fbf] cursor-pointer">

                        <div className="flex items-center justify-center">
                            <div className=" text-white font-medium  text-heading  text-base sm:text-xl mb-2.5 px-2 sm:px-4 py-1   ">Via Email </div>
                            <div className="mb-2" ><Mail className="text-white" />  </div>

                        </div>

                    </button>

                </div>

                <div className="pt-4 flex-1 min-w-0">

                    <button
                        onClick={consultarPorWhatsapp}
                        className="bg-[#09c99f] h-10 w-full lg:w-50 rounded-2xl hover:bg-[#07a88a] cursor-pointer">

                        <div className="flex items-center justify-center" >
                            <div className="text-white font-medium  text-heading  text-base sm:text-xl mb-2.5 px-2 sm:px-4 py-1   ">Via WhatsApp </div>
                            <div className="text-white font-medium  text-heading  text-xl mb-2 mr-2 "> <span className="[&>svg]:h-6 [&>svg]:w-5">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="currentColor"
                                    viewBox="0 0 448 512">

                                    <path
                                        d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7 .9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
                                </svg>
                            </span></div>
                        </div>

                    </button>

                </div>

            </div>

        </div>
    )
}
