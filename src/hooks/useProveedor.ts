import { useCallback } from "react";
import { useHttp } from "./useHttp";
import type { ProveedorShortDTO } from "../types/domain/proveedor/ProveedorShortDTO";
import type { Proveedor } from "../types/domain/proveedor/Proveedor";

export function useProveedor(endpoint: string) {
  const { get, post, put, del, error, isLoading } = useHttp();

  const getProveedorShort = useCallback(async () => {
    const response: ProveedorShortDTO[] = await get(`${endpoint}/short`);
    return response;
  }, [get, endpoint]);

  const getProveedorById = useCallback(
    async (id: string) => {
      const response: Proveedor = await get(`${endpoint}/${id}`);
      return response;
    },
    [get, endpoint]
  );

  const createProveedor = useCallback(
    async (data: Proveedor) => {
      const response: Proveedor = await post(endpoint, data);
      return response;
    },
    [post, endpoint]
  );

  const updateProveedor = useCallback(
    async (id: string, data: Proveedor) => {
      const response: Proveedor = await put(`${endpoint}/${id}`, data);
      return response;
    },
    [put, endpoint]
  );

  const deleteProveedor = useCallback(
    async (id: string) => {
      const response: boolean = await del(`${endpoint}/${id}`);
      return response;
    },
    [del, endpoint]
  );

  return {
    getProveedorShort,
    getProveedorById,
    createProveedor,
    updateProveedor,
    deleteProveedor,
    error,
    isLoading,
  };
}
