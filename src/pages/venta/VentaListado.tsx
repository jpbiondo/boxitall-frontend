import { useEffect, useState } from "react";
import { useVenta } from "../../hooks/useVenta";
import { DataGrid } from "@mui/x-data-grid";
import { Button, IconButton, Stack, Typography } from "@mui/material";
import { Add, Delete, Edit, Visibility } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import type { VentaShortDTO } from "../../types/domain/venta/VentaShortDTO";

export function VentaListado() {
  const { isLoading, error, getVentaShort } = useVenta();
  const [ventas, setVentas] = useState<VentaShortDTO[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    getVentaShort().then((ventas) => {
      setVentas(ventas);
      console.log(ventas);
    });
  }, []);

  const handleVerDetalle = (id: number) => {
    navigate(`/venta/${id}`);
  };

  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: 100,
    },
    {
      field: "fechaVenta",
      headerName: "Fecha",
      width: 200,
    },
    {
      field: "actions",
      headerName: "Acciones",
      width: 200,
      renderCell: (params: any) => (
        <Stack direction="row" spacing={1}>
          <IconButton
            color="primary"
            onClick={() => handleVerDetalle(params.row.id)}
            size="small"
          >
            <Visibility />
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
        <Typography variant="h2">Ventas</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/venta/create")}
          startIcon={<Add />}
        >
          Crear venta
        </Button>
      </Stack>
      <DataGrid rows={ventas} columns={columns} loading={isLoading} />
    </div>
  );
}
