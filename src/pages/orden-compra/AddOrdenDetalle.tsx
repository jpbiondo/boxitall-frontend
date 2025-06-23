import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Typography } from "@mui/material";
import type { DTOArticuloProveedorListado } from "../../types/domain/articulo/DTOArticuloProveedorListado";
import type { DTOOrdenCompraObtenerDetalle } from "../../types/domain/orden-compra/DTOOrdenCompraObtenerDetalle";
import type { DTOOrdenCompraAlta } from "../../types/domain/orden-compra/DTOOrdenCompraAlta";
import { useOrdenCompra } from "../../hooks/useOrdenCompra";

export function AddOrdenDetalle() {
  const location = useLocation();
  const navigate = useNavigate();
  const { crearOrdenCompra } = useOrdenCompra();

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
      IDOrdenCompra: 0,
      estado: "BORRADOR",
      idproveedor: proveedorId,
      nombreProveedor: proveedorNombre,
      detalleArticulos: [
        {
          IDarticulo: primerArticulo.idArticulo,
          renglon: 0,
          nombreArticulo: primerArticulo.nombreArticulo,
          cantidad: 1,
          precio: primerArticulo.precioProveedor,
          idOCarticulo: 0,
          loteoptimo: primerArticulo.loteOptimo,
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

    const dto: DTOOrdenCompraAlta = {
      IDProveedor: detalleOrden.idproveedor,
      detallesarticulo: detalleOrden.detalleArticulos.map((art) => ({
        IDarticulo: art.IDarticulo,
        cantidad: art.cantidad,
      })),
    };

    try {
      await crearOrdenCompra(dto);
      alert("Orden creada con éxito");
      navigate("/orden-compra");
    } catch (error) {
      console.error("Error al crear orden:", error);
      alert("Hubo un error al crear la orden.");
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
        <strong>Proveedor:</strong> {detalleOrden.nombreProveedor}
      </p>
      <p>
        <strong>Estado:</strong> {detalleOrden.estado}
      </p>

      <h3>Artículos</h3>
      <ul>
        {detalleOrden.detalleArticulos.map((articulo) => (
          <li key={articulo.IDarticulo}>
            Renglón: {articulo.renglon} - {articulo.nombreArticulo} | Cantidad(tamaño de lote:{articulo.loteoptimo}): {articulo.cantidad} | Precio: ${articulo.precio}

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
