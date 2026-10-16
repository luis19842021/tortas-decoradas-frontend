import Carrusel from "@/features/productos/carrusel/Carrusel"
import { getCarrusel } from "@/features/productos/carrusel/api";
import TitulosHome from "@/componenets/TitulosHome";

import { getProduct } from "@/features/productos/api";
import { Producto } from "./interfaces/producto.interface";

export const dynamic = "force-dynamic"

export default async function Home() {

  const imagenesCarrusel = await getCarrusel()
  const pepe: Producto[] = await getProduct()

  const titulos = [
    {
      tipo: "ULTIMO",
      seccion: "Ultimas tortas"
    },
    {
      tipo: "TENDENCIA",
      seccion: "Ultimas Tendencias"
    },
    {
      tipo: "DESTACADO",
      seccion: "Tortas Destacadas del Mes"
    }

  ]

  return (

    <div className="bg-[url('/fondo.jpg')] bg-cover bg-center bg-no-repeat bg-fixed">

      <div>
        <Carrusel imagenes={imagenesCarrusel} />
      </div>

      <div>

        <TitulosHome {...titulos[0]} />
      </div>

      <div>
        <TitulosHome {...titulos[1]} />
      </div>

      <div className="pb-5 md:pb-12">
        <div>
          <TitulosHome {...titulos[2]} />
        </div>

      </div>

    </div>

  );
}
