"use client";
import { useEffect, useRef, useState } from "react";
import { apiFetch } from "@/utils/apiFetch";

interface ResultadoCalculoEnvio {
    codigoPostal: number | null;
    disponible: boolean;
    localidad: string | null;
    precio: number | null;
}

export interface EnvioResuelto {
    precio: number | null;
    direccionEnvio: string | null;
    codigoPostalEnvio: number | null;
}

interface Props {
    disabled?: boolean;
    onResultado?: (datos: EnvioResuelto) => void;
}

export default function DireccionDeEnvio({ disabled = false, onResultado }: Props) {
    const [calle, setCalle] = useState("");
    const [altura, setAltura] = useState("");
    const [cargando, setCargando] = useState(false);
    const [resultado, setResultado] = useState<ResultadoCalculoEnvio | null>(null);
    const [error, setError] = useState(false);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);

        if (disabled || calle.trim().length < 3 || altura.trim().length === 0) {
            setResultado(null);
            setError(false);
            onResultado?.({ precio: null, direccionEnvio: null, codigoPostalEnvio: null });
            return;
        }

        debounceRef.current = setTimeout(() => {
            setCargando(true);
            setError(false);
            const calleLimpia = calle.trim();
            const alturaLimpia = altura.trim();

            apiFetch(
                `/producto/calcularEnvioPorDireccion?calle=${encodeURIComponent(calleLimpia)}&altura=${encodeURIComponent(alturaLimpia)}`
            )
                .then((respuesta) => (respuesta.ok ? respuesta.json() : Promise.reject()))
                .then((datos: ResultadoCalculoEnvio) => {
                    setResultado(datos);
                    onResultado?.({
                        precio: datos.disponible ? datos.precio : null,
                        direccionEnvio: `${calleLimpia} ${alturaLimpia}`,
                        codigoPostalEnvio: datos.codigoPostal,
                    });
                })
                .catch(() => {
                    setResultado(null);
                    setError(true);
                    onResultado?.({ precio: null, direccionEnvio: null, codigoPostalEnvio: null });
                })
                .finally(() => setCargando(false));
        }, 600);

        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, [calle, altura, disabled]);

    return (
        <div className={disabled ? "opacity-50 pointer-events-none" : ""}>
            <div className="flex flex-col min-[420px]:flex-row gap-3">
                <input
                    type="text"
                    placeholder="Calle (ej: Av Rivadavia)"
                    value={calle}
                    onChange={(e) => setCalle(e.target.value)}
                    disabled={disabled}
                    className="w-full min-w-0 min-[420px]:flex-[2] border-2 border-cyan-300 rounded-xl px-3 py-2"
                />
                <input
                    type="text"
                    placeholder="Altura"
                    value={altura}
                    onChange={(e) => setAltura(e.target.value)}
                    disabled={disabled}
                    className="w-full min-w-0 min-[420px]:flex-1 border-2 border-cyan-300 rounded-xl px-3 py-2"
                />
            </div>

            {cargando && (
                <p className="mt-2 text-sm text-cyan-700">Calculando el envío para tu dirección...</p>
            )}

            {!cargando && error && (
                <p className="mt-2 text-sm text-red-600">
                    No pudimos identificar esa dirección. Revisá que esté bien escrita.
                </p>
            )}

            {!cargando && !error && resultado?.disponible && (
                <p className="mt-2 text-sm text-green-700 font-semibold">
                    Envío a {resultado.localidad} (CP {resultado.codigoPostal}): {resultado.precio} $
                </p>
            )}

            {!cargando && !error && resultado && !resultado.disponible && resultado.codigoPostal && (
                <p className="mt-2 text-sm text-red-600">
                    Por ahora no hacemos envíos a esa zona (CP {resultado.codigoPostal}).
                </p>
            )}

            {!cargando && !error && resultado && !resultado.disponible && !resultado.codigoPostal && (
                <p className="mt-2 text-sm text-red-600">
                    No pudimos identificar esa dirección. Revisá que esté bien escrita.
                </p>
            )}
        </div>
    );
}
