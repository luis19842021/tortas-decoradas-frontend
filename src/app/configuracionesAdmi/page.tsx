import Link from 'next/link';
import { Plus } from 'lucide-react';
import { oi } from '../ui/fonts';
import EditarCarrusel from '@/features/productos/carrusel/EditarCarrusel';
import { getCarrusel } from '@/features/productos/carrusel/api';

import SeccionCategoriaEspeciales from '@/features/categoriasEspeciales/SeccionCategoriaEspeciales';
import EditarProducto from '@/features/productos/EditarProducto';
import EliminarProducto from '@/features/productos/EliminarProducto';
import EditarCupoMaximo from '@/features/configuracion/EditarCupoMaximo';
import AdminSidebarNav from '@/features/configuracion/AdminSidebarNav';
import CalendarioAgendaAdmin from '@/features/configuracion/CalendarioAgendaAdmin';
import AdministrarPerfiles from '@/features/configuracion/AdministrarPerfiles';
import { obtenerConfiguracionAgenda } from '@/features/configuracion/api';
import { Producto } from '../interfaces/producto.interface';
import { getCategoriasEspecial, getListaDeSabores, getListaDeBizcochuelos, getListaDeCategoriasSabor, getCategoriasDisponibles } from '@/features/productos/api';
import AjustarPrecios from '@/features/productos/AjustarPrecios';
import EditarSabores from '@/features/productos/EditarSabores';
import EditarBizcochuelos from '@/features/productos/EditarBizcochuelos';
import RequiereAdmin from '@/features/auth/RequiereAdmin';
interface Dato {
  especialUltimo: Producto[]
  especialTendencia: Producto[]
  especialDestacado: Producto[]
}

export const dynamic = "force-dynamic"

export default async function ConfiAdmi() {

  const imagenesCarrusel = await getCarrusel()

  const configuracionAgenda = await obtenerConfiguracionAgenda()

  const sabores = await getListaDeSabores()
  const categoriasSabor = await getListaDeCategoriasSabor()
  const bizcochuelos = await getListaDeBizcochuelos()
  const categoriasConProductos = Array.from(new Set((await getCategoriasDisponibles()).map((c) => c.categoria)))

  const especialUltimo: Producto[] = await getCategoriasEspecial("ULTIMO")
  const especialTendencia: Producto[] = await getCategoriasEspecial("TENDENCIA")
  const especialDestacado: Producto[] = await getCategoriasEspecial("DESTACADO")

  const dato: Dato = {
    especialUltimo: especialUltimo,
    especialTendencia: especialTendencia,
    especialDestacado: especialDestacado,
  }

  return (
    <RequiereAdmin>
      <div className="flex justify-center">

        <div className="flex flex-col lg:flex-row lg:items-stretch w-full max-w-270">

        <AdminSidebarNav />

        <div className="bg-amber-50 flex-1 min-w-0">

          <div id="carrusel" className="flex items-center h-20 bg-blue-200">
            <h2 className={`${oi.className} flex text-gray-600 pl-4 items-center relative text-2xl md:text-4xl   `}>Editar Carrusel</h2>
          </div>

          <div>
            <div className='mt-4'>
              <EditarCarrusel imagenes={imagenesCarrusel}></EditarCarrusel>
            </div>
          </div>

          <div id="productos" className="flex items-center h-20 bg-blue-200 mt-10">
            <h2 className={`${oi.className} flex text-gray-600 pl-4 items-center relative text-2xl md:text-4xl`}>Gestionar Productos</h2>
          </div>
          <div className="flex justify-center py-6 lg:py-8">
            <div className="flex flex-col gap-6 w-full max-w-210 px-3 xl:px-0">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-2xl shadow-md px-4 sm:px-8 py-5 sm:py-6">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center bg-green-100 rounded-full w-14 h-14 shrink-0">
                    <Plus className="text-green-600" size={28} />
                  </div>
                  <div>
                    <p className="text-gray-700 text-xl font-semibold">Nuevo producto</p>
                    <p className="text-gray-500">Da de alta un producto nuevo en el catálogo.</p>
                  </div>
                </div>
                <Link href="/productos/cargarProductoTorta"
                  className="flex justify-center items-center gap-2 bg-green-300 hover:bg-green-400 rounded-full h-10 px-6 font-bold text-white shadow-cyan-500/50 transition-all duration-500 cursor-pointer shrink-0">
                  Cargar nuevo producto
                </Link>
              </div>

              <EditarProducto />

              <EliminarProducto />
            </div>
          </div>

          <div id="categorias-especiales">
            <SeccionCategoriaEspeciales {...dato}></SeccionCategoriaEspeciales>
          </div>

          <div id="sabores" className="flex items-center h-20 bg-blue-200 mt-10">
            <h2 className={`${oi.className} flex text-gray-600 pl-4 items-center relative text-2xl md:text-4xl`}>Sabores / Rellenos</h2>
          </div>
          <div className="flex justify-center py-6 lg:py-8">
            <div className="flex flex-col gap-6 w-full max-w-210 px-3 xl:px-0">
              <EditarSabores saboresIniciales={sabores} categoriasIniciales={categoriasSabor} />
            </div>
          </div>

          <div id="bizcochuelo" className="flex items-center h-20 bg-blue-200 mt-10">
            <h2 className={`${oi.className} flex text-gray-600 pl-4 items-center relative text-2xl md:text-4xl`}>Bizcochuelo</h2>
          </div>
          <div className="flex justify-center py-6 lg:py-8">
            <div className="flex flex-col gap-6 w-full max-w-210 px-3 xl:px-0">
              <EditarBizcochuelos bizcochuelosIniciales={bizcochuelos} />
            </div>
          </div>

          <div id="precios" className="flex items-center h-20 bg-blue-200 mt-10">
            <h2 className={`${oi.className} flex text-gray-600 pl-4 items-center relative text-2xl md:text-4xl`}>Ajustar precios</h2>
          </div>
          <div className="flex justify-center py-6 lg:py-8">
            <div className="flex flex-col gap-6 w-full max-w-210 px-3 xl:px-0">
              <AjustarPrecios categorias={categoriasConProductos} />
            </div>
          </div>

          <div id="agenda" className="flex items-center h-20 bg-blue-200 mt-10">
            <h2 className={`${oi.className} flex text-gray-600 pl-4 items-center relative text-2xl md:text-4xl`}>Configuración de agenda</h2>
          </div>
          <div className="flex justify-center py-6 lg:py-8">
            <div className="flex flex-col gap-6 w-full max-w-210 px-3 xl:px-0">
              <EditarCupoMaximo configuracionInicial={configuracionAgenda} />
              <CalendarioAgendaAdmin cupoMaximoPorDia={configuracionAgenda.cupoMaximoPorDia} />
            </div>
          </div>

          <div id="perfiles" className="flex items-center h-20 bg-blue-200 mt-10">
            <h2 className={`${oi.className} flex text-gray-600 pl-4 items-center relative text-2xl md:text-4xl`}>Administración de perfiles</h2>
          </div>
          <div className="flex justify-center py-6 lg:py-8">
            <div className="flex flex-col gap-6 w-full max-w-210 px-3 xl:px-0">
              <AdministrarPerfiles />
            </div>
          </div>

          <div className="min-h-[60vh]">

          </div>

        </div>

        </div>

      </div>
    </RequiereAdmin>

  );
}
