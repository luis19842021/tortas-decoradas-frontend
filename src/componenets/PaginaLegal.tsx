import Link from "next/link";
import type { ReactNode } from "react";
import { oi } from "@/app/ui/fonts";
import {
    ACTUALIZADO,
    CUIT,
    DOMICILIO,
    EMAIL_CONTACTO,
    NEGOCIO,
    TITULAR,
    WHATSAPP_LINK,
    WHATSAPP_VISIBLE,
} from "@/utils/datosLegales";

const ENLACES = [
    { href: "/terminos", texto: "Términos y condiciones" },
    { href: "/privacidad", texto: "Política de privacidad" },
    { href: "/cambios-y-devoluciones", texto: "Cambios y devoluciones" },
];

export function Seccion({ titulo, children }: { titulo: string; children: ReactNode }) {
    return (
        <section className="flex flex-col gap-2">
            <h2 className={`${oi.className} text-xl sm:text-2xl text-cyan-900`}>{titulo}</h2>
            <div className="flex flex-col gap-2 text-gray-700 leading-relaxed">{children}</div>
        </section>
    );
}

export function DatosTitular() {
    return (
        <ul className="list-disc pl-6 flex flex-col gap-1">
            <li>Nombre comercial: {NEGOCIO}</li>
            {TITULAR && <li>Titular: {TITULAR}</li>}
            {CUIT && <li>CUIT: {CUIT}</li>}
            <li>Domicilio: {DOMICILIO}</li>
            {EMAIL_CONTACTO && (
                <li>
                    Correo electrónico:{" "}
                    <a className="underline text-cyan-800" href={`mailto:${EMAIL_CONTACTO}`}>
                        {EMAIL_CONTACTO}
                    </a>
                </li>
            )}
            <li>
                WhatsApp:{" "}
                <a
                    className="underline text-cyan-800"
                    href={`https://wa.me/${WHATSAPP_LINK}`}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {WHATSAPP_VISIBLE}
                </a>
            </li>
        </ul>
    );
}

export default function PaginaLegal({
    titulo,
    subtitulo,
    children,
}: {
    titulo: string;
    subtitulo: string;
    children: ReactNode;
}) {
    return (
        <div className="w-full">
            <div className="flex flex-col justify-center items-center mt-5 md:mt-12 w-full py-6 bg-blue-200 px-4 text-center">
                <h1 className={`${oi.className} text-gray-600 text-3xl md:text-5xl`}>{titulo}</h1>
                <p className="text-cyan-900 mt-2 max-w-xl">{subtitulo}</p>
            </div>

            <div className="max-w-4xl mx-auto w-full px-3 sm:px-4 py-8">
                <article className="bg-white rounded-2xl p-5 sm:p-8 shadow-md flex flex-col gap-6">
                    <p className="text-sm text-gray-500">Última actualización: {ACTUALIZADO}</p>
                    {children}
                </article>

                <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-6 text-cyan-900">
                    {ENLACES.map(({ href, texto }) => (
                        <Link key={href} href={href} className="underline">
                            {texto}
                        </Link>
                    ))}
                </nav>
            </div>
        </div>
    );
}
