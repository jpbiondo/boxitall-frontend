import { useCallback } from "react";
import { useHttp } from "./useHttp";
import type { Venta } from "../types/domain/venta/Venta";
import type { VentaShortDTO } from "../types/domain/venta/VentaShortDTO";

export function useVenta(endpoint: string) {
  const { get, post, put, del, error, isLoading } = useHttp();

  const getVentaShort = useCallback(async () => {
    const response: VentaShortDTO[] = await get(`${endpoint}/short`);
    return response;
  }, [get, endpoint]);

  const getVentaById = useCallback(
    async (id: string) => {
      const response: Venta = await get(`${endpoint}/${id}`);
      return response;
    },
    [get, endpoint]
  );

  const createVenta = useCallback(
    async (data: Venta) => {
      const response: Venta = await post(endpoint, data);
      return response;
    },
    [post, endpoint]
  );

  const updateVenta = useCallback(
    async (id: string, data: Venta) => {
      const response: Venta = await put(`${endpoint}/${id}`, data);
      return response;
    },
    [put, endpoint]
  );

  const deleteVenta = useCallback(
    async (id: string) => {
      const response: boolean = await del(`${endpoint}/${id}`);
      return response;
    },
    [del, endpoint]
  );

  return {
    getVentaShort,
    getVentaById,
    createVenta,
    updateVenta,
    deleteVenta,
    error,
    isLoading,
  };
}
