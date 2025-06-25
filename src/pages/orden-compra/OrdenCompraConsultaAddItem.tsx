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
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { DTOArticuloProveedorListado } from "../../types/domain/articulo/DTOArticuloProveedorListado";
import { DTOOrdenCompraObtenerDetalle } from "../../types/domain/orden-compra/DTOOrdenCompraObtenerDetalle";
//import { useArticulo } from "../../hooks/useArticulo";
// Mock en lugar de useArticulo
const MOCK_ARTICULOS: DTOArticuloProveedorListado[] = [
  {
    idArticulo: 1,
    nombreArticulo: "Tornillo Philips",
    precioProveedor: 45.5,
    loteOptimo: 10,
    esProveedorPredeterminado: true,
  },
  {
    idArticulo: 102,
    nombreArticulo: "Arandela Metálica",
    precioProveedor: 12.75,
    loteOptimo: 20,
    esProveedorPredeterminado: false,
  },
  {
    idArticulo: 103,
    nombreArticulo: "Tuerca Hexagonal",
    precioProveedor: 18.9,
    loteOptimo: 15,
    esProveedorPredeterminado: true,
  },
];

export function OrdenCompraConsultaAddItem() {
  const location = useLocation();
  const navigate = useNavigate();
  //const { listarArticulosPorProveedorId } = useArticulo();

  const [articulosDisponibles, setArticulosDisponibles] = useState<DTOArticuloProveedorListado[]>([]);
  const [isLoading, setIsLoading] = useState(true);



const state = location.state as { orden: DTOOrdenCompraObtenerDetalle };
const orden = state.orden;




  useEffect(() => {
   // const fetchArticulos = async () => {
    console.log("Valores recibidos en location.state:", state);
       const {  orden } = state;

     if (!orden) {
    navigate(`/orden-compra`);
    return;
  }


//     try {
//   const articulos = await listarArticulosPorProveedorId(proveedorid);

//   const idsAgregados = orden.detalleArticulos?.map(a => a.idarticulo) ?? [];

//   const filtrados = articulos.filter(
//     (art) => !idsAgregados.includes(art.idArticulo)
//   );

//   setArticulosDisponibles(filtrados);
// } catch (err) {
//   console.error("Error al traer artículos del proveedor:", err);
// } finally {
//   setIsLoading(false);
// }


    setTimeout(() => {
    const idsAgregados = orden.detalleArticulos?.map(a => a.idarticulo) ?? [];

    const articulosFiltrados = MOCK_ARTICULOS.filter(
      art => !idsAgregados.includes(art.idArticulo)
    );

    setArticulosDisponibles(articulosFiltrados);
    setIsLoading(false);
  }, 500);
  }, [state, navigate]);


  const handleAddArticle = (articulo: DTOArticuloProveedorListado) => {
  const nuevoDetalle: DTOOrdenCompraArticuloAlta = {
    cantidad: 1, // o el valor que quieras pedir al usuario
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
                  Seleccionar Artículo para Orden #{}
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
