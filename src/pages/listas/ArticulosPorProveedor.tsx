import { Typography } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { useListados } from "../../hooks/useListados";
import { ArticuloPorProveedor } from "../../types/domain/articulo/ArticuloPorProveedor";

interface forList extends ArticuloPorProveedor{
    id: number;
}

export function ArticulosPorProveedor(){
    const { isLoading, error, listarArtsPorProv } = useListados();
    const [articulos, setArticulos] = useState<forList[]>([]);
    const [proveedorId, setProveedorId ] = useState<number>(1);
    const [openProveedoresPopUp, setOpenProveedoresPopUp] = useState<boolean>(false);
  
    useEffect(() => {
        listarArtsPorProv(proveedorId).then((articulos) => {
            setArticulos(articulos.map((art)=>(
                {
                    ...art,
                    id: art.idArticulo
                }
            )));
      });
    }, [listarArtsPorProv]);
  
    // Dev time debugging
    useEffect(() => {
      if (error) {
        console.error(error);
      }
    }, [error]);
  
    const columns: GridColDef<any>[] = [
      { field: "idArticulo", headerName: "ID artículo" },
      { field: "nombreArticulo", headerName: "Nombre artículo", width: 200},
      { field: "precioProveedor", headerName: "Precio artículo", width: 200 },
      { field: "loteOptimo", headerName: "Lote óptimo" },
      { field: "esProveedorPredeterminado", headerName: "Es proveedor predeterminado?", width: 230 },
    ];
  

    return (
        <div>
            <Typography variant="h2">Artículos por proveedor</Typography>
            <DataGrid
                
                disableColumnMenu
                rows={articulos}
                columns={columns}
                loading={isLoading}
            />
        </div>
      );
}