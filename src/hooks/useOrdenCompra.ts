import { useCallback } from "react";
import { useHttp } from "./useHttp";
import type { DTOOrdenCompraAlta } from "../types/domain/orden-compra/DTOOrdenCompraAlta";
import type { DTOOrdenCompraArticuloAlta } from "../types/domain/orden-compra/DTOOrdenCompraArticuloAlta";
import type { DTOOrdenCompraListadoActivas } from "../types/domain/orden-compra/DTOOrdenCompraListadoActivas";
import type { DTOOrdenCompraObtenerDetalle } from "../types/domain/orden-compra/DTOOrdenCompraObtenerDetalle"
import { API_URL } from "../utils/constants";



export function useOrdenCompra() {
  const endpoint = "/orden-compra";
  const { get, post, put, del, error, isLoading } = useHttp();

  const crearOrdenCompra = useCallback(
    async (ordenCompraDTO: DTOOrdenCompraAlta) => {
      const response = await post(`${API_URL}${endpoint}/alta-orden-compra`, ordenCompraDTO); // corregido "$" sobrante
      return response;
    },
    [post]
  );



  const cancelarOrdenCompra = useCallback(
    async (id: number) => {
      console.log(id);
     const response = await put(`${endpoint}/${id}/detalle/cancelar-orden`, null);
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
        `${API_URL}${endpoint}/${idOrden}/detalle/agregar-articulo`,
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
