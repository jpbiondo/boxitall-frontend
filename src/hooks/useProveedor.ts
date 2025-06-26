import { useCallback } from "react";
import { useHttp } from "./useHttp";
import type { Proveedor } from "../types/domain/proveedor/Proveedor";
import { API_URL } from "../utils/constants";
import { ProveedorAltaDTO } from "../types/domain/proveedor/ProveedorAltaDTO";
import { ProveedorBase } from "../types/domain/proveedor/ProveedorBase";

export function useProveedor() {
  const endpoint = `${API_URL}/proveedor`;
  const { get, post, put, del, error, isLoading } = useHttp();

  const getProveedorShort = useCallback(async () => {
    const response: Proveedor[] = await get(`${endpoint}/listAll`);
    return response;
  }, [get, endpoint]);

  const getProveedorById = useCallback(
    async (id: string) => {
      const response: ProveedorBase = await get(`${endpoint}/${id}`);
      return response;
    },
    [get, endpoint]
  );

  const createProveedor = useCallback(
    async (data: ProveedorAltaDTO) => {
      const response: Proveedor = await post(`${endpoint}/alta`, data);
      return response;
    },
    [post, endpoint]
  );

  const updateProveedor = useCallback(
    async (id: string, data: ProveedorBase) => {
      const response: ProveedorBase = await put(`${endpoint}/${id}`, data);
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
