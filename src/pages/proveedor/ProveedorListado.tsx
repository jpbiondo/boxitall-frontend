import { useEffect, useState } from "react";
import { useProveedor } from "../../hooks/useProveedor";
import { DataGrid, GridRenderCellParams, GridColDef } from "@mui/x-data-grid";
import { Add, Delete, Edit } from "@mui/icons-material";
import { Button, IconButton, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useOrdenCompra } from "../../hooks/useOrdenCompra";

export function ProveedorListado() {
  const { isLoading, error, getProveedorShort } = useProveedor();
  const {
    isLoading: isLoadingDelete,
    error: errorDelete,
    deleteProveedor,
  } = useProveedor();
  const [proveedores, setProveedores] = useState<any[]>([]);
  const navigate = useNavigate();
  const { error: errorCrearOrdenCompra, crearOrdenCompra } = useOrdenCompra();

  useEffect(() => {
    crearOrdenCompra({
      IDProveedor: -2,
      detallesarticulo: [
        {
          IDarticulo: 1,
          cantidad: 1,
        },
      ],
    });
    if (errorCrearOrdenCompra) {
      errorCrearOrdenCompra.response?.json().then((resp) => {
        console.log(resp.message);
      });
    }
  }, []);

  const handleDelete = (id: number) => {
    deleteProveedor(id.toString()).then(() => {
      getProveedorShort().then((proveedores) => {
        setProveedores(proveedores);
      });
    });
  };

  useEffect(() => {
    getProveedorShort().then((proveedores) => {
      setProveedores(proveedores);
    });
  }, [getProveedorShort]);

  useEffect(() => {
    if (error) {
      console.error(error);
    }
  }, [error]);

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 100 },
    { field: "proveedorCod", headerName: "Código", width: 100 },
    { field: "proveedorNombre", headerName: "Nombre", width: 200 },
    { field: "proveedorTelefono", headerName: "Teléfono", width: 200 },
    {
      field: "actions",
      headerName: "Acciones",
      width: 100,
      renderCell: (params: GridRenderCellParams) => {
        return (
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            justifyContent="center"
          >
            <IconButton
              onClick={() => navigate(`/proveedor/update/${params.row.id}`)}
              color="primary"
              size="small"
              aria-label="Editar"
            >
              <Edit />
            </IconButton>
            <IconButton
              onClick={() => handleDelete(params.row.id)}
              color="error"
              size="small"
              aria-label="Eliminar"
            >
              <Delete />
            </IconButton>
          </Stack>
        );
      },
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
        <Typography variant="h2">Proveedores</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/proveedor/create")}
          startIcon={<Add />}
        >
          Crear proveedor
        </Button>
      </Stack>
      <DataGrid rows={proveedores} columns={columns} loading={isLoading} />
    </div>
  );
}
