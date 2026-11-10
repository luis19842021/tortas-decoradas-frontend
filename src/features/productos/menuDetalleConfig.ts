import { Producto } from "@/app/interfaces/producto.interface";

export interface OpcionSabor {
    sabor: string;
    precio: number;
}

export type ConfigMenuDetalle =
    | {
        variante: "sabor-cantidad";
        tipoFallback: string;
        sabores: OpcionSabor[];
        leerSaborInicial: (producto: Producto) => string | undefined;
        leerCantidadInicial: (producto: Producto) => number | undefined;
    }
    | {
        variante: "solo-cantidad";
        tipoFallback: string;
        leerCantidadInicial: (producto: Producto) => number | undefined;
    }
    | {
        variante: "sin-selector";
        tipoFallback: string;
    };

export const CANTIDADES_BASICAS: number[] = [6, 12, 18, 24, 30, 36, 42];

export const SABORES_BASICOS: OpcionSabor[] = [
    { sabor: "vainilla", precio: 1000 },
    { sabor: "chocolate", precio: 6000 },
];

export const CONFIG_CUPCAKE: ConfigMenuDetalle = {
    variante: "sabor-cantidad",
    tipoFallback: "CUPCAKE",
    sabores: SABORES_BASICOS,
    leerSaborInicial: (producto) =>
        producto.tipoDeProducto?.detalleDeCupcake.sabor.toLocaleLowerCase(),
    leerCantidadInicial: (producto) =>
        producto.tipoDeProducto?.detalleDeCupcake.cantidad,
};

export const CONFIG_GALLETITA: ConfigMenuDetalle = {
    variante: "sabor-cantidad",
    tipoFallback: "GALLETITA",
    sabores: SABORES_BASICOS,
    leerSaborInicial: (producto) =>
        producto.tipoDeProducto?.detalleDeGalleta.sabor.toLocaleLowerCase(),
    leerCantidadInicial: (producto) =>
        producto.tipoDeProducto?.detalleDeGalleta.cantidad,
};

export const CONFIG_CAKEPOPS: ConfigMenuDetalle = {
    variante: "solo-cantidad",
    tipoFallback: "CAKEPOP",
    leerCantidadInicial: (producto) =>
        producto.tipoDeProducto?.detalleDeCakePops.cantidadCakePops,
};

export const CONFIG_OREOS: ConfigMenuDetalle = {
    variante: "solo-cantidad",
    tipoFallback: "OREO",
    leerCantidadInicial: (producto) =>
        producto.tipoDeProducto?.detalleDeOreos.cantidadOreos,
};

export const CONFIG_MINIDONAS: ConfigMenuDetalle = {
    variante: "solo-cantidad",
    tipoFallback: "MINIDONA",
    leerCantidadInicial: (producto) =>
        producto.tipoDeProducto?.detalleDeMinidonas.cantidadMinidonas,
};

export const CONFIG_PALETAS: ConfigMenuDetalle = {
    variante: "solo-cantidad",
    tipoFallback: "PALETA",
    leerCantidadInicial: (producto) =>
        producto.tipoDeProducto?.detalleDePaletas.cantidadPaletas,
};

export const CONFIG_VARIADO: ConfigMenuDetalle = {
    variante: "sin-selector",
    tipoFallback: "VARIADO",
};
