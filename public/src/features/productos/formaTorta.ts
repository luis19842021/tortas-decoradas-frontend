import { DetalleTorta } from "@/app/interfaces/producto.interface";

export type PrefijoForma = "TCI" | "TCU" | "TRE" | ""

export const prefijoForma = (detalle: DetalleTorta | null | undefined): PrefijoForma => {
    const forma = String(detalle?.tamaño?.forma ?? "").toUpperCase()
    if (forma == "CIRCULAR") {
        return "TCI"
    }
    if (forma == "CUADRADO") {
        return "TCU"
    }
    if (forma == "RECTANGULAR") {
        return "TRE"
    }
    return ""
}

// Los sabores cargados en una torta de estructura se pueden cambiar. Lo que sigue fijo es la cantidad de sabores (ver rellenoVisible).
// Cuadradas y rectangulares llevan 2 rellenos por piso (las circulares, 3)
export const tieneDosRellenos = (prefijo: PrefijoForma): boolean => {
    return prefijo == "TCU" || prefijo == "TRE"
}

export const rellenoBloqueado = (_estructura: Boolean | undefined, _valor: String | undefined): boolean => {
    return false
}

export const rellenoVisible = (estructura: Boolean | undefined, valor: String | undefined, visiblePorForma: boolean = true): boolean => {
    if (!visiblePorForma) {
        return false
    }
    return !(estructura == true && valor == "Ninguno")
}
