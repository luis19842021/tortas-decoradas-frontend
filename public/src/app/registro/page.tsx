"use client"
import Link from "next/link";
import { useRouter } from 'next/navigation'
import { useRef, useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { Bounce, toast, ToastContainer } from "react-toastify";
import { apiFetch } from "@/utils/apiFetch";

export default function Registro() {

    const router = useRouter()
    const listadeMensajes = [

        "Introduzca un nombre.",
        "Introduzca un apellido.",
        "Introduzca un email.",
        "Introduzca un teléfono.",
        "Formato de teléfono inválido.",
        "Introduzca una contraseña.",
        "Confirme su contraseña.",
        "Las contraseñas no coinciden.",
        "La contraseña debe tener al menos 8 caracteres.",
        "Formato de email inválido."

    ];

    const [nombre, setNombre] = useState<string>("ninguno");
    const [apellido, setApellido] = useState<string>("ninguno");
    const [email, setEmail] = useState<string>("ninguno");
    const [telefono, setTelefono] = useState<number | null>(0);
    const [contraseña, setContraseña] = useState<string>("ninguno");
    const [confirmarContraseña, setConfirmarContraseña] = useState<string>("ninguno");
    const [errorContraseña, setErrorContraseña] = useState<number>(5);
    const [errorContraseña2, setErrorContraseña2] = useState<number>(6);
    const [errorEmail, setErrorEmail] = useState<number>(2);
    const [errorTelefono, setErrorTelefono] = useState<number>(3);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showPasswordConfirm, setShowPasswordConfirm] = useState<boolean>(false);

    const contraseñaInputRef = useRef<HTMLInputElement>(null);
    const confirmarContraseñaInputRef = useRef<HTMLInputElement>(null);

    const resetearDatos = () => {
        setApellido("ninguno")
        setContraseña("ninguno")
        setConfirmarContraseña("ninguno")
        setEmail("ninguno")
        setNombre("nombre")
        setTelefono(0)
    }

    const cambiarNombre = (nombre: string) => {
        setNombre(nombre);
    }

    const cambiarApellido = (apellido: string) => {
        setApellido(apellido);
    }

    const cambiarEmail = (email: string) => {

        if (email.length > 50) {
            setEmail("");
            return;
        }

        setEmail(email);
    }

    const cambiarTelefono = (e: React.ChangeEvent<HTMLInputElement>) => {

        if (e.target.value == "") {
            setTelefono(null);
            setErrorTelefono(3);
            return;
        }

        setTelefono(parseInt(e.target.value));
    }

    const cambiarContraseña = (contraseña: string) => {
        setContraseña(contraseña);
    }

    const cambiarConfirmarContraseña = (confirmarContraseña: string) => {

        if (contraseña !== confirmarContraseña) {
            setErrorContraseña2(7);
        }

        setConfirmarContraseña(confirmarContraseña);
    }

    const validarFormulario = () => {
        let isValid = true;

        if (nombre === "" || nombre === "ninguno") {
            setNombre("");
            isValid = false;
        }
        if (apellido === "" || apellido === "ninguno") {
            setApellido("");
            isValid = false;
        }
        if (email === "" || email === "ninguno") {
            setEmail("");
            isValid = false;
        }
        if (email !== "" && email !== "ninguno") {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                setEmail("");
                setErrorEmail(9);
                isValid = false;
            }

        }

        if (telefono === null || telefono === 0) {
            setTelefono(null);
            isValid = false;
        }

        if (telefono !== null && telefono !== 0) {
            const telefonoRegex = /^\d{10}$/;
            if (!telefonoRegex.test(telefono.toString())) {
                setTelefono(null);
                isValid = false;
                setErrorTelefono(4);
            }
        }
        if (contraseña === "" || contraseña === "ninguno") {
            setContraseña("");
            setErrorContraseña(5);
            isValid = false;
        }
        if (contraseña !== "" && contraseña !== "ninguno") {
            if (contraseña.length < 8) {

                setContraseña("menos");
                setErrorContraseña(8);
                isValid = false;
            }
        }
        if (confirmarContraseña === "" || confirmarContraseña === "ninguno") {
            setConfirmarContraseña("");
            setErrorContraseña2(6);
            isValid = false;
        }

        return isValid;
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (validarFormulario()) {

            const datos = {
                nombre: nombre,
                apellido: apellido,
                contraseña: contraseña,
                email: email,
                telefono: telefono

            }

            try {

                const res = await apiFetch("/auth/registrar", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',

                    },
                    body: JSON.stringify(datos)
                })

                if (res.ok) {

                    sessionStorage.setItem("pendingVerificationEmail", datos.email);

                    toast.success("Registro exitoso", {
                        position: "top-center",
                        autoClose: 3000,
                        theme: "colored",
                    });

                    setTimeout(() => {
                        router.push(`/registro/verificar-correo?email=${encodeURIComponent(datos.email)}`);
                    }, 1500);

                } else {
                    const errorBody = await res.json().catch(() => ({}));
                    if (errorBody.authStatus === "EMAIL_REGISTERED_NOT_VERIFIED") {
                        sessionStorage.setItem("pendingVerificationEmail", datos.email);

                        toast.info(
                            errorBody.message || "Ya existe una cuenta registrada con este email pendiente de confirmación",
                            {
                                position: "top-center",
                                autoClose: 3000,
                                theme: "colored",
                            }
                        );

                        setTimeout(() => {
                            router.push(`/registro/verificar-correo?email=${encodeURIComponent(datos.email)}`);
                        }, 1500);

                        return;
                    }
                    throw new Error(errorBody.message || "Error desconocido");
                }

            } catch (error: any) {

                const esFallaDeConexion =
                    error instanceof TypeError ||
                    (error instanceof Error && error.message.includes("no está disponible"));

                const message = esFallaDeConexion
                    ? "No pudimos completar tu registro por un problema de conexión. Intenta nuevamente en unos minutos"
                    : error instanceof Error
                        ? error.message
                        : "Error desconocido";

                if (esFallaDeConexion) {
                    setContraseña("");
                    setConfirmarContraseña("");
                    setErrorContraseña(5);
                    setErrorContraseña2(6);
                    if (contraseñaInputRef.current) contraseñaInputRef.current.value = "";
                    if (confirmarContraseñaInputRef.current) confirmarContraseñaInputRef.current.value = "";
                }

                toast.warning(message, {
                    position: "top-center",
                    autoClose: 3000,
                    theme: "colored",
                });

            }

        } else {
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
        }

    };

    return (

        <div>

            < div className="flex justify-center pt-10 pb-10 ">

                <div className="flex flex-col justify-center w-120  bg-amber-50 rounded-2xl shadow-lg shadow-mio2">

                    <h1 className="text-2xl font-semibold pt-4 text-center">Registro</h1>
                    <form noValidate onSubmit={(e) => handleSubmit(e)} className=" flex pt-4 justify-center " >

                        <div className="w-100 pl-4 pr-4 ">

                            <div className="pb-2 pl-4"><span className="">Nombre</span></div>
                            <div className=""> <input onChange={(e) => cambiarNombre(e.target.value)} type="text" maxLength={20} className="border-2 border-mio2 h-11  w-full pl-5 font-serif focus:border-naja focus:outline-none rounded-full " placeholder="escribi tu nombre" /> </div>
                            <label className='flex justify-end' >
                                <p className={`${nombre === "" ? "visible" : "invisible"}  mt-1 text-red-600 `}>{listadeMensajes[0]}</p>
                            </label>

                            <div className="pb-2 pl-4"><span className="">Apellido</span></div>
                            <div className=""> <input onChange={(e) => cambiarApellido(e.target.value)} type="text" maxLength={20} className="border-2 border-mio2 h-11 w-full pl-5 font-serif focus:border-naja focus:outline-none rounded-full " placeholder="escribi tu apellido" /> </div>
                            <label className='flex justify-end' >
                                <p className={`${apellido === "" ? "visible" : "invisible"} mt-1 text-red-600 `}>{listadeMensajes[1]}</p>
                            </label>

                            <div className="pb-2 pl-4"><span className="">Email</span></div>
                            <div className=""> <input onChange={(e) => cambiarEmail(e.target.value)} type="email" maxLength={50} className="border-2 border-mio2 h-11  w-full pl-5 font-serif focus:border-naja focus:outline-none rounded-full " placeholder="escribi tu email" /> </div>
                            <label className='flex justify-end' >
                                <p className={`${email === "" ? "visible" : "invisible"}  mt-1 text-red-600 `}>{listadeMensajes[errorEmail]}</p>
                            </label>

                            <div className="pb-2 pl-4"><span className="">Telefono</span></div>
                            <div className=""> <input onChange={(e) => cambiarTelefono(e)} type="text" className="border-2 border-mio2 h-11  w-full pl-5 font-serif focus:border-naja focus:outline-none rounded-full " placeholder="escribi un telefono de contacto" /> </div>
                            <label className='flex justify-end' >
                                <p className={`${telefono == null ? "visible" : "invisible"}  mt-1 text-red-600 `}>{listadeMensajes[errorTelefono]}</p>
                            </label>

                            <div className="flex justify-between pb-2 pl-4"><span className="">Contraseña</span> <p className="text-sm  ">ocho caracteres Min</p></div>
                            <div className="flex relative"> <input ref={contraseñaInputRef} onChange={(e) => cambiarContraseña(e.target.value)} type={showPassword ? 'text' : 'password'} className="border-2 border-mio2 h-11  w-full pl-5 font-serif focus:border-naja focus:outline-none rounded-full " placeholder="escribi una contraseña" />
                                <button className="absolute right-4 top-2" type="button" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <><FaRegEye className="text-2xl" /></> : <FaRegEyeSlash className="text-2xl" />}</button>
                            </div>
                            <label className='flex justify-end' >
                                <p className={`${contraseña == "" || contraseña === "menos" ? "visible" : "invisible"}  mt-1 text-red-600 `}>{listadeMensajes[errorContraseña]}</p>
                            </label>

                            <div className="pb-2 pl-4"><span className="">Confirmar contraseña</span></div>
                            <div className="flex relative"> <input ref={confirmarContraseñaInputRef} onChange={(e) => cambiarConfirmarContraseña(e.target.value)} type={showPasswordConfirm ? 'text' : 'password'} className="border-2 border-mio2 h-11  w-full pl-5 font-serif focus:border-naja focus:outline-none rounded-full " placeholder="confirmar la contraseña escrita" />
                                <button className="absolute right-4 top-2" type="button" onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}>{showPasswordConfirm ? <><FaRegEye className="text-2xl" /></> : <FaRegEyeSlash className="text-2xl" />}</button></div>
                            <label className='flex justify-end' >
                                <p className={`${confirmarContraseña !== contraseña ? "visible" : "invisible"}  mt-1 text-red-600 `}>{listadeMensajes[errorContraseña2]}</p>
                            </label>

                            <div className="pt-3 pb-4">
                                <button className="bg-green-700 w-full h-11 rounded-full text-white font-semibold hover:bg-green-800">Registrarse</button>
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
                        ¿Ya tienes una cuenta?{' '}
                        <Link href="/login" className="font-medium text-blue-600 hover:text-green-500">
                            Inicia sesión
                        </Link>
                    </p>

                    <p className="text-center text-lg pb-2 text-gray-600">
                        ¿Olvidaste tu cotraseña?{' '}
                        <Link href="/registro/recuperarCuenta" className="font-medium text-naja hover:text-green-500">
                            Recupera tu Cuenta
                        </Link>
                    </p>
                </div>

            </div>

        </div>

    )
}
