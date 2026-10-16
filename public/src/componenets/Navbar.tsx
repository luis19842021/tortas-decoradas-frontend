"use client";
import React, { useEffect, useState } from 'react'
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from '@/app/ui/nav.module.css';
import Image from 'next/image';
import { oi } from '@/app/ui/fonts';
import Sidebar from "./Sidebar";
import Search from "./Search";
import SearchCelular from "./SearchCelular";
import Calendario from './Calendario';
import AvatarUsuario from '@/features/auth/AvatarUsuario';
import { useSesionUsuario } from '@/features/auth/useSesionUsuario';
import { useCarrito } from '@/features/carrito/useCarrito';
import { CARRITO_TOGGLE_EVENT } from '@/features/carrito/carrito';
import { getCategoriasDisponibles } from '@/features/productos/api';

const CATEGORIAS_FALLBACK = [
    { cat: "Tortas", tipo: "TORTA" },
    { cat: "Cupcakes", tipo: "CUPCAKE" },
    { cat: "Cake Pops", tipo: "CAKEPOPS" },
    { cat: "MiniDonas", tipo: "MINIDONAS" },
    { cat: "Desayunos", tipo: "VARIADO" },
    { cat: "Oreos Bañadas", tipo: "OREOS" },
    { cat: "Paletas", tipo: "PALETAS" },
    { cat: "Cookies", tipo: "GALLETA" },
    { cat: "Mesas Dulces", tipo: "VARIADO" },
    { cat: "Catering Salado", tipo: "VARIADO" },
]

const NOMBRES_CATEGORIA: Record<string, string> = {
    TORTAS: "Tortas",
    CUPCAKES: "Cupcakes",
    CAKEPOPS: "Cake Pops",
    MINIDONAS: "MiniDonas",
    DESAYUNOS: "Desayunos",
    OREOSBAÑADAS: "Oreos Bañadas",
    PALETAS: "Paletas",
    COOKIES: "Cookies",
    MESASDULCES: "Mesas Dulces",
    CATERINGSALADO: "Catering Salado",
}

const ORDEN_CATEGORIAS = Object.keys(NOMBRES_CATEGORIA)

export default function Navbar() {
    const [categorias, setCategorias] = useState(CATEGORIAS_FALLBACK)
    const [openCat, setOpenCat] = useState<Boolean>(false)
    const CatRef = React.useRef<HTMLDivElement>(null)
    const router = useRouter()

    const sesion = useSesionUsuario()
    const itemsCarrito = useCarrito()

    useEffect(() => {
        let cancelado = false

        getCategoriasDisponibles()
            .then((disponibles) => {
                if (cancelado || disponibles.length === 0) return

                const porCategoria = new Map(disponibles.map((d) => [d.categoria, d.tipo]))

                const enOrdenConocido = ORDEN_CATEGORIAS
                    .filter((cat) => porCategoria.has(cat))
                    .map((cat) => ({ cat: NOMBRES_CATEGORIA[cat], tipo: porCategoria.get(cat)! }))

                const conocidas = new Set(ORDEN_CATEGORIAS)
                const desconocidas = disponibles
                    .filter((d) => !conocidas.has(d.categoria))
                    .map((d) => ({ cat: d.categoria, tipo: d.tipo }))

                setCategorias([...enOrdenConocido, ...desconocidas])
            })
            .catch((error) => {
                console.error("No se pudo cargar la lista de categorías desde la base, se usa el fallback:", error)
            })

        return () => {
            cancelado = true
        }
    }, [])

    useEffect(() => {
        const listener = (event: MouseEvent) => {

            if (!CatRef.current || !CatRef.current!.contains(event.target as Node)) {
                setOpenCat(false)
                console.log("click afuera")
            }

        };

        document.addEventListener('mousedown', listener);

    }, []);

    const abrir = () => {
        if (openCat == false) {
            setOpenCat(true)
        } else { setOpenCat(false) }
    }

    const cerrar = () => {

        setOpenCat(false)
    }

    const redireccionar = (ruta: string) => {
        router.push(ruta);
    }
    return (

        <nav className="w-full">

            <div className={`${styles.topnav} flex justify-center items-center w-full h-35`}>

                <div className=" w-65 lg:w-60">
                    <h1 className=" ">
                        <Image
                            src="/Colores.png"
                            width={200}
                            height={52}
                            alt="logo colores tortas decoradas"
                        />
                    </h1>
                </div>
                <div className="z-30 hidden lg:block lg:w-150 mr-8">

                    < Search ></Search>

                </div>

                <div className='hidden lg:flex justify-center items-center lg:w-60 h-35'>
                    {
                        sesion == null ?
                            <div className='flex justify-center gap-2'>
                                <div className='bg-pink-200 hover:bg-pink-300 flex justify-center rounded-2xl h-8 items-center p-2 font-serif text-gray-700  '>
                                    <Link href='/login' >Iniciar sesion</Link>
                                </div>
                                <div className='bg-pink-200 hover:bg-pink-300 flex justify-center rounded-2xl h-8 items-center p-2 font-serif text-gray-700  '>
                                    <Link href='/registro'>Registrarse</Link>
                                </div>
                            </div>
                            :

                            <div className="flex items-center ">

                                <AvatarUsuario nombre={sesion.nombreMostrado} esAdmin={sesion.esAdmin} />

                                {!sesion.esAdmin && (
                                    <div className=" pl-10 relative">

                                        <button
                                            type="button"
                                            onClick={() => window.dispatchEvent(new Event(CARRITO_TOGGLE_EVENT))}
                                            className="cursor-pointer relative"
                                            title="Carrito"
                                        >
                                            <Image
                                                src="/carrito.png"
                                                width={60}
                                                height={60}
                                                alt="carrito de compras"
                                            />
                                            {itemsCarrito.length > 0 && (
                                                <span className="absolute -top-1 -right-1 bg-naja text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                                    {itemsCarrito.length}
                                                </span>
                                            )}
                                        </button>

                                    </div>
                                )}

                            </div>
                    }

                </div>
                <div>
                    <div className={`md:invisible md:h-0 md:w-0 z-80`}>
                        <Sidebar categorias={categorias}></Sidebar>
                    </div>
                </div>

            </div>

            <div className=" flex lg:hidden justify-center w-full h-[70] bg-mio  " >
                <div className="z-30 relative top-2 ">
                    <SearchCelular ></SearchCelular>
                </div>

            </div>

            <div className="hidden lg:flex justify-center lg:h-[70] bg-mio ">
                <ul className={`${styles.lista} ${oi.className} flex items-center relative text-xl `}>
                    <li><Link href='/'><span className=" lg:mx-10 xl:mx-18 ">INICIO</span></Link></li>

                    <div ref={CatRef} className=" relative group">

                        <div ><li><span onClick={() => abrir()} className="lg:mx-10 xl:mx-16 cursor-pointer">PRODUCTOS</span></li> </div>

                        <div className={`absolute  z-15 top-12 left-14 bg-white border rounded shadow-lg w-80  ${openCat == false ? "hidden" : ""}  `}>
                            <ul>

                                {categorias.map((categoria, slideIndex) => (
                                    <li key={slideIndex} onClick={() => cerrar()} className={`block px-4 w-full py-2  hover:bg-red-100  `}  >
                                        <div className={``} onClick={() => redireccionar(
                                            "/productos?categoria=" + categoria.cat.toUpperCase().replace(/[\s/]/g, "")
                                            + "&tipo=" + categoria.tipo.toUpperCase().replace(/[\s/]/g, ""))}>
                                            {categoria.cat}
                                        </div>
                                    </li>
                                ))}

                            </ul>
                        </div>
                    </div>

                </ul>
                <div className=' flex items-center ' >
                    <Calendario ></Calendario></div>

                <ul className={`${styles.lista} ${oi.className} flex items-center relative text-xl `}>
                    <li><Link href='/nosotros'><span className=" lg:mx-10 xl:mx-16 ">NOSOTROS</span></Link></li>
                    <li><Link href='/contacto'><span className=" lg:mx-10 xl:mx-16 ">CONTACTO</span></Link></li>
                </ul>

            </div>

        </nav>

    )
}
