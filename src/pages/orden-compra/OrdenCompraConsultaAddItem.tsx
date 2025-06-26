import { useState, useEffect } from "react";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import { DTOArticuloProveedorListado } from "../../types/domain/articulo/DTOArticuloProveedorListado";
import { DTOOrdenCompraObtenerDetalle } from "../../types/domain/orden-compra/DTOOrdenCompraObtenerDetalle";
import { DTOOrdenCompraArticuloAlta } from "../../types/domain/orden-compra/DTOOrdenCompraArticuloAlta"; 
import { useArticulo } from "../../hooks/useArticulo";

export function OrdenCompraConsultaAddItem() {
  const location = useLocation();
  const navigate = useNavigate();
  const { listarArticulosPorProveedorId } = useArticulo();

  const state = location.state as { orden: DTOOrdenCompraObtenerDetalle };
  const orden = state?.orden;

  const [articulosDisponibles, setArticulosDisponibles] = useState<DTOArticuloProveedorListado[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!orden) {
      navigate(`/orden-compra`);
      return;
    }

    const fetchArticulos = async () => {
      try {
        console.log("orden recibida:", orden);
        const articulos = await listarArticulosPorProveedorId(orden.idProveedor); 
        const idsAgregados = orden.detalleArticulos?.map((a) => a.idarticulo) ?? [];

        const filtrados = articulos.filter(
          (art) => !idsAgregados.includes(art.idArticulo)
        );

        setArticulosDisponibles(filtrados);
      } catch (err) {
        console.error("Error al traer artículos del proveedor:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticulos();
  }, [orden, listarArticulosPorProveedorId, navigate]);

  const handleAddArticle = (articulo: DTOArticuloProveedorListado) => {
    const nuevoDetalle: DTOOrdenCompraArticuloAlta = {
      cantidad: 1, 
      IDarticulo: articulo.idArticulo,
    };

    navigate(`/orden-compra/${orden.idordenCompra}/detalle`, {
      state: {
        articuloParaAgregar: nuevoDetalle,
      },
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-4">
              <Button
                variant="outlined"
                onClick={() => navigate(`/orden-compra/${orden.idordenCompra}/detalle`)}
                startIcon={<ArrowBack />}
              >
                Volver
              </Button>
              <div>
                <Typography variant="h5" fontWeight="bold">
                  Seleccionar Artículo para Orden #{orden.idordenCompra}
                </Typography>
                <Typography color="textSecondary">
                  Proveedor: {orden.nombreproveedor}
                </Typography>
              </div>
            </div>
          </div>

          <div className="p-6">
            {isLoading ? (
              <CircularProgress />
            ) : articulosDisponibles.length === 0 ? (
              <div className="text-center py-8">
                <Typography>No hay más artículos disponibles para este proveedor.</Typography>
              </div>
            ) : (
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Nombre del Artículo</TableCell>
                      <TableCell>Precio Proveedor</TableCell>
                      <TableCell>Predeterminado</TableCell>
                      <TableCell>Acciones</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {articulosDisponibles.map((article) => (
                      <TableRow key={article.idArticulo}>
                        <TableCell>{article.nombreArticulo}</TableCell>
                        <TableCell>${article.precioProveedor.toFixed(2)}</TableCell>
                        <TableCell>{article.esProveedorPredeterminado ? "Sí" : "No"}</TableCell>
                        <TableCell>
                          <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            onClick={() => handleAddArticle(article)}
                          >
                            Agregar
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
