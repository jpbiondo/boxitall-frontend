import { useEffect, useState } from "react";
import { useArticulo } from "../../hooks/useArticulo";
import { DataGrid } from "@mui/x-data-grid";

export const ArticuloListado = () => {
  const { isLoading, error, getArticulosShort } = useArticulo("/articulo");
  const [articulos, setArticulos] = useState<any[]>([]);

  useEffect(() => {
    // getArticulosShort().then(setArticulos);
    // MOC DATA
    setArticulos([
      {
        id: 1,
        articuloCod: 1,
        articuloNombre: "Articulo 1",
        stock: 100,
        articuloCostoPrecio: 100,
        proveedorPred: "Pelotudo",
        modeloInventario: "Mierda",
      },
      {
        id: 2,
        articuloCod: 2,
        articuloNombre: "Articulo 2",
        stock: 200,
        articuloCostoPrecio: 200,
        proveedorPred: "Pelotudo",
        modeloInventario: "Mierda",
      },
      {
        id: 3,
        articuloCod: 3,
        articuloNombre: "Articulo 3",
        stock: 300,
        articuloCostoPrecio: 300,
        proveedorPred: "Pelotudo",
        modeloInventario: "Mierda",
      },
    ]);
  }, [getArticulosShort]);

  // Dev time debugging
  useEffect(() => {
    if (error) {
      console.error(error);
    }
  }, [error]);

  const columns = [
    { field: "id", headerName: "ID", width: 100 },
    { field: "articuloCod", headerName: "Código", width: 100 },
    { field: "articuloNombre", headerName: "Nombre", width: 200 },
    { field: "stock", headerName: "Stock", width: 100 },
    { field: "articuloCostoPrecio", headerName: "Costo", width: 100 },
    { field: "proveedorPred", headerName: "Proveedor", width: 100 },
    { field: "modeloInventario", headerName: "Modelo", width: 100 },
  ];

  return (
    <div>
      <h1>Articulos</h1>
      <DataGrid rows={articulos} columns={columns} loading={isLoading} />
    </div>
  );
};
