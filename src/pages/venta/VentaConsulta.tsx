import { useParams } from "react-router";

export function VentaConsulta() {
  const { ventaCod } = useParams();
  return (
    <div>
      <h1>VentaConsulta</h1>
      <p>VentaCod: {ventaCod}</p>
    </div>
  );
}
