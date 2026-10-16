"use client";
import { oi } from '@/app/ui/fonts';
import React, { useState } from 'react'
import Fechas from './Fechas';

export default function Calendario() {

    const [abierto, setAbierto] = useState(false)

    return (
        <div >

            <span className={` ${oi.className}  text-naja lg:mx-10 xl:mx-16 text-xl `} onClick={() => setAbierto(true)}>Fechas Disponibles</span>

            <div className={`${!abierto && "hidden"} bg-gray-600/50 min-h-screen w-full fixed top-0 left-0 z-70 right-0 backdrop-blur-sm`} onClick={() => setAbierto(false)}>

            </div>

            <div className={`${!abierto && "hidden"} bg-[#bddbe8] rounded-t-2xl w-200 max-w-[calc(100vw-1.5rem)] fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-70 flex flex-col overflow-hidden`}>

                <div className={`${!abierto && "hidden"} h-105 w-full`}>
                    <Fechas key={abierto ? "abierto" : "cerrado"}></Fechas>
                </div>

                <div className={`${!abierto && "hidden"} bg-amber-50 mt-4 py-6 min-h-24 rounded-b-2xl w-full flex flex-wrap items-center justify-center gap-x-6 gap-y-2 px-4 text-sm font-medium text-cyan-900`}>
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
    )
}
