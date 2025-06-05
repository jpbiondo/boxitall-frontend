import { useParams } from "react-router";

export function OrdenCompraConsulta() {
  const { ordenCompraCod } = useParams();
  return (
    <div>
      <h1>OrdenCompraConsulta</h1>
      <p>OrdenCompraCod: {ordenCompraCod}</p>
    </div>
  );
}
