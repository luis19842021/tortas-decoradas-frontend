import { Alergeno } from "@/features/productos/alergenos";

export type Producto = {
    idProducto: number;
    nombre: String;
    precio: number;
    url_image: String;
    url_image2: String;
    url_image3: String;
    url_image4: String;
    descripcion: String
    categoria: String
    subcategoria: String
    categoesp: String
    tipoDeProducto: TipoDeProducto | null
    suspendido: boolean
    ingredientes?: String | null
    alergenos?: Alergeno[]
    trazas?: Alergeno[]
}

export type DetalleTorta = {

    idDetalleTorta: number
    pisos: number
    estructura: Boolean
    sabores: Sabor[]
    tamaño: TamañoCatalogo | null
    tamañoDos: TamañoCatalogo | null
    tamañoTres: TamañoCatalogo | null
    bizcochuelo: Bizcochuelo | null
    bizcochueloDos: Bizcochuelo | null
    bizcochueloTres: Bizcochuelo | null
}
export type DetalleGalleta = {
    idDetalleGalleta: number
    sabor: String
    cantidad: number

}
export type DetalleCupcake = {
    idDetalleGalleta: number
    sabor: String
    cantidad: number

}
export type DetalleMinidonas = {
    idDetalleMinidonas: number
    cantidadMinidonas: number
}
export type DetallePaletas = {
    idDetallePaletas: number
    cantidadPaletas: number
}
export type DetalleOreos = {
    idDetalleOreos: number
    cantidadOreos: number
}
export type DetalleCakePops = {
    idDetalleCakePops: number
    cantidadCakePops: number
}
export type TipoDeProducto = {
    detalleDeTorta: DetalleTorta
    detalleDeGalleta: DetalleGalleta
    detalleDeCupcake: DetalleCupcake
    detalleDeCakePops: DetalleCakePops
    detalleDeMinidonas:DetalleMinidonas
    detalleDePaletas:DetallePaletas
    detalleDeOreos:DetalleOreos
    tipo: String
    idTipoDeProducto: number
}

export type ProductoEntity = {
    nombre: String;
    precio: number;
    url_image: String;
    url_image2: String;
    url_image3: String;
    url_image4: String;
    descripcion: String
    categoria: String
    subcategoria: String
    categoesp: number
    tipoDeProducto: TipoDeProductoEntity | null
    suspendido: boolean
    ingredientes?: String | null
    alergenos?: Alergeno[]
    trazas?: Alergeno[]
}
export type TipoDeProductoEntity = {
    detalleDeTorta: DetalleTortaEntity | null
    detalleDeGalleta: DetalleGalletaEntity | null
    detalleDeCupcake: DetalleCupcakeEntity | null
    detalleDeCakePops : DetalleCakePopsEntity | null
     detalleDeMinidonas:DetalleMinidonasEntity|null
    detalleDePaletas:DetallePaletasEntity|null
    detalleDeOreos:DetalleOreosEntity|null
    tipo: String

}

export type DetalleGalletaEntity = {

    sabor: String
    cantidad: number

}
export type DetalleCupcakeEntity = {

    sabor: String
    cantidad: number

}
export type DetalleCakePopsEntity = {
    cantidadCakePops: number
}
export type DetalleMinidonasEntity = {
   cantidadMinidonas: number
}
export type DetallePaletasEntity = {
  cantidadPaletas: number
}
export type DetalleOreosEntity = {
   cantidadOreos: number
}
export type DetalleTortaEntity = {

    pisos: number
    estructura: Boolean
    sabores: SaborEntity[]
    tamaño: TamañoEntity | null
    tamañoDos: TamañoEntity | null
    tamañoTres: TamañoEntity | null
    bizcochuelo: BizcochueloEntity | null
    bizcochueloDos: BizcochueloEntity | null
    bizcochueloTres: BizcochueloEntity | null
}
export type Paquete = {
    producto: Producto
    tipo: String
    seccion: String
    productosPorTipo: Producto[]
    funcionDOS: () => void
    asignaciones?: Record<number, string[]>
}
export type Sabor = {
    idLista_sabor: number
    sabor: String
    categoria: CategoriaSabor
    alergenos?: Alergeno[]
}

export type CategoriaSabor = {
    idCategoriaSabor: number
    nombre: String
    precio: number
}

export type SaborEntity = {
    idLista_sabor: number

}

export type TamañoEntity = {
    idLista_tamaño: number
}

export type BizcochueloEntity = {
    idLista_bizcochuelo: number
}

export type Bizcochuelo = {
    idLista_bizcochuelo: number
    bizcochuelo: String
    precio: number
    alergenos?: Alergeno[]
}

export type TamañoCatalogo = {
    idLista_tamaño: number
    medida: String
    forma: String
    precio: number
}

export type CodigoPostal = {
    idLista_codigoPostal: number
    numero: number
    localidad: String
    precio: number
}
