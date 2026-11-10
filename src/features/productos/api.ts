import { Bizcochuelo, CategoriaSabor, Producto, Sabor, SaborEntity, TamañoCatalogo } from "@/app/interfaces/producto.interface";
import { cache } from 'react';
import { getToken } from "@/features/auth/auth";
import { notFound } from "next/navigation";
import { apiFetch } from "@/utils/apiFetch";
import { Alergeno } from "@/features/productos/alergenos";

export const getListaDeSabores = cache(async () => {
  const response = await apiFetch("/producto/lista", {
    method: 'GET'
  });
  const lista: Sabor[] = await response.json();

  return lista;
})

export const getListaDeBizcochuelos = cache(async () => {
  const response = await apiFetch("/producto/listaBizcochuelos", {
    method: 'GET'
  });
  const lista: Bizcochuelo[] = await response.json();

  return lista;
})

export const getListaDeTamaños = cache(async () => {
  const response = await apiFetch("/producto/listaTamanos", {
    method: 'GET'
  });
  const lista: TamañoCatalogo[] = await response.json();

  return lista;
})

export const getListaDeCategoriasSabor = cache(async () => {
  const response = await apiFetch("/producto/listaCategoriasSabor", {
    method: 'GET'
  });
  const lista: CategoriaSabor[] = await response.json();

  return lista;
})

export const guardarCategoriaSabor = cache(async (categoria: { idCategoriaSabor: number; nombre: String; precio: number }) => {
  const response = await apiFetch("/producto/listaCategoriasSabor", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`
    },
    body: JSON.stringify(categoria)
  });

  if (!response.ok) {
    throw new Error("No se pudo guardar la categoría de sabor");
  }

  const guardado: CategoriaSabor = await response.json();
  return guardado;
})

export const guardarSabor = cache(async (sabor: { idLista_sabor?: number; sabor: String; idCategoriaSabor: number; alergenos?: Alergeno[] }) => {
  const response = await apiFetch("/producto/lista", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`
    },
    body: JSON.stringify({
      idLista_sabor: sabor.idLista_sabor,
      sabor: sabor.sabor,
      categoria: { idCategoriaSabor: sabor.idCategoriaSabor },
      alergenos: sabor.alergenos
    })
  });

  if (!response.ok) {
    throw new Error("No se pudo guardar el sabor");
  }

  const guardado: Sabor = await response.json();
  return guardado;
})

export const guardarBizcochuelo = cache(async (bizcochuelo: { idLista_bizcochuelo?: number; bizcochuelo: String; precio: number; alergenos?: Alergeno[] }) => {
  const response = await apiFetch("/producto/listaBizcochuelos", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`
    },
    body: JSON.stringify(bizcochuelo)
  });

  if (!response.ok) {
    throw new Error("No se pudo guardar el bizcochuelo");
  }

  const guardado: Bizcochuelo = await response.json();
  return guardado;
})

export const getListaDeProductos = cache(async () => {
  const response = await apiFetch("/listaProductos", {
    method: 'GET'
  });

  if (!response.ok) {
    throw new Error("No se pudo obtener la lista de productos");
  }

  const lista = await response.json();

  return lista;

})

export const getPorNombreProducto = cache(async (nombre: String) => {
  const response = await apiFetch("/producto/nombre/" + nombre, {
    method: 'GET'
  });

  if (!response.ok) {
    throw new Error("No se pudo obtener el producto");
  }

  const producto :Producto= await response.json();

  return producto;

})

export const getProduct = cache(async () => {
  const response = await apiFetch("/productos", {
    method: 'GET'
  });
  const produc: Producto[] = await response.json();

  return produc;
})
export const getCantTotalProduct = cache(async (tipo: String, categoria: String) => {
  const response = await apiFetch("/producto/totalTG/tipo/" + tipo + "/categoria/" + categoria, {
    method: 'GET'
  });

  if (!response.ok) {
    throw new Error("No se pudo obtener el total de productos de la categoría");
  }

  const total: number = await response.json();

  return total;
})
export const getCantTotalProductPisoSubcategoria = cache(async (piso: number, subcategoria: String) => {
  const response = await apiFetch("/producto/totalPs/piso/" + piso + "/subcategoria/" + subcategoria, {
    method: 'GET'
  });

  if (!response.ok) {
    throw new Error("No se pudo obtener el total de productos de este piso");
  }

  const total: number = await response.json();

  return total;
})
export const getCantTotalProductPiso = cache(async (piso: number) => {
  const response = await apiFetch("/producto/totalPs/piso/" + piso, {
    method: 'GET'
  });

  if (!response.ok) {
    throw new Error("No se pudo obtener el total de productos de este piso");
  }

  const total: number = await response.json();

  return total;
})
export const getCantTotalProductSubcategoria = cache(async (categoria: String, subcategoria: String) => {
  const response = await apiFetch("/producto/totalSc/categoria/" + categoria + "/subcategoria/" + subcategoria, {
    method: 'GET'
  });

  if (!response.ok) {
    throw new Error("No se pudo obtener el total de productos de esta temática");
  }

  const total: number = await response.json();

  return total;
})
export const getCantTotalProductPorTipo = cache(async (tipo: String, categoria: String) => {
  const response = await apiFetch("/producto/totalPr/tipo/" + tipo + "/categoria/" + categoria, {
    method: 'GET'
  });
  const total: number = await response.json();

  return total;
})

export const getProductTipo = cache(async (tipo: String, categoria: String, offset: number) => {
  const response = await apiFetch("/productos/tipo/" + tipo + "/categoria/" + categoria + "/offset/" + offset, {
    method: 'GET'
  });

  if (!response.ok) {
    throw new Error("No se pudieron obtener los productos de la categoría");
  }

  const produc: Producto[] = await response.json();

  return produc;
})
export const getProductSegunCategoriaSub = cache(async (categoria: String, subcategoria: String, offset: number) => {
  const response = await apiFetch("/productos/categoria/" + categoria + "/subcategoria/" + subcategoria + "/offset/" + offset, {
    method: 'GET'
  });

  if (!response.ok) {
    throw new Error("No se pudieron obtener los productos de esta temática");
  }

  const produc: Producto[] = await response.json();

  return produc;
})
export const getProductSegunPisoSubcategoria = cache(async (piso: number, offset: number, subcategoria: String) => {
  const response = await apiFetch("/productos/piso/" + piso + "/offset/" + offset + "/subcategoria/" + subcategoria, {
    method: 'GET'
  });

  if (!response.ok) {
    throw new Error("No se pudieron obtener los productos de este piso");
  }

  const produc: Producto[] = await response.json();

  return produc;
})
export const getProductSegunPiso = cache(async (piso: number, offset: number) => {
  const response = await apiFetch("/productos/piso/" + piso + "/offset/" + offset, {
    method: 'GET'
  });

  if (!response.ok) {
    throw new Error("No se pudieron obtener los productos de este piso");
  }

  const produc: Producto[] = await response.json();

  return produc;
})

export const getCategoriasEspecial = cache(async (tipo: String) => {
  const response = await apiFetch("/categoriaEspecial/" + tipo, {
    method: 'GET'
  });
  const produc: Producto[] = await response.json();

  return produc;
})

export const getCategoriasDisponibles = cache(async () => {
  const response = await apiFetch("/categorias", {
    method: 'GET'
  });

  if (!response.ok) {
    throw new Error("No se pudo obtener la lista de categorías");
  }

  const lista: { categoria: string; tipo: string }[] = await response.json();

  return lista;
})

export const buscarCategoriaSinEspecial = cache(async (tipo: String, nombre: String) => {
  const response = await apiFetch("/categoriaSinEspecial/" + tipo + "/buscar?nombre=" + encodeURIComponent(nombre.toString()), {
    method: 'GET'
  });

  if (!response.ok) {
    throw new Error("No se pudieron buscar productos");
  }

  const produc: Producto[] = await response.json();

  return produc;
})

export const buscarProductosPorNombre = cache(async (nombre: String) => {
  const response = await apiFetch("/producto/buscar?nombre=" + encodeURIComponent(nombre.toString()), {
    method: 'GET'
  });

  if (!response.ok) {
    throw new Error("No se pudieron buscar productos");
  }

  const produc: Producto[] = await response.json();

  return produc;
})

export const getProducto = cache(async (id: number) => {
  const response = await apiFetch("/producto/" + id, {
    method: 'GET'
  });

  if (response.status === 404) {
    notFound();
  }

  if (!response.ok) {
    throw new Error("No se pudo obtener el producto");
  }

  const produc: Producto = await response.json();

  return produc;
})

export const cambiarCategoriaEspecial = cache(async (tipo: String, id: number) => {
  const response = await apiFetch("/cambiar/" + tipo + "/id/" + id, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });
  const result: String = await response.text()
  return result
}
)
export const actualizarProducto = cache(async (id: number, cambios: {
  nombre: String
  precio: number
  descripcion: String
  categoria: String
  subcategoria: String
  url_image: String
  url_image2: String
  url_image3: String
  url_image4: String
  ingredientes?: String | null
  alergenos?: Alergeno[]
  trazas?: Alergeno[]
}) => {
  const response = await apiFetch("/producto/" + id, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`
    },
    body: JSON.stringify(cambios)
  });

  if (response.status === 409) {
    throw new Error("NOMBRE_DUPLICADO");
  }

  if (!response.ok) {
    throw new Error("No se pudo actualizar el producto");
  }

  const producto: Producto = await response.json();
  return producto;
})

export const eliminarSabor = async (id: number) => {
  const response = await apiFetch("/producto/lista/" + id, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });

  if (response.status === 409) {
    let mensaje = "El sabor está en uso y no se puede eliminar.";
    try {
      const cuerpo = await response.json();
      if (cuerpo?.mensaje) mensaje = cuerpo.mensaje;
    } catch { /* sin cuerpo */ }
    throw new Error(mensaje);
  }

  if (!response.ok) {
    throw new Error("No se pudo eliminar el sabor");
  }
};

export const eliminarProducto = cache(async (id: number) => {
  const response = await apiFetch("/producto/" + id, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });

  if (response.status === 409) {
    throw new Error("CONFLICTO");
  }

  if (!response.ok) {
    throw new Error("No se pudo eliminar el producto");
  }
})

export const cambiarEstadoProducto = cache(async (id: number, suspendido: boolean) => {
  const response = await apiFetch("/producto/" + id + "/estado", {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`
    },
    body: JSON.stringify({ suspendido })
  });

  if (!response.ok) {
    throw new Error("No se pudo cambiar el estado del producto");
  }

  const producto: Producto = await response.json();
  return producto;
})

export const subirImagenProducto = cache(async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await apiFetch('/upload', {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error("No se pudo subir la imagen");
  }

  const data = await response.text();
  return data;
})

export const cambiaDosCategoriaEspecial = cache(async (tipoV: String, idV: number, tipoN: String, idN: number) => {

  const response = await apiFetch("/tipoUno/" + tipoV + "/idUno/" + idV + "/tipoDos/" + tipoN + "/segundo/" + idN, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });
  const result: String = await response.text()
  return result
}
)

export interface ResultadoAjustePrecios {
  productos: number
  tamaños: number
  bizcochuelos: number
  categoriasSabor: number
}

export async function ajustarPrecios(pedido: {
  porcentaje: number
  categoria: string | null
  incluirAdicionales: boolean
  redondeo: number
}): Promise<ResultadoAjustePrecios> {
  const response = await apiFetch("/producto/ajustarPrecios", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`
    },
    body: JSON.stringify(pedido)
  });

  if (!response.ok) {
    let mensaje = "No se pudieron ajustar los precios"
    try {
      const cuerpo = await response.json()
      if (cuerpo?.mensaje) {
        mensaje = cuerpo.mensaje
      }
    } catch {
    }
    throw new Error(mensaje);
  }

  return await response.json();
}
