import { useEffect, useState } from "react";
import { ArticuloList } from "../../types/domain/articulo/ArticuloList";
import { useListados } from "../../hooks/useListados";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Chip, Typography } from "@mui/material";

export function ProductosReponer(){
    const { listarArticulosReponer, isLoading } =  useListados();
    const [ articulos, setArticulos ] = useState<ArticuloList[]>([])

    useEffect( () => {
        listarArticulosReponer().then( async (prods) => {
          setArticulos(prods.map((articulo) => (
            {
                ...articulo,
                fechaProximoPedido: new Date(articulo.fechaProximoPedido).toUTCString()
            }
          )));
        });
    }, [listarArticulosReponer] );

    const columns: GridColDef<any>[] = [
        { field: "id", headerName: "ID" },
        { field: "nombre", headerName: "Nombre", width: 200},
        { field: "stock", headerName: "Stock" },
    
        {
          field: "proveedorPredeterminadoId",
          headerName: "ID Prov (Pred)",
          width: 150,
          renderCell: (params: any) => {
            return params.row.proveedorPredeterminadoId == "0"
            ? "-"
            : params.row.proveedorPredeterminadoId;
          },
        },
        {
          field: "proveedorPredeterminadoNombre",
          headerName: "Nombre Prov (Pred)",
          width: 170,
          renderCell: (params: any) => {
            return params.row.proveedorPredeterminadoNombre ==
              "Sin proveedor predeterminado"
              ? "-"
              : params.row.proveedorPredeterminadoNombre;
          },
        },
    
        {
          field: "modeloInventario",
          headerName: "Modelo",
          width: 100,
          filterable: false,
          renderCell: (params: any) => {
            // TODO: ADD A CIRCLE WITH COLOR BASED ON THE MODEL INVENTORY
    
            return params.row.modeloInventario == "Lote Fijo" ? (
              <Chip
                label="Lote Fijo"
                color="success"
                variant="outlined"
                size="medium"
              />
            ) : (
              <Chip
                label="Intervalo Fijo"
                color="error"
                variant="outlined"
                size="medium"
              />
            );
          },
        },
    
        {
          field: "fechaProximoPedido",
          headerName: "Próximo pedido",
          width: 240,
          renderCell: (params: any) => {
            return params.row.modeloInventario == "Intervalo Fijo"
              ? params.row.fechaProximoPedido
              : "-";
          },
        },
        {
          field: "restanteProximoPedido",
          headerName: "Unidades hasta próximo pedido",
          width: 240,
          renderCell: (params: any) => {
            return params.row.modeloInventario == "Lote Fijo"
              ? params.row.restanteProximoPedido
              : "-";
          },
        },

    ]

    return(
        <div>
            <Typography variant="h2">Artículos a reponer </Typography>
            <Typography> Artículos que por su fecha de reposición o punto de pedido deberían tener una orden de compra, pero que no la tienen </Typography>
            <DataGrid
                disableColumnMenu
                rows={articulos}
                columns={columns}
                loading={isLoading}
            />
        </div>
    )
}