import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Button,
  Typography,
  Alert,
  AlertTitle,
} from "@mui/material";
import type { DTOArticuloProveedorListado } from "../../types/domain/articulo/DTOArticuloProveedorListado";
import type { DTOOrdenCompraObtenerDetalle } from "../../types/domain/orden-compra/DTOOrdenCompraObtenerDetalle";
import type { DTOOrdenCompraAlta } from "../../types/domain/orden-compra/DTOOrdenCompraAlta";
import { API_URL } from "../../utils/constants";
import { AddArticuloModal } from "../../components/AddArticuloModal"; 

export function AddOrdenDetalle() {
  const location = useLocation();
  const navigate = useNavigate();

  const [mensaje, setMensaje] = useState<string | null>(null);
  const [errores, setErrores] = useState<string[]>([]);
  const [cargando, setCargando] = useState(false);
  const [modalAbierto, setModalAbierto] = useState(false);

  const state = location.state as {
    primerarticulo?: DTOArticuloProveedorListado;
    proveedorid?: number;
    proveedornombre?: string;
    articuloParaAgregar?: DTOArticuloProveedorListado;
  };

  const [detalleOrden, setDetalleOrden] = useState<DTOOrdenCompraObtenerDetalle | null>(null);

  useEffect(() => {
    if (!state?.primerarticulo || state.proveedorid === undefined || !state.proveedornombre) {
      navigate("/orden-compra");
      return;
    }

    const primerArticulo = state.primerarticulo;

    const detalleInicial: DTOOrdenCompraObtenerDetalle = {
      idordenCompra: 0,
      estado: "BORRADOR",
      nombreproveedor: state.proveedornombre,
      idproveedor: state.proveedorid,
      detalleArticulos: [
        {
          idarticulo: primerArticulo.idArticulo,
          renglon: 0,
          nombreArticulo: primerArticulo.nombreArticulo,
          cantidad: 1,
          precio: primerArticulo.precioProveedor,
          idOCarticulo: Date.now(),
          loteoptimo: primerArticulo.loteOptimo,
        },
      ],
    };

    setDetalleOrden(detalleInicial);
  }, []);

  useEffect(() => {
    if (state.articuloParaAgregar && detalleOrden) {
      const yaExiste = detalleOrden.detalleArticulos.some(
        (art) => art.idarticulo === state.articuloParaAgregar!.idArticulo
      );

      if (!yaExiste) {
        const nuevoArticulo = {
          idarticulo: state.articuloParaAgregar.idArticulo,
          renglon: detalleOrden.detalleArticulos.length,
          nombreArticulo: state.articuloParaAgregar.nombreArticulo,
          cantidad: 1,
          precio: state.articuloParaAgregar.precioProveedor,
          idOCarticulo: Date.now(),
          loteoptimo: state.articuloParaAgregar.loteOptimo,
        };

        setDetalleOrden({
          ...detalleOrden,
          detalleArticulos: [...detalleOrden.detalleArticulos, nuevoArticulo],
        });
      }

      navigate(".", { replace: true, state: { ...state, articuloParaAgregar: undefined } });
    }
  }, [state.articuloParaAgregar, detalleOrden]);

  const handleModificarCantidad = (idOCarticulo: number, cantidadActual: number) => {
    const nuevaCantidadStr = window.prompt("Ingrese la nueva cantidad:", cantidadActual.toString());
    if (nuevaCantidadStr === null) return;
    const nuevaCantidad = Number(nuevaCantidadStr);
    if (isNaN(nuevaCantidad) || nuevaCantidad <= 0) {
      alert("Cantidad inválida");
      return;
    }

    setDetalleOrden((prev) =>
      prev
        ? {
            ...prev,
            detalleArticulos: prev.detalleArticulos.map((art) =>
              art.idOCarticulo === idOCarticulo ? { ...art, cantidad: nuevaCantidad } : art
            ),
          }
        : prev
    );
  };

  const handleEliminar = (idOCarticulo: number) => {
    const confirmacion = window.confirm("¿Está seguro de eliminar este artículo?");
    if (!confirmacion) return;

    setDetalleOrden((prev) =>
      prev
        ? {
            ...prev,
            detalleArticulos: prev.detalleArticulos.filter((art) => art.idOCarticulo !== idOCarticulo),
          }
        : prev
    );
  };

  const handleGuardarOrden = async () => {
    if (!detalleOrden) return;

    setCargando(true);
    setMensaje(null);
    setErrores([]);

    const dto: DTOOrdenCompraAlta = {
      IDProveedor: detalleOrden.idproveedor,
      detallesarticulo: detalleOrden.detalleArticulos.map((art) => ({
        IDarticulo: art.idarticulo,
        cantidad: art.cantidad,
      })),
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
      navigate("/orden-compra");
    } catch (error) {
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

      <Button
        variant="contained"
        color="secondary"
        onClick={() => setModalAbierto(true)}
        style={{ marginTop: "1rem" }}
      >
        Agregar otro artículo
      </Button>

      {cargando && <Alert severity="info">Cargando...</Alert>}

      {mensaje && (
        <Alert severity={errores.length > 0 ? "error" : "success"} sx={{ mt: 2 }}>
          <AlertTitle>{errores.length > 0 ? "Errores" : "Éxito"}</AlertTitle>
          {mensaje}
        </Alert>
      )}

      {errores.length > 0 && (
        <Alert severity="error" sx={{ mt: 2 }}>
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
          <li key={articulo.idOCarticulo}>
            Renglón: {articulo.renglon} - {articulo.nombreArticulo} | Cantidad ( tamaño lote: {articulo.loteoptimo}): {articulo.cantidad} | Precio: ${articulo.precio}
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

      {/* Modal para agregar artículos */}
      <AddArticuloModal
        open={modalAbierto}
        proveedorid={detalleOrden.idproveedor}
        detalleActual={detalleOrden.detalleArticulos}
        onClose={(nuevoArticulo) => {
          setModalAbierto(false);
          if (!nuevoArticulo) return;

          const yaExiste = detalleOrden.detalleArticulos.some(
            (art) => art.idarticulo === nuevoArticulo.idArticulo
          );
          if (yaExiste) return;

          const nuevo = {
            idarticulo: nuevoArticulo.idArticulo,
            renglon: detalleOrden.detalleArticulos.length,
            nombreArticulo: nuevoArticulo.nombreArticulo,
            cantidad: 1,
            precio: nuevoArticulo.precioProveedor,
            idOCarticulo: Date.now(),
            loteoptimo: nuevoArticulo.loteoptimo,
          };

          setDetalleOrden((prev) =>
            prev
              ? { ...prev, detalleArticulos: [...prev.detalleArticulos, nuevo] }
              : prev
          );
        }}
      />
    </div>
  );
}
