import {
  Dialog,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Paper,
  IconButton,
  Box,
} from "@mui/material";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import type { ArticuloList } from "../../types/domain/articulo/ArticuloList";
import type { ArticuloProveedor } from "../../types/domain/articulo/Articulo";
import { useArticulo } from "../../hooks/useArticulo";
import { Add, Close } from "@mui/icons-material";

interface ProveedorArticuloPopupTableProps {
  onAddArticulo: (
    articuloProveedor: ArticuloProveedor & { articulo: ArticuloList }
  ) => void;
  selectedArticulos: (ArticuloProveedor & { articulo: ArticuloList })[];
  open: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

interface ArticuloFormData {
  cargoPedido: number;
  costoCompra: number;
  costoPedido: number;
  demoraEntrega: number;
  precioUnitario: number;
}

export default function ProveedorArticuloPopupTable({
  onAddArticulo,
  selectedArticulos,
  open,
  setIsOpen,
}: ProveedorArticuloPopupTableProps) {
  const [articulos, setArticulos] = useState<ArticuloList[]>([]);
  const [articuloForms, setArticuloForms] = useState<
    Record<number, ArticuloFormData>
  >({});
  const { getArticulosShort, isLoading } = useArticulo();

  useEffect(() => {
    if (open) {
      loadArticulos();
    }
  }, [open]);

  const loadArticulos = async () => {
    try {
      const response = await getArticulosShort();
      // Filter out articles that are already selected
      const availableArticulos = response.filter(
        (articulo) =>
          !selectedArticulos.some(
            (selected) => selected.articulo.id === articulo.id
          )
      );
      setArticulos(availableArticulos);
    } catch (error) {
      console.error("Error loading articles:", error);
    }
  };

  const handleFormChange = (
    articuloId: number,
    field: keyof ArticuloFormData,
    value: string
  ) => {
    const numValue = parseFloat(value) || 0;
    setArticuloForms((prev) => ({
      ...prev,
      [articuloId]: {
        ...prev[articuloId],
        [field]: numValue,
      },
    }));
  };

  const getFormData = (articuloId: number): ArticuloFormData => {
    return (
      articuloForms[articuloId] || {
        cargoPedido: 0,
        costoCompra: 0,
        costoPedido: 0,
        demoraEntrega: 0,
        precioUnitario: 0,
      }
    );
  };

  const handleAddArticulo = (articulo: ArticuloList) => {
    const formData = getFormData(articulo.id);

    // Validate required fields
    if (!formData.costoCompra || !formData.precioUnitario) {
      alert("Por favor complete al menos el costo de compra y precio unitario");
      return;
    }

    const articuloProveedor: ArticuloProveedor & { articulo: ArticuloList } = {
      cargoPedido: formData.cargoPedido,
      costoCompra: formData.costoCompra,
      costoPedido: formData.costoPedido,
      demoraEntrega: formData.demoraEntrega,
      precioUnitario: formData.precioUnitario,
      proveedor: {
        proveedorId: 0, // This will be set by parent component
        proveedorCod: 0,
        proveedorNombre: "",
        proveedorTelefono: "",
      },
      articulo: articulo,
    };

    onAddArticulo(articuloProveedor);

    // Reset form for this article
    setArticuloForms((prev) => ({
      ...prev,
      [articulo.id]: {
        cargoPedido: 0,
        costoCompra: 0,
        costoPedido: 0,
        demoraEntrega: 0,
        precioUnitario: 0,
      },
    }));

    // Remove from available articles
    setArticulos((prev) => prev.filter((a) => a.id !== articulo.id));
  };

  const handleClose = () => {
    setIsOpen(false);
    setArticuloForms({});
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xl" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          Agregar Artículos al Proveedor
          <IconButton onClick={handleClose}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Código</TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell>Stock</TableCell>
                <TableCell>Cargo Pedido</TableCell>
                <TableCell>Costo Compra*</TableCell>
                <TableCell>Costo Pedido</TableCell>
                <TableCell>Demora Entrega (días)</TableCell>
                <TableCell>Precio Unitario*</TableCell>
                <TableCell>Acción</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={9} align="center">
                    Cargando artículos...
                  </TableCell>
                </TableRow>
              ) : articulos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} align="center">
                    No hay artículos disponibles
                  </TableCell>
                </TableRow>
              ) : (
                articulos.map((articulo) => {
                  const formData = getFormData(articulo.id);
                  return (
                    <TableRow key={articulo.id}>
                      <TableCell>{articulo.id}</TableCell>
                      <TableCell>{articulo.nombre}</TableCell>
                      <TableCell>{articulo.stock}</TableCell>
                      <TableCell>
                        <TextField
                          type="number"
                          size="small"
                          value={formData.cargoPedido || ""}
                          onChange={(e) =>
                            handleFormChange(
                              articulo.id,
                              "cargoPedido",
                              e.target.value
                            )
                          }
                          inputProps={{ min: 0, step: "0.01" }}
                          placeholder="0.00"
                          sx={{ width: 100 }}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          type="number"
                          size="small"
                          value={formData.costoCompra || ""}
                          onChange={(e) =>
                            handleFormChange(
                              articulo.id,
                              "costoCompra",
                              e.target.value
                            )
                          }
                          inputProps={{ min: 0, step: "0.01" }}
                          placeholder="0.00"
                          sx={{ width: 100 }}
                          required
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          type="number"
                          size="small"
                          value={formData.costoPedido || ""}
                          onChange={(e) =>
                            handleFormChange(
                              articulo.id,
                              "costoPedido",
                              e.target.value
                            )
                          }
                          inputProps={{ min: 0, step: "0.01" }}
                          placeholder="0.00"
                          sx={{ width: 100 }}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          type="number"
                          size="small"
                          value={formData.demoraEntrega || ""}
                          onChange={(e) =>
                            handleFormChange(
                              articulo.id,
                              "demoraEntrega",
                              e.target.value
                            )
                          }
                          inputProps={{ min: 0 }}
                          placeholder="0"
                          sx={{ width: 80 }}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          type="number"
                          size="small"
                          value={formData.precioUnitario || ""}
                          onChange={(e) =>
                            handleFormChange(
                              articulo.id,
                              "precioUnitario",
                              e.target.value
                            )
                          }
                          inputProps={{ min: 0, step: "0.01" }}
                          placeholder="0.00"
                          sx={{ width: 100 }}
                          required
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton
                          color="primary"
                          onClick={() => handleAddArticulo(articulo)}
                          disabled={
                            !formData.costoCompra || !formData.precioUnitario
                          }
                        >
                          <Add />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <Box mt={2}>
          <small>* Campos requeridos</small>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
