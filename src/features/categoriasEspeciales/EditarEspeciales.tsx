"use client"
import Image from 'next/image';
import ModalProductos from './ModalProductos';
import { Paquete } from '@/app/interfaces/producto.interface';
const clodinaryLoader = ({ src, width, quality }: { src: string; width: number; quality?: number }) => {
    return `https://res.cloudinary.com/dkdywvyce/image/upload/w_${width},q_${quality || 75}/${src}`;
}

export default function EditarEspeciales(producto: Paquete) {

    return (
        <div className="flex items-center gap-4 bg-white rounded-2xl shadow-md px-4 py-3">
            <div className="relative shrink-0 w-14 h-14 rounded-xl overflow-hidden bg-gray-100">
                <Image
                    loader={clodinaryLoader}
                    src={`${producto.producto.url_image}`}
                    className='object-cover'
                    alt={''}
                    fill
                    sizes="56px" />
            </div>

            <p className="flex-1 text-lg text-gray-700 truncate">{producto.producto.nombre}</p>

            <ModalProductos {...producto} />
        </div>
    )

}
