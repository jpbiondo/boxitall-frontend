import { useEffect, useState } from "react";
import { useVenta } from "../../hooks/useVenta";
import { DataGrid } from "@mui/x-data-grid";

export function VentaListado() {
  const { isLoading, error, getVentaShort } = useVenta("/venta");
  const [ventas, setVentas] = useState<any[]>([]);

  useEffect(() => {
    setVentas([
      { id: 1, ventaCod: 1, ventaFecha: "2021-01-01", ventaTotal: 100 },
      { id: 2, ventaCod: 2, ventaFecha: "2021-01-02", ventaTotal: 200 },
      { id: 3, ventaCod: 3, ventaFecha: "2021-01-03", ventaTotal: 300 },
    ]);
  }, []);

  const columns = [
    { field: "id", headerName: "ID", width: 100 },
    { field: "ventaCod", headerName: "Código", width: 100 },
    { field: "ventaFecha", headerName: "Fecha", width: 200 },
    { field: "ventaTotal", headerName: "Total", width: 200 },
  ];

  return (
    <div>
      <h1>Ventas</h1>
      <DataGrid rows={ventas} columns={columns} loading={isLoading} />
    </div>
  );
}
