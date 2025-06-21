import { useCallback } from "react";
import { useHttp } from "./useHttp";
import type { Articulo } from "../types/domain/articulo/Articulo";
import type { ArticuloList } from "../types/domain/articulo/ArticuloList";
import { API_URL } from "../utils/constants";

export function useArticulo() {
  const endpoint = `${API_URL}/articulo`;
  const { get, post, put, del, error, isLoading } = useHttp();

  const getArticulosShort = useCallback(async () => {
    const response: ArticuloList[] = await get(`${endpoint}/listAll`);
    return response;
  }, [get, endpoint]);

  const getArticuloById = useCallback(
    async (id: string) => {
      const response: Articulo = await get(`${endpoint}/getDetalles?id=${id}`);
      return response;
    },
    [get, endpoint]
  );

  const createArticulo = useCallback(
    async (data: Articulo) => {
      const response: Articulo = await post(`${endpoint}/add`, data);
      return response;
    },
    [post, endpoint]
  );

  const updateArticulo = useCallback(
    async (id: string, data: Articulo) => {
      const response: Articulo = await put(`${endpoint}/${id}`, data);
      return response;
    },
    [put, endpoint]
  );

  const deleteArticulo = useCallback(
    async (id: string) => {
      const response: boolean = await del(`${endpoint}/${id}`);
      return response;
    },
    [del, endpoint]
  );

  return {
    getArticulosShort,
    getArticuloById,
    createArticulo,
    updateArticulo,
    deleteArticulo,
    error,
    isLoading,
  };
}
