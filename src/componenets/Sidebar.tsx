"use client";
import React, { useEffect, useState } from 'react'
import Link from "next/link";
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Fechas from './Fechas';
import { useSesionUsuario } from '@/features/auth/useSesionUsuario';
import { cerrarSesion } from '@/features/auth/auth';

interface Props {
    categorias?: { cat: string; tipo: string }[]
}

export default function Sidebar({ categorias = [] }: Props) {

    const [open, setOpen] = useState(false)
    const sesion = useSesionUsuario()
    const [abierto, setAbierto] = useState(false)
    const router = useRouter()
    const [productosAbierto, setProductosAbierto] = useState(false)

    useEffect(() => {
        const consulta = window.matchMedia('(min-width: 768px)')
        const alCambiar = (e: MediaQueryListEvent | MediaQueryList) => {
            if (e.matches) {
                setOpen(false)
                setAbierto(false)
                setProductosAbierto(false)
            }
        }
        alCambiar(consulta)
        consulta.addEventListener('change', alCambiar)
        return () => consulta.removeEventListener('change', alCambiar)
    }, [])

    const irACategoria = (categoria: { cat: string; tipo: string }) => {
        setOpen(false)
        setProductosAbierto(false)
        router.push(
            "/productos?categoria=" + categoria.cat.toUpperCase().replace(/[\s/]/g, "")
            + "&tipo=" + categoria.tipo.toUpperCase().replace(/[\s/]/g, "")
        )
    }

    const handleCerrarSesion = () => {
        cerrarSesion()
        setOpen(false)
        router.push('/')
    }

    return (
        <div className="bg-mio h-12 w-12 border-2  border-white  rounded-full " >

            <button className='cursor-pointer' onClick={() => setOpen(true)}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 22 22" className=" ml-0.5 mt-0.5 size-9
                 stroke-black">
                    <path d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5" />
                </svg>
            </button>

            <div className={`${!open && "hidden"} bg-gray-600/50 min-h-screen w-full fixed top-0 left-0 right-0 backdrop-blur-sm`} onClick={() => setOpen(false)}></div>

            <div className={`${open ? "w-80" : "w-0"}  bg-cyan-600 min-h-screen max-h-screen overflow-y-auto fixed top-0 left-0 transition-[width] duration-300 z-80`}>

                <div className={`${!open && "hidden"} pt-3`}>

                    <button className='ml-4 text-white mb-14 cursor-pointer' onClick={() => setOpen(false)}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                    <div className='flex justify-center items-center mr-8 gap-2 text-white pb-2'>
                        {sesion == null &&
                            <Image
                                src="/usuario.png"
                                width={50}
                                height={50}
                                alt="usuario"
                                className=''
                            ></Image>
                        }

                        {sesion != null
                            ? <div className='flex items-center gap-2'>
                                <div className='w-11 h-11 shrink-0 rounded-full bg-white/20 border-2 border-white/70 flex items-center justify-center font-bold text-lg'>
                                    {sesion.nombreMostrado.trim().charAt(0).toUpperCase() || "?"}
                                </div>
                                <span className='truncate max-w-48 font-semibold'>{sesion.nombreMostrado}</span>
                            </div>
                            :
                            <div className='flex gap-1'>
                                <div className='' onClick={() => setOpen(false)}> <Link href='/login'>Iniciar sesion</Link></div>
                                <div className=''>|</div>
                                <div className='' onClick={() => setOpen(false)}> <Link href='/registro'>Registrarse</Link></div>
                            </div>
                        }

                    </div>

                    <div className='text-center text-white text-xl hover:bg-orange-400 cursor-pointer py-3 mb-2' onClick={() => setOpen(false)}><Link href='/'>INICIO</Link></div>
                    <div className='text-center text-white text-xl hover:bg-orange-400 cursor-pointer py-3 mb-2 select-none' onClick={() => setProductosAbierto(!productosAbierto)}>
                        PRODUCTOS <span className={`inline-block text-base transition-transform ${productosAbierto ? "rotate-180" : ""}`}>▾</span>
                    </div>
                    {productosAbierto && (
                        <div className='bg-cyan-800/40 mb-2 py-1'>
                            {categorias.map((categoria) => (
                                <div
                                    key={categoria.cat}
                                    className='text-center text-white text-lg hover:bg-orange-400 cursor-pointer py-2'
                                    onClick={() => irACategoria(categoria)}
                                >
                                    {categoria.cat}
                                </div>
                            ))}
                        </div>
                    )}
                    <div className='text-center text-naja text-xl hover:bg-orange-400 cursor-pointer py-3 mb-2' onClick={() => { setOpen(false), setAbierto(true) }}>

                        Fechas disponibles

                    </div>
                    <div className='text-center text-white text-xl hover:bg-orange-400 cursor-pointer py-3 mb-2' onClick={() => setOpen(false)}><Link href='/nosotros'>NOSOTROS</Link></div>
                    <div className='text-center text-white text-xl hover:bg-orange-400 cursor-pointer py-3 mb-2' onClick={() => setOpen(false)}><Link href='/contacto'>CONTACTO</Link></div>

                    {sesion != null && (
                        <div className='border-t border-white/40 mt-2 pt-2 pb-6'>
                            {sesion.esAdmin ? (
                                <div className='text-center text-white text-xl hover:bg-orange-400 cursor-pointer py-3 mb-2' onClick={() => setOpen(false)}><Link href='/configuracionesAdmi'>CONFIGURACIONES</Link></div>
                            ) : (
                                <div className='text-center text-white text-xl hover:bg-orange-400 cursor-pointer py-3 mb-2' onClick={() => setOpen(false)}><Link href='/historial'>MIS COMPRAS</Link></div>
                            )}
                            <div className='text-center text-white text-xl hover:bg-orange-400 cursor-pointer py-3 mb-2' onClick={() => setOpen(false)}><Link href='/perfil'>MI PERFIL</Link></div>
                            <button type='button' className='w-full text-center text-white text-xl hover:bg-red-500 cursor-pointer py-3 mb-2' onClick={handleCerrarSesion}>CERRAR SESIÓN</button>
                        </div>
                    )}
                </div>
            </div>

            <div >

                <div className={`${!abierto && "hidden"} bg-gray-600/50 h-full w-full fixed top-0 left-0 z-70 right-0 backdrop-blur-sm`} onClick={() => setAbierto(false)}></div>

                <div className={`${!abierto && "hidden"} bg-[#bddbe8] rounded-t-2xl w-105 max-w-[calc(100vw-1.5rem)] fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-70 overflow-hidden`}>

                    <div className={`${!abierto && "hidden"} h-105 `}>
                        <Fechas key={abierto ? "abierto" : "cerrado"}></Fechas>
                    </div>

                    <div className={`${!abierto && "hidden"} bg-amber-50 mt-4 py-6 min-h-24 rounded-b-2xl flex flex-wrap items-center justify-center gap-x-6 gap-y-2 px-4 text-sm font-medium text-cyan-900`}>
                        <span className='flex items-center gap-2'>
                            <span className='h-4 w-4 rounded-full bg-[#02831e] inline-block'></span>
                            Disponible
                        </span>
                        <span className='flex items-center gap-2'>
                            <span className='h-4 w-4 rounded-full bg-[#deb71d] inline-block'></span>
                            Poca disponibilidad
                        </span>
                        <span className='flex items-center gap-2'>
                            <span className='h-4 w-4 rounded-full bg-[#f03869] inline-block'></span>
                            Sin cupo
                        </span>
                        <div className='basis-full flex justify-center pt-2'>
                            <button
                                type='button'
                                onClick={() => setAbierto(false)}
                                className='bg-[#0f98c5] hover:bg-[#0c7fa5] text-white font-semibold px-8 py-2 rounded-full cursor-pointer'
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>

                </div>

            </div>
        </div>

    )
}
