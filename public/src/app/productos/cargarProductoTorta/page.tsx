'use client'
import React, { MouseEvent, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useEffect, useState } from 'react';
import { RiCheckboxBlankFill, RiUser3Fill } from "react-icons/ri";
import { DetalleCakePops, DetalleCakePopsEntity, DetalleCupcakeEntity, DetalleGalletaEntity, DetalleMinidonasEntity, DetalleOreosEntity, DetallePaletasEntity, DetalleTorta, Bizcochuelo, DetalleTortaEntity, Producto, ProductoEntity, Sabor, SaborEntity, TamañoCatalogo, TipoDeProducto, TipoDeProductoEntity } from '@/app/interfaces/producto.interface';
import { Bounce, toast, ToastContainer } from "react-toastify";
import { useRouter } from 'next/navigation'
import { getToken } from '@/features/auth/auth'
import { useSesionUsuario } from '@/features/auth/useSesionUsuario'
import { apiFetch } from '@/utils/apiFetch'
import SelectorAlergenos from '@/features/productos/SelectorAlergenos'
import { Alergeno } from '@/features/productos/alergenos'
import { useSelectoresAbiertos } from '@/features/productos/useSelectoresAbiertos'

const clodinaryLoader = ({ src, width, quality }: { src: string; width: number; quality?: number }) => {
    return `https://res.cloudinary.com/dkdywvyce/image/upload/w_${width},q_${quality || 75}/${src}`;
}
export default function CargarProductoTorta() {
    const router = useRouter()
    const sesion = useSesionUsuario()
    const { abiertos, refs, alternar, cerrar } = useSelectoresAbiertos([
        "categoria", "subCategoria",
        "tamaño", "tamañoDos", "tamañoTres",
        "bizcochuelo", "bizcochueloDos", "bizcochueloTres",
        "relleno", "rellenoDos", "rellenoTres", "rellenoCuatro", "rellenoCinco",
        "rellenoSeis", "rellenoSiete", "rellenoOcho", "rellenoNueve",
    ] as const)
    const pisos = [
        { num: 1 }, { num: 2 }, { num: 3 }
    ]
    const categorias = [
        {

            nombre: "Ninguno"
        },
        {

            nombre: "Tortas"
        },
        {
            nombre: "Cookies"
        },
        {
            nombre: "Cupcakes"
        },
        {
            nombre: "Cakepops"
        },
        {
            nombre: "Minidonas"
        },
        {
            nombre: "Paletas"
        },
        {
            nombre: "Oreos Bañadas"
        },
        {
            nombre: "Mesas Dulces"
        },
        {
            nombre: "Catering Salado"
        },
        {
            nombre: "Desayunos"
        }
    ]
    const tipoSegunCategoria: Record<string, string> = {
        Tortas: "Torta",
        Cookies: "Galleta",
        Cupcakes: "Cupcakes",
        Cakepops: "Cakepops",
        Minidonas: "Minidonas",
        Paletas: "Paletas",
        "Oreos Bañadas": "Oreos",
        "Mesas Dulces": "Variado",
        "Catering Salado": "Variado",
        Desayunos: "Variado",
    }
    const subCategorias = [
        { nombre: "Ninguno" },
        { nombre: "Infantiles" },
        { nombre: "Casamientos" },
        { nombre: "Aniversarios" },
        { nombre: "Cumpleaños" },
        { nombre: "Baby Shower" },
        { nombre: "Graduaciones" },
        { nombre: "Halloween" },
        { nombre: "Navidad" },
        { nombre: "San Valentín" },
        { nombre: "Deportes" },
        { nombre: "Series/Anime" },
        { nombre: "Videojuegos" },
        { nombre: "Despedida de Soltero" },
        { nombre: "Comunion" },
        { nombre: "Confirmacion" },
        { nombre: "Bautismo" },
        { nombre: "Profesiones" },
        { nombre: "Fiesta De 15 Años" },
        { nombre: "Día de la Madre" },
        { nombre: "Día del Padre" },
        { nombre: "Día de la Mujer" },
        { nombre: "Día del Amigo" },
        { nombre: "Día del Niño" },
        { nombre: "Eróticos" },
        { nombre: "Adultos" },
        { nombre: "Numeros/Chocotortas" },
        { nombre: "Golosineras" }
    ]
    const tiposDeProducto = [
        {
            id: 0,
            producto: "Torta"
        },
        {
            id: 1,
            producto: "Galleta"

        },
        {
            id: 2,
            producto: "Cupcakes"

        },
        {
            id: 3,
            producto: "Variado"

        },
        {
            id: 4,
            producto: "Cakepops"
        },
        {
            id: 5,
            producto: "Minidonas"
        },
        {
            id: 6,
            producto: "Paletas"
        },
        {
            id: 7,
            producto: "Oreos"
        }
    ]
    const saboresDeGalletitas = [
        {
            id: 0,
            sabor: "Ninguno"
        },
        {
            id: 1,
            sabor: "Vainilla"
        },
        {
            id: 2,
            sabor: "Chocolate"
        }
    ]
    const saboresCupkakes = [
        {
            id: 1,
            sabor: "Ninguno",

        },
        {
            id: 2,
            sabor: "Chocolate",

        },
        {
            id: 3,
            sabor: "Vainilla",
        }
    ]
    const inputPrecioRef = useRef<HTMLInputElement>(null);
    const inputFileRef = useRef<HTMLInputElement>(null);
    const inputNombreRef = useRef<HTMLInputElement>(null);
    const inputDescripcionRef = useRef<HTMLTextAreaElement>(null);
    const inputImagenRef = useRef<HTMLInputElement>(null);
    const inputImagenDosRef = useRef<HTMLInputElement>(null);
    const inputImagenTresRef = useRef<HTMLInputElement>(null);
    const inputImagenCuatroRef = useRef<HTMLInputElement>(null);
    const inputCantidadGalletasRef = useRef<HTMLInputElement>(null);
    const inputCantidadCupcakesRef = useRef<HTMLInputElement>(null);
    const inputCantidadCakePopsRef = useRef<HTMLInputElement>(null);
    const inputCantidadMinidonasRef = useRef<HTMLInputElement>(null);
    const inputCantidadPaletasRef = useRef<HTMLInputElement>(null);
    const inputCantidadOreosRef = useRef<HTMLInputElement>(null);
    const [currenrIndex, setCurrentIndex] = useState(0)
    const [pisosSeleccionados, setPisosSeleccionados] = useState<number>(1)
    const [estructura, setEstructura] = useState<Boolean>(false)
    const [tamaño, setTamaño] = useState<TamañoCatalogo | null>(null)
    const [tamañoDos, setTamañoDos] = useState<TamañoCatalogo | null>(null)
    const [tamañoTres, setTamañoTres] = useState<TamañoCatalogo | null>(null)
    const [relleno, setRelleno] = useState<String>("Ninguno")
    const [rellenoDos, setRellenoDos] = useState<String>("Ninguno")
    const [rellenoTres, setRellenoTres] = useState<String>("Ninguno")
    const [rellenoCuatro, setRellenoCuatro] = useState<String>("Ninguno")
    const [rellenoCinco, setRellenoCinco] = useState<String>("Ninguno")
    const [rellenoSeis, setRellenoSeis] = useState<String>("Ninguno")
    const [rellenoSiete, setRellenoSiete] = useState<String>("Ninguno")
    const [rellenoOcho, setRellenoOcho] = useState<String>("Ninguno")
    const [rellenoNueve, setRellenoNueve] = useState<String>("Ninguno")
    const [bizcochuelo, setBizcochuelo] = useState<Bizcochuelo | null>(null)
    const [bizcochueloDos, setBizcochueloDos] = useState<Bizcochuelo | null>(null)
    const [bizcochueloTres, setBizcochueloTres] = useState<Bizcochuelo | null>(null)
    const [categoria, setCategoria] = useState<String>('Tortas')
    const [subCategoria, setSubCategoria] = useState<String>('Ninguno')
    const [file, setFile] = useState<File | null>(null);
    const [filedos, setFiledos] = useState<File | null>(null);
    const [filetres, setFiletres] = useState<File | null>(null);
    const [filecuatro, setFilecuatro] = useState<File | null>(null);
    const [imagePath, setImagePath] = useState<String>("v1776224771/uploadTarjeta_dxdtwg.jpg")
    const [imagePathdos, setImagePathdos] = useState<String>("v1776224771/uploadTarjeta_dxdtwg.jpg")
    const [imagePathtres, setImagePathtres] = useState<String>("v1776224771/uploadTarjeta_dxdtwg.jpg")
    const [imagePathcuatro, setImagePathcuatro] = useState<String>("v1776224771/uploadTarjeta_dxdtwg.jpg")
    const [nombre, setNombre] = useState<String>("")
    const [precio, setPrecio] = useState<number>(0)
    const [descripcion, setDescripcion] = useState<String>("")
    const [ingredientes, setIngredientes] = useState<string>("")
    const [alergenos, setAlergenos] = useState<Alergeno[]>([])
    const [trazas, setTrazas] = useState<Alergeno[]>([])
    const [tipo, setTipo] = useState<String>(tiposDeProducto[0].producto)
    const [sabor, setSabor] = useState<String>(saboresDeGalletitas[0].sabor)
    const [cantidadGalletas, setCantidadGalletas] = useState<number>(0)
    const [saborCupcakes, setSaborCupcake] = useState<String>(saboresCupkakes[0].sabor)
    const [cantidadDeCupcakes, setCantidadDeCupcake] = useState<number>(0)
    const [cantidadDeCakePops, setCantidadDeCakePops] = useState<number>(0)
    const [cantidadDeMinidonas, setCantidadDeMinidonas] = useState<number>(0)
    const [cantidadDePaletas, setCantidadDePaletas] = useState<number>(0)
    const [cantidadDeOreos, setCantidadDeOreos] = useState<number>(0)
    const [camposVacios, setCamposVacios] = useState<boolean>(false)
    const [numeronegativo, setNumeroNegativo] = useState<boolean>(false)
    const [cuadrado, setCuadrado] = useState<boolean>(false)
    const [regtangular, setRegtangular] = useState<boolean>(false)
    const [circulo, setCirculo] = useState<boolean>(true)
    const [catalogoTamaños, setCatalogoTamaños] = useState<TamañoCatalogo[]>([])
    const [listadeTamaños, setListaDeTamaños] = useState<TamañoCatalogo[]>([])
    const [saboresbizcochuelo, setSaboresBizcochuelo] = useState<Bizcochuelo[]>([])
    const [listaDeSabores, setListaDeSabores] = useState<Sabor[]>([])

    useEffect(() => {
        const cargarCatalogos = async () => {
            try {
                const [respTamaños, respBizcochuelos, respSabores] = await Promise.all([
                    apiFetch("/producto/listaTamanos", { method: 'GET' }),
                    apiFetch("/producto/listaBizcochuelos", { method: 'GET' }),
                    apiFetch("/producto/lista", { method: 'GET' }),
                ])
                const tamaños: TamañoCatalogo[] = await respTamaños.json()
                const bizcochuelos: Bizcochuelo[] = await respBizcochuelos.json()
                const sabores: Sabor[] = await respSabores.json()
                setCatalogoTamaños(tamaños)
                setListaDeTamaños(tamaños.filter((t) => String(t.forma).toUpperCase() == "CIRCULAR"))
                setSaboresBizcochuelo(bizcochuelos)
                setListaDeSabores(sabores)
            } catch {
                toast.error("No se pudieron cargar los tamaños, bizcochuelos y sabores")
            }
        }
        cargarCatalogos()
    }, [])

    const idDeSabor = (nombreSabor: String) => {
        return listaDeSabores.find((s) => s.sabor == nombreSabor)?.idLista_sabor ?? 0
    }

    const listaTamañoSegunForma = (forma: String) => {
        let nuevaLista: TamañoCatalogo[] = []

        if (forma == "circulo") {
            nuevaLista = catalogoTamaños.filter((t) => String(t.forma).toUpperCase() == "CIRCULAR")
        }
        if (forma == "cuadrado") {
            nuevaLista = catalogoTamaños.filter((t) => String(t.forma).toUpperCase() == "CUADRADO")
        }
        if (forma == "regtangulo") {
            nuevaLista = catalogoTamaños.filter((t) => String(t.forma).toUpperCase() == "RECTANGULAR")
        }

        return nuevaLista
    }

    const goToSlide = (slideIndex: number, numPisos: number) => {
        if (regtangular && numPisos > 1) {
            toast.warning("La torta rectangular es de un solo piso")
            return
        }
        setCurrentIndex(slideIndex);
        setPisosSeleccionados(numPisos)
        if (numPisos == 2) {
            setTamañoTres(null)
            setBizcochueloTres(null)
            setRellenoSiete("Ninguno")
            setRellenoOcho("Ninguno")
            setRellenoNueve("Ninguno")
        }
        if (numPisos == 1) {
            setTamañoDos(null)
            setBizcochueloDos(null)
            setTamañoTres(null)
            setBizcochueloTres(null)
            setRellenoCuatro("Ninguno")
            setRellenoCinco("Ninguno")
            setRellenoSeis("Ninguno")
            setRellenoSiete("Ninguno")
            setRellenoOcho("Ninguno")
            setRellenoNueve("Ninguno")
        }

    };
    const activo = (i: number, s: number) => {
        if (i == s) {
            return "text-naja  mt-1 ml-3 "
        }
        return "text-mio mt-1 ml-3"

    };
    const estadoDeForma = (forma: String) => {
        setTamaño(null)
        setTamañoDos(null)
        setTamañoTres(null)
        if (forma == "circulo") {
            setCirculo(true)
            setCuadrado(false)
            setRegtangular(false)
            setListaDeTamaños(listaTamañoSegunForma(forma))
        }
        if (forma == "cuadrado") {
            setCirculo(false)
            setCuadrado(true)
            setRegtangular(false)
            setListaDeTamaños(listaTamañoSegunForma(forma))
        }
        if (forma == "regtangulo") {
            setCirculo(false)
            setCuadrado(false)
            setRegtangular(true)
            setListaDeTamaños(listaTamañoSegunForma(forma))
            setRegtangular(true)
            if (pisosSeleccionados != 1) {
                setCurrentIndex(0)
                setPisosSeleccionados(1)
                setTamañoDos(null)
                setBizcochueloDos(null)
                setTamañoTres(null)
                setBizcochueloTres(null)
                setRellenoCuatro("Ninguno")
                setRellenoCinco("Ninguno")
                setRellenoSeis("Ninguno")
                setRellenoSiete("Ninguno")
                setRellenoOcho("Ninguno")
                setRellenoNueve("Ninguno")
            }
        }
    }

    const detalleDeTorta = () => {
        return <> <div>
            <div className='w-full max-w-265 mt-2 mb-2 text-xl font-medium pl-4 bg-amber-200'>
                Detalle de torta
            </div>

            <div className='flex flex-wrap items-center gap-y-1 pl-4 pr-3 bg-[#f5f2f2] rounded-2xl'>
                <div className='text-xl mr-5'>pisos</div>
                <div className=' flex top-4 justify-center py-2 '>
                    {pisos.map((slide, slideIndex) => (

                        <div key={slideIndex} onClick={() => goToSlide(slideIndex, pisos[slideIndex].num)} className='flex text-2xl cursor-pointer'>

                            <div className='pl-3 text-xl'>{pisos[slideIndex].num}</div>
                            <RiCheckboxBlankFill className={activo(currenrIndex, slideIndex)} />

                        </div>
                    ))}
                </div>

                <div className='text-xl pl-4 sm:pl-20 mr-5'>Estructura</div>
                <div className=' flex top-4 justify-center py-2 '>

                    <div className='flex text-2xl '>
                        <div className='pl-3 text-xl' >si</div>
                        <RiCheckboxBlankFill onClick={() => setEstructura(true)} className={`${estructura == true ? "text-naja  mt-1 ml-3 " : " text-mio mt-1 ml-3"} cursor-pointer`} />

                        <div className='pl-3 text-xl' >no</div>
                        <RiCheckboxBlankFill onClick={() => setEstructura(false)} className={`${estructura == false ? "text-naja  mt-1 ml-3 " : " text-mio mt-1 ml-3"} cursor-pointer`} />
                    </div>

                </div>
            </div>

            <div className='bg-[#f5f2f2] rounded-2xl mt-2'>
                <div className="flex items-center pt-4 mb-3">
                    <div className="ml-1 w-8"><hr /></div>
                    <div className="pl-2">Primer piso</div>
                    <div className="flex-1 pl-2"><hr /></div>
                </div>

                <div className='flex flex-wrap gap-y-1 text-2xl p-1 pr-3'>
                    <div className='pl-3 text-xl' >Torta Circular</div>
                    <RiCheckboxBlankFill onClick={() => estadoDeForma("circulo")} className={`${circulo == true ? "text-naja  mt-1 ml-3 " : " text-mio mt-1 ml-3"} cursor-pointer`} />

                    <div className='pl-3 text-xl' >Torta Cuadrada</div>
                    <RiCheckboxBlankFill onClick={() => estadoDeForma("cuadrado")} className={`${cuadrado == true ? "text-naja  mt-1 ml-3 " : " text-mio mt-1 ml-3"} cursor-pointer`} />

                    <div className='pl-3 text-xl' >Torta Rectangular</div>
                    <RiCheckboxBlankFill onClick={() => estadoDeForma("regtangulo")} className={`${regtangular == true ? "text-naja  mt-1 ml-3 " : " text-mio mt-1 ml-3"} cursor-pointer`} />

                </div>

                <div className="flex flex-col lg:flex-row lg:items-center pl-4 pr-4 pt-4">

                    <div className='pr-2'>

                        <div className='flex flex-col lg:flex-row'>
                            <div>
                                <div className="text-xl pr-2" >
                                    Tamaño
                                </div>
                            </div>
                            <div>
                                <div ref={refs.tamaño} className="relative">

                                    <div onClick={() => alternar("tamaño")} className={`${(tamaño == null) ? "text-gray-400" : "text-black"} bg-cyan-50 border-2 border-mio  pl-2 py-2 w-full sm:w-80 cursor-pointer`}>
                                        {tamaño?.medida ?? "Ninguno"}

                                    </div>

                                    <div className={`absolute z-10 bg-white border rounded shadow-lg  w-full sm:w-80 ${abiertos.tamaño ? "" : "hidden"}`}>
                                        <ul>

                                            {listadeTamaños.map((slide, slideIndex) => (

                                                <div key={slideIndex} className=''>

                                                    <li onClick={() => { cambiarTamaño(listadeTamaños[slideIndex], "tamaño"); cerrar("tamaño") }} className={` block px-4 py-2 hover:bg-red-100`}  >
                                                        {listadeTamaños[slideIndex].medida}
                                                    </li>

                                                </div>
                                            ))}

                                        </ul>
                                    </div>
                                </div>

                                <div>
                                    <label >
                                        <p className={`${camposVacios && tamaño == null ? "visible" : "invisible"} mb-5 mt-1 text-red-600 `}># Seleccione un tamaño</p>
                                    </label>
                                </div>
                            </div>
                        </div>

                    </div>

                    <div className="flex flex-col lg:flex-row lg:ml-5 pr-2">

                        <div>
                            <div className="text-xl pr-2" >
                                Bizcochuelo
                            </div>
                        </div>
                        <div>
                            <div ref={refs.bizcochuelo} className="relative">

                                <div onClick={() => alternar("bizcochuelo")} className={`${(bizcochuelo == null) ? "text-gray-400" : "text-black"} bg-cyan-50 border-2 border-mio   pl-2 py-2 w-full sm:w-80  cursor-pointer`}>
                                    {bizcochuelo?.bizcochuelo ?? "Ninguno"}

                                </div>

                                <div className={`absolute z-10 bg-white border rounded shadow-lg  w-full sm:w-80 ${abiertos.bizcochuelo ? "" : "hidden"}`}>
                                    <ul>

                                        {saboresbizcochuelo.map((slide, slideIndex) => (

                                            <div key={slideIndex} className=''>

                                                <li onClick={() => { cambiarSaborBizcochuelo(saboresbizcochuelo[slideIndex], "bizcochuelo"); cerrar("bizcochuelo") }} className={` block px-4 py-2 hover:bg-red-100`}  >
                                                    {saboresbizcochuelo[slideIndex].bizcochuelo}
                                                </li>

                                            </div>
                                        ))}

                                    </ul>
                                </div>
                            </div>
                            <div>
                                <label >
                                    <p className={`${camposVacios && bizcochuelo == null ? "visible" : "invisible"} mb-5 mt-1 text-red-600 `}># Seleccione un bizcochuelo</p>
                                </label>
                            </div>
                        </div>

                    </div>

                </div>
                {mostrarSegunFormaUnPiso()}

            </div>

            {(currenrIndex + 1 == 2 || currenrIndex + 1 == 3) ? mostrarSegundoPiso() : ""}

            {(currenrIndex + 1 == 3) ? mostrarTercerPiso() : ""}

        </div></>
    }

    const detalleDeGalleta = () => {
        return <>
            <div className='w-full max-w-265 mt-2 mb-2 text-xl font-medium pl-4 bg-amber-200'>
                Detalle de Galletas
            </div>

            <div className='flex flex-col lg:flex-row gap-4 lg:gap-25 pl-4 pr-4 pt-5 bg-[#f5f2f2] rounded-2xl'>
                <div className="relative group ">
                    <div className='mb-5 pl-2' >
                        Sabor :

                    </div>
                    <div className={`${(sabor == "Ninguno") ? "text-gray-400" : "text-black"}  bg-cyan-50 border-2 border-mio   pl-2 py-2 w-full sm:w-80 `}>
                        {sabor}

                    </div>

                    <div className="absolute hidden group-hover:block z-10 bg-white border rounded shadow-lg  w-full sm:w-80">
                        <ul>
                            {saboresDeGalletitas.map((slide, slideIndex) => (

                                <div key={slideIndex} className=''>

                                    <li onClick={() => cambiarSabor(saboresDeGalletitas[slideIndex].sabor)} className={` block px-4 py-2 hover:bg-red-100`}  >
                                        {saboresDeGalletitas[slideIndex].sabor}
                                    </li>

                                </div>
                            ))}

                        </ul>
                    </div>

                    <label >
                        <p className={`${camposVacios && sabor == "Ninguno" ? "visible" : "invisible"} mb-5 mt-1 text-red-600 `}># Seleccione un sabor</p>
                    </label>
                </div>

                <div>
                    <div className='mb-5'>
                        Cantidad :
                    </div>
                    <div className=''>
                        <input ref={inputCantidadGalletasRef} onChange={(e) => cambiarCantidadGalletas(e)} className="bg-cyan-50 border-2 border-mio text-amber-950 w-full sm:w-80 py-2 pl-2" type="text" placeholder="Introducir Cantidad" />

                    </div>
                    <label >
                        <p className={`${camposVacios && cantidadGalletas <= 0 ? "visible" : "invisible"} mb-5 mt-1 text-red-600 `}># Introduzca una cantidad valida</p>
                    </label>
                </div>
            </div>
        </>
    }
    const resetearCamposDeTorta = () => {

        setTamaño(null)
        setTamañoDos(null)
        setTamañoTres(null)
        setRelleno("Ninguno")
        setRellenoDos("Ninguno")
        setRellenoTres("Ninguno")
        setRellenoCuatro("Ninguno")
        setRellenoCinco("Ninguno")
        setRellenoSeis("Ninguno")
        setRellenoSiete("Ninguno")
        setRellenoOcho("Ninguno")
        setRellenoNueve("Ninguno")
        setBizcochuelo(null)
        setBizcochueloDos(null)
        setBizcochueloTres(null)
    }
    const reasetearCamposDeGalletita = () => {

        if (inputCantidadGalletasRef.current) {
            inputCantidadGalletasRef.current.value = "";
        }
        setSabor(saboresDeGalletitas[0].sabor)
        setCantidadGalletas(0)
    }
    const resetearCamposDeCupcakes = () => {
        if (inputCantidadCupcakesRef.current) {
            inputCantidadCupcakesRef.current.value = "";
        }
        setSaborCupcake(saboresCupkakes[0].sabor)
        setCantidadDeCupcake(0)
    }
    const resetearCamposDeCakePops = () => {
        if (inputCantidadCakePopsRef.current) {
            inputCantidadCakePopsRef.current.value = "";
        }

        setCantidadDeCakePops(0)
    }
    const resetearCamposDePaletas = () => {
        if (inputCantidadPaletasRef.current) {
            inputCantidadPaletasRef.current.value = "";
        }

        setCantidadDePaletas(0)
    }
    const resetearCamposDeMinidonas = () => {
        if (inputCantidadMinidonasRef.current) {
            inputCantidadMinidonasRef.current.value = "";
        }

        setCantidadDeMinidonas(0)
    }
    const resetearCamposDeOreos = () => {
        if (inputCantidadOreosRef.current) {
            inputCantidadOreosRef.current.value = "";
        }

        setCantidadDeOreos(0)
    }

    const resetearCamposInformacionBasica = () => {

        if (inputNombreRef.current) {
            inputNombreRef.current.value = "";
            setNombre("")
        }

        if (inputPrecioRef.current) {
            inputPrecioRef.current.value = "";
            setPrecio(0)
        }

        setCategoria("Ninguno")
        setSubCategoria("Ninguno")

        if (inputDescripcionRef.current) {
            inputDescripcionRef.current.value = "";
            setDescripcion("")
        }
        setIngredientes("")
        setAlergenos([])
        setTrazas([])

        if (inputImagenRef.current) {
            inputImagenRef.current.value = "";
            setImagePath("v1776224771/uploadTarjeta_dxdtwg.jpg")
            setFile(null)
        }

        if (inputImagenDosRef.current) {
            inputImagenDosRef.current.value = "";
            setImagePathdos("v1776224771/uploadTarjeta_dxdtwg.jpg")
            setFiledos(null)
        }

        if (inputImagenTresRef.current) {
            inputImagenTresRef.current.value = "";
            setImagePathtres("v1776224771/uploadTarjeta_dxdtwg.jpg")
            setFiletres(null)
        }

        if (inputImagenCuatroRef.current) {
            inputImagenCuatroRef.current.value = "";
            setImagePathcuatro("v1776224771/uploadTarjeta_dxdtwg.jpg")
            setFilecuatro(null)
        }

    }
    const resetearSegunTipoDeProducto = () => {
        if (tipo == "Torta") {
            resetearCamposInformacionBasica()
            resetearCamposDeTorta()
            setCamposVacios(false)
        } else if (tipo == "Galleta") {
            resetearCamposInformacionBasica()
            reasetearCamposDeGalletita()
            setCamposVacios(false)
        } else if (tipo == "Cupcakes") {
            resetearCamposInformacionBasica()
            resetearCamposDeCupcakes()
            setCamposVacios(false)

        } else if (tipo == "Cakepops") {
            resetearCamposInformacionBasica()
            resetearCamposDeCakePops()
            setCamposVacios(false)

        } else if (tipo == "Paletas") {
            resetearCamposInformacionBasica()
            resetearCamposDePaletas()
            setCamposVacios(false)

        } else if (tipo == "Minidonas") {
            resetearCamposInformacionBasica()
            resetearCamposDeMinidonas()
            setCamposVacios(false)

        } else if (tipo == "Oreos") {
            resetearCamposInformacionBasica()
            resetearCamposDeOreos()
            setCamposVacios(false)

        }

        else {
            resetearCamposInformacionBasica()
            resetearCamposDeTorta()
            reasetearCamposDeGalletita()
            resetearCamposDeCupcakes()
            resetearCamposDeMinidonas()
            resetearCamposDeOreos()
            resetearCamposDePaletas()

            setCamposVacios(false)
        }
    }

    const mostrarSegunFormaUnPiso = () => {
        if (cuadrado == false && regtangular == false) {
            return <>
                <div className={` flex flex-col lg:flex-row pl-4 pr-4 `}>

                    <div className="text-xl pr-2" >
                        Relleno uno
                    </div>
                    <div>
                        <div ref={refs.relleno} className="relative">

                            <div onClick={() => alternar("relleno")} className={`${(relleno == "Ninguno") ? "text-gray-400" : "text-black"} bg-cyan-50 border-2 border-mio   pl-2 py-2 w-full lg:w-50  cursor-pointer`}>
                                {relleno}

                            </div>

                            <div className={`absolute z-10 bg-white border rounded shadow-lg  w-full sm:w-80 ${abiertos.relleno ? "" : "hidden"}`}>
                                <ul>

                                    {listaDeSabores.map((slide, slideIndex) => (

                                        <div key={slideIndex} className=''>

                                            <li onClick={() => { cambiarRelleno(listaDeSabores[slideIndex].sabor, "relleno"); cerrar("relleno") }} className={` block px-4 py-2 hover:bg-red-100`}  >
                                                {listaDeSabores[slideIndex].sabor}
                                            </li>

                                        </div>
                                    ))}

                                </ul>
                            </div>
                        </div>

                        <label >
                            <p className={`${camposVacios && relleno == "Ninguno" ? "visible" : "invisible"} mb-5 mt-1 text-red-600 `}># Seleccione un relleno</p>
                        </label>

                    </div>

                    <div className="text-xl pr-2 lg:ml-5 mt-2 lg:mt-0" >
                        Relleno dos
                    </div>
                    <div>
                        <div ref={refs.rellenoDos} className="relative">

                            <div onClick={() => alternar("rellenoDos")} className={`${(rellenoDos == "Ninguno") ? "text-gray-400" : "text-black"} bg-cyan-50 border-2 border-mio   pl-2 py-2 w-full lg:w-50  cursor-pointer`}>
                                {rellenoDos}

                            </div>

                            <div className={`absolute z-10 bg-white border rounded shadow-lg  w-full sm:w-80 ${abiertos.rellenoDos ? "" : "hidden"}`}>
                                <ul>

                                    {listaDeSabores.map((slide, slideIndex) => (

                                        <div key={slideIndex} className=''>

                                            <li onClick={() => { cambiarRelleno(listaDeSabores[slideIndex].sabor, "relleno2"); cerrar("rellenoDos") }} className={` block px-4 py-2 hover:bg-red-100`}  >
                                                {listaDeSabores[slideIndex].sabor}
                                            </li>

                                        </div>
                                    ))}

                                </ul>
                            </div>
                        </div>

                    </div>

                    <div className="text-xl pr-2 lg:ml-5 mt-2 lg:mt-0" >
                        Relleno tres
                    </div>
                    <div>
                        <div ref={refs.rellenoTres} className="relative">

                            <div onClick={() => alternar("rellenoTres")} className={`${(rellenoTres == "Ninguno") ? "text-gray-400" : "text-black"} bg-cyan-50 border-2 border-mio   pl-2 py-2 w-full lg:w-50  cursor-pointer`}>
                                {rellenoTres}

                            </div>

                            <div className={`absolute z-10 bg-white border rounded shadow-lg  w-full sm:w-80 ${abiertos.rellenoTres ? "" : "hidden"}`}>
                                <ul>

                                    {listaDeSabores.map((slide, slideIndex) => (

                                        <div key={slideIndex} className=''>

                                            <li onClick={() => { cambiarRelleno(listaDeSabores[slideIndex].sabor, "relleno3"); cerrar("rellenoTres") }} className={` block px-4 py-2 hover:bg-red-100`}  >
                                                {listaDeSabores[slideIndex].sabor}
                                            </li>

                                        </div>
                                    ))}

                                </ul>
                            </div>
                        </div>

                    </div>

                </div>
            </>
        } else {

            return <>
                <div className={` flex flex-col lg:flex-row pl-4 pr-4 `}>

                    <div className="text-xl pr-2" >
                        Relleno uno
                    </div>
                    <div>
                        <div ref={refs.relleno} className="relative">

                            <div onClick={() => alternar("relleno")} className={`${(relleno == "Ninguno") ? "text-gray-400" : "text-black"} bg-cyan-50 border-2 border-mio   pl-2 py-2 w-full lg:w-50  cursor-pointer`}>
                                {relleno}

                            </div>

                            <div className={`absolute z-10 bg-white border rounded shadow-lg  w-full sm:w-80 ${abiertos.relleno ? "" : "hidden"}`}>
                                <ul>

                                    {listaDeSabores.map((slide, slideIndex) => (

                                        <div key={slideIndex} className=''>

                                            <li onClick={() => { cambiarRelleno(listaDeSabores[slideIndex].sabor, "relleno"); cerrar("relleno") }} className={` block px-4 py-2 hover:bg-red-100`}  >
                                                {listaDeSabores[slideIndex].sabor}
                                            </li>

                                        </div>
                                    ))}

                                </ul>
                            </div>
                        </div>

                        <label >
                            <p className={`${camposVacios && relleno == "Ninguno" ? "visible" : "invisible"} mb-5 mt-1 text-red-600 `}># Seleccione un relleno</p>
                        </label>

                    </div>

                    <div className="text-xl pr-2 lg:ml-5 mt-2 lg:mt-0" >
                        Relleno dos
                    </div>
                    <div>
                        <div ref={refs.rellenoDos} className="relative">

                            <div onClick={() => alternar("rellenoDos")} className={`${(rellenoDos == "Ninguno") ? "text-gray-400" : "text-black"} bg-cyan-50 border-2 border-mio   pl-2 py-2 w-full lg:w-50  cursor-pointer`}>
                                {rellenoDos}

                            </div>

                            <div className={`absolute z-10 bg-white border rounded shadow-lg  w-full sm:w-80 ${abiertos.rellenoDos ? "" : "hidden"}`}>
                                <ul>

                                    {listaDeSabores.map((slide, slideIndex) => (

                                        <div key={slideIndex} className=''>

                                            <li onClick={() => { cambiarRelleno(listaDeSabores[slideIndex].sabor, "relleno2"); cerrar("rellenoDos") }} className={` block px-4 py-2 hover:bg-red-100`}  >
                                                {listaDeSabores[slideIndex].sabor}
                                            </li>

                                        </div>
                                    ))}

                                </ul>
                            </div>
                        </div>

                    </div>

                </div>

            </>

        }
    }
    const mostrarSegunFormaDosPisos = () => {
        if (cuadrado == false && regtangular == false) {
            return <>
                <div className={` flex flex-col lg:flex-row pl-4 pr-4 `}>

                    <div className="text-xl pr-2" >
                        Relleno uno
                    </div>
                    <div>
                        <div ref={refs.rellenoCuatro} className="relative">

                            <div onClick={() => alternar("rellenoCuatro")} className={`${(rellenoCuatro == "Ninguno") ? "text-gray-400" : "text-black"} bg-cyan-50 border-2 border-mio   pl-2 py-2 w-full lg:w-50  cursor-pointer`}>
                                {rellenoCuatro}

                            </div>

                            <div className={`absolute z-10 bg-white border rounded shadow-lg  w-full sm:w-80 ${abiertos.rellenoCuatro ? "" : "hidden"}`}>
                                <ul>

                                    {listaDeSabores.map((slide, slideIndex) => (

                                        <div key={slideIndex} className=''>

                                            <li onClick={() => { cambiarRelleno(listaDeSabores[slideIndex].sabor, "relleno4"); cerrar("rellenoCuatro") }} className={` block px-4 py-2 hover:bg-red-100`}  >
                                                {listaDeSabores[slideIndex].sabor}
                                            </li>

                                        </div>
                                    ))}

                                </ul>
                            </div>
                        </div>

                        <label >
                            <p className={`${camposVacios && rellenoCuatro == "Ninguno" ? "visible" : "invisible"} mb-5 mt-1 text-red-600 `}># Seleccione un relleno</p>
                        </label>

                    </div>

                    <div className="text-xl pr-2 lg:ml-5 mt-2 lg:mt-0" >
                        Relleno dos
                    </div>
                    <div>
                        <div ref={refs.rellenoCinco} className="relative">

                            <div onClick={() => alternar("rellenoCinco")} className={`${(rellenoCinco == "Ninguno") ? "text-gray-400" : "text-black"} bg-cyan-50 border-2 border-mio   pl-2 py-2 w-full lg:w-50  cursor-pointer`}>
                                {rellenoCinco}

                            </div>

                            <div className={`absolute z-10 bg-white border rounded shadow-lg  w-full sm:w-80 ${abiertos.rellenoCinco ? "" : "hidden"}`}>
                                <ul>

                                    {listaDeSabores.map((slide, slideIndex) => (

                                        <div key={slideIndex} className=''>

                                            <li onClick={() => { cambiarRelleno(listaDeSabores[slideIndex].sabor, "relleno5"); cerrar("rellenoCinco") }} className={` block px-4 py-2 hover:bg-red-100`}  >
                                                {listaDeSabores[slideIndex].sabor}
                                            </li>

                                        </div>
                                    ))}

                                </ul>
                            </div>
                        </div>

                    </div>

                    <div className="text-xl pr-2 lg:ml-5 mt-2 lg:mt-0" >
                        Relleno tres
                    </div>
                    <div>
                        <div ref={refs.rellenoSeis} className="relative">

                            <div onClick={() => alternar("rellenoSeis")} className={`${(rellenoSeis == "Ninguno") ? "text-gray-400" : "text-black"} bg-cyan-50 border-2 border-mio   pl-2 py-2 w-full lg:w-50  cursor-pointer`}>
                                {rellenoSeis}

                            </div>

                            <div className={`absolute z-10 bg-white border rounded shadow-lg  w-full sm:w-80 ${abiertos.rellenoSeis ? "" : "hidden"}`}>
                                <ul>

                                    {listaDeSabores.map((slide, slideIndex) => (

                                        <div key={slideIndex} className=''>

                                            <li onClick={() => { cambiarRelleno(listaDeSabores[slideIndex].sabor, "relleno6"); cerrar("rellenoSeis") }} className={` block px-4 py-2 hover:bg-red-100`}  >
                                                {listaDeSabores[slideIndex].sabor}
                                            </li>

                                        </div>
                                    ))}

                                </ul>
                            </div>
                        </div>

                    </div>

                </div>
            </>
        } else {

            return <>
                <div className={` flex flex-col lg:flex-row pl-4 pr-4 `}>

                    <div className="text-xl pr-2" >
                        Relleno uno
                    </div>
                    <div>
                        <div ref={refs.rellenoCuatro} className="relative">

                            <div onClick={() => alternar("rellenoCuatro")} className={`${(rellenoCuatro == "Ninguno") ? "text-gray-400" : "text-black"} bg-cyan-50 border-2 border-mio   pl-2 py-2 w-full lg:w-50  cursor-pointer`}>
                                {rellenoCuatro}

                            </div>

                            <div className={`absolute z-10 bg-white border rounded shadow-lg  w-full sm:w-80 ${abiertos.rellenoCuatro ? "" : "hidden"}`}>
                                <ul>

                                    {listaDeSabores.map((slide, slideIndex) => (

                                        <div key={slideIndex} className=''>

                                            <li onClick={() => { cambiarRelleno(listaDeSabores[slideIndex].sabor, "relleno4"); cerrar("rellenoCuatro") }} className={` block px-4 py-2 hover:bg-red-100`}  >
                                                {listaDeSabores[slideIndex].sabor}
                                            </li>

                                        </div>
                                    ))}

                                </ul>
                            </div>
                        </div>

                        <label >
                            <p className={`${camposVacios && rellenoCuatro == "Ninguno" ? "visible" : "invisible"} mb-5 mt-1 text-red-600 `}># Seleccione un relleno</p>
                        </label>

                    </div>

                    <div className="text-xl pr-2 lg:ml-5 mt-2 lg:mt-0" >
                        Relleno dos
                    </div>
                    <div>
                        <div ref={refs.rellenoCinco} className="relative">

                            <div onClick={() => alternar("rellenoCinco")} className={`${(rellenoCinco == "Ninguno") ? "text-gray-400" : "text-black"} bg-cyan-50 border-2 border-mio   pl-2 py-2 w-full lg:w-50  cursor-pointer`}>
                                {rellenoCinco}

                            </div>

                            <div className={`absolute z-10 bg-white border rounded shadow-lg  w-full sm:w-80 ${abiertos.rellenoCinco ? "" : "hidden"}`}>
                                <ul>

                                    {listaDeSabores.map((slide, slideIndex) => (

                                        <div key={slideIndex} className=''>

                                            <li onClick={() => { cambiarRelleno(listaDeSabores[slideIndex].sabor, "relleno5"); cerrar("rellenoCinco") }} className={` block px-4 py-2 hover:bg-red-100`}  >
                                                {listaDeSabores[slideIndex].sabor}
                                            </li>

                                        </div>
                                    ))}

                                </ul>
                            </div>
                        </div>

                    </div>

                </div>

            </>

        }
    }
    const mostrarSegunFormaTresPisos = () => {
        if (cuadrado == false && regtangular == false) {
            return <>
                <div className={` flex flex-col lg:flex-row pl-4 pr-4 `}>

                    <div className="text-xl pr-2" >
                        Relleno uno
                    </div>
                    <div>
                        <div ref={refs.rellenoSiete} className="relative">

                            <div onClick={() => alternar("rellenoSiete")} className={`${(rellenoSiete == "Ninguno") ? "text-gray-400" : "text-black"} bg-cyan-50 border-2 border-mio   pl-2 py-2 w-full lg:w-50  cursor-pointer`}>
                                {rellenoSiete}

                            </div>

                            <div className={`absolute z-10 bg-white border rounded shadow-lg  w-full sm:w-80 ${abiertos.rellenoSiete ? "" : "hidden"}`}>
                                <ul>

                                    {listaDeSabores.map((slide, slideIndex) => (

                                        <div key={slideIndex} className=''>

                                            <li onClick={() => { cambiarRelleno(listaDeSabores[slideIndex].sabor, "relleno7"); cerrar("rellenoSiete") }} className={` block px-4 py-2 hover:bg-red-100`}  >
                                                {listaDeSabores[slideIndex].sabor}
                                            </li>

                                        </div>
                                    ))}

                                </ul>
                            </div>
                        </div>

                        <label >
                            <p className={`${camposVacios && rellenoSiete == "Ninguno" ? "visible" : "invisible"} mb-5 mt-1 text-red-600 `}># Seleccione un relleno</p>
                        </label>

                    </div>

                    <div className="text-xl pr-2 lg:ml-5 mt-2 lg:mt-0" >
                        Relleno dos
                    </div>
                    <div>
                        <div ref={refs.rellenoOcho} className="relative">

                            <div onClick={() => alternar("rellenoOcho")} className={`${(rellenoOcho == "Ninguno") ? "text-gray-400" : "text-black"} bg-cyan-50 border-2 border-mio   pl-2 py-2 w-full lg:w-50  cursor-pointer`}>
                                {rellenoOcho}

                            </div>

                            <div className={`absolute z-10 bg-white border rounded shadow-lg  w-full sm:w-80 ${abiertos.rellenoOcho ? "" : "hidden"}`}>
                                <ul>

                                    {listaDeSabores.map((slide, slideIndex) => (

                                        <div key={slideIndex} className=''>

                                            <li onClick={() => { cambiarRelleno(listaDeSabores[slideIndex].sabor, "relleno8"); cerrar("rellenoOcho") }} className={` block px-4 py-2 hover:bg-red-100`}  >
                                                {listaDeSabores[slideIndex].sabor}
                                            </li>

                                        </div>
                                    ))}

                                </ul>
                            </div>
                        </div>

                    </div>

                    <div className="text-xl pr-2 lg:ml-5 mt-2 lg:mt-0" >
                        Relleno tres
                    </div>
                    <div>
                        <div ref={refs.rellenoNueve} className="relative">

                            <div onClick={() => alternar("rellenoNueve")} className={`${(rellenoNueve == "Ninguno") ? "text-gray-400" : "text-black"} bg-cyan-50 border-2 border-mio   pl-2 py-2 w-full lg:w-50  cursor-pointer`}>
                                {rellenoNueve}

                            </div>

                            <div className={`absolute z-10 bg-white border rounded shadow-lg  w-full sm:w-80 ${abiertos.rellenoNueve ? "" : "hidden"}`}>
                                <ul>

                                    {listaDeSabores.map((slide, slideIndex) => (

                                        <div key={slideIndex} className=''>

                                            <li onClick={() => { cambiarRelleno(listaDeSabores[slideIndex].sabor, "relleno9"); cerrar("rellenoNueve") }} className={` block px-4 py-2 hover:bg-red-100`}  >
                                                {listaDeSabores[slideIndex].sabor}
                                            </li>

                                        </div>
                                    ))}

                                </ul>
                            </div>
                        </div>

                    </div>

                </div>
            </>
        } else {

            return <>
                <div className={` flex flex-col lg:flex-row pl-4 pr-4 `}>

                    <div className="text-xl pr-2" >
                        Relleno uno
                    </div>
                    <div>
                        <div ref={refs.rellenoSiete} className="relative">

                            <div onClick={() => alternar("rellenoSiete")} className={`${(rellenoSiete == "Ninguno") ? "text-gray-400" : "text-black"} bg-cyan-50 border-2 border-mio   pl-2 py-2 w-full lg:w-50  cursor-pointer`}>
                                {rellenoSiete}

                            </div>

                            <div className={`absolute z-10 bg-white border rounded shadow-lg  w-full sm:w-80 ${abiertos.rellenoSiete ? "" : "hidden"}`}>
                                <ul>

                                    {listaDeSabores.map((slide, slideIndex) => (

                                        <div key={slideIndex} className=''>

                                            <li onClick={() => { cambiarRelleno(listaDeSabores[slideIndex].sabor, "relleno7"); cerrar("rellenoSiete") }} className={` block px-4 py-2 hover:bg-red-100`}  >
                                                {listaDeSabores[slideIndex].sabor}
                                            </li>

                                        </div>
                                    ))}

                                </ul>
                            </div>
                        </div>

                        <label >
                            <p className={`${camposVacios && rellenoSiete == "Ninguno" ? "visible" : "invisible"} mb-5 mt-1 text-red-600 `}># Seleccione un relleno</p>
                        </label>

                    </div>

                    <div className="text-xl pr-2 lg:ml-5 mt-2 lg:mt-0" >
                        Relleno dos
                    </div>
                    <div>
                        <div ref={refs.rellenoOcho} className="relative">

                            <div onClick={() => alternar("rellenoOcho")} className={`${(rellenoOcho == "Ninguno") ? "text-gray-400" : "text-black"} bg-cyan-50 border-2 border-mio   pl-2 py-2 w-full lg:w-50  cursor-pointer`}>
                                {rellenoOcho}

                            </div>

                            <div className={`absolute z-10 bg-white border rounded shadow-lg  w-full sm:w-80 ${abiertos.rellenoOcho ? "" : "hidden"}`}>
                                <ul>

                                    {listaDeSabores.map((slide, slideIndex) => (

                                        <div key={slideIndex} className=''>

                                            <li onClick={() => { cambiarRelleno(listaDeSabores[slideIndex].sabor, "relleno8"); cerrar("rellenoOcho") }} className={` block px-4 py-2 hover:bg-red-100`}  >
                                                {listaDeSabores[slideIndex].sabor}
                                            </li>

                                        </div>
                                    ))}

                                </ul>
                            </div>
                        </div>

                    </div>

                </div>

            </>

        }
    }
    const detalleDeCakePops = () => {

        return <>
            <div className='w-full max-w-265 mt-2 mb-2 text-xl font-medium pl-4 bg-amber-200'>
                Detalle de CakePops
            </div>

            <div className='flex flex-col lg:flex-row gap-4 lg:gap-25 pl-4 pr-4 pt-5 bg-[#f5f2f2] rounded-2xl'>

                <div>
                    <div className='mb-5'>
                        Cantidad :{cantidadDeCakePops}
                    </div>
                    <div className=''>
                        <input ref={inputCantidadCakePopsRef} onChange={(e) => cambiarCantidadCakePops(e)} className="bg-cyan-50 border-2 border-mio text-amber-950 w-full sm:w-80 py-2 pl-2" type="text" placeholder="Introducir Cantidad" />
                    </div>
                    <label >
                        <p className={`${camposVacios && cantidadDeCakePops <= 0 ? "visible" : "invisible"} mb-5 mt-1 text-red-600 `}># Introduzca una cantidad valida</p>
                    </label>
                </div>
            </div>

        </>
    }
    const detalleDePaletas = () => {

        return <>
            <div className='w-full max-w-265 mt-2 mb-2 text-xl font-medium pl-4 bg-amber-200'>
                Detalle de Paletas
            </div>

            <div className='flex flex-col lg:flex-row gap-4 lg:gap-25 pl-4 pr-4 pt-5 bg-[#f5f2f2] rounded-2xl'>

                <div>
                    <div className='mb-5'>
                        Cantidad :{cantidadDePaletas}
                    </div>
                    <div className=''>
                        <input ref={inputCantidadPaletasRef} onChange={(e) => cambiarCantidadPaletas(e)} className="bg-cyan-50 border-2 border-mio text-amber-950 w-full sm:w-80 py-2 pl-2" type="text" placeholder="Introducir Cantidad" />
                    </div>
                    <label >
                        <p className={`${camposVacios && cantidadDePaletas <= 0 ? "visible" : "invisible"} mb-5 mt-1 text-red-600 `}># Introduzca una cantidad valida</p>
                    </label>
                </div>
            </div>

        </>
    }
    const detalleDeMinidonas = () => {

        return <>
            <div className='w-full max-w-265 mt-2 mb-2 text-xl font-medium pl-4 bg-amber-200'>
                Detalle de Minidonas
            </div>

            <div className='flex flex-col lg:flex-row gap-4 lg:gap-25 pl-4 pr-4 pt-5 bg-[#f5f2f2] rounded-2xl'>

                <div>
                    <div className='mb-5'>
                        Cantidad :{cantidadDeMinidonas}
                    </div>
                    <div className=''>
                        <input ref={inputCantidadMinidonasRef} onChange={(e) => cambiarCantidadMinidonas(e)} className="bg-cyan-50 border-2 border-mio text-amber-950 w-full sm:w-80 py-2 pl-2" type="text" placeholder="Introducir Cantidad" />
                    </div>
                    <label >
                        <p className={`${camposVacios && cantidadDeMinidonas <= 0 ? "visible" : "invisible"} mb-5 mt-1 text-red-600 `}># Introduzca una cantidad valida</p>
                    </label>
                </div>
            </div>

        </>
    }
    const detalleDeOreos = () => {

        return <>
            <div className='w-full max-w-265 mt-2 mb-2 text-xl font-medium pl-4 bg-amber-200'>
                Detalle de Oreos
            </div>

            <div className='flex flex-col lg:flex-row gap-4 lg:gap-25 pl-4 pr-4 pt-5 bg-[#f5f2f2] rounded-2xl'>

                <div>
                    <div className='mb-5'>
                        Cantidad :{cantidadDeOreos}
                    </div>
                    <div className=''>
                        <input ref={inputCantidadOreosRef} onChange={(e) => cambiarCantidadOroes(e)} className="bg-cyan-50 border-2 border-mio text-amber-950 w-full sm:w-80 py-2 pl-2" type="text" placeholder="Introducir Cantidad" />
                    </div>
                    <label >
                        <p className={`${camposVacios && cantidadDeOreos <= 0 ? "visible" : "invisible"} mb-5 mt-1 text-red-600 `}># Introduzca una cantidad valida</p>
                    </label>
                </div>
            </div>

        </>
    }
    const detalleDeCupcakes = () => {
        return <>
            <div className='w-full max-w-265 mt-2 mb-2 text-xl font-medium pl-4 bg-amber-200'>
                Detalle de Cupcakes
            </div>

            <div className='flex flex-col lg:flex-row gap-4 lg:gap-25 pl-4 pr-4 pt-5 bg-[#f5f2f2] rounded-2xl'>
                <div className="relative group ">
                    <div className='mb-5' >
                        Sabor :

                    </div>
                    <div className={`${(saborCupcakes == "Ninguno") ? "text-gray-400" : "text-black"}  bg-cyan-50 border-2 border-mio   pl-2 py-2 w-full sm:w-80 `}>
                        {saborCupcakes}

                    </div>

                    <div className="absolute hidden group-hover:block z-10 bg-white border rounded shadow-lg  w-full sm:w-80">
                        <ul>
                            {saboresCupkakes.map((slide, slideIndex) => (

                                <div key={slideIndex} className=''>

                                    <li onClick={() => cambiarSaborCupcake(saboresCupkakes[slideIndex].sabor)} className={` block px-4 py-2 hover:bg-red-100`}  >
                                        {saboresCupkakes[slideIndex].sabor}
                                    </li>

                                </div>
                            ))}

                        </ul>
                    </div>
                    <label >
                        <p className={`${camposVacios && saborCupcakes == "Ninguno" ? "visible" : "invisible"} mb-5 mt-1 text-red-600 `}># Seleccione un sabor</p>
                    </label>
                </div>

                <div>
                    <div className='mb-5'>
                        Cantidad :
                    </div>
                    <div className=''>
                        <input ref={inputCantidadCupcakesRef} onChange={(e) => cambiarCantidadCupcakes(e)} className="bg-cyan-50 border-2 border-mio text-amber-950 w-full sm:w-80 py-2 pl-2" type="text" placeholder="Introducir Cantidad" />
                    </div>
                    <label >
                        <p className={`${camposVacios && cantidadDeCupcakes <= 0 ? "visible" : "invisible"} mb-5 mt-1 text-red-600 `}># Introduzca una cantidad valida</p>
                    </label>
                </div>
            </div>

        </>
    }
    const mostrarSegundoPiso = () => {
        return <> <div className='bg-[#f5f2f2] rounded-2xl mt-2'>
            <div className="flex items-center mb-3  ">
                <div className="ml-1 w-8 mt-4"><hr /></div>
                <div className="pl-2 mt-4">Segundo piso</div>
                <div className="flex-1 pl-2 mt-4"><hr /></div>
            </div>

            <div className="flex flex-col lg:flex-row pl-4 pr-4 pt-4">

                <div className="text-xl pr-2" >
                    Tamaño
                </div>
                <div>
                    <div ref={refs.tamañoDos} className="relative">

                        <div onClick={() => alternar("tamañoDos")} className={`${(tamañoDos == null) ? "text-gray-400" : "text-black"} bg-cyan-50 border-2 border-mio  pl-2 py-2 w-full sm:w-80 cursor-pointer`}>
                            {tamañoDos?.medida ?? "Ninguno"}

                        </div>

                        <div className={`absolute z-10 bg-white border rounded shadow-lg  w-full sm:w-80 ${abiertos.tamañoDos ? "" : "hidden"}`}>
                            <ul>

                                {listadeTamaños.map((slide, slideIndex) => (

                                    <div key={slideIndex} className=''>

                                        <li onClick={() => { cambiarTamaño(listadeTamaños[slideIndex], "tamañoDos"); cerrar("tamañoDos") }} className={` block px-4 py-2 hover:bg-red-100`}  >
                                            {listadeTamaños[slideIndex].medida}
                                        </li>

                                    </div>
                                ))}

                            </ul>
                        </div>
                    </div>
                    <label >
                        <p className={`${camposVacios && tamañoDos == null ? "visible" : "invisible"} mb-5 mt-1 text-red-600 `}># Seleccione un tamaño</p>
                    </label>
                </div>

                <div className="text-xl pr-2 lg:ml-5 mt-2 lg:mt-0" >
                    Bizcochuelo
                </div>
                <div>
                    <div ref={refs.bizcochueloDos} className="relative">

                        <div onClick={() => alternar("bizcochueloDos")} className={`${(bizcochueloDos == null) ? "text-gray-400" : "text-black"} bg-cyan-50 border-2 border-mio   pl-2 py-2 w-full sm:w-80  cursor-pointer`}>
                            {bizcochueloDos?.bizcochuelo ?? "Ninguno"}

                        </div>

                        <div className={`absolute z-10 bg-white border rounded shadow-lg  w-full sm:w-80 ${abiertos.bizcochueloDos ? "" : "hidden"}`}>
                            <ul>

                                {saboresbizcochuelo.map((slide, slideIndex) => (

                                    <div key={slideIndex} className=''>

                                        <li onClick={() => { cambiarSaborBizcochuelo(saboresbizcochuelo[slideIndex], "bizcochueloDos"); cerrar("bizcochueloDos") }} className={` block px-4 py-2 hover:bg-red-100`}  >
                                            {saboresbizcochuelo[slideIndex].bizcochuelo}
                                        </li>

                                    </div>
                                ))}

                            </ul>
                        </div>
                    </div>
                    <label >
                        <p className={`${camposVacios && bizcochueloDos == null ? "visible" : "invisible"} mb-5 mt-1 text-red-600 `}># Seleccione un bizcochuelo</p>
                    </label>
                </div>

            </div>
            {mostrarSegunFormaDosPisos()}
        </div></>

    }
    const mostrarTercerPiso = () => {
        return <> <div className='bg-[#f5f2f2] rounded-2xl mt-2'>
            <div className="flex items-center  mb-3">
                <div className="ml-1 w-8 mt-4"><hr /></div>
                <div className="pl-2 mt-4">Tercer piso</div>
                <div className="flex-1 pl-2 mt-4"><hr /></div>
            </div>

            <div className="flex flex-col lg:flex-row pl-4 pr-4 pt-4">

                <div className="text-xl pr-2" >
                    Tamaño
                </div>
                <div>
                    <div ref={refs.tamañoTres} className="relative">

                        <div onClick={() => alternar("tamañoTres")} className={`${(tamañoTres == null) ? "text-gray-400" : "text-black"} bg-cyan-50 border-2 border-mio  pl-2 py-2 w-full sm:w-80 cursor-pointer`}>
                            {tamañoTres?.medida ?? "Ninguno"}

                        </div>

                        <div className={`absolute z-10 bg-white border rounded shadow-lg  w-full sm:w-80 ${abiertos.tamañoTres ? "" : "hidden"}`}>
                            <ul>

                                {listadeTamaños.map((slide, slideIndex) => (

                                    <div key={slideIndex} className=''>

                                        <li onClick={() => { cambiarTamaño(listadeTamaños[slideIndex], "tamañoTres"); cerrar("tamañoTres") }} className={` block px-4 py-2 hover:bg-red-100`}  >
                                            {listadeTamaños[slideIndex].medida}
                                        </li>

                                    </div>
                                ))}

                            </ul>
                        </div>
                    </div>
                    <label >
                        <p className={`${camposVacios && tamañoTres == null ? "visible" : "invisible"} mb-5 mt-1 text-red-600 `}># Seleccione un tamaño</p>
                    </label>
                </div>

                <div className="text-xl pr-2 lg:ml-5 mt-2 lg:mt-0" >
                    Bizcochuelo
                </div>
                <div>

                    <div ref={refs.bizcochueloTres} className="relative">

                        <div onClick={() => alternar("bizcochueloTres")} className={`${(bizcochueloTres == null) ? "text-gray-400" : "text-black"} bg-cyan-50 border-2 border-mio   pl-2 py-2 w-full sm:w-80  cursor-pointer`}>
                            {bizcochueloTres?.bizcochuelo ?? "Ninguno"}

                        </div>

                        <div className={`absolute z-10 bg-white border rounded shadow-lg  w-full sm:w-80 ${abiertos.bizcochueloTres ? "" : "hidden"}`}>
                            <ul>

                                {saboresbizcochuelo.map((slide, slideIndex) => (

                                    <div key={slideIndex} className=''>

                                        <li onClick={() => { cambiarSaborBizcochuelo(saboresbizcochuelo[slideIndex], "bizcochueloTres"); cerrar("bizcochueloTres") }} className={` block px-4 py-2 hover:bg-red-100`}  >
                                            {saboresbizcochuelo[slideIndex].bizcochuelo}
                                        </li>

                                    </div>
                                ))}

                            </ul>
                        </div>
                    </div>
                    <label >
                        <p className={`${camposVacios && bizcochueloTres == null ? "visible" : "invisible"} mb-5 mt-1 text-red-600 `}># Seleccione un bizcochuelo</p>
                    </label>
                </div>

            </div>
            {mostrarSegunFormaTresPisos()}

        </div></>

    }
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, num: number) => {

        if (!e.target.files?.[0]) {
            switch (num) {
                case 2:
                    setImagePathdos("/uploads/espacioVacio.jpg")
                    setFiledos(null)
                    return;
                case 3:
                    setImagePathtres("/uploads/espacioVacio.jpg")
                    setFiletres(null)
                    return;
                case 4:
                    setImagePathcuatro("/uploads/espacioVacio.jpg")
                    setFilecuatro(null)
                    return;
                default:
                    setFile(null)
                    setImagePath("/uploads/espacioVacio.jpg")
                    return;
            }
        }

        const imagePat = URL.createObjectURL(e.target.files?.[0]);

        switch (num) {
            case 2:
                setImagePathdos(imagePat);
                setFiledos(e.target.files?.[0]);
                break;
            case 3:
                setImagePathtres(imagePat);
                setFiletres(e.target.files?.[0]);
                break;
            case 4:
                setImagePathcuatro(imagePat);
                setFilecuatro(e.target.files?.[0]);
                break;
            default:
                setImagePath(imagePat);
                setFile(e.target.files?.[0]);
        }

    };
    const cambiarTipo = (nuevoTipo: String) => {
        if (nuevoTipo == tipo) {
            return
        }
        setTipo(nuevoTipo)
        if (nuevoTipo == "Torta") {
            resetearCamposInformacionBasica()
            resetearCamposDeCupcakes()
            reasetearCamposDeGalletita()
            resetearCamposDeCakePops()
            resetearCamposDeMinidonas()
            resetearCamposDeOreos()
            resetearCamposDePaletas()
            setCamposVacios(false)
        }
        if (nuevoTipo == "Galleta") {
            resetearCamposInformacionBasica()
            resetearCamposDeTorta()
            resetearCamposDeCupcakes()
            resetearCamposDeCakePops()
            resetearCamposDeMinidonas()
            resetearCamposDeOreos()
            resetearCamposDePaletas()
            setCamposVacios(false)
        }
        if (nuevoTipo == "Cupcakes") {
            resetearCamposInformacionBasica()
            resetearCamposDeTorta()
            reasetearCamposDeGalletita()
            resetearCamposDeCakePops()
            resetearCamposDeMinidonas()
            resetearCamposDeOreos()
            resetearCamposDePaletas()
            setCamposVacios(false)
        }
        if (nuevoTipo == "Variado") {
            resetearCamposInformacionBasica()
            resetearCamposDeTorta()
            reasetearCamposDeGalletita()
            resetearCamposDeCupcakes()
            resetearCamposDeCakePops()
            resetearCamposDeMinidonas()
            resetearCamposDeOreos()
            resetearCamposDePaletas()
            setCamposVacios(false)
        }
        if (nuevoTipo == "Paletas") {
            resetearCamposInformacionBasica()
            resetearCamposDeTorta()
            reasetearCamposDeGalletita()
            resetearCamposDeCupcakes()
            resetearCamposDeCakePops()
            resetearCamposDeMinidonas()
            resetearCamposDeOreos()

            setCamposVacios(false)
        }
        if (nuevoTipo == "Oreos") {
            resetearCamposInformacionBasica()
            resetearCamposDeTorta()
            reasetearCamposDeGalletita()
            resetearCamposDeCupcakes()
            resetearCamposDeCakePops()
            resetearCamposDeMinidonas()

            resetearCamposDePaletas()
            setCamposVacios(false)
        }
        if (nuevoTipo == "Minidonas") {
            resetearCamposInformacionBasica()
            resetearCamposDeTorta()
            reasetearCamposDeGalletita()
            resetearCamposDeCupcakes()
            resetearCamposDeCakePops()

            resetearCamposDeOreos()
            resetearCamposDePaletas()
            setCamposVacios(false)
        }
        if (nuevoTipo == "Cakepops") {
            resetearCamposInformacionBasica()
            resetearCamposDeTorta()
            reasetearCamposDeGalletita()
            resetearCamposDeCupcakes()

            resetearCamposDeMinidonas()
            resetearCamposDeOreos()
            resetearCamposDePaletas()
            setCamposVacios(false)
        }

    }
    const cambiaNombre = (e: React.ChangeEvent<HTMLInputElement>) => {

        if (!/^[a-zA-Z0-9\s]+$/.test(e.target.value)) {
            setCamposVacios(true)
            setNombre("")
            return;
        }
        setNombre(e.target.value)

    }
    const cambiaPrecio = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (isNaN(parseInt(e.target.value))) {
            setPrecio(0)
            setNumeroNegativo(false)
            return;
        }
        if (parseInt(e.target.value) < 0) {
            setNumeroNegativo(true)
            setPrecio(0)
            return;
        }
        setPrecio(parseInt(e.target.value))

    }
    const cambiarCantidadGalletas = (e: React.ChangeEvent<HTMLInputElement>) => {

        setCantidadGalletas(parseInt(e.target.value))

    }
    const cambiarCantidadCupcakes = (e: React.ChangeEvent<HTMLInputElement>) => {

        setCantidadDeCupcake(parseInt(e.target.value))

    }
    const cambiarCantidadMinidonas = (e: React.ChangeEvent<HTMLInputElement>) => {

        setCantidadDeMinidonas(parseInt(e.target.value))

    }
    const cambiarCantidadPaletas = (e: React.ChangeEvent<HTMLInputElement>) => {

        setCantidadDePaletas(parseInt(e.target.value))

    }
    const cambiarCantidadOroes = (e: React.ChangeEvent<HTMLInputElement>) => {

        setCantidadDeOreos(parseInt(e.target.value))

    }
    const cambiarCantidadCakePops = (e: React.ChangeEvent<HTMLInputElement>) => {

        setCantidadDeCakePops(parseInt(e.target.value))

    }
    const cambiarCategoria = (nuevaCategoria: string) => {
        const nuevoTipo = tipoSegunCategoria[nuevaCategoria]
        if (nuevoTipo) {
            cambiarTipo(nuevoTipo)
        }
        setCategoria(nuevaCategoria)
    }
    const cambiarSubcategoria = (e: string) => {
        setSubCategoria(e)
    }
    const cargarDescripcion = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setDescripcion(e.target.value)
    }
    const cambiarTamaño = (e: TamañoCatalogo, t: String) => {
        switch (t) {
            case "tamaño":
                setTamaño(e)
                break;
            case "tamañoDos":
                setTamañoDos(e)
                break;
            case "tamañoTres":
                setTamañoTres(e)
                break;
            default:
                break;
        }

    }
    const cambiarSaborBizcochuelo = (e: Bizcochuelo, b: String) => {
        switch (b) {
            case "bizcochuelo":
                setBizcochuelo(e)
                break;
            case "bizcochueloDos":
                setBizcochueloDos(e)
                break;
            case "bizcochueloTres":
                setBizcochueloTres(e)
                break;

            default:
                break;
        }

    }
    const cambiarRelleno = (e: String, r: String) => {

        switch (r) {
            case "relleno":
                setRelleno(e)
                break;
            case "relleno2":
                setRellenoDos(e)
                break;
            case "relleno3":
                setRellenoTres(e)
                break;
            case "relleno4":
                setRellenoCuatro(e)
                break;
            case "relleno5":
                setRellenoCinco(e)
                break;
            case "relleno6":
                setRellenoSeis(e)
                break;
            case "relleno7":
                setRellenoSiete(e)
                break;
            case "relleno8":
                setRellenoOcho(e)
                break;
            case "relleno9":
                setRellenoNueve(e)
                break;

            default:
                break;
        }

    }
    const cambiarSabor = (s: String) => {
        setSabor(s);
    }
    const cambiarSaborCupcake = (s: String) => {
        setSaborCupcake(s);
    }

    const listaRellenos = () => {
        let lista: SaborEntity[] = []
        let relleno1: SaborEntity = {
            idLista_sabor: idDeSabor(relleno)
        }
        let relleno2: SaborEntity = {
            idLista_sabor: idDeSabor(rellenoDos)
        }
        let relleno3: SaborEntity = {
            idLista_sabor: idDeSabor(rellenoTres)
        }
        let relleno4: SaborEntity = {
            idLista_sabor: idDeSabor(rellenoCuatro)
        }
        let relleno5: SaborEntity = {
            idLista_sabor: idDeSabor(rellenoCinco)
        }
        let relleno6: SaborEntity = {
            idLista_sabor: idDeSabor(rellenoSeis)
        }
        let relleno7: SaborEntity = {
            idLista_sabor: idDeSabor(rellenoSiete)
        }
        let relleno8: SaborEntity = {
            idLista_sabor: idDeSabor(rellenoOcho)
        }
        let relleno9: SaborEntity = {
            idLista_sabor: idDeSabor(rellenoNueve)
        }

        if (pisosSeleccionados == 1) {
            if (cuadrado == false && regtangular == false) {
                lista.push(relleno1)
                lista.push(relleno2)
                lista.push(relleno3)
            } else {
                lista.push(relleno1)
                lista.push(relleno2)
            }

        }
        if (pisosSeleccionados == 2) {
            if (cuadrado == false && regtangular == false) {
                lista.push(relleno1)
                lista.push(relleno2)
                lista.push(relleno3)
                lista.push(relleno4)
                lista.push(relleno5)
                lista.push(relleno6)
            } else {
                lista.push(relleno1)
                lista.push(relleno2)
                lista.push(relleno4)
                lista.push(relleno5)
            }
        }
        if (pisosSeleccionados == 3) {
            if (cuadrado == false && regtangular == false) {
                lista.push(relleno1)
                lista.push(relleno2)
                lista.push(relleno3)
                lista.push(relleno4)
                lista.push(relleno5)
                lista.push(relleno6)
                lista.push(relleno7)
                lista.push(relleno8)
                lista.push(relleno9)
            } else {
                lista.push(relleno1)
                lista.push(relleno2)
                lista.push(relleno4)
                lista.push(relleno5)
                lista.push(relleno7)
                lista.push(relleno8)
            }
        }
        return lista
    }
    const obtenerTipoDeProducto = () => {

        let detallTorta: DetalleTortaEntity | null = null
        let detalGalle: DetalleGalletaEntity | null = null
        let tipoProducto: TipoDeProductoEntity | null = null
        let detallCupcake: DetalleCupcakeEntity | null = null
        let detallCakePops: DetalleCakePopsEntity | null = null
        let detallMinidonas: DetalleMinidonasEntity | null = null
        let detallPaletas: DetallePaletasEntity | null = null
        let detalleOreos: DetalleOreosEntity | null = null

        if (tipo == "Torta") {
            detallTorta = {

                pisos: pisosSeleccionados,
                estructura: estructura,
                sabores: listaRellenos(),
                tamaño: tamaño ? { idLista_tamaño: tamaño.idLista_tamaño } : null,
                tamañoDos: tamañoDos ? { idLista_tamaño: tamañoDos.idLista_tamaño } : null,
                tamañoTres: tamañoTres ? { idLista_tamaño: tamañoTres.idLista_tamaño } : null,
                bizcochuelo: bizcochuelo ? { idLista_bizcochuelo: bizcochuelo.idLista_bizcochuelo } : null,
                bizcochueloDos: bizcochueloDos ? { idLista_bizcochuelo: bizcochueloDos.idLista_bizcochuelo } : null,
                bizcochueloTres: bizcochueloTres ? { idLista_bizcochuelo: bizcochueloTres.idLista_bizcochuelo } : null

            }

            tipoProducto = {
                detalleDeTorta: detallTorta,
                detalleDeGalleta: detalGalle,
                detalleDeCupcake: detallCupcake,
                detalleDeCakePops: detallCakePops,
                detalleDeMinidonas: detallMinidonas,
                detalleDePaletas: detallPaletas,
                detalleDeOreos: detalleOreos,
                tipo: "TORTA"
            }

        }
        if (tipo == "Galleta") {

            detalGalle = {
                sabor: sabor.toLocaleUpperCase(),
                cantidad: cantidadGalletas
            }

            tipoProducto = {
                detalleDeTorta: detallTorta,
                detalleDeGalleta: detalGalle,
                detalleDeCupcake: detallCupcake,
                detalleDeCakePops: detallCakePops,
                detalleDeMinidonas: detallMinidonas,
                detalleDePaletas: detallPaletas,
                detalleDeOreos: detalleOreos,
                tipo: "GALLETA"
            }

        }
        if (tipo == "Cupcakes") {
            detallCupcake = {
                sabor: saborCupcakes.toLocaleUpperCase(),
                cantidad: cantidadDeCupcakes
            }

            tipoProducto = {
                detalleDeTorta: detallTorta,
                detalleDeGalleta: detalGalle,
                detalleDeCupcake: detallCupcake,
                detalleDeCakePops: detallCakePops,
                detalleDeMinidonas: detallMinidonas,
                detalleDePaletas: detallPaletas,
                detalleDeOreos: detalleOreos,
                tipo: "CUPCAKE"
            }
        }
        if (tipo == "Variado") {
            tipoProducto = {
                detalleDeTorta: detallTorta,
                detalleDeGalleta: detalGalle,
                detalleDeCupcake: detallCupcake,
                detalleDeCakePops: detallCakePops,
                detalleDeMinidonas: detallMinidonas,
                detalleDePaletas: detallPaletas,
                detalleDeOreos: detalleOreos,

                tipo: "VARIADO"
            }
        }
        if (tipo == "Cakepops") {
            detallCakePops = {
                cantidadCakePops: cantidadDeCakePops
            }
            tipoProducto = {
                detalleDeTorta: detallTorta,
                detalleDeGalleta: detalGalle,
                detalleDeCupcake: detallCupcake,
                detalleDeCakePops: detallCakePops,
                detalleDeMinidonas: detallMinidonas,
                detalleDePaletas: detallPaletas,
                detalleDeOreos: detalleOreos,
                tipo: "CAKEPOPS"
            }
        }
        if (tipo == "Minidonas") {
            detallMinidonas = {
                cantidadMinidonas: cantidadDeMinidonas
            }
            tipoProducto = {
                detalleDeTorta: detallTorta,
                detalleDeGalleta: detalGalle,
                detalleDeCupcake: detallCupcake,
                detalleDeCakePops: detallCakePops,
                detalleDeMinidonas: detallMinidonas,
                detalleDePaletas: detallPaletas,
                detalleDeOreos: detalleOreos,
                tipo: "MINIDONAS"
            }
        }

        if (tipo == "Paletas") {
            detallPaletas = {
                cantidadPaletas: cantidadDePaletas
            }
            tipoProducto = {
                detalleDeTorta: detallTorta,
                detalleDeGalleta: detalGalle,
                detalleDeCupcake: detallCupcake,
                detalleDeCakePops: detallCakePops,
                detalleDeMinidonas: detallMinidonas,
                detalleDePaletas: detallPaletas,
                detalleDeOreos: detalleOreos,
                tipo: "PALETAS"
            }
        }
        if (tipo == "Oreos") {
            detalleOreos = {
                cantidadOreos: cantidadDeOreos
            }
            tipoProducto = {
                detalleDeTorta: detallTorta,
                detalleDeGalleta: detalGalle,
                detalleDeCupcake: detallCupcake,
                detalleDeCakePops: detallCakePops,
                detalleDeMinidonas: detallMinidonas,
                detalleDePaletas: detallPaletas,
                detalleDeOreos: detalleOreos,
                tipo: "OREOS"
            }
        }

        console.log(tipoProducto)

        return tipoProducto

    }

    async function subirImagen(file: File | null) {

        if (file == null) {
            return "v1776224771/uploadTarjeta_dxdtwg.jpg"
        }
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await apiFetch('/upload', {
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                },
                body: formData,
            });
            const data = response.text();

            return data;
        } catch (error) {
            console.error("Error al subir la imagen:", error);
            return "/uploads/espacioVacio.jpg";
        }
    }

    const validarFormulario = () => {
        const estado: boolean = false

        if (nombre == "" || precio == 0 || categoria == "Ninguno" || descripcion == "") {

            toast.warning("Por favor complete los campos obligatorios en Informacion basica")
            setCamposVacios(true)
            return estado
        }

        if (tipo == tiposDeProducto[0].producto && pisosSeleccionados == 1) {
            if (tamaño == null || bizcochuelo == null || relleno == "Ninguno") {
                toast.warning("Por favor complete los campos obligatorios En Detalle de torta")
                setCamposVacios(true)
                return estado

            }
        }
        if (tipo == tiposDeProducto[0].producto && pisosSeleccionados == 2) {
            if (tamaño == null || bizcochuelo == null || relleno == "Ninguno" || tamañoDos == null || bizcochueloDos == null || rellenoCuatro == "Ninguno") {
                toast.warning("Por favor complete los campos obligatorios En Detalle de torta")
                setCamposVacios(true)
                return estado

            }
        }
        if (tipo == tiposDeProducto[0].producto && pisosSeleccionados == 3) {
            if (tamaño == null || bizcochuelo == null || relleno == "Ninguno" || tamañoDos == null || bizcochueloDos == null || rellenoCuatro == "Ninguno" || tamañoTres == null || bizcochueloTres == null || rellenoSiete == "Ninguno") {
                toast.warning("Por favor complete los campos obligatorios En Detalle de torta")
                setCamposVacios(true)
                return estado
            }
        }

        return true
    }

    async function cargarProducto(c: React.FormEvent<HTMLFormElement>) {
        c.preventDefault();

        if (validarFormulario()) {

            try {

                const producto: ProductoEntity = {

                    nombre: nombre,
                    precio: precio,
                    url_image: await subirImagen(file),
                    url_image2: await subirImagen(filedos),
                    url_image3: await subirImagen(filetres),
                    url_image4: await subirImagen(filecuatro),
                    descripcion: descripcion,
                    categoria: categoria.toUpperCase().replace(/[\s/]/g, ""),
                    subcategoria: subCategoria.toUpperCase().replace(/[\s/]/g, ""),
                    categoesp: 3,
                    tipoDeProducto: obtenerTipoDeProducto(),
                    ingredientes: ingredientes.trim() === "" ? null : ingredientes.trim(),
                    alergenos: alergenos,
                    trazas: trazas,
                    suspendido: false

                }
                console.log(producto)
                const res = await apiFetch("/registrarProducto", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${getToken()}`,
                    },
                    body: JSON.stringify(producto)
                })
                if (res.ok) {
                    toast.success("Producto subido correctamente");
                    resetearSegunTipoDeProducto()

                } else if (res.status === 409) {
                    toast.warning("Ya existe un producto con ese nombre")
                } else {
                    toast.warning("No se pudo guardar el producto")
                }

            } catch (error) {

                toast.warning("Error al subir la imagen");

            }

        }
    }

    useEffect(() => {
        if (!sesion || !sesion.esAdmin) {
            router.replace("/")
        }
    }, [sesion, router])

    if (!sesion || !sesion.esAdmin) {
        return null
    }

    return (

        <div className="flex justify-center mb-20 sm:mb-50 mt-5 px-3">
            <div className="w-full max-w-265">

                <div className="w-full max-w-265 mb-3">
                    <Link href="/configuracionesAdmi"
                        className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 border border-gray-200 rounded-full px-4 py-2 text-sm font-semibold text-gray-600 shadow-sm transition-colors duration-300 cursor-pointer">
                        <ArrowLeft size={16} />
                        Volver a administración
                    </Link>
                </div>

                <div className="w-full max-w-265 mt-2  text-xl font-medium pl-4 bg-amber-200">
                    Informacion basica
                </div>

                <div className="mt-2 ">
                    <div>
                        <form onSubmit={(c) => cargarProducto(c)}>

                            <div className="flex flex-col xl:flex-row gap-6 xl:gap-0 pl-3 pr-3 xl:pr-0 pt-4 mb-6 bg-[#f5f2f2] rounded-2xl">

                                <div>

                                    <div className='w-full xl:w-85'>

                                        <div>
                                            <div className='mb-2'>
                                                Nombre :
                                            </div>
                                            <div className=''>
                                                <input ref={inputNombreRef} onChange={(e) => cambiaNombre(e)} className="bg-cyan-50 border-2 border-mio text-amber-950 w-full sm:w-80 py-2 pl-2" type="text" placeholder="Introducir Nombre" />
                                            </div>
                                            <label className='' >
                                                <p className={`${camposVacios && nombre === "" ? "visible" : "invisible"} mb-3 mt-1 text-red-600 `}># introduzca el nombre</p>
                                            </label>
                                        </div>

                                        <div>
                                            <div ref={refs.categoria} className="relative">
                                                <div className='mb-2' >
                                                    Categoria :

                                                </div>
                                                <div onClick={() => alternar("categoria")} className={`${(categoria == "Ninguno") ? "text-gray-400" : "text-black"}  bg-cyan-50 border-2 border-mio   pl-2 py-2 w-full sm:w-80 cursor-pointer `}>
                                                    {categoria}

                                                </div>

                                                <div className={`absolute z-10 bg-white border rounded shadow-lg  w-full sm:w-80 ${abiertos.categoria ? "" : "hidden"}`}>
                                                    <ul>
                                                        {categorias.map((slide, slideIndex) => (

                                                            <div key={slideIndex} className=''>

                                                                <li onClick={() => { cambiarCategoria(categorias[slideIndex].nombre); cerrar("categoria") }} className={` block px-4 py-2 hover:bg-red-100`}  >
                                                                    {categorias[slideIndex].nombre}
                                                                </li>

                                                            </div>
                                                        ))}

                                                    </ul>
                                                </div>
                                                <label >
                                                    <p className={`${camposVacios && categoria == "Ninguno" ? "visible" : "invisible"} mt-1 text-red-600 `}># introduzca la categoria</p>
                                                </label>
                                            </div>
                                        </div>

                                        <div>
                                            <div ref={refs.subCategoria} className="relative">
                                                <div className='mb-2' >
                                                    Subcategoria :

                                                </div>
                                                <div onClick={() => alternar("subCategoria")} className={`${(subCategoria == "Ninguno") ? "text-gray-400" : "text-black"}  bg-cyan-50 border-2 border-mio   pl-2 py-2 w-full sm:w-80 cursor-pointer `}>
                                                    {subCategoria}

                                                </div>

                                                <div className={`absolute z-10 bg-white border rounded shadow-lg  w-full sm:w-80 h-80 overflow-auto ${abiertos.subCategoria ? "" : "hidden"}`}>
                                                    <ul>
                                                        {subCategorias.map((slide, slideIndex) => (

                                                            <div key={slideIndex} className=''>

                                                                <li onClick={() => { cambiarSubcategoria(subCategorias[slideIndex].nombre); cerrar("subCategoria") }} className={` block px-4 py-2 hover:bg-red-100`}  >
                                                                    {subCategorias[slideIndex].nombre}
                                                                </li>

                                                            </div>
                                                        ))}

                                                    </ul>
                                                </div>
                                                <label >
                                                    <p className={`${camposVacios && subCategoria == "Ninguno" ? "visible" : "invisible"} mt-1 text-red-600 `}># introduzca la subcategoria</p>
                                                </label>
                                            </div>
                                        </div>

                                        <div>
                                            <div className='mb-3'>
                                                Precio : {precio}
                                            </div>
                                            <div className=''>
                                                <input ref={inputPrecioRef} onChange={(e) => cambiaPrecio(e)} className="bg-cyan-50 border-2 border-mio text-amber-950 w-full sm:w-80 py-2 pl-2" type="text" placeholder="Introducir Precio" />
                                            </div>
                                            <label className='' >
                                                <p className={`${camposVacios && precio == 0 ? "visible" : "invisible"} mt-1 text-red-600 `}># introduzca el precio</p>
                                            </label>
                                            <label className='' >
                                                <p className={`${numeronegativo && precio == 0 ? "visible" : "invisible"}  mt-1 text-red-600 `}># introduzca un precio mayor </p>
                                            </label>
                                        </div>
                                    </div>

                                    <div className='bg-amber-100 rounded-xl w-full sm:w-80 h-80 xl:mr-10'>
                                        <div className='pt-2 pl-3 pb-2'>Descripcion</div>

                                        <textarea ref={inputDescripcionRef} onChange={(e) => { cargarDescripcion(e) }}
                                            className="block pl-2 pt-2 bg-white ml-2 w-[calc(100%-1rem)] sm:w-75 h-65 rounded-md resize-none border-gray-300 shadow-sm focus:border-black  sm:text-sm"

                                            placeholder="ingrese la descripcion">
                                        </textarea>
                                    </div>
                                    <label >
                                        <p className={`${camposVacios && descripcion == "" ? "visible" : "invisible"} mt-1 text-red-600 `}># introduzca la descripcion</p>
                                    </label>

                                </div>

                                <div className='w-full xl:w-168 xl:shrink-0'>

                                    <div className='grid grid-cols-2 gap-3 sm:gap-8 mb-3'>

                                        <div>
                                            <div>
                                                <Image src={`${imagePath}`}
                                                    loader={clodinaryLoader}
                                                    className='w-full h-auto aspect-square object-cover rounded-xl'
                                                    alt={''}
                                                    width={500}
                                                    height={500} />
                                            </div>

                                            <div className='pt-4'>
                                                <label className="block bg-cyan-50 h-10 w-full truncate border-2 border-mio rounded-sm ">
                                                    <input
                                                        type="file"
                                                        accept='image/*'
                                                        ref={inputImagenRef}

                                                        placeholder="selecione archivo"
                                                        className='from-primary-600 hidden '

                                                        onChange={(e) => handleFileChange(e, 1)}
                                                    />

                                                    <div className='mt-1 m-3 text-gray-600'>{`${file == null ? "seleccionar imagen uno" : file.name}`} </div>

                                                </label>
                                            </div>

                                            <label >
                                                <p className={`${camposVacios && file == null ? "visible" : "invisible"} mt-1 text-red-600 `}># seleccione al menos una imagen</p>
                                            </label>
                                        </div>

                                        <div >
                                            <div>
                                                <Image src={`${imagePathdos}`}
                                                    className='w-full h-auto aspect-square object-cover rounded-xl'
                                                    loader={clodinaryLoader}
                                                    alt={''}
                                                    width={500}
                                                    height={500} />
                                            </div>

                                            <div className='pt-4'>
                                                <label className="block bg-cyan-50 h-10 w-full truncate border-2 border-mio rounded-sm mb-5">
                                                    <input
                                                        type="file"
                                                        accept='image/*'
                                                        ref={inputImagenDosRef}
                                                        placeholder="selecione archivo"
                                                        className='from-primary-600 hidden '

                                                        onChange={(e) => handleFileChange(e, 2)}
                                                    />

                                                    <div className='mt-1 m-3 text-gray-600'>{`${filedos == null ? "seleccionar imagen dos" : filedos.name}`} </div>

                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    <div className='grid grid-cols-2 gap-3 sm:gap-8'>
                                        <div>
                                            <div>
                                                <Image src={`${imagePathtres}`}
                                                    loader={clodinaryLoader}
                                                    className='w-full h-auto aspect-square object-cover rounded-xl'
                                                    alt={''}
                                                    width={500}
                                                    height={500} />
                                            </div>

                                            <div className='pt-4'>
                                                <label className="block bg-cyan-50 h-10 w-full truncate border-2 border-mio rounded-sm mb-5">
                                                    <input
                                                        type="file"
                                                        accept='image/*'
                                                        ref={inputImagenTresRef}
                                                        placeholder="selecione archivo"
                                                        className='from-primary-600 hidden '

                                                        onChange={(e) => handleFileChange(e, 3)}
                                                    />

                                                    <div className='mt-1 m-3 text-gray-600'>{`${filetres == null ? "seleccionar imagen tres" : filetres.name}`} </div>

                                                </label>
                                            </div>
                                        </div>
                                        <div>
                                            <div>
                                                <Image src={`${imagePathcuatro}`}
                                                    className='w-full h-auto aspect-square object-cover rounded-xl'
                                                    loader={clodinaryLoader}
                                                    alt={''}
                                                    width={500}
                                                    height={500} />
                                            </div>

                                            <div className='pt-4'>
                                                <label className="block bg-cyan-50 h-10 w-full truncate border-2 border-mio rounded-sm mb-5">
                                                    <input
                                                        type="file"
                                                        accept='image/*'
                                                        ref={inputImagenCuatroRef}
                                                        placeholder="selecione archivo"
                                                        className='from-primary-600 hidden '

                                                        onChange={(e) => handleFileChange(e, 4)}
                                                    />

                                                    <div className='mt-1 m-3 text-gray-600'>{`${filecuatro == null ? "seleccionar imagen cuatro" : filecuatro.name}`} </div>

                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                </div>

                            </div>

                            {(tipo == "Torta") ? detalleDeTorta() : (tipo == "Galleta") ? detalleDeGalleta() : (tipo == "Cupcakes") ?
                                detalleDeCupcakes() : (tipo == "Cakepops") ? detalleDeCakePops() : (tipo == "Paletas") ? detalleDePaletas() :
                                    (tipo == "Minidonas") ? detalleDeMinidonas() : (tipo == "Oreos") ? detalleDeOreos() :
                                        <div className='w-full max-w-265 mt-2  text-xl font-medium pl-4 bg-amber-200 mb-5'> Detalle su producto en la descripcion</div>}

                            <div className='w-full max-w-265 mt-2 mb-2 text-xl font-medium pl-4 bg-amber-200'>
                                Ingredientes y alérgenos
                            </div>
                            <div className='w-full max-w-265 flex flex-col gap-4 bg-amber-100 rounded-xl px-4 py-4 mb-5'>
                                <div className='flex flex-col gap-1'>
                                    <span className='text-sm text-gray-600'>Ingredientes (opcional)</span>
                                    <textarea value={ingredientes} onChange={(e) => setIngredientes(e.target.value)} rows={2}
                                        placeholder="Ej: harina de trigo, huevo, manteca, azúcar, dulce de leche"
                                        className="block pl-2 pt-2 bg-white rounded-md resize-none border-gray-300 shadow-sm sm:text-sm" />
                                </div>
                                <SelectorAlergenos titulo="Contiene" seleccionados={alergenos} onChange={setAlergenos} />
                                <SelectorAlergenos titulo="Puede contener trazas de" seleccionados={trazas} onChange={setTrazas} variante="trazas" />
                                {tipo == "Torta" && (
                                    <p className='text-sm text-gray-600'>En tortas cargá los alérgenos de la base (decoración, cobertura). Los de cada relleno y bizcochuelo se cargan una vez en su catálogo y la ficha los suma según lo que elija el cliente.</p>
                                )}
                            </div>

                            <hr />

                            <div className='flex flex-col sm:flex-row sm:justify-end mt-5 sm:gap-6'>
                                <div >
                                    <button type='button'
                                        onClick={() => resetearSegunTipoDeProducto()}
                                        className=' py-2 px-6  bg-green-500 text-white
                                   rounded-full cursor-pointer font-bold text-center shadow-xs transition-all duration-500
                                   hover:bg-green-700 w-full sm:w-60 mb-5'>
                                        <div className='flex items-center justify-center pr-5'>

                                            <div className='pl-2'>Resetear</div>

                                        </div>

                                    </button>
                                </div>
                                <div>
                                    <button type='submit' className=' py-2 px-6  bg-indigo-500 text-white
                                   rounded-full cursor-pointer font-bold text-center shadow-xs transition-all duration-500
                                   hover:bg-indigo-700 w-full sm:w-60 mb-5'>
                                        <div className='flex items-center justify-center pr-5'>

                                            <div className='pl-2'>Cargar Producto</div>

                                        </div>

                                    </button>
                                </div>
                            </div>

                            <ToastContainer
                                position="top-center"
                                autoClose={3000}
                                newestOnTop={false}
                                closeOnClick={false}
                                rtl={false}
                                pauseOnFocusLoss
                                draggable
                                theme="colored"
                                transition={Bounce}

                            />
                        </form>
                    </div>
                </div>

            </div>

        </div>
    )
}
