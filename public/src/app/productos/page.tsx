import MostrarProductos from "@/features/productos/MostrarProductos";
import { getCantTotalProduct, getProduct, getProductTipo } from "@/features/productos/api";
import { Producto } from "../interfaces/producto.interface";

interface Pack {
  productos: Producto[],
  cantidad: number,
  categoriaSeleccionada: String
}

export default async function MenuProducto({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: String, tipo?: String }>;
}) {
  const params = await searchParams;
  const categoria = params.categoria ?? "TORTAS";
  const tipo = params.categoria ? params.tipo : "TORTA";

  let productos: Producto[] = [];
  let cantTotalProductos = 0;
  let errorDeConexion = false;

  try {
    productos = await getProductTipo(String(tipo), String(categoria), 0)
    cantTotalProductos = await getCantTotalProduct(String(tipo), String(categoria))
  } catch (error) {
    errorDeConexion = true;
  }

  if (errorDeConexion) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
        <p className="text-lg text-gray-600">
          No pudimos cargar los productos de esta categoría por un problema de conexión.
        </p>
        <p className="text-sm text-gray-500 mt-1">Intentá de nuevo en unos minutos.</p>
      </div>
    );
  }

  const paquete: Pack = {
    productos: productos,
    cantidad: cantTotalProductos,
    categoriaSeleccionada: categoria ?? ""
  }

  return (
    <div>

      <MostrarProductos key={`${categoria}-${tipo}`} {...paquete} />

    </div>
  );
}
