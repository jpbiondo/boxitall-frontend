import { useEffect, useState } from "react";
import { useArticulo } from "../../hooks/useArticulo";
import type { ArticuloShortDTO } from "../../types/domain/articulo/ArticuloShortDTO";
import { DataGrid } from "@mui/x-data-grid";

export const ReadArticles = () => {
  const { isLoading, error, getArticulosShort } = useArticulo("/articulo");
  const [articulos, setArticulos] = useState<ArticuloShortDTO[]>([]);

  useEffect(() => {
    getArticulosShort().then(setArticulos);
  }, [getArticulosShort]);

  // Dev time debugging
  useEffect(() => {
    if (error) {
      console.error(error);
    }
  }, [error]);

  const columns = [
    { field: "id", headerName: "ID", width: 100 },
    { field: "nombre", headerName: "Nombre", width: 200 },
    { field: "precio", headerName: "Precio", width: 100 },
  ];

  return (
    <div>
      <h1>Articulos</h1>
      <DataGrid rows={articulos} columns={columns} loading={isLoading} />
    </div>
  );
};
