import { useCallback } from "react";
import { API_URL } from "../utils/constants";
import { useHttp } from "./useHttp";
import { ArticuloList } from "../types/domain/articulo/ArticuloList";
import { ArticuloPorProveedor } from "../types/domain/articulo/ArticuloPorProveedor";

export function useListados(){

    const endpoint = `${API_URL}/articulo`;
    const { get, post, put, del, error, isLoading } = useHttp();

    const listarArticulosFaltantes = useCallback(async () => {
        const response: ArticuloList[] = 
          await get(`${endpoint}/listarProductosFaltantes`);
        return response;
      }, [get, endpoint]
    );

    const listarArticulosReponer = useCallback(async () => {
        const response: ArticuloList[] = 
          await get(`${endpoint}/listarProductosAReponer`);
        return response;
      }, [get, endpoint]
    );

    const listarArtsPorProv = useCallback(async (idProveedor:number) => {
        const response: ArticuloPorProveedor[] = 
          await get(`${endpoint}/listarPorProveedorId?idProveedor=${idProveedor}`);
        return response;
      }, [get, endpoint]
    );
    
    return{
        error,
        isLoading,
        listarArticulosFaltantes,
        listarArticulosReponer,
        listarArtsPorProv,
    };
}