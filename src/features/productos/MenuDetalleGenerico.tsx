"use client"
import { ChevronDown, TriangleAlert } from "lucide-react"
import { oi } from "@/app/ui/fonts";
import { useState } from "react";
import { Producto } from "@/app/interfaces/producto.interface";
import { agregarAlCarrito, obtenerCarrito } from "@/features/carrito/carrito";
import { useSesionUsuario } from "@/features/auth/useSesionUsuario";
import { Bounce, toast, ToastContainer } from "react-toastify";
import ModalProductoEnCarrito from "@/features/carrito/ModalProductoEnCarrito";
import { CANTIDADES_BASICAS, ConfigMenuDetalle } from "./menuDetalleConfig";

interface Props {
    producto: Producto
    config: ConfigMenuDetalle
}

interface EstadoSeleccion {
    sabor: string | undefined;
    cant: number | undefined;
}

function leerEstadoInicial(config: ConfigMenuDetalle, producto: Producto): EstadoSeleccion {
    if (config.variante === "sabor-cantidad") {
        return {
            sabor: config.leerSaborInicial(producto),
            cant: config.leerCantidadInicial(producto),
        };
    }
    if (config.variante === "solo-cantidad") {
        return { sabor: undefined, cant: config.leerCantidadInicial(producto) };
    }
    return { sabor: undefined, cant: undefined };
}

function calcularPrecio(
    config: ConfigMenuDetalle,
    producto: Producto,
    sabor: string | undefined,
    cant: number | undefined
): number {
    const precioBase = producto.precio;
    if (!cant) return precioBase;

    // El precio cargado corresponde a la cantidad cargada: se divide para obtener
    // el precio por unidad y se multiplica por la cantidad elegida.
    const cantidadCargada = (config.variante === "sin-selector" ? undefined : config.leerCantidadInicial(producto)) || cant;
    const precioUnitario = precioBase / cantidadCargada;

    if (config.variante === "sabor-cantidad") {
        // El extra del sabor es un monto del total (no por unidad) y solo se
        // aplica al cambiar de sabor: con el sabor cargado el precio es el cargado.
        const extra = (nombre: string | undefined) =>
            config.sabores.find((o) => o.sabor == nombre)?.precio ?? 0;
        const diferenciaSabor = extra(sabor) - extra(config.leerSaborInicial(producto));
        return Math.round(precioUnitario * cant + diferenciaSabor);
    }
    if (config.variante === "solo-cantidad") {
        return Math.round(precioUnitario * cant);
    }
    return precioBase;
}

export default function MenuDetalleGenerico({ producto, config }: Props) {

    const inicial = leerEstadoInicial(config, producto);

    const [sabor, setSabor] = useState<string | undefined>(inicial.sabor);
    const [cant, setCant] = useState<number | undefined>(inicial.cant);
    const [precio, setPrecio] = useState<number>(
        calcularPrecio(config, producto, inicial.sabor, inicial.cant)
    );
    const [openSab, setOpenSab] = useState<Boolean>(false);
    const [openCant, setOpenCant] = useState<Boolean>(false);
    const sesion = useSesionUsuario();
    const [mostrarModalDuplicado, setMostrarModalDuplicado] = useState(false);

    const abrir = (tipo: String) => {
        if (tipo == "sabor") {
            setOpenSab((valor) => !valor);
        }
        if (tipo == "cantidad") {
            setOpenCant((valor) => !valor);
        }
    };

    const cerrar = (num: number, tipo: String) => {
        if (tipo == "sabor" && config.variante === "sabor-cantidad") {
            const nuevoSabor = config.sabores[num].sabor;
            setSabor(nuevoSabor);
            setPrecio(calcularPrecio(config, producto, nuevoSabor, cant));
            setOpenSab(false);
        }
        if (tipo == "cantidad" && config.variante !== "sin-selector") {
            const nuevaCantidad = CANTIDADES_BASICAS[num];
            setCant(nuevaCantidad);
            setPrecio(calcularPrecio(config, producto, sabor, nuevaCantidad));
            setOpenCant(false);
        }
    };

    const resetear = () => {
        const base = leerEstadoInicial(config, producto);
        setSabor(base.sabor);
        setCant(base.cant);
        setPrecio(calcularPrecio(config, producto, base.sabor, base.cant));
    };

    const construirDescripcion = (): string => {
        if (config.variante === "sabor-cantidad") {
            return `Sabor: ${sabor ?? "-"} | Cantidad: ${cant ?? "-"}`;
        }
        if (config.variante === "solo-cantidad") {
            return `Cantidad: ${cant ?? "-"}`;
        }
        return "";
    };

    const agregarCarrito = () => {
        if (!sesion) {
            toast.warning("Debes iniciar sesión o registrarte para agregar productos al carrito.", {
                position: "top-center",
                autoClose: 3000,
                theme: "colored",
                transition: Bounce,
            });
            return;
        }

        const yaEnCarrito = obtenerCarrito().some(
            (item) => item.idProducto === producto.idProducto
        );
        if (yaEnCarrito) {
            setMostrarModalDuplicado(true);
            return;
        }

        realizarAgregado();
    };

    const realizarAgregado = () => {
        agregarAlCarrito({
            idProducto: producto.idProducto,
            nombre: String(producto.nombre),
            imagen: String(producto.url_image),
            tipo: String(producto.tipoDeProducto?.tipo ?? config.tipoFallback),
            categoria: String(producto.categoria ?? ""),
            descripcion: construirDescripcion(),
            precioUnitario: precio,
        });
    };

    if (config.variante === "sin-selector") {
        return (
            <div className="relative px-4 pb-28 bg-blue-100 w-full h-full min-h-157 rounded-xl">

                <div className="flex justify-center pt-6 pb-4"><h2 className={`font-bold text-2xl underline text-cyan-900 ${oi.className}`}>{producto.nombre}
                </h2>
                </div>

                <div>
                    <div>
                        <h2 className={`font-bold text-2xl underline text-cyan-900 ${oi.className} pl-2 pt-8`}>Descripcion :</h2>
                    </div>

                    <div className="pl-2 mr-8 pb-4">
                        <p className="pt-4 text-lg text-gray-700">{producto.descripcion ? producto.descripcion : "Este producto no tiene una descripción cargada."}</p>
                        <p className="pt-2 text-lg text-gray-700 font-semibold">Categoría: {producto.categoria}</p>
                    </div>
                </div>

                <div className="absolute bottom-14 left-6 right-6 flex items-center justify-end">
                    <div className="flex">
                        <div className="flex items-center px-3 sm:px-4 py-1 h-9 whitespace-nowrap text-white text-base sm:text-lg font-medium rounded-l-2xl bg-[#0f98c5]">Precio Final</div>
                        <div className="flex items-center whitespace-nowrap text-gray-600 text-base sm:text-lg px-3 sm:px-4 py-1 bg-white h-9 rounded-r-lg">{producto.precio} $</div>
                    </div>
                </div>

                <div className="absolute bottom-3 left-6 right-6">
                    <button
                        onClick={() => agregarCarrito()}
                        className="w-full h-10 rounded-2xl bg-[#09c99f] hover:bg-[#07a88a] cursor-pointer"
                    >
                        <div className="text-white font-semibold text-heading text-xl">
                            Agregar al Carrito
                        </div>
                    </button>
                </div>

                <ToastContainer
                    position="top-center"
                    autoClose={3000}
                    theme="colored"
                    transition={Bounce}
                />

                <ModalProductoEnCarrito
                    abierto={mostrarModalDuplicado}
                    onCancelar={() => setMostrarModalDuplicado(false)}
                    onConfirmar={() => {
                        realizarAgregado();
                        setMostrarModalDuplicado(false);
                    }}
                />

            </div>
        );
    }

    return (
        <div className="relative px-4 pb-28 bg-blue-100 w-full h-full min-h-157 rounded-xl">

            <div className="flex justify-center pt-4 pb-4"><h2 className={`font-bold text-2xl underline text-cyan-900 ${oi.className}`}>{producto.nombre}
            </h2></div>
            <div className="flex items-center pt-5 w-full sm:w-fit sm:mx-auto">
                <div className="bg-amber-50 w-12 rounded-l-lg h-10">
                    <TriangleAlert className="text-amber-400 size-10 pl-2 " />
                </div>
                <div className="flex-1 min-w-0 sm:flex-none sm:w-108 min-h-10 bg-amber-200 rounded-r-lg ">
                    <p className="pl-2 text-sm leading-[1.1] pt-1 ">Es posible modificar algunas características del producto que podrían variar el precio. Verifique el precio final</p>
                </div>
            </div>
            <div className="w-full sm:w-fit sm:mx-auto">
                {config.variante === "sabor-cantidad" && (
                    <div className="flex pt-4 ">
                        <div>
                            <div className="block  mb-3 px-3 sm:px-8 py-1 text-white text-base sm:text-xl w-28 sm:w-40 shrink-0 h-10 font-medium text-heading rounded-l-2xl  bg-[#0f98c5] z-10">sabor</div>
                        </div>

                        <div className="relative group flex-1 min-w-0 sm:flex-none">

                            <button onClick={() => abrir("sabor")} className={` flex  justify-center items-center bg-red-400  h-10 w-full sm:w-80 rounded-r-lg cursor-pointer `}>
                                <div className="text-white text-xl  w-full sm:w-60 truncate  ">{sabor} </div>
                                <ChevronDown className={`${openSab ? "rotate-180" : ""}  text-white text-xl `} />
                            </button>

                            <div className={`absolute  z-15 bg-white border rounded shadow-lg w-full sm:w-80  ${openSab == false ? "hidden" : ""}`}>
                                <ul>
                                    {config.sabores.map((opcion, slideIndex) => (
                                        <li key={slideIndex} onClick={() => cerrar(slideIndex, "sabor")} className={`block px-4 py-2  hover:bg-red-100  ${sabor == opcion.sabor ? "bg-orange-200" : ""}`}  >
                                            {opcion.sabor}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                    </div>
                )}

                {(
                    <div className={config.variante === "sabor-cantidad" ? "flex pt-2 " : "flex pt-4 "}>
                        <div>
                            <div className="block  mb-3 px-3 sm:px-8 py-1 text-white text-base sm:text-xl w-28 sm:w-40 shrink-0 h-10 font-medium text-heading rounded-l-2xl  bg-[#0f98c5] z-10">Cantidad</div>
                        </div>

                        <div className="relative group flex-1 min-w-0 sm:flex-none">

                            <button onClick={() => abrir("cantidad")} className={` flex  justify-center items-center bg-red-400  h-10 w-full sm:w-80 rounded-r-lg cursor-pointer `}>
                                <div className="text-white text-xl  w-full sm:w-60 truncate  ">{cant} </div>
                                <ChevronDown className={`${openCant ? "rotate-180" : ""}  text-white text-xl `} />
                            </button>

                            <div className={`absolute  z-15 bg-white border rounded shadow-lg w-full sm:w-80  ${openCant == false ? "hidden" : ""}`}>
                                <ul>
                                    {CANTIDADES_BASICAS.map((num, slideIndex) => (
                                        <li key={slideIndex} onClick={() => cerrar(slideIndex, "cantidad")} className={`block px-4 py-2  hover:bg-red-100  ${cant == num ? "bg-orange-200" : ""}`}  >
                                            {num}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                    </div>
                )}
            </div>
            <div>
                <div>
                    <h2 className={`font-bold text-2xl underline text-cyan-900 ${oi.className} pl-2 pt-1`}>Descripcion :</h2>
                </div>

                <div className="pl-2 mr-8 pb-4">
                    <p className="pt-2 text-lg text-gray-700">{producto.descripcion ? producto.descripcion : "Este producto no tiene una descripción cargada."}</p>
                    <p className="pt-2 text-lg text-gray-700 font-semibold">Categoría: {producto.categoria}</p>
                </div>
            </div>

            <div className="absolute bottom-14 left-6 right-6 flex items-center justify-between">
                <button onClick={() => resetear()} className="bg-orange-500 hover:bg-orange-600 px-4 py-1 h-9 rounded-2xl cursor-pointer">
                    <div className="text-white font-medium text-heading text-lg">Reiniciar</div>
                </button>

                <div className="flex">
                    <div className="flex items-center px-3 sm:px-4 py-1 h-9 whitespace-nowrap text-white text-base sm:text-lg font-medium rounded-l-2xl bg-[#0f98c5]">Precio Final</div>
                    <div className="flex items-center whitespace-nowrap text-gray-600 text-base sm:text-lg px-3 sm:px-4 py-1 bg-white h-9 rounded-r-lg">{precio} $</div>
                </div>
            </div>

            <div className="absolute bottom-3 left-6 right-6">
                <button
                    onClick={() => agregarCarrito()}
                    className="w-full h-10 rounded-2xl bg-[#09c99f] hover:bg-[#07a88a] cursor-pointer"
                >
                    <div className="text-white font-semibold text-heading text-xl">
                        Agregar al Carrito
                    </div>
                </button>
            </div>

            <ToastContainer
                position="top-center"
                autoClose={3000}
                theme="colored"
                transition={Bounce}
            />

            <ModalProductoEnCarrito
                abierto={mostrarModalDuplicado}
                onCancelar={() => setMostrarModalDuplicado(false)}
                onConfirmar={() => {
                    realizarAgregado();
                    setMostrarModalDuplicado(false);
                }}
            />

        </div>
    );
}
