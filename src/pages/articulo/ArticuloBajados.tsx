import { useEffect, useState } from "react";
import { useArticulo } from "../../hooks/useArticulo";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

import { Button, Stack, Typography } from "@mui/material";
import { Undo } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { ArticuloBaja } from "../../types/domain/articulo/ArticuloBaja";

export const ArticuloBajados = () => {
  const { isLoading, error, getArticulosBajados } = useArticulo();
  const [articulos, setArticulos] = useState<ArticuloBaja[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    getArticulosBajados().then((articulos) => {
      articulos.forEach((articulo) => {
        const date: Date = new Date(articulo.fechaBaja);
        articulo.fechaBaja = date.toUTCString();
      });
      console.log(articulos);
      setArticulos(articulos);
    });
  }, [getArticulosBajados]);

  // Dev time debugging
  useEffect(() => {
    if (error) {
      console.error(error);
    }
  }, [error]);

  const columns: GridColDef<any>[] = [
    { field: "id", headerName: "ID" },
    { field: "nombre", headerName: "Nombre", width: 200},
    { field: "descripcion", headerName: "Descripción", width:500 },
    { field: "costoAlmacenamiento", headerName: "Costo de almacenamiento", width:200 },
    { field: "nivelServicio", headerName: "Nivel de serivico", width:200 },
    { field: "fechaBaja", headerName: "Fecha de baja", width: 240 },
  ];

  return (
    <div>
      <Stack
        direction="row"
        spacing={2}
        justifyContent="space-between"
        marginBottom={2}
      >
        <Typography variant="h2">Artículos</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/articulo")}
          startIcon={<Undo />}
        >
          Volver a artículos de alta
        </Button>
      </Stack>
      {/* TODO: DATA GRID EACH COLUMNS SHOULD BE FULLY SHOWN IN WIDTH */}
      <DataGrid
        disableColumnMenu
        rows={articulos}
        columns={columns}
        loading={isLoading}
      />
    </div>
  );
};
