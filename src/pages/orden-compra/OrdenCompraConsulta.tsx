import { useEffect, useState } from "react";
import { Button } from "@mui/material";
import { Link, useParams } from "react-router-dom";
import { useOrdenCompra } from "../../hooks/useOrdenCompra";

export function OrdenCompraConsulta() {
  const { ordenCompraCod } = useParams<{ ordenCompraCod: string }>();
  const { obtenerDetalleOrden, eliminarDetalleOrden, actualizarCantidadDetalle, cancelarOrdenCompra,avanzarEstadoOrden, isLoading, error } = useOrdenCompra();
  const [detalleOrden, setDetalleOrden] = useState<any>(null);

  useEffect(() => {
  if (ordenCompraCod) {
    console.log("Llamando a obtenerDetalleOrden con ID:", ordenCompraCod);
    
    obtenerDetalleOrden(Number(ordenCompraCod))
      .then((detalle) => {
        console.log("Detalle recibido del backend:", detalle);
        setDetalleOrden(detalle);
      })
      .catch((err) => console.error("Error al obtener detalle:", err));
  } else {
    console.warn("No hay ordenCompraCod en useParams");
  }
  }, [ordenCompraCod, obtenerDetalleOrden]);
 
 const handleAvanzarEstado = async () => {
    const confirmacion = window.confirm(
      `¿Está seguro de avanzar el estado de la orden de ${detalleOrden.estado} al siguiente estado?`
    );
    
    if (confirmacion && ordenCompraCod) {
      try {
        const mensajes = await avanzarEstadoOrden(Number(ordenCompraCod));
        setAvisos(mensajes);
        
        // Recargar los datos de la orden
        const detalleActualizado = await obtenerDetalleOrden(Number(ordenCompraCod));
        setDetalleOrden(detalleActualizado);
        
        if (mensajes.length > 0) {
          alert(`Orden avanzada de estado. Avisos:\n${mensajes.join("\n")}`);
        } else {
          alert("Estado de la orden avanzado correctamente");
        }
      } catch (err) {
        console.error("Error al avanzar estado:", err);
        alert("No se pudo avanzar el estado: " + (err as Error).message);
      }
    }
  };

  // Función para determinar el próximo estado 
  const getProximoEstado = (estadoActual: string): string => {
    switch(estadoActual) {
      case "PENDIENTE": return "ENVIAR";
      case "ENVIADA": return "FINALIZAR";
      default: return "FINALIZADA";
    }
  };

 
  const handleCancelar = async (idOrden: number) => {
    const confirmacion = window.confirm("¿Está seguro de cancelar esta orden? Esta acción modificará el estado de su orden de compra.");
    if (confirmacion && ordenCompraCod) {
      await cancelarOrdenCompra(idOrden);
      // Recargar datos
      const detalleActualizado = await obtenerDetalleOrden(Number(ordenCompraCod));
      setDetalleOrden(detalleActualizado);
    }
  };


  const handleEliminar = async (idDetalle: number) => {
    const confirmacion = window.confirm("¿Está seguro de eliminar este artículo? Esta acción modificará la orden de compra.");
    if (confirmacion && ordenCompraCod) {
      await eliminarDetalleOrden(Number(ordenCompraCod), idDetalle);
      // Recargar datos
      const detalleActualizado = await obtenerDetalleOrden(Number(ordenCompraCod));
      setDetalleOrden(detalleActualizado);
    }
  };

  const handleModificarCantidad = async (idDetalle: number, cantidadActual: number) => {
  const nuevaCantidad = window.prompt("Ingrese la nueva cantidad:", cantidadActual.toString());
  if (nuevaCantidad !== null && ordenCompraCod) {
    const confirmacion = window.confirm("¿Está seguro de modificar la cantidad? Esto cambiará la orden de compra.");
    if (confirmacion) {
      try {
        const response = await actualizarCantidadDetalle(Number(ordenCompraCod), idDetalle, Number(nuevaCantidad)); 
        console.log("Respuesta de actualizarCantidadDetalle:", response);

        // Recargar datos:
        const detalleActualizado = await obtenerDetalleOrden(Number(ordenCompraCod));
        setDetalleOrden(detalleActualizado);
      } catch (error) {
        console.error("Error al actualizar cantidad:", error);
      }
    }
  }
};


  if (isLoading) return <p>Cargando detalle de orden...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!detalleOrden) return <p>No se encontró la orden.</p>;

  const total = detalleOrden.detalleArticulos?.reduce((acc: number, articulo: any) => {
    return acc + articulo.cantidad * articulo.precio;
  }, 0);

  return (
    <div>
      <h1>Orden de Compra #{detalleOrden.idordenCompra}</h1>
      <div>
        {/* <Link to={`/orden-compra/update/${detalleOrden.IdordenCompra}`}>
          <Button variant="contained" color="primary"
          >Modificar</Button>
        </Link> */}
        <Button variant="contained" color="error"
                 onClick={() => handleCancelar(detalleOrden.idordenCompra)}
                 disabled={detalleOrden.estado !== "PENDIENTE"}
                  >Cancelar Orden</Button>
      </div>
      <Button
          variant="contained"
          color="success"
          onClick={handleAvanzarEstado}
          disabled={detalleOrden.estado === "FINALIZADA" || detalleOrden.estado === "CANCELADA"}
        >
          {getProximoEstado(detalleOrden.estado)}
        </Button>

      <p><strong>Proveedor:</strong> ({detalleOrden.nombreproveedor})</p>

      <h2>Artículos:</h2>
      <ul>
        {detalleOrden.detalleArticulos?.map((articulo: any) => (
          <li key={articulo.idarticulo}>
            Renglón: {articulo.renglon} - {articulo.nombreArticulo} | Cantidad(tamaño de lote:{articulo.loteoptimo}): {articulo.cantidad} | Precio: ${articulo.precio}
            <div style={{ display: "inline", marginLeft: "10px" }}>
              <Button
                variant="outlined"
                color="primary"
                size="small"
                 disabled={detalleOrden.estado !== "PENDIENTE"}
                onClick={() => handleModificarCantidad(articulo.idOCarticulo, articulo.cantidad)}
                style={{ marginRight: "5px" }}
              >
                Modificar
              </Button>
              <Button
                variant="outlined"
                color="error"
                size="small"
                 disabled={detalleOrden.estado !== "PENDIENTE"}
                onClick={() => handleEliminar(articulo.idOCarticulo)}
              >
                Eliminar
              </Button>
            </div>
          </li>
        ))}
      </ul>

      <p><strong>Estado:</strong> {detalleOrden.estado}</p>
      <p><strong>Total:</strong> ${total?.toFixed(2)}</p>
    </div>
  );
}
