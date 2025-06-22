import { useCallback } from "react";
import { useHttp } from "./useHttp";
import type { Venta } from "../types/domain/venta/Venta";
import type { VentaShortDTO } from "../types/domain/venta/VentaShortDTO";
import { API_URL } from "../utils/constants";
import { VentaAltaDTO } from "../types/domain/venta/VentaAltaDTO";

export function useVenta() {
  const { get, post, error, isLoading } = useHttp();

  const getVentaShort = useCallback(async () => {
    const response: VentaShortDTO[] = await get(`${API_URL}/venta`);
    return response;
  }, [get]);

  const getVentaById = useCallback(
    async (id: string) => {
      const response: Venta = await get(`${API_URL}/venta/getOne?id=${id}`);
      return response;
    },
    [get]
  );

  const createVenta = useCallback(
    async (data: VentaAltaDTO) => {
      const response = await post(`${API_URL}/venta/altaVenta`, data);
      return response;
    },
    [post]
  );

  // const updateVenta = useCallback(
  //   async (id: string, data: Venta) => {
  //     const response: Venta = await put(`${API_URL}/venta/update?id=${id}`, data);
  //     return response;
  //   },
  //   [put]
  // );

  // const deleteVenta = useCallback(
  //   async (id: string) => {
  //     const response: boolean = await del(`${API_URL}/venta/delete?id=${id}`);
  //     return response;
  //   },
  //   [del]
  // );

  return {
    getVentaShort,
    getVentaById,
    createVenta,
    error,
    isLoading,
  };
}
