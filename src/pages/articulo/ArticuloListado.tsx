import { useEffect, useState } from "react";
import { useArticulo } from "../../hooks/useArticulo";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

import { Button, Chip, IconButton, Stack, Typography } from "@mui/material";
import { Add, Delete, DisplaySettings, Edit, Redo } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import type { ArticuloList } from "../../types/domain/articulo/ArticuloList";

export const ArticuloListado = () => {
  const { isLoading, error, getArticulosShort, deleteArticulo } = useArticulo();
  const [articulos, setArticulos] = useState<ArticuloList[]>([]);
  const [deleting, setDeleting] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleGetArticulo = (articuloCod: number) => {
    navigate(`/articulo/${articuloCod}`);
  };

  const handleUpdateArticulo = (articuloCod: number) => {
    navigate(`/articulo/update/${articuloCod}`);
  };

  const handleDeleteArticulo = async (articuloCod: number) => { // TODO - Está con alert, hacer mejor
    if (confirm("Realmente quieres eliminar el artículo?\nEsta acción no puede deshacerse")){
      setDeleting(true);
      await deleteArticulo(articuloCod.toString()).then(
        () => {
          alert("Artículo dado de baja exitosamente")
        },
        (error) => {
          error.response.json().then((msg:any) =>{
            console.log(msg)
            alert(`El artículo no pudo ser dado de baja:\n\n${msg.error}`);
          });
        }
      );
      setDeleting(false);
    }
  };

  useEffect(() => {
    getArticulosShort().then((articulos) => {
      articulos.forEach((articulo) => {
        const date: Date = new Date(articulo.fechaProximoPedido);
        articulo.fechaProximoPedido = date.toUTCString();
      });
      setArticulos(articulos);
    });
  }, [getArticulosShort, deleting]);

  // Dev time debugging
  useEffect(() => {
    if (error) {
      console.error(error);
    }
  }, [error]);

  const columns: GridColDef<any>[] = [
    { field: "id", headerName: "ID" },
    { field: "nombre", headerName: "Nombre", width: 200},
    { field: "stock", headerName: "Stock" },
    { field: "cgi", headerName: "CGI" },

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
      width: 130,
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
      width: 200,
      renderCell: (params: any) => {
        return params.row.modeloInventario == "Lote Fijo"
          ? params.row.restanteProximoPedido
          : "-";
      },
    },

    {
      field: "actions",
      headerName: "Acciones",
      filterable: false,
      sortable: false,
      width: 140,
      renderCell: (params: any) => (
        <Stack direction="row" spacing={1}>
          <IconButton
            color="error"
            onClick={() => handleUpdateArticulo(params.row.id)}
            size="small"
          >
            <Edit />
          </IconButton>
          <IconButton
            color="primary"
            onClick={() => handleDeleteArticulo(params.row.id)}
            size="small"
          >
            <Delete />
          </IconButton>
          <IconButton
            color="primary"
            onClick={() => handleGetArticulo(params.row.id)}
            size="small"
          >
            <DisplaySettings />
          </IconButton>
        </Stack>
      ),
    },
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
        <Stack spacing={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/articulo/create")}
            startIcon={<Add />}
          >
            Crear articulo
          </Button>
          <Button
            variant="contained"
            color="warning"
            onClick={() => navigate("/articulo/bajados")}
            startIcon={<Redo />}
          >
            Ir a artículos de baja
          </Button>
        </Stack>
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
