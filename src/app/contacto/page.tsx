"use client";
import { useState } from "react";
import Link from "next/link";
import { oi } from "../ui/fonts";
import { FaWhatsapp, FaInstagram, FaFacebookF, FaTiktok, FaMapMarkerAlt } from "react-icons/fa";

const WHATSAPP = "5491121804172";
const REDES = [
    {
        nombre: "Instagram",
        usuario: "Colores_tortas_decoradas",
        href: "https://www.instagram.com/Colores_tortas_decoradas",
        color: "bg-[#c13584]",
        Icono: FaInstagram,
    },
    {
        nombre: "TikTok",
        usuario: "@colorestortasdecoradas",
        href: "https://www.tiktok.com/@colorestortasdecoradas",
        color: "bg-black",
        Icono: FaTiktok,
    },
    {
        nombre: "Facebook",
        usuario: "Colores_tortas_decoradas",
        href: "https://www.facebook.com/Colores_tortas_decoradas",
        color: "bg-[#1877f2]",
        Icono: FaFacebookF,
    },
];

const PASOS = [
    { titulo: "Elegí tu torta", texto: "Mirá el catálogo y armá tu torta: tamaño, bizcochuelo y rellenos." },
    { titulo: "Elegí la fecha", texto: "En el checkout ves en el calendario qué días de entrega están disponibles." },
    { titulo: "Retiro o envío", texto: "Retirás en el local (Almagro) o calculás el envío a tu domicilio." },
    { titulo: "Pagá online", texto: "Pagás con Mercado Pago y recibís la confirmación por mail." },
];

export default function Contacto() {
    const [nombre, setNombre] = useState("");
    const [mensaje, setMensaje] = useState("");

    const enviarPorWhatsapp = (e: React.FormEvent) => {
        e.preventDefault();
        const texto = `Hola! Soy ${nombre.trim()}. ${mensaje.trim()}`;
        window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(texto)}`, "_blank", "noopener,noreferrer");
    };

    const completo = nombre.trim() !== "" && mensaje.trim() !== "";

    return (
        <div className="w-full">
            <div className="flex flex-col justify-center items-center mt-5 md:mt-12 w-full py-6 bg-blue-200 px-4 text-center">
                <h1 className={`${oi.className} text-gray-600 text-3xl md:text-5xl`}>Contacto</h1>
                <p className="text-cyan-900 mt-2 max-w-xl">
                    ¿Una torta para una fecha especial? Escribinos y la diseñamos juntos.
                </p>
            </div>

            <div className="max-w-5xl mx-auto w-full px-3 sm:px-4 py-8 grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
                <div className="bg-blue-100 rounded-2xl p-4 sm:p-6 shadow-md">
                    <h2 className={`${oi.className} text-xl sm:text-2xl text-cyan-900 mb-1`}>Escribinos</h2>
                    <p className="text-sm text-gray-600 mb-4">
                        Completá tu consulta y te abrimos WhatsApp con el mensaje listo para enviar.
                    </p>

                    <form onSubmit={enviarPorWhatsapp} className="flex flex-col gap-3">
                        <label className="flex flex-col gap-1 text-sm font-semibold text-cyan-900">
                            Tu nombre
                            <input
                                type="text"
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                                maxLength={60}
                                placeholder="Ej: María"
                                className="bg-white border-2 border-cyan-200 focus:border-cyan-500 outline-none rounded-xl px-3 py-2 font-normal text-gray-800"
                            />
                        </label>
                        <label className="flex flex-col gap-1 text-sm font-semibold text-cyan-900">
                            Tu consulta
                            <textarea
                                value={mensaje}
                                onChange={(e) => setMensaje(e.target.value)}
                                maxLength={500}
                                rows={5}
                                placeholder="Contanos qué torta tenés en mente, para qué fecha y cuántas porciones."
                                className="bg-white border-2 border-cyan-200 focus:border-cyan-500 outline-none rounded-xl px-3 py-2 font-normal text-gray-800 resize-none"
                            />
                        </label>
                        <button
                            type="submit"
                            disabled={!completo}
                            className={`flex items-center justify-center gap-2 h-12 rounded-2xl text-white font-semibold text-lg ${completo
                                    ? "bg-[#128c7e] hover:bg-[#0f7a6e] cursor-pointer"
                                    : "bg-gray-400 cursor-not-allowed"
                                }`}
                        >
                            <FaWhatsapp size={22} />
                            Enviar por WhatsApp
                        </button>
                    </form>
                </div>

                <div className="flex flex-col gap-5 sm:gap-6">
                    <div className="bg-[#bddbe8] rounded-2xl p-4 sm:p-6 shadow-md">
                        <h2 className={`${oi.className} text-xl sm:text-2xl text-cyan-900 mb-3`}>
                            Dónde encontrarnos
                        </h2>

                        <a
                            href={`https://wa.me/${WHATSAPP}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 bg-white border-2 border-cyan-200 hover:border-cyan-500 rounded-2xl p-3 mb-3 transition-colors"
                        >
                            <span className="flex items-center justify-center h-11 w-11 rounded-full bg-[#128c7e] text-white shrink-0">
                                <FaWhatsapp size={22} />
                            </span>
                            <span className="min-w-0">
                                <span className="block text-xs uppercase tracking-wide text-cyan-700 font-semibold">
                                    WhatsApp
                                </span>
                                <span className="block text-lg font-bold text-cyan-900">1121804172</span>
                            </span>
                        </a>

                        <div className="flex items-center gap-3 bg-white border-2 border-cyan-200 rounded-2xl p-3">
                            <span className="flex items-center justify-center h-11 w-11 rounded-full bg-cyan-500 text-white shrink-0">
                                <FaMapMarkerAlt size={20} />
                            </span>
                            <span>
                                <span className="block text-xs uppercase tracking-wide text-cyan-700 font-semibold">
                                    Retiro en el local
                                </span>
                                <span className="block text-lg font-bold text-cyan-900">Almagro, CABA</span>
                            </span>
                        </div>
                    </div>

                    <div className="bg-blue-100 rounded-2xl p-4 sm:p-6 shadow-md">
                        <h2 className={`${oi.className} text-xl sm:text-2xl text-cyan-900 mb-3`}>
                            Seguinos en redes
                        </h2>
                        <div className="flex flex-col gap-3">
                            {REDES.map(({ nombre: red, usuario, href, color, Icono }) => (
                                <a
                                    key={red}
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 bg-white border-2 border-cyan-200 hover:border-cyan-500 rounded-2xl p-3 transition-colors"
                                >
                                    <span className={`flex items-center justify-center h-11 w-11 rounded-full text-white shrink-0 ${color}`}>
                                        <Icono size={20} />
                                    </span>
                                    <span className="min-w-0 break-words">
                                        <span className="block text-xs uppercase tracking-wide text-cyan-700 font-semibold">
                                            {red}
                                        </span>
                                        <span className="block font-bold text-cyan-900">{usuario}</span>
                                    </span>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-2 bg-[#0f98c5] rounded-2xl p-4 sm:p-6 text-white shadow-md">
                    <h2 className={`${oi.className} text-xl sm:text-2xl mb-4`}>¿Cómo comprar?</h2>
                    <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {PASOS.map((paso, i) => (
                            <li key={paso.titulo} className="flex gap-3">
                                <span className="flex items-center justify-center h-9 w-9 rounded-full bg-white text-[#0f98c5] font-bold shrink-0">
                                    {i + 1}
                                </span>
                                <span>
                                    <span className="block font-semibold">{paso.titulo}</span>
                                    <span className="block text-sm text-white/90">{paso.texto}</span>
                                </span>
                            </li>
                        ))}
                    </ol>
                    <div className="mt-5 flex justify-center">
                        <Link
                            href="/productos?categoria=TORTAS&tipo=TORTA"
                            className="bg-[#09c99f] hover:bg-[#07a88a] text-white font-semibold px-6 py-2 rounded-full"
                        >
                            Ver tortas
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
