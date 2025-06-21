import { useEffect, useState } from "react";
import { useProveedor } from "../../hooks/useProveedor";
import { DataGrid } from "@mui/x-data-grid";

export function ProveedorListado() {
  const { isLoading, error, getProveedorShort } = useProveedor("/proveedor");
  const [proveedores, setProveedores] = useState<any[]>([]);

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
  })
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
      <h1>Proveedor</h1>
      <DataGrid rows={proveedores} columns={columns} loading={isLoading} />
    </div>
  );
}
