// TODO: Conectar con el backend
// TODO: Enlazar eliminar con metodo eliminar
import { Button } from "@mui/material";
import { Link, useParams } from "react-router-dom";

export function ArticuloConsulta() {
  const { articuloCod } = useParams();

  const handleDelete = () => {
    console.log("Eliminar artículo", articuloCod);
  };

  return (
    <div>
      <h1>Articulo Nombre {articuloCod}</h1>
      <div>
        <Link to={`/articulo/update/${articuloCod}`}>
          <Button variant="contained" color="primary">
            Modificar
          </Button>
        </Link>
        <Button variant="contained" color="error" onClick={handleDelete}>
          Eliminar
        </Button>
      </div>

      <p>
        Descripción: <span>Descripción del artículo</span>
      </p>

      <p>
        Nivel de servicio: <span>Nivel de servicio del artículo</span>
      </p>

      <p>
        Modelo Inventario: <span>Modelo de inventario del artículo</span>
        <p>Fecha pedido / Restante PP</p>
      </p>

      <p>
        Proveedor predeterminado:{" "}
        <span>Proveedor predeterminado del artículo</span>
      </p>

      <p>
        Proveedores:
        <ul>
          <li>Proveedor 1</li>
          <li>Proveedor 2</li>
          <li>Proveedor 3</li>
        </ul>
      </p>
    </div>
  );
}
