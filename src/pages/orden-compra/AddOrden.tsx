import { useState, useEffect } from "react";
import {
  Button,
  TextField,
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
import { useNavigate } from "react-router-dom";
import { DTOArticuloGrupoProveedor } from "../../types/domain/articulo/DTOArticuloGrupoProveedor";
import { DTOArticuloProveedorListado } from "../../types/domain/articulo/DTOArticuloProveedorListado";
import { useArticulo } from "../../hooks/useArticulo";

export function AddOrden() {
  const navigate = useNavigate();
  const { listarArticulosPorProveedor, isLoading, error } = useArticulo();

  const [proveedores, setProveedores] = useState<DTOArticuloGrupoProveedor[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await listarArticulosPorProveedor();
        setProveedores(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const handleAddArticulo = (
    article: DTOArticuloProveedorListado,
    proveedorid: number,
    proveedornombre: string
  ) => {
    console.log("Creando nueva orden con artículo:", article);
    navigate(`/orden-compra/nueva`, {
      state: {
        newOrder: true,
        primerarticulo: article,
        proveedorid,
        proveedornombre,
      },
    });
  };

  const proveedoresFiltrados = proveedores
    .map((proveedor) => ({
      ...proveedor,
      articulos: proveedor.articulos.filter((articulo) =>
        articulo.nombreArticulo.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    }))
    .filter((prov) => prov.articulos.length > 0);

  if (isLoading) return <CircularProgress />;
  if (error) return <p className="text-red-600">Error: {error.message}</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto bg-white shadow rounded p-4">
        <div className="flex items-center justify-between mb-4">
          <Button variant="outlined" startIcon={<ArrowBack />} onClick={() => navigate("/")}>
            Volver
          </Button>
          <Typography variant="h5" className="font-semibold text-gray-800">
            Artículos agrupados por Proveedor
          </Typography>
        </div>

        <div>
          <h1 className="text-2xl font-bold text-gray-900">Seleccionar Artículo</h1>
          <p className="text-gray-600 mt-1">
            Elige un artículo para crear una nueva orden de compra
          </p>
        </div>

        <div className="mb-4">
          <TextField
            fullWidth
            placeholder="Buscar por nombre del artículo..."
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {proveedoresFiltrados.length === 0 ? (
          <Typography className="text-center text-gray-500 py-8">
            No se encontraron artículos que coincidan con la búsqueda.
          </Typography>
        ) : (
          proveedoresFiltrados.map((proveedor) => (
            <div key={proveedor.proveedorId} className="mb-8">
              <Typography variant="h6" className="text-gray-700 mb-2">
                Proveedor: {proveedor.proveedorNombre}
              </Typography>

              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell><strong>Nombre del Artículo</strong></TableCell>
                      <TableCell><strong>Precio Proveedor</strong></TableCell>
                      <TableCell><strong>Predeterminado</strong></TableCell>
                      <TableCell><strong>Acción</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {proveedor.articulos.map((articulo) => (
                      <TableRow key={articulo.idArticulo} className="hover:bg-gray-50">
                        <TableCell>{articulo.nombreArticulo}</TableCell>
                        <TableCell>${articulo.precioProveedor.toFixed(2)}</TableCell>
                        <TableCell>
                          {articulo.esProveedorPredeterminado ? "Sí" : "No"}
                        </TableCell>
                        <TableCell>
                          <Button
                            onClick={() =>
                              handleAddArticulo(
                                articulo,
                                proveedor.proveedorId,
                                proveedor.proveedorNombre
                              )
                            }
                            size="small"
                          >
                            Agregar
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
