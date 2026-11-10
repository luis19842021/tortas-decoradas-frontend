"use client"

import { useState } from "react"
import Image from 'next/image';
import { Producto } from "@/app/interfaces/producto.interface";
import{CldImage} from 'next-cloudinary'

export default function ImagenesDeMenuDeProductos(producto: Producto) {

    const [imaPrincipal, setImaPrincipal] = useState<String>(producto.url_image)
    const [segundaImagen, setSegundaImagen] = useState<String>(producto.url_image2)
    const [terceraImagen, setTerceraImagen] = useState<String>(producto.url_image3)
    const [cuartaImagen, setCuartaImagen] = useState<String>(producto.url_image4)

    const SIN_IMAGEN = "v1776224771/uploadTarjeta_dxdtwg.jpg"
    const hayMiniaturas = [segundaImagen, terceraImagen, cuartaImagen].some((imagen) => imagen && imagen != SIN_IMAGEN)

    const cambiar = (imagen: String) => {

        switch (imagen) {
            case segundaImagen:
                setSegundaImagen(imaPrincipal)
                break;
            case terceraImagen:
                setTerceraImagen(imaPrincipal)
                break

            default:
                setCuartaImagen(imaPrincipal)
                break;
        }

        setImaPrincipal(imagen)
    }

    return (
        <div className="h-full">
            <div className="h-full flex flex-col justify-center bg-blue-100 rounded-xl pt-4">

                <div className=" pl-4 pr-4 pb-4">
                    <CldImage

                        src={`https://res.cloudinary.com/dkdywvyce/image/upload/f_auto/q_auto/${imaPrincipal}`}
                        className="object-cover w-full max-w-[485px] h-auto aspect-[485/450] mx-auto border-2 border-cyan-500 rounded-2xl"
                        alt={`${producto.nombre}`}
                        width={500}
                        height={450}
                        priority
                    ></CldImage>
                </div>

                {hayMiniaturas && (
                <div className="flex justify-center px-4 lg:px-0 gap-3 sm:gap-6 pb-4">

                    <div  className={`${segundaImagen == "v1776224771/uploadTarjeta_dxdtwg.jpg" ? "invisible" : "visible"}  cursor-pointer `} onClick={() => cambiar(segundaImagen)} > <CldImage

                        src={`https://res.cloudinary.com/dkdywvyce/image/upload/f_auto/q_auto/${segundaImagen}`}
                        alt={`${producto.nombre}`}
                        className="object-cover w-[90px] h-[80px] sm:w-[145px] sm:h-[130px] border-2 border-cyan-500 rounded-2xl"
                        width={150}
                        height={150}
                    ></CldImage>
                    </div>

                    <div className={`${terceraImagen == "v1776224771/uploadTarjeta_dxdtwg.jpg" ? "invisible" : "visible"}  cursor-pointer`} onClick={() => cambiar(terceraImagen)}  >
                        <CldImage

                            src={`https://res.cloudinary.com/dkdywvyce/image/upload/${terceraImagen}`}
                            alt={`${producto.nombre}`}
                            className="object-cover w-[90px] h-[80px] sm:w-[145px] sm:h-[130px] border-2 border-cyan-500 rounded-2xl"
                            width={150}
                            height={150}
                        ></CldImage>
                    </div>

                    <div className={`${cuartaImagen == "v1776224771/uploadTarjeta_dxdtwg.jpg" ? "invisible" : "visible"}  cursor-pointer`} onClick={() => cambiar(cuartaImagen)}  > <CldImage

                        src={`https://res.cloudinary.com/dkdywvyce/image/upload/${cuartaImagen}`}

                        className="object-cover w-[90px] h-[80px] sm:w-[145px] sm:h-[130px] border-2 border-cyan-500 rounded-2xl"
                        alt={`${producto.nombre}`}
                        width={150}
                        height={150}
                    ></CldImage>
                    </div>

                </div>
                )}

            </div>

        </div>
    )
}
