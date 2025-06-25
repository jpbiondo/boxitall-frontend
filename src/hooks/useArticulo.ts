import { useCallback } from "react";
import { useHttp } from "./useHttp";
import type { Articulo } from "../types/domain/articulo/Articulo";
import type { ArticuloList } from "../types/domain/articulo/ArticuloList";
import { API_URL } from "../utils/constants";
import type { ArticuloAlta } from "../types/domain/articulo/ArticuloAlta";
import type { DTOArticuloGrupoProveedor } from "../types/domain/articulo/DTOArticuloGrupoProveedor";
import type { DTOArticuloProveedorListado } from "../types/domain/articulo/DTOArticuloProveedorListado";

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
    async (data: ArticuloAlta) => {
      const response: Articulo = await post(`${endpoint}/add`, data);
      return response;
    },
    [post, endpoint]
  );

  const updateArticulo = useCallback(
    async (id: string, data: ArticuloAlta) => {
      const response: Articulo = await put(`${endpoint}/updateArticulo?id=${id}`, data);
      return response;
    },
    [put, endpoint]
  );

  const deleteArticulo = useCallback(
    async (id: string) => {
      const response: boolean = await del(`${endpoint}/bajaArticulo?id=${id}`);
      return response;
    },
    [del, endpoint]
  );
  const listarArticulosPorProveedor = useCallback(async () => {
  const response: DTOArticuloGrupoProveedor[] = 
    await get(`${API_URL}${endpoint}/listarPorProveedor`);
  return response;
}, [get, endpoint]);

  const listarArticulosPorProveedorId = useCallback(
    async (proveedorId: number): Promise<DTOArticuloProveedorListado[]> => {
      const response = await get(`${API_URL}${endpoint}/listarPorProveedorId/${proveedorId}`);
      return response;
    }, [get]);


  return {
    getArticulosShort,
    getArticuloById,
    createArticulo,
    updateArticulo,
    deleteArticulo,
    error,
    isLoading,
    listarArticulosPorProveedor,
    listarArticulosPorProveedorId
  };
}
