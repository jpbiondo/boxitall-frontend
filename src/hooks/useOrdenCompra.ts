import { useCallback } from "react";
import { useHttp } from "./useHttp";
import type { OrdenCompraShortDTO } from "../types/domain/orden-compra/OrdenCompraShortDTO";
import type { OrdenCompra } from "../types/domain/orden-compra/OrdenCompra";

export function useOrdenCompra(endpoint: string) {
  const { get, post, put, del, error, isLoading } = useHttp();

  const getOrdenCompraShort = useCallback(async () => {
    const response: OrdenCompraShortDTO[] = await get(`${endpoint}/short`);
    return response;
  }, [get, endpoint]);

  const getOrdenCompraById = useCallback(
    async (id: string) => {
      const response: OrdenCompra = await get(`${endpoint}/${id}`);
      return response;
    },
    [get, endpoint]
  );

  const createOrdenCompra = useCallback(
    async (data: OrdenCompra) => {
      const response: OrdenCompra = await post(endpoint, data);
      return response;
    },
    [post, endpoint]
  );

  const updateOrdenCompra = useCallback(
    async (id: string, data: OrdenCompra) => {
      const response: OrdenCompra = await put(`${endpoint}/${id}`, data);
      return response;
    },
    [put, endpoint]
  );

  const deleteOrdenCompra = useCallback(
    async (id: string) => {
      const response: boolean = await del(`${endpoint}/${id}`);
      return response;
    },
    [del, endpoint]
  );

  return {
    getOrdenCompraShort,
    getOrdenCompraById,
    createOrdenCompra,
    updateOrdenCompra,
    deleteOrdenCompra,
    error,
    isLoading,
  };
}
