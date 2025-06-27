import { useEffect, useState } from "react";
import { Button, Typography } from "@mui/material";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useOrdenCompra } from "../../hooks/useOrdenCompra";
import type { DTOOrdenCompraObtenerDetalle } from "../../types/domain/orden-compra/DTOOrdenCompraObtenerDetalle";
import type { DTOOrdenCompraArticuloAlta } from "../../types/domain/orden-compra/DTOOrdenCompraArticuloAlta";

export function OrdenCompraConsulta() {
  const { ordenCompraCod } = useParams<{ ordenCompraCod: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    obtenerDetalleOrden,
    eliminarDetalleOrden,
    actualizarCantidadDetalle,
    cancelarOrdenCompra,
    avanzarEstadoOrden,
    agregarArticuloAOrden,
    isLoading,
    error,
  } = useOrdenCompra();

  const [detalleOrden, setDetalleOrden] =
    useState<DTOOrdenCompraObtenerDetalle | null>(null);
  const [avisos, setAvisos] = useState<string[]>([]);

  const state = location.state as {
    articuloParaAgregar?: DTOOrdenCompraArticuloAlta;
  };

  // Cargar orden por ID
  useEffect(() => {
    if (ordenCompraCod) {
      obtenerDetalleOrden(Number(ordenCompraCod))
        .then(setDetalleOrden)
        .catch(console.error);
    }
  }, [ordenCompraCod, obtenerDetalleOrden]);

  useEffect(() => {
    const agregarArticuloSiVino = async () => {
      if (state?.articuloParaAgregar && ordenCompraCod) {
        try {
          await agregarArticuloAOrden(
            Number(ordenCompraCod),
            state.articuloParaAgregar
          );

          const detalleActualizado = await obtenerDetalleOrden(
            Number(ordenCompraCod)
          );
          setDetalleOrden(detalleActualizado);
        } catch (error) {
          console.error("Error al agregar artículo:", error);
          alert(
            "Ocurrió un error al agregar el artículo. El artículo ya tiene una orden activa"
          );

          const detalleActualizado = await obtenerDetalleOrden(
            Number(ordenCompraCod)
          );
          setDetalleOrden(detalleActualizado);
        } finally {
          navigate(`/orden-compra/${ordenCompraCod}/detalle`, {
            replace: true,
          });
        }
      }
    };

    agregarArticuloSiVino();
  }, [state?.articuloParaAgregar, ordenCompraCod]);

  // Cancelar orden
  const handleCancelar = async (idOrden: number) => {
    const confirmacion = window.confirm("¿Está seguro de cancelar esta orden?");
    if (confirmacion && ordenCompraCod) {
      await cancelarOrdenCompra(idOrden);
      const detalleActualizado = await obtenerDetalleOrden(
        Number(ordenCompraCod)
      );
      setDetalleOrden(detalleActualizado);
    }
  };

  // Avanzar estado de la orden
  const handleAvanzarEstado = async () => {
    if (!detalleOrden || !ordenCompraCod) return;

    const confirmacion = window.confirm(
      `¿Avanzar el estado de la orden de ${detalleOrden.estado}?`
    );
    if (confirmacion) {
      try {
        const mensajes = await avanzarEstadoOrden(Number(ordenCompraCod));
        setAvisos(mensajes);

        const detalleActualizado = await obtenerDetalleOrden(
          Number(ordenCompraCod)
        );
        setDetalleOrden(detalleActualizado);

        alert(
          mensajes.length > 0
            ? `Orden avanzada con avisos:\n${mensajes.join("\n")}`
            : "Orden avanzada correctamente"
        );
      } catch (err) {
        console.error(err);
        alert("No se pudo avanzar el estado.");
      }
    }
  };

  const getProximoEstado = (estado: string) => {
    switch (estado) {
      case "PENDIENTE":
        return "ENVIAR";
      case "ENVIADA":
        return "FINALIZAR";
      default:
        return "FINALIZADA";
    }
  };

  const handleAgregarArticulo = (orden: DTOOrdenCompraObtenerDetalle) => {
    navigate(`/orden-compra/agregar-articulo`, {
      state: { orden },
    });
  };

  const handleEliminar = async (idDetalle: number) => {
    const confirmar = window.confirm(
      "¿Estás seguro de que deseas eliminar este artículo?"
    );
    if (!confirmar || !ordenCompraCod) return;

    await eliminarDetalleOrden(Number(ordenCompraCod), idDetalle);

    const detalleActualizado = await obtenerDetalleOrden(
      Number(ordenCompraCod)
    );

    if (
      !detalleActualizado.detalleArticulos ||
      detalleActualizado.detalleArticulos.length === 0
    ) {
      alert("Se eliminó el último artículo. La orden también fue eliminada.");
      navigate("/orden-compra"); // <-- redirección automática a la lista de órdenes
      return;
    }

    setDetalleOrden(detalleActualizado);
  };

  const handleModificarCantidad = async (
    idDetalle: number,
    cantidadActual: number
  ) => {
    const nuevaCantidadStr = window.prompt(
      "Nueva cantidad:",
      cantidadActual.toString()
    );

    // Canceló el prompt
    if (nuevaCantidadStr === null) return;

    const nuevaCantidad = Number(nuevaCantidadStr);

    // Validaciones
    if (isNaN(nuevaCantidad) || nuevaCantidad <= 0) {
      alert("Por favor, ingrese un número válido mayor a cero.");
      return;
    }

    if (ordenCompraCod) {
      const confirmacion = window.confirm("¿Modificar la cantidad?");
      if (confirmacion) {
        await actualizarCantidadDetalle(
          Number(ordenCompraCod),
          idDetalle,
          nuevaCantidad
        );
        const detalleActualizado = await obtenerDetalleOrden(
          Number(ordenCompraCod)
        );
        setDetalleOrden(detalleActualizado);
      }
    }
  };

  if (isLoading) return <p>Cargando...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!detalleOrden) return <p>No se encontró la orden.</p>;

  const total = detalleOrden.detalleArticulos?.reduce(
    (acc, articulo) => acc + articulo.cantidad * articulo.precio,
    0
  );

  return (
    <div>
      <Button
        variant="outlined"
        onClick={() => navigate("/orden-compra")}
        style={{ marginBottom: "10px" }}
      >
        Volver
      </Button>
      <Typography variant="h4">
        Orden de Compra #{detalleOrden.idordenCompra}
      </Typography>

      <div style={{ margin: "10px 0" }}>
        <Button
          variant="contained"
          color="error"
          onClick={() => handleCancelar(Number(ordenCompraCod))}
          disabled={detalleOrden.estado !== "PENDIENTE"}
          style={{ marginRight: "5px" }}
        >
          Cancelar Orden
        </Button>

        <Button
          variant="contained"
          color="success"
          onClick={handleAvanzarEstado}
          disabled={
            detalleOrden.estado === "FINALIZADA" ||
            detalleOrden.estado === "CANCELADA"
          }
          style={{ marginRight: "5px" }}
        >
          {getProximoEstado(detalleOrden.estado)}
        </Button>

        <Button
          variant="contained"
          onClick={() => handleAgregarArticulo(detalleOrden)}
          disabled={detalleOrden.estado !== "PENDIENTE"}
          style={{ marginRight: "5px" }}
        >
          Agregar Artículo
        </Button>
      </div>

      <p>
        <strong>Proveedor:</strong> {detalleOrden.nombreproveedor}
      </p>
      <p>
        <strong>Estado actual:</strong> {detalleOrden.estado}
      </p>

      <h2>Artículos</h2>
      <ul>
        {detalleOrden.detalleArticulos?.map((art) => (
          <li key={art.idarticulo}>
            Renglón: {art.renglon} - {art.nombreArticulo} | Cantidad(tamaño de
            lote:{art.loteoptimo}):{art.cantidad}| Precio: ${art.precio}
            <div style={{ display: "inline", marginLeft: "10px" }}>
              <Button
                variant="outlined"
                size="small"
                disabled={detalleOrden.estado !== "PENDIENTE"}
                onClick={() =>
                  handleModificarCantidad(art.idOCarticulo, art.cantidad)
                }
                style={{ marginRight: "5px" }}
              >
                Modificar
              </Button>
              <Button
                variant="outlined"
                color="error"
                size="small"
                disabled={detalleOrden.estado !== "PENDIENTE"}
                onClick={() => handleEliminar(art.idOCarticulo)}
              >
                Eliminar
              </Button>
            </div>
          </li>
        ))}
      </ul>
      <p>
        <strong>Total:</strong> ${total?.toFixed(2)}
      </p>
    </div>
  );
}
