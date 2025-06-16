import { useCallback } from "react";
import { useHttp } from "./useHttp";
import type { ArticuloShortDTO } from "../types/domain/articulo/ArticuloShortDTO";
import type { Articulo } from "../types/domain/articulo/Articulo";

export function useArticulo() {
  const endpoint = "/articulo";
  const { get, post, put, del, error, isLoading } = useHttp();

  const getArticulosShort = useCallback(async () => {
    const response: ArticuloShortDTO[] = await get(`${endpoint}/short`);
    return response;
  }, [get, endpoint]);

  const getArticuloById = useCallback(
    async (id: string) => {
      const response: Articulo = await get(`${endpoint}/${id}`);
      return response;
    },
    [get, endpoint]
  );

  const createArticulo = useCallback(
    async (data: Articulo) => {
      const response: Articulo = await post(endpoint, data);
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
