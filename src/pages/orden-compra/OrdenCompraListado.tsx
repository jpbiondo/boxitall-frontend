import { useEffect, useState } from "react";
import { useOrdenCompra } from "../../hooks/useOrdenCompra";
import { DataGrid } from "@mui/x-data-grid";

export function OrdenCompraListado() {
  const { isLoading, error, getOrdenCompraShort } =
    useOrdenCompra("/orden-compra");
  const [ordenCompras, setOrdenCompras] = useState<any[]>([]);

  useEffect(() => {
    setOrdenCompras([
      {
        id: 1,
        ordenCompraCod: 1,
        ordenCompraFechaInicio: "2021-01-01",
        ordenCompraFechaFin: "2021-01-02",
        ordenCompraTotal: 100,
      },
      {
        id: 2,
        ordenCompraCod: 2,
        ordenCompraFechaInicio: "2021-01-02",
        ordenCompraFechaFin: "2021-01-03",
        ordenCompraTotal: 200,
      },
      {
        id: 3,
        ordenCompraCod: 3,
        ordenCompraFechaInicio: "2021-01-03",
        ordenCompraFechaFin: "2021-01-04",
        ordenCompraTotal: 300,
      },
    ]);
  }, []);

  const columns = [
    { field: "id", headerName: "ID", width: 100 },
    { field: "ordenCompraCod", headerName: "Código", width: 100 },
    {
      field: "ordenCompraFechaInicio",
      headerName: "Fecha de inicio",
      width: 200,
    },
    { field: "ordenCompraFechaFin", headerName: "Fecha de fin", width: 200 },
    { field: "ordenCompraTotal", headerName: "Total", width: 200 },
  ];

  return (
    <div>
      <h1>OrdenCompras</h1>
      <DataGrid rows={ordenCompras} columns={columns} loading={isLoading} />
    </div>
  );
}
