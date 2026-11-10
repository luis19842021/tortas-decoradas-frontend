import { RefObject, useEffect, useRef, useState } from "react"

export function useSelectoresAbiertos<T extends string>(campos: readonly T[]) {
    const [abiertos, setAbiertos] = useState<Record<T, boolean>>(() => {
        const inicial = {} as Record<T, boolean>
        for (const campo of campos) {
            inicial[campo] = false
        }
        return inicial
    })

    const refs = useRef<Record<T, RefObject<HTMLDivElement | null>>>(
        (() => {
            const inicial = {} as Record<T, RefObject<HTMLDivElement | null>>
            for (const campo of campos) {
                inicial[campo] = { current: null }
            }
            return inicial
        })()
    ).current

    useEffect(() => {
        const listener = (event: MouseEvent) => {
            setAbiertos((previo) => {
                let cambio = false
                const siguiente = { ...previo }
                for (const campo of campos) {
                    const ref = refs[campo]
                    if (previo[campo] && (!ref.current || !ref.current.contains(event.target as Node))) {
                        siguiente[campo] = false
                        cambio = true
                    }
                }
                return cambio ? siguiente : previo
            })
        }

        document.addEventListener("mousedown", listener)
        return () => document.removeEventListener("mousedown", listener)
    }, [])

    const alternar = (campo: String) => {
        const clave = String(campo) as T
        setAbiertos((previo) => ({ ...previo, [clave]: !previo[clave] }))
    }

    const cerrar = (campo: String) => {
        const clave = String(campo) as T
        setAbiertos((previo) => ({ ...previo, [clave]: false }))
    }

    return { abiertos, refs, alternar, cerrar }
}
