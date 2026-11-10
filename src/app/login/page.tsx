"use client"
import Link from "next/link";
import { useRouter } from 'next/navigation'
import { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { Bounce, toast, ToastContainer } from "react-toastify";
import { guardarSesion } from "@/features/auth/auth";
import { apiFetch } from "@/utils/apiFetch";

export default function Login() {

    const router = useRouter()

    const [email, setEmail] = useState<string>("ninguno");
    const [contraseña, setContraseña] = useState<string>("ninguno");
    const [errorEmail, setErrorEmail] = useState<number>(0);
    const [errorContraseña, setErrorContraseña] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const listaDeMensajesEmail = [
        "Introduzca un email.",
        "Formato de email inválido.",
    ];

    const cambiarEmail = (valor: string) => {
        if (valor.length > 50) {
            return;
        }
        setEmail(valor);
        setErrorEmail(0);
    }

    const cambiarContraseña = (valor: string) => {
        setContraseña(valor);
        setErrorContraseña(false);
    }

    const validarFormulario = () => {
        let isValid = true;

        if (email === "" || email === "ninguno") {
            setErrorEmail(1);
            isValid = false;
        } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                setErrorEmail(2);
                isValid = false;
            }
        }

        if (contraseña === "" || contraseña === "ninguno") {
            setErrorContraseña(true);
            isValid = false;
        }

        return isValid;
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (!validarFormulario()) {
            toast.warning("campos incompletos o inválidos.", {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });
            return;
        }

        const datos = {
            email: email,
            contraseña: contraseña,
        }

        try {
            const res = await apiFetch("/auth/login", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(datos)
            })

            const body = await res.json().catch(() => ({}));

            if (res.ok) {

                if (body.token) {
                    guardarSesion(body.token);
                }

                setTimeout(() => {
                    router.push("/");
                }, 300);

            } else {

                if (body.message && body.message.includes("no ha sido verificado")) {
                    toast.info(body.message, {
                        position: "top-center",
                        autoClose: 3000,
                        theme: "colored",
                    });

                    setTimeout(() => {
                        router.push(`/registro/verificar-correo?email=${encodeURIComponent(email)}`);
                    }, 1500);

                    return;
                }

                throw new Error(body.message || "Error desconocido");
            }

        } catch (error: any) {

            const message =
                error instanceof TypeError
                    ? "No pudimos iniciar sesión por un problema de conexión. Intenta nuevamente en unos minutos"
                    : error instanceof Error
                        ? error.message
                        : "Error desconocido";

            toast.warning(message, {
                position: "top-center",
                autoClose: 3000,
                theme: "colored",
            });
        }
    };

    return (

        <div>

            <div className="flex justify-center pt-10 pb-10 ">

                <div className="flex flex-col justify-center w-120  bg-amber-50 rounded-2xl shadow-lg shadow-mio2">

                    <h1 className="text-2xl font-semibold pt-4 text-center">Iniciar sesión</h1>
                    <form noValidate onSubmit={(e) => handleSubmit(e)} className=" flex pt-4 justify-center " >

                        <div className="w-100 pl-4 pr-4 ">

                            <div className="pb-2 pl-4"><span className="">Email</span></div>
                            <div className=""> <input onChange={(e) => cambiarEmail(e.target.value)} type="email" maxLength={50} className="border-2 border-mio2 h-11  w-full pl-5 font-serif focus:border-naja focus:outline-none rounded-full " placeholder="escribi tu email" /> </div>
                            <label className='flex justify-end' >
                                <p className={`${errorEmail !== 0 ? "visible" : "invisible"}  mt-1 text-red-600 `}>{listaDeMensajesEmail[errorEmail - 1]}</p>
                            </label>

                            <div className="pb-2 pl-4"><span className="">Contraseña</span></div>
                            <div className="flex relative"> <input onChange={(e) => cambiarContraseña(e.target.value)} type={showPassword ? 'text' : 'password'} className="border-2 border-mio2 h-11  w-full pl-5 font-serif focus:border-naja focus:outline-none rounded-full " placeholder="escribi tu contraseña" />
                                <button className="absolute right-4 top-2" type="button" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <><FaRegEye className="text-2xl" /></> : <FaRegEyeSlash className="text-2xl" />}</button>
                            </div>
                            <label className='flex justify-end' >
                                <p className={`${errorContraseña ? "visible" : "invisible"}  mt-1 text-red-600 `}>Introduzca una contraseña.</p>
                            </label>

                            <div className="pt-3 pb-4">
                                <button className="bg-green-700 w-full h-11 rounded-full text-white font-semibold hover:bg-green-800">Inicia sesión</button>
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

                    <p className="text-center text-lg pb-2 text-gray-600">
                        ¿No tenés una cuenta?{' '}
                        <Link href="/registro" className="font-medium text-blue-600 hover:text-green-500">
                            Regístrate
                        </Link>
                    </p>

                    <p className="text-center text-lg pb-2 text-gray-600">
                        ¿Olvidaste tu contraseña?{' '}
                        <Link href="/registro/recuperarCuenta" className="font-medium text-naja hover:text-green-500">
                            Recupera tu Cuenta
                        </Link>
                    </p>
                </div>

            </div>

        </div>

    )
}
