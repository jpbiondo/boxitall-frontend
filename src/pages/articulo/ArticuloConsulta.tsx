import { useParams } from "react-router";

export function ArticuloConsulta() {
  const { articuloCod } = useParams();
  return (
    <div>
      <h1>ArticuloConsulta</h1>
      <p>ArticuloCod: {articuloCod}</p>
    </div>
  );
}
