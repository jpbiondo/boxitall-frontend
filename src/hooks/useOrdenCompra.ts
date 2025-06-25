import { useCallback } from "react";
import { useHttp } from "./useHttp";
import type { DTOOrdenCompraAlta } from "../types/domain/orden-compra/DTOOrdenCompraAlta";
import type { DTOOrdenCompraArticuloAlta } from "../types/domain/orden-compra/DTOOrdenCompraArticuloAlta";
import type { DTOOrdenCompraListadoActivas } from "../types/domain/orden-compra/DTOOrdenCompraListadoActivas";
import type { DTOOrdenCompraObtenerDetalle } from "../types/domain/orden-compra/DTOOrdenCompraObtenerDetalle";
import { API_URL } from "../utils/constants";

export function useOrdenCompra() {
  const endpoint = "/orden-compra";
  const { get, post, put, del, error, isLoading } = useHttp();

const crearOrdenCompra = useCallback(
  async (ordenCompraDTO: DTOOrdenCompraAlta): Promise<{
    success: boolean;
    parcial?: boolean;
    mensaje: string;
    orden?: DTOOrdenCompraObtenerDetalle;
    errores?: string[];
  }> => {
    try {
      const response = await post(`${API_URL}${endpoint}/alta-orden-compra`, ordenCompraDTO);

      // Asumimos que el backend responde con estos campos:
      const { mensaje, orden, errores } = response as any;

      // Si hay errores pero se devolvió orden, fue creada parcialmente
      if (errores?.length > 0 && orden) {
        return {
          success: true,
          parcial: true,
          mensaje,
          orden,
          errores,
        };
      }

      // Si fue creada sin errores
      if (orden) {
        return {
          success: true,
          mensaje,
          orden,
        };
      }

      // Fallback si no vino orden ni errores
      return {
        success: false,
        mensaje: mensaje ?? "No se pudo crear la orden",
        errores: errores ?? [],
      };
    } catch (e: any) {
      const mensaje = e?.response?.data?.mensaje ?? "Error inesperado";
      const errores = e?.response?.data?.errores ?? [e.message];
      return {
        success: false,
        mensaje,
        errores,
      };
    }
  },
  [post]
);


  const cancelarOrdenCompra = useCallback(
    async (id: number) => {
      const response = await put(`${endpoint}/${id}/detalle/cancelar-orden`);
      return response;
    },
    [put]
  );

  const eliminarDetalleOrden = useCallback(
    async (idOrden: number, idDetalle: number) => {
      const response = await del(`${API_URL}${endpoint}/${idOrden}/detalle/${idDetalle}/eliminar-detalle`);
      return response;
    },
    [del]
  );

  const actualizarCantidadDetalle = useCallback(
    async (idOrden: number, idDetalle: number, nuevaCantidad: number) => {
      const url = `${API_URL}${endpoint}/${idOrden}/detalle/${idDetalle}/actualizar-cantidad?nuevaCantidad=${nuevaCantidad}`;

      const response = await fetch(url, {
        method: "PUT",
      });

      return response;
    },
    []
  );

  const avanzarEstadoOrden = useCallback(
    async (idOrden: number) => {
      const response: string[] = await post(`${API_URL}${endpoint}/${idOrden}/detalle/avanzar-estado`);
      return response;
    },
    [post]
  );

  const obtenerDetalleOrden = useCallback(
    async (idOrden: number) => {
      const response: DTOOrdenCompraObtenerDetalle = await get(`${API_URL}${endpoint}/${idOrden}/detalle`);
      return response;
    },
    [get,endpoint]
  );

  const listarOrdenesActivas = useCallback(
    async () => {
      const response: DTOOrdenCompraListadoActivas[] = await get(`${API_URL}${endpoint}/activas`); // corregido: sin API_URL
      return response;
    },
    [get, endpoint]
  );

  const agregarArticuloAOrden = useCallback(
    async (idOrden: number, nuevoDetalleDTO: DTOOrdenCompraArticuloAlta) => {
      const response: DTOOrdenCompraObtenerDetalle = await post(
        `${endpoint}/${idOrden}/detalle/agregar-articulo`,
        nuevoDetalleDTO
      );
      return response;
    },
    [post]
  );

  return {
    crearOrdenCompra,
    cancelarOrdenCompra,
    eliminarDetalleOrden,
    actualizarCantidadDetalle,
    avanzarEstadoOrden,
    obtenerDetalleOrden,
    listarOrdenesActivas,
    agregarArticuloAOrden,
    error,
    isLoading,
  };
}
