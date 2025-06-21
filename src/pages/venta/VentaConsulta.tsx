import { Button, Typography } from "@mui/material";
import { Link, useParams } from "react-router-dom";

export function VentaConsulta() {
  const { ventaCod } = useParams();
  return (
    <div>
      <Typography variant="h2" marginBottom={2}>
        Venta Nombre {ventaCod}
      </Typography>
      <div>
        <Link to={`/venta/update/${ventaCod}`}>
          <Button variant="contained" color="primary">
            Modificar
          </Button>
        </Link>
        <Button variant="contained" color="error">
          Eliminar
        </Button>
      </div>

      <p>
        Fecha: <span>Fecha de la venta</span>
      </p>
      <p>
        Total: <span>Total de la venta</span>
      </p>
      <p>
        Detalles:
        <ul>
          <li>Detalle 1</li>
          <li>Detalle 2</li>
          <li>Detalle 3</li>
        </ul>
      </p>
    </div>
  );
}
