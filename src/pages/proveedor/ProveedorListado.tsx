import { useEffect, useState } from "react";
import { useProveedor } from "../../hooks/useProveedor";
import { DataGrid } from "@mui/x-data-grid";
import { Add } from "@mui/icons-material";
import { Button, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export function ProveedorListado() {
  const { isLoading, error, getProveedorShort } = useProveedor();
  const [proveedores, setProveedores] = useState<any[]>([]);
  const navigate = useNavigate();
  /*useEffect(() => {
    setProveedores([
      {
        id: 1,
        proveedorCod: 1,
        proveedorNombre: "Proveedor 1",
        proveedorTelefono: "123456789",
      },
      {
        id: 2,
        proveedorCod: 2,
        proveedorNombre: "Proveedor 2",
        proveedorTelefono: "123456789",
      },
      {
        id: 3,
        proveedorCod: 3,
        proveedorNombre: "Proveedor 3",
        proveedorTelefono: "123456789",
      },
    ]);
  }, []);*/

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

  const columns = [
    { field: "id", headerName: "ID", width: 100 },
    { field: "proveedorCod", headerName: "Código", width: 100 },
    { field: "proveedorNombre", headerName: "Nombre", width: 200 },
    { field: "proveedorTelefono", headerName: "Teléfono", width: 200 },
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
