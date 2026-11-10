"use client"

import { Bizcochuelo, Producto, Sabor, TamañoCatalogo } from "@/app/interfaces/producto.interface";
import MenuDetalleDeTortaUnPiso from "./MenuDetalleDeTortaUnPiso";

import { oi } from "@/app/ui/fonts";
import { useEffect, useState } from "react";
import MenuDetalleDeTortaDosPisos from "./MenuDetalleDeTortaDosPisos";
import MenuDetalleDeTortaTresPisos from "./MenuDetalleDeTortaTresPisos";
import { agregarAlCarrito, obtenerCarrito } from "@/features/carrito/carrito";
import { useSesionUsuario } from "@/features/auth/useSesionUsuario";
import { Bounce, toast, ToastContainer } from "react-toastify";
import ModalProductoEnCarrito from "@/features/carrito/ModalProductoEnCarrito";
import { Alergeno, unirAlergenos } from "./alergenos";
import { useAlergenosTorta } from "./alergenosTortaStore";
import { prefijoForma, tieneDosRellenos } from "./formaTorta";
interface NivelCuatro {
    producto: Producto
    lista: Sabor[]
    listaBizcochuelos: { sabor: String, precio: number }[]
    listaTamaño: Tam[]
    listaTamañoDos: Tam[]
    listaTamañoTres: Tam[]
    tamaño: String | undefined
    tamañoDos: String | undefined
    tamañoTres: String | undefined
    biscochuelo: String | undefined
    biscochueloDos: String | undefined
    biscochueloTres: String | undefined
    rellenoUno: String | undefined
    rellenoDos: String | undefined
    rellenoTres: String | undefined
    rellenoCuatro: String | undefined
    rellenoCinco: String | undefined
    rellenoSeis: String | undefined
    rellenoSiete: String | undefined
    rellenoOcho: String | undefined
    rellenoNueve: String | undefined
    funcionTamaño: (t: String, n: String) => void
    funcionBiscochuelo: (b: String, n: String) => void
    funcionRelleno: (r: String, n: String) => void

}
interface NivelTres {
    producto: Producto
    lista: Sabor[]
    listaBizcochuelos: { sabor: String, precio: number }[]
    listaTamaño: Tam[]
    listaTamañoDos: Tam[]
    tamaño: String | undefined
    tamañoDos: String | undefined
    biscochuelo: String | undefined
    biscochueloDos: String | undefined
    rellenoUno: String | undefined
    rellenoDos: String | undefined
    rellenoTres: String | undefined
    rellenoCuatro: String | undefined
    rellenoCinco: String | undefined
    rellenoSeis: String | undefined
    funcionTamaño: (t: String, n: String) => void
    funcionBiscochuelo: (b: String, n: String) => void
    funcionRelleno: (r: String, n: String) => void

}

interface NivelDos {
    producto: Producto
    lista: Sabor[]
    listaBizcochuelos: { sabor: String, precio: number }[]
    tamaño: String | undefined
    tamañoDos: String | undefined
    listaTamaño: Tam[]
    biscochuelo: String | undefined
    biscochueloDos: String | undefined
    rellenoUno: String | undefined
    rellenoDos: String | undefined
    rellenoTres: String | undefined
    funcionTamaño: (t: String, n: String) => void
    funcionBiscochuelo: (b: String, n: String) => void
    funcionRelleno: (r: String, f: String) => void

}
interface NivelUno {
    producto: Producto
    lista: Sabor[]
    listaBizcochuelos: Bizcochuelo[]
    listaTamaños: TamañoCatalogo[]
}
interface Tam {
    medida: String
    precio: number
}
export default function MenuDetalleTorta(dato: NivelUno) {

    const tamañosCirculos: Tam[] = dato.listaTamaños
        .filter((t) => t.forma == "CIRCULAR")
        .map((t) => ({ medida: t.medida, precio: t.precio }))
    const tamañosCuadrados: Tam[] = dato.listaTamaños
        .filter((t) => t.forma == "CUADRADO")
        .map((t) => ({ medida: t.medida, precio: t.precio }))
    const tamañosRectangulares: Tam[] = dato.listaTamaños
        .filter((t) => t.forma == "RECTANGULAR")
        .map((t) => ({ medida: t.medida, precio: t.precio }))
    const biscochuelos = dato.listaBizcochuelos.map((b) => ({ sabor: b.bizcochuelo, precio: b.precio }))

    const preLista = () => {

        let listaTamaño: Tam[] = []
        if (prefijoForma(dato.producto.tipoDeProducto?.detalleDeTorta) == "TCI") {

            if (dato.producto.tipoDeProducto?.detalleDeTorta.pisos == 1) {
                listaTamaño = tamañosCirculos
            }

            if (dato.producto.tipoDeProducto?.detalleDeTorta.pisos == 2) {

                for (let i = 0; i < tamañosCirculos.length; i++) {
                    if (i >= 2) {
                        listaTamaño.push(tamañosCirculos[i])
                    }

                }
            }
            if (dato.producto.tipoDeProducto?.detalleDeTorta.pisos == 3) {

                for (let i = 0; i < tamañosCirculos.length; i++) {
                    if (i >= 3) {
                        listaTamaño.push(tamañosCirculos[i])
                    }

                }
            }

        }

        if (prefijoForma(dato.producto.tipoDeProducto?.detalleDeTorta) == "TCU") {

            if (dato.producto.tipoDeProducto?.detalleDeTorta.pisos == 1) {
                listaTamaño = tamañosCuadrados
            }

            if (dato.producto.tipoDeProducto?.detalleDeTorta.pisos == 2) {
                for (let i = 0; i < tamañosCuadrados.length; i++) {
                    if (i >= 2) {
                        listaTamaño.push(tamañosCuadrados[i])
                    }

                }
            }
            if (dato.producto.tipoDeProducto?.detalleDeTorta.pisos == 3) {

                for (let i = 0; i < tamañosCuadrados.length; i++) {
                    if (i >= 3) {
                        listaTamaño.push(tamañosCuadrados[i])
                    }

                }
            }

        }

        if (prefijoForma(dato.producto.tipoDeProducto?.detalleDeTorta) == "TRE") {
            // La torta rectangular es de un solo piso
            listaTamaño = tamañosRectangulares
        }

        return listaTamaño
    }

    const preListaDos = (tam: String | undefined) => {
        const listaTamaño: Tam[] = preLista()
        let listaTamañoDos: Tam[] = []
        const indice = listaTamaño.findIndex((t) => t.medida == tam)

        if (indice === -1) {
            return listaTamañoDos
        }
        const ultimo = listaTamaño[indice].medida
        let open = true

        if (prefijoForma(dato.producto.tipoDeProducto?.detalleDeTorta) == "TCI") {

            if (dato.producto.tipoDeProducto?.detalleDeTorta.pisos == 1) {
                listaTamañoDos = listaTamaño
            }

            if (dato.producto.tipoDeProducto?.detalleDeTorta.pisos == 2) {
                for (let i = 0; i < tamañosCirculos.length; i++) {
                    if (open) {
                        if (tamañosCirculos[i].medida != ultimo) {

                            listaTamañoDos.push(tamañosCirculos[i])

                        } else {
                            open = false
                        }
                    }

                }
            }

            if (dato.producto.tipoDeProducto?.detalleDeTorta.pisos == 3) {
                for (let i = 0; i < tamañosCirculos.length; i++) {
                    if (open) {
                        if (tamañosCirculos[i].medida != ultimo) {

                            if (i > 1) {
                                listaTamañoDos.push(tamañosCirculos[i])
                            }
                        } else {
                            open = false
                        }
                    }

                }
            }

        }

        if (prefijoForma(dato.producto.tipoDeProducto?.detalleDeTorta) == "TCU") {

            if (dato.producto.tipoDeProducto?.detalleDeTorta.pisos == 1) {
                listaTamañoDos = listaTamaño
            }

            if (dato.producto.tipoDeProducto?.detalleDeTorta.pisos == 2) {
                for (let i = 0; i < tamañosCuadrados.length; i++) {
                    if (open) {
                        if (tamañosCuadrados[i].medida != ultimo) {

                            listaTamañoDos.push(tamañosCuadrados[i])

                        } else {
                            open = false
                        }
                    }

                }
            }

            if (dato.producto.tipoDeProducto?.detalleDeTorta.pisos == 3) {
                for (let i = 0; i < tamañosCuadrados.length; i++) {
                    if (open) {
                        if (tamañosCuadrados[i].medida != ultimo) {

                            if (i > 1) {
                                listaTamañoDos.push(tamañosCuadrados[i])
                            }
                        } else {
                            open = false
                        }
                    }

                }
            }

        }

        return listaTamañoDos
    }
    const preListadoTres = (tamUno: String | undefined, tamDos: String | undefined) => {

        const listaTamañoDos: Tam[] = preListaDos(preTam(tamUno))
        const listaTamañoTres: Tam[] = []
        let open = true

        if (dato.producto.tipoDeProducto?.detalleDeTorta.pisos == 3) {

            const indice = listaTamañoDos.findIndex((t) => t.medida == tamDos)

            if (indice === -1) {
                return listaTamañoTres
            }
            const ultimo = listaTamañoDos[indice].medida

            if (prefijoForma(dato.producto.tipoDeProducto?.detalleDeTorta) == "TCI") {
                for (let i = 0; i < tamañosCirculos.length; i++) {
                    if (open) {
                        if (tamañosCirculos[i].medida != ultimo) {
                            listaTamañoTres.push(tamañosCirculos[i])
                        } else {
                            open = false
                        }
                    }

                }
            }
            if (prefijoForma(dato.producto.tipoDeProducto?.detalleDeTorta) == "TCU") {

                for (let i = 0; i < tamañosCuadrados.length; i++) {
                    if (open) {
                        if (tamañosCuadrados[i].medida != ultimo) {
                            listaTamañoTres.push(tamañosCuadrados[i])
                        } else {
                            open = false
                        }
                    }

                }
            }

        }

        return listaTamañoTres

    }

    const prel = (num: number) => {
        let listaTamaño: Tam[] = []
        if (dato.producto.tipoDeProducto?.detalleDeTorta.estructura == false && num == 2) {
            listaTamaño = preListaDos(preTam(dato.producto.tipoDeProducto?.detalleDeTorta.tamaño?.medida))
        }
        if (dato.producto.tipoDeProducto?.detalleDeTorta.estructura == false && num == 3) {
            listaTamaño = preListadoTres(preTam(dato.producto.tipoDeProducto?.detalleDeTorta.tamaño?.medida), preTam(dato.producto.tipoDeProducto?.detalleDeTorta.tamañoDos?.medida))
        }
        return listaTamaño
    }

    const porciones = (medida: String | undefined) => {
        if (!medida) {
            return medida
        }
        const partes = String(medida).split("/")
        return (partes[1] ?? String(medida)).trim()
    }
    const preTam = (tam: String | undefined) => {
        if (dato.producto.tipoDeProducto?.detalleDeTorta.estructura == true) {
            if (tam && String(tam).startsWith("Estructura ")) {
                return tam
            }
            return "Estructura " + porciones(tam)
        }
        return tam
    }
    const preRelleno = (num: number) => {
        if (dato.producto.tipoDeProducto?.detalleDeTorta.pisos == 1) {
            if (tieneDosRellenos(prefijoForma(dato.producto.tipoDeProducto?.detalleDeTorta)) && num == 2) {
                return ""
            } else if (num == 3 || num == 4 || num == 5 || num == 6 || num == 7 || num == 8) {
                return ""
            }
            else {
                return dato.producto.tipoDeProducto?.detalleDeTorta.sabores[num].sabor
            }

        }

        if (dato.producto.tipoDeProducto?.detalleDeTorta.pisos == 2) {
            if (tieneDosRellenos(prefijoForma(dato.producto.tipoDeProducto?.detalleDeTorta)) && num == 2) {
                return ""
            } else if (tieneDosRellenos(prefijoForma(dato.producto.tipoDeProducto?.detalleDeTorta)) && num == 5) {
                return ""
            }
            else if (num == 6 || num == 7 || num == 8) {

                return ""

            } else {
                return dato.producto.tipoDeProducto?.detalleDeTorta.sabores[num].sabor
            }

        }

        if (dato.producto.tipoDeProducto?.detalleDeTorta.pisos == 3) {

            if (tieneDosRellenos(prefijoForma(dato.producto.tipoDeProducto?.detalleDeTorta)) && num == 2) {
                return ""
            } else if (tieneDosRellenos(prefijoForma(dato.producto.tipoDeProducto?.detalleDeTorta)) && num == 5) {
                return ""
            }
            else {
                return dato.producto.tipoDeProducto?.detalleDeTorta.sabores[num].sabor

            }

        }

    }
    const valorRelleno = (valor: String | undefined) => {
        let precio: number = 0
        for (let index = 0; index < dato.lista.length; index++) {
            if (dato.lista[index].sabor == valor) {
                precio = precio + dato.lista[index].categoria.precio
            }

        }
        return precio
    }
    const valorTamaño = (valor: String | undefined) => {
        let precio = 0

        if (prefijoForma(dato.producto.tipoDeProducto?.detalleDeTorta) == "TCI") {

            for (let index = 0; index < tamañosCirculos.length; index++) {
                if (tamañosCirculos[index].medida == valor) {
                    precio = precio + tamañosCirculos[index].precio
                }

            }
        }

        if (prefijoForma(dato.producto.tipoDeProducto?.detalleDeTorta) == "TCU") {

            for (let index = 0; index < tamañosCuadrados.length; index++) {
                if (tamañosCuadrados[index].medida == valor) {
                    precio = precio + tamañosCuadrados[index].precio
                }

            }
        }

        if (prefijoForma(dato.producto.tipoDeProducto?.detalleDeTorta) == "TRE") {

            for (let index = 0; index < tamañosRectangulares.length; index++) {
                if (tamañosRectangulares[index].medida == valor) {
                    precio = precio + tamañosRectangulares[index].precio
                }

            }
        }

        return precio

    }
    const valorBiscocuelo = (valor: String | undefined) => {
        let precio = 0
        for (let index = 0; index < biscochuelos.length; index++) {
            if (biscochuelos[index].sabor == valor) {
                precio = precio + biscochuelos[index].precio
            }

        }

        return precio
    }
    const calcularPrecioTotal = (overrides?: {
        tamaño?: String
        tamañoDos?: String
        tamañoTres?: String
        biscochuelo?: String
        biscochueloDos?: String
        biscochueloTres?: String
        rellenoUno?: String
        rellenoDos?: String
        rellenoTres?: String
        rellenoCuatro?: String
        rellenoCinco?: String
        rellenoSeis?: String
        rellenoSiete?: String
        rellenoOcho?: String
        rellenoNueve?: String
    }) => {
        const tam = overrides?.tamaño ?? tamaño
        const tamDos = overrides?.tamañoDos ?? tamañoDos
        const tamTres = overrides?.tamañoTres ?? tamañoTres
        const bis = overrides?.biscochuelo ?? biscochuelo
        const bisDos = overrides?.biscochueloDos ?? biscochueloDos
        const bisTres = overrides?.biscochueloTres ?? biscochueloTres
        const r1 = overrides?.rellenoUno ?? rellenoUno
        const r2 = overrides?.rellenoDos ?? rellenoDos
        const r3 = overrides?.rellenoTres ?? rellenoTres
        const r4 = overrides?.rellenoCuatro ?? rellenoCuatro
        const r5 = overrides?.rellenoCinco ?? rellenoCinco
        const r6 = overrides?.rellenoSeis ?? rellenoSeis
        const r7 = overrides?.rellenoSiete ?? rellenoSiete
        const r8 = overrides?.rellenoOcho ?? rellenoOcho
        const r9 = overrides?.rellenoNueve ?? rellenoNueve

        const pisos = dato.producto.tipoDeProducto?.detalleDeTorta.pisos

        // El precio base ya incluye la configuración original de la torta (tamaños, bizcochuelos y rellenos
        // cargados al crear el producto). Al elegir otras opciones se suma o resta solo la diferencia.
        const sumaOpciones = (
            t1: String | undefined, t2: String | undefined, t3: String | undefined,
            b1: String | undefined, b2: String | undefined, b3: String | undefined,
            rel: (String | undefined)[]
        ) => {
            let suma = valorRelleno(rel[0]) + valorRelleno(rel[1]) + valorRelleno(rel[2]) + valorTamaño(t1) + valorBiscocuelo(b1)
            if (pisos && pisos >= 2) {
                suma += valorRelleno(rel[3]) + valorRelleno(rel[4]) + valorRelleno(rel[5]) + valorTamaño(t2) + valorBiscocuelo(b2)
            }
            if (pisos && pisos >= 3) {
                suma += valorRelleno(rel[6]) + valorRelleno(rel[7]) + valorRelleno(rel[8]) + valorTamaño(t3) + valorBiscocuelo(b3)
            }
            return suma
        }
        const detalle = dato.producto.tipoDeProducto?.detalleDeTorta
        const originales = sumaOpciones(
            preTam(detalle?.tamaño?.medida), preTam(detalle?.tamañoDos?.medida), preTam(detalle?.tamañoTres?.medida),
            detalle?.bizcochuelo?.bizcochuelo, detalle?.bizcochueloDos?.bizcochuelo, detalle?.bizcochueloTres?.bizcochuelo,
            [0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => preRelleno(i))
        )
        const elegidas = sumaOpciones(tam, tamDos, tamTres, bis, bisDos, bisTres, [r1, r2, r3, r4, r5, r6, r7, r8, r9])
        const precio = dato.producto.precio + elegidas - originales
        return precio
    }

    const [listaTamaño, setMostrarTamaño] = useState<Tam[]>(preLista())
    const [listaTamañoDos, setMostrarTamañoDos] = useState<Tam[]>(prel(2))
    const [listaTamañoTres, setMostrarTamañoTres] = useState<Tam[]>(prel(3))
    const [tamaño, setTamaño] = useState<String | undefined>(preTam(dato.producto.tipoDeProducto?.detalleDeTorta.tamaño?.medida))
    const [tamañoDos, setTamañoDos] = useState<String | undefined>(preTam(dato.producto.tipoDeProducto?.detalleDeTorta.tamañoDos?.medida))
    const [tamañoTres, setTamañoTres] = useState<String | undefined>(preTam(dato.producto.tipoDeProducto?.detalleDeTorta.tamañoTres?.medida))
    const [biscochuelo, setBiscochuelo] = useState<String | undefined>(dato.producto.tipoDeProducto?.detalleDeTorta.bizcochuelo?.bizcochuelo)
    const [biscochueloDos, setBiscochueloDos] = useState<String | undefined>(dato.producto.tipoDeProducto?.detalleDeTorta.bizcochueloDos?.bizcochuelo)
    const [biscochueloTres, setBiscochueloTres] = useState<String | undefined>(dato.producto.tipoDeProducto?.detalleDeTorta.bizcochueloTres?.bizcochuelo)
    const [rellenoUno, setRelleno] = useState<String | undefined>(preRelleno(0))
    const [rellenoDos, setRellenoDos] = useState<String | undefined>(preRelleno(1))
    const [rellenoTres, setRellenoTres] = useState<String | undefined>(preRelleno(2))
    const [rellenoCuatro, setRellenoCuatro] = useState<String | undefined>(preRelleno(3))
    const [rellenoCinco, setRellenoCinco] = useState<String | undefined>(preRelleno(4))
    const [rellenoSeis, setRellenoSeis] = useState<String | undefined>(preRelleno(5))
    const [rellenoSiete, setRellenoSiete] = useState<String | undefined>(preRelleno(6))
    const [rellenoOcho, setRellenoOcho] = useState<String | undefined>(preRelleno(7))
    const [rellenoNueve, setRellenoNueve] = useState<String | undefined>(preRelleno(8))
    const [precio, setPrecio] = useState(calcularPrecioTotal());
    const sesion = useSesionUsuario()
    const [mostrarModalDuplicado, setMostrarModalDuplicado] = useState(false)

    const modiTamaño = (tam: String | undefined, pre: String) => {

        if (dato.producto.tipoDeProducto?.detalleDeTorta.pisos == 1) {
            if (pre == "tamañoUno") {
                setTamaño(tam)
                setPrecio(calcularPrecioTotal({ tamaño: tam }))
            }
        }

        if (dato.producto.tipoDeProducto?.detalleDeTorta.pisos == 2) {

            if (pre == "tamañoUno") {

                if (parseInt(tam?.substring(0, 2) || "0") <= parseInt(tamañoDos?.substring(0, 2) || "0")) {

                    const nuevaListaTamañoDos = preListaDos(tam)
                    const nuevoTamañoDos = nuevaListaTamañoDos.at(-1)?.medida

                    setTamaño(tam)
                    setMostrarTamañoDos(nuevaListaTamañoDos)
                    setTamañoDos(nuevoTamañoDos)
                    setPrecio(calcularPrecioTotal({ tamaño: tam, tamañoDos: nuevoTamañoDos }))

                } else {
                    setTamaño(tam)
                    setPrecio(calcularPrecioTotal({ tamaño: tam }))
                    setMostrarTamañoDos(preListaDos(tam))
                }

            }

            if (pre == "tamañoDos") {
                setTamañoDos(tam)
                setPrecio(calcularPrecioTotal({ tamañoDos: tam }))
            }

        }
        if (dato.producto.tipoDeProducto?.detalleDeTorta.pisos == 3) {

            if (pre == "tamañoUno") {
                if (parseInt(tam?.substring(0, 2) || "0") <= parseInt(tamañoDos?.substring(0, 2) || "0")) {
                    const nuevaListaTamañoDos = preListaDos(tam)
                    const nuevoTamañoDos = nuevaListaTamañoDos.at(-1)?.medida
                    const nuevaListaTamañoTres = preListadoTres(tam, nuevoTamañoDos)
                    const nuevoTamañoTres = nuevaListaTamañoTres.at(-1)?.medida

                    setTamaño(tam)
                    setMostrarTamañoDos(nuevaListaTamañoDos)
                    setTamañoDos(nuevoTamañoDos)
                    setMostrarTamañoTres(nuevaListaTamañoTres)
                    setTamañoTres(nuevoTamañoTres)
                    setPrecio(calcularPrecioTotal({ tamaño: tam, tamañoDos: nuevoTamañoDos, tamañoTres: nuevoTamañoTres }))

                }
                else {
                    setTamaño(tam)
                    setPrecio(calcularPrecioTotal({ tamaño: tam }))
                    setMostrarTamañoDos(preListaDos(tam))
                }
            }

            if (pre == "tamañoDos") {
                if (parseInt(tam?.substring(0, 2) || "0") <= parseInt(tamañoTres?.substring(0, 2) || "0")) {

                    const nuevaListaTamañoTres = preListadoTres(tamaño, tam)
                    const nuevoTamañoTres = nuevaListaTamañoTres.at(-1)?.medida

                    setTamañoDos(tam)
                    setMostrarTamañoTres(nuevaListaTamañoTres)
                    setTamañoTres(nuevoTamañoTres)
                    setPrecio(calcularPrecioTotal({ tamañoDos: tam, tamañoTres: nuevoTamañoTres }))

                } else {
                    setTamañoDos(tam)
                    setPrecio(calcularPrecioTotal({ tamañoDos: tam }))
                    setMostrarTamañoTres(preListadoTres(tamaño, tam))
                }

            }

            if (pre == "tamañoTres") {
                setPrecio(calcularPrecioTotal({ tamañoTres: tam }))
                setTamañoTres(tam)
            }
        }

    }
    const modiBiscochuelo = (tam: String | undefined, pre: String) => {

        if (dato.producto.tipoDeProducto?.detalleDeTorta.pisos == 1) {
            if (pre == "biscochueloUno") {
                setBiscochuelo(tam)
                setPrecio(calcularPrecioTotal({ biscochuelo: tam }))
            }
        }
        if (dato.producto.tipoDeProducto?.detalleDeTorta.pisos == 2) {
            if (pre == "biscochueloUno") {
                setBiscochuelo(tam)
                setPrecio(calcularPrecioTotal({ biscochuelo: tam }))
            }
            if (pre == "biscochueloDos") {
                setBiscochueloDos(tam)
                setPrecio(calcularPrecioTotal({ biscochueloDos: tam }))
            }
        }
        if (dato.producto.tipoDeProducto?.detalleDeTorta.pisos == 3) {
            if (pre == "biscochueloUno") {
                setBiscochuelo(tam)
                setPrecio(calcularPrecioTotal({ biscochuelo: tam }))
            }
            if (pre == "biscochueloDos") {
                setBiscochueloDos(tam)
                setPrecio(calcularPrecioTotal({ biscochueloDos: tam }))
            }
            if (pre == "biscochueloTres") {
                setBiscochueloTres(tam)
                setPrecio(calcularPrecioTotal({ biscochueloTres: tam }))
            }
        }

    }
    const modiRelleno = (tam: String | undefined, pre: String) => {

        if (pre == "Relleno 1") {
            setRelleno(tam)
            setPrecio(calcularPrecioTotal({ rellenoUno: tam }))
        }
        if (pre == "Relleno 2") {
            setRellenoDos(tam)
            setPrecio(calcularPrecioTotal({ rellenoDos: tam }))
        }
        if (pre == "Relleno 3") {
            setRellenoTres(tam)
            setPrecio(calcularPrecioTotal({ rellenoTres: tam }))
        }
        if (pre == "Relleno 4") {
            setRellenoCuatro(tam)
            setPrecio(calcularPrecioTotal({ rellenoCuatro: tam }))
        }
        if (pre == "Relleno 5") {
            setRellenoCinco(tam)
            setPrecio(calcularPrecioTotal({ rellenoCinco: tam }))
        }
        if (pre == "Relleno 6") {
            setRellenoSeis(tam)
            setPrecio(calcularPrecioTotal({ rellenoSeis: tam }))
        }
        if (pre == "Relleno 7") {
            setRellenoSiete(tam)
            setPrecio(calcularPrecioTotal({ rellenoSiete: tam }))
        }
        if (pre == "Relleno 8") {
            setRellenoOcho(tam)
            setPrecio(calcularPrecioTotal({ rellenoOcho: tam }))
        }
        if (pre == "Relleno 9") {
            setRellenoNueve(tam)
            setPrecio(calcularPrecioTotal({ rellenoNueve: tam }))
        }
    }

    const crearDatoUnPiso = () => {

        const pre: NivelDos = {
            producto: dato.producto,
            lista: dato.lista,
            listaBizcochuelos: biscochuelos,
            tamaño: tamaño,
            tamañoDos: tamañoDos,
            listaTamaño: listaTamaño,
            biscochuelo: biscochuelo,
            biscochueloDos: biscochueloDos,
            rellenoUno: rellenoUno,
            rellenoDos: rellenoDos,
            rellenoTres: rellenoTres,
            funcionTamaño: modiTamaño,
            funcionBiscochuelo: modiBiscochuelo,
            funcionRelleno: modiRelleno

        }
        return pre
    }
    const crearDatoDosPisos = () => {
        const pre: NivelTres = {
            producto: dato.producto,
            lista: dato.lista,
            listaBizcochuelos: biscochuelos,
            listaTamaño: listaTamaño,
            listaTamañoDos: listaTamañoDos,
            tamaño: tamaño,
            tamañoDos: tamañoDos,
            biscochuelo: biscochuelo,
            biscochueloDos: biscochueloDos,
            rellenoUno: rellenoUno,
            rellenoDos: rellenoDos,
            rellenoTres: rellenoTres,
            rellenoCuatro: rellenoCuatro,
            rellenoCinco: rellenoCinco,
            rellenoSeis: rellenoSeis,
            funcionTamaño: modiTamaño,
            funcionBiscochuelo: modiBiscochuelo,
            funcionRelleno: modiRelleno,

        }
        return pre
    }
    const crearDatoTresPisos = () => {
        const pre: NivelCuatro = {
            producto: dato.producto,
            lista: dato.lista,
            listaBizcochuelos: biscochuelos,
            listaTamaño: listaTamaño,
            listaTamañoDos: listaTamañoDos,
            listaTamañoTres: listaTamañoTres,
            tamaño: tamaño,
            tamañoDos: tamañoDos,
            tamañoTres: tamañoTres,
            biscochuelo: biscochuelo,
            biscochueloDos: biscochueloDos,
            biscochueloTres: biscochueloTres,
            rellenoUno: rellenoUno,
            rellenoDos: rellenoDos,
            rellenoTres: rellenoTres,
            rellenoCuatro: rellenoCuatro,
            rellenoCinco: rellenoCinco,
            rellenoSeis: rellenoSeis,
            rellenoSiete: rellenoSiete,
            rellenoOcho: rellenoOcho,
            rellenoNueve: rellenoNueve,
            funcionTamaño: modiTamaño,
            funcionBiscochuelo: modiBiscochuelo,
            funcionRelleno: modiRelleno,

        }
        return pre
    }
    const resetear = () => {

        const tamañoOriginal = preTam(dato.producto.tipoDeProducto?.detalleDeTorta.tamaño?.medida)
        const tamañoDosOriginal = preTam(dato.producto.tipoDeProducto?.detalleDeTorta.tamañoDos?.medida)
        const tamañoTresOriginal = preTam(dato.producto.tipoDeProducto?.detalleDeTorta.tamañoTres?.medida)
        const biscochueloOriginal = dato.producto.tipoDeProducto?.detalleDeTorta.bizcochuelo?.bizcochuelo
        const biscochueloDosOriginal = dato.producto.tipoDeProducto?.detalleDeTorta.bizcochueloDos?.bizcochuelo
        const biscochueloTresOriginal = dato.producto.tipoDeProducto?.detalleDeTorta.bizcochueloTres?.bizcochuelo

        if (dato.producto.tipoDeProducto?.detalleDeTorta.pisos == 1) {

            setTamaño(tamañoOriginal)
            setBiscochuelo(biscochueloOriginal)
            setRelleno(preRelleno(0))
            setRellenoDos(preRelleno(1))
            setRellenoTres(preRelleno(2))
            setPrecio(calcularPrecioTotal({
                tamaño: tamañoOriginal,
                biscochuelo: biscochueloOriginal,
                rellenoUno: preRelleno(0),
                rellenoDos: preRelleno(1),
                rellenoTres: preRelleno(2),
            }))
        }
        if (dato.producto.tipoDeProducto?.detalleDeTorta.pisos == 2) {
            setMostrarTamañoDos(preListaDos(tamañoOriginal))
            setTamaño(tamañoOriginal)
            setTamañoDos(tamañoDosOriginal)
            setBiscochuelo(biscochueloOriginal)
            setBiscochueloDos(biscochueloDosOriginal)
            setRelleno(preRelleno(0))
            setRellenoDos(preRelleno(1))
            setRellenoTres(preRelleno(2))
            setRellenoCuatro(preRelleno(3))
            setRellenoCinco(preRelleno(4))
            setRellenoSeis(preRelleno(5))
            setPrecio(calcularPrecioTotal({
                tamaño: tamañoOriginal,
                tamañoDos: tamañoDosOriginal,
                biscochuelo: biscochueloOriginal,
                biscochueloDos: biscochueloDosOriginal,
                rellenoUno: preRelleno(0),
                rellenoDos: preRelleno(1),
                rellenoTres: preRelleno(2),
                rellenoCuatro: preRelleno(3),
                rellenoCinco: preRelleno(4),
                rellenoSeis: preRelleno(5),
            }))
        }
        if (dato.producto.tipoDeProducto?.detalleDeTorta.pisos == 3) {
            const nuevaListaTamañoDos = preListaDos(tamañoOriginal)
            setMostrarTamañoDos(nuevaListaTamañoDos)
            setMostrarTamañoTres(preListadoTres(dato.producto.tipoDeProducto?.detalleDeTorta.tamaño?.medida, nuevaListaTamañoDos.at(-1)?.medida))
            setTamaño(tamañoOriginal)
            setTamañoDos(tamañoDosOriginal)
            setTamañoTres(tamañoTresOriginal)
            setBiscochuelo(biscochueloOriginal)
            setBiscochueloDos(biscochueloDosOriginal)
            setBiscochueloTres(biscochueloTresOriginal)
            setRelleno(preRelleno(0))
            setRellenoDos(preRelleno(1))
            setRellenoTres(preRelleno(2))
            setRellenoCuatro(preRelleno(3))
            setRellenoCinco(preRelleno(4))
            setRellenoSeis(preRelleno(5))
            setRellenoSiete(preRelleno(6))
            setRellenoOcho(preRelleno(7))
            setRellenoNueve(preRelleno(8))
            setPrecio(calcularPrecioTotal({
                tamaño: tamañoOriginal,
                tamañoDos: tamañoDosOriginal,
                tamañoTres: tamañoTresOriginal,
                biscochuelo: biscochueloOriginal,
                biscochueloDos: biscochueloDosOriginal,
                biscochueloTres: biscochueloTresOriginal,
                rellenoUno: preRelleno(0),
                rellenoDos: preRelleno(1),
                rellenoTres: preRelleno(2),
                rellenoCuatro: preRelleno(3),
                rellenoCinco: preRelleno(4),
                rellenoSeis: preRelleno(5),
                rellenoSiete: preRelleno(6),
                rellenoOcho: preRelleno(7),
                rellenoNueve: preRelleno(8),
            }))
        }

    }

    const alergenosDeRellenos: (Alergeno[] | undefined)[] = [rellenoUno, rellenoDos, rellenoTres, rellenoCuatro, rellenoCinco,
        rellenoSeis, rellenoSiete, rellenoOcho, rellenoNueve]
        .filter((r) => r && r !== "" && r !== "Ninguno")
        .map((r) => dato.lista.find((s) => s.sabor == r)?.alergenos)
    const alergenosDeBizcochuelos: (Alergeno[] | undefined)[] = [biscochuelo, biscochueloDos, biscochueloTres]
        .filter((b) => b && b !== "")
        .map((b) => dato.listaBizcochuelos.find((x) => x.bizcochuelo == b)?.alergenos)
    const alergenosTorta = unirAlergenos(dato.producto.alergenos, ...alergenosDeRellenos, ...alergenosDeBizcochuelos)
    const establecerAlergenosTorta = useAlergenosTorta((s) => s.establecer)
    const claveAlergenos = alergenosTorta.join(",")
    useEffect(() => {
        establecerAlergenosTorta(dato.producto.idProducto, alergenosTorta)
    }, [claveAlergenos, dato.producto.idProducto])

    const construirDescripcion = () => {
        const pisos = dato.producto.tipoDeProducto?.detalleDeTorta.pisos ?? 1
        const partes: string[] = []

        partes.push(`Piso 1: ${tamaño ?? "-"} / Bizcochuelo: ${biscochuelo ?? "-"}`)
        if (pisos >= 2) {
            partes.push(`Piso 2: ${tamañoDos ?? "-"} / Bizcochuelo: ${biscochueloDos ?? "-"}`)
        }
        if (pisos >= 3) {
            partes.push(`Piso 3: ${tamañoTres ?? "-"} / Bizcochuelo: ${biscochueloTres ?? "-"}`)
        }

        const rellenos = [
            rellenoUno, rellenoDos, rellenoTres, rellenoCuatro, rellenoCinco,
            rellenoSeis, rellenoSiete, rellenoOcho, rellenoNueve,
        ].filter((r) => r) as string[]

        if (rellenos.length > 0) {
            partes.push(`Relleno: ${rellenos.join(", ")}`)
        }

        return partes.join(" | ")
    }

    const agregarCarrito = () => {
        if (!sesion) {
            toast.warning("Debes iniciar sesión o registrarte para agregar productos al carrito.", {
                position: "top-center",
                autoClose: 3000,
                theme: "colored",
                transition: Bounce,
            })
            return
        }

        const yaEnCarrito = obtenerCarrito().some(
            (item) => item.idProducto === dato.producto.idProducto
        )
        if (yaEnCarrito) {
            setMostrarModalDuplicado(true)
            return
        }

        realizarAgregado()
    }

    const realizarAgregado = () => {
        agregarAlCarrito({
            idProducto: dato.producto.idProducto,
            nombre: String(dato.producto.nombre),
            imagen: String(dato.producto.url_image),
            tipo: String(dato.producto.tipoDeProducto?.tipo ?? "TORTA"),
            categoria: String(dato.producto.categoria ?? ""),
            descripcion: construirDescripcion(),
            precioUnitario: precio,
        })
    }

    return (
        <div className="relative px-4 pb-28 bg-blue-100 w-full h-full min-h-157 rounded-xl">
            <div className="flex justify-center pt-4 pb-4"><h2 className={`font-bold text-2xl underline text-cyan-900 ${oi.className}`}>{dato.producto.nombre}</h2></div>

            <div className="w-full sm:w-fit sm:mx-auto">
                {dato.producto.tipoDeProducto?.detalleDeTorta.pisos == 1 ?
                    <MenuDetalleDeTortaUnPiso{...crearDatoUnPiso()}></MenuDetalleDeTortaUnPiso>
                    : dato.producto.tipoDeProducto?.detalleDeTorta.pisos == 2 ?
                        <MenuDetalleDeTortaDosPisos{...crearDatoDosPisos()}></MenuDetalleDeTortaDosPisos>
                        : <MenuDetalleDeTortaTresPisos{...crearDatoTresPisos()}></MenuDetalleDeTortaTresPisos>
                }

            </div>

            <div className="absolute bottom-14 left-4 right-4 sm:left-6 sm:right-6 flex items-center justify-between gap-2">
                <button onClick={() => resetear()} className="bg-orange-500 hover:bg-orange-600 px-4 py-1 h-9 rounded-2xl cursor-pointer">
                    <div className="text-white font-medium text-heading text-lg">Reiniciar</div>
                </button>

                <div className="flex">
                    <div className="flex items-center px-3 sm:px-4 py-1 h-9 whitespace-nowrap text-white text-base sm:text-lg font-medium rounded-l-2xl bg-[#0f98c5]">Precio Final</div>
                    <div className="flex items-center whitespace-nowrap text-gray-600 text-base sm:text-lg px-3 sm:px-4 py-1 bg-white h-9 rounded-r-lg">{precio} $</div>
                </div>
            </div>

            <div className="absolute bottom-3 left-4 right-4 sm:left-6 sm:right-6">
                <button
                    onClick={() => agregarCarrito()}
                    className="w-full h-10 rounded-2xl bg-[#09c99f] hover:bg-[#07a88a] cursor-pointer"
                >
                    <div className="text-white font-semibold text-heading text-xl">
                        Agregar al Carrito
                    </div>
                </button>
            </div>

            <ToastContainer
                position="top-center"
                autoClose={3000}
                theme="colored"
                transition={Bounce}
            />

            <ModalProductoEnCarrito
                abierto={mostrarModalDuplicado}
                onCancelar={() => setMostrarModalDuplicado(false)}
                onConfirmar={() => {
                    realizarAgregado()
                    setMostrarModalDuplicado(false)
                }}
            />

        </div>

    )

}
