import { Button } from "@mui/material";
import { Link, useParams } from "react-router-dom";

export function OrdenCompraConsulta() {
  const { ordenCompraCod } = useParams();
  return (
    <div>
      <h1>OrdenCompra Nombre {ordenCompraCod}</h1>
      <div>
        <Link to={`/orden-compra/update/${ordenCompraCod}`}>
          <Button variant="contained" color="primary">
            Modificar
          </Button>
        </Link>
        <Button variant="contained" color="error">
          Eliminar
        </Button>
      </div>

      <p>
        Fecha de inicio: <span>Fecha de inicio de la orden de compra</span>
      </p>
      <p>
        Fecha de fin: <span>Fecha de fin de la orden de compra</span>
      </p>
      <p>
        Detalles:
        <ul>
          <li>Detalle 1</li>
          <li>Detalle 2</li>
          <li>Detalle 3</li>
        </ul>
      </p>

      <p>
        Estado: <span>Estado de la orden de compra</span>
      </p>
      <p>
        Total: <span>Total de la orden de compra</span>
      </p>
    </div>
  );
}
