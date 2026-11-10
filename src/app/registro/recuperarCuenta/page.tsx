"use client"
import Link from "next/link";
import { useState } from "react";
import { apiFetch } from "@/utils/apiFetch";

export default function RecuperarCuenta() {

    const [email, setEmail] = useState<string>("");
    const [enviando, setEnviando] = useState<boolean>(false);
    const [enviado, setEnviado] = useState<boolean>(false);
    const [mensaje, setMensaje] = useState<string>("");
    const [errorEnvio, setErrorEnvio] = useState<string>("");

    const cambiarEmail = (valor: string) => {
        if (valor.length > 50) return;
        setEmail(valor);
    }

    const enviarSolicitud = async (e: React.FormEvent) => {
        e.preventDefault();

        if (email.trim() === "") return;

        setEnviando(true);
        setErrorEnvio("");

        try {
            const res = await apiFetch("/auth/recuperarContrasenia", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const body = await res.json().catch(() => null);

            setMensaje(
                body?.message ??
                "Si el email está registrado y verificado, te enviamos un correo con instrucciones para restablecer tu contraseña."
            );
            setEnviado(true);
        } catch {
            setErrorEnvio("No pudimos conectarnos con el servidor. Intentá de nuevo en unos minutos.");
        } finally {
            setEnviando(false);
        }
    }

    return (
        <div>

            <div>

                < div className="flex justify-center pt-10 pb-10 ">

                    <div className="flex flex-col justify-center w-120  bg-amber-50 rounded-2xl shadow-lg shadow-mio2">

                        <h1 className="text-2xl font-semibold pt-4 text-center">Recuperar Cuenta</h1>

                        {enviado ? (
                            <div className="w-100 pl-4 pr-4 pt-4 pb-6 mx-auto text-center">
                                <p className="text-sm font-medium text-green-700">{mensaje}</p>
                            </div>
                        ) : (
                            <form noValidate onSubmit={enviarSolicitud} className=" flex pt-4 justify-center " >

                                <div className="w-100 pl-4 pr-4 ">

                                    <div className="pb-2 pl-4"><span className="">Email</span></div>
                                    <div className=""> <input onChange={(e) => cambiarEmail(e.target.value)} value={email} type="email" maxLength={50} required className="border-2 border-mio2 h-11  w-full pl-5 font-serif focus:border-naja focus:outline-none rounded-full " placeholder="escribi tu email" /> </div>

                                    <div className=""><p className="text-center text-sm font-semibold pt-3">Completa tu email, si te encontrás registrado te enviaremos instrucciones para restablecer tu contraseña</p></div>

                                    {errorEnvio !== "" && (
                                        <p className="pt-2 text-center text-sm text-red-600">{errorEnvio}</p>
                                    )}

                                    <div className="pt-3 pb-4">
                                        <button disabled={enviando} className="bg-green-700 w-full h-11 rounded-full text-white font-semibold hover:bg-green-800 disabled:opacity-60">
                                            {enviando ? "Enviando..." : "Recuperar"}
                                        </button>
                                    </div>

                                </div>

                            </form>
                        )}

                        <p className="text-center text-lg pb-2 text-gray-600">
                            ¿Ya tienes una cuenta?{' '}
                            <Link href="/login" className="font-medium text-blue-600 hover:text-green-500">
                                Inicia sesión
                            </Link>
                        </p>

                        <p className="text-center text-lg pb-2 text-gray-600">
                            Si no tienes una cuenta{' '}
                            <Link href="/registro" className="font-medium text-naja hover:text-green-500">
                                Registrate ahora
                            </Link>
                        </p>
                    </div>

                </div>

            </div>
        </div>
    )

}
