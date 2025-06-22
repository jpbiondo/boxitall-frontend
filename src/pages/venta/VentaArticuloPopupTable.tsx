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
} from "@mui/material";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import type { ArticuloList } from "../../types/domain/articulo/ArticuloList";
import type { VentaDetalle } from "../../types/domain/venta/Venta";
import { useArticulo } from "../../hooks/useArticulo";
import { Add } from "@mui/icons-material";

interface VentaArticuloPopupTableProps {
  onAddArticulo: (ventaDetalle: VentaDetalle) => void;
  selectedArticulos: VentaDetalle[];
  open: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export default function VentaArticuloPopupTable({
  onAddArticulo,
  selectedArticulos,
  open,
  setIsOpen,
}: VentaArticuloPopupTableProps) {
  const [articulos, setArticulos] = useState<ArticuloList[]>([]);
  const [quantities, setQuantities] = useState<Record<number, number>>({});
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

  const handleQuantityChange = (articuloId: number, quantity: string) => {
    const numQuantity = parseInt(quantity) || 0;
    setQuantities((prev) => ({
      ...prev,
      [articuloId]: numQuantity,
    }));
  };

  const handleAddArticulo = (articulo: ArticuloList) => {
    const quantity = quantities[articulo.id] || 1;

    if (quantity <= 0) {
      alert("La cantidad debe ser mayor a 0");
      return;
    }

    if (quantity > articulo.stock) {
      alert(`No hay suficiente stock. Stock disponible: ${articulo.stock}`);
      return;
    }

    const ventaDetalle: VentaDetalle = {
      ventaDetalleRenglon: selectedArticulos.length + 1,
      ventaDetalleCantidad: quantity,
      articulo: {
        id: articulo.id,
        nombre: articulo.nombre,
        descripcion: "",
        costoAlmacenamiento: 0,
        demanda: 0,
        desviacionEstandar: 0,
        nivelServicio: 0,
        stock: articulo.stock,
        proveedorPredeterminadoId:
          parseInt(articulo.proveedorPredeterminadoId) || null,
        proveedorPredeterminadoNombre: articulo.proveedorPredeterminadoNombre,
        proveedores: [],
        modeloInventario: {} as any,
        restanteProximoPedido: parseInt(articulo.restanteProximoPedido) || 0,
      },
    };

    onAddArticulo(ventaDetalle);

    // Reset quantity for this article
    setQuantities((prev) => ({
      ...prev,
      [articulo.id]: 0,
    }));

    handleClose();
  };

  const handleClose = () => {
    setIsOpen(false);
    setQuantities({});
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
      <DialogTitle>Seleccionar Artículos</DialogTitle>
      <DialogContent>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Código</TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell>Stock</TableCell>
                <TableCell>Cantidad</TableCell>
                <TableCell>Acción</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    Cargando artículos...
                  </TableCell>
                </TableRow>
              ) : articulos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No hay artículos disponibles
                  </TableCell>
                </TableRow>
              ) : (
                articulos.map((articulo) => (
                  <TableRow key={articulo.id}>
                    <TableCell>{articulo.id}</TableCell>
                    <TableCell>{articulo.nombre}</TableCell>
                    <TableCell>{articulo.stock}</TableCell>
                    <TableCell>
                      <TextField
                        type="number"
                        size="small"
                        value={quantities[articulo.id] || ""}
                        onChange={(e) =>
                          handleQuantityChange(articulo.id, e.target.value)
                        }
                        inputProps={{ min: 1, max: articulo.stock }}
                        placeholder="1"
                        sx={{ width: 80 }}
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton
                        color="primary"
                        onClick={() => handleAddArticulo(articulo)}
                        disabled={
                          !quantities[articulo.id] ||
                          quantities[articulo.id] <= 0
                        }
                      >
                        <Add />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
    </Dialog>
  );
}
