"use client";

import React, { useState, useEffect } from 'react';
import { BsChevronCompactLeft, BsChevronCompactRight } from 'react-icons/bs'
import { BsCircleFill } from "react-icons/bs";
import Image from 'next/image';
import Link from 'next/link';
import { ImagenCarrusel, esEnlaceInterno } from './api';

const clodinaryLoader = ({ src, width, quality }: { src: string; width: number; quality?: number }) => {
    return `https://res.cloudinary.com/dkdywvyce/image/upload/w_${width},q_${quality || 75}/${src}`;
}

interface Props {
    imagenes: ImagenCarrusel[]
}

export default function Carrusel({ imagenes }: Props) {

    const slides = imagenes
        .slice()
        .sort((a, b) => a.espacio - b.espacio)
        .map((imagen) => ({ url: imagen.url, enlace: imagen.enlace }))

    const autoSlide = true
    const [currenrIndex, setCurrentIndex] = useState(0)
    const autoSlideInterval = 8000

    useEffect(() => {

        if (autoSlide) {
            const slideInterval = setInterval(() => {
                setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
            }, autoSlideInterval);
            return () => clearInterval(slideInterval);
        }
    }, [autoSlide, autoSlideInterval, slides.length]);

    if (slides.length === 0) {
        return null
    }

    const prevSlide = () => {
        const isFirtsSlide = currenrIndex === 0;
        const newIndex = isFirtsSlide ? slides.length - 1 : currenrIndex - 1
        setCurrentIndex(newIndex);

    };

    const nextSlide = () => {
        const isLastSlide = currenrIndex === slides.length - 1;
        const newIndex = isLastSlide ? 0 : currenrIndex + 1

        setCurrentIndex(newIndex);
    };

    const goToSlide = (slideIndex: number) => {
        setCurrentIndex(slideIndex)

            ;
    };

    const activo = (i: number, s: number) => {
        if (i == s) {
            return "text-naja mt-1 ml-3 "
        }
        return "text-blue-500 mt-1 ml-3"

    };

    return (

        <div className="
                  w-[350px]
                  h-[200px]
                  sm:w-[500px]
                  sm:h-[300px]
                  lg:w-[750px]
                  lg:h-[450px]
                  2xl:w-[1100px]
                  2xl:h-[600px]
                  m-auto
                  mt-2
                  z-10
                  relative group
                  "

        >

            {(() => {
                const imagenActual = (
                    <Image
                        loader={clodinaryLoader}
                        src={`${slides[currenrIndex].url}`}
                        className='rounded-lg object-cover'
                        alt={'bu'}
                        fill
                        sizes="(max-width: 640px) 350px, (max-width: 1024px) 500px, (max-width: 1536px) 750px, 1100px" />
                )
                const enlace = slides[currenrIndex].enlace
                return esEnlaceInterno(enlace) ? (
                    <Link href={enlace} aria-label='Ver más' className='block relative rounded-lg w-full h-full overflow-hidden cursor-pointer'>
                        {imagenActual}
                    </Link>
                ) : (
                    <div className='relative rounded-lg w-full h-full overflow-hidden'>
                        {imagenActual}
                    </div>
                )
            })()}

            <div className=' hidden group-hover:flex items-center justify-center absolute top-1/2 -translate-y-1/2 left-5 rounded-full p-2 bg-black/20 text-white cursor-pointer'>
                <BsChevronCompactLeft onClick={prevSlide} size={30} />
            </div>

            <div className='hidden group-hover:flex items-center justify-center absolute top-1/2 -translate-y-1/2 right-5 rounded-full p-2 bg-black/20 text-white cursor-pointer'>
                <BsChevronCompactRight onClick={nextSlide} size={30} />
            </div>

            <div className='hidden md:block'>
                <div className=' flex top-4 justify-center py-2 '>
                    {slides.map((slide, slideIndex) => (

                        <div key={slideIndex} onClick={() => goToSlide(slideIndex)} className='text-2xl cursor-pointer'>

                            <BsCircleFill className={activo(currenrIndex, slideIndex)} />

                        </div>
                    ))}
                </div>

            </div>

        </div>

    )

}
