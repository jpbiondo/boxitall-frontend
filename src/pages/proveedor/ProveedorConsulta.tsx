import { useParams } from "react-router";

export function ProveedorConsulta() {
  const { proveedorCod } = useParams();
  return (
    <div>
      <h1>ProveedorConsulta</h1>
      <p>ProveedorCod: {proveedorCod}</p>
    </div>
  );
}
