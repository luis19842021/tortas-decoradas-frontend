import { getToken } from "@/features/auth/auth";
import { apiFetch } from "@/utils/apiFetch";

export interface ConfiguracionAgenda {
  id: number;
  cupoMaximoPorDia: number;
}

export async function obtenerConfiguracionAgenda(): Promise<ConfiguracionAgenda> {
  const response = await apiFetch("/configuracion/cupoMaximoPorDia", {
    method: 'GET'
  });

  if (!response.ok) {
    throw new Error("No se pudo obtener la configuración de agenda");
  }

  return await response.json();
}

export async function actualizarCupoMaximoPorDia(nuevoCupo: number): Promise<ConfiguracionAgenda> {
  const response = await apiFetch("/configuracion/cupoMaximoPorDia", {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`
    },
    body: JSON.stringify({ cupoMaximoPorDia: nuevoCupo })
  });

  if (!response.ok) {
    throw new Error("No se pudo actualizar el cupo máximo por día");
  }

  return await response.json();
}

export interface CupoPorFecha {
  total: number;
  fecha_de_pedido: string;
}

export async function obtenerPedidosPorFecha(): Promise<CupoPorFecha[]> {
  const response = await apiFetch("/pedidosPor", { method: 'GET' });

  if (!response.ok) {
    throw new Error("No se pudieron obtener los pedidos por fecha");
  }

  return await response.json();
}

export interface DiaBloqueado {
  id: number;
  fecha: string;
  motivo: string;
}

export async function obtenerDiasBloqueados(): Promise<DiaBloqueado[]> {
  const response = await apiFetch("/configuracion/diasBloqueados", {
    method: 'GET'
  });

  if (!response.ok) {
    throw new Error("No se pudieron obtener los días bloqueados");
  }

  return await response.json();
}

export async function bloquearDia(fecha: string, motivo?: string): Promise<DiaBloqueado> {
  const response = await apiFetch("/configuracion/diasBloqueados", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`
    },
    body: JSON.stringify({ fecha, motivo })
  });

  if (!response.ok) {
    throw new Error("No se pudo bloquear el día");
  }

  return await response.json();
}

export async function desbloquearDia(fecha: string): Promise<void> {
  const response = await apiFetch("/configuracion/diasBloqueados/" + fecha, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${getToken()}` }
  });

  if (!response.ok) {
    throw new Error("No se pudo desbloquear el día");
  }
}

export interface PedidoManual {
  id: number;
  fecha: string;
  cantidad: number;
  motivo: string | null;
}

export async function obtenerPedidosManuales(): Promise<PedidoManual[]> {
  const response = await apiFetch("/configuracion/pedidosManuales", {
    method: 'GET',
    headers: { Authorization: `Bearer ${getToken()}` }
  });

  if (!response.ok) {
    throw new Error("No se pudieron obtener los pedidos manuales");
  }

  return await response.json();
}

export async function crearPedidoManual(fecha: string, cantidad: number, motivo?: string): Promise<PedidoManual> {
  const response = await apiFetch("/configuracion/pedidosManuales", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`
    },
    body: JSON.stringify({ fecha, cantidad, motivo })
  });

  if (!response.ok) {
    throw new Error("No se pudo cargar el pedido manual");
  }

  return await response.json();
}

export async function eliminarPedidoManual(id: number): Promise<void> {
  const response = await apiFetch("/configuracion/pedidosManuales/" + id, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${getToken()}` }
  });

  if (!response.ok) {
    throw new Error("No se pudo eliminar el pedido manual");
  }
}

export interface ItemPedido {
  idItemPedido: number;
  idProducto: number;
  descripcion: string;
  precioUnitario: number;
  cantidad: number;
  imagenUrl: string | null;
}

export interface PedidoDeFecha {
  idpedido: number;
  fecha_de_pedido: string;
  estado: "INICIADO" | "CUMPLIDO" | "CANCELADO";
  estadoPreparacion: "DISENANDO" | "COCINANDO" | "ENTREGADO" | null;
  items: ItemPedido[];
  reprogramado: boolean;
  montoADevolver: number | null;
  porcentajeDevuelto: number | null;
  direccionEnvio: string | null;
  codigoPostalEnvio: number | null;
  clienteNombre: string | null;
  clienteEmail: string | null;
  clienteTelefono: string | null;
}

export async function obtenerPedidosDeFecha(fecha: string): Promise<PedidoDeFecha[]> {
  const response = await apiFetch("/pedidos/porFecha/" + fecha, {
    method: 'GET',
    headers: { Authorization: `Bearer ${getToken()}` }
  });

  if (!response.ok) {
    throw new Error("No se pudieron obtener los pedidos de esa fecha");
  }

  return await response.json();
}

export async function marcarPedidoEntregado(id: number): Promise<PedidoDeFecha["estadoPreparacion"]> {
  const response = await apiFetch("/pedidos/" + id + "/entregar", {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${getToken()}` }
  });

  if (!response.ok) {
    throw new Error("No se pudo marcar el pedido como entregado");
  }

  return "ENTREGADO";
}

export interface RolUsuario {
  idRol: number;
  nombre: string;
}

export interface UsuarioAdmin {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string | null;
  roles: RolUsuario[];
  suspendida: boolean;
}

export function esAdmin(usuario: UsuarioAdmin): boolean {
  return usuario.roles.some((rol) => rol.nombre.toUpperCase() === "ADMIN");
}

export interface PaginaUsuarios {
  contenido: UsuarioAdmin[];
  totalElementos: number;
  totalPaginas: number;
  pagina: number;
  tamanio: number;
}

export async function obtenerUsuarios(busqueda: string, pagina: number, tamanio = 20): Promise<PaginaUsuarios> {
  const parametros = new URLSearchParams({ pagina: String(pagina), tamanio: String(tamanio) });
  if (busqueda) parametros.set("busqueda", busqueda);

  const response = await apiFetch("/usuarios?" + parametros.toString(), {
    method: 'GET',
    headers: { Authorization: `Bearer ${getToken()}` }
  });

  if (!response.ok) {
    throw new Error("No se pudieron obtener los usuarios");
  }

  return await response.json();
}

export async function cambiarRolUsuario(id: number, rol: "ADMIN" | "USER"): Promise<UsuarioAdmin> {
  const response = await apiFetch("/usuarios/" + id + "/rol", {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`
    },
    body: JSON.stringify({ rol })
  });

  if (!response.ok) {
    throw new Error("No se pudo cambiar el rol del usuario");
  }

  return await response.json();
}

export async function cambiarEstadoUsuario(id: number, suspendida: boolean): Promise<UsuarioAdmin> {
  const response = await apiFetch("/usuarios/" + id + "/estado", {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`
    },
    body: JSON.stringify({ suspendida })
  });

  if (!response.ok) {
    throw new Error("No se pudo cambiar el estado del usuario");
  }

  return await response.json();
}
