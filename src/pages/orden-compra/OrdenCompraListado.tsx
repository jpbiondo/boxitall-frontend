import { useEffect, useState } from "react";
import { useOrdenCompra } from "../../hooks/useOrdenCompra";
import { DataGrid } from "@mui/x-data-grid";
import { IconButton, Stack, Typography } from "@mui/material";
import { Button } from "@mui/material";
import { Add, Visibility } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

export const OrdenCompraListado = () => {
  const { isLoading, error, listarOrdenesActivas } = useOrdenCompra();
  const [ordenes, setOrdenes] = useState<any[]>([]);
  const navigate = useNavigate();

  const handleVerDetalle = (idOrden: number) => {
    navigate(`/orden-compra/${idOrden}/detalle`);
  };

  useEffect(() => {
    listarOrdenesActivas().then((ordenes) => {
      console.log("Respuesta de listarOrdenesActivas:", ordenes);

      if (Array.isArray(ordenes)) {
        ordenes.map((orden) => {
          orden.fecha = orden.fecha
            ? new Date(orden.fecha).toLocaleDateString()
            : "-";
          orden.estado = orden.estado || "PENDIENTE";
          orden.proveedor = orden.proveedor || "Sin proveedor";
        });
        setOrdenes(ordenes);
      } else {
        console.error("listarOrdenesActivas no devolvió un array:", ordenes);
        setOrdenes([]);
      }
    });
  }, [listarOrdenesActivas]);

  // Dev time debugging
  useEffect(() => {
    if (error) {
      console.error(error);
    }
  }, [error]);

  const columns = [
    { field: "idordenCompra", headerName: "Codigo", width: 120 },
    { field: "fecha", headerName: "Fecha", width: 150 },
    { field: "estado", headerName: "Estado", width: 150 },
    { field: "proveedor", headerName: "Proveedor", width: 200 },
    {
      field: "actions",
      headerName: "Acciones",
      width: 100,
      renderCell: (params: any) => (
        <IconButton
          color="primary"
          onClick={() => handleVerDetalle(params.row.idordenCompra)}
        >
          <Visibility />
        </IconButton>
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
        <Typography variant="h2">Ordenes de Compra</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/orden-compra/create")}
          startIcon={<Add />}
        >
          Crear orden de compra
        </Button>
      </Stack>
      <DataGrid
        rows={ordenes}
        columns={columns}
        loading={isLoading}
        getRowId={(row) => row.idordenCompra}
      />
    </div>
  );
};
