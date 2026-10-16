import { getToken } from "@/features/auth/auth";
import { apiFetch } from "@/utils/apiFetch";

export async function facturaExiste(idPedido: number): Promise<boolean> {
  const response = await apiFetch(`/pedidos/${idPedido}/factura/existe`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  if (!response.ok) return false;
  const data = await response.json();
  return data.existe === true;
}

export async function subirFactura(idPedido: number, archivo: File): Promise<void> {
  const formulario = new FormData();
  formulario.append("archivo", archivo);
  const response = await apiFetch(`/pedidos/${idPedido}/factura`, {
    method: "POST",
    headers: { Authorization: `Bearer ${getToken()}` },
    body: formulario,
  });
  if (!response.ok) {
    let mensaje = "No se pudo cargar la factura.";
    try {
      const data = await response.json();
      if (data?.mensaje) mensaje = data.mensaje;
    } catch {}
    throw new Error(mensaje);
  }
}

export async function descargarFactura(idPedido: number): Promise<void> {
  const response = await apiFetch(`/pedidos/${idPedido}/factura`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  if (!response.ok) {
    throw new Error("No se pudo descargar la factura.");
  }
  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const enlace = document.createElement("a");
  enlace.href = url;
  enlace.download = `Factura-pedido-${idPedido}.pdf`;
  document.body.appendChild(enlace);
  enlace.click();
  enlace.remove();
  URL.revokeObjectURL(url);
}

export async function notaCreditoExiste(idPedido: number): Promise<boolean> {
  const response = await apiFetch(`/pedidos/${idPedido}/nota-credito/existe`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  if (!response.ok) return false;
  const data = await response.json();
  return data.existe === true;
}

export async function subirNotaCredito(idPedido: number, archivo: File): Promise<void> {
  const formulario = new FormData();
  formulario.append("archivo", archivo);
  const response = await apiFetch(`/pedidos/${idPedido}/nota-credito`, {
    method: "POST",
    headers: { Authorization: `Bearer ${getToken()}` },
    body: formulario,
  });
  if (!response.ok) {
    let mensaje = "No se pudo cargar la nota de crédito.";
    try {
      const data = await response.json();
      if (data?.mensaje) mensaje = data.mensaje;
    } catch {}
    throw new Error(mensaje);
  }
}

export async function descargarNotaCredito(idPedido: number): Promise<void> {
  const response = await apiFetch(`/pedidos/${idPedido}/nota-credito`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  if (!response.ok) {
    throw new Error("No se pudo descargar la nota de crédito.");
  }
  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const enlace = document.createElement("a");
  enlace.href = url;
  enlace.download = `NotaCredito-pedido-${idPedido}.pdf`;
  document.body.appendChild(enlace);
  enlace.click();
  enlace.remove();
  URL.revokeObjectURL(url);
}

export async function facturasExistentes(ids: number[]): Promise<number[]> {
  if (ids.length === 0) return [];
  const response = await apiFetch(`/facturas/existentes?ids=${ids.join(",")}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  if (!response.ok) return [];
  return await response.json();
}

export async function notasCreditoExistentes(ids: number[]): Promise<number[]> {
  if (ids.length === 0) return [];
  const response = await apiFetch(`/notas-credito/existentes?ids=${ids.join(",")}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  if (!response.ok) return [];
  return await response.json();
}
