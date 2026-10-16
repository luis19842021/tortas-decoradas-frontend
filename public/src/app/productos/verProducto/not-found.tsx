import { oi } from "../../ui/fonts";

export default function NotFound() {
    return (
        <div className="flex justify-center pt-16 pb-16">
            <div className="bg-blue-100 w-130 rounded-xl px-6 py-10 text-center">
                <h2 className={`font-bold text-2xl text-cyan-900 ${oi.className}`}>Producto no encontrado</h2>
                <p className="pt-4 text-lg text-gray-700">
                    El producto que buscás no existe o fue eliminado. Volvé a la lista de productos e intentá con otro.
                </p>
            </div>
        </div>
    );
}
