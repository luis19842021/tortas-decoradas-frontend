"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaTimes, FaTrash } from "react-icons/fa";
import { useCarrito } from "./useCarrito";
import {
    CARRITO_ABRIR_EVENT,
    CARRITO_TOGGLE_EVENT,
    quitarDelCarrito,
    totalCarrito,
} from "./carrito";

export default function CarritoPanel() {
    const [abierto, setAbierto] = useState(false);
    const items = useCarrito();
    const router = useRouter();

    const irAFinalizarCompra = () => {
        setAbierto(false);
        router.push("/checkout");
    };

    useEffect(() => {
        const abrir = () => setAbierto(true);
        const toggle = () => setAbierto((valor) => !valor);

        window.addEventListener(CARRITO_ABRIR_EVENT, abrir);
        window.addEventListener(CARRITO_TOGGLE_EVENT, toggle);
        return () => {
            window.removeEventListener(CARRITO_ABRIR_EVENT, abrir);
            window.removeEventListener(CARRITO_TOGGLE_EVENT, toggle);
        };
    }, []);

    return (
        <>
            <div
                onClick={() => setAbierto(false)}
                className={`fixed inset-0 bg-black/40 z-90 transition-opacity duration-300 ${abierto ? "opacity-100 visible" : "opacity-0 invisible"
                    }`}
            />

            <div
                className={`fixed top-0 right-0 h-full w-full sm:w-100 bg-white shadow-2xl z-100 flex flex-col transform transition-transform duration-300 ${abierto ? "translate-x-0" : "translate-x-full"
                    }`}
            >
                <div className="flex items-center justify-between p-4 border-b border-mio2">
                    <h2 className="text-xl font-bold text-mio2">Tu carrito</h2>
                    <button
                        type="button"
                        onClick={() => setAbierto(false)}
                        className="cursor-pointer text-gray-500 hover:text-black"
                    >
                        <FaTimes size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4">
                    {items.length === 0 ? (
                        <p className="text-center text-gray-500 pt-10">
                            No hay productos en el carrito todavía
                        </p>
                    ) : (
                        <div className="flex flex-col gap-4">
                            {items.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex gap-3 border-b border-gray-200 pb-3"
                                >
                                    {item.imagen && (
                                        <Link
                                            href={`/productos/verProducto/?id=${item.idProducto}`}
                                            onClick={() => setAbierto(false)}
                                            title="Ver detalle del producto"
                                        >
                                            <img
                                                src={`https://res.cloudinary.com/dkdywvyce/image/upload/w_80,q_75/${item.imagen}`}
                                                width={70}
                                                height={70}
                                                alt={item.nombre}
                                                className="rounded-lg object-cover w-[70px] h-[70px] cursor-pointer hover:opacity-80 transition-opacity"
                                            />
                                        </Link>
                                    )}

                                    <div className="flex-1">
                                        <p className="text-[11px] uppercase tracking-wide text-mio2 font-semibold">
                                            {item.tipo}
                                        </p>
                                        <p className="font-semibold capitalize">{item.nombre}</p>
                                        <p className="text-xs text-gray-500">{item.descripcion}</p>

                                        <div className="flex items-center justify-between mt-2">
                                            <span className="text-sm text-gray-500">
                                                Cantidad: {item.cantidad}
                                            </span>
                                            <span className="font-semibold">
                                                {item.precioUnitario * item.cantidad} $
                                            </span>
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => quitarDelCarrito(item.id)}
                                        className="text-red-400 hover:text-red-600 cursor-pointer self-start"
                                        title="Quitar del carrito"
                                    >
                                        <FaTrash size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {items.length > 0 && (
                    <div className="border-t border-mio2 p-4">
                        <div className="flex justify-between text-lg font-bold mb-3">
                            <span>Total</span>
                            <span>{totalCarrito(items)} $</span>
                        </div>
                        <button
                            type="button"
                            onClick={irAFinalizarCompra}
                            className="w-full bg-green-700 hover:bg-green-800 text-white font-semibold py-2 rounded-full cursor-pointer"
                        >
                            Finalizar compra
                        </button>

                        <Link
                            href="/productos?categoria=TORTAS&tipo=TORTA"
                            onClick={() => setAbierto(false)}
                            className="block w-full text-center mt-3 border-1 text-neutral-500 bg-pink-100 hover:bg-pink-200 font-semibold py-2 rounded-full cursor-pointer transition-colors"
                        >
                            Continuar comprando
                        </Link>
                    </div>
                )}
            </div>
        </>
    );
}
