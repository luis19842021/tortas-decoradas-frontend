"use client";

export type EstadoPedidoSimulado = "PENDIENTE" | "INICIADO" | "CUMPLIDO" | "CANCELADO";

interface Props {
    estado: EstadoPedidoSimulado;
    onConfirmar: () => void;
    onCancelar: () => void;
}

export default function EstadoPedidoDemo({ estado, onConfirmar, onCancelar }: Props) {
    if (estado === "PENDIENTE") return null;

    const pasos: { key: "INICIADO" | "CUMPLIDO" | "CANCELADO"; label: string }[] = [
        { key: "INICIADO", label: "Iniciado" },
        { key: "CUMPLIDO", label: "Confirmado" },
        { key: "CANCELADO", label: "Cancelado" },
    ];

    const colorPaso = (key: "INICIADO" | "CUMPLIDO" | "CANCELADO") => {
        if (key === "INICIADO") {
            return "bg-green-500";
        }
        if (key === "CUMPLIDO") {
            return estado === "CUMPLIDO" ? "bg-green-500" : "bg-gray-300";
        }
        return estado === "CANCELADO" ? "bg-red-500" : "bg-gray-300";
    };

    return (
        <div className="mt-6 bg-white border-2 border-dashed border-gray-400 rounded-2xl p-3 sm:p-4">
            <p className="text-xs text-gray-500 mb-3 text-center">
                Componente de prueba — simula el estado del Pedido sin Mercado Pago conectado todavía
            </p>

            <div className="flex items-center justify-center gap-5 sm:gap-8 mb-4">
                {pasos.map((paso) => (
                    <div key={paso.key} className="flex flex-col items-center gap-1">
                        <span className={`h-5 w-5 rounded-full inline-block ${colorPaso(paso.key)}`} />
                        <span className="text-xs text-gray-700">{paso.label}</span>
                    </div>
                ))}
            </div>

            {estado === "INICIADO" && (
                <div className="flex flex-wrap justify-center gap-3">
                    <button
                        type="button"
                        onClick={onConfirmar}
                        className="bg-[#09c99f] hover:bg-[#07a88a] text-white font-semibold px-4 sm:px-6 py-2 rounded-full cursor-pointer"
                    >
                        Confirmar (simular pago)
                    </button>
                    <button
                        type="button"
                        onClick={onCancelar}
                        className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 sm:px-6 py-2 rounded-full cursor-pointer"
                    >
                        Cancelar (simular abandono)
                    </button>
                </div>
            )}

            {estado === "CUMPLIDO" && (
                <p className="text-center text-green-700 font-semibold">Pedido CUMPLIDO ✅</p>
            )}

            {estado === "CANCELADO" && (
                <p className="text-center text-red-700 font-semibold">Pedido CANCELADO ❌</p>
            )}
        </div>
    );
}
