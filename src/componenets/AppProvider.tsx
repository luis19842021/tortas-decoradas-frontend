"use client"
import { Producto } from "@/app/interfaces/producto.interface";

import { getProduct } from "@/features/productos/api";
import { createContext, ReactNode, useContext, useState } from "react";
type Props = {
    children: ReactNode;
};
interface ContextTipo{
    data:Producto[]|undefined
    updateData:(nuevoValor:Producto[]|undefined)=>void
}
const ut: Producto[] |undefined= undefined
const AppContext = createContext<ContextTipo|undefined>(undefined);

export function AppProvider({ children }: Props) {

const [data,setData]=useState<Producto[]|undefined>(ut)

const updateData=(nuevoValor:Producto[]|undefined)=>{
    setData(nuevoValor)
}

    return (
        <AppContext.Provider value={{data,updateData}} >
            {children}
        </AppContext.Provider>
    )
}

export const useCont=()=>{
const context=useContext(AppContext)
return (context)

}
