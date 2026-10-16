export type Alergeno =
    | "GLUTEN"
    | "HUEVO"
    | "LECHE"
    | "MANI"
    | "FRUTOS_SECOS"
    | "SOJA"
    | "PESCADO"
    | "CRUSTACEOS"
    | "SULFITOS"

export const ALERGENOS: { valor: Alergeno; etiqueta: string; corta: string }[] = [
    { valor: "GLUTEN", etiqueta: "Gluten (TACC)", corta: "TACC" },
    { valor: "HUEVO", etiqueta: "Huevo", corta: "Huevo" },
    { valor: "LECHE", etiqueta: "Leche", corta: "Leche" },
    { valor: "MANI", etiqueta: "Maní", corta: "Maní" },
    { valor: "FRUTOS_SECOS", etiqueta: "Frutos secos", corta: "F. secos" },
    { valor: "SOJA", etiqueta: "Soja", corta: "Soja" },
    { valor: "PESCADO", etiqueta: "Pescado", corta: "Pescado" },
    { valor: "CRUSTACEOS", etiqueta: "Crustáceos", corta: "Crust." },
    { valor: "SULFITOS", etiqueta: "Sulfitos", corta: "Sulfitos" },
]

export function unirAlergenos(...listas: (Alergeno[] | null | undefined)[]): Alergeno[] {
    const presentes = new Set<Alergeno>()
    listas.forEach((lista) => (lista ?? []).forEach((a) => presentes.add(a)))
    return ALERGENOS.map((a) => a.valor).filter((v) => presentes.has(v))
}

export function etiquetaAlergeno(valor: Alergeno): string {
    return ALERGENOS.find((a) => a.valor === valor)?.etiqueta ?? valor
}
