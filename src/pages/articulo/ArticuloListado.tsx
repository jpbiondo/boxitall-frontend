import { useEffect, useState } from "react";
import { useArticulo } from "../../hooks/useArticulo";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

import type { ArticuloShortDTO } from "../../types/domain/articulo/ArticuloShortDTO";
import { Button, Chip, IconButton, Stack, Typography } from "@mui/material";
import { Add, Delete, Edit, Visibility, WidthFull } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

export const ArticuloListado = () => {
  const { isLoading, error, getArticulosShort } = useArticulo();
  const [articulos, setArticulos] = useState<any[]>([]);
  const navigate = useNavigate();

  const handleGetArticulo = (articuloCod: number) => {
    navigate(`/articulo/${articuloCod}`);
  };

  const handleUpdateArticulo = (articuloCod: number) => {
    navigate(`/articulo/update/${articuloCod}`);
  };

  const handleDeleteArticulo = (articuloCod: number) => {
    console.log(`MOC deleting article ${articuloCod}`);
  };

  useEffect(() => {
    getArticulosShort().then((articulos) => {
      // articulos.map((articulo) => {
      //   articulo.modeloInventario == "LoteFijo"
      //     ? (articulo.fechaProximoPedido = "-")
      //     : (articulo.restanteProximoPedido = "-");
      //   articulo.cgi == "0" ? (articulo.cgi = "-") : {};
      //   articulo.proveedorPredeterminadoId == "0"
      //     ? (articulo.proveedorPredeterminadoId = "-")
      //     : {};
      //   articulo.proveedorPredeterminadoNombre == "Sin proveedor predeterminado"
      //     ? (articulo.proveedorPredeterminadoNombre = "-")
      //     : {};
      // });
      setArticulos(articulos);
    });
  }, [getArticulosShort]);

  // Dev time debugging
  useEffect(() => {
    if (error) {
      console.error(error);
    }
  }, [error]);

  const columns: GridColDef<any>[] = [
    { field: "id", headerName: "ID" },
    { field: "nombre", headerName: "Nombre" },
    { field: "stock", headerName: "Stock" },
    { field: "cgi", headerName: "CGI" },

    {
      field: "proveedorPredeterminadoId",
      headerName: "ID Prov (Pred)",
      renderCell: (params: any) => {
        return params.row.proveedorPredeterminadoId == "0"
          ? "-"
          : params.row.proveedorPredeterminadoId;
      },
    },
    {
      field: "proveedorPredeterminadoNombre",
      headerName: "Nombre Prov (Pred)",
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

        return params.row.modeloInventario == "LoteFijo" ? (
          <Chip
            label="Lote Fijo"
            color="success"
            variant="outlined"
            size="medium"
          />
        ) : (
          <Chip
            label="Lote Variable"
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
      width: 100,
      renderCell: (params: any) => {
        return params.row.modeloInventario == "LoteFijo"
          ? params.row.fechaProximoPedido
          : "-";
      },
    },
    {
      field: "restanteProximoPedido",
      headerName: "Unidades hasta próximo pedido",
      width: 100,
      renderCell: (params: any) => {
        return params.row.modeloInventario == "LoteFijo"
          ? params.row.restanteProximoPedido
          : "-";
      },
    },

    {
      field: "actions",
      headerName: "Acciones",
      filterable: false,
      sortable: false,
      renderCell: (params: any) => (
        <Stack direction="row" spacing={1}>
          <IconButton
            color="error"
            onClick={() => handleUpdateArticulo(params.row.articuloCod)}
            size="small"
          >
            <Edit />
          </IconButton>
          <IconButton
            color="primary"
            onClick={() => handleDeleteArticulo(params.row.articuloCod)}
            size="small"
          >
            <Delete />
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
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/articulo/create")}
          startIcon={<Add />}
        >
          Crear articulo
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
