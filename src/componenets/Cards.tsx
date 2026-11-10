"use client"
import { Producto } from '@/app/interfaces/producto.interface';
import Image from 'next/image';
import Link from 'next/link';

const clodinaryLoader = ({ src, width, quality }: { src: string; width: number; quality?: number }) => {
    return `https://res.cloudinary.com/dkdywvyce/image/upload/w_${width},q_${quality || 75}/${src}`;
}

export default function Cards(producto: Producto) {

  return (

          <Link href={`/productos/verProducto/?id=${producto.idProducto}`} className=" group relative block rounded-lg shadow-lg overflow-hidden  w-[300px] max-w-full h-[400px] hover:-translate-y-2    hover:shadow-2xl  bg-white transition-all duration-300 ">
                <Image
                   loader={clodinaryLoader}
                    width={700}
                    height={300}
                      src={`${producto.url_image}`}
                    alt="Paisaje"
                    sizes="300px"
                    className="        w-full h-[300px]  rounded-t-lg group-hover:rounded-lg group-hover:h-[400px] group-hover:opacity-40 object-cover transition-all duration-500 ease-in-out"
                />

                <div className=" absolute  left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 ">

                    <div className='pr-2 '>
                        <span className=' inline-block py-2 px-6 text-sm bg-indigo-500 text-white invisible group-hover:visible
                                  rounded-full cursor-pointer font-bold text-center shadow-xs transition-all
                                 hover:bg-indigo-700'>
                            Mas info
                        </span>
                    </div>

                </div>

                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%] text-center ">
                    <p className='font-bold text-xl sm:text-2xl  mt-5 text-naja  capitalize truncate' >{producto.nombre}</p>

                    <p className='pt-2  font-semibold text-xl'>{producto.precio}$</p>
                </div>

            </Link>

  )
}
