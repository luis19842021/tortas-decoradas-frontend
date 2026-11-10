"use client";
import React, { useEffect, useState } from 'react'
import { BsChevronCompactLeft, BsChevronCompactRight } from 'react-icons/bs';
import { apiFetch } from "@/utils/apiFetch";

interface CupoPorFecha {
    total: number
    fecha_de_pedido: string
}

interface Props {
    seleccionable?: boolean
    fechaSeleccionada?: string | null
    onSeleccionarFecha?: (fecha: string) => void
}

export default function Fechas({ seleccionable = false, fechaSeleccionada = null, onSeleccionarFecha }: Props = {}) {

    const [pedidos, setPedidos] = useState<CupoPorFecha[]>([])

    const [cupoMaximoPorDia, setCupoMaximoPorDia] = useState<number>(3)

    const [diasBloqueados, setDiasBloqueados] = useState<Set<string>>(new Set())

    useEffect(() => {
        apiFetch("/pedidosPor")
            .then((res) => {
                if (!res.ok) throw new Error("No se pudieron obtener los cupos por fecha.")
                return res.json()
            })
            .then((data: CupoPorFecha[]) => setPedidos(data))
            .catch(() => setPedidos([]))

        apiFetch("/configuracion/cupoMaximoPorDia")
            .then((res) => {
                if (!res.ok) throw new Error("No se pudo obtener el cupo máximo por día.")
                return res.json()
            })
            .then((data: { cupoMaximoPorDia: number }) => setCupoMaximoPorDia(data.cupoMaximoPorDia))
            .catch(() => setCupoMaximoPorDia(3))

        apiFetch("/configuracion/diasBloqueados")
            .then((res) => {
                if (!res.ok) throw new Error("No se pudieron obtener los días bloqueados.")
                return res.json()
            })
            .then((data: { fecha: string }[]) => setDiasBloqueados(new Set(data.map((d) => d.fecha))))
            .catch(() => setDiasBloqueados(new Set()))
    }, [])

    const meses = [
        {
            mes: 'Enero',
            dias: 31,
            numMes: 1
        },
        {
            mes: 'Febrero',
            dias: 28,
            numMes: 2
        },
        {
            mes: 'Marzo',
            dias: 31,
            numMes: 3
        },
        {
            mes: 'Abril',
            dias: 30,
            numMes: 4
        },
        {
            mes: 'Mayo',
            dias: 31,
            numMes: 5
        },
        {
            mes: 'Junio',
            dias: 30,
            numMes: 6
        },
        {
            mes: 'Julio',
            dias: 31,
            numMes: 7
        },
        {
            mes: 'Agosto',
            dias: 31,
            numMes: 8
        },
        {
            mes: 'Septiembre',
            dias: 30,
            numMes: 9
        },
        {
            mes: 'Octubre',
            dias: 31,
            numMes: 10
        },
        {
            mes: 'Noviembre',
            dias: 30,
            numMes: 11
        },
        {
            mes: 'Diciembre',
            dias: 31,
            numMes: 12
        }
    ]
    const mes = new Date().getMonth()
    const anioActual = new Date().getFullYear()
    const [currenrIndex, setCurrentIndex] = useState(0)

    const formatearFecha = (fecha: Date) => {
        const y = fecha.getFullYear()
        const m = String(fecha.getMonth() + 1).padStart(2, "0")
        const d = String(fecha.getDate()).padStart(2, "0")
        return `${y}-${m}-${d}`
    }

    const construirGrillaMes = (anio: number, numMes: number) => {
        const primerDia = new Date(anio, numMes - 1, 1)
        const offsetInicial = primerDia.getDay()
        const diasDelMes = new Date(anio, numMes, 0).getDate()

        const celdas: { fecha: string; dia: number }[] = []

        for (let i = offsetInicial; i > 0; i--) {
            const fecha = new Date(anio, numMes - 1, 1 - i)
            celdas.push({ fecha: formatearFecha(fecha), dia: fecha.getDate() })
        }

        for (let dia = 1; dia <= diasDelMes; dia++) {
            const fecha = new Date(anio, numMes - 1, dia)
            celdas.push({ fecha: formatearFecha(fecha), dia })
        }

        let diaSiguiente = 1
        while (celdas.length < 35) {
            const fecha = new Date(anio, numMes, diaSiguiente)
            celdas.push({ fecha: formatearFecha(fecha), dia: fecha.getDate() })
            diaSiguiente++
        }

        return celdas
    }

    const tablas = [0, 1, 2].map((offset) => {
        let numMes = mes + 1 + offset
        let anio = anioActual
        while (numMes > 12) {
            numMes -= 12
            anio += 1
        }
        return construirGrillaMes(anio, numMes)
    })

    const tablaActual = tablas[currenrIndex]

    const nomMes = (num: number) => {
        let numMes = mes + num
        while (numMes > 12) {
            numMes -= 12
        }
        let nom = ""
        for (let index = 0; index < meses.length; index++) {
            if (numMes == meses[index].numMes) {
                nom = meses[index].mes
            }

        }
        return nom
    }

    const dentroDeAnticipacionMinima = (fe: string) => {
        const fechaCelda = new Date(fe + "T00:00:00")
        const hoy = new Date()
        hoy.setHours(0, 0, 0, 0)

        const msPorDia = 24 * 60 * 60 * 1000
        const diffDias = Math.round((fechaCelda.getTime() - hoy.getTime()) / msPorDia)

        return diffDias >= 0 && diffDias < 2
    }

    const puedeSeleccionar = (fe: string) => {
        let cant = 0
        for (let index = 0; index < pedidos.length; index++) {
            if (fe == pedidos[index].fecha_de_pedido) {
                cant = pedidos[index].total
            }
        }

        const fechaCelda = new Date(fe + "T00:00:00")
        const hoy = new Date()
        hoy.setHours(0, 0, 0, 0)

        let mesMostrado = mes + 1 + currenrIndex
        while (mesMostrado > 12) {
            mesMostrado -= 12
        }
        if (parseInt(fe.substring(5, 7)) !== mesMostrado) return false
        if (fechaCelda < hoy) return false
        if (dentroDeAnticipacionMinima(fe)) return false
        if (diasBloqueados.has(fe)) return false
        if (cant >= cupoMaximoPorDia) return false

        return true
    }

    const di = (fe: string) => {

        let clase = 'flex items-center justify-center rounded-lg sm:rounded-xl w-full max-w-12 aspect-square'
        if (seleccionable && fechaSeleccionada === fe) {
            clase = `${clase} ring-4 ring-offset-2 ring-cyan-500`
        }
        let cant = 0

        for (let index = 0; index < pedidos.length; index++) {

            if (fe == pedidos[index].fecha_de_pedido) {
                cant = pedidos[index].total
            }

        }

        const fechaCelda = new Date(fe + "T00:00:00")
        const hoy = new Date()
        hoy.setHours(0, 0, 0, 0)

        let mesMostrado = mes + 1 + currenrIndex
        while (mesMostrado > 12) {
            mesMostrado -= 12
        }
        if (parseInt(fe.substring(5, 7)) !== mesMostrado) {
            return `bg-gray-600 text-transparent ${clase}`
        }

        if (fechaCelda < hoy) {
            return `bg-gray-600 ${clase}`
        }

        if (dentroDeAnticipacionMinima(fe)) {
            return `bg-[#f03869] ${clase}`
        }

        if (diasBloqueados.has(fe)) {
            return `bg-[#f03869] ${clase}`
        }

        switch (true) {
            case (cant < cupoMaximoPorDia - 1):
                return `bg-[#02831e] ${clase}`

            case (cant === cupoMaximoPorDia - 1):
                return `bg-[#deb71d] ${clase}`

            case (cant >= cupoMaximoPorDia):
                return `bg-[#f03869] ${clase}`

            default:
                return `bg-[#02831e] ${clase}`

        }

    }
    const prevSlide = () => {
        switch (currenrIndex) {
            case 1:
                setCurrentIndex(0);
                break;
            case 2:
                setCurrentIndex(1);
                break;
            case 3:
                setCurrentIndex(2);
                break;
        }

    };

    const nextSlide = () => {
        switch (currenrIndex) {
            case 0:
                setCurrentIndex(1);
                break;
            case 1:
                setCurrentIndex(2);
                break;

        }
    };

    return (
        <div className='w-full h-full flex flex-col'>

            <div style={{ backgroundImage: `url("/verano.jpg")` }} className='bg-cover bg-no-repeat rounded-t-2xl  mb-5  bg-amber-50 w-full'>

                <div className='flex justify-between px-3 sm:px-6 items-center pt-2 text-xl sm:text-2xl h-12'>
                    <div className={`${currenrIndex == 0 ? "invisible" : "visible"}  rounded-full p-1 bg-black/20 text-white cursor-pointer`}>
                        <BsChevronCompactLeft onClick={prevSlide} size={25} />
                    </div>
                    {`${currenrIndex == 0 ? nomMes(1) : currenrIndex == 1 ? nomMes(2) : nomMes(3)}`}

                    <div className={`${currenrIndex == 2 ? "invisible" : "visible"}  rounded-full p-1 bg-black/20 text-white cursor-pointer`}>
                        <BsChevronCompactRight onClick={nextSlide} size={25} />
                    </div>
                </div>

                <div className="grid grid-cols-7 gap-1 sm:gap-2 px-2 sm:px-4 h-10 place-items-center text-sm sm:text-base">
                    <div className=''>dom</div>
                    <div>lun</div>
                    <div>mar</div>
                    <div>mie</div>
                    <div>jue</div>
                    <div>vie</div>
                    <div>sab</div>

                </div >

            </div>

            <div className="grid grid-cols-7 gap-1 sm:gap-2 px-2 sm:px-4 transition delay-150 duration-900 w-full flex-1">
                {

                    tablaActual.map((celda, slideIndex) => (

                        <div
                            key={slideIndex}
                            onClick={() => {
                                if (seleccionable && puedeSeleccionar(celda.fecha) && onSeleccionarFecha) {
                                    onSeleccionarFecha(celda.fecha)
                                }
                            }}
                            className='flex items-center justify-center text-lg sm:text-2xl text-amber-50 cursor-pointer w-full'
                        >

                            <div className={di(celda.fecha)}>

                                {celda.dia}

                            </div>

                        </div>

                    ))}
            </div>

        </div>
    )
}
