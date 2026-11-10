"use client"
import { Producto } from "@/app/interfaces/producto.interface";
import { useRef } from "react";
import Image from 'next/image';
import { X } from "lucide-react";
const clodinaryLoader = ({ src, width, quality }: { src: string; width: number; quality?: number }) => {
    return `https://res.cloudinary.com/dkdywvyce/image/upload/w_${width},q_${quality || 75}/${src}`;
}

export default function ModalInferior(pr: Producto) {

    const modalInfRef = useRef<HTMLDialogElement>(null);
    return (
        <div>
            <button onClick={() => modalInfRef.current?.showModal()} type="button" className="bg-blue-600 hover:bg-blue-500 w-20 h-9 rounded-xl cursor-pointer shrink-0">
                <span className="text-cyan-50 font-bold">ver</span>
            </button>

            <dialog
                className="
                                  relative
                                  w-150 max-w-[calc(100vw-1.5rem)]
                                  max-h-[90vh] overflow-y-auto sm:h-140
                                  z-20
                                  m-auto rounded-2xl scale-y-0 opacity-0
                                  transition-all transition-discrete
                                  duration-300
                                  backdrop:bg-gray-800/0
                                  open:scale-y-100 open:opacity-100
                                  open:backdrop:bg-gray-800/50
                                  open:backdrop:backdrop-blur-xs
                                  open:backdrop:transition-all
                                  open:backdrop:transition-discrete
                                  open:backdrop:duration-300
                                  starting:open:scale-y-0 starting:open:opacity-0 starting:open:backdrop:bg-gray-800/0
                       "
                ref={modalInfRef}
            >
                <div className="flex items-center min-h-15 py-2 bg-blue-200 px-4 sm:px-6">
                    <h2 className="font-bold text-gray-600 text-xl sm:text-2xl capitalize">{pr.nombre}</h2>
                </div>

                <div className="flex flex-col sm:flex-row gap-5 sm:gap-10 p-4 sm:p-6">
                    <div className="flex flex-row flex-wrap sm:flex-col gap-3 sm:gap-5 sm:w-40 shrink-0">
                        <div>
                            <p className="bg-blue-200 text-white font-bold rounded-lg px-2 py-1 text-sm">Categoría</p>
                            <p className="mt-1">{pr.categoria}</p>
                        </div>
                        <div>
                            <p className="bg-blue-200 text-white font-bold rounded-lg px-2 py-1 text-sm">Precio</p>
                            <p className="mt-1">{pr.precio}$</p>
                        </div>
                        <div>
                            <p className="bg-blue-200 text-white font-bold rounded-lg px-2 py-1 text-sm">Producto</p>
                            <p className="mt-1">{pr.tipoDeProducto?.tipo}</p>
                        </div>
                    </div>

                    <div className="relative w-full aspect-square sm:w-[380px] sm:h-[380px] overflow-hidden rounded-xl shrink-0">
                        <Image
                            loader={clodinaryLoader}
                            src={`${pr.url_image}`}
                            className='object-cover'
                            alt={''}
                            fill
                            sizes="380px" />
                    </div>
                </div>

                <button onClick={() => modalInfRef.current?.close()} type="button"
                    className="absolute flex items-center justify-center bg-red-500 hover:bg-red-600 text-white w-9 h-9 rounded-full top-4 right-4 cursor-pointer transition-colors">
                    <X size={18} />
                </button>
            </dialog>
        </div>

    )
}
