import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Typography } from "@mui/material";
import { Alert, AlertTitle } from "@mui/material";
import type { DTOArticuloProveedorListado } from "../../types/domain/articulo/DTOArticuloProveedorListado";
import type { DTOOrdenCompraObtenerDetalle } from "../../types/domain/orden-compra/DTOOrdenCompraObtenerDetalle";
import type { DTOOrdenCompraAlta } from "../../types/domain/orden-compra/DTOOrdenCompraAlta";
import { API_URL } from "../../utils/constants";



export function AddOrdenDetalle() {
  const location = useLocation();
  const navigate = useNavigate();
  const [mensaje, setMensaje] = useState<string | null>(null);
 const [errores, setErrores] = useState<string[]>([]);
 const [cargando, setCargando] = useState(false);


  const state = location.state as {
    primerarticulo?: DTOArticuloProveedorListado;
    proveedorid?: number;
    proveedornombre?: string;
  };

  const [detalleOrden, setDetalleOrden] = useState<DTOOrdenCompraObtenerDetalle | null>(null);

  useEffect(() => {
    if (
      !state?.primerarticulo ||
      state.proveedorid === undefined ||
      !state.proveedornombre
    ) {
      navigate("/orden-compra");
      return;
    }

    const primerArticulo = state.primerarticulo;
    const proveedorId = state.proveedorid;
    const proveedorNombre = state.proveedornombre;

    const detalleInicial: DTOOrdenCompraObtenerDetalle = {
      idordenCompra: 0,
      estado: "BORRADOR",
      idproveedor: proveedorId,
      nombreproveedor: proveedorNombre,
      detalleArticulos: [
        {
          idarticulo: primerArticulo.idArticulo,
          renglon: 0,
          nombreArticulo: primerArticulo.nombreArticulo,
          cantidad: 1,
          precio: primerArticulo.precioProveedor,
          idOCarticulo: 0,
          loteoptimo: primerArticulo.loteoptimo,
        },
      ],
    };

    setDetalleOrden(detalleInicial);
  }, [state, navigate]);

  const handleModificarCantidad = (idOCarticulo: number, cantidadActual: number) => {
    const nuevaCantidadStr = window.prompt("Ingrese la nueva cantidad:", cantidadActual.toString());
    if (nuevaCantidadStr === null) return;
    const nuevaCantidad = Number(nuevaCantidadStr);
    if (isNaN(nuevaCantidad) || nuevaCantidad <= 0) {
      alert("Cantidad inválida");
      return;
    }

    setDetalleOrden((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        detalleArticulos: prev.detalleArticulos.map((art) =>
          art.idOCarticulo === idOCarticulo ? { ...art, cantidad: nuevaCantidad } : art
        ),
      };
    });
  };

  const handleEliminar = (idOCarticulo: number) => {
    const confirmacion = window.confirm("¿Está seguro de eliminar este artículo?");
    if (!confirmacion) return;

    setDetalleOrden((prev) => {
      if (!prev) return prev;
      const articulosFiltrados = prev.detalleArticulos.filter(
        (art) => art.idOCarticulo !== idOCarticulo
      );
      return {
        ...prev,
        detalleArticulos: articulosFiltrados,
      };
    });
  };

const handleGuardarOrden = async () => {
  if (!detalleOrden) return;

  setCargando(true);
  setMensaje(null);
  setErrores([]);

  const dto: DTOOrdenCompraAlta = {
    detallesarticulo: detalleOrden.detalleArticulos.map((art) => ({
      IDarticulo: art.idarticulo,
      cantidad: art.cantidad,
    })),
    IDProveedor: detalleOrden.idproveedor,
  };

  try {
   const response = await fetch(`${API_URL}/orden-compra/alta-orden-compra`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dto),
    });

    const body = await response.json().catch(() => null);

    if (!response.ok) {
      setMensaje(body?.mensaje || "Error al crear la orden.");
      if (Array.isArray(body?.errores)) {
        setErrores(body.errores);
      }
      return;
    }

    setMensaje(body?.mensaje || "Orden creada correctamente.");
    setErrores([]);
    // Podés hacer navigate si querés ir a otra vista
    // navigate("/orden-compra");
  } catch (error: any) {
    console.error("Error al crear orden:", error);
    setMensaje("Error inesperado al crear la orden.");
  } finally {
    setCargando(false);
  }
};


  


  if (!detalleOrden) return <p>Cargando nueva orden...</p>;

  const total = detalleOrden.detalleArticulos.reduce(
    (acc, art) => acc + art.precio * art.cantidad,
    0
  );

return (
  <div>
    <Typography variant="h4" gutterBottom>
      Nueva Orden de Compra
    </Typography>

    <p>
      <strong>Proveedor:</strong> {detalleOrden.nombreproveedor}
    </p>
    <p>
      <strong>Estado:</strong> {detalleOrden.estado}
    </p>

    {cargando && <Alert severity="info">Cargando...</Alert>}

    {mensaje && (
      <Alert severity={errores.length > 0 ? "error" : "success"} sx={{ mb: 2 }}>
        <AlertTitle>{errores.length > 0 ? "Errores" : "Éxito"}</AlertTitle>
        {mensaje}
      </Alert>
    )}

    {errores.length > 0 && (
      <Alert severity="error" sx={{ mb: 2 }}>
        <AlertTitle>Detalles:</AlertTitle>
        <ul style={{ margin: 0, paddingLeft: "1.2em" }}>
          {errores.map((err, i) => (
            <li key={i}>{err}</li>
          ))}
        </ul>
      </Alert>
    )}

      <h3>Artículos</h3>
      <ul>
        {detalleOrden.detalleArticulos.map((articulo) => (
          <li key={articulo.idarticulo}>
            Renglón: {articulo.renglon} - {articulo.nombreArticulo} | Cantidad (tamaño de lote: {articulo.loteoptimo}): {articulo.cantidad}
 | Precio: ${articulo.precio}

            <span style={{ marginLeft: 15 }}>
              <Button
                variant="outlined"
                size="small"
                onClick={() => handleModificarCantidad(articulo.idOCarticulo, articulo.cantidad)}
              >
                Modificar
              </Button>

              <Button
                variant="outlined"
                color="error"
                size="small"
                style={{ marginLeft: 8 }}
                onClick={() => handleEliminar(articulo.idOCarticulo)}
              >
                Eliminar
              </Button>
            </span>
          </li>
        ))}
      </ul>

      <p>
        <strong>Total:</strong> ${total.toFixed(2)}
      </p>

      <Button variant="outlined" onClick={() => navigate("/orden-compra")}>
        Cancelar y volver
      </Button>

      <Button
        variant="contained"
        color="primary"
        style={{ marginLeft: 12 }}
        onClick={handleGuardarOrden}
        disabled={detalleOrden.detalleArticulos.length === 0}
      >
        Guardar Orden
      </Button>
    </div>
  );
}
    