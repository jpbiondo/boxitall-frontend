import { useEffect, useState } from "react";
import { useListados } from "../../hooks/useListados";
import { Chip, Typography } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { ArticuloList } from "../../types/domain/articulo/ArticuloList";

interface ArticuloFaltante extends ArticuloList{
    stockSeguridad: number
}

export function ProductosFaltantes() {
    const { listarArticulosFaltantes, isLoading } =  useListados();
    const [ articulos, setArticulos ] = useState<ArticuloFaltante[]>([])

    useEffect( () => {
      listarArticulosFaltantes().then( async (prods) => {
        setArticulos(prods as ArticuloFaltante[]);
        articulos.map((articulo) => (
          articulo.fechaProximoPedido = new Date(articulo.fechaProximoPedido).toUTCString()
        ))
      });
    }, [listarArticulosFaltantes] );

    const columns: GridColDef<any>[] = [
        { field: "id", headerName: "ID" },
        { field: "nombre", headerName: "Nombre", width: 200},
        { field: "stock", headerName: "Stock" },
        { field: "stockSeguridad", headerName: "Stock seguridad", width:140},
    
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
            <Typography variant="h2">Artículos en falta </Typography>
            <Typography> Artículos cuyo stock está por debajo del stock de seguridad </Typography>
            <DataGrid
                disableColumnMenu
                rows={articulos}
                columns={columns}
                loading={isLoading}
            />
        </div>
    )
}