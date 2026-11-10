import { oi } from '@/app/ui/fonts';
import { Producto } from '@/app/interfaces/producto.interface';
import { getCategoriasEspecial} from '@/features/productos/api';
import Cards from './Cards';

interface Titulos {
  tipo: string
  seccion: string
}

export default async function TitulosHome(titulo: Titulos) {

  const productDetipoCategoria: Producto[] = await getCategoriasEspecial(titulo.tipo)

  return (

    <div>
      <div className=" flex justify-center items-center mt-5 md:mt-12  w-full h-25 bg-blue-200">
        <h2 className={`${oi.className} flex text-gray-600 items-center relative text-2xl md:text-4xl `}>
          {titulo.seccion}
        </h2>

      </div>

      <div className="flex justify-center items-center w-full h-auto pt-10">

        <div className="grid grid-cols-1 md:grid-cols-2  lg:grid-cols-4  gap-4 ">
          {productDetipoCategoria.map((slide, slideIndex) => (

            <div key={slideIndex} className='text-2xl cursor-pointer'>
              <Cards {...productDetipoCategoria[slideIndex]} />

            </div>
          ))}

        </div>

      </div>
    </div>

  )

}
