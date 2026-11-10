"use client";

interface Props {
    abierto: boolean;
    onCancelar: () => void;
    onConfirmar: () => void;
}

export default function ModalProductoEnCarrito({ abierto, onCancelar, onConfirmar }: Props) {
    if (!abierto) return null;

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center">
            <div
                className="absolute inset-0 bg-gray-600/50 backdrop-blur-sm"
                onClick={onCancelar}
            ></div>

            <div className="relative bg-white rounded-2xl shadow-lg w-80 p-6 z-10">
                <h3 className="text-lg font-bold text-cyan-900 mb-2">
                    Este producto ya está en el carrito
                </h3>
                <p className="text-gray-600 mb-6">
                    ¿Querés agregarlo de todas formas como un producto nuevo?
                </p>
                <div className="flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onCancelar}
                        className="px-4 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 cursor-pointer"
                    >
                        Cancelar
                    </button>
                    <button
                        type="button"
                        onClick={onConfirmar}
                        className="px-4 py-2 rounded-xl bg-[#09c99f] hover:bg-[#07a88a] text-white font-semibold cursor-pointer"
                    >
                        Agregar de todas formas
                    </button>
                </div>
            </div>
        </div>
    );
}
