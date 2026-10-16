import { oi } from "@/app/ui/fonts";
import Link from "next/link";

export default function Footer() {
    return (

        <div className=" bg-red-300 ">

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 w-full pt-5 h-auto  " >

                <div className="flex lg:col-span-2
                justify-center 2xl:pl-30 items-center pb-5 md:pb-0">
                    <ul className={`${oi.className} flex flex-col items-center gap-2 text-[#787a7c] relative text-xl `}>
                        <li><Link href='/'><span className=" ">INICIO</span></Link></li>
                        <li><Link href='/productos'><span className="">PRODUCTOS</span></Link></li>
                        <li><Link href='/nosotros'><span className="  ">NOSOTROS</span></Link></li>
                        <li><Link href='/contacto'><span className="  ">CONTACTO</span></Link></li>
                    </ul>

                </div>

                <div className="flex flex-col justify-center items-center pb-5 md:pb-0 md:pr-15">

                    <p className="text-xl text-[#8e4c1d] pb-2 ">¿Cómo comprar?</p>

                    <div className="flex items-center pb-2">
                        <span className="[&>svg]:h-8 [&>svg]:w-8 ">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" id="location">
                                <g fill="#8e4c1d">
                                    <path d="m32 55.7-.9-1.1c-.6-.8-15.9-18.7-15.9-29.4 0-9.3 7.6-16.8 16.8-16.8S48.8 16 48.8 25.2c0 10.7-15.3 28.7-15.9 29.4l-.9 1.1zm0-45c-8 0-14.4 6.5-14.4 14.4 0 8.4 11.1 22.7 14.4 26.8 3.3-4.1 14.4-18.3 14.4-26.8 0-7.9-6.4-14.4-14.4-14.4z"></path>
                                    <path d="M32 31.6c-3.5 0-6.4-2.9-6.4-6.4s2.9-6.4 6.4-6.4 6.4 2.9 6.4 6.4-2.9 6.4-6.4 6.4zm0-10.4c-2.2 0-4 1.8-4 4s1.8 4 4 4 4-1.8 4-4-1.8-4-4-4z"></path>
                                </g>
                            </svg>
                        </span>
                        <p className="text-xl text-[#8e4c1d]">Almagro CABA</p>
                    </div>

                    <div className="flex items-center">
                        <span className="[&>svg]:h-6 [&>svg]:w-6 ">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" id="message">
                                <g fill="#8e4c1d">
                                    <path d="M454 83H58c-31.981 0-58 26.019-58 58v230c0 31.981 26.019 58 58 58h396c31.981 0 58-26.019 58-58V141c0-31.981-26.019-58-58-58zm42 58v230c0 9.036-2.878 17.407-7.752 24.266L310.95 229.049l174.359-116.006C491.952 120.475 496 130.272 496 141zm-42-42a41.734 41.734 0 0 1 17.66 3.907L256 246.391 40.339 102.907A41.738 41.738 0 0 1 58 99h396zM16 371V141c0-10.728 4.048-20.525 10.691-27.956L201.05 229.049 23.752 395.266C18.878 388.408 16 380.036 16 371zm42 42a41.744 41.744 0 0 1-22.66-6.665l179.394-168.182 36.835 24.507a8 8 0 0 0 8.862 0l36.835-24.507L476.66 406.335A41.741 41.741 0 0 1 454 413H58z"></path>
                                </g>
                            </svg>
                        </span>

                        <p className="pl-2 text-xl text-[#8e4c1d]">
                            colorestortasdecoradas@gmail.com
                        </p>
                    </div>

                </div>

                <div className="flex flex-col md:col-span-2 lg:pr-5  2xl:pr-40 justify-center items-center">

                    <div className="flex items-center" >
                        <button
                            type="button"
                            data-twe-ripple-init
                            data-twe-ripple-color="light"
                            className="mb-2 inline-block rounded-full bg-[#128c7e] p-2 text-xs font-medium uppercase leading-normal text-white shadow-md transition duration-150 ease-in-out hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg">
                            <span className="[&>svg]:h- [&>svg]:w-4">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="currentColor"
                                    viewBox="0 0 448 512">

                                    <path
                                        d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7 .9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
                                </svg>
                            </span>
                        </button>
                        <a href="https://wa.me/5491121804172" target="_blank" rel="noopener noreferrer" className="text-xl text-[#8e4c1d] pl-2 pb-2 hover:underline">1121804172</a>
                    </div>

                    <div className="flex items-center">
                        <button
                            type="button"
                            data-twe-ripple-init
                            data-twe-ripple-color="light"
                            className="mb-2 inline-block rounded-full bg-[#c13584] p-2 text-xs font-medium uppercase leading-normal text-white shadow-md transition duration-150 ease-in-out hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg">
                            <span className="[&>svg]:h-4 [&>svg]:w-4">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="currentColor"
                                    viewBox="0 0 448 512">
                                    <path
                                        d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" />
                                </svg>
                            </span>
                        </button>
                        <p className="text-xl text-[#8e4c1d] pl-2 pb-2">Colores_tortas_decoradas</p>

                    </div>

                    <div className="flex items-center">
                        <button
                            type="button"
                            data-twe-ripple-init
                            data-twe-ripple-color="light"
                            className="mb-2 inline-block rounded-full bg-black p-2 text-xs font-medium uppercase leading-normal text-white shadow-md transition duration-150 ease-in-out hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg">
                            <span className="[&>svg]:h-4 [&>svg]:w-4">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="currentColor"
                                    viewBox="0 0 448 512">

                                    <path
                                        d="M448 209.9a210.1 210.1 0 0 1 -122.8-39.3V349.4A162.6 162.6 0 1 1 185 188.3V278.2a74.6 74.6 0 1 0 52.2 71.2V0l88 0a121.2 121.2 0 0 0 1.9 22.2h0A122.2 122.2 0 0 0 381 102.4a121.4 121.4 0 0 0 67 20.1z" />
                                </svg>
                            </span>
                        </button>
                        <p className="text-xl text-[#8e4c1d] pl-2 pb-2">@colorestortasdecoradas</p>

                    </div>

                    <div className="flex items-center">
                        <button
                            type="button"
                            data-twe-ripple-init
                            data-twe-ripple-color="light"
                            className="mb-2 inline-block rounded-full bg-[#1877f2] p-2 text-xs font-medium uppercase leading-normal text-white shadow-md transition duration-150 ease-in-out hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg">
                            <span className="[&>svg]:h-4 [&>svg]:w-4">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="currentColor"
                                    viewBox="0 0 320 512">

                                    <path
                                        d="M80 299.3V512H196V299.3h86.5l18-97.8H196V166.9c0-51.7 20.3-71.5 72.7-71.5c16.3 0 29.4 .4 37 1.2V7.9C291.4 4 256.4 0 236.2 0C129.3 0 80 50.5 80 159.4v42.1H14v97.8H80z" />
                                </svg>
                            </span>
                        </button>
                        <p className="text-xl text-[#8e4c1d] pl-2 pb-2">Colores_tortas_decoradas</p>

                    </div>
                </div>

            </div>

            <nav className="flex flex-wrap justify-center gap-x-6 gap-y-1 px-4 pb-3 text-sm text-[#8e4c1d]">
                <Link href='/terminos' className="underline">Términos y condiciones</Link>
                <Link href='/privacidad' className="underline">Política de privacidad</Link>
                <Link href='/cambios-y-devoluciones' className="underline">Cambios y devoluciones</Link>
                <a
                    href="https://www.argentina.gob.ar/produccion/defensadelconsumidor/formulario"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                >
                    Defensa del consumidor
                </a>
            </nav>

            <div className="grid grid-cols-1 md:grid-cols-2 h-15  text-[#8e4c1d]  ">
                <p className="flex  justify-center items-center">© Copyright colores Tortas Decoradas-2026</p>
                <p className="flex  justify-center items-center">creado por Bububle Digital</p>

            </div>

        </div>

    )
}
