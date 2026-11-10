"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSesionUsuario } from "./useSesionUsuario"

interface Props {
    children: React.ReactNode
}

export default function RequiereAdmin({ children }: Props) {
    const sesion = useSesionUsuario()
    const router = useRouter()

    useEffect(() => {
        if (!sesion || !sesion.esAdmin) {
            router.replace("/")
        }
    }, [sesion, router])

    if (!sesion || !sesion.esAdmin) {
        return null
    }

    return <>{children}</>
}
