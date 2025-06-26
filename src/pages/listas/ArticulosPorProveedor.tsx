import { Button, Dialog, DialogContent, DialogTitle, Stack, TableCell, TableContainer, TableRow, Typography } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { useListados } from "../../hooks/useListados";
import { ArticuloPorProveedor } from "../../types/domain/articulo/ArticuloPorProveedor";
import { Proveedor } from "../../types/domain/proveedor/Proveedor";
import { useProveedor } from "../../hooks/useProveedor";

interface forList extends ArticuloPorProveedor{
    id: number;
}

export function ArticulosPorProveedor(){
    const { isLoading, error, listarArtsPorProv } = useListados();
    const { getProveedorShort } = useProveedor();
    const [articulos, setArticulos] = useState<forList[]>([]);
    const [ proveedores, setProveedores ]= useState<any[]>([])
    const [ selectedProv, setSelectedProv ] = useState<any>();
    const [openProveedoresPopUp, setOpenProveedoresPopUp] = useState<boolean>(false);
  
    useEffect(() => {
      getProveedorShort().then((provs) => {
        setProveedores(provs)
      })
    }, [getProveedorShort]);

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

    const handleClose = () => {
      setOpenProveedoresPopUp(false);
    }

    const handleOpen = () => {
      setOpenProveedoresPopUp(true);
    }
  
    const handleSelectProveedor = (proveedor: Proveedor) => {
      setSelectedProv(proveedor);
      listarArtsPorProv(proveedor.id).then((articulos) => {
        setArticulos(articulos.map((art)=>(
          {
              ...art,
              id: art.idArticulo
          }
        )));
      setOpenProveedoresPopUp(false);
      });
    }

    return (
      <Stack>
        <Typography variant="h2">Artículos por proveedor</Typography>
        <Button onClick={handleOpen}> Seleccionar proveedor</Button>
        <Stack display={selectedProv?"flex":"none"} gap={2}>
          <Typography variant="h4">Proveedor</Typography>
          <TableContainer>
            <TableRow>
              <TableCell>Id</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Teléfono</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>{selectedProv?.id}</TableCell>
              <TableCell>{selectedProv?.proveedorNombre}</TableCell>
              <TableCell>{selectedProv?.proveedorTelefono}</TableCell>
            </TableRow>
          </TableContainer>
          <Typography variant="h4">Artículos</Typography>
          <Dialog open={openProveedoresPopUp}>
            <Button onClick={handleClose}> Cerrar </Button>
            <DialogTitle>Agregar proveedores para el artículo</DialogTitle>
            <DialogContent>
              <TableContainer>
                <TableRow>
                  <TableCell>Id</TableCell>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Teléfono</TableCell>
                  <TableCell></TableCell>
                </TableRow>
                {proveedores.map((proveedor) => (
                  <TableRow key={proveedor.id}>
                    <TableCell>{proveedor.id}</TableCell>
                    <TableCell>{proveedor.proveedorNombre}</TableCell>
                    <TableCell>{proveedor.proveedorTelefono}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleSelectProveedor(proveedor)}
                      >
                        Seleccionar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableContainer>
            </DialogContent>
          </Dialog>
        </Stack>
        <DataGrid
            disableColumnMenu
            rows={articulos}
            columns={columns}
            loading={isLoading}
        />

      </Stack>
    );
}