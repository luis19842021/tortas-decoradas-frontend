"use client"
import { useEffect, useRef, useState } from "react";
import { Search, ShieldCheck, ShieldOff, Phone, Ban, RotateCcw } from "lucide-react";
import { toast } from "react-toastify";
import { UsuarioAdmin, esAdmin, obtenerUsuarios, cambiarRolUsuario, cambiarEstadoUsuario } from "@/features/configuracion/api";
import { useSesionUsuario } from "@/features/auth/useSesionUsuario";
import { Pagination } from "@/componenets/Paginacion";

const TAMANIO_PAGINA = 20
const DEMORA_BUSQUEDA_MS = 300

export default function AdministrarPerfiles() {

    const [usuarios, setUsuarios] = useState<UsuarioAdmin[]>([])
    const [paginaActual, setPaginaActual] = useState(1)
    const [totalPaginas, setTotalPaginas] = useState(1)
    const [cargando, setCargando] = useState(true)
    const [errorCarga, setErrorCarga] = useState("")
    const [busqueda, setBusqueda] = useState("")
    const [idEnProceso, setIdEnProceso] = useState<number | null>(null)
    const sesion = useSesionUsuario()
    const demoraRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    async function cargarPagina(busquedaPedida: string, paginaPedida: number) {
        setCargando(true)
        setErrorCarga("")
        try {
            const resultado = await obtenerUsuarios(busquedaPedida, paginaPedida - 1, TAMANIO_PAGINA)
            setUsuarios(resultado.contenido)
            setTotalPaginas(Math.max(resultado.totalPaginas, 1))
        } catch (error) {
            console.error("Error al obtener los usuarios:", error);
            setErrorCarga("No se pudo cargar la lista de usuarios.")
        } finally {
            setCargando(false)
        }
    }

    useEffect(() => {
        cargarPagina(busqueda, paginaActual)
    }, [paginaActual])

    function onCambiaBusqueda(e: React.ChangeEvent<HTMLInputElement>) {
        const texto = e.target.value
        setBusqueda(texto)

        if (demoraRef.current) clearTimeout(demoraRef.current)
        demoraRef.current = setTimeout(() => {
            if (paginaActual === 1) {
                cargarPagina(texto, 1)
            } else {
                setPaginaActual(1)
            }
        }, DEMORA_BUSQUEDA_MS)
    }

    async function alternarAdmin(usuario: UsuarioAdmin) {
        const esActualmenteAdmin = esAdmin(usuario)
        const nuevoRol = esActualmenteAdmin ? "USER" : "ADMIN"

        if (esActualmenteAdmin && sesion?.email.toLowerCase() === usuario.email.toLowerCase()) {
            toast.warning("No podés quitarte el rol de administrador a vos mismo.")
            return
        }

        setIdEnProceso(usuario.id)
        try {
            const usuarioActualizado = await cambiarRolUsuario(usuario.id, nuevoRol)
            setUsuarios((previos) => previos.map((u) => (u.id === usuario.id ? usuarioActualizado : u)))
            toast.success(esActualmenteAdmin
                ? `${usuario.nombre} ya no es administrador`
                : `${usuario.nombre} ahora es administrador`)
        } catch (error) {
            console.error("Error al cambiar el rol del usuario:", error);
            toast.warning("No se pudo cambiar el rol del usuario")
        } finally {
            setIdEnProceso(null)
        }
    }

    async function alternarSuspension(usuario: UsuarioAdmin) {
        const nuevoEstado = !usuario.suspendida

        if (nuevoEstado && sesion?.email.toLowerCase() === usuario.email.toLowerCase()) {
            toast.warning("No podés suspender tu propia cuenta.")
            return
        }

        setIdEnProceso(usuario.id)
        try {
            const usuarioActualizado = await cambiarEstadoUsuario(usuario.id, nuevoEstado)
            setUsuarios((previos) => previos.map((u) => (u.id === usuario.id ? usuarioActualizado : u)))
            toast.success(nuevoEstado
                ? `${usuario.nombre} fue suspendido`
                : `${usuario.nombre} fue reactivado`)
        } catch (error) {
            console.error("Error al cambiar el estado del usuario:", error);
            toast.warning("No se pudo cambiar el estado del usuario")
        } finally {
            setIdEnProceso(null)
        }
    }

    return (
        <div className="w-full bg-white rounded-2xl shadow-md px-4 sm:px-8 py-5 sm:py-6">
            <div className="flex items-center justify-between gap-4 flex-wrap mb-6">
                <div>
                    <p className="text-gray-700 text-xl font-semibold">Administración de perfiles</p>
                    <p className="text-gray-500">Dale o quitale el rol de administrador a cualquier usuario registrado.</p>
                </div>
                <div className="relative w-full sm:w-72">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="text" value={busqueda} onChange={onCambiaBusqueda}
                        placeholder="Buscar por nombre o email..."
                        className="w-full border-2 rounded-xl bg-cyan-50 border-cyan-700 h-10 pl-10 pr-4" />
                </div>
            </div>

            {cargando && (
                <p className="text-gray-400 text-center py-6">Cargando usuarios...</p>
            )}

            {!cargando && errorCarga && (
                <p className="text-rose-500 text-center py-6">{errorCarga}</p>
            )}

            {!cargando && !errorCarga && (
                <>
                    <div className="flex flex-col gap-3">
                        {usuarios.length === 0 && (
                            <p className="text-gray-400 text-center py-6">No se encontró ningún usuario con ese criterio.</p>
                        )}

                        {usuarios.map((usuario) => {
                            const admin = esAdmin(usuario)
                            const esUnoMismo = sesion?.email.toLowerCase() === usuario.email.toLowerCase()

                            return (
                                <div key={usuario.id}
                                    className="flex items-center justify-between gap-4 flex-wrap rounded-xl border border-gray-100 px-4 py-3">
                                    <div className="min-w-0">
                                        <p className="text-gray-700 font-semibold flex items-center gap-2">
                                            {usuario.nombre} {usuario.apellido}
                                            {admin && (
                                                <span className="text-xs font-bold text-amber-700 bg-amber-100 rounded-full px-2 py-0.5">ADMIN</span>
                                            )}
                                            {usuario.suspendida && (
                                                <span className="text-xs font-bold text-rose-700 bg-rose-100 rounded-full px-2 py-0.5">SUSPENDIDA</span>
                                            )}
                                            {esUnoMismo && (
                                                <span className="text-xs font-medium text-gray-400">(vos)</span>
                                            )}
                                        </p>
                                        <p className="text-gray-500 text-sm truncate">{usuario.email}</p>
                                        {usuario.telefono && (
                                            <p className="text-gray-400 text-sm flex items-center gap-1.5">
                                                <Phone size={12} className="shrink-0" />
                                                {usuario.telefono}
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-2 flex-wrap">
                                        <button type="button" onClick={() => alternarAdmin(usuario)}
                                            disabled={idEnProceso === usuario.id || (admin && esUnoMismo)}
                                            title={admin && esUnoMismo ? "No podés quitarte el rol a vos mismo" : undefined}
                                            className={`flex items-center gap-2 shrink-0 rounded-full h-10 px-4 sm:px-5 font-bold text-white shadow-cyan-500/50 transition-all duration-500 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer ${
                                                admin ? "bg-rose-400 hover:bg-rose-500" : "bg-amber-400 hover:bg-amber-500"
                                            }`}>
                                            {admin ? <ShieldOff size={16} /> : <ShieldCheck size={16} />}
                                            {idEnProceso === usuario.id ? "Guardando..." : admin ? "Quitar admin" : "Hacer admin"}
                                        </button>

                                        <button type="button" onClick={() => alternarSuspension(usuario)}
                                            disabled={idEnProceso === usuario.id || (!usuario.suspendida && esUnoMismo)}
                                            title={!usuario.suspendida && esUnoMismo ? "No podés suspender tu propia cuenta" : undefined}
                                            className={`flex items-center gap-2 shrink-0 rounded-full h-10 px-4 sm:px-5 font-bold text-white shadow-cyan-500/50 transition-all duration-500 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer ${
                                                usuario.suspendida ? "bg-emerald-400 hover:bg-emerald-500" : "bg-gray-400 hover:bg-gray-500"
                                            }`}>
                                            {usuario.suspendida ? <RotateCcw size={16} /> : <Ban size={16} />}
                                            {idEnProceso === usuario.id ? "Guardando..." : usuario.suspendida ? "Reactivar" : "Suspender"}
                                        </button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    {totalPaginas > 1 && (
                        <Pagination currentPage={paginaActual} totalPages={totalPaginas} onPageChange={setPaginaActual} />
                    )}
                </>
            )}
        </div>
    )
}
