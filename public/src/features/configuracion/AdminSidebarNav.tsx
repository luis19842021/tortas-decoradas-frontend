"use client"
import { useEffect, useState } from "react";
import { ChevronDown, GalleryHorizontal, Package, Star, CalendarRange, Candy, CakeSlice, Percent, Users, LucideIcon } from "lucide-react";

interface SubSeccion {
    id: string
    titulo: string
}

interface Seccion {
    id: string
    titulo: string
    Icono: LucideIcon
    subSecciones?: SubSeccion[]
}

const secciones: Seccion[] = [
    { id: "carrusel", titulo: "Editar Carrusel", Icono: GalleryHorizontal },
    { id: "productos", titulo: "Gestionar Productos", Icono: Package },
    {
        id: "categorias-especiales", titulo: "Categorías Especiales", Icono: Star, subSecciones: [
            { id: "categoria-ultimo", titulo: "Últimas tortas" },
            { id: "categoria-tendencia", titulo: "Tendencias" },
            { id: "categoria-destacado", titulo: "Destacadas del mes" },
        ]
    },
    { id: "sabores", titulo: "Sabores / Rellenos", Icono: Candy },
    { id: "bizcochuelo", titulo: "Bizcochuelo", Icono: CakeSlice },
    { id: "precios", titulo: "Ajustar precios", Icono: Percent },
    { id: "agenda", titulo: "Configuración de Agenda", Icono: CalendarRange },
    { id: "perfiles", titulo: "Administración de perfiles", Icono: Users },
]

export default function AdminSidebarNav() {
    const [activa, setActiva] = useState(secciones[0].id)
    const [abierto, setAbierto] = useState(false)

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiva(entry.target.id)
                    }
                })
            },
            { rootMargin: "0px 0px -70% 0px" }
        )

        const elementos = secciones
            .map((seccion) => document.getElementById(seccion.id))
            .filter((el): el is HTMLElement => el !== null)

        elementos.forEach((el) => observer.observe(el))

        return () => observer.disconnect()
    }, [])

    const seccionActiva = secciones.find((s) => s.id === activa) ?? secciones[0]

    return (
        <>
            <div className="lg:hidden sticky top-2 z-30 mx-3 mt-3 mb-3">
                <button type="button" onClick={() => setAbierto((previo) => !previo)}
                    className="flex items-center justify-between w-full bg-white rounded-2xl shadow-md px-4 py-3 text-sm font-semibold text-gray-700">
                    <span className="flex items-center gap-2">
                        <seccionActiva.Icono size={18} className="text-blue-700" />
                        {seccionActiva.titulo}
                    </span>
                    <ChevronDown size={18} className={`transition-transform ${abierto ? "rotate-180" : ""}`} />
                </button>
                {abierto && (
                    <ul className="flex flex-col gap-1 bg-white rounded-2xl shadow-md p-3 mt-2">
                        {secciones.map((seccion) => (
                            <li key={seccion.id}>
                                <a href={`#${seccion.id}`} onClick={() => setAbierto(false)}
                                    className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-colors ${activa === seccion.id
                                        ? "bg-blue-100 text-blue-700"
                                        : "text-gray-500 hover:bg-gray-100"
                                        }`}>
                                    <seccion.Icono size={18} />
                                    {seccion.titulo}
                                </a>
                                {seccion.subSecciones && (
                                    <ul className="flex flex-col gap-1 mt-1 ml-9">
                                        {seccion.subSecciones.map((sub) => (
                                            <li key={sub.id}>
                                                <a href={`#${sub.id}`} onClick={() => setAbierto(false)}
                                                    className="block rounded-lg px-3 py-1.5 text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-700">
                                                    {sub.titulo}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <div className="hidden lg:block w-56 shrink-0 self-stretch bg-white rounded-l-2xl shadow-md">
                <nav className="sticky top-6 p-3">
                    <p className="px-4 pb-2 text-xs font-bold text-gray-400 uppercase tracking-wide">Secciones</p>
                    <ul className="flex flex-col gap-1">
                        {secciones.map((seccion) => (
                            <li key={seccion.id}>
                                <a href={`#${seccion.id}`}
                                    className={`flex items-center gap-2 rounded-xl border-l-4 px-3 py-2 text-sm font-semibold transition-colors ${activa === seccion.id
                                        ? "bg-blue-100 border-blue-600 text-blue-700"
                                        : "border-transparent text-gray-500 hover:bg-gray-100"
                                        }`}>
                                    <seccion.Icono size={18} className={activa === seccion.id ? "text-blue-700" : "text-gray-400"} />
                                    {seccion.titulo}
                                </a>
                                {seccion.subSecciones && (
                                    <ul className="flex flex-col gap-1 mt-1 mb-1 ml-7">
                                        {seccion.subSecciones.map((sub) => (
                                            <li key={sub.id}>
                                                <a href={`#${sub.id}`}
                                                    className="block rounded-lg px-3 py-1.5 text-xs font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700">
                                                    {sub.titulo}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </>
    )
}
