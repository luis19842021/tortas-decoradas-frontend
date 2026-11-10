"use client"

import { useEffect, useRef, useState } from 'react';
import LoadingBar, { LoadingBarRef } from "react-top-loading-bar"
import { Bounce, toast, ToastContainer } from "react-toastify";

import { FileImage, OctagonAlert } from "lucide-react";
import Image from 'next/image';
import React, { MouseEvent } from 'react';
import { oi } from '@/app/ui/fonts';
import { ImagenCarrusel, actualizarEnlaceCarrusel, actualizarImagenCarrusel, eliminarImagenCarrusel, esEnlaceInterno } from './api';

const clodinaryLoader = ({ src, width, quality }: { src: string; width: number; quality?: number }) => {
    return `https://res.cloudinary.com/dkdywvyce/image/upload/w_${width},q_${quality || 75}/${src}`;
}

interface Props {
    imagenes: ImagenCarrusel[]
}

export default function EditarCarrusel({ imagenes }: Props) {

    const espacios = [
        {
            id: 1,
            nom: "Primera imagen"
        },
        {
            id: 2,
            nom: "Segunda imagen"

        },
        {
            id: 3,
            nom: "Tercera imagen"
        },
        {
            id: 4,
            nom: "Cuarta  imagen"
        },
        {
            id: 5,
            nom: "Quinta imagen"
        }
    ]

    const armarMapa = (lista: ImagenCarrusel[]) => {
        const mapa: Record<number, string> = {}
        lista.forEach((imagen) => { mapa[imagen.espacio] = imagen.url })
        return mapa
    }

    const armarMapaEnlaces = (lista: ImagenCarrusel[]) => {
        const mapa: Record<number, string> = {}
        lista.forEach((imagen) => { if (imagen.enlace) mapa[imagen.espacio] = imagen.enlace })
        return mapa
    }

    const [file, setFile] = useState<File | null>(null);
    const [indice, setIndice] = useState<number>(1)
    const [imagenesPorEspacio, setImagenesPorEspacio] = useState<Record<number, string>>(armarMapa(imagenes))
    const [enlacesPorEspacio, setEnlacesPorEspacio] = useState<Record<number, string>>(armarMapaEnlaces(imagenes))
    const [borradorEnlace, setBorradorEnlace] = useState<string>(enlacesPorEspacio[1] ?? "")
    const [guardandoEnlace, setGuardandoEnlace] = useState(false)
    const ref = useRef<LoadingBarRef>(null);
    const inputFileRef = useRef<HTMLInputElement>(null);

    const rutaImagen = imagenesPorEspacio[indice]

    const imagenSelect = (id: number) => {
        setIndice(id)
    }

    useEffect(() => {
        setBorradorEnlace(enlacesPorEspacio[indice] ?? "")
    }, [indice])

    async function guardarEnlace() {
        const texto = borradorEnlace.trim()
        if (!rutaImagen) {
            toast.warning("Primero cargá una imagen en este espacio")
            return
        }
        if (texto !== "" && !esEnlaceInterno(texto)) {
            toast.warning("El enlace tiene que empezar con / (una página del sitio)")
            return
        }
        setGuardandoEnlace(true)
        try {
            await actualizarEnlaceCarrusel(indice, texto)
            setEnlacesPorEspacio((previo) => {
                const copia = { ...previo }
                if (texto === "") delete copia[indice]
                else copia[indice] = texto
                return copia
            })
            toast.success(texto === "" ? "Enlace quitado" : "Enlace guardado")
        } catch (error) {
            toast.warning(error instanceof Error ? error.message : "Error al guardar el enlace")
        } finally {
            setGuardandoEnlace(false)
        }
    }

    async function subirImagen(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()

        if (inputFileRef == null || file == null) {

            toast.warning("Seleccione un archivo")

            return false;

        }

        try {

            if (ref.current) {
                ref.current.continuousStart()
            }

            const actualizada = await actualizarImagenCarrusel(indice, file)

            setImagenesPorEspacio((previo) => ({ ...previo, [actualizada.espacio]: actualizada.url }))
            if (actualizada.enlace) {
                setEnlacesPorEspacio((previo) => ({ ...previo, [actualizada.espacio]: actualizada.enlace as string }))
            }

            toast.success("Imagen subida correctamente");

        } catch (error) {

            toast.warning("Error al subir la imagen");

        } finally {

            setFile(null);
            if (inputFileRef.current) {
                inputFileRef.current.value = "";
            }
            if (ref.current) {
                ref.current.complete()

            }
        }

    }

    async function eliminar() {

        try {

            await eliminarImagenCarrusel(indice)

            setImagenesPorEspacio((previo) => {
                const copia = { ...previo }
                delete copia[indice]
                return copia
            })
            setEnlacesPorEspacio((previo) => {
                const copia = { ...previo }
                delete copia[indice]
                return copia
            })
            setBorradorEnlace("")

        } catch (error) {
            toast.warning("Error al eliminar la imagen");
        }
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {

        if (!e.target.files?.[0]) {
            if (inputFileRef.current) {
                inputFileRef.current.value = "";
                setFile(null)
            }
            return;
        }

        setFile(e.target.files?.[0]);

    };

    const botonEliminar = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()

        if (!rutaImagen) {
            toast.warning("primero debe cargar una imagen ")
        } else {

            eliminar()
        }

    };

    return (

        <div>
            <div className="grid grid-cols-1  place-items-center pl-2 pr-2 lg:grid-cols-3 lg:place-items-start pt-6 ">

                <div className='w-full lg:col-span-2'>
                    <div className='relative w-full aspect-[12/7] overflow-hidden border-4 rounded-2xl border-naja'>
                        {rutaImagen ? (
                            <Image
                                loader={clodinaryLoader}
                                src={rutaImagen}
                                className='rounded-xl object-cover'
                                alt={''}
                                fill
                                sizes="(max-width: 1024px) 100vw, 66vw" />
                        ) : (
                            <Image src={`/uploads/espacioVacio.jpg`}
                                className='rounded-xl object-cover'
                                alt={''}
                                fill
                                sizes="(max-width: 1024px) 100vw, 66vw" />
                        )}
                    </div>

                    <div className='flex justify-center gap-3 pt-4'>
                        {espacios.map((id, index) => (
                            <div key={index} className={`  ${id.id == indice ? "bg-green-600   hover:bg-green-400" : "  bg-gray-400  hover:bg-gray-200 "} cursor-pointer  transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110
                       w-12 h-12 flex justify-center rounded-2xl drop-shadow-xl/50'  `} onClick={() => imagenSelect(id.id)} >
                                <button type='button' >
                                    <div className='text-white font-bold cursor-pointer  '>{id.id}</div>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className='lg:pl-6 min-w-0 w-full'>
                    <div>
                        <h2 className={`${oi.className} flex text-gray-600 pl-2 items-center relative text-2xl  mt-6 pb-5 `}>{espacios[indice - 1].nom}</h2>
                    </div>

                    <div>
                        <LoadingBar color="#80f" ref={ref} shadow={true} />
                        <form onSubmit={(e) => subirImagen(e)} className='flex flex-wrap items-center gap-3 mb-5'>

                            <label className="flex items-center bg-amber-100 h-11 w-56 border-2 rounded-sm shrink-0">
                                <input
                                    type="file"
                                    accept='image/*'

                                    placeholder="selecione archivo"
                                    className='from-primary-600 hidden'
                                    ref={inputFileRef}

                                    onChange={(e) => handleFileChange(e)}
                                />

                                <div className='mx-3 text-gray-600 truncate'>{`${file == null ? "seleccionar imagen" : file.name}`} </div>

                            </label>

                            <button type='submit' className='flex items-center justify-center gap-2 h-11 w-56 shrink-0 bg-indigo-500 text-white
                     rounded-full cursor-pointer font-bold text-center shadow-xs transition-all duration-500
                    hover:bg-indigo-700'>
                                <FileImage size={20} />
                                <span>Cargar imagen</span>
                            </button>

                            <button type='button' onClick={(e) => botonEliminar(e)}
                                className='flex items-center justify-center gap-2 h-11 w-56 shrink-0 bg-red-700 hover:bg-red-800 text-white rounded-full cursor-pointer font-bold shadow-cyan-500/50 transition-all duration-500'>
                                <OctagonAlert className='text-amber-300' size={20} />
                                <span>Eliminar</span>
                            </button>

                            <ToastContainer
                                position="top-center"
                                autoClose={1000}
                                newestOnTop={false}
                                closeOnClick={false}
                                rtl={false}
                                pauseOnFocusLoss
                                draggable
                                theme="colored"
                                transition={Bounce}
                            />
                        </form>

                        <div className='mb-5 max-w-xl'>
                            <label className='block text-gray-600 font-semibold mb-1' htmlFor='enlace-banner'>
                                Enlace del banner (opcional)
                            </label>
                            <div className='flex flex-wrap gap-2 mb-2'>
                                {[
                                    { nombre: "Tortas", ruta: "/productos?categoria=TORTAS&tipo=TORTA" },
                                    { nombre: "Nosotros", ruta: "/nosotros" },
                                    { nombre: "Contacto", ruta: "/contacto" },
                                    { nombre: "Inicio", ruta: "/" },
                                ].map((sugerido) => (
                                    <button
                                        key={sugerido.nombre}
                                        type='button'
                                        onClick={() => setBorradorEnlace(sugerido.ruta)}
                                        className='px-3 py-1 rounded-full text-sm bg-amber-100 hover:bg-amber-200 border border-amber-300 text-gray-700 cursor-pointer'
                                    >
                                        {sugerido.nombre}
                                    </button>
                                ))}
                            </div>
                            <div className='flex flex-wrap items-center gap-2'>
                                <input
                                    id='enlace-banner'
                                    type='text'
                                    value={borradorEnlace}
                                    onChange={(e) => setBorradorEnlace(e.target.value)}
                                    placeholder='/productos?categoria=TORTAS&tipo=TORTA'
                                    maxLength={300}
                                    className='flex-1 min-w-48 h-11 px-3 border-2 rounded-sm bg-amber-100 text-gray-700'
                                />
                                <button
                                    type='button'
                                    onClick={guardarEnlace}
                                    disabled={guardandoEnlace}
                                    className='h-11 px-6 bg-indigo-500 hover:bg-indigo-700 disabled:bg-gray-400 text-white rounded-full font-bold cursor-pointer disabled:cursor-not-allowed'
                                >
                                    Guardar enlace
                                </button>
                            </div>
                            <p className='text-gray-400 text-xs mt-1'>
                                Una página del sitio que empiece con /. Dejalo vacío para que el banner no sea clickeable.
                            </p>
                        </div>
                    </div>

                </div>

            </div>

        </div>

    )
}
