import { useEffect, useState } from "react";
import { useProveedor } from "../../hooks/useProveedor";
import { DataGrid, GridRenderCellParams, GridColDef } from "@mui/x-data-grid";
import { Add, Delete, Edit } from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAlert } from "../../hooks/useAlert";
import AlertContainer from "../../components/AlertContainer";

export function ProveedorListado() {
  const { isLoading, getProveedorShort, deleteProveedor } = useProveedor();

  const { alert, showSuccess, showError, hideAlert } = useAlert();
  const [proveedores, setProveedores] = useState<any[]>([]);

  const navigate = useNavigate();

  const handleDelete = (id: number) => {
    deleteProveedor(id.toString())
      .then(() => {
        getProveedorShort().then((proveedores) => {
          setProveedores(proveedores);
        });
        showSuccess("Proveedor eliminado exitosamente", true);
      })
      .catch((error) => {
        error.response.json().then((resp: any) => {
          showError(resp.error || "Error al eliminar el proveedor");
        });
      });
  };

  useEffect(() => {
    getProveedorShort().then((proveedores) => {
      setProveedores(proveedores);
    });
  }, [getProveedorShort]);

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID" },
    { field: "proveedorCod", headerName: "Código" },
    { field: "proveedorNombre", headerName: "Nombre" },
    { field: "proveedorTelefono", headerName: "Teléfono" },
    {
      field: "actions",
      headerName: "Acciones",
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
    <Box sx={{ position: "relative" }}>
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
      <Box width="600px">
        <DataGrid rows={proveedores} columns={columns} loading={isLoading} />
      </Box>
      <AlertContainer isDisplayAlert={alert.show}>
        <Alert
          className="max-w-lg mx-auto"
          severity={alert.severity}
          onClose={hideAlert}
        >
          {alert.message}
        </Alert>
      </AlertContainer>
    </Box>
  );
}
