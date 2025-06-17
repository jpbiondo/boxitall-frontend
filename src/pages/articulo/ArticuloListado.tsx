import { useEffect, useState } from "react";
import { useArticulo } from "../../hooks/useArticulo";
import { DataGrid } from "@mui/x-data-grid";
import type { ArticuloShortDTO } from "../../types/domain/articulo/ArticuloShortDTO";

export const ArticuloListado = () => {
  const { isLoading, error, getArticulosShort } = useArticulo("/articulo");
  const [articulos, setArticulos] = useState<any[]>([]);

  useEffect(() => {
    getArticulosShort().then( (articulos) => {
      articulos.map((articulo)=>{
      articulo.modeloInventario == "LoteFijo"?articulo.fechaProximoPedido = "-":articulo.restanteProximoPedido="-"
      articulo.cgi == "0"?articulo.cgi = "-":{}
      articulo.proveedorPredeterminadoId == "0"?articulo.proveedorPredeterminadoId = "-":{}
      articulo.proveedorPredeterminadoNombre == "Sin proveedor predeterminado"?articulo.proveedorPredeterminadoNombre = "-":{}
    });
    setArticulos(articulos)
  }
  );

    // MOC DATA
    /*setArticulos([
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
    ]);*/
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
    { field: "stock", headerName: "Stock", width: 100 },
    { field: "cgi", headerName: "CGI", width: 100 },

    { field: "proveedorPredeterminadoId", headerName: "ProvPredId", width: 100 },
    { field: "proveedorPredeterminadoNombre", headerName: "ProvPredNombre", width: 100 },

    { field: "modeloInventario", headerName: "Modelo", width: 100 },
    { field: "fechaProximoPedido", headerName: "Próximo pedido", width: 100 },
    { field: "restanteProximoPedido", headerName: "Unidades hasta próximo pedido", width: 100 },
  ];

  return (
    <div>
      <h1>Articulos</h1>
      <DataGrid rows={articulos} columns={columns} loading={isLoading} />
    </div>
  );
};
