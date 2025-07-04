import { Button, Typography } from "@mui/material";
import { Link, useParams } from "react-router-dom";

export function ProveedorConsulta() {
  const { proveedorCod } = useParams();
  return (
    <div>
      <Typography variant="h2" marginBottom={2}>
        Proveedor Nombre {proveedorCod}
      </Typography>
      <div>
        <Link to={`/proveedor/update/${proveedorCod}`}>
          <Button variant="contained" color="primary">
            Modificar
          </Button>
        </Link>
        <Button variant="contained" color="error">
          Eliminar
        </Button>
      </div>

      <p>
        Teléfono: <span>Teléfono del proveedor</span>
      </p>
      <div>
        <p>Artículos:</p>
        <ul>
          <li>Artículo 1</li>
          <li>Artículo 2</li>
          <li>Artículo 3</li>
        </ul>
      </div>
    </div>
  );
}
